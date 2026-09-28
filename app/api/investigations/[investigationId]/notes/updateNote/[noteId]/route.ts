import { NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';
import { getCurrentUser } from '@/lib/supabase/auth';
import type { Database } from '@/lib/database.types';

type NoteUpdate = Database['public']['Tables']['notes']['Update'];

export async function PATCH(
  request: Request,
  { params }: { params: Promise<{ investigationId: string; noteId: string }> }
) {
  const { investigationId, noteId } = await params;
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

    const { data: note, error: noteError } = await supabase
      .from('notes')
      .select('id, user_id')
      .eq('id', noteId)
      .maybeSingle();

    if (noteError) {
      return NextResponse.json({ error: noteError.message }, { status: 404 });
    }
    if (!note) {
      return NextResponse.json({ error: 'note not found' }, { status: 404 });
    }

    const updates: NoteUpdate = {};
    if (clue_id !== undefined) updates.clue_id = clue_id;
    if (content !== undefined) updates.content = content;
    if (note && note.user_id !== user.sub) updates.user_id = user.sub;

    if (Object.keys(updates).length === 0) {
      return NextResponse.json({ error: 'No fields supplied for update' }, { status: 400 });
    }

    const { error: updateError } = await supabase.from('notes').update(updates).eq('id', noteId);

    if (updateError) {
      return NextResponse.json({ error: updateError.message }, { status: 404 });
    }

    return NextResponse.json({
      success: true,
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
