import { NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';

export async function GET(
  request: Request,
  { params }: { params: Promise<{ investigationId: string }> }
) {
  const { investigationId } = await params;
  try {
    const supabase = await createClient();

    if (!supabase) {
      return NextResponse.json({ error: 'Failed to initialize Supabase client' }, { status: 500 });
    }
    const { data: investigation } = await supabase
      .from('investigations')
      // Vi kör nu även en INNER JOIN mellan cases och difficulties för att få max_accusations
      .select(
        `id,
      case_id,
      cases!inner ( difficulty_id, difficulties!inner ( max_accusations ) )
    `
      )
      .eq('id', investigationId)
      .single();
    if (!investigation) {
      throw new Error('Investigation not found');
    }

    const maxAccusations = (investigation as any).cases.difficulties.max_accusations as number;

    // Tre concurrent Supabase queries som alla körs oberoende av varandra!
    // De blir destructured i ordning: key clues count -> found key clues count -> accusations count.
    const [
      { count: caseAmountOfKeyClues, error: caseKeyCluesError },
      { count: amountOfFoundKeyClues, error: foundKeyCluesError },
      { count: accusationsMade, error: accusationsError },
    ] = await Promise.all([
      supabase
        .from('case_clues')
        .select('*', { count: 'exact', head: true })
        .eq('case_id', investigation.case_id)
        .eq('is_key', true),
      supabase
        .from('investigation_found_clues')
        .select(
          `
          clue_id,
          case_clues!inner (
            is_key
          )
        `,
          { count: 'exact', head: true }
        )
        .eq('investigation_id', investigationId)
        .eq('case_clues.is_key', true),
      supabase
        .from('accusations')
        .select('*', { count: 'exact', head: true })
        .eq('investigation_id', investigationId),
    ]);

    const queryError = caseKeyCluesError || foundKeyCluesError || accusationsError;
    if (queryError) {
      return NextResponse.json({ error: queryError.message }, { status: 404 });
    }

    // Ny dynamisk beräkning för att få fram can_accuse:
    // alla nyckelledtrådar måste vara hittade OCH det måste finnas anklagelser kvar
    const allKeysFound = caseAmountOfKeyClues === amountOfFoundKeyClues;
    const accusationsRemaining = maxAccusations - (accusationsMade ?? 0);
    const canAccuse = allKeysFound && accusationsRemaining > 0;

    return NextResponse.json({
      // keys_found är en string och endast för vår Frontend
      keys_found: `${amountOfFoundKeyClues}/${caseAmountOfKeyClues}`,
      accusations_made: accusationsMade ?? 0,
      max_accusations: maxAccusations,
      accusations_remaining: accusationsRemaining,
      can_accuse: canAccuse,
    });
  } catch (error) {
    return NextResponse.json(
      {
        error: error instanceof Error ? error.message : 'Internal server error',
      },
      { status: 500 }
    );
  }
}
