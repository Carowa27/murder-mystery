import { IFoundClues } from '@/lib/interfaces/gameRelated';
import { cookies } from 'next/headers';

const EvidencePage = async ({ params }: { params: Promise<{ investigationId: string }> }) => {
  const { investigationId } = await params;
  // const baseUrl = `/investigation/${investigationId}`;
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
  console.log(data[0]);
  type CluesByType = Record<string, IFoundClues[]>;

  const cluesByType = data.reduce<CluesByType>((groups, clue) => {
    const type = clue.case_clues.clue_types.name;

    groups[type] ??= [];
    groups[type].push(clue);

    return groups;
  }, {});
  console.log(cluesByType);
  return (
    <div className="min-h-[calc(100vh-64px-80px)] bg-[url(/images/backgrounds/evidence-bg.png)] bg-center bg-no-repeat bg-cover flex flex-col justify-center items-center">
      <div
        className={`w-[95%] h-[65vh] bg-[url(/images/item-backgrounds/open-case-v2.png)] bg-contain bg-top-center bg-no-repeat`}
      >
        <nav className="w-[90%] text-surface flex flex-col ps-[12%] pt-12 rotate-1 leading-5.5">
          {Object.entries(cluesByType).map(([type, clues]) => (
            <section key={type} className="rotate-1 ms-4">
              <h3 className="my-2 !font-printed">{type}</h3>

              <ul className="flex flex-col gap-3 !font-printed last:pb-3 ">
                {clues.map((clue) => (
                  <li key={clue.case_clues.id} className="ps-5">
                    {clue.case_clues.title}
                  </li>
                ))}
              </ul>
            </section>
          ))}
        </nav>
      </div>
    </div>
  );
};
export default EvidencePage;
