'use client';

import { accuse } from '@/lib/helper fns/accuseFns';
import { IGameCharacter } from '@/lib/interfaces/gameRelated';
import Image from 'next/image';
import { useParams, useRouter } from 'next/navigation';
import { useState } from 'react';

interface IAccusationPhotoParams {
  c: IGameCharacter;
  accused: boolean;
  wasGuilty?: boolean;
}

export const AccusationPhoto = ({ c, accused, wasGuilty }: IAccusationPhotoParams) => {
  const params = useParams<{ investigationId: string }>();
  const router = useRouter();
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleAccuse = async () => {
    if (submitting || accused) return;

    // An accusation uses up one of the team's limited tries, so confirm first
    if (!confirm(`Vill du anklaga ${c.first_name} ${c.last_name ?? ''}?`)) return;

    setSubmitting(true);
    setError(null);

    try {
      const result = await accuse({ cId: c.id, invId: params.investigationId });

      if (!result.ok) {
        setError(result.error);
        return;
      }

      // The verdict is rendered from server data after the refresh
      router.refresh();
    } finally {
      setSubmitting(false);
    }
  };

  const disabled = submitting || accused;

  return (
    <div
      role="button"
      tabIndex={disabled ? -1 : 0}
      aria-disabled={disabled}
      className={`w-[25%] bg-background p-3 flex flex-col gap-2 rounded-md border-1 border-primary ${
        disabled ? 'pointer-events-none' : 'hover:cursor-pointer'
      } ${submitting ? 'opacity-50' : ''}`}
      onClick={handleAccuse}
      onKeyDown={(e) => {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault();
          handleAccuse();
        }
      }}
    >
      <section className="relative h-auto w-[100%] aspect-[1/1] overflow-hidden">
        {c.image_url !== null ? (
          <Image
            src={c.image_url}
            alt={`image of ${c.first_name} ${c.last_name}`}
            fill
            sizes="(max-width: 768px) 30vw, 160px"
            className={`object-cover ${accused && !wasGuilty ? 'grayscale opacity-60' : ''}`}
          />
        ) : (
          <div className="bg-muted h-[100%] w-[100%] opacity-100"></div>
        )}
      </section>
      <section className="h-9 flex items-center">
        <p className="text-center !text-sm leading-4.5 text-text-secondary !font-label">
          {c.first_name} {c.last_name}
        </p>
      </section>
      {accused && (
        <p className="!text-sm text-gold text-center">
          {wasGuilty ? 'Skyldig, tagen i förvar' : 'Oskyldig'}
        </p>
      )}
      {error && <p className="!text-sm text-red-500">{error}</p>}
    </div>
  );
};
