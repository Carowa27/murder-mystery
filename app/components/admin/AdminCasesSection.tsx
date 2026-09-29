'use client';
import type { Database } from '@/lib/database.types';
import { Button } from './AdminButton';
import { useEffect, useState } from 'react';

type ICase = Database['public']['Tables']['cases']['Row'];

export const AdminCasesSection = () => {
  const [cases, setCases] = useState<ICase[]>();
  useEffect(() => {
    fetch('/api/admin/cases')
      .then((r) => r.json())
      .then(setCases);
  }, []);

  return (
    <div>
      <Button
        btnDisabled={false}
        btnText={'Create new case'}
        btnAction={() => console.log('clicked')}
      />
      <table className="w-full border-collapse">
        <thead>
          <tr className="border-b">
            <th className="text-left p-2">Title</th>
            <th className="text-left p-2">Stage</th>
            <th className="text-center p-2">Edit</th>
            <th className="text-center p-2">Delete</th>
          </tr>
        </thead>

        <tbody>
          {cases &&
            cases.length !== 0 &&
            cases.map((c: ICase) => (
              <tr key={c.id} className="border-b">
                <td className="p-2">{c.title}</td>
                <td
                  className={`p-2 text-center ${c.stage === 'active' ? 'text-success font-bold' : c.stage === 'inactive' ? 'text-danger font-bold' : 'text-warning font-bold'}`}
                >
                  {c.stage}
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
      ---
      <p>Cases</p>
      Hantera cases och alla dess delar.
      <p> Create case</p>
      <p>X Read Case</p>
      <p> Update Case</p>
      <p> Delete case</p>
      <p> Add clues to existing case</p>
      <p> Update clues to existing case</p>
    </div>
  );
};
