import { NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';

export async function POST(request: Request) {
  const body = await request.json();
  const { email, password } = body; // Bör diskuteras i gruppen ifall mer ska frågas efter vid sign up! Email och password tillsvidare, kan komma att ändras

  // Basic validering tillsvidare:
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

  const supabase = await createClient();

  const { data, error } = await supabase.auth.signUp({
    email,
    password,
    // Nedan är ett förslag på vad som skulle kunna läggas till vid sign up
    // options: {
    //   data: {
    //     display_name: display_name || undefined,
    //   },
    // },
  });

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 400 });
  }

  // Här skulle vi "normalt" ha kod för att göra en SQL INSERT i databasen men tack vare vår trigger function
  // som körs när en ny row skapas i vår Auth table skapas en korresponderande row i vår egen Profile table
  // automatiskt!

  return NextResponse.json({ user: data.user }, { status: 201 });
}
