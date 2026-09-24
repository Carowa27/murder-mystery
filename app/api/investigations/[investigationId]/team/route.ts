import { NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';

export async function GET(
  request: Request,
  { params }: { params: Promise<{ investigationId: string }> }
) {
  const { investigationId } = await params;
  const supabase = await createClient();

  const { data, error } = await supabase
    .from('investigations')
    .select(
      `
    *,
    teams (
      *,
      team_members (
        joined_at,
        profiles (
          id,
          display_name,
          avatar_url
        )
      )
    ),
    cases(*)
  `
    )
    .eq('id', investigationId)
    .single();

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 404 });
  }

  return NextResponse.json(data);
}
