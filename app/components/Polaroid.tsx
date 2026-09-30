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
  // Ett tal betyder pixlar, till exempel 110. En text används som den står,
  // till exempel '100%' när fotot ska fylla sin plats i ett rutnät.
  width: number | string;
}

export const Polaroid = ({ c, showName, showVictim, onWall, width, crossSize }: IPolaroidParam) => {
  const [rotation, setRotation] = useState(0);

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setRotation(Math.floor(Math.random() * 6 - 3));
  }, []);

  return (
    <div
      style={{ width: typeof width === 'number' ? `${width}px` : width }}
      // Med namn bestäms höjden av fotot plus namnet under. Utan namn har
      // polaroiden fast form, med en tom pappersremsa under fotot.
      className={`shadow-sm relative bg-paper p-1 rounded-xs flex flex-col items-center w-[${width}px] ${showName ? '' : 'aspect-[1/1.215]'} brightness-70`}
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
            // Next hämtar bilden i ungefär den här storleken. Med 50 blev fotona
            // suddiga så fort de visades större än 50 pixlar.
            height={400}
            width={400}
            sizes="(max-width: 768px) 50vw, 240px"
            className="w-[100%]"
          />
        ) : (
          <div className="bg-muted w-full h-full opacity-40"></div>
        )}
      </section>
      {/* Namnet står handskrivet på pappret under fotot, som på ett riktigt
          polaroidfoto, i stället för på en lapp ovanpå fotot. min-h-[2.4em]
          ger plats för två rader, så att alla foton blir lika höga även när
          ett namn får plats på en rad. */}
      {showName && (
        <div
          style={{ transform: `rotate(${rotation}deg)` }}
          className="flex min-h-[2.4em] w-full items-center justify-center px-1 pt-1 text-center font-handwritten text-lg leading-none text-surface"
        >
          {c.first_name} {c.last_name}
        </div>
      )}
    </div>
  );
};
