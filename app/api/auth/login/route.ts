import { NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';

export async function POST(request: Request) {
  const body = await request.json();
  const { email, password } = body;

  const supabase = await createClient();

  // The `signInWithPassword` method will take care of:
  // * check that email exists
  // * verifies the password against the stored hash
  // * *and* generates the JWT: returns a sessions with access/refresh tokens!
  const { data, error } = await supabase.auth.signInWithPassword({
    email,
    password,
  });

  return NextResponse.json({ test: 'test' }, { status: 201 });
}
