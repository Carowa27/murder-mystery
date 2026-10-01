'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';

interface OngoingInvestigationProps {
  investigationId: string;
  status: string;
  isOwner: boolean; // Tar nu även isOwner för att conditionally render "Överge" knappen endast till den som skapat rummet
}

// Denna kommer condtionally visas istället för Case Drawer om det redan finns en pågående investigation. Låter användaren
// antingen överge eller fortsätta den
export default function OngoingInvestigation({
  investigationId,
  status,
  isOwner,
}: OngoingInvestigationProps) {
  const router = useRouter();
  const [abandoning, setAbandoning] = useState(false);
  const [error, setError] = useState('');

  async function handleAbandon() {
    setAbandoning(true);
    setError('');

    try {
      // Vår nya investigation abandon route!
      const res = await fetch(`/api/investigations/${investigationId}/abandon`, {
        method: 'PATCH',
      });

      if (!res.ok) throw new Error('Kunde inte överge utredningen');

      router.refresh();
    } catch {
      setError('Kunde inte överge utredningen');
      setAbandoning(false);
    }
  }

  // Samma visuella hierarki som Case Drawer: "Fortsätt" är en guld knapp, "Överge" är där under fortfarande synligt men mindre
  return (
    <div className="flex flex-col items-center gap-4">
      <p className="rounded bg-background/80 px-4 py-2 border border-gold/30 font-label text-xs uppercase tracking-widest text-gold text-center">
        {status === 'paused' ? 'Utredningen är pausad' : 'Utredning pågår'}
      </p>

      <button
        onClick={() => router.push(`/investigation/${investigationId}/team`)}
        className="rounded px-8 py-3 font-label text-sm uppercase tracking-widest text-background transition-opacity active:opacity-90 cursor-pointer min-w-[10rem]"
        style={{ backgroundImage: 'var(--btn-primary)' }}
      >
        Fortsätt
      </button>

      {isOwner && (
        <button
          onClick={handleAbandon}
          disabled={abandoning}
          className="rounded bg-white/15 px-6 py-2 font-label text-xs uppercase tracking-widest text-gold/80 active:text-danger transition-colors cursor-pointer disabled:opacity-60"
        >
          {abandoning ? 'Överger...' : 'Överge'}
        </button>
      )}

      {error && <p className="text-danger text-xs text-center">{error}</p>}
    </div>
  );
}
