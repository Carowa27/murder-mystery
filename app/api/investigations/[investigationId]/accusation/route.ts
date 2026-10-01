import { NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';
import { getCurrentUser } from '@/lib/supabase/auth';

type InvestigationRow = {
  case_id: string;
  status: string;
  cases: {
    difficulties: {
      max_accusations: number;
    };
  };
};

const fail = (error: string, status: number) => NextResponse.json({ error }, { status });

export async function POST(
  request: Request,
  { params }: { params: Promise<{ investigationId: string }> }
) {
  try {
    const { investigationId } = await params;
    const body = (await request.json().catch(() => ({}))) as { suspectId?: unknown };
    const suspectId = body.suspectId;

    if (typeof suspectId !== 'string' || suspectId.length === 0) {
      return fail('suspectId krävs', 400);
    }

    const user = await getCurrentUser();
    if (!user) return fail('No user found', 401);

    const supabase = await createClient();
    if (!supabase) return fail('Failed to initialize Supabase client', 500);

    // ---- Investigation, status and accusation limit ----
    const { data } = await supabase
      .from('investigations')
      .select(
        `case_id, status,
         cases!inner ( difficulties!inner ( max_accusations ) )`
      )
      .eq('id', investigationId)
      .single();

    const investigation = data as unknown as InvestigationRow | null;

    if (!investigation) return fail('Investigation not found', 404);

    // Blocks accusations on solved, failed, abandoned and paused investigations
    if (investigation.status !== 'active') {
      return fail('Utredningen är inte aktiv', 409);
    }

    const maxAccusations = investigation.cases.difficulties.max_accusations;

    const { count: accusationsMade, error: countError } = await supabase
      .from('accusations')
      .select('*', { count: 'exact', head: true })
      .eq('investigation_id', investigationId);

    if (countError) return fail(countError.message, 500);

    const made = accusationsMade ?? 0;
    if (made >= maxAccusations) {
      return fail('Inga anklagelser kvar', 403);
    }

    // ---- Suspect must belong to this case ----
    const { data: suspect } = await supabase
      .from('characters')
      .select('id, is_guilty')
      .eq('id', suspectId)
      .eq('case_id', investigation.case_id)
      .single();

    if (!suspect) return fail('Invalid suspect', 400);

    const isGuilty = suspect.is_guilty;

    // ---- Record the accusation ----
    const { error: accusationError } = await supabase.from('accusations').insert({
      investigation_id: investigationId,
      character_id: suspectId,
      user_id: user.sub,
    });

    if (accusationError) return fail(accusationError.message, 500);

    // ---- Close the investigation if it's over ----
    // `made` was counted before the insert above, so add 1 for this accusation
    const accusationsLeft = Math.max(maxAccusations - (made + 1), 0);
    const newStatus: 'solved' | 'failed' | null = isGuilty
      ? 'solved'
      : accusationsLeft === 0
        ? 'failed'
        : null;

    if (newStatus) {
      const { error: statusError } = await supabase
        .from('investigations')
        .update({ status: newStatus, ended_at: new Date().toISOString() })
        .eq('id', investigationId);

      if (statusError) return fail(statusError.message, 500);
    }

    return NextResponse.json({
      success: true,
      is_guilty: isGuilty,
      accusations_left: accusationsLeft,
      status: newStatus ?? 'active',
    });
  } catch (error) {
    return fail(error instanceof Error ? error.message : 'Internal server error', 500);
  }
}
