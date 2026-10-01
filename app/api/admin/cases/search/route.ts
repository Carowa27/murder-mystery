import { NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';

const UUID_REGEX = /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;

export async function GET(request: Request) {
  const supabase = await createClient();

  const { searchParams } = new URL(request.url);
  const search = searchParams.get('q')?.trim() ?? '';

  if (!search) {
    return NextResponse.json([]);
  }

  let query = supabase.from('cases').select('*').limit(20);

  if (UUID_REGEX.test(search)) {
    query = query.or(`title.ilike.%${search}%,id.eq.${search}`);
  } else {
    query = query.ilike('title', `%${search}%`);
  }

  const { data, error } = await query;

  if (error) {
    console.error('Cases search error:', error);

    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json(data ?? []);
}
