import { BackLink } from '@/app/components/BackLink';
import { Polaroid } from '@/app/components/Polaroid';
import { ScalableImageBox } from '@/app/components/ScalableImageBox';
import { IGameCharacter } from '@/lib/interfaces/gameRelated';
import { cookies } from 'next/headers';

const CharacterSpecificPage = async ({
  params,
}: {
  params: Promise<{ investigationId: string; characterId: string }>;
}) => {
  const { investigationId, characterId } = await params;
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
  const character: IGameCharacter = data.characters.find(
    (character: IGameCharacter) => character.id === characterId
  );
  const baseUrl = `/investigation/${investigationId}`;

  // Personen visas i samma mapp som Bevismaterial. Mappen är alltid lika stor,
  // och blir texten lång scrollar den inuti mappen.
  return (
    <div className="relative flex min-h-[calc(100vh-64px-80px)] items-center justify-center bg-[url(/images/backgrounds/evidence-bg.png)] bg-cover bg-center px-3 pt-14 pb-6">
      <BackLink linkUrl={`${baseUrl}/characters`} linkText={'Karaktärer'} />
      <ScalableImageBox
        image="/images/item-backgrounds/open-case-v2.png"
        slice="115 110 180 135"
        edge="58px 55px 90px 68px"
        className="h-[68vh] w-full max-w-md -rotate-1 drop-shadow-[0_12px_24px_rgba(0,0,0,0.7)]"
      >
        <div className="h-full pt-16 pr-10 pb-12 pl-12">
          <div className="h-full overflow-y-auto pr-1 text-surface scrollbar-thin">
            {/* float-right lägger fotot till höger, och namnet ställer sig bredvid
                i stället för att hamna under eller bakom fotot. */}
            <div className="float-right mb-3 ml-3 rotate-3">
              <Polaroid
                c={character}
                showName={false}
                showVictim={true}
                onWall={false}
                width={110}
                crossSize={'small'}
              />
            </div>

            <h2 className="font-printed! leading-9">
              {character.first_name} {character.last_name}
            </h2>

            {/* Offret har ingen relation till sig själv, så där står det Offret i stället. */}
            <div className="mt-3 font-printed text-sm">
              {character.is_victim
                ? 'Offret'
                : `Relation till den avlidne: ${character.relationship}`}
            </div>

            {/* clear-right gör att beskrivningen börjar under fotot och får hela bredden. */}
            <p className="clear-right pt-4 font-printed! leading-6">{character.description}</p>
          </div>
        </div>
      </ScalableImageBox>
    </div>
  );
};
export default CharacterSpecificPage;
