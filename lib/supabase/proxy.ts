import { createServerClient } from '@supabase/ssr';
import { NextResponse, type NextRequest } from 'next/server';

/*
  Denna proxy kod körs *innan* någon client är skapad i server.ts eller client.ts i respons till en Server Component / Route Handler etc.
  Det känns konstigt att både denna och server.ts importerar `createServerClient` och skapar dess egna klienter men det är anledningen.
  Det är två helt separata klienter som aldrig pratar med varandra som körs i olika skeden av the request lifecycle. Från Claude Code:
  1. User submits the registration form
  2. Proxy runs — sees no existing session (new user), nothing to refresh, passes the request through
  3. Route Handler (POST /api/auth/register) runs — uses your server.ts client to call supabase.auth.signUp(), which creates the user and returns a session with cookies
  4. On the next request (e.g. redirect to a dashboard), the Proxy runs again — now it sees the session cookie from step 3, validates/refreshes it, and keeps the user signed in going forward
*/

export async function updateSession(request: NextRequest) {
  let supabaseResponse = NextResponse.next({ request }); // `.next()` för förbereda en ny NextResponse som cookies och headers skrivs till längre ner. `let` istället för `const` är viktigt här!

  // Liknar `createServerClient` i server.ts men hanterar cookies via request/response istället för Next.js cookies() API
  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY!,
    {
      cookies: {
        getAll() {
          return request.cookies.getAll();
        },
        setAll(cookiesToSet, headers) {
          cookiesToSet.forEach(({ name, value }) => request.cookies.set(name, value));
          supabaseResponse = NextResponse.next({
            request,
          });
          cookiesToSet.forEach(({ name, value, options }) =>
            supabaseResponse.cookies.set(name, value, options)
          );
          Object.entries(headers).forEach(([key, value]) =>
            supabaseResponse.headers.set(key, value)
          );
        },
      },
    }
  );

  const { data } = await supabase.auth.getClaims(); // `.getClaims()` är en heavy duty funktion som verifierar JWT åt oss och förnyar sessionen om den håller på att gå ut!

  const user = data?.claims;

  if (
    !user &&
    !request.nextUrl.pathname.startsWith('/login') &&
    !request.nextUrl.pathname.startsWith('/auth')
  ) {
    // Ingen giltig användare. Redirect till /login
    const url = request.nextUrl.clone();
    url.pathname = '/login';
    return NextResponse.redirect(url);
  }

  // Från Supabase docs: "IMPORTANT: You *must* return the supabaseResponse object as it is"
  return supabaseResponse;
}
