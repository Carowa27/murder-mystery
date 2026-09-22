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

    if (invError || !investigation) {
      return NextResponse.json(
        { error: 'Investigation not found, error msg:' + invError?.message },
        { status: 404 }
      );
    }

    const { data: characters, error: charError } = await supabase
      .from('characters')
      .select('*')
      .eq('case_id', investigation.case_id);

    if (charError) {
      return NextResponse.json({ error: charError.message }, { status: 404 });
    }

    return NextResponse.json({
      investigation,
      case: investigation.cases,
      team: investigation.teams,
      characters,
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
