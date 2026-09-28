import { NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';
import { getCurrentUser } from '@/lib/supabase/auth';

export async function POST(request: Request) {
  const body = await request.json();
  const { title, description, image_url, location, story_date, difficulty_id, price, stage } = body;
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
      .select(
        `
      *
    `
      )
      .eq('id', user.sub)
      .single();

    if (profileError) {
      return NextResponse.json({ error: profileError.message }, { status: 404 });
    }
    let error = null;

    if (profile.role === 'admin') {
      ({ error } = await supabase.from('cases').insert({
        title: title,
        description: description,
        image_url: image_url,
        location: location,
        story_date: story_date,
        difficulty_id: difficulty_id,
        price: price,
        stage: stage,
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
