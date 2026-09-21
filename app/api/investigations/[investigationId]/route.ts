import { NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';

export async function GET(
  request: Request,
  { params }: { params: Promise<{ investigationId: string }> }
) {
  const { investigationId } = await params;
  const supabase = await createClient();

  const { data: investigation, error } = await supabase
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

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 404 });
  }

  const { data: characters } = await supabase
    .from('characters')
    .select('*')
    .eq('case_id', investigation.case_id);

  return NextResponse.json({
    investigation,
    case: investigation.cases,
    team: investigation.teams,
    characters,
  });
}
