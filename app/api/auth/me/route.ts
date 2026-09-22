// A simlpe Route Handler to test getCurrentUser(). Returns user's info

import { NextResponse } from 'next/server';
import { getCurrentUser } from '@/lib/supabase/auth';

export async function GET() {
  const user = await getCurrentUser();

  if (!user) {
    return NextResponse.json({ error: 'Ej inloggad' }, { status: 401 });
  }

  // Now only id (the `sub` property) and email
  return NextResponse.json({ user: { id: user.sub, email: user.email } }, { status: 200 });
}
