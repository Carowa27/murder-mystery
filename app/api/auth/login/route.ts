import { NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';

export async function POST(request: Request) {
  const body = await request.json();
  const { email, password } = body;

  // Skapa Supabase Client
  // Kalla på `supabase.auth.signInWithPassword`
  // Error hantering

  return NextResponse.json({ test: 'test' }, { status: 201 });
}
