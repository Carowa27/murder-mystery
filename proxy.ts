import { type NextRequest } from 'next/server'
import { updateSession } from '@/lib/supabase/proxy'

// Kallar på vår proxy funktion i lib/supabase/proxy.ts
export async function proxy(request: NextRequest) {
  return await updateSession(request)
}

// Men inte på varenda request! Skippa _next/static, _next/image, favicon.ico, bilder etc.; sånt som inte behöver auth!
export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     * Feel free to modify this pattern to include more paths.
     */
    '/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)',
  ],
}