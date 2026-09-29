'use client';

import { createClient } from '@/lib/supabase/client';

// Egen komponent så att både profilsidan och headern kan använda den.
export const LogoutButton = () => {
  async function handleLogout() {
    const supabase = createClient();
    // local loggar bara ut den här webbläsaren. Utan den loggas man ut på alla enheter.
    await supabase.auth.signOut({ scope: 'local' });
    // En vanlig sidladdning, så att inget från den inloggade ligger kvar i Nexts cache.
    // eslint-disable-next-line @next/next/no-location-assign-relative-destination
    window.location.assign('/login');
  }

  return (
    <button
      type="button"
      onClick={handleLogout}
      className="rounded border border-gold px-6 py-2.5 font-label text-sm uppercase tracking-widest text-gold hover:bg-gold/10 transition-colors cursor-pointer"
    >
      Logga ut
    </button>
  );
};
