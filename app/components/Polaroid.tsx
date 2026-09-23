'use client';
import { IGameCharacter } from '@/lib/interfaces/characters';
import { CrossIcon, PushPinIcon } from '@phosphor-icons/react';
import Image from 'next/image';
import { usePathname } from 'next/navigation';

interface IPolaroidParam {
  c: IGameCharacter;
}

const randomNr = (): number => Math.floor(Math.random() * 6 - 3);

export const Polaroid = ({ c }: IPolaroidParam) => {
  const pathname = usePathname();

  return (
    <>
      {pathname.includes('/office') ? (
        <div className="shadow-sm relative bg-paper p-1 rounded-xs flex flex-col items-center aspect-[1/1.215] brightness-70">
          <PushPinIcon size={17} color="#ca220c" weight="fill" className="z-1000 absolute -top-1" />
          {c.is_victim && (
            <CrossIcon
              size={25}
              color="#000000"
              weight="duotone"
              className="z-1000 absolute bottom-0 right-0"
            />
          )}
          <section className="h-[50px] w-[50px]">
            {c.image_url !== null ? (
              <Image
                src={c.image_url}
                alt={`image of ${c.first_name} ${c.last_name}`}
                height={50}
                width={50}
              />
            ) : (
              <div className="bg-muted h-[100%] w-[100%] opacity-40"></div>
            )}
          </section>
        </div>
      ) : (
        <div className="shadow-md relative bg-paper p-1 rounded-xs flex flex-col items-center justify-between aspect-[1/1.215]">
          <PushPinIcon size={20} color="#ca220c" weight="fill" className="z-1000 absolute -top-2" />
          {c.is_victim && (
            <CrossIcon
              size={35}
              color="#000000"
              weight="duotone"
              className="z-1000 absolute bottom-6 right-0"
            />
          )}
          <section className="h-[100px] w-[100px]">
            {c.image_url !== null ? (
              <Image
                src={c.image_url}
                alt={`image of ${c.first_name} ${c.last_name}`}
                height={100}
                width={100}
              />
            ) : (
              <div className="bg-muted h-[100%] w-[100%] opacity-40"></div>
            )}
          </section>
          <section
            style={{ transform: `rotate(${randomNr()}deg)` }}
            className="absolute z-500 bottom-0 px-2 pb-2"
          >
            <p className="text-center !text-sm leading-4.5 text-surface !font-label bg-muted-secondary">
              {c.first_name} {c.last_name}
            </p>
          </section>
        </div>
      )}
    </>
  );
};
