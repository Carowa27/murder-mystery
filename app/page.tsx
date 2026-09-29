import Image from 'next/image';
import Link from 'next/link';
import { createClient } from '@/lib/supabase/server';
import { getCurrentUser } from '@/lib/supabase/auth';

export default async function Home() {
  const user = await getCurrentUser();
  const supabase = await createClient();

  const { data: profile } = await supabase
    .from('profiles')
    .select('display_name')
    .eq('id', user?.sub ?? '')
    .maybeSingle();

  const name = profile?.display_name ?? 'detektiv';

  return (
    <div className="flex flex-col items-center gap-6 py-16 text-center">
      <Image
        src="/images/logotype/logo-full.png"
        alt="Nocturne"
        width={1212}
        height={1212}
        sizes="256px"
        preload
        className="w-64 h-auto"
      />

      <h1 className="text-gold">Välkommen, {name}</h1>
      <div className="max-w-sm text-text-secondary">
        Nya fall väntar på byrån. Samla ditt team och sätt mördaren bakom lås och bom.
      </div>

      <Link
        href="/team"
        className="rounded bg-btn-primary px-6 py-3 hover:opacity-90 transition-opacity"
      >
        <div className="font-label font-bold text-sm uppercase tracking-widest text-background">
          Börja spela
        </div>
      </Link>
    </div>
  );
}
