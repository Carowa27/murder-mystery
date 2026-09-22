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
    const { data: investigation, error: invError } = await supabase
      .from('investigations')
      .select(
        `
      *,
      cases (*),
      teams (*)
    `
      )
      .eq('id', investigationId)
      .single();
    const { data: characters, error: charError } = await supabase
      .from('characters')
      .select('*')
      .eq('case_id', investigation.case_id);

    const { data: found_clues, error: cluesError } = await supabase
      .from('investigation_found_clues')
      .select(
        `found_at,
        case_clues (
          *,
          clue_types (*)
        )
      `
      )
      .eq('investigation_id', investigationId);

    if (invError) {
      return NextResponse.json({ error: invError.message }, { status: 404 });
    }
    if (charError) {
      return NextResponse.json({ error: charError.message }, { status: 404 });
    }
    if (cluesError) {
      return NextResponse.json({ error: cluesError.message }, { status: 404 });
    }

    return NextResponse.json({
      investigation,
      case: investigation.cases,
      characters,
      found_clues,
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
