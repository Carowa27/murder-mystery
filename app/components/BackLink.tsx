'use client';

import { ArrowLeftIcon } from '@phosphor-icons/react';
import Link from 'next/link';

interface IParams {
  linkUrl: string;
  linkText: string;
}

export const BackLink = ({ linkUrl, linkText }: IParams) => {
  return (
    <Link href={linkUrl} className="absolute top-2 right-2 z-500 !text-lg flex items-center gap-2">
      <ArrowLeftIcon size={32} />
      {linkText}
    </Link>
  );
};
