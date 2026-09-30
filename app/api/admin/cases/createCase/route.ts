import { NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';
import { getCurrentUser } from '@/lib/supabase/auth';
import type { TablesInsert } from '@/lib/database.types'; // adjust to where your generated types live

// ---- Request payload types ----

const STAGES = ['dev', 'active', 'inactive'] as const;
type Stage = (typeof STAGES)[number];

const isStage = (value: unknown): value is Stage =>
  typeof value === 'string' && (STAGES as readonly string[]).includes(value);

type CharacterPayload = {
  id: string;
  first_name: string;
  last_name?: string | null;
  description?: string | null;
  relationship?: string | null;
  image_url?: string | null;
  is_victim: boolean;
  is_guilty: boolean;
};

type CluePayload = {
  id: string;
  clue_type_id: number;
  title: string;
  content?: string | null;
  image_url?: string | null;
  is_key: boolean;
  clue_requirements?: { required_clue_id: string }[];
  clue_characters?: { character_id: string }[];
};

type CreateCaseBody = {
  title: string;
  description?: string | null;
  image_url?: string | null;
  location?: string | null;
  story_date?: string | null;
  difficulty_id: number;
  price?: number;
  stage?: Stage;
  characters?: CharacterPayload[];
  case_clues?: CluePayload[];
};

const badRequest = (error: string) => NextResponse.json({ error }, { status: 400 });

export async function POST(request: Request) {
  try {
    const body = (await request.json()) as Partial<CreateCaseBody>;

    const title = body.title?.trim() ?? '';
    const description = body.description ?? null;
    const image_url = body.image_url || null;
    const location = body.location || null;
    const story_date = body.story_date || null; // '' would fail on a date column
    const difficulty_id = body.difficulty_id;
    const price = body.price ?? 0;
    const stage: Stage = body.stage ?? 'dev';
    const characters = body.characters ?? [];
    const caseClues = body.case_clues ?? [];

    // ---- Validation ----
    if (!title) return badRequest('Titel krävs');
    if (typeof difficulty_id !== 'number') return badRequest('Svårighetsgrad krävs');
    if (!isStage(stage)) return badRequest('Ogiltigt stage');
    if (!Number.isInteger(price) || price < 0) {
      return badRequest('Pris måste vara ett heltal som är 0 eller mer');
    }
    if (characters.some((c) => !c.first_name?.trim())) {
      return badRequest('Alla karaktärer måste ha förnamn');
    }
    if (caseClues.some((c) => !c.title?.trim())) {
      return badRequest('Alla bevis måste ha titel');
    }
    if (characters.some((c) => c.is_guilty && c.is_victim)) {
      return badRequest('En karaktär kan inte vara både offer och skyldig');
    }

    const guiltyCount = characters.filter((c) => c.is_guilty).length;
    const victimCount = characters.filter((c) => c.is_victim).length;
    if (guiltyCount > 1 || victimCount > 1) {
      return badRequest('Max en skyldig och ett offer per fall');
    }
    if (stage === 'active' && (guiltyCount !== 1 || victimCount !== 1)) {
      return badRequest('Ett aktivt fall kräver exakt en skyldig och ett offer');
    }

    // Every reference must point at something in this payload
    const clueIds = new Set(caseClues.map((c) => c.id));
    const characterIds = new Set(characters.map((c) => c.id));

    for (const clue of caseClues) {
      for (const req of clue.clue_requirements ?? []) {
        if (req.required_clue_id === clue.id) {
          return badRequest('Ett bevis kan inte kräva sig självt');
        }
        if (!clueIds.has(req.required_clue_id)) {
          return badRequest('Ett krav pekar på ett bevis som inte finns');
        }
      }
      for (const link of clue.clue_characters ?? []) {
        if (!characterIds.has(link.character_id)) {
          return badRequest('Ett bevis pekar på en karaktär som inte finns');
        }
      }
    }

    // ---- Auth: admin only ----
    const user = await getCurrentUser();
    if (!user) {
      return NextResponse.json({ error: 'No user found' }, { status: 401 });
    }

    const supabase = await createClient();
    if (!supabase) {
      return NextResponse.json({ error: 'Failed to initialize Supabase client' }, { status: 500 });
    }

    const { data: profile, error: profileError } = await supabase
      .from('profiles')
      .select('role')
      .eq('id', user.sub)
      .single();

    if (profileError) {
      return NextResponse.json({ error: profileError.message }, { status: 404 });
    }
    if (profile.role !== 'admin') {
      return NextResponse.json({ error: 'profile is not admin' }, { status: 403 });
    }

    // ---- Duplicate title check ----
    const { data: existing, error: existingError } = await supabase
      .from('cases')
      .select('id')
      .eq('title', title)
      .maybeSingle();

    if (existingError) {
      return NextResponse.json({ error: existingError.message }, { status: 500 });
    }
    if (existing) {
      return NextResponse.json({ error: 'case with this title already exist' }, { status: 409 });
    }

    // ---- 1. Case ----
    const caseRow: TablesInsert<'cases'> = {
      title,
      description,
      image_url,
      location,
      story_date,
      difficulty_id,
      price,
      stage,
    };

    const { data: newCase, error: caseError } = await supabase
      .from('cases')
      .insert(caseRow)
      .select('id')
      .single();

    if (caseError || !newCase) {
      return NextResponse.json({ error: caseError?.message ?? 'Insert failed' }, { status: 500 });
    }
    const caseId = newCase.id;

    // characters, case_clues, clue_requirements and clue_characters all
    // cascade from cases, so deleting the case removes everything.
    const failAndRollback = async (message: string) => {
      await supabase.from('cases').delete().eq('id', caseId);
      return NextResponse.json({ error: message }, { status: 500 });
    };

    // ---- 2. Characters ----
    if (characters.length > 0) {
      const characterRows: TablesInsert<'characters'>[] = characters.map((c) => ({
        id: c.id,
        case_id: caseId,
        first_name: c.first_name.trim(),
        last_name: c.last_name || null,
        description: c.description || null,
        relationship: c.is_victim ? null : c.relationship || null,
        image_url: c.image_url || null,
        is_victim: c.is_victim,
        is_guilty: c.is_guilty,
      }));

      const { error } = await supabase.from('characters').insert(characterRows);
      if (error) return failAndRollback(error.message);
    }

    // ---- 3. Clues ----
    if (caseClues.length > 0) {
      const clueRows: TablesInsert<'case_clues'>[] = caseClues.map((c) => ({
        id: c.id,
        case_id: caseId,
        clue_type_id: c.clue_type_id,
        title: c.title.trim(),
        content: c.content || null,
        image_url: c.image_url || null,
        is_key: c.is_key,
      }));

      const { error: clueError } = await supabase.from('case_clues').insert(clueRows);
      if (clueError) return failAndRollback(clueError.message);

      // ---- 4. Clue requirements (all clues exist now) ----
      const requirementRows: TablesInsert<'clue_requirements'>[] = caseClues.flatMap((c) =>
        (c.clue_requirements ?? []).map((r) => ({
          clue_id: c.id,
          required_clue_id: r.required_clue_id,
        }))
      );

      if (requirementRows.length > 0) {
        const { error } = await supabase.from('clue_requirements').insert(requirementRows);
        if (error) return failAndRollback(error.message);
      }

      // ---- 5. Clue <-> character links (both sides exist now) ----
      const clueCharacterRows: TablesInsert<'clue_characters'>[] = caseClues.flatMap((c) =>
        (c.clue_characters ?? []).map((link) => ({
          clue_id: c.id,
          character_id: link.character_id,
        }))
      );

      if (clueCharacterRows.length > 0) {
        const { error } = await supabase.from('clue_characters').insert(clueCharacterRows);
        if (error) return failAndRollback(error.message);
      }
    }

    return NextResponse.json({ success: true, id: caseId });
  } catch (error) {
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'Internal server error' },
      { status: 500 }
    );
  }
}
