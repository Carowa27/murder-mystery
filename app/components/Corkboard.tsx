'use client';

import { IGameCharacter } from '@/lib/interfaces/gameRelated';
import { Polaroid } from './Polaroid';
import { useParams } from 'next/navigation';
import Link from 'next/link';

interface IParams {
  characters: IGameCharacter[];
}

// cqw till skillnad mot vw sätter sin bredd i procent mot närmsta föräldern med @container, inte hela skärmen.
// Ett foto är 12.5cqw brett, alltså en åttondel av tavlan, oavsett
// hur stor skärmen är.
//
// Alla fall får samma storlek på fotona, så att det största fallet (nio
// personer) ryms i tre rader med tre foton. Raden är 43cqw: tre foton på
// 12.5cqw plus två mellanrum på 2.5cqw. Då bryter raden efter tre foton,
// och en sista rad som inte är full hamnar i mitten.
export const Corkboard = ({ characters }: IParams) => {
  const params = useParams();
  const investigationId = params.investigationId as string;
  const baseUrl = `/investigation/${investigationId}`;

  return (
    <Link href={`${baseUrl}/characters`}>
      <section className="@container relative aspect-[1536/1024] w-full bg-[url(/images/item-backgrounds/corkboard.png)] bg-cover">
        {/* top-[12%] lägger fotona precis under lampan. */}
        <div className="absolute top-[12%] left-1/2 flex w-[43cqw] -translate-x-1/2 flex-wrap justify-center gap-[2.5cqw]">
          {characters &&
            characters.map((p: IGameCharacter, i: number) => (
              <div key={i} className="w-[12.5cqw]">
                <Polaroid
                  c={p}
                  showName={false}
                  showVictim={true}
                  onWall={true}
                  width={'100%'}
                  crossSize={'small'}
                />
              </div>
            ))}
        </div>
      </section>
    </Link>
  );
};
