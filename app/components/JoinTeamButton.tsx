'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';

export default function JoinTeamButton({
  inviteCode,
  teamId,
}: {
  inviteCode: string;
  teamId: string;
}) {
  const router = useRouter();
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  async function handleJoin() {
    setError('');
    setLoading(true);

    const res = await fetch('/api/teams/join', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ inviteCode }),
    });

    const data = await res.json();

    if (!res.ok) {
      setError(data.error);
      setLoading(false);
      return;
    }

    router.push(`/team/${teamId}`);
  }

  return (
    <div className="flex flex-col gap-2">
      {error && <p className="text-sm text-danger">{error}</p>}
      <button
        onClick={handleJoin}
        disabled={loading}
        className="w-full rounded py-2.5 font-label text-sm uppercase tracking-widest text-background bg-btn-primary disabled:bg-btn-disabled disabled:text-btn-disabled-text transition-opacity hover:opacity-90 cursor-pointer disabled:cursor-not-allowed"
        style={{ backgroundImage: loading ? 'none' : 'var(--btn-primary)' }}
      >
        {loading ? 'Går med...' : 'Gå med i teamet'}
      </button>
    </div>
  );
}
