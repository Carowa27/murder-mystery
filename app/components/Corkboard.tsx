'use client';

import { IGameCharacter } from '@/lib/interfaces/gameRelated';
import { Polaroid } from './Polaroid';
import { useParams } from 'next/navigation';
import Link from 'next/link';

interface IParams {
  characters: IGameCharacter[];
}

export const Corkboard = ({ characters }: IParams) => {
  const params = useParams();
  const investigationId = params.investigationId as string;
  const baseUrl = `/investigation/${investigationId}`;

  return (
    <Link href={`${baseUrl}/characters`}>
      <section className="w-[100%] aspect-[1536/1024] pt-[10%] bg-[url(/images/item-backgrounds/corkboard.png)] bg-top-right bg-no-repeat bg-cover">
        {/* <section className="grid grid-flow-col auto-cols-max gap-2 justify-center mx-2 pt-[16%] -rotate-3"> */}
        <div className="w-[75%] flex flex-wrap justify-center gap-2 mx-auto">
          {characters.map((p: IGameCharacter, i: number) => (
            <Polaroid c={p} key={i} />
          ))}
        </div>
      </section>
    </Link>
  );
};
