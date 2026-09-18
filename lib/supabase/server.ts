import { createServerClient } from '@supabase/ssr';
import { cookies } from 'next/headers';
import type { Database } from '@/lib/database.types';

export async function createClient() {
  const cookieStore = await cookies();

  // <Database> ger klienten typerna från lib/database.types.ts
  return createServerClient<Database>(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY!, // Nu ändrad till `NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY`
    {
      cookies: {
        getAll() {
          return cookieStore.getAll();
        },
        setAll(cookiesToSet, _headers) {
          // Understrecket i `_headers` betyder att parametern finns men inte används här. Proxyn sätter cache-headers på svaret istället.
          try {
            cookiesToSet.forEach(({ name, value, options }) =>
              cookieStore.set(name, value, options)
            );
          } catch {
            // Server Components kan inte sätta cookies. Proxyn hanterar det (koden kommer skrivas i `proxy.ts`)
          }
        },
      },
    }
  );
}
