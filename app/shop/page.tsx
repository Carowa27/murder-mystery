'use client';

import Link from 'next/link';
import { useEffect, useState } from 'react';
import { CaseCard } from '@/app/components/CaseCard';
import { UnlimitedCard } from '@/app/components/UnlimitedCard';

interface IShopCase {
  id: string;
  title: string;
  description: string | null;
  image_url: string | null;
  price: number;
  story_date: string | null;
  difficulties: { name: string } | null;
}

// API:t skickar även ownedCases, men de visas på profilsidan och inte här.
interface IShop {
  availableCases: IShopCase[];
}

// Texterna ligger i div och inte direkt i span, p eller länken, eftersom
// globals.css sätter storlek och typsnitt på dem och då vinner över Tailwind.
export default function ShopPage() {
  const [shop, setShop] = useState<IShop | null>(null);
  const [unlimitedUntil, setUnlimitedUntil] = useState<string | null>(null);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadShop() {
      try {
        // Profilen hämtas samtidigt, för att Unlimited-rutan ska veta om man redan har det.
        const [res, profileRes] = await Promise.all([
          fetch('/api/shop/cases'),
          fetch('/api/profile'),
        ]);
        const data = await res.json();

        if (!res.ok) {
          setError(data.error);
          return;
        }

        setShop(data);

        if (profileRes.ok) {
          const profile = await profileRes.json();
          setUnlimitedUntil(profile.unlimited_until);
        }
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

      <UnlimitedCard unlimitedUntil={unlimitedUntil} />

      <div className="flex flex-col gap-3">
        <div className="font-label text-xs uppercase tracking-widest text-gold">Tillgängliga</div>

        {shop.availableCases.length === 0 ? (
          <div className="text-sm text-text-secondary">Du har redan tillgång till alla fall.</div>
        ) : (
          <ul className="grid grid-cols-2 gap-4">
            {shop.availableCases.map((shopCase) => (
              <CaseCard key={shopCase.id} caseInfo={shopCase}>
                <div className="text-sm">{shopCase.price} kr</div>
                <Link
                  href={`/checkout?product=case&caseId=${shopCase.id}`}
                  className="rounded bg-btn-primary px-4 py-2 hover:opacity-90 transition-opacity"
                >
                  <div className="font-label font-bold text-xs uppercase tracking-widest text-background">
                    Köp
                  </div>
                </Link>
              </CaseCard>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
}
