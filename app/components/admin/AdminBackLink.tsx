'use client';

import { ArrowLeftIcon } from '@phosphor-icons/react';
import Link from 'next/link';

interface IParams {
  linkUrl: string;
  linkText: string;
}

export const AdminBackLink = ({ linkUrl, linkText }: IParams) => {
  return (
    <Link href={linkUrl} className="!text-lg flex items-center gap-2 mb-2">
      <ArrowLeftIcon size={25} />
      {linkText}
    </Link>
  );
};
