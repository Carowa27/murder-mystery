import { NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';
import { getCurrentUser } from '@/lib/supabase/auth';

// Putting export on this helper function here now; I want to write a few tests for this!
export function generateInviteCode(): string {
  // Generate an invite code on the format "VIGIL-7Q" or "KRMTX-3B"
  const letters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
  const code =
    Array.from({ length: 5 }, () => letters[Math.floor(Math.random() * 26)]).join('') +
    '-' +
    Math.floor(Math.random() * 10) +
    letters[Math.floor(Math.random() * 26)];

  return code;
}

export async function POST() {
  const user = await getCurrentUser();

  if (!user) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const inviteCode = generateInviteCode();

  // Insert into teams with the user as owner_id
  // Also insert into team_members
}
