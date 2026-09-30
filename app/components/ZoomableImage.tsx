'use client';

import { XIcon } from '@phosphor-icons/react';
import Image from 'next/image';
import { useState } from 'react';
import { createPortal } from 'react-dom';

interface IParams {
  src: string;
  alt: string;
}

// En bild i en ledtråd som går att förstora:
// 1. Tryck på bilden, så öppnas den över hela skärmen.
// 2. Tryck igen, så zoomas den in och man kan dra runt för att läsa detaljer.
// 3. Tryck en gång till för att zooma ut. Krysset eller ett tryck utanför stänger.
//
// Helskärmsrutan läggs med createPortal direkt i <body>, inte bredvid bilden.
// Pappret som bilden ligger på är snett (roterat), och då skulle rutan också
// bli sned och bara täcka pappret i stället för hela skärmen.
export const ZoomableImage = ({ src, alt }: IParams) => {
  const [open, setOpen] = useState(false);
  const [zoomed, setZoomed] = useState(false);

  function close() {
    setOpen(false);
    setZoomed(false);
  }

  return (
    <>
      <button
        onClick={() => setOpen(true)}
        aria-label={`Förstora bilden ${alt}`}
        className="shrink-0 cursor-zoom-in"
      >
        <Image src={src} alt={alt} width={400} height={300} className="h-auto w-full" />
      </button>

      {/* z-2000 så att rutan hamnar ovanför spelmenyn längst ner, som har z-1000. */}
      {open &&
        createPortal(
          <div
            role="dialog"
            aria-modal="true"
            aria-label={alt}
            onClick={close}
            className="fixed inset-0 z-2000 flex flex-col bg-black/90"
          >
            <div className="flex justify-end p-3">
              <button onClick={close} aria-label="Stäng" className="cursor-pointer text-white">
                <XIcon size={32} />
              </button>
            </div>

            {/* Inzoomad är bilden två och en halv gånger så bred som skärmen, och
                overflow-auto gör att man kan dra runt i den. */}
            <div
              className={`flex-1 overflow-auto ${zoomed ? '' : 'flex items-center justify-center'}`}
            >
              <Image
                src={src}
                alt={alt}
                width={1448}
                height={1086}
                onClick={(e) => {
                  // Ett tryck på bilden ska zooma, inte stänga rutan som ligger bakom.
                  e.stopPropagation();
                  setZoomed(!zoomed);
                }}
                className={
                  zoomed ? 'w-[250%] max-w-none cursor-zoom-out' : 'h-auto w-full cursor-zoom-in'
                }
              />
            </div>

            <div className="p-3 text-center text-sm text-white/70">
              {zoomed
                ? 'Dra för att flytta, tryck för att zooma ut'
                : 'Tryck på bilden för att zooma in'}
            </div>
          </div>,
          document.body
        )}
    </>
  );
};
