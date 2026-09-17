import { createServerClient } from '@supabase/ssr';
import { cookies } from 'next/headers';

export async function createClient() {
  const cookieStore = await cookies();

  return createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!, 
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!, // I dokumentationen vill de ha `NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY` vilket är det nyare namnet. Kan hända att vi ändrar till det i efterhand
    {
      cookies: {
        getAll() {
          return cookieStore.getAll();
        },
        setAll(cookiesToSet, _headers) { // Understrecket i `_headers` betyder att parametern finns men inte används här. Proxyn sätter cache-headers på svaret istället.
          try {
            cookiesToSet.forEach(({ name, value, options }) => 
              cookieStore.set(name, value, options)
            )
          } catch {
            // Server Components kan inte sätta cookies. Proxyn hanterar det (koden kommer skrivas i `proxy.ts`)
          }
        },
      },
    }
  )
}