import { NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';

export async function POST(request: Request) {
  const body = await request.json();
  const { email, password } = body; // Bör diskuteras i gruppen ifall mer ska frågas efter vid sign up! Email och password får now, kan komma att ändras

  // Basic validering for now:
  // * lösenord måste vara minst 8 karaktärer
  // * zod skulle kunna användas för att fånga felaktiga email format innan det skickas till Supabase! (som kommer validera om jag förstår rätt)
  if (!email || !password) {
    return NextResponse.json({ error: 'Email och lösenord krävs' }, { status: 400 });
  }

  if (password.length < 8) {
    return NextResponse.json(
      { error: 'Lösenordet måste vara minst 8 karaktärer långt' },
      { status: 400 }
    );
  }
}
