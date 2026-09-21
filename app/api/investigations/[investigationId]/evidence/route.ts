import { NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';

export async function GET(
  request: Request,
  { params }: { params: Promise<{ investigationId: string }> }
) {
  const { investigationId } = await params;
  const supabase = await createClient();

  const { data, error } = await supabase
    .from('investigation_found_clues')
    .select(
      `
    found_at,
    case_clues (
      *,
      clue_types (*)
    )
  `
    )
    .eq('investigation_id', investigationId);

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 404 });
  }

  return NextResponse.json(data);
}
