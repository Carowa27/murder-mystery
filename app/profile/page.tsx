'use client';

import Image from 'next/image';
import Link from 'next/link';
import { useEffect, useState } from 'react';
import { LogoutButton } from '@/app/components/LogoutButton';

interface IProfile {
  email: string;
  display_name: string;
  unlimited_until: string | null;
  subscription_tier: string;
  purchases: {
    created_at: string;
    cases: { id: string; title: string; image_url: string | null } | null;
  }[];
}

// Små texter ligger i div och inte i span eller p, eftersom globals.css sätter
// storlek och typsnitt på span och p och då vinner över text-xs och font-label.
export default function ProfilePage() {
  const [profile, setProfile] = useState<IProfile | null>(null);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadProfile() {
      try {
        const res = await fetch('/api/profile');
        const data = await res.json();

        if (!res.ok) {
          setError(data.error);
          return;
        }

        setProfile(data);
      } catch {
        setError('Kunde inte hämta din profil');
      } finally {
        setLoading(false);
      }
    }

    loadProfile();
  }, []);

  if (loading) {
    return <p className="py-16 text-center">Hämtar profil...</p>;
  }

  if (error || !profile) {
    return <p className="py-16 text-center text-danger">{error}</p>;
  }

  return (
    <div className="py-8">
      <div className="flex flex-col gap-6 rounded-lg border border-gold/30 bg-surface p-6">
        <div className="flex flex-col gap-1">
          <div className="font-label text-xs uppercase tracking-widest text-muted">Detektiv</div>
          <h1 className="text-gold">{profile.display_name}</h1>
          <div className="text-sm text-text-secondary">{profile.email}</div>
        </div>

        <div className="flex flex-wrap items-end justify-between gap-2 border-t border-gold/20 pt-6">
          <div className="flex flex-col gap-1">
            <div className="font-label text-xs uppercase tracking-widest text-muted">Nivå</div>
            <div className="text-lg capitalize">{profile.subscription_tier}</div>

            {profile.subscription_tier === 'unlimited' && profile.unlimited_until && (
              <div className="text-sm text-text-secondary">
                Gäller till {new Date(profile.unlimited_until).toLocaleDateString('sv-SE')}
              </div>
            )}
          </div>

          {profile.subscription_tier !== 'unlimited' && (
            <Link
              href="/checkout?product=unlimited_month"
              className="text-gold hover:text-gold-light transition-colors"
            >
              Uppgradera till Unlimited
            </Link>
          )}
        </div>

        <div className="flex flex-col gap-3 border-t border-gold/20 pt-6">
          <div className="font-label text-xs uppercase tracking-widest text-muted">Köpta fall</div>

          {profile.purchases.length === 0 ? (
            <div className="text-sm text-text-secondary">Du har inte köpt några fall än.</div>
          ) : (
            <ul className="grid grid-cols-2 gap-4 sm:grid-cols-3">
              {profile.purchases.map((purchase) => (
                <li key={purchase.cases?.id} className="flex flex-col gap-2">
                  {purchase.cases?.image_url ? (
                    <Image
                      src={purchase.cases.image_url}
                      alt={purchase.cases.title}
                      width={240}
                      height={240}
                      className="w-full h-auto rounded"
                    />
                  ) : (
                    <div className="w-full aspect-square rounded bg-muted"></div>
                  )}
                  <div className="text-sm">{purchase.cases?.title}</div>
                </li>
              ))}
            </ul>
          )}
        </div>

        <div className="flex flex-wrap items-center justify-between gap-4 border-t border-gold/20 pt-6">
          <Link
            href="/profile/receipts"
            className="text-gold hover:text-gold-light transition-colors"
          >
            Visa kvitton
          </Link>

          <LogoutButton />
        </div>
      </div>
    </div>
  );
}
