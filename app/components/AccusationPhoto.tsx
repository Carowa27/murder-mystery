'use client';

import { IGameCharacter } from '@/lib/interfaces/gameRelated';
import Image from 'next/image';

interface IAccusationPhotoParams {
  c: IGameCharacter;
}

export const AccusationPhoto = ({ c }: IAccusationPhotoParams) => {
  return (
    <div className="w-[25%] bg-background p-3 flex flex-col gap-2 rounded-md border-1 border-primary">
      <section className="relative h-auto w-[100%] aspect-[1/1] overflow-hidden">
        {c.image_url !== null ? (
          // fill gör att porträttet fyller hela rutan, hur stor rutan än blir.
          // Det kräver att rutan runt är relative. object-cover beskär bilden
          // i kanterna i stället för att töja den.
          <Image
            src={c.image_url}
            alt={`image of ${c.first_name} ${c.last_name}`}
            fill
            sizes="(max-width: 768px) 30vw, 160px"
            className="object-cover"
          />
        ) : (
          <div className="bg-muted h-[100%] w-[100%] opacity-100"></div>
        )}
      </section>
      <section className="h-9 flex items-center">
        <p className="text-center !text-sm leading-4.5 text-text-secondary !font-label">
          {c.first_name} {c.last_name}
        </p>
      </section>
    </div>
  );
};
