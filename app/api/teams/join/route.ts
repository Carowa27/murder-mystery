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

  // Error hantering:
  // * Vi utnyttjar primary key violation (code 23505) för att dra slutsatsen att man redan är medlem
  // * check_team_size ger exception 'Teamet är fullt' (schema.sql rad 576)
  if (joinError) {
    if (joinError.code === '23505') {
      return NextResponse.json({ error: 'Du är redan medlem i detta team' }, { status: 409 });
    }

    if (joinError.message.includes('Teamet är fullt')) {
      return NextResponse.json({ error: 'Teamet är fullt' }, { status: 409 });
    }

    return NextResponse.json({ error: joinError.message }, { status: 500 });
  }

  return NextResponse.json({ team }, { status: 201 });
}