import Image from 'next/image';
import type { ReactNode } from 'react';

interface IParams {
  background: string;
  image: string;
  width: number;
  height: number;
  children: ReactNode;
}

// Två lager: background (rummet) fyller hela ytan, image (bordet) visas alltid
// helt i mitten. Barnen placeras i procent av bordsbilden, så en stol hamnar
// alltid på stolen. Lådor med position: fixed måste ligga utanför Scene.
export const Scene = ({ background, image, width, height, children }: IParams) => {
  return (
    <div className="absolute inset-0 flex items-center justify-center @container-size">
      {/* object-top så att fönstret syns även när rummet beskärs. */}
      <Image
        src={background}
        alt=""
        fill
        priority
        sizes="100vw"
        className="object-cover object-top"
      />

      {/* Bordet: lika högt som ytan, men aldrig bredare än 96 procent av den. */}
      <div
        className="@container relative shrink-0"
        style={{
          width: `min(calc(100cqh * ${width} / ${height}), 96cqw)`,
          aspectRatio: `${width} / ${height}`,
        }}
      >
        <Image
          src={image}
          alt=""
          fill
          priority
          sizes="100vw"
          className="drop-shadow-[0_18px_28px_rgba(0,0,0,0.65)]"
        />
        {children}
      </div>
    </div>
  );
};
