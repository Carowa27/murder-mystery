'use client';

import Link from 'next/link';
import { useState } from 'react';

interface IParams {
  // Slutdatumet från profilen, eller null om man aldrig haft Unlimited.
  unlimitedUntil: string | null;
}

const DAY_MS = 24 * 60 * 60 * 1000;

// Unlimited-rutan på profilen och i butiken. Har man Unlimited visas hur många
// dagar som är kvar och knappen fyller på, annars säljs prenumerationen.
// Texterna ligger i div, eftersom globals.css skriver över storleken på span och p.
export const UnlimitedCard = ({ unlimitedUntil }: IParams) => {
  // Klockan läses en gång när rutan visas. Date.now() direkt i komponenten
  // stoppas av lint, eftersom svaret ändras varje gång den ritas om.
  const [now] = useState(() => Date.now());
  const daysLeft = unlimitedUntil
    ? Math.ceil((new Date(unlimitedUntil).getTime() - now) / DAY_MS)
    : 0;
  const isUnlimited = daysLeft > 0;

  return (
    <div className="flex flex-wrap items-center justify-between gap-4 rounded-lg border border-gold/30 bg-surface p-6">
      <div className="flex flex-col gap-1">
        <div className="font-label text-xs uppercase tracking-widest text-gold">Unlimited</div>
        {isUnlimited && unlimitedUntil ? (
          <>
            <div className="text-lg">
              {daysLeft} {daysLeft === 1 ? 'dag' : 'dagar'} kvar, till och med{' '}
              {new Date(unlimitedUntil).toLocaleDateString('sv-SE')}.
            </div>
            <div className="text-sm text-text-secondary">
              Fyller du på räknas den nya månaden från slutdatumet, så du förlorar inga dagar.
            </div>
          </>
        ) : (
          <div className="text-lg">
            För dig som inte kan få nog av mysterier. Ger dig tillgång till alla nuvarande och
            kommande fall. De fall du redan köpt behåller du när prenumerationen tar slut.
          </div>
        )}
      </div>

      <Link
        href="/checkout?product=unlimited_month"
        className="rounded bg-btn-primary px-4 py-2 hover:opacity-90 transition-opacity"
      >
        <div className="font-label font-bold text-xs uppercase tracking-widest text-background">
          {isUnlimited ? 'Fyll på en månad' : 'Uppgradera till Unlimited'}
        </div>
      </Link>
    </div>
  );
};
