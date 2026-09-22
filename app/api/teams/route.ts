import { NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';
import { getCurrentUser } from '@/lib/supabase/auth';

const MAX_ATTEMPTS = 3;

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

export async function POST(request: Request) {
  const user = await getCurrentUser();

  if (!user) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const body = await request.json();
  const { name: teamName } = body; // Rename the `name` key in the body to `teamName` for clarity

  if (!teamName) {
    return NextResponse.json({ error: 'Teamnamn krävs' }, { status: 400 });
  }

  const supabase = await createClient();

  let inviteCode: string;
  let team;
  let attempts = 0;

  while (attempts < MAX_ATTEMPTS) {
    inviteCode = generateInviteCode();

    const { data, error } = await supabase
      .from('teams')
      .insert({
        name: teamName,
        invite_code: inviteCode,
        owner_id: user.sub,
      })
      .select()
      .single();

    if (!error) {
      team = data;
      break;
    }

    // 23505 is the Postgres error code for status 409 uniqueness violation that Supabase
    // uses: https://supabase.com/docs/guides/api/rest/postgrest-error-codes
    if (error.code !== '23505') {
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    attempts++;
  }

  if (!team) {
    return NextResponse.json({ error: 'Kunde inte generera unik invite-kod' }, { status: 500 });
  }

  // Also insert into team_members

  return NextResponse.json({ team }, { status: 201 });
}
