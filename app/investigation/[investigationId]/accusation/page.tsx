import { AccusationPhoto } from '@/app/components/AccusationPhoto';
import { IGameCharacter } from '@/lib/interfaces/gameRelated';
import { cookies } from 'next/headers';

const InvestigationPage = async ({ params }: { params: Promise<{ investigationId: string }> }) => {
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
    <div className="min-h-[calc(100vh-64px-80px)] flex bg-[url(/images/backgrounds/accusation-bg.png)] bg-center bg-no-repeat bg-cover">
      <section className="w-[90%] flex flex-wrap self-end justify-center items-center gap-2 mx-auto mb-10">
        {characters.map((c, i) => c.is_victim === false && <AccusationPhoto key={i} c={c} />)}
      </section>
    </div>
  );
};
export default InvestigationPage;
