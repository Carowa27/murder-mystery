'use client';

import { BackLink } from '@/app/components/BackLink';
import { ICaseObject } from '@/lib/interfaces/adminRelated';
import Image from 'next/image';
import { useParams, useRouter } from 'next/navigation';
import { FormEvent, useEffect, useState } from 'react';

const CaseInfoPage = () => {
  const params = useParams();
  const caseId = params.caseId as string;
  const router = useRouter();

  const [gameCase, setGameCase] = useState<ICaseObject>();
  const [saving, setSaving] = useState(false);
  const [showClues, setShowClues] = useState<{ id: string; show: boolean }[]>([]);
  useEffect(() => {
    if (!gameCase) return;

    // eslint-disable-next-line react-hooks/set-state-in-effect
    setShowClues(
      gameCase.case_clues.map((clue) => ({
        id: clue.id,
        show: false,
      }))
    );
  }, [gameCase]);
  useEffect(() => {
    fetch(`/api/admin/cases/${caseId}`)
      .then((r) => r.json())
      .then(setGameCase);
  }, [caseId]);

  const updateCase = (updates: Partial<ICaseObject>) => {
    setGameCase((prev) => {
      if (!prev) return prev;

      return {
        ...prev,
        ...updates,
      };
    });
  };

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

  const updateCharacter = (
    characterId: string,
    updates: Partial<ICaseObject['characters'][number]>
  ) => {
    setGameCase((prev) => {
      if (!prev) return prev;

      return {
        ...prev,
        characters: prev.characters.map((character) =>
          character.id === characterId ? { ...character, ...updates } : character
        ),
      };
    });
  };

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (!gameCase) return;

    setSaving(true);

    try {
      const response = await fetch(`/api/admin/cases/${caseId}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(gameCase),
      });

      if (!response.ok) {
        const data = await response.json();
        throw new Error(data.error ?? 'Failed to save case');
      }

      alert('Case saved');
      router.refresh();
    } catch (error) {
      console.error(error);

      alert(error instanceof Error ? error.message : 'Something went wrong');
    } finally {
      setSaving(false);
    }
  };

  if (!gameCase) {
    return (
      <div>
        <BackLink linkUrl="/admin?tab=cases" linkText="Back" />

        <p>Loading...</p>
      </div>
    );
  }

  return (
    <div>
      <BackLink linkUrl="/admin?tab=cases" linkText="Back" />
      <div className="flex flex-col max-w-4xl mx-auto">
        {/* Case Details */}
        <h4 className="border border-l-muted-secondary border-t-muted-secondary border-b-gold-light border-r-gold-light ps-2 my-2 !font-label text-gold uppercase">
          Case Details
        </h4>

        {gameCase.image_url && (
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

          <p className="ps-3 text-gold">{gameCase.image_url ?? ''}</p>
        </label>

        <label className="flex flex-col gap-1 mt-3 mb-3">
          <span>Title</span>

          <p className="ps-3 text-gold">{gameCase.title}</p>
        </label>

        <label className="flex flex-col gap-1">
          <span>Description</span>

          <p className="ps-3 text-gold">{gameCase.description}</p>
        </label>

        {/* Clues */}
        <h4 className="border border-l-muted-secondary border-t-muted-secondary border-b-gold-light border-r-gold-light ps-2 my-2 mt-5 !font-label text-gold uppercase">
          Clues
        </h4>

        {[...gameCase.case_clues]
          .sort((a, b) => a.id.localeCompare(b.id))
          .map((clue) => (
            <div key={clue.id} className="border-b pb-4 mb-4">
              <div className="flex justify-between">
                <label className="flex flex-col gap-1 mb-2">
                  <span>Title</span>

                  <p className="ps-3 text-gold">{clue.title}</p>
                </label>
                <button
                  onClick={(e) => (
                    e.preventDefault(),
                    setShowClues((prev) =>
                      prev.map((item) =>
                        item.id === clue.id ? { ...item, show: !item.show } : item
                      )
                    )
                  )}
                  className="h-fit border border-gold active:bg-gold px-2 py-1 my-auto rounded !text-sm"
                >
                  show
                </button>
              </div>
              {showClues.find((item) => item.id === clue.id)?.show && (
                <>
                  <label className="flex flex-col gap-1 mb-2">
                    <span>Content</span>

                    <p className="ps-3 text-gold">{clue.content}</p>
                  </label>
                  {clue.is_key && (
                    <label className="flex flex-col gap-2 mb-2">
                      <span>Key clue</span>
                      <p className="ps-3 text-gold"> Is key clue</p>
                    </label>
                  )}
                  {clue.clue_requirements.length !== 0 && (
                    <>
                      <label className="flex flex-col gap-1 mt-2">
                        <span>Requires clue</span>

                        <p className="ps-3 text-gold">
                          <ul className="list-disc list-inside">
                            {gameCase.case_clues
                              .filter((c) => c.id !== clue.id)
                              .filter((requiredClue) =>
                                clue.clue_requirements?.some(
                                  (requirement) => requirement.required_clue_id === requiredClue.id
                                )
                              )
                              .map((requiredClue, index, array) => (
                                <li key={requiredClue.id}>
                                  {requiredClue.title}
                                  {/* Lägg bara till <br /> om det INTE är det sista elementet i listan */}
                                  {index < array.length - 1 && <br />}
                                </li>
                              ))}
                          </ul>
                        </p>
                      </label>
                    </>
                  )}
                  {clue.image_url && (
                    <>
                      <label className="flex flex-col gap-1">
                        <span>Image URL</span>

                        <p className="ps-3 text-gold">{clue.image_url}</p>
                      </label>
                      <Image
                        src={clue.image_url}
                        alt={clue.title}
                        className="max-w-xs mt-2 border w-[100%] mx-auto"
                        height={200}
                        width={200}
                      />
                    </>
                  )}
                </>
              )}
            </div>
          ))}
      </div>{' '}
    </div>
  );
};

export default CaseInfoPage;
