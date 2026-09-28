import { NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';

export async function GET(request: Request, { params }: { params: Promise<{ clueId: string }> }) {
  const { clueId } = await params;
  try {
    const supabase = await createClient();

    if (!supabase) {
      return NextResponse.json({ error: 'Failed to initialize Supabase client' }, { status: 500 });
    }

    const { data, error } = await supabase
      .from('case_clues')
      .select(
        `
      *,
        clue_types (*)
    `
      )
      .eq('id', clueId)
      .single();

    if (error || !data) {
      return NextResponse.json(
        { error: 'Clue not found, error msg:' + error?.message },
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
