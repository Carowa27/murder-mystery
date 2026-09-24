import { cookies } from 'next/headers';

import { Notebook } from '@/app/components/Notebook';
import { Polaroid } from '@/app/components/Polaroid';
import { IGameCharacter } from '@/lib/interfaces/gameRelated';

const OfficePage = async ({ params }: { params: Promise<{ investigationId: string }> }) => {
  const { investigationId } = await params;
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
    <div className="relative min-h-[calc(100vh-64px-80px)] bg-[url(/images/backgrounds/office-bg.png)] bg-top-right bg-no-repeat bg-cover">
      <section className="w-[75%] flex flex-wrap justify-center gap-2 mx-auto pt-[16%] -rotate-3">
        {/* <section className="grid grid-flow-col auto-cols-max gap-2 justify-center mx-2 pt-[16%] -rotate-3"> */}
        {characters.map((p: IGameCharacter, i: number) => (
          <Polaroid c={p} key={i} />
        ))}
      </section>
      <section
        className={`flex items-end justify-center w-[100%] aspect-[1261/1247] absolute bottom-0 bg-[url(/images/item-backgrounds/desk.png)] bg-bottom bg-no-repeat bg-cover`}
      >
        <Notebook />
      </section>
    </div>
  );
};
export default OfficePage;
