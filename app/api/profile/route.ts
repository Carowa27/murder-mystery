import { createClient } from '@/lib/supabase/server';
import { getCurrentUser } from '@/lib/supabase/auth';
import { NextResponse } from 'next/server';
import { avatars } from '@/lib/avatars';

interface IProfileRow {
  display_name: string;
  avatar_url: string | null;
  unlimited_until: string | null;
  subscription_tier: string;
}

// Den inloggades profil, nivå och köpta fall.
export async function GET() {
  const user = await getCurrentUser();

  if (!user) {
    return NextResponse.json({ error: 'Ej inloggad' }, { status: 401 });
  }

  const supabase = await createClient();

  // subscription_tier är en funktion i databasen, men den går att hämta som om
  // den vore en kolumn i profiles. Då räknas nivån ut på samma sätt överallt.
  // Typerna i database.types.ts känner inte till den, därför IProfileRow.
  const { data: profile, error: profileError } = await supabase
    .from('profiles')
    .select('display_name, avatar_url, unlimited_until, subscription_tier')
    .eq('id', user.sub)
    .single<IProfileRow>();

  if (profileError) {
    return NextResponse.json({ error: profileError.message }, { status: 500 });
  }

  // RLS släpper igenom allt för admin, så filtret på user_id behövs här också.
  const { data: purchases, error: purchasesError } = await supabase
    .from('purchases')
    .select(
      'created_at, cases ( id, title, description, image_url, story_date, difficulties ( name ) )'
    )
    .eq('user_id', user.sub)
    .order('created_at', { ascending: false });

  if (purchasesError) {
    return NextResponse.json({ error: purchasesError.message }, { status: 500 });
  }

  return NextResponse.json({ email: user.email, ...profile, purchases });
}

// Sparar namn och avatar från Redigera profil. Avataren måste finnas i listan
// i lib/avatars.ts, eller vara null för den som inte har valt någon än.
export async function PATCH(request: Request) {
  const user = await getCurrentUser();

  if (!user) {
    return NextResponse.json({ error: 'Ej inloggad' }, { status: 401 });
  }

  const body = await request.json();

  const { display_name, avatar_url } = body;

  if (typeof display_name !== 'string') {
    return NextResponse.json({ error: 'Namn saknas' }, { status: 400 });
  }

  const name = display_name.trim();

  if (name.length < 1 || name.length > 30) {
    return NextResponse.json({ error: 'Namnet ska vara 1 till 30 tecken' }, { status: 400 });
  }

  if (avatar_url !== null && !avatars.includes(avatar_url)) {
    return NextResponse.json({ error: 'Okänd avatar' }, { status: 400 });
  }

  const supabase = await createClient();

  const { error } = await supabase
    .from('profiles')
    .update({ display_name: name, avatar_url })
    .eq('id', user.sub);

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json({ display_name: name, avatar_url });
}
