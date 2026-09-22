// A simlpe Route Handler to test getCurrentUser(). Returns user's info

import { NextResponse } from 'next/server';
import { getCurrentUser } from '@/lib/supabase/auth';

export async function GET() {
  const user = await getCurrentUser();

  if (!user) {
    return NextResponse.json({ error: 'Ej inloggad' }, { status: 401 });
  }

  return NextResponse.json({ user }, { status: 200 });
}
