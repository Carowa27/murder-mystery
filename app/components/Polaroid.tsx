'use client';
import { IGameCharacter } from '@/lib/interfaces/gameRelated';
import { CrossIcon, PushPinIcon } from '@phosphor-icons/react';
import Image from 'next/image';
import { useEffect, useState } from 'react';

interface IPolaroidParam {
  c: IGameCharacter;
  showName: boolean;
  showVictim: boolean;
  crossSize: 'small' | 'big' | 'none';
  onWall: boolean;
  width: number;
}

export const Polaroid = ({ c, showName, showVictim, onWall, width, crossSize }: IPolaroidParam) => {
  const [rotation, setRotation] = useState(0);

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setRotation(Math.floor(Math.random() * 6 - 3));
  }, []);

  return (
    <div
      style={{ width: `${width}px` }}
      className={`shadow-sm relative bg-paper p-1 rounded-xs flex flex-col items-center w-[${width}px] aspect-[1/1.215] brightness-70`}
    >
      {onWall && (
        <PushPinIcon size={15} color="#ca220c" weight="fill" className="z-1000 absolute -top-2" />
      )}
      {showVictim && c.is_victim && (
        <>
          {crossSize === 'small' ? (
            <CrossIcon
              size={20}
              color="#000000"
              weight="duotone"
              className="z-1000 absolute bottom-2 right-0"
            />
          ) : (
            <CrossIcon
              size={30}
              color="#000000"
              weight="duotone"
              className="z-1000 absolute bottom-8 right-0"
            />
          )}
        </>
      )}
      <section className="w-[100%] aspect-[1/1]">
        {c.image_url !== null ? (
          <Image
            src={c.image_url}
            alt={`image of ${c.first_name} ${c.last_name}`}
            height={50}
            width={50}
            className="w-[100%]"
          />
        ) : (
          <div className="bg-muted w-full h-full opacity-40"></div>
        )}
      </section>
      {showName && (
        <section
          style={{ transform: `rotate(${rotation}deg)` }}
          className="absolute z-500 bottom-0 px-2 pb-2"
        >
          <p className="text-center !text-sm leading-4.5 text-surface !font-label bg-muted-secondary">
            {c.first_name} {c.last_name}
          </p>
        </section>
      )}
    </div>
  );
};
