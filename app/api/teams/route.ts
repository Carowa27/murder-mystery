import { NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';
import { getCurrentUser } from '@/lib/supabase/auth';

export async function POST() {
  const user = await getCurrentUser();

  if (!user) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  // Generate a unique invite code
  // This code generates code on the format "VIGIL-7Q" or "KRMTX-3B"
  const letters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
  const code =
    Array.from({ length: 5 }, () => letters[Math.floor(Math.random() * 26)]).join('') +
    '-' +
    Math.floor(Math.random() * 10) +
    letters[Math.floor(Math.random() * 26)];

  // Insert into teams with the user as owner_id
  // Also insert into team_members
}
