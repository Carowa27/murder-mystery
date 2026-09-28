'use client';

import { useRouter } from 'next/navigation';
import { createClient } from '@/lib/supabase/client';

// Egen komponent så att både profilsidan och headern kan använda den.
export const LogoutButton = () => {
  const router = useRouter();

  async function handleLogout() {
    const supabase = createClient();
    // local loggar bara ut den här webbläsaren. Utan den loggas man ut på alla enheter.
    await supabase.auth.signOut({ scope: 'local' });
    router.push('/login');
    // Tömmer det Next redan har hämtat, så att inget från den inloggade ligger kvar.
    router.refresh();
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
