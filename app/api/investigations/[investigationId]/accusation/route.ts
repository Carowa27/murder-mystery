import { NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';

export async function POST(
  request: Request,
  { params }: { params: Promise<{ investigationId: string }> }
) {
  const { investigationId } = await params;
  const body = await request.json();
  const { suspectId, userId } = body;
  try {
    const supabase = await createClient();
    console.log(suspectId, userId);
    if (!supabase) {
      return NextResponse.json({ error: 'Failed to initialize Supabase client' }, { status: 500 });
    }
    const { data: investigation } = await supabase
      .from('investigations')
      .select('case_id')
      .eq('id', investigationId)
      .single();

    if (!investigation) {
      return NextResponse.json({ error: 'Investigation not found' }, { status: 404 });
    }

    const { data: suspect } = await supabase
      .from('characters')
      .select('id, is_guilty')
      .eq('id', suspectId)
      .eq('case_id', investigation.case_id)
      .single();

    if (!suspect) {
      return NextResponse.json({ error: 'Invalid suspect' }, { status: 400 });
    }

    const isGuilty = suspect.is_guilty;

    const { error: accusationPostError } = await supabase.from('accusations').insert({
      investigation_id: investigationId,
      character_id: suspectId,
      user_id: userId,
    });

    if (accusationPostError) {
      return NextResponse.json({ error: accusationPostError.message }, { status: 500 });
    }

    return NextResponse.json({ success: true, is_guilty: isGuilty });
  } catch (error) {
    return NextResponse.json(
      {
        error: error instanceof Error ? error.message : 'Internal server error',
      },
      { status: 500 }
    );
  }
}
