import { NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';
import { getCurrentUser } from '@/lib/supabase/auth';

export async function POST() {
  // Get the current user
  // Generate a unique invite code
  // Insert into teams with the user as owner_id
  // Also insert into team_members
}
