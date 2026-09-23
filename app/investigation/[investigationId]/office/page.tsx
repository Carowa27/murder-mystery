import { Notebook } from '@/app/components/Notebook';
import { Polaroid } from '../../../components/Polaroid';
import { IGameCharacter } from '@/lib/interfaces/characters';

const OfficePage = async ({ params }: { params: Promise<{ investigationId: string }> }) => {
  const { investigationId } = await params;

  const res = await fetch(`/api/investigations/${investigationId}/office`, {
    cache: 'no-store',
  });

  const data = await res.json();
  const characters: IGameCharacter[] = data.investigation.characters;

  return (
    <div className="relative min-h-[calc(100vh-64px-80px)] bg-[url(/images/backgrounds/office-bg.png)] bg-top-right bg-no-repeat bg-cover">
      <section className="grid grid-flow-col auto-cols-max gap-2 justify-center mx-2 pt-20 -rotate-3">
        {characters.map((p: IGameCharacter, i: number) => (
          <Polaroid c={p} key={i} />
        ))}
      </section>
      <section
        className={`flex items-end justify-center w-screen aspect-[1261/1247] absolute bottom-0 bg-[url(/images/item-backgrounds/desk.png)] bg-bottom bg-no-repeat bg-cover`}
      >
        <Notebook />
      </section>
    </div>
  );
};
export default OfficePage;
