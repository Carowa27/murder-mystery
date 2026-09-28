import { NextResponse } from 'next/server';

import { createClient } from '@/lib/supabase/server';
import { getCurrentUser } from '@/lib/supabase/auth';
import type { Database } from '@/lib/database.types';

type CaseUpdate = Database['public']['Tables']['cases']['Update'];

export async function PATCH(request: Request, { params }: { params: Promise<{ caseId: string }> }) {
  const { caseId } = await params;
  try {
    const body = await request.json();

    const { title, description, image_url, location, story_date, difficulty_id, price, stage } =
      body;

    if (!caseId) {
      return NextResponse.json({ error: 'caseId is required' }, { status: 400 });
    }

    const user = await getCurrentUser();

    if (!user) {
      return NextResponse.json({ error: 'No user found' }, { status: 401 });
    }

    const supabase = await createClient();

    const { data: profile, error: profileError } = await supabase
      .from('profiles')
      .select('*')
      .eq('id', user.sub)
      .single();

    if (profileError) {
      return NextResponse.json({ error: profileError.message }, { status: 404 });
    }

    if (profile.role !== 'admin') {
      return NextResponse.json({ error: 'Profile is not admin' }, { status: 403 });
    }

    const updates: CaseUpdate = {};

    if (title !== undefined) updates.title = title;
    if (description !== undefined) updates.description = description;
    if (image_url !== undefined) updates.image_url = image_url;
    if (location !== undefined) updates.location = location;
    if (story_date !== undefined) updates.story_date = story_date;
    if (difficulty_id !== undefined) updates.difficulty_id = difficulty_id;
    if (price !== undefined) updates.price = price;
    if (stage !== undefined) updates.stage = stage;

    if (Object.keys(updates).length === 0) {
      return NextResponse.json({ error: 'No fields supplied for update' }, { status: 400 });
    }

    if (title !== undefined) {
      const { data: existingCase, error: existingCaseError } = await supabase
        .from('cases')
        .select('id')
        .eq('title', title)
        .neq('id', caseId)
        .maybeSingle();

      if (existingCaseError) {
        return NextResponse.json({ error: existingCaseError.message }, { status: 500 });
      }

      if (existingCase) {
        return NextResponse.json({ error: 'Case with this title already exists' }, { status: 409 });
      }
    }

    const { error: updateError } = await supabase.from('cases').update(updates).eq('id', caseId);

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
