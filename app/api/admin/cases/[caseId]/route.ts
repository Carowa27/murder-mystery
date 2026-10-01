import { NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';
import { ICaseObject } from '@/lib/interfaces/adminRelated';
import { getCurrentUser } from '@/lib/supabase/auth';
import type { TablesInsert } from '@/lib/database.types';

export async function GET(request: Request, { params }: { params: Promise<{ caseId: string }> }) {
  const { caseId } = await params;
  try {
    const supabase = await createClient();

    if (!supabase) {
      return NextResponse.json({ error: 'Failed to initialize Supabase client' }, { status: 500 });
    }

    const { data, error } = await supabase
      .from('cases')
      .select(
        `
        *,
        difficulties(*),
        characters(*),
        case_clues(
          *,
          clue_types(*),
          clue_requirements!clue_requirements_clue_id_fkey(required_clue_id),
          clue_characters(character_id)
        )
      `
      )
      .eq('id', caseId)
      .single();

    if (error || !data) {
      return NextResponse.json(
        { error: 'Case not found, error msg:' + error?.message },
        { status: 404 }
      );
    }
    const { data: difficulties, error: diffError } = await supabase.from('difficulties').select(
      `
        *
        
      `
    );

    if (diffError || !difficulties) {
      return NextResponse.json(
        { error: 'Case not found, error msg:' + diffError?.message },
        { status: 404 }
      );
    }
    const { data: clueTypes } = await supabase.from('clue_types').select('id, name').order('id');

    return NextResponse.json({ data: data, difficulties, clueTypes: clueTypes ?? [] });
  } catch (error) {
    return NextResponse.json(
      {
        error: error instanceof Error ? error.message : 'Internal server error',
      },
      { status: 500 }
    );
  }
}

// export async function PATCH(request: Request, { params }: { params: Promise<{ caseId: string }> }) {
//   const { caseId } = await params;
//   const supabase = await createClient();

//   const body: ICaseObject = await request.json();

//   /*
//    * CASE
//    */
//   const { error: caseError } = await supabase
//     .from('cases')
//     .update({
//       title: body.title,
//       description: body.description,
//       image_url: body.image_url,
//       location: body.location,
//       price: body.price,
//       stage: body.stage,
//       story_date: body.story_date,
//       difficulty_id: body.difficulty_id,
//     })
//     .eq('id', caseId);

//   if (caseError) {
//     return NextResponse.json(
//       {
//         error: caseError.message,
//       },
//       {
//         status: 500,
//       }
//     );
//   }

//   /*
//    * CLUES
//    */
//   for (const clue of body.case_clues) {
//     const { error: clueError } = await supabase
//       .from('case_clues')
//       .update({
//         title: clue.title,
//         content: clue.content,
//         image_url: clue.image_url,
//         is_key: clue.is_key,
//         clue_type_id: clue.clue_type_id,
//       })
//       .eq('id', clue.id)
//       .eq('case_id', caseId);

//     if (clueError) {
//       return NextResponse.json(
//         {
//           error: clueError.message,
//         },
//         {
//           status: 500,
//         }
//       );
//     }

//     /*
//      * Remove old requirements for this clue
//      */
//     const { error: deleteRequirementError } = await supabase
//       .from('clue_requirements')
//       .delete()
//       .eq('clue_id', clue.id);

//     if (deleteRequirementError) {
//       return NextResponse.json(
//         {
//           error: deleteRequirementError.message,
//         },
//         {
//           status: 500,
//         }
//       );
//     }

//     /*
//      * Add the currently selected requirements
//      */
//     if (clue.clue_requirements.length > 0) {
//       const requirements = clue.clue_requirements.map((requirement) => ({
//         clue_id: clue.id,
//         required_clue_id: requirement.required_clue_id,
//       }));

//       const { error: requirementError } = await supabase
//         .from('clue_requirements')
//         .insert(requirements);

//       if (requirementError) {
//         return NextResponse.json(
//           {
//             error: requirementError.message,
//           },
//           {
//             status: 500,
//           }
//         );
//       }
//     }
//   }

//   /*
//    * CHARACTERS
//    */
//   for (const character of body.characters) {
//     const { error: characterError } = await supabase
//       .from('characters')
//       .update({
//         first_name: character.first_name,
//         last_name: character.last_name,
//         description: character.description,
//         relationship: character.relationship,
//         image_url: character.image_url,
//         is_victim: character.is_victim,
//         is_guilty: character.is_guilty,
//       })
//       .eq('id', character.id)
//       .eq('case_id', caseId);

//     if (characterError) {
//       return NextResponse.json(
//         {
//           error: characterError.message,
//         },
//         {
//           status: 500,
//         }
//       );
//     }
//   }

//   return NextResponse.json({
//     success: true,
//   });
// }

const STAGES = ['dev', 'active', 'inactive'] as const;
type Stage = (typeof STAGES)[number];

const isStage = (value: unknown): value is Stage =>
  typeof value === 'string' && (STAGES as readonly string[]).includes(value);

const fail = (error: string, status = 500) => NextResponse.json({ error }, { status });

export async function PATCH(request: Request, { params }: { params: Promise<{ caseId: string }> }) {
  try {
    const { caseId } = await params;
    const body = (await request.json()) as ICaseObject;

    const title = body.title?.trim() ?? '';
    const characters = body.characters ?? [];
    const caseClues = body.case_clues ?? [];

    // ---- Validation ----
    if (!title) return fail('Titel krävs', 400);
    if (!isStage(body.stage)) return fail('Ogiltigt stage', 400);
    if (!Number.isInteger(body.price) || body.price < 0) {
      return fail('Pris måste vara ett heltal som är 0 eller mer', 400);
    }
    if (characters.some((c) => !c.first_name?.trim())) {
      return fail('Alla karaktärer måste ha förnamn', 400);
    }
    if (caseClues.some((c) => !c.title?.trim())) {
      return fail('Alla bevis måste ha titel', 400);
    }
    if (characters.some((c) => c.is_guilty && c.is_victim)) {
      return fail('En karaktär kan inte vara både offer och skyldig', 400);
    }

    const guiltyCount = characters.filter((c) => c.is_guilty).length;
    const victimCount = characters.filter((c) => c.is_victim).length;
    if (guiltyCount > 1 || victimCount > 1) {
      return fail('Max en skyldig och ett offer per fall', 400);
    }
    if (body.stage === 'active' && (guiltyCount !== 1 || victimCount !== 1)) {
      return fail('Ett aktivt fall kräver exakt en skyldig och ett offer', 400);
    }

    const clueIds = caseClues.map((c) => c.id);
    const characterIds = characters.map((c) => c.id);
    const clueIdSet = new Set(clueIds);
    const characterIdSet = new Set(characterIds);

    for (const clue of caseClues) {
      for (const req of clue.clue_requirements ?? []) {
        if (req.required_clue_id === clue.id)
          return fail('Ett bevis kan inte kräva sig självt', 400);
        if (!clueIdSet.has(req.required_clue_id)) {
          return fail('Ett krav pekar på ett bevis som inte finns', 400);
        }
      }
      for (const link of clue.clue_characters ?? []) {
        if (!characterIdSet.has(link.character_id)) {
          return fail('Ett bevis pekar på en karaktär som inte finns', 400);
        }
      }
    }

    // ---- Auth: admin only ----
    const user = await getCurrentUser();
    if (!user) return fail('No user found', 401);

    const supabase = await createClient();
    if (!supabase) return fail('Failed to initialize Supabase client');

    const { data: profile, error: profileError } = await supabase
      .from('profiles')
      .select('role')
      .eq('id', user.sub)
      .single();

    if (profileError) return fail(profileError.message, 404);
    if (profile.role !== 'admin') return fail('profile is not admin', 403);

    // ---- Guards ----
    const { data: sameTitle, error: titleError } = await supabase
      .from('cases')
      .select('id')
      .eq('title', title)
      .neq('id', caseId)
      .maybeSingle();

    if (titleError) return fail(titleError.message);
    if (sameTitle) return fail('case with this title already exist', 409);

    // Upsert matches on id only, so make sure no id belongs to another case
    if (clueIds.length > 0) {
      const { data: foreign, error } = await supabase
        .from('case_clues')
        .select('id')
        .in('id', clueIds)
        .neq('case_id', caseId);
      if (error) return fail(error.message);
      if (foreign.length > 0) return fail('Ett bevis tillhör ett annat fall', 400);
    }
    if (characterIds.length > 0) {
      const { data: foreign, error } = await supabase
        .from('characters')
        .select('id')
        .in('id', characterIds)
        .neq('case_id', caseId);
      if (error) return fail(error.message);
      if (foreign.length > 0) return fail('En karaktär tillhör ett annat fall', 400);
    }

    // ---- 1. Case ----
    const { error: caseError } = await supabase
      .from('cases')
      .update({
        title,
        description: body.description || null,
        image_url: body.image_url || null,
        location: body.location || null,
        story_date: body.story_date || null,
        price: body.price,
        stage: body.stage,
        difficulty_id: body.difficulty_id,
      })
      .eq('id', caseId);

    if (caseError) return fail(caseError.message);

    // ---- 2. Delete clues and characters that were removed in the form ----
    // Clue deletes cascade to clue_requirements and clue_characters,
    // character deletes cascade to clue_characters.
    const deleteClues = supabase.from('case_clues').delete().eq('case_id', caseId);
    const { error: deleteCluesError } =
      clueIds.length > 0
        ? await deleteClues.not('id', 'in', `(${clueIds.join(',')})`)
        : await deleteClues;
    if (deleteCluesError) return fail(deleteCluesError.message);

    const deleteCharacters = supabase.from('characters').delete().eq('case_id', caseId);
    const { error: deleteCharactersError } =
      characterIds.length > 0
        ? await deleteCharacters.not('id', 'in', `(${characterIds.join(',')})`)
        : await deleteCharacters;
    if (deleteCharactersError) return fail(deleteCharactersError.message);

    // ---- 3. Characters ----
    // Clear the roles first, so moving "guilty" or "victim" to another
    // character can't hit the unique index in the middle of the upsert.
    const { error: clearRolesError } = await supabase
      .from('characters')
      .update({ is_guilty: false, is_victim: false })
      .eq('case_id', caseId);
    if (clearRolesError) return fail(clearRolesError.message);

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

      const { error } = await supabase
        .from('characters')
        .upsert(characterRows, { onConflict: 'id' });
      if (error) return fail(error.message);
    }

    // ---- 4. Clues ----
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

      const { error } = await supabase.from('case_clues').upsert(clueRows, { onConflict: 'id' });
      if (error) return fail(error.message);

      // ---- 5. Requirements: replace all (every clue exists now) ----
      const { error: clearReqError } = await supabase
        .from('clue_requirements')
        .delete()
        .in('clue_id', clueIds);
      if (clearReqError) return fail(clearReqError.message);

      const requirementRows: TablesInsert<'clue_requirements'>[] = caseClues.flatMap((c) =>
        (c.clue_requirements ?? []).map((r) => ({
          clue_id: c.id,
          required_clue_id: r.required_clue_id,
        }))
      );

      if (requirementRows.length > 0) {
        const { error: reqError } = await supabase
          .from('clue_requirements')
          .insert(requirementRows);
        if (reqError) return fail(reqError.message);
      }

      // ---- 6. Clue <-> character links: replace all ----
      const { error: clearLinksError } = await supabase
        .from('clue_characters')
        .delete()
        .in('clue_id', clueIds);
      if (clearLinksError) return fail(clearLinksError.message);

      const linkRows: TablesInsert<'clue_characters'>[] = caseClues.flatMap((c) =>
        (c.clue_characters ?? []).map((link) => ({
          clue_id: c.id,
          character_id: link.character_id,
        }))
      );

      if (linkRows.length > 0) {
        const { error: linkError } = await supabase.from('clue_characters').insert(linkRows);
        if (linkError) return fail(linkError.message);
      }
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    return fail(error instanceof Error ? error.message : 'Internal server error');
  }
}
