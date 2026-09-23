'use client';

import Link from 'next/link';
import { useParams } from 'next/navigation';

export const Notebook = () => {
  const params = useParams();
  const investigationId = params.investigationId as string;
  const baseUrl = `/investigation/${investigationId}`;

  return (
    <Link href={`${baseUrl}/notes`}>
      <section className="h-[25%] mb-15 aspect-[1227/719] bg-[url(/images/item-backgrounds/notebook.png)] bg-bottom bg-no-repeat bg-cover">
        {/* <p className="!text-xl text-surface !font-bold -rotate-8 mt-5 ml-15">case notes</p> */}
      </section>
    </Link>
  );
};
