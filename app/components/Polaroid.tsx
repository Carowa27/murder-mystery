'use client';
import { CrossIcon, PushPinIcon } from '@phosphor-icons/react';
import Image from 'next/image';
import { usePathname } from 'next/navigation';

interface IPolaroidParam {
  c: IUser;
}
interface IUser {
  first_name: string;
  last_name: string;
  relationship: string;
  description: string;
  image_url: string | null;
  is_guilty: boolean;
  is_victim: boolean;
}

export const Polaroid = ({ c }: IPolaroidParam) => {
  const pathname = usePathname();
  return (
    <>
      {pathname.includes('/office') ? (
        <div className="shadow-sm relative bg-paper p-1 rounded-xs flex flex-col items-center aspect-[1/1.215]">
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
              <Image src={c.image_url} alt={`image of ${c.first_name} ${c.last_name}`} fill />
            ) : (
              <div className="bg-muted h-[100%] w-[100%]"></div>
            )}
          </section>
        </div>
      ) : (
        <div className="shadow-sm relative bg-paper p-1 rounded-xs flex flex-col items-center justify-between aspect-[1/1.215]">
          <PushPinIcon size={17} color="#ca220c" weight="fill" className="z-1000 absolute -top-1" />
          {c.is_victim && (
            <CrossIcon
              size={25}
              color="#000000"
              weight="duotone"
              className="z-1000 absolute bottom-0 right-0"
            />
          )}
          <section className="h-[100px] w-[100px]">
            {c.image_url !== null ? (
              <Image src={c.image_url} alt={`image of ${c.first_name} ${c.last_name}`} fill />
            ) : (
              <div className="bg-muted h-[100%] w-[100%]"></div>
            )}
          </section>
          <section className="">
            <p className="text-center !text-xs leading-4.5 text-surface !font-label">
              {c.first_name} {c.last_name}
            </p>
          </section>
        </div>
      )}
    </>
  );
};
