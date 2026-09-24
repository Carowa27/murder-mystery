import { NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';
import { getCurrentUser } from '@/lib/supabase/auth';

export async function POST(request: Request) {
  const user = await getCurrentUser();

  if (!user) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const body = await request.json();
  const { inviteCode } = body;

  if (!inviteCode) {
    return NextResponse.json({ error: 'Inbjudningskod krävs' }, { status: 400 });
  }

  const supabase = await createClient();
  
  // Hitta team via invite code
  const { data: team, error: teamError } = await supabase
    .from('teams')
    .select('id, name')
    .eq('invite_code', inviteCode)
    .single();

  if (teamError || !team) {
    return NextResponse.json({ error: 'Ogiltig inbjudningskod'}, { status: 404 });
  }

  // Lägg in användaren i team_members
  // * check_team_size triggern ser till att ett team inte blir mer än 4 medlemmar
  // * Tabellens primary key (team_id, user_id) ser till att en team inte har dubletter av en user
  const { error: joinError } = await supabase.from('team_members').insert({
    team_id: team.id,
    user_id: user.sub,
  });

  // Error hantering
}