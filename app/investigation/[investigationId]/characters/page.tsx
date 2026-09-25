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
    <div className="min-h-[calc(100vh-64px-80px)] bg-[url(/images/backgrounds/character-overview-bg.png)] bg-center bg-no-repeat bg-cover">
      <section className="flex flex-wrap justify-center gap-x-2 gap-y-5 mx-2 pt-[16%]">
        {/* <section className="grid grid-flow-col auto-cols-max gap-2 justify-center mx-2 pt-[16%]"> */}
        {characters &&
          characters.map((p, i) => (
            <Link key={i} href={`${baseUrl}/characters/${p.id}`}>
              <Polaroid
                c={p}
                key={i}
                showName={true}
                showVictim={true}
                onWall={true}
                width={100}
                crossSize={'big'}
              />
            </Link>
          ))}
      </section>
    </div>
  );
};
export default CharacterPage;
