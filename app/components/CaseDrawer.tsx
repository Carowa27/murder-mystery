'use client';

import { useState, useEffect } from 'react';
import Image from 'next/image';
import type { ICase } from '@/lib/interfaces/gameRelated';

export default function CaseDrawer({ teamId }: { teamId: string }) {
  const [open, setOpen] = useState(false);
  const [cases, setCases] = useState<ICase[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    if (!open) return;

    async function fetchCases() {
      setLoading(true);
      setError('');

      try {
        const res = await fetch(`/api/teams/${teamId}/cases`);
        if (!res.ok) throw new Error('Kunde inte hämta fall');
        const data = await res.json();
        setCases(data);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Något gick fel');
      } finally {
        setLoading(false);
      }
    }

    fetchCases();
  }, [open, teamId]);

  return (
    <>
      <button
        onClick={() => setOpen(true)}
        className="rounded px-8 py-3 font-label text-sm uppercase tracking-widest text-background transition-opacity hover:opacity-90 cursor-pointer"
        style={{ backgroundImage: 'var(--btn-primary)' }}
      >
        Välj fall
      </button>

      {open && (
        <div className="fixed inset-0 z-50 flex items-end justify-center" onClick={() => setOpen(false)}>
          <div className="absolute inset-0 bg-black/60" />
          <div
            className="relative w-full max-w-lg h-[70vh] overflow-y-auto rounded-t-2xl bg-surface border-t border-gold/30 p-6 animate-slide-up"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-gold text-lg">Välj ett fall</h2>
              <button
                onClick={() => setOpen(false)}
                className="text-text-secondary hover:text-text-primary text-2xl leading-none cursor-pointer"
              >
                &times;
              </button>
            </div>

            {loading && <p className="text-text-secondary text-center py-8">Laddar fall...</p>}

            {error && <p className="text-danger text-center py-8">{error}</p>}

            {!loading && !error && cases.length === 0 && (
              <p className="text-text-secondary text-center py-8">
                Ingen i teamet äger ett fall ännu.
              </p>
            )}

            {!loading && !error && cases.length > 0 && (
              // Testade 3 column grid men det blir för tight på mobil, vi kör 2
              <div className="grid grid-cols-2 gap-4">
                {cases.map((c) => (
                  <button
                    key={c.id}
                    className="flex flex-col rounded-lg border border-gold/20 bg-background/50 overflow-hidden text-left hover:border-gold/50 transition-colors cursor-pointer"
                  >
                    {c.image_url && (
                      <div className="relative w-full aspect-[3/4]">
                        <Image src={c.image_url} alt={c.title} fill className="object-cover" />
                      </div>
                    )}
                    <div className="p-3">
                      <h3 className="text-gold text-sm font-bold line-clamp-2">{c.title}</h3>
                      {/* Att bestämma med gruppen: ha med description eller inte? Lutar mot ett nej här. */}
                      {/* {c.description && (
                        <p className="text-text-secondary text-xs mt-1 line-clamp-3">{c.description}</p>
                      )} */}
                    </div>
                  </button>
                ))}
              </div>
            )}
          </div>
        </div>
      )}
    </>
  );
}
