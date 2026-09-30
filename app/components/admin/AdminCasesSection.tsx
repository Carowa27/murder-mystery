'use client';
import type { Database } from '@/lib/database.types';
import { AdminButton } from './AdminButton';
import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';

type ICase = Database['public']['Tables']['cases']['Row'];

export const AdminCasesSection = () => {
  const router = useRouter();
  const [cases, setCases] = useState<ICase[]>();
  const [searchParam, setSearchParam] = useState('');
  useEffect(() => {
    fetch('/api/admin/cases')
      .then((r) => r.json())
      .then(setCases);
  }, []);
  useEffect(() => {
    const timeout = setTimeout(() => {
      fetch(`/api/admin/cases/search?q=${searchParam}`)
        .then((r) => r.json())
        .then(setCases);
    }, 300);
    return () => clearTimeout(timeout);
  }, [searchParam]);

  return (
    <div>
      <input
        type="search"
        value={searchParam}
        onChange={(e) => setSearchParam(e.target.value)}
        placeholder="Sök fall..."
        className="w-full border border-primary bg-background px-3 py-2 mb-2"
      />
      <AdminButton
        btnDisabled={false}
        btnText={'Skapa nytt fall'}
        btnAction={() => router.push('/admin/cases/create-case')}
      />
      <table className="w-full border-collapse mt-2">
        <thead>
          <tr className="border-b">
            <th className="text-left p-2">Titel</th>
            <th className="text-left p-2">Stage</th>
            <th className="text-center p-2">Redigera</th>
            <th className="text-center p-2">Radera</th>
          </tr>
        </thead>

        <tbody>
          {Array.isArray(cases) &&
            cases.length !== 0 &&
            cases.map((c: ICase) => (
              <tr key={c.id} className="border-b">
                <td className="p-2">
                  <Link href={`/admin/cases/${c.id}`}>{c.title}</Link>
                </td>
                <td
                  className={`p-2 text-center ${c.stage === 'active' ? 'text-success font-bold' : c.stage === 'inactive' ? 'text-danger font-bold' : 'text-warning font-bold'}`}
                >
                  {c.stage}
                </td>

                <td className="p-2 text-center">
                  <button
                    onClick={() => router.push(`/admin/cases/${c.id}/edit-case`)}
                    className="px-2 py-1 rounded bg-gold text-background"
                  >
                    Redigera
                  </button>
                </td>

                <td className="p-2 text-center">
                  <button
                    onClick={() => router.push(`/admin/cases/${c.id}/delete-case/`)}
                    className="px-2 py-1 rounded bg-danger text-white"
                  >
                    Radera
                  </button>
                </td>
              </tr>
            ))}
        </tbody>
      </table>
      {/* TODO:
      <p> Create case</p>
      <p> Update Case</p>
      <p> Add clues to existing case</p>
      <p> Update clues to existing case</p> */}
    </div>
  );
};
