'use client';
import type { Database } from '@/lib/database.types';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';

type IProfile = Database['public']['Tables']['profiles']['Row'];
export const AdminProfilesSection = () => {
  const router = useRouter();
  const [profiles, setProfiles] = useState<IProfile[]>();
  const [searchParam, setSearchParam] = useState('');
  useEffect(() => {
    const timeout = setTimeout(() => {
      fetch(`/api/admin/profiles/search?q=${searchParam}`)
        .then((r) => r.json())
        .then(setProfiles);
    }, 300);
    return () => clearTimeout(timeout);
  }, [searchParam]);
  const handleEdit = (pId: string) => {
    router.push(`/admin/profiles/${pId}/edit-profile/`);
  };

  return (
    <div>
      <input
        type="search"
        value={searchParam}
        onChange={(e) => setSearchParam(e.target.value)}
        placeholder="Sök profiler..."
        className="w-full border border-primary bg-background px-3 py-2"
      />
      {profiles && profiles.length !== 0 && (
        <table className="w-full border-collapse">
          <thead>
            <tr className="border-b">
              <th className="text-left p-2">Namn</th>
              <th className="text-left p-2">Roll</th>
              <th className="text-center p-2">Redigera</th>
              <th className="text-center p-2">Radera</th>
            </tr>
          </thead>

          <tbody>
            {profiles &&
              profiles.length !== 0 &&
              profiles.map((p: IProfile) => (
                <tr key={p.id} className="border-b">
                  <td className="p-2">
                    <Link href={`/admin/profiles/${p.id}`}>{p.display_name} </Link>
                  </td>
                  <td
                    className={`p-2 text-center ${p.role === 'user' ? 'text-success font-bold' : 'text-warning font-bold'}`}
                  >
                    {p.role}
                  </td>
                  <td className="p-2 text-center">
                    <button
                      onClick={() => handleEdit(p.id)}
                      className="px-2 py-1 rounded bg-gold text-background"
                    >
                      Redigera
                    </button>
                  </td>
                  <td className="p-2 text-center">
                    <button
                      // onClick={() => handleDelete(c.id)}
                      className="px-2 py-1 rounded bg-danger text-white"
                    >
                      Radera
                    </button>
                  </td>
                </tr>
              ))}
          </tbody>
        </table>
      )}
    </div>
  );
};
