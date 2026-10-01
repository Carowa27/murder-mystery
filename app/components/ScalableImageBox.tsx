import type { ReactNode } from 'react';

interface IParams {
  image: string;
  slice: string;
  edge: string;
  layerClassName?: string;
  className?: string;
  children: ReactNode;
}

// Lägger en bild, till exempel ett papper eller en mapp, som bakgrund i en
// ruta som kan ha vilken storlek som helst. Med en vanlig bakgrundsbild töjs
// hela bilden, så gemet i hörnet blir utdraget. Här behåller hörnen sin form,
// och det är bara mitten av bilden som töjs när rutan blir större.
//
// slice: hur långt in från kanterna i bildfilen hörnen går, i pixlar, i
// ordningen topp, höger, botten, vänster. Mappen använder '115 110 180 135',
// så att gemet uppe till vänster räknas som hörn och aldrig töjs.
//
// edge: hur stora hörnen blir på skärmen, till exempel '58px 55px 90px 68px'.
//
// layerClassName: klasser som bara ska gälla bilden, till exempel brightness-140.
// className: klasser för hela rutan, till exempel storlek och rotation.
export const ScalableImageBox = ({
  image,
  slice,
  edge,
  layerClassName = '',
  className = '',
  children,
}: IParams) => {
  return (
    <div className={`relative ${className}`}>
      {/* Bilden ligger i ett eget lager bakom innehållet. border-image är
          CSS:ens eget sätt att dela en bild i hörn, kanter och mitt. */}
      <div
        aria-hidden
        className={`absolute inset-0 ${layerClassName}`}
        style={{
          borderStyle: 'solid',
          borderWidth: edge,
          borderImage: `url(${image}) ${slice} fill / ${edge} stretch`,
        }}
      />
      <div className="relative h-full">{children}</div>
    </div>
  );
};
