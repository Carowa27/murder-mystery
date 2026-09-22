import { NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';
import { getCurrentUser } from '@/lib/supabase/auth';

export async function POST() {
  const user = await getCurrentUser();

  if (!user) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }
  // Generate a unique invite code
  // Insert into teams with the user as owner_id
  // Also insert into team_members
}
