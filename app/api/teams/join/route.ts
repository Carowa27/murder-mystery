import { NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';
import { getCurrentUser } from '@/lib/supabase/auth';

export async function POST(request: Request) {
  // Auth och validering
  // Hitta team via invite code
  // Lägg in användaren i team_members
  // Error hantering
}