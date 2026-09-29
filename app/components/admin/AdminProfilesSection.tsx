'use client';
import type { Database } from '@/lib/database.types';
import { useEffect, useState } from 'react';

type IProfile = Database['public']['Tables']['profiles']['Row'];
export const AdminProfilesSection = () => {
  const [profiles, setProfiles] = useState<IProfile[]>();
  const [searchParam, setSearchParams] = useState('caro');
  useEffect(() => {
    fetch(`/api/admin/profiles/search?q=${searchParam}`)
      .then((r) => r.json())
      .then(setProfiles);
  }, []);
  console.log(profiles);
  return (
    <div>
      <table className="w-full border-collapse">
        <thead>
          <tr className="border-b">
            <th className="text-left p-2">Display name</th>
            <th className="text-left p-2">Role</th>
            <th className="text-center p-2">Edit</th>
            <th className="text-center p-2">Delete</th>
          </tr>
        </thead>

        <tbody>
          {profiles &&
            profiles.length !== 0 &&
            profiles.map((p: IProfile) => (
              <tr key={p.id} className="border-b">
                <td className="p-2">{p.display_name}</td>
                <td
                  className={`p-2 text-center ${p.role === 'user' ? 'text-success font-bold' : 'text-warning font-bold'}`}
                >
                  {p.role}
                </td>

                <td className="p-2 text-center">
                  <button
                    // onClick={() => handleEdit(c)}
                    className="px-2 py-1 rounded bg-gold text-background"
                  >
                    Edit
                  </button>
                </td>

                <td className="p-2 text-center">
                  <button
                    // onClick={() => handleDelete(c.id)}
                    className="px-2 py-1 rounded bg-danger text-white"
                  >
                    Delete
                  </button>
                </td>
              </tr>
            ))}
        </tbody>
      </table>
      <p>Profiles</p>
      <p> Hantera profiler </p>
      <p>X Read profile</p>
      <p>Update profile</p>
    </div>
  );
};
