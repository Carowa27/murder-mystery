'use client';
import type { Database } from '@/lib/database.types';
import Link from 'next/link';
import { useEffect, useState } from 'react';

type IInvestigation = Database['public']['Tables']['investigations']['Row'];

export const AdminInvestigationsSection = () => {
  const [investigations, setInvestigations] = useState<IInvestigation[]>();
  useEffect(() => {
    fetch('/api/admin/investigations')
      .then((r) => r.json())
      .then(setInvestigations);
  }, []);

  return (
    <div>
      <table className="w-full border-collapse">
        <thead>
          <tr className="border-b">
            <th className="text-left p-2">Title</th>
            <th className="text-left p-2">Status</th>
            <th className="text-center p-2">Edit</th>
            <th className="text-center p-2">Delete</th>
          </tr>
        </thead>

        <tbody>
          {investigations &&
            investigations.length !== 0 &&
            investigations.map((inv: IInvestigation) => (
              <tr key={inv.id} className="border-b">
                <td className="p-2">
                  <Link href={`/admin/investigations/${inv.id}`}>{inv.id}</Link>
                </td>
                <td
                  className={`p-2 text-center ${inv.status === 'active' ? 'text-success font-bold' : inv.status === 'failed' || 'abandoned' ? 'text-danger font-bold' : 'text-warning font-bold'}`}
                >
                  {inv.status}
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
      <p>Investigations</p>
      Hantera active intestigations
      <p>X Read investigation</p>
      <p>Update investigation</p>
      <p>Delete investigation</p>
    </div>
  );
};
