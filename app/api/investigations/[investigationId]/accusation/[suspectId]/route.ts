import { NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';

export async function GET(
  request: Request,
  { params }: { params: Promise<{ investigationId: string; suspectId: string }> }
) {
  const { investigationId, suspectId } = await params;
  try {
    const supabase = await createClient();

    if (!supabase) {
      return NextResponse.json({ error: 'Failed to initialize Supabase client' }, { status: 500 });
    }
    const { data: investigation } = await supabase
      .from('investigations')
      .select(
        `id,
      case_id
    `
      )
      .eq('id', investigationId)
      .single();
    if (!investigation) {
      throw new Error('Investigation not found');
    }
    const { data, error } = await supabase
      .from('characters')
      .select('id')
      .eq('id', suspectId)
      .eq('case_id', investigation.case_id)
      .eq('is_guilty', true)
      .maybeSingle();

    const isGuilty = !!data;

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 404 });
    }

    return NextResponse.json(isGuilty);
  } catch (error) {
    return NextResponse.json(
      {
        error: error instanceof Error ? error.message : 'Internal server error',
      },
      { status: 500 }
    );
  }
}
