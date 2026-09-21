import Link from 'next/link';
import { MagnifyingGlassIcon, BooksIcon, UsersThreeIcon, LockIcon } from '@phosphor-icons/react';

export const GameNav = () => {
  return (
    <nav className="w-full h-[80px] flex justify-evenly mt-auto items-center position-absolute bottom-0 sticky z-1000 bg-background text-primary">
      <Link href={'/office'} className="flex flex-col items-center gap-1">
        <MagnifyingGlassIcon size={32} weight="duotone" />
        <p className="!text-[0.70rem]"> OFFICE </p>
      </Link>
      <Link href={'/evidence'} className="flex flex-col items-center gap-1">
        <BooksIcon size={32} weight="duotone" />
        <p className="!text-[0.70rem]"> EVIDENCE </p>
      </Link>
      <Link href={'/team'} className="flex flex-col items-center gap-1">
        <UsersThreeIcon size={32} weight="duotone" />
        <p className="!text-[0.70rem]"> TEAM </p>
      </Link>
      <Link href={'/accusation'} className="flex flex-col items-center gap-1">
        <LockIcon size={32} weight="duotone" />
        <p className="!text-[0.70rem]"> ACCUSE </p>
      </Link>
    </nav>
  );
};
