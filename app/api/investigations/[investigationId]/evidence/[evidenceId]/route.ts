import { NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';

export async function GET(
  request: Request,
  { params }: { params: Promise<{ investigationId: string; evidenceId: string }> }
) {
  const { investigationId, evidenceId } = await params;
  try {
    const supabase = await createClient();

    if (!supabase) {
      return NextResponse.json({ error: 'Failed to initialize Supabase client' }, { status: 500 });
    }

    const { data, error } = await supabase
      .from('investigation_found_clues')
      .select(
        `
    found_at,
    case_clues (
      *,
      clue_types (*)
    );
  `
      )
      .eq('investigation_id', investigationId)
      .eq('clue_id', evidenceId)
      .single();

    if (error || !data) {
      return NextResponse.json(
        { error: 'Evidence not found, error msg:' + error?.message },
        { status: 404 }
      );
    }

    return NextResponse.json(data);
  } catch (error) {
    return NextResponse.json(
      {
        error: error instanceof Error ? error.message : 'Internal server error',
      },
      { status: 500 }
    );
  }
}
