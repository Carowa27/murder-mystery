'use client';

import Link from 'next/link';
import Image from 'next/image';
import { useParams } from 'next/navigation';
import notebook from '@/public/images/item-backgrounds/notebookv2.png';

export const Notebook = () => {
  const params = useParams();
  const investigationId = params.investigationId as string;
  const baseUrl = `/investigation/${investigationId}`;
  console.log(notebook.height, notebook.width);
  return (
    <Link href={`${baseUrl}/notes`} className={`w-[45%] h-auto  `}>
      <Image
        src="/images/item-backgrounds/notebook.png"
        alt=""
        width={1920}
        height={1247}
        className="w-[100%] h-auto pb-[30%]"
      />
      {/* <p className="!text-xl text-surface !font-bold -rotate-8 mt-5 ml-15">case notes</p> */}
    </Link>
  );
};
