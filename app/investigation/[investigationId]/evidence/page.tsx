import { EvidenceLink } from '@/app/components/EvidenceLink';
import { ScalableImageBox } from '@/app/components/ScalableImageBox';
import { IFoundClues } from '@/lib/interfaces/gameRelated';
import { cookies } from 'next/headers';

const EvidencePage = async ({ params }: { params: Promise<{ investigationId: string }> }) => {
  const { investigationId } = await params;
  const cookieStore = await cookies();

  const res = await fetch(
    `${process.env.NEXT_PUBLIC_SITE_URL}/api/investigations/${investigationId}/evidence`,
    {
      headers: {
        Cookie: cookieStore.toString(),
      },
      cache: 'no-store',
    }
  );

  const data: IFoundClues[] = await res.json();

  type CluesByType = Record<string, IFoundClues[]>;

  const cluesByType = data.reduce<CluesByType>((groups, clue) => {
    const type = clue.case_clues.clue_types.name;

    groups[type] ??= [];
    groups[type].push(clue);

    return groups;
  }, {});

  // Mappen är alltid lika stor (68 procent av skärmhöjden). Blir listan för
  // lång scrollar den inuti mappen i stället för att rinna ut över kanten.
  // Siffrorna i slice och edge förklaras i ScalableImageBox.
  return (
    <div className="flex min-h-[calc(100vh-64px-80px)] items-center justify-center bg-[url(/images/backgrounds/evidence-bg.png)] bg-cover bg-center px-3 py-6">
      <ScalableImageBox
        image="/images/item-backgrounds/open-case-v2.png"
        slice="115 110 180 135"
        edge="58px 55px 90px 68px"
        className="h-[68vh] w-full max-w-md rotate-1 drop-shadow-[0_12px_24px_rgba(0,0,0,0.7)]"
      >
        {/* Marginalen håller texten på pappret, under gemet och innanför kanterna.
            overflow-y-auto på listan gör att den scrollar när den inte får plats. */}
        <div className="h-full pt-16 pr-10 pb-12 pl-12">
          <nav className="flex h-full flex-col gap-6 overflow-y-auto pr-1 text-surface scrollbar-thin">
            {Object.entries(cluesByType).map(([type, clues]) => (
              <section key={type}>
                <h3 className="!font-printed leading-7">{type}</h3>

                <ul className="mt-2 flex flex-col gap-3 leading-5">
                  {clues.map((clue) => (
                    <EvidenceLink key={clue.case_clues.id} clue={clue} />
                  ))}
                </ul>
              </section>
            ))}
          </nav>
        </div>
      </ScalableImageBox>
    </div>
  );
};
export default EvidencePage;
