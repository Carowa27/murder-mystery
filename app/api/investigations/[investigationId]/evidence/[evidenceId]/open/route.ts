import { NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';
import { getCurrentUser } from '@/lib/supabase/auth';

// Körs när någon öppnar en ledtråd. Stämplar den som öppnad och låser upp de
// ledtrådar som kräver den, om alla deras krav nu är öppnade.
export async function POST(
  request: Request,
  { params }: { params: Promise<{ investigationId: string; evidenceId: string }> }
) {
  const { investigationId, evidenceId } = await params;

  const user = await getCurrentUser();

  if (!user) {
    return NextResponse.json({ error: 'Ej inloggad' }, { status: 401 });
  }

  const supabase = await createClient();

  // Alla ledtrådar i listan. RLS visar bara raderna för den som är med i teamet.
  const { data: found, error: foundError } = await supabase
    .from('investigation_found_clues')
    .select('clue_id, opened_at')
    .eq('investigation_id', investigationId);

  if (foundError) {
    return NextResponse.json({ error: foundError.message }, { status: 500 });
  }

  const openedClue = found.find((row) => row.clue_id === evidenceId);

  // Man kan bara öppna en ledtråd som finns i listan.
  if (!openedClue) {
    return NextResponse.json({ error: 'Ledtråden är inte hittad' }, { status: 404 });
  }

  // Stämpeln sätts bara första gången.
  if (!openedClue.opened_at) {
    const { error: openError } = await supabase
      .from('investigation_found_clues')
      .update({ opened_at: new Date().toISOString() })
      .eq('investigation_id', investigationId)
      .eq('clue_id', evidenceId);

    if (openError) {
      return NextResponse.json({ error: openError.message }, { status: 500 });
    }
  }

  const foundIds = found.map((row) => row.clue_id);

  // found hämtades före stämpeln, så den öppnade läggs till för hand.
  const openedIds = found
    .filter((row) => row.opened_at || row.clue_id === evidenceId)
    .map((row) => row.clue_id);

  const { data: dependents, error: dependentsError } = await supabase
    .from('clue_requirements')
    .select('clue_id')
    .eq('required_clue_id', evidenceId);

  if (dependentsError) {
    return NextResponse.json({ error: dependentsError.message }, { status: 500 });
  }

  // Ingen ledtråd kräver den här, då finns inget att låsa upp.
  if (dependents.length === 0) {
    return NextResponse.json({ unlocked: [] });
  }

  const dependentIds = dependents.map((row) => row.clue_id);

  // Alla krav för de ledtrådarna, inte bara den som öppnades nu.
  const { data: requirements, error: requirementsError } = await supabase
    .from('clue_requirements')
    .select('clue_id, required_clue_id')
    .in('clue_id', dependentIds);

  if (requirementsError) {
    return NextResponse.json({ error: requirementsError.message }, { status: 500 });
  }

  const unlockedIds = dependentIds.filter(
    (id) =>
      !foundIds.includes(id) &&
      requirements
        .filter((requirement) => requirement.clue_id === id)
        .every((requirement) => openedIds.includes(requirement.required_clue_id))
  );

  if (unlockedIds.length > 0) {
    const { error: unlockError } = await supabase.from('investigation_found_clues').insert(
      unlockedIds.map((id) => ({
        investigation_id: investigationId,
        clue_id: id,
        found_by: user.sub,
      }))
    );

    if (unlockError) {
      return NextResponse.json({ error: unlockError.message }, { status: 500 });
    }
  }

  return NextResponse.json({ unlocked: unlockedIds });
}
