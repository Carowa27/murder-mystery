'use client';

import { useState, useEffect } from 'react';
import Image from 'next/image';
import type { ICase } from '@/lib/interfaces/gameRelated';

interface CaseDrawerProps {
  teamId: string;
  isOwner: boolean;
  ownerName: string;
}

export default function CaseDrawer({ teamId, isOwner, ownerName }: CaseDrawerProps) {
  const [open, setOpen] = useState(false);
  const [cases, setCases] = useState<ICase[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [selectedCase, setSelectedCase] = useState<ICase | null>(null);

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

  function handleSelectCase(c: ICase) {
    setSelectedCase(c);
    setOpen(false);
  }

  if (selectedCase) {
    return (
      <div className="flex flex-col items-center gap-3">
        {/* Inline JSX för polaroid! */}
        <div className="bg-paper p-2 rounded-xs shadow-md -rotate-3">
          <div className="relative w-28 aspect-square">
            <Image
              src={selectedCase.image_url}
              alt={selectedCase.title}
              fill
              className="object-cover"
            />
          </div>
          <p className="text-center text-surface text-xs font-label mt-1 px-1 truncate max-w-28">
            {selectedCase.title}
          </p>
        </div>
        {isOwner ? (
          <div className="flex flex-col items-center gap-2">
            <button
              className="rounded px-6 py-2 font-label text-xs uppercase tracking-widest text-background transition-opacity active:opacity-90 cursor-pointer"
              style={{ backgroundImage: 'var(--btn-primary)' }}
            >
              Starta fall
            </button>

            {/* Tillåt användaren att byta fall utan att ladda om sidan! */}
            <button
              onClick={() => {
                setSelectedCase(null);
                setOpen(true);
              }}
              className="font-label text-xs uppercase tracking-widest text-text-secondary active:text-gold transition-colors cursor-pointer"
            >
              Byt fall
            </button>
          </div>
        ) : (
          <p className="rounded bg-background/80 px-4 py-2 border border-gold/30 font-label text-xs uppercase tracking-widest text-gold text-center">
            Väntar på att {ownerName} ska starta fallet...
          </p>
        )}
      </div>
    );
  }

  if (!isOwner) {
    return (
      <p className="rounded bg-background/80 px-6 py-3 border border-gold/30 font-label text-sm uppercase tracking-widest text-gold">
        {ownerName} väljer fall att lösa...
      </p>
    );
  }

  return (
    <>
      <button
        onClick={() => setOpen(true)}
        className="rounded px-8 py-3 font-label text-sm uppercase tracking-widest text-background transition-opacity active:opacity-90 cursor-pointer"
        style={{ backgroundImage: 'var(--btn-primary)' }}
      >
        Välj fall
      </button>

      {open && (
        <div
          className="fixed inset-0 z-50 flex items-end justify-center"
          onClick={() => setOpen(false)}
        >
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
              <div className="flex flex-col gap-4">
                {cases.map((c) => (
                  <button
                    key={c.id}
                    onClick={() => handleSelectCase(c)}
                    className="flex gap-4 rounded-lg border border-gold/20 bg-background/50 overflow-hidden text-left active:border-gold/50 transition-colors cursor-pointer"
                  >
                    {c.image_url && (
                      <div className="relative w-24 shrink-0 aspect-square">
                        <Image src={c.image_url} alt={c.title} fill className="object-cover" />
                      </div>
                    )}
                    <div className="py-3 pr-3">
                      <h3 className="text-gold text-sm font-bold">{c.title}</h3>
                      {c.description && (
                        <p className="text-text-secondary text-xs mt-1 line-clamp-3">
                          {c.description}
                        </p>
                      )}
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
