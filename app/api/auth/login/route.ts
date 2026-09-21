import { NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';

export async function POST(request: Request) {
  // Ta emot body
  // Skapa Supabase Client
  // Kalla på `supabase.auth.signInWithPassword`
  // Error hantering

  return NextResponse.json({ test: 'test' }, { status: 201 });
}
