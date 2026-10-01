'use client';
import Link from 'next/link';
import { useEffect, useState } from 'react';
import {
  MagnifyingGlassIcon,
  BooksIcon,
  NotePencilIcon,
  UsersThreeIcon,
  LockIcon,
  LockOpenIcon,
} from '@phosphor-icons/react';
import { useParams, usePathname } from 'next/navigation';

export const GameNav = () => {
  const params = useParams();
  const pathname = usePathname();
  const investigationId = params.investigationId as string;
  const baseUrl = `/investigation/${investigationId}`;

  // Låst från början, så att ingen hinner trycka sig förbi innan svaret kommit.
  const [allKeysFound, setAllKeysFound] = useState(false);
  const [keysFound, setKeysFound] = useState('');
  const [showLocked, setShowLocked] = useState(false);

  // Hämtas vid varje sidbyte, så att låset öppnas när sista nyckelledtråden hittats.
  useEffect(() => {
    fetch(`/api/investigations/${investigationId}/can_accuse`)
      .then((res) => res.json())
      .then((data) => {
        setAllKeysFound(data.all_keys_found === true);
        setKeysFound(data.keys_found ?? '');
      })
      .catch(() => setAllKeysFound(false));
  }, [investigationId, pathname]);

  return (
    <nav className="w-full h-[80px] flex justify-evenly mt-auto items-center position-absolute bottom-0 sticky z-1000 bg-background text-primary">
      <Link href={`${baseUrl}/office`} className="flex flex-col items-center gap-1">
        <MagnifyingGlassIcon size={32} weight="duotone" />
        <p className="!text-[0.70rem]"> KONTOR </p>
      </Link>
      <Link href={`${baseUrl}/evidence`} className="flex flex-col items-center gap-1">
        <BooksIcon size={32} weight="duotone" />
        <p className="!text-[0.70rem]"> BEVIS </p>
      </Link>
      <Link href={`${baseUrl}/notes`} className="flex flex-col items-center gap-1">
        <NotePencilIcon size={32} weight="duotone" />
        <p className="!text-[0.70rem]"> ANTECKNINGAR </p>
      </Link>
      <Link href={`${baseUrl}/team`} className="flex flex-col items-center gap-1">
        <UsersThreeIcon size={32} weight="duotone" />
        <p className="!text-[0.70rem]"> TEAM </p>
      </Link>

      {allKeysFound ? (
        <Link href={`${baseUrl}/accusation`} className="flex flex-col items-center gap-1">
          <LockOpenIcon size={32} weight="duotone" />
          <p className="!text-[0.70rem]"> ANKLAGA </p>
        </Link>
      ) : (
        <button
          onClick={() => setShowLocked(true)}
          className="flex flex-col items-center gap-1 cursor-pointer"
        >
          <LockIcon size={32} weight="duotone" />
          <p className="!text-[0.70rem]"> ANKLAGA </p>
        </button>
      )}

      {showLocked && (
        <div
          className="fixed inset-0 z-2000 flex items-center justify-center bg-black/60 px-6"
          onClick={() => setShowLocked(false)}
        >
          <div
            className="w-full max-w-sm rounded-2xl border border-gold/30 bg-surface p-6 text-center"
            onClick={(e) => e.stopPropagation()}
          >
            <h2 className="text-gold">Anklagelsen är låst</h2>
            <p className="mt-3 text-text-secondary">
              Hitta alla nyckelledtrådar innan ni kan anklaga någon.
            </p>
            {keysFound && (
              <div className="mt-4 font-label text-xs uppercase tracking-widest text-gold">
                Nyckelledtrådar: {keysFound}
              </div>
            )}
            <button
              onClick={() => setShowLocked(false)}
              className="mt-6 rounded px-8 py-3 font-label text-sm uppercase tracking-widest text-background cursor-pointer"
              style={{ backgroundImage: 'var(--btn-primary)' }}
            >
              Stäng
            </button>
          </div>
        </div>
      )}
    </nav>
  );
};
