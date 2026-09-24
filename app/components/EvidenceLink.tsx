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

  return (
    <Link href={`${baseUrl}/evidence/${clue.case_clues.id}`}>
      <li className="!font-printed ps-5">{clue.case_clues.title}</li>
    </Link>
  );
};
