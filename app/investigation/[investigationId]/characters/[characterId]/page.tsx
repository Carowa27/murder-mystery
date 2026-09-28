import { BackLink } from '@/app/components/BackLink';
import { Polaroid } from '@/app/components/Polaroid';
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

  return (
    <div className="relative w-full min-h-[calc(100vh-64px-80px)] bg-[url(/images/backgrounds/evidence-bg.png)] bg-center bg-no-repeat bg-cover flex flex-col justify-end">
      <BackLink linkUrl={`${baseUrl}/characters`} linkText={'Karaktärer'} />
      <div className="h-[90vh] w-[100%] overflow-hidden">
        <div className="h-[90%] aspect-[1438/979] -ms-10 mt-12 rotate-3 bg-[url(/images/item-backgrounds/open-case.png)] bg-cover bg-no-repeat">
          <div className="relative h-[80%] ms-24 pt-18 rotate-2 text-surface max-w-[80vw]">
            <h1 className="!font-printed">
              {character.first_name} {character.last_name}
            </h1>
            <div className="flex py-3">
              <p className="!font-printed">Relation till den avlidne: </p>
              <p className="capitalize"> {character.relationship}</p>
            </div>
            <p className="!font-printed">{character.description}</p>
            <div className="absolute bottom-0 right-5 rotate-10">
              <Polaroid
                c={character}
                showName={false}
                showVictim={false}
                onWall={false}
                width={200}
                crossSize={'none'}
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
export default CharacterSpecificPage;
