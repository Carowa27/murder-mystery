import Image from 'next/image';
import Link from 'next/link';
import { StorefrontIcon, UserCircleIcon } from '@phosphor-icons/react/ssr';
import { getCurrentUser } from '@/lib/supabase/auth';
import { LogoutButton } from '@/app/components/LogoutButton';

// async eftersom headern frågar servern om någon är inloggad. Butiken, Profil
// och Logga ut visas bara för inloggade. Ikonen hämtas från /ssr eftersom
// headern är en serverkomponent.
export const Header = async () => {
  const user = await getCurrentUser();

  return (
    <header className="w-full h-[64px] flex justify-between items-center  bg-background text-text-primary position-absolute top-0 sticky z-1000 ">
      <section>
        <Link href="/">
          <Image
            src="/images/logotype/logo-minimal.png"
            height={60}
            width={60}
            alt="Nocturne logotype"
            className="ms-2"
          />
        </Link>
      </section>
      <section className="flex items-center gap-4 px-4 py-2">
        {user && (
          <>
            <Link
              href="/shop"
              aria-label="Butik"
              className="text-gold hover:text-gold-light transition-colors"
            >
              <StorefrontIcon size={24} />
            </Link>
            <Link
              href="/profile"
              aria-label="Profil"
              className="text-gold hover:text-gold-light transition-colors"
            >
              <UserCircleIcon size={24} />
            </Link>
            <LogoutButton />
          </>
        )}
      </section>
    </header>
  );
};
