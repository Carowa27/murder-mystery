'use client';
import Link from 'next/link';
import { useSearchParams } from 'next/navigation';

export const AdminNav = () => {
  const searchParams = useSearchParams();

  const activeTab = searchParams.get('tab') ?? 'overview';

  return (
    <>
      {/* <nav className={`flex justify-evenly max-[400px]:flex-wrap }`}> */}
      <nav className="grid grid-cols-2 min-[450px]:grid-cols-4">
        <Link
          href="?tab=overview"
          className={`${activeTab === 'overview' && 'bg-gold text-surface !font-bold'} flex-1 text-center px-4 py-2 border border-gold`}
        >
          Översikt
        </Link>
        <Link
          href="?tab=cases"
          className={`${activeTab === 'cases' && 'bg-gold text-surface !font-bold'} flex-1 text-center px-4 py-2 border border-gold`}
        >
          Fall
        </Link>

        <Link
          href="?tab=investigations"
          className={`${activeTab === 'investigations' && 'bg-gold text-surface !font-bold'} flex-1 text-center px-4 py-2 border border-gold`}
        >
          Utredningar
        </Link>

        <Link
          href="?tab=profiles"
          className={`${activeTab === 'profiles' && 'bg-gold text-surface !font-bold'} flex-1 text-center px-4 py-2 border border-gold`}
        >
          Profiler
        </Link>
      </nav>
    </>
  );
};
