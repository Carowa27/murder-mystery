import { NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';

export async function GET(request: Request) {
  try {
    const supabase = await createClient();

    if (!supabase) {
      return NextResponse.json({ error: 'Failed to initialize Supabase client' }, { status: 500 });
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
    return NextResponse.json(difficulties);
  } catch (error) {
    return NextResponse.json(
      {
        error: error instanceof Error ? error.message : 'Internal server error',
      },
      { status: 500 }
    );
  }
}
