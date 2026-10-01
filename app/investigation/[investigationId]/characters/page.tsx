import { Polaroid } from '@/app/components/Polaroid';
import { IGameCharacter } from '@/lib/interfaces/gameRelated';
import { cookies } from 'next/headers';
import Link from 'next/link';

const CharacterPage = async ({ params }: { params: Promise<{ investigationId: string }> }) => {
  const { investigationId } = await params;
  const baseUrl = `/investigation/${investigationId}`;
  const cookieStore = await cookies();

  const res = await fetch(
    `${process.env.NEXT_PUBLIC_SITE_URL}/api/investigations/${investigationId}/office`,
    {
      headers: {
        Cookie: cookieStore.toString(),
      },
      cache: 'no-store',
    }
  );

  const data = await res.json();
  const characters: IGameCharacter[] = data.characters;

  return (
    // bg-top så att lampan högst upp i bilden alltid syns.
    <div className="min-h-[calc(100vh-64px-80px)] bg-[url(/images/backgrounds/character-overview-bg.png)] bg-top bg-no-repeat bg-cover">
      {/* Tre foton per rad. Då ryms även det största fallet, nio personer, utan
          att man behöver scrolla. calc((100%-2rem)/3) är en tredjedel av raden
          minus de två mellanrummen på 1rem. Blir sista raden inte full hamnar
          fotona i mitten tack vare justify-center.
          Lampan slutar ungefär 8 procent ner i bilden. På höga, smala skärmar
          följer bilden höjden, så då räknas avståndet ovanför fotona på höjden. */}
      <section className="mx-auto flex max-w-md flex-wrap justify-center gap-x-4 gap-y-6 px-4 pt-[max(16%,calc((100vh-144px)*0.1))] pb-8">
        {characters &&
          characters.map((p, i) => (
            <Link
              key={i}
              href={`${baseUrl}/characters/${p.id}`}
              className="w-[calc((100%-2rem)/3)]"
            >
              <Polaroid
                c={p}
                key={i}
                showName={true}
                showVictim={true}
                onWall={true}
                width={'100%'}
                crossSize={'big'}
              />
            </Link>
          ))}
      </section>
    </div>
  );
};
export default CharacterPage;
