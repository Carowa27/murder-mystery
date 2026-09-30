'use client';
import { BackLink } from '@/app/components/BackLink';
import { ICaseObject } from '@/lib/interfaces/adminRelated';
import Image from 'next/image';
import { useParams, useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';

const CaseEditPage = () => {
  const params = useParams();
  const caseId = params.caseId as string;
  const router = useRouter();
  const [gameCase, setGameCase] = useState<ICaseObject>();

  useEffect(() => {
    fetch(`/api/admin/cases/${caseId}`)
      .then((r) => r.json())
      .then(setGameCase);
  }, []);

  const updateClue = (clueId: string, updates: Partial<ICaseObject['case_clues'][number]>) => {
    setGameCase((prev) => {
      if (!prev) return prev;

      return {
        ...prev,
        case_clues: prev.case_clues.map((clue) =>
          clue.id === clueId ? { ...clue, ...updates } : clue
        ),
      };
    });
  };
  useEffect(() => {
    console.log(gameCase?.case_clues);
  }, [gameCase]);
  return (
    <div>
      <BackLink linkUrl={'/admin?tab=cases'} linkText={'Fall'} />

      <form className="flex flex-col gap-6 max-w-4xl mx-auto">
        {/* Case Details */}
        <section className="border p-4 rounded">
          <h2 className="text-xl font-bold mb-4">Case Details</h2>

          {gameCase?.image_url && (
            <Image
              src={gameCase.image_url}
              alt={gameCase.title}
              className="max-w-xs border w-[100%]"
              height={200}
              width={200}
            />
          )}
          <label className="flex flex-col gap-1 mb-3">
            <span>Cover Image URL</span>
            <input type="text" defaultValue={gameCase?.image_url ?? ''} className="border p-2" />
          </label>

          <label className="flex flex-col gap-1 mt-3 mb-3">
            <span>Title</span>
            <input type="text" defaultValue={gameCase?.title} className="border p-2" />
          </label>

          <label className="flex flex-col gap-1">
            <span>Description</span>
            <textarea defaultValue={gameCase?.description ?? ''} rows={5} className="border p-2" />
          </label>
        </section>

        {/* Clues */}
        <section className="border p-4 rounded">
          <h2 className="text-xl font-bold mb-4">Clues</h2>

          {gameCase &&
            gameCase.case_clues
              .sort((a, b) => a.id.localeCompare(b.id))
              .map((clue) => (
                <div key={clue.id} className="border-b pb-4 mb-4">
                  <label className="flex flex-col gap-1 mb-2">
                    <span>Title</span>
                    <input type="text" defaultValue={clue.title} className="border p-2" />
                  </label>
                  <label className="flex flex-col gap-1 mb-2">
                    <span>Content</span>
                    <textarea defaultValue={clue.content ?? ''} rows={4} className="border p-2" />
                  </label>
                  <label className="flex items-center gap-2 mb-2">
                    <input type="checkbox" defaultChecked={clue.is_key} />
                    Key clue
                  </label>
                  <label className="flex flex-col gap-1 mt-2">
                    <span>Requires clue</span>
                    <select
                      value={clue.clue_requirements?.[0]?.required_clue_id ?? ''}
                      onChange={(e) =>
                        updateClue(clue.id, {
                          clue_requirements: e.target.value
                            ? [{ required_clue_id: e.target.value }]
                            : [],
                        })
                      }
                      className="border p-2"
                    >
                      <option value="">No requirement</option>

                      {gameCase.case_clues
                        .filter((c) => c.id !== clue.id)
                        .map((c) => (
                          <option key={c.id} value={c.id}>
                            {c.title}
                          </option>
                        ))}
                    </select>
                  </label>
                  <label className="flex flex-col gap-1">
                    <span>Image URL</span>
                    <input type="text" defaultValue={clue.image_url ?? ''} className="border p-2" />
                  </label>
                  {clue.image_url && (
                    <Image
                      src={clue.image_url}
                      alt={clue.title}
                      className="max-w-xs mt-2 border w-[100%]"
                      height={200}
                      width={200}
                    />
                  )}
                </div>
              ))}
        </section>

        {/* Characters */}
        <section className="border p-4 rounded">
          <h2 className="text-xl font-bold mb-4">Characters</h2>

          {gameCase?.characters
            .sort((a, b) => a.id.localeCompare(b.id))
            .map((character) => (
              <div key={character.id} className="border-b pb-4 mb-4">
                {character.image_url && (
                  <Image
                    src={character.image_url}
                    alt={character.first_name}
                    className="max-w-xs border w-[100%]"
                    height={200}
                    width={200}
                  />
                )}
                <div className="grid grid-cols-2 gap-4">
                  <label className="flex flex-col gap-1">
                    <span>First Name</span>
                    <input type="text" defaultValue={character.first_name} className="border p-2" />
                  </label>

                  <label className="flex flex-col gap-1">
                    <span>Last Name</span>
                    <input
                      type="text"
                      defaultValue={character.last_name ?? ''}
                      className="border p-2"
                    />
                  </label>
                </div>
                <div className="flex gap-[25%]">
                  <label className="flex items-center gap-2 mt-2">
                    <input type="checkbox" defaultChecked={character.is_victim} />
                    Victim
                  </label>

                  <label className="flex items-center gap-2 mt-2">
                    <input type="checkbox" defaultChecked={character.is_guilty} />
                    Guilty
                  </label>
                </div>

                {character.is_victim !== true && (
                  <label className="flex flex-col gap-1 mt-2">
                    <span>Relation to Victim</span>
                    <input
                      type="text"
                      defaultValue={character.relationship ?? ''}
                      className="border p-2"
                    />
                  </label>
                )}

                <label className="flex flex-col gap-1 mt-2">
                  <span>Description</span>
                  <textarea
                    defaultValue={character.description ?? ''}
                    rows={4}
                    className="border p-2"
                  />
                </label>
              </div>
            ))}
        </section>

        <button type="submit" className="bg-primary text-white px-4 py-2 rounded">
          Save Changes
        </button>
      </form>
    </div>
  );
};

export default CaseEditPage;
