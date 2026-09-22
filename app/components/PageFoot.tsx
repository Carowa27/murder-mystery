'use client';

import { usePathname } from 'next/navigation';
import { GameNav } from './GameNav';
import { Footer } from './Footer';
export const PageFoot = () => {
  const pathname = usePathname();
  if (pathname.includes('investigation')) {
    return <GameNav />;
  } else {
    return <Footer />;
  }
};
