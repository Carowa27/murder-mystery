import { NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';

export async function GET(request: Request) {
  try {
    const supabase = await createClient();

    if (!supabase) {
      return NextResponse.json({ error: 'Failed to initialize Supabase client' }, { status: 500 });
    }

    const { data: clue_types, error } = await supabase.from('clue_types').select(
      `
        *
        
      `
    );

    if (error || !clue_types) {
      return NextResponse.json(
        { error: 'Case not found, error msg:' + error?.message },
        { status: 404 }
      );
    }
    return NextResponse.json(clue_types);
  } catch (error) {
    return NextResponse.json(
      {
        error: error instanceof Error ? error.message : 'Internal server error',
      },
      { status: 500 }
    );
  }
}
