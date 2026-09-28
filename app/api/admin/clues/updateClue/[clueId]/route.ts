import { NextResponse } from 'next/server';

import { createClient } from '@/lib/supabase/server';
import { getCurrentUser } from '@/lib/supabase/auth';
import type { Database } from '@/lib/database.types';

type ClueUpdate = Database['public']['Tables']['case_clues']['Update'];

export async function PATCH(request: Request, { params }: { params: Promise<{ clueId: string }> }) {
  const { clueId } = await params;
  try {
    const body = await request.json();

    const { case_id, clue_type_id, title, content, image_url, is_key } = body;

    if (!clueId) {
      return NextResponse.json({ error: 'clueId is required' }, { status: 400 });
    }

    const user = await getCurrentUser();

    if (!user) {
      return NextResponse.json({ error: 'No user found' }, { status: 401 });
    }

    const supabase = await createClient();

    const { data: profile, error: profileError } = await supabase
      .from('profiles')
      .select('role')
      .eq('id', user.sub)
      .single();

    if (profileError) {
      return NextResponse.json({ error: profileError.message }, { status: 404 });
    }

    if (profile.role !== 'admin') {
      return NextResponse.json({ error: 'Profile is not admin' }, { status: 403 });
    }

    const updates: ClueUpdate = {};
    if (case_id !== undefined) updates.case_id = case_id;
    if (clue_type_id !== undefined) updates.clue_type_id = clue_type_id;
    if (title !== undefined) updates.title = title;
    if (content !== undefined) updates.content = content;
    if (image_url !== undefined) updates.image_url = image_url;
    if (is_key !== undefined) updates.is_key = is_key;

    if (Object.keys(updates).length === 0) {
      return NextResponse.json({ error: 'No fields supplied for update' }, { status: 400 });
    }

    if (title !== undefined) {
      const { data: existingCase, error: existingCaseError } = await supabase
        .from('case_clues')
        .select('id')
        .eq('title', title)
        .neq('id', clueId)
        .maybeSingle();

      if (existingCaseError) {
        return NextResponse.json({ error: existingCaseError.message }, { status: 500 });
      }

      if (existingCase) {
        return NextResponse.json({ error: 'Clue with this title already exists' }, { status: 409 });
      }
    }

    const { error: updateError } = await supabase
      .from('case_clues')
      .update(updates)
      .eq('id', clueId);

    if (updateError) {
      return NextResponse.json({ error: updateError.message }, { status: 500 });
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
