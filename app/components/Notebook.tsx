'use client';

import Link from 'next/link';
import { useParams } from 'next/navigation';
import notebook from '@/public/images/item-backgrounds/notebookv2.png';

export const Notebook = () => {
  const params = useParams();
  const investigationId = params.investigationId as string;
  const baseUrl = `/investigation/${investigationId}`;
  console.log(notebook.height, notebook.width);
  return (
    <Link
      href={`${baseUrl}/notes`}
      className="w-screen aspect-[1247/493] bg-[url(/images/item-backgrounds/notebookv2.png)] bg-bottom bg-no-repeat bg-cover"
    >
      {/* <p className="!text-xl text-surface !font-bold -rotate-8 mt-5 ml-15">case notes</p> */}
    </Link>
  );
};
