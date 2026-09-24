'use client';

import { IGameCharacter } from '@/lib/interfaces/characters';
import Image from 'next/image';

interface IAccusationPhotoParams {
  c: IGameCharacter;
}

export const AccusationPhoto = ({ c }: IAccusationPhotoParams) => {
  return (
    <div className="w-[25%] bg-background p-3 flex flex-col gap-2 rounded-md border-1 border-primary">
      <section className="h-auto w-[100%] aspect-[1/1]">
        {c.image_url !== null ? (
          <Image
            src={c.image_url}
            alt={`image of ${c.first_name} ${c.last_name}`}
            height={50}
            width={50}
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
