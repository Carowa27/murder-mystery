// Ser tom ut men är en spärr, bygget kraschar om filen importeras från webbläsaren.
import 'server-only';
import { createClient } from '@supabase/supabase-js';
import type { Database } from '@/lib/database.types';

// Klienten går förbi RLS. Använd den bara för de skrivningar som måste göra det,
// alltså pengar och nivåer. Allt läsande görs med den vanliga klienten.
export function createServiceClient() {
  return createClient<Database>(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SECRET_KEY!,
    {
      auth: {
        persistSession: false,
        autoRefreshToken: false,
      },
    }
  );
}
