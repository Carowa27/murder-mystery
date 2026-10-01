import { createClient } from '@/lib/supabase/server';
import { NextResponse } from 'next/server';

interface IProfileRow {
  display_name: string;
  unlimited_until: string | null;
  subscription_tier: string;
}

// Den inloggades profil, nivå och köpta fall.
export async function GET(request: Request, { params }: { params: Promise<{ userId: string }> }) {
  const { userId } = await params;

  const supabase = await createClient();

  const { data: profile, error: profileError } = await supabase
    .from('profiles')
    .select('*')
    .eq('id', userId)
    .single<IProfileRow>();

  if (profileError) {
    return NextResponse.json({ error: profileError.message }, { status: 500 });
  }

  return NextResponse.json(profile);
}

export async function PATCH(request: Request, { params }: { params: Promise<{ userId: string }> }) {
  const { userId } = await params;

  const { display_name, avatar_url, role } = await request.json();

  const supabase = await createClient();

  const { data: profile, error } = await supabase
    .from('profiles')
    .update({
      display_name,
      avatar_url,
      role,
    })
    .eq('id', userId)
    .select()
    .single();

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 404 });
  }

  return NextResponse.json(profile);
}
