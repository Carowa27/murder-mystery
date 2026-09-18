import { NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';

export async function POST(request: Request) {
  const body = await request.json();
  const { email, password } = body; // Bör diskuteras i gruppen ifall mer ska frågas efter vid sign up! Email och password får now, kan komma att ändras
}
