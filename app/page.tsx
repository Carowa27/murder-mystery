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

  // Har något av användarens team en pågående utredning står det Fortsätt spela.
  // Först lagen man är med i, sedan om något av dem har en utredning som pågår.
  const { data: memberships } = await supabase
    .from('team_members')
    .select('team_id')
    .eq('user_id', user?.sub ?? '');
  const teamIds = (memberships ?? []).map((m) => m.team_id);

  let hasOngoing = false;
  if (teamIds.length > 0) {
    const { count } = await supabase
      .from('investigations')
      .select('id', { count: 'exact', head: true })
      .in('team_id', teamIds)
      .in('status', ['active', 'paused']);
    hasOngoing = (count ?? 0) > 0;
  }

  return (
    <div className="flex flex-col items-center gap-6 py-16 text-center">
      <Image
        src="/images/logotype/logo-full.webp"
        alt="Nocturne"
        width={1212}
        height={1212}
        sizes="256px"
        preload
        className="w-64 h-auto"
      />

      <h1 className="text-gold">Välkommen, {name}</h1>
      <div className="max-w-sm text-text-secondary">
        Nya fall väntar på byrån. Spela själv eller samla ditt team och sätt mördaren bakom lås och
        bom.
      </div>

      <Link
        href="/team"
        className="rounded bg-btn-primary px-6 py-3 hover:opacity-90 transition-opacity"
      >
        <div className="font-label font-bold text-sm uppercase tracking-widest text-background">
          {hasOngoing ? 'Fortsätt spela' : 'Börja spela'}
        </div>
      </Link>
      <Link href={'/user-guide'}>
        Läs vår <span className="text-gold">spel guide</span> för att enklare sätta igång!
      </Link>
    </div>
  );
}
