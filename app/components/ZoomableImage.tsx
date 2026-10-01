'use client';

import { XIcon } from '@phosphor-icons/react';
import Image from 'next/image';
import { useRef, useState } from 'react';
import { createPortal } from 'react-dom';

interface IParams {
  src: string;
  alt: string;
}

// Var musen och scrollen var när man tryckte ner, för att räkna ut hur långt man dragit.
interface IDragStart {
  x: number;
  y: number;
  left: number;
  top: number;
}

// En bild i en ledtråd som går att förstora:
// 1. Tryck på bilden, så öppnas den över hela skärmen.
// 2. Tryck igen, så zoomas den in och man kan dra runt, med fingret eller med musen.
// 3. Tryck en gång till för att zooma ut. Krysset eller ett tryck utanför stänger.
//
// Helskärmsrutan läggs med createPortal direkt i <body>, inte bredvid bilden.
// Pappret som bilden ligger på är snett (roterat), och då skulle rutan också
// bli sned och bara täcka pappret i stället för hela skärmen.
export const ZoomableImage = ({ src, alt }: IParams) => {
  const [open, setOpen] = useState(false);
  const [zoomed, setZoomed] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);
  const dragStart = useRef<IDragStart | null>(null);
  // Sant när musen flyttats under ett drag, så att släppet inte räknas som ett klick.
  const wasDragged = useRef(false);

  function close() {
    setOpen(false);
    setZoomed(false);
  }

  // Bara musen. På mobilen flyttar fingret redan bilden med vanlig scroll.
  // Får bilden plats händer inget, eftersom det då inte finns något att scrolla.
  function startDrag(e: React.PointerEvent<HTMLDivElement>) {
    if (e.pointerType !== 'mouse' || !scrollRef.current) return;
    dragStart.current = {
      x: e.clientX,
      y: e.clientY,
      left: scrollRef.current.scrollLeft,
      top: scrollRef.current.scrollTop,
    };
    wasDragged.current = false;
  }

  // Bilden flyttas lika långt som musen, åt samma håll.
  function moveDrag(e: React.PointerEvent<HTMLDivElement>) {
    if (!dragStart.current || !scrollRef.current) return;
    const dx = e.clientX - dragStart.current.x;
    const dy = e.clientY - dragStart.current.y;
    if (Math.abs(dx) + Math.abs(dy) > 5) wasDragged.current = true;
    scrollRef.current.scrollLeft = dragStart.current.left - dx;
    scrollRef.current.scrollTop = dragStart.current.top - dy;
  }

  function endDrag() {
    dragStart.current = null;
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
            onClick={() => {
              // Ett drag som slutar utanför bilden ska inte stänga rutan.
              if (wasDragged.current) {
                wasDragged.current = false;
                return;
              }
              close();
            }}
            className="fixed inset-0 z-2000 flex flex-col bg-black/90"
          >
            <div className="flex justify-end p-3">
              <button onClick={close} aria-label="Stäng" className="cursor-pointer text-white">
                <XIcon size={32} />
              </button>
            </div>

            {/* Först får hela bilden plats, både på bredden och höjden. Inzoomad är
                den två och en halv gånger så bred som skärmen. Scrollbarerna är
                dolda, man drar i bilden i stället. min-h-0 låter ytan bli lägre än
                bilden, annars växer den och max-h-full på bilden gör ingenting. */}
            <div
              ref={scrollRef}
              onPointerDown={startDrag}
              onPointerMove={moveDrag}
              onPointerUp={endDrag}
              onPointerLeave={endDrag}
              className={`min-h-0 flex-1 overflow-auto select-none scrollbar-none [&::-webkit-scrollbar]:hidden ${zoomed ? '' : 'flex items-center justify-center'}`}
            >
              <Image
                src={src}
                alt={alt}
                width={1448}
                height={1086}
                // Annars drar webbläsaren iväg en kopia av bilden i stället för att flytta den.
                draggable={false}
                onClick={(e) => {
                  // Ett tryck på bilden ska zooma, inte stänga rutan som ligger bakom.
                  e.stopPropagation();
                  if (wasDragged.current) {
                    wasDragged.current = false;
                    return;
                  }
                  setZoomed(!zoomed);
                }}
                className={
                  zoomed
                    ? 'w-[250%] max-w-none cursor-grab active:cursor-grabbing'
                    : 'h-auto max-h-full w-auto max-w-full cursor-zoom-in'
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
