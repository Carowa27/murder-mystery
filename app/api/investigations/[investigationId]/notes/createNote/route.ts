import { NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';
import { getCurrentUser } from '@/lib/supabase/auth';

export async function POST(
  request: Request,
  { params }: { params: Promise<{ investigationId: string }> }
) {
  const { investigationId } = await params;
  const body = await request.json();
  const { clue_id, content } = body;
  const user = await getCurrentUser();

  try {
    const supabase = await createClient();

    if (!supabase) {
      return NextResponse.json({ error: 'Failed to initialize Supabase client' }, { status: 500 });
    }
    if (!user) {
      return NextResponse.json({ error: 'No user found' }, { status: 500 });
    }
    const { data: investigation, error: invError } = await supabase
      .from('investigations')
      .select('team_id')
      .eq('id', investigationId)
      .single();

    if (invError) {
      return NextResponse.json({ error: invError.message }, { status: 404 });
    }
    if (investigation === null) {
      return NextResponse.json({ error: 'no investigation found' }, { status: 404 });
    }
    const { count, error: checkTeamError } = await supabase
      .from('team_members')
      .select('*', { count: 'exact', head: true })
      .eq('team_id', investigation.team_id)
      .eq('user_id', user.sub);

    const isInTeam = (count ?? 0) > 0;

    if (checkTeamError) {
      return NextResponse.json({ error: checkTeamError.message }, { status: 404 });
    }
    if (!isInTeam) {
      return NextResponse.json({ error: 'no user in team with that id found' }, { status: 404 });
    }

    let clue = null;
    let clueError = null;

    if (clue_id !== null) {
      ({ data: clue, error: clueError } = await supabase.from('case_clues').select('id, title'));
    } else {
      return NextResponse.json({ error: 'clue not found' }, { status: 404 });
    }
    if (clueError) {
      return NextResponse.json({ error: clueError.message }, { status: 404 });
    }
    if (clue === null) {
      return NextResponse.json({ error: 'clue does not exist' }, { status: 404 });
    }
    const { error } = await supabase.from('notes').insert({
      investigation_id: investigationId,
      clue_id: clue_id || null,
      content: content,
      user_id: user.sub,
    });
    if (error) {
      return NextResponse.json({ error: error.message }, { status: 404 });
    }
    return NextResponse.json({ success: true });
  } catch (error) {
    return NextResponse.json(
      {
        error: error instanceof Error ? error.message : 'Internal server error',
      },
      { status: 500 }
    );
  }
}
