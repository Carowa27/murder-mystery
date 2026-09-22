import { createClient } from '@/lib/supabase/server';

export async function getCurrentUser() {
  const supabase = await createClient();

  // getClaims() runs locally to answer the question "Is the user authenticated?".
  // getUser() could work too but it would make a network request to the Auth server.
  // getClaims() works best for this function to protect routes.
  const { data, error } = await supabase.auth.getClaims();

  // Returns the JWT claims (including sub, email, role) if authenticated, or null if not
  if (error || !data?.claims) {
    return null;
  }

  return data.claims;
}
