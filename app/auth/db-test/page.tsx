import { createClient } from '@/lib/supabase/server';

// Tillfällig testsida för issue #3. Den ligger under /auth eftersom proxyn släpper igenom
// den sökvägen för den som inte är inloggad. Tas bort när inloggningen fungerar efter att Steven är klar med sin del av arbetet.

const MOCK_CASE_ID = 'a0000000-0000-4000-8000-000000000001';

export default async function DbTestPage() {
  const supabase = await createClient();

  // difficulties(name) hämtar namnet från tabellen difficulties via difficulty_id
  const { data: mystery, error } = await supabase
    .from('cases')
    .select('title, description, location, story_date, difficulties(name)')
    .eq('id', MOCK_CASE_ID)
    .single();

  if (error) {
    return <p>Fel från Supabase: {error.message}</p>;
  }

  // Den som inte är inloggad ska få en tom lista här, inte ett fel.
  // RLS släpper bara in den som äger fallet eller spelar det i ett team.
  const { data: characters } = await supabase
    .from('characters')
    .select('first_name, last_name')
    .eq('case_id', MOCK_CASE_ID);

  return (
    <main>
      <h1>Titel: {mystery.title}</h1>
      <p>
        Plats: {mystery.location}, {mystery.story_date}
      </p>
      <p>Svårighetsgrad: {mystery.difficulties.name}</p>
      <p>{mystery.description}</p>
      <p>Personer som syns (ska vara noll om man ej är inloggad): {characters?.length ?? 0}</p>
    </main>
  );
}
