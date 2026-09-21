'use client';
import Link from 'next/link';
import { MagnifyingGlassIcon, BooksIcon, UsersThreeIcon, LockIcon } from '@phosphor-icons/react';
import { useParams } from 'next/navigation';

export const GameNav = () => {
  const params = useParams();
  const investigationId = params.investigationId as string;
  const baseUrl = `/investigation/${investigationId}`;
  return (
    <nav className="w-full h-[80px] flex justify-evenly mt-auto items-center position-absolute bottom-0 sticky z-1000 bg-background text-primary">
      <Link href={`${baseUrl}/office`} className="flex flex-col items-center gap-1">
        <MagnifyingGlassIcon size={32} weight="duotone" />
        <p className="!text-[0.70rem]"> OFFICE </p>
      </Link>
      <Link href={`${baseUrl}/evidence`} className="flex flex-col items-center gap-1">
        <BooksIcon size={32} weight="duotone" />
        <p className="!text-[0.70rem]"> EVIDENCE </p>
      </Link>
      <Link href={`${baseUrl}/team`} className="flex flex-col items-center gap-1">
        <UsersThreeIcon size={32} weight="duotone" />
        <p className="!text-[0.70rem]"> TEAM </p>
      </Link>
      <Link href={`${baseUrl}/accusation`} className="flex flex-col items-center gap-1">
        <LockIcon size={32} weight="duotone" />
        <p className="!text-[0.70rem]"> ACCUSE </p>
      </Link>
    </nav>
  );
};
