import { NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';

export async function POST(request: Request) {
  const body = await request.json();
  const { email, password } = body;

  const supabase = await createClient();

  // Kalla på `supabase.auth.signInWithPassword`
  // Error hantering

  return NextResponse.json({ test: 'test' }, { status: 201 });
}
