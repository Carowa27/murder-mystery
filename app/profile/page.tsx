'use client';

import Image from 'next/image';
import Link from 'next/link';
import { useEffect, useState } from 'react';
import { avatars } from '@/lib/avatars';
import { CaseCard, type ICaseCard } from '@/app/components/CaseCard';

interface IProfile {
  email: string;
  display_name: string;
  avatar_url: string | null;
  unlimited_until: string | null;
  subscription_tier: string;
  purchases: {
    created_at: string;
    cases: (ICaseCard & { id: string }) | null;
  }[];
}

// Små texter ligger i div och inte i span eller p, eftersom globals.css sätter
// storlek och typsnitt på span och p och då vinner över text-xs och font-label.
export default function ProfilePage() {
  const [profile, setProfile] = useState<IProfile | null>(null);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(true);
  const [showAvatars, setShowAvatars] = useState(false);
  const [avatarError, setAvatarError] = useState('');

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

  async function changeAvatar(avatarUrl: string) {
    if (!profile) return;
    setAvatarError('');

    try {
      const res = await fetch('/api/profile', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ avatar_url: avatarUrl }),
      });
      const data = await res.json();

      if (!res.ok) {
        setAvatarError(data.error);
        return;
      }

      setProfile({ ...profile, avatar_url: data.avatar_url });
      setShowAvatars(false);
    } catch {
      setAvatarError('Kunde inte spara avatarn');
    }
  }

  if (loading) {
    return <p className="py-16 text-center">Hämtar profil...</p>;
  }

  if (error || !profile) {
    return <p className="py-16 text-center text-danger">{error}</p>;
  }

  const isUnlimited = profile.subscription_tier === 'unlimited';

  return (
    <div className="flex flex-col gap-8 py-8">
      <div className="flex flex-col gap-4 rounded-lg border border-gold/30 bg-surface p-6">
        <div className="flex items-center gap-4">
          {profile.avatar_url ? (
            <Image
              src={profile.avatar_url}
              alt="Din avatar"
              width={80}
              height={80}
              className="h-20 w-20 rounded-full object-cover"
            />
          ) : (
            <div className="h-20 w-20 rounded-full bg-muted"></div>
          )}

          <div className="flex flex-col gap-1">
            <div className="font-label text-xs uppercase tracking-widest text-gold">
              {profile.subscription_tier}
            </div>
            <h1 className="text-gold">{profile.display_name}</h1>
            <div className="text-sm text-text-secondary">{profile.email}</div>
          </div>
        </div>

        <button
          onClick={() => setShowAvatars(!showAvatars)}
          className="self-start text-gold hover:text-gold-light transition-colors cursor-pointer"
        >
          {showAvatars ? 'Stäng' : 'Byt avatar'}
        </button>

        {showAvatars && (
          <ul className="grid grid-cols-4 gap-3 sm:grid-cols-6">
            {avatars.map((avatar) => (
              <li key={avatar}>
                <button onClick={() => changeAvatar(avatar)} className="cursor-pointer">
                  <Image
                    src={avatar}
                    alt=""
                    width={80}
                    height={80}
                    className={`aspect-square w-full rounded-full border-2 object-cover ${avatar === profile.avatar_url ? 'border-gold' : 'border-transparent'}`}
                  />
                </button>
              </li>
            ))}
          </ul>
        )}

        {avatarError && <div className="text-sm text-danger">{avatarError}</div>}
      </div>

      <div className="flex flex-wrap items-center justify-between gap-4 rounded-lg border border-gold/30 bg-surface p-6">
        <div className="flex flex-col gap-1">
          <div className="font-label text-xs uppercase tracking-widest text-gold">Unlimited</div>
          <div className="text-lg">
            {isUnlimited && profile.unlimited_until
              ? `Gäller till ${new Date(profile.unlimited_until).toLocaleDateString('sv-SE')}`
              : 'För dig som inte kan få nog av mysterier. Ger dig tillgång till alla nuvarande och kommande fall. De fall du redan köpt behåller du när prenumerationen tar slut.'}
          </div>
        </div>

        {!isUnlimited && (
          <Link
            href="/checkout?product=unlimited_month"
            className="rounded bg-btn-primary px-4 py-2 hover:opacity-90 transition-opacity"
          >
            <div className="font-label font-bold text-xs uppercase tracking-widest text-background">
              Uppgradera till Unlimited
            </div>
          </Link>
        )}
      </div>

      <div className="flex flex-col gap-3">
        <div className="font-label text-xs uppercase tracking-widest text-gold">Mina fall</div>

        {profile.purchases.length === 0 ? (
          <div className="text-sm text-text-secondary">Du har inte köpt några fall än.</div>
        ) : (
          <ul className="grid grid-cols-2 gap-4">
            {profile.purchases.map(
              (purchase) =>
                purchase.cases && <CaseCard key={purchase.cases.id} caseInfo={purchase.cases} />
            )}
          </ul>
        )}
      </div>

      <Link
        href="/profile/receipts"
        className="self-start text-gold hover:text-gold-light transition-colors"
      >
        Visa kvitton
      </Link>
    </div>
  );
}
