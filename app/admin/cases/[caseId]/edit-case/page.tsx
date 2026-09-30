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
  const [saving, setSaving] = useState(false);

  const [gameCase, setGameCase] = useState<ICaseObject>();
  const [openClues, setOpenClues] = useState<Record<string, boolean>>({});
  const [openCharacters, setOpenCharacters] = useState<Record<string, boolean>>({});

  useEffect(() => {
    fetch(`/api/admin/cases/${caseId}`)
      .then((r) => r.json())
      .then((data) => {
        setGameCase(data);
      });
  }, [caseId]);

  const updateCase = (updates: Partial<ICaseObject>) => {
    setGameCase((prev) =>
      prev
        ? {
            ...prev,
            ...updates,
          }
        : prev
    );
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
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!gameCase) return;

    setSaving(true);

    const res = await fetch(`/api/admin/cases/${caseId}`, {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(gameCase),
    });

    if (res.ok) {
      alert('Case updated');
      router.push('/admin?tab=cases');
    } else {
      const data = await res.json();
      alert(data.error ?? 'Failed to update case');
    }
  };
  if (!gameCase) {
    return (
      <div>
        <BackLink linkUrl="/admin?tab=cases" linkText="Fall" />

        <p>Laddar...</p>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit}>
      <BackLink linkUrl="/admin?tab=cases" linkText="Fall" />

      <div className="flex flex-col max-w-4xl mx-auto">
        {/* Case Details */}
        <h4 className="border border-l-muted-secondary border-t-muted-secondary border-b-gold-light border-r-gold-light ps-2 my-2 !font-label text-gold uppercase">
          Fall Översikt
        </h4>
        <label className="flex flex-col gap-1 mb-3">
          Stage
          <select
            value={gameCase.stage}
            onChange={(e) =>
              updateCase({
                stage: e.target.value as 'dev' | 'active' | 'inactive',
              })
            }
            className="border border-gold p-2 bg-background"
          >
            <option value="dev">Development</option>
            <option value="active">Active</option>
            <option value="inactive">Inactive</option>
          </select>
        </label>
        {gameCase.image_url && (
          <Image
            src={gameCase.image_url}
            alt={gameCase.title}
            className="max-w-xs border w-[50%] mx-auto"
            height={200}
            width={200}
          />
        )}

        <label className="flex flex-col gap-1 mb-3">
          <span>Omslagsbild URL</span>
          <input
            value={gameCase.image_url ?? ''}
            onChange={(e) =>
              updateCase({
                image_url: e.target.value,
              })
            }
            className="border border-gold p-2"
          />{' '}
        </label>

        <label className="flex flex-col gap-1 mt-3 mb-3">
          <span>Titel</span>
          <input
            value={gameCase.title}
            onChange={(e) =>
              updateCase({
                title: e.target.value,
              })
            }
            className="border border-gold p-2"
          />{' '}
        </label>

        <label className="flex flex-col gap-1">
          <span>Beskrivning</span>
          <input
            value={gameCase.description ?? ''}
            onChange={(e) =>
              updateCase({
                description: e.target.value,
              })
            }
            className="border border-gold p-2"
          />{' '}
        </label>

        {/* Clues */}
        <h4 className="border border-l-muted-secondary border-t-muted-secondary border-b-gold-light border-r-gold-light ps-2 my-2 mt-5 !font-label text-gold uppercase">
          Bevis
        </h4>

        {[...gameCase.case_clues]
          .sort((a, b) => a.id.localeCompare(b.id))
          .map((clue) => (
            <div
              key={clue.id}
              className={`mb-2 ${openClues[clue.id] && 'px-1 border-3 border-surface rounded'}`}
            >
              <div className={`flex justify-between my-1`}>
                {openClues[clue.id] ? (
                  <label className="flex flex-col gap-1">
                    {openClues[clue.id] && <span>Titel</span>}
                    <input
                      value={clue.title}
                      onChange={(e) =>
                        updateClue(clue.id, {
                          title: e.target.value,
                        })
                      }
                      className="border border-gold p-2"
                    />{' '}
                  </label>
                ) : (
                  <p className="ps-3 text-gold">{clue.title}</p>
                )}
                <button
                  onClick={(e) => (
                    e.preventDefault(),
                    setOpenClues((prev) => ({
                      ...prev,
                      [clue.id]: !prev[clue.id],
                    }))
                  )}
                  className="h-fit border border-gold active:bg-gold px-2 py-1 my-auto rounded !text-sm"
                >
                  {openClues[clue.id] ? 'Göm' : 'Visa'}
                </button>
              </div>
              {openClues[clue.id] && (
                <div className="pb-4 px-1">
                  <label className="flex flex-col gap-1 mb-2">
                    <span>Innehåll</span>
                    <textarea
                      value={clue.content ?? ''}
                      rows={4}
                      onChange={(e) =>
                        updateClue(clue.id, {
                          content: e.target.value,
                        })
                      }
                      className="border border-gold p-2"
                    />{' '}
                  </label>
                  {clue.is_key && (
                    <label className="flex gap-2 mb-2">
                      <span>Nyckel bevis</span>
                      <input
                        type="checkbox"
                        checked={clue.is_key}
                        onChange={(e) =>
                          updateClue(clue.id, {
                            is_key: e.target.checked,
                          })
                        }
                        className="accent-gold"
                      />
                    </label>
                  )}
                  {clue.clue_requirements.length !== 0 && (
                    <>
                      <label className="flex flex-col gap-1 mt-2">
                        <span>Nödvändigt bevis</span>

                        <div className="text-gold">
                          <select
                            value={clue.clue_requirements?.[0]?.required_clue_id ?? ''}
                            onChange={(e) =>
                              updateClue(clue.id, {
                                clue_requirements: e.target.value
                                  ? [{ required_clue_id: e.target.value }]
                                  : [],
                              })
                            }
                            className="border border-gold bg-background text-text-primary p-2 mb-2 w-[100%]"
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
                        </div>
                      </label>
                    </>
                  )}
                  {clue.image_url && (
                    <>
                      <label className="flex flex-col gap-1">
                        <span>Bild URL</span>
                        <input
                          value={clue.image_url}
                          onChange={(e) =>
                            updateClue(clue.id, {
                              image_url: e.target.value,
                            })
                          }
                          className="border border-gold p-2"
                        />{' '}
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
                </div>
              )}
            </div>
          ))}

        {/* Characters */}
        <section className="">
          <h4 className="border border-l-muted-secondary border-t-muted-secondary border-b-gold-light border-r-gold-light ps-2 my-2 !font-label text-gold uppercase">
            Characters
          </h4>

          {[...gameCase.characters]
            .sort((a, b) => a.id.localeCompare(b.id))
            .map((character) => (
              <div
                key={character.id}
                className={`mb-3 ${openCharacters[character.id] && 'px-2 py-1 border-3 border-surface rounded'}`}
              >
                <div className="flex justify-between my-2">
                  <p className="ps-3 text-gold">
                    {character.first_name} {character.last_name}
                  </p>
                  <button
                    onClick={(e) => (
                      e.preventDefault(),
                      setOpenCharacters((prev) => ({
                        ...prev,
                        [character.id]: !prev[character.id],
                      }))
                    )}
                    className="h-fit border border-gold active:bg-gold px-2 py-1 my-auto rounded !text-sm"
                  >
                    {openCharacters[character.id] ? 'Göm' : 'Visa'}
                  </button>
                </div>

                {openCharacters[character.id] && (
                  <div key={character.id} className="pb-4">
                    {character.image_url && (
                      <>
                        <Image
                          src={character.image_url}
                          alt={character.first_name}
                          className="max-w-xs border w-[100%] mx-auto"
                          height={200}
                          width={200}
                        />{' '}
                        <label className="flex flex-col gap-1">
                          <span>Bild URL</span>
                          <input
                            value={character.image_url}
                            onChange={(e) =>
                              updateCharacter(character.id, {
                                image_url: e.target.value,
                              })
                            }
                            className="border border-gold p-2"
                          />{' '}
                        </label>
                      </>
                    )}

                    <div className="grid grid-cols-3 gap-4 mt-2">
                      <label className="flex flex-col gap-1">
                        <span>Förnamn</span>
                        <input
                          value={character.first_name}
                          onChange={(e) =>
                            updateCharacter(character.id, {
                              first_name: e.target.value,
                            })
                          }
                          className="border border-gold p-2"
                        />{' '}
                      </label>

                      <label className="flex flex-col gap-1">
                        <span>Efternamn</span>
                        <input
                          value={character.last_name ?? ''}
                          onChange={(e) =>
                            updateCharacter(character.id, {
                              last_name: e.target.value,
                            })
                          }
                          className="border border-gold p-2"
                        />{' '}
                      </label>
                      <div className="flex flex-col justify-center gap-2">
                        <label>
                          Är offer{' '}
                          <input
                            type="checkbox"
                            checked={character.is_victim}
                            onChange={(e) =>
                              updateCharacter(character.id, {
                                is_victim: e.target.checked,
                              })
                            }
                            className="accent-gold"
                          />
                        </label>
                        <label>
                          Är skyldig{' '}
                          <input
                            type="checkbox"
                            checked={character.is_guilty}
                            onChange={(e) =>
                              updateCharacter(character.id, {
                                is_guilty: e.target.checked,
                              })
                            }
                            className="accent-gold"
                          />
                        </label>
                      </div>
                    </div>

                    {character.is_victim !== true && (
                      <label className="flex flex-col gap-1 mt-2">
                        <span>Relation till offer</span>
                        <input
                          value={character.relationship ?? ''}
                          onChange={(e) =>
                            updateCharacter(character.id, {
                              relationship: e.target.value,
                            })
                          }
                          className="border border-gold p-2"
                        />{' '}
                      </label>
                    )}

                    <label className="flex flex-col gap-1 mt-2">
                      <span>Beskrivning</span>
                      <textarea
                        value={character.description ?? ''}
                        rows={4}
                        onChange={(e) =>
                          updateCharacter(character.id, {
                            description: e.target.value,
                          })
                        }
                        className="border border-gold p-2"
                      />
                    </label>
                  </div>
                )}
              </div>
            ))}
        </section>
      </div>
      <button
        type="submit"
        disabled={saving}
        className="border border-gold bg-gold text-background px-4 py-2 rounded disabled:opacity-50"
      >
        {saving ? 'Sparar...' : 'Spara ändringar'}
      </button>
    </form>
  );
};

export default CaseEditPage;
