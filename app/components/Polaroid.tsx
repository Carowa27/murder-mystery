'use client';
import { IGameCharacter } from '@/lib/interfaces/gameRelated';
import { PushPinIcon } from '@phosphor-icons/react';
import Image from 'next/image';
import { useEffect, useState } from 'react';

interface IPolaroidParam {
  c: IGameCharacter;
  showName: boolean;
  showVictim: boolean;
  onWall: boolean;
  // Ett tal betyder pixlar, till exempel 110. En text används som den står,
  // till exempel '100%' när fotot ska fylla sin plats i ett rutnät.
  width: number | string;
  // Namnet som suddigt klotter på remsan under fotot, för foton som ses på håll.
  // Används med showName={false}, så att polaroiden behåller sin fasta form.
  scribbleName?: boolean;
}

export const Polaroid = ({
  c,
  showName,
  showVictim,
  onWall,
  width,
  scribbleName = false,
}: IPolaroidParam) => {
  const [rotation, setRotation] = useState(0);
  const isDead = showVictim && c.is_victim;

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
      {/* @container gör att cqw nedan räknas på fotots bredd, så lappen
          blir lika stor i förhållande till fotot hur litet det än är. */}
      <section className="@container relative w-[100%] aspect-[1/1]">
        {c.image_url !== null ? (
          <Image
            src={c.image_url}
            alt={`image of ${c.first_name} ${c.last_name}`}
            // Next hämtar bilden i ungefär den här storleken. Med 50 blev fotona
            // suddiga så fort de visades större än 50 pixlar.
            height={400}
            width={400}
            sizes="(max-width: 768px) 50vw, 240px"
            className={`w-[100%] ${isDead ? 'grayscale' : ''}`}
          />
        ) : (
          <div className="bg-muted w-full h-full opacity-40"></div>
        )}
        {/* Den avlidne visas svartvit, med en klisterlapp snett i vänstra hörnet.
            Ett div och inte ett span, eftersom globals.css skriver över typsnitt
            och storlek på span. */}
        {isDead && (
          <div
            aria-hidden
            className="absolute top-[-3cqw] left-[-5cqw] -rotate-12 bg-paper px-[3cqw] py-[1.5cqw] font-handwritten text-[13cqw] font-bold leading-none text-black shadow-sm"
          >
            OFFER
          </div>
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
      {/* cqw räknas här mot tavlan (Corkboard), inte mot fotot. Remsan under
          fotot är ungefär 2.7cqw plus 4px hög, och blur gör texten suddig. */}
      {scribbleName && (
        <div
          style={{ transform: `rotate(${rotation}deg)` }}
          className="absolute inset-x-0 bottom-0 flex h-[calc(2.7cqw+4px)] items-center justify-center px-[0.5cqw] text-center font-handwritten text-[1.3cqw] leading-none text-surface blur-[0.1cqw]"
        >
          {c.first_name} {c.last_name}
        </div>
      )}
    </div>
  );
};
