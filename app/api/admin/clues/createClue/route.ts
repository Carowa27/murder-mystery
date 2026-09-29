import { NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';
import { getCurrentUser } from '@/lib/supabase/auth';

export async function POST(request: Request) {
  const body = await request.json();
  const { case_id, clue_type_id, title, content, image_url, is_key } = body;
  const user = await getCurrentUser();

  try {
    const supabase = await createClient();

    if (!supabase) {
      return NextResponse.json({ error: 'Failed to initialize Supabase client' }, { status: 500 });
    }
    if (!user) {
      return NextResponse.json({ error: 'No user found' }, { status: 500 });
    }
    const { data: profile, error: profileError } = await supabase
      .from('profiles')
      .select('role')
      .eq('id', user.sub)
      .single();

    if (profileError) {
      return NextResponse.json({ error: profileError.message }, { status: 404 });
    }
    const { data: checkClues, error: checkCluesError } = await supabase
      .from('case_clues')
      .select('title')
      .eq('title', title)
      .eq('case_id', case_id)
      .maybeSingle();

    if (checkCluesError) {
      return NextResponse.json({ error: checkCluesError.message }, { status: 404 });
    }
    if (checkClues !== null) {
      return NextResponse.json({ error: 'clue with this title already exist' }, { status: 404 });
    }

    const { data: cases, error: casesError } = await supabase
      .from('cases')
      .select('id, title')
      .eq('id', case_id)
      .maybeSingle();

    if (casesError) {
      return NextResponse.json({ error: casesError.message }, { status: 404 });
    }
    if (cases === null) {
      return NextResponse.json({ error: 'case with this id does not exist' }, { status: 404 });
    }

    let error = null;

    if (profile.role === 'admin') {
      ({ error } = await supabase.from('case_clues').insert({
        case_id: case_id,
        clue_type_id: clue_type_id,
        title: title,
        content: content,
        image_url: image_url,
        is_key: is_key,
      }));
    } else {
      return NextResponse.json({ error: 'profile is not admin' }, { status: 404 });
    }
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
