import { NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';
import { getCurrentUser } from '@/lib/supabase/auth';

export async function POST(request: Request) {
  const user = await getCurrentUser();

  if (!user) {
    return NextResponse.json({ error: 'Ej inloggad' }, { status: 401 });
  }

  const body = await request.json();

  const { team_id, case_id } = body;

  if (typeof team_id !== 'string' || typeof case_id !== 'string') {
    return NextResponse.json({ error: 'team_id och case_id krävs' }, { status: 400 });
  }

  const supabase = await createClient();

  const { data: investigation, error } = await supabase
    .from('investigations')
    .insert({ team_id, case_id })
    .select('id')
    .single();

  // 23505 betyder att en unik regel bröts, här regeln om en pågående utredning per team.
  if (error?.code === '23505') {
    return NextResponse.json({ error: 'Teamet har redan en pågående utredning' }, { status: 409 });
  }

  // 42501 betyder att RLS sa nej: du är inte med i teamet, eller ägaren saknar fallet.
  if (error?.code === '42501') {
    return NextResponse.json({ error: 'Teamet kan inte starta det här fallet' }, { status: 403 });
  }

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  // Startledtrådarna är fallets ledtrådar som inte kräver någon annan ledtråd.
  const { data: clues, error: cluesError } = await supabase
    .from('case_clues')
    .select('id')
    .eq('case_id', case_id);

  if (cluesError) {
    return NextResponse.json({ error: cluesError.message }, { status: 500 });
  }

  const clueIds = clues.map((clue) => clue.id);

  const { data: requirements, error: requirementsError } = await supabase
    .from('clue_requirements')
    .select('clue_id')
    .in('clue_id', clueIds);

  if (requirementsError) {
    return NextResponse.json({ error: requirementsError.message }, { status: 500 });
  }

  const lockedIds = requirements.map((requirement) => requirement.clue_id);

  const startClues = clueIds
    .filter((id) => !lockedIds.includes(id))
    .map((id) => ({ investigation_id: investigation.id, clue_id: id }));

  const { error: foundError } = await supabase.from('investigation_found_clues').insert(startClues);

  if (foundError) {
    return NextResponse.json({ error: foundError.message }, { status: 500 });
  }

  return NextResponse.json({ id: investigation.id }, { status: 201 });
}
