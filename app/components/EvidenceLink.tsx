'use client';
import { IFoundClues } from '@/lib/interfaces/gameRelated';
import Link from 'next/link';
import { useParams } from 'next/navigation';

interface IParams {
  clue: IFoundClues;
}
export const EvidenceLink = ({ clue }: IParams) => {
  const params = useParams();
  const investigationId = params.investigationId as string;
  const baseUrl = `/investigation/${investigationId}`;

  // Hela raden är klickbar, och py-1.5 gör den lagom hög för ett finger.
  return (
    <li>
      <Link
        href={`${baseUrl}/evidence/${clue.case_clues.id}`}
        className="block py-1.5 ps-5 !font-printed"
      >
        {clue.case_clues.title}
      </Link>
    </li>
  );
};
