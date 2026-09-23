import { Notebook } from '@/app/components/Notebook';
import { Polaroid } from '@/app/components/Polaroid';
import { IGameCharacter } from '@/lib/interfaces/characters';

const OfficePage = async ({ params }: { params: Promise<{ investigationId: string }> }) => {
  const { investigationId } = await params;

  // const res = await fetch(`/api/investigations/${investigationId}/office`, {
  //   cache: 'no-store',
  // });

  // const data = await res.json();
  // const characters: IGameCharacter[] = data.investigation.characters;
  const characters = [
    {
      first_name: 'Rosa',
      last_name: 'Pantern',
      relationship: 'panter hallucination',
      description: 'tydlig hallucination som borde lämnat Clouseau för länge sedan',
      image_url: null,
      is_guilty: false,
      is_victim: false,
    },
    {
      first_name: 'Hercule',
      last_name: 'Poirot',
      relationship: 'detektiv',
      description: 'ser allt, glömmer inget',
      image_url: null,
      is_guilty: false,
      is_victim: false,
    },
    {
      first_name: 'Jacques',
      last_name: 'Clouseau',
      relationship: 'polis',
      description: 'klumpig och naiv fransk polis',
      image_url: null,
      is_guilty: false,
      is_victim: true,
    },
    {
      first_name: 'Jack',
      last_name: 'Gaston',
      relationship: 'Tjuvjägare',
      description: 'Kvinnokarl',
      image_url: null,
      is_guilty: true,
      is_victim: false,
    },
    {
      first_name: 'Jack',
      last_name: 'Gaston',
      relationship: 'Tjuvjägare',
      description: 'Kvinnokarl',
      image_url: null,
      is_guilty: true,
      is_victim: false,
    },
    {
      first_name: 'Jack',
      last_name: 'Gaston',
      relationship: 'Tjuvjägare',
      description: 'Kvinnokarl',
      image_url: null,
      is_guilty: true,
      is_victim: false,
    },
  ];

  return (
    <div className="relative min-h-[calc(100vh-64px-80px)] bg-[url(/images/backgrounds/office-bg.png)] bg-top-right bg-no-repeat bg-cover">
      <section className="w-[75%] flex flex-wrap justify-center gap-2 mx-auto pt-[16%] -rotate-3">
        {/* <section className="grid grid-flow-col auto-cols-max gap-2 justify-center mx-2 pt-[16%] -rotate-3"> */}
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
