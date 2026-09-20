import Link from 'next/link';

export const GameNav = () => {
  return (
    <header className="w-full flex justify-center gap-10 mt-auto pb-1">
      <Link href={'/investigation'} className="flex flex-col text-center">
        <p> magnifier</p>
        {/* <MagnifyingGlassIcon size={32} weight="duotone" /> */}
        <p> OFFICE </p>
      </Link>
      <Link href={'/evidence'} className="flex flex-col text-center">
        <p> book</p>
        {/* <BooksIcon size={32} weight="duotone" /> */}
        <p> EVIDENCE </p>
      </Link>
      <Link href={'/team'} className="flex flex-col text-center">
        <p> team</p>
        {/* <UsersThreeIcon size={32} weight="duotone" /> */}
        <p> TEAM </p>
      </Link>
      <Link href={'/accusation'} className="flex flex-col text-center">
        <p> lock</p>
        {/* <LockIcon size={32} weight="duotone" /> */}
        <p> ACCUSE </p>
      </Link>
    </header>
  );
};
