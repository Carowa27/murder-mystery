import Image from 'next/image';
import type { ReactNode } from 'react';
import { difficultyName } from '@/lib/helper fns/difficultyName';

export interface ICaseCard {
  title: string;
  description: string | null;
  image_url: string | null;
  story_date: string | null;
  difficulties: { name: string } | null;
}

interface IParams {
  caseInfo: ICaseCard;
  children?: ReactNode;
}

// Ett fall i butiken och under Mina fall på profilen. Det som ska stå längst
// ner, till exempel pris och köpknapp, skickas in som children.
export const CaseCard = ({ caseInfo, children }: IParams) => {
  return (
    <li className="flex flex-col gap-2 rounded-lg border border-gold/30 bg-surface p-3">
      {caseInfo.image_url ? (
        <Image
          src={caseInfo.image_url}
          alt={caseInfo.title}
          width={240}
          height={240}
          className="w-full h-auto rounded"
        />
      ) : (
        <div className="w-full aspect-square rounded bg-muted"></div>
      )}
      <div className="text-lg font-semibold">
        {caseInfo.title}
        {caseInfo.story_date && ` (${caseInfo.story_date.slice(0, 4)})`}
      </div>
      {caseInfo.difficulties && (
        <div className="text-xs text-gold">{difficultyName(caseInfo.difficulties.name)}</div>
      )}
      {caseInfo.description && (
        <div className="line-clamp-2 text-sm text-text-secondary">{caseInfo.description}</div>
      )}

      {children && (
        <div className="mt-auto flex items-center justify-between gap-2">{children}</div>
      )}
    </li>
  );
};
