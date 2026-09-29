'use client';

import Image from 'next/image';
import Link from 'next/link';
import { useEffect, useState } from 'react';
import { difficultyName } from '@/lib/helper fns/difficultyName';

interface IShopCase {
  id: string;
  title: string;
  image_url: string | null;
  price: number;
  story_date: string | null;
  difficulties: { name: string } | null;
}

interface IShop {
  ownedCases: IShopCase[];
  availableCases: IShopCase[];
}

// Ett kort per fall. Bara fall man inte redan har får pris och köplänk.
function CaseCard({ shopCase, buyable }: { shopCase: IShopCase; buyable: boolean }) {
  return (
    <li className="flex flex-col gap-2 rounded-lg border border-gold/30 bg-surface p-3">
      {shopCase.image_url ? (
        <Image
          src={shopCase.image_url}
          alt={shopCase.title}
          width={240}
          height={240}
          className="w-full h-auto rounded"
        />
      ) : (
        <div className="w-full aspect-square rounded bg-muted"></div>
      )}
      <div className="text-sm">
        {shopCase.title}
        {shopCase.story_date && ` (${shopCase.story_date.slice(0, 4)})`}
      </div>
      {shopCase.difficulties && (
        <div className="text-xs text-muted">{difficultyName(shopCase.difficulties.name)}</div>
      )}

      {buyable && (
        <div className="mt-auto flex items-center justify-between gap-2">
          <div className="text-sm">{shopCase.price} kr</div>
          <Link
            href={`/checkout?product=case&caseId=${shopCase.id}`}
            className="rounded bg-btn-primary px-4 py-2 hover:opacity-90 transition-opacity"
          >
            <div className="font-label text-xs uppercase tracking-widest text-background">Köp</div>
          </Link>
        </div>
      )}
    </li>
  );
}

// Texterna ligger i div och inte direkt i span, p eller länken, eftersom
// globals.css sätter storlek och typsnitt på dem och då vinner över Tailwind.
export default function ShopPage() {
  const [shop, setShop] = useState<IShop | null>(null);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadShop() {
      try {
        const res = await fetch('/api/shop/cases');
        const data = await res.json();

        if (!res.ok) {
          setError(data.error);
          return;
        }

        setShop(data);
      } catch {
        setError('Kunde inte hämta butiken');
      } finally {
        setLoading(false);
      }
    }

    loadShop();
  }, []);

  if (loading) {
    return <p className="py-16 text-center">Hämtar butiken...</p>;
  }

  if (error || !shop) {
    return <p className="py-16 text-center text-danger">{error}</p>;
  }

  return (
    <div className="flex flex-col gap-8 py-8">
      <h1 className="text-gold">Butik</h1>

      <div className="flex flex-wrap items-center justify-between gap-4 rounded-lg border border-gold/30 bg-surface p-6">
        <div className="flex flex-col gap-1">
          <div className="font-label text-xs uppercase tracking-widest text-muted">Unlimited</div>
          <div className="text-lg">Tillgång till alla fall, även de som kommer</div>
        </div>
        <Link
          href="/checkout?product=unlimited_month"
          className="rounded bg-btn-primary px-4 py-2 hover:opacity-90 transition-opacity"
        >
          <div className="font-label text-xs uppercase tracking-widest text-background">
            Till kassan
          </div>
        </Link>
      </div>

      <div className="flex flex-col gap-3">
        <div className="font-label text-xs uppercase tracking-widest text-muted">Att köpa</div>

        {shop.availableCases.length === 0 ? (
          <div className="text-sm text-text-secondary">Du har redan tillgång till alla fall.</div>
        ) : (
          <ul className="grid grid-cols-2 gap-4">
            {shop.availableCases.map((shopCase) => (
              <CaseCard key={shopCase.id} shopCase={shopCase} buyable={true} />
            ))}
          </ul>
        )}
      </div>

      <div className="flex flex-col gap-3">
        <div className="font-label text-xs uppercase tracking-widest text-muted">Dina fall</div>

        <ul className="grid grid-cols-2 gap-4">
          {shop.ownedCases.map((shopCase) => (
            <CaseCard key={shopCase.id} shopCase={shopCase} buyable={false} />
          ))}
        </ul>
      </div>
    </div>
  );
}
