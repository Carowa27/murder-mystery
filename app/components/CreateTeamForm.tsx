'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';

export default function CreateTeamForm() {
  const router = useRouter();
  const [teamName, setTeamName] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError('');
    setLoading(true);

    const res = await fetch('/api/teams', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ name: teamName }),
    });

    const data = await res.json();

    if (!res.ok) {
      setError(data.error);
      setLoading(false);
      return;
    }

    router.push(`/team/${data.team.id}`);
  }

  return (
    <div className="w-full max-w-sm border border-gold/30 rounded-lg bg-surface/80 p-6">
      <h2 className="text-gold text-lg font-bold mb-1">Skapa nytt team</h2>
      <p className="text-text-secondary text-xs mb-4">Samla dina detektiver</p>

      <form onSubmit={handleSubmit} className="flex flex-col gap-3">
        <input
          type="text"
          value={teamName}
          onChange={(e) => setTeamName(e.target.value)}
          required
          className="w-full rounded border border-gold/20 bg-background px-3 py-2.5 text-text-primary placeholder:text-muted focus:border-gold focus:outline-none transition-colors"
          placeholder="Teamnamn"
        />

        {error && <p className="text-sm text-danger">{error}</p>}

        <button
          type="submit"
          disabled={loading}
          className="w-full rounded py-2.5 font-label text-sm uppercase tracking-widest text-background bg-btn-primary disabled:bg-btn-disabled disabled:text-btn-disabled-text transition-opacity hover:opacity-90 cursor-pointer disabled:cursor-not-allowed"
          style={{ backgroundImage: loading ? 'none' : 'var(--btn-primary)' }}
        >
          {loading ? 'Skapar...' : 'Skapa team'}
        </button>
      </form>
    </div>
  );
}
