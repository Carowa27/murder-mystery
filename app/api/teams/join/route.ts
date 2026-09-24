import { NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';
import { getCurrentUser } from '@/lib/supabase/auth';

export async function POST(request: Request) {
  const user = getCurrentUser();

  if (!user) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const body = await request.json();
  const { inviteCode } = body;

  if (!inviteCode) {
    return NextResponse.json({ error: 'Inbjudningskod krävs' }, { status: 400 });
  }
  // Hitta team via invite code
  // Lägg in användaren i team_members
  // Error hantering
}