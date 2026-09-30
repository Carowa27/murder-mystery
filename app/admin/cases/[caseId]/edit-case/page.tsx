'use client';

import { SectionHeader } from '@/app/components/admin/AdminSectionHeader';
import { BackLink } from '@/app/components/BackLink';
import { ICaseObject } from '@/lib/interfaces/adminRelated';
import { useParams, useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';

type Clue = ICaseObject['case_clues'][number];
type Character = ICaseObject['characters'][number];

type Difficulty = { id: number; name: string; max_accusations: number };
type ClueType = { id: number; name: string };

type CaseResponse = {
  data: ICaseObject;
  difficulties: Difficulty[];
  clueTypes: ClueType[];
};

const CaseEditForm = () => {
  const params = useParams();
  const router = useRouter();
  const caseId = params.caseId as string;
  const [difficulties, setDifficulties] = useState<Difficulty[]>([]);
  const [gameCase, setGameCase] = useState<ICaseObject>();
  const [loadError, setLoadError] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);
  const [openClues, setOpenClues] = useState<Record<string, boolean>>({});
  const [openCharacters, setOpenCharacters] = useState<Record<string, boolean>>({});
  const [clueTypes, setClueTypes] = useState<ClueType[]>([]);

  // ---- Load ----
  useEffect(() => {
    let cancelled = false;

    const load = async () => {
      try {
        const res = await fetch(`/api/admin/cases/${caseId}`);
        if (!res.ok) throw new Error('Kunde inte hämta fallet');
        const json = (await res.json()) as CaseResponse;
        const { data } = json;

        const difRes = await fetch(`/api/admin/caseDifficulties`);
        if (!difRes.ok) throw new Error('Kunde inte hämta svårighetsgraderna');
        const difjson = await difRes.json();

        const ctRes = await fetch(`/api/admin/caseTypes`);
        if (!ctRes.ok) throw new Error('Kunde inte hämta bevis typerna');
        const ctjson = await ctRes.json();

        if (cancelled) return;

        const byCreated = <T extends { created_at: string }>(a: T, b: T) =>
          a.created_at.localeCompare(b.created_at);

        setDifficulties(difjson ?? []);
        setGameCase({
          ...data,
          case_clues: [...(data.case_clues ?? [])]
            .map((c) => ({
              ...c,
              clue_requirements: c.clue_requirements ?? [],
              clue_characters: c.clue_characters ?? [],
            }))
            .sort(byCreated),
          characters: [...(data.characters ?? [])].sort(byCreated),
        });
        setClueTypes(ctjson ?? []);
      } catch (err) {
        if (!cancelled) {
          setLoadError(err instanceof Error ? err.message : 'Kunde inte hämta fallet');
        }
      }
    };

    load();
    return () => {
      cancelled = true;
    };
  }, [caseId]);

  // ---- Updaters ----
  const updateCase = (updates: Partial<ICaseObject>) =>
    setGameCase((prev) => (prev ? { ...prev, ...updates } : prev));

  const updateClue = (clueId: string, updates: Partial<Clue>) =>
    setGameCase((prev) =>
      prev
        ? {
            ...prev,
            case_clues: prev.case_clues.map((c) => (c.id === clueId ? { ...c, ...updates } : c)),
          }
        : prev
    );

  const updateCharacter = (characterId: string, updates: Partial<Character>) =>
    setGameCase((prev) =>
      prev
        ? {
            ...prev,
            characters: prev.characters.map((c) =>
              c.id === characterId ? { ...c, ...updates } : c
            ),
          }
        : prev
    );

  // Only one victim and one guilty per case, and never the same character
  const setRole = (id: string, role: 'is_victim' | 'is_guilty', value: boolean) =>
    setGameCase((prev) => {
      if (!prev) return prev;
      const other = role === 'is_victim' ? 'is_guilty' : 'is_victim';
      return {
        ...prev,
        characters: prev.characters.map((c) => {
          if (c.id === id) return { ...c, [role]: value, ...(value ? { [other]: false } : {}) };
          return value ? { ...c, [role]: false } : c;
        }),
      };
    });

  // ---- Adders ----
  const addClue = () => {
    if (!gameCase) return;
    const newId = crypto.randomUUID();
    const defaultType = clueTypes[0] ?? { id: 1, name: 'Brottsplatsrapport' };

    const newClue: Clue = {
      id: newId,
      case_id: gameCase.id,
      clue_type_id: defaultType.id,
      title: '',
      content: '',
      image_url: null,
      is_key: false,
      created_at: new Date().toISOString(),
      clue_types: defaultType,
      clue_requirements: [],
      clue_characters: [],
    };

    setGameCase((prev) => (prev ? { ...prev, case_clues: [...prev.case_clues, newClue] } : prev));
    setOpenClues((prev) => ({ ...prev, [newId]: true }));
  };

  const addCharacter = () => {
    if (!gameCase) return;
    const newId = crypto.randomUUID();

    const newCharacter: Character = {
      id: newId,
      case_id: gameCase.id,
      created_at: new Date().toISOString(),
      first_name: '',
      last_name: '',
      description: '',
      relationship: '',
      image_url: null,
      is_victim: false,
      is_guilty: false,
    };

    setGameCase((prev) =>
      prev ? { ...prev, characters: [...prev.characters, newCharacter] } : prev
    );
    setOpenCharacters((prev) => ({ ...prev, [newId]: true }));
  };

  // ---- Removers ----
  const removeClue = (clueId: string) => {
    if (!confirm('Ta bort beviset?')) return;
    setGameCase((prev) =>
      prev
        ? {
            ...prev,
            case_clues: prev.case_clues
              .filter((c) => c.id !== clueId)
              .map((c) => ({
                ...c,
                clue_requirements: c.clue_requirements.filter((r) => r.required_clue_id !== clueId),
              })),
          }
        : prev
    );
  };

  const removeCharacter = (characterId: string) => {
    if (!confirm('Ta bort karaktären?')) return;
    setGameCase((prev) =>
      prev
        ? {
            ...prev,
            characters: prev.characters.filter((c) => c.id !== characterId),
            case_clues: prev.case_clues.map((c) => ({
              ...c,
              clue_characters: c.clue_characters.filter((cc) => cc.character_id !== characterId),
            })),
          }
        : prev
    );
  };

  // ---- Submit ----
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!gameCase) return;

    if (!gameCase.title.trim()) {
      alert('Titel krävs');
      return;
    }

    setSaving(true);
    try {
      const res = await fetch(`/api/admin/cases/${caseId}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(gameCase),
      });

      if (res.ok) {
        router.push('/admin?tab=cases');
      } else {
        const data = (await res.json().catch(() => ({}))) as { error?: string };
        alert(data.error ?? 'Failed to update case');
      }
    } finally {
      setSaving(false);
    }
  };

  // ---- States ----
  if (loadError) {
    return (
      <div>
        <BackLink linkUrl="/admin?tab=cases" linkText="Fall" />
        <p>{loadError}</p>
      </div>
    );
  }

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
        {/* Case details */}
        <SectionHeader title="Fall Översikt" />

        <label className="flex flex-col gap-1 mb-3">
          Stage
          <select
            value={gameCase.stage}
            onChange={(e) => updateCase({ stage: e.target.value as ICaseObject['stage'] })}
            className="border border-gold p-2 bg-background"
          >
            <option value="dev">Development</option>
            <option value="active">Active</option>
            <option value="inactive">Inactive</option>
          </select>
        </label>

        <label className="flex flex-col gap-1 mb-3">
          <span>Svårighetsgrad</span>
          <select
            value={gameCase.difficulty_id}
            onChange={(e) => {
              const d = difficulties.find((x) => x.id === Number(e.target.value));
              if (d) updateCase({ difficulty_id: d.id, difficulties: d });
            }}
            className="border border-gold p-2 bg-background"
          >
            {difficulties.map((d) => (
              <option key={d.id} value={d.id}>
                {d.name} ({d.max_accusations} anklagelser)
              </option>
            ))}
          </select>
        </label>

        <label className="flex flex-col gap-1 mb-3">
          <span>Pris (kr, 0 = gratis)</span>
          <input
            type="number"
            min={0}
            value={gameCase.price}
            onChange={(e) => updateCase({ price: Math.max(0, Number(e.target.value) || 0) })}
            className="border border-gold p-2"
          />
        </label>

        <label className="flex flex-col gap-1 mb-3">
          <span>Plats</span>
          <input
            value={gameCase.location ?? ''}
            onChange={(e) => updateCase({ location: e.target.value || null })}
            className="border border-gold p-2"
          />
        </label>

        <label className="flex flex-col gap-1 mb-3">
          <span>Datum i berättelsen</span>
          <input
            type="date"
            value={gameCase.story_date ?? ''}
            onChange={(e) => updateCase({ story_date: e.target.value || null })}
            className="border border-gold p-2"
          />
        </label>

        {gameCase.image_url && (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src={gameCase.image_url}
            alt={gameCase.title}
            className="max-w-xs border w-[50%] mx-auto"
          />
        )}

        <label className="flex flex-col gap-1 mb-3">
          <span>Omslagsbild URL</span>
          <input
            value={gameCase.image_url ?? ''}
            onChange={(e) => updateCase({ image_url: e.target.value || null })}
            className="border border-gold p-2"
          />
        </label>

        <label className="flex flex-col gap-1 mb-3">
          <span>Titel</span>
          <input
            value={gameCase.title}
            onChange={(e) => updateCase({ title: e.target.value })}
            className="border border-gold p-2"
            required
          />
        </label>

        <label className="flex flex-col gap-1">
          <span>Beskrivning</span>
          <input
            value={gameCase.description ?? ''}
            onChange={(e) => updateCase({ description: e.target.value })}
            className="border border-gold p-2"
          />
        </label>

        {/* Clues */}
        <SectionHeader
          title="Bevis"
          buttonText="+ Lägg till bevis"
          onButtonClick={addClue}
          className="mt-5"
        />

        {gameCase.case_clues.map((clue) => {
          const isOpen = !!openClues[clue.id];
          return (
            <div
              key={clue.id}
              className={`mb-2 ${isOpen ? 'px-1 border-3 border-surface rounded' : ''}`}
            >
              <div className="flex justify-between my-1">
                {isOpen ? (
                  <label className="flex flex-col gap-1">
                    <span>Titel</span>
                    <input
                      value={clue.title}
                      onChange={(e) => updateClue(clue.id, { title: e.target.value })}
                      className="border border-gold p-2"
                    />
                  </label>
                ) : (
                  <p className="ps-3 text-gold">{clue.title || '(utan titel)'}</p>
                )}
                <div className="flex gap-2 my-auto">
                  <button
                    type="button"
                    onClick={() => setOpenClues((prev) => ({ ...prev, [clue.id]: !prev[clue.id] }))}
                    className="h-fit border border-gold active:bg-gold px-2 py-1 rounded !text-sm"
                  >
                    {isOpen ? 'Göm' : 'Visa'}
                  </button>
                  <button
                    type="button"
                    onClick={() => removeClue(clue.id)}
                    className="h-fit border border-gold active:bg-gold px-2 py-1 rounded !text-sm"
                  >
                    Ta bort
                  </button>
                </div>
              </div>

              {isOpen && (
                <div className="pb-4 px-1">
                  <label className="flex flex-col gap-1 mb-2">
                    <span>Typ</span>
                    <select
                      value={clue.clue_type_id}
                      onChange={(e) => {
                        const t = clueTypes.find((x) => x.id === Number(e.target.value));
                        if (t) updateClue(clue.id, { clue_type_id: t.id, clue_types: t });
                      }}
                      className="border border-gold p-2 bg-background"
                    >
                      {clueTypes.map((t) => (
                        <option key={t.id} value={t.id}>
                          {t.name}
                        </option>
                      ))}
                    </select>
                  </label>

                  <label className="flex flex-col gap-1 mb-2">
                    <span>Innehåll</span>
                    <textarea
                      value={clue.content ?? ''}
                      rows={4}
                      onChange={(e) => updateClue(clue.id, { content: e.target.value })}
                      className="border border-gold p-2"
                    />
                  </label>

                  <label className="flex gap-2 mb-2">
                    <span>Nyckel bevis</span>
                    <input
                      type="checkbox"
                      checked={clue.is_key}
                      onChange={(e) => updateClue(clue.id, { is_key: e.target.checked })}
                      className="accent-gold"
                    />
                  </label>

                  <label className="flex flex-col gap-1 mt-2">
                    <span>Nödvändigt bevis</span>
                    <select
                      value={clue.clue_requirements[0]?.required_clue_id ?? ''}
                      onChange={(e) =>
                        updateClue(clue.id, {
                          clue_requirements: e.target.value
                            ? [{ required_clue_id: e.target.value }]
                            : [],
                        })
                      }
                      className="border border-gold bg-background text-text-primary p-2"
                    >
                      <option value="">Inget krav</option>
                      {gameCase.case_clues
                        .filter((c) => c.id !== clue.id)
                        .map((c) => (
                          <option key={c.id} value={c.id}>
                            {c.title || '(utan titel)'}
                          </option>
                        ))}
                    </select>
                  </label>

                  {gameCase.characters.length > 0 && (
                    <fieldset className="mt-2">
                      <legend>Berör karaktärer</legend>
                      {gameCase.characters.map((ch) => (
                        <label key={ch.id} className="flex gap-2">
                          <input
                            type="checkbox"
                            checked={clue.clue_characters.some((cc) => cc.character_id === ch.id)}
                            onChange={(e) =>
                              updateClue(clue.id, {
                                clue_characters: e.target.checked
                                  ? [...clue.clue_characters, { character_id: ch.id }]
                                  : clue.clue_characters.filter((cc) => cc.character_id !== ch.id),
                              })
                            }
                            className="accent-gold"
                          />
                          {ch.first_name || '(namnlös)'} {ch.last_name ?? ''}
                        </label>
                      ))}
                    </fieldset>
                  )}

                  <label className="flex flex-col gap-1 mt-2">
                    <span>Bild URL</span>
                    <input
                      value={clue.image_url ?? ''}
                      onChange={(e) => updateClue(clue.id, { image_url: e.target.value || null })}
                      className="border border-gold p-2"
                    />
                  </label>
                  {clue.image_url && (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img
                      src={clue.image_url}
                      alt={clue.title}
                      className="max-w-xs mt-2 border w-[100%] mx-auto"
                    />
                  )}
                </div>
              )}
            </div>
          );
        })}

        {/* Characters */}
        <section>
          <SectionHeader
            title="Karaktärer"
            buttonText="+ Lägg till karaktär"
            onButtonClick={addCharacter}
            className="mt-5"
          />

          {gameCase.characters.map((character) => {
            const isOpen = !!openCharacters[character.id];
            return (
              <div
                key={character.id}
                className={`mb-3 ${isOpen ? 'px-2 py-1 border-3 border-surface rounded' : ''}`}
              >
                <div className="flex justify-between my-2">
                  <p className="ps-3 text-gold">
                    {character.first_name || character.last_name
                      ? `${character.first_name} ${character.last_name ?? ''}`
                      : '(namnlös)'}
                  </p>
                  <div className="flex gap-2 my-auto">
                    <button
                      type="button"
                      onClick={() =>
                        setOpenCharacters((prev) => ({
                          ...prev,
                          [character.id]: !prev[character.id],
                        }))
                      }
                      className="h-fit border border-gold active:bg-gold px-2 py-1 rounded !text-sm"
                    >
                      {isOpen ? 'Göm' : 'Visa'}
                    </button>
                    <button
                      type="button"
                      onClick={() => removeCharacter(character.id)}
                      className="h-fit border border-gold active:bg-gold px-2 py-1 rounded !text-sm"
                    >
                      Ta bort
                    </button>
                  </div>
                </div>

                {isOpen && (
                  <div className="pb-4">
                    {character.image_url && (
                      // eslint-disable-next-line @next/next/no-img-element
                      <img
                        src={character.image_url}
                        alt={character.first_name}
                        className="max-w-xs border w-[100%] mx-auto"
                      />
                    )}
                    <label className="flex flex-col gap-1">
                      <span>Bild URL</span>
                      <input
                        value={character.image_url ?? ''}
                        onChange={(e) =>
                          updateCharacter(character.id, { image_url: e.target.value || null })
                        }
                        className="border border-gold p-2"
                      />
                    </label>

                    <div className="grid grid-cols-3 gap-4 mt-2">
                      <label className="flex flex-col gap-1">
                        <span>Förnamn</span>
                        <input
                          value={character.first_name}
                          onChange={(e) =>
                            updateCharacter(character.id, { first_name: e.target.value })
                          }
                          className="border border-gold p-2"
                        />
                      </label>

                      <label className="flex flex-col gap-1">
                        <span>Efternamn</span>
                        <input
                          value={character.last_name ?? ''}
                          onChange={(e) =>
                            updateCharacter(character.id, { last_name: e.target.value })
                          }
                          className="border border-gold p-2"
                        />
                      </label>

                      <div className="flex flex-col justify-center gap-2">
                        <label>
                          Är offer{' '}
                          <input
                            type="checkbox"
                            checked={character.is_victim}
                            onChange={(e) => setRole(character.id, 'is_victim', e.target.checked)}
                            className="accent-gold"
                          />
                        </label>
                        <label>
                          Är skyldig{' '}
                          <input
                            type="checkbox"
                            checked={character.is_guilty}
                            onChange={(e) => setRole(character.id, 'is_guilty', e.target.checked)}
                            className="accent-gold"
                          />
                        </label>
                      </div>
                    </div>

                    {!character.is_victim && (
                      <label className="flex flex-col gap-1 mt-2">
                        <span>Relation till offer</span>
                        <input
                          value={character.relationship ?? ''}
                          onChange={(e) =>
                            updateCharacter(character.id, { relationship: e.target.value })
                          }
                          className="border border-gold p-2"
                        />
                      </label>
                    )}

                    <label className="flex flex-col gap-1 mt-2">
                      <span>Beskrivning</span>
                      <textarea
                        value={character.description ?? ''}
                        rows={4}
                        onChange={(e) =>
                          updateCharacter(character.id, { description: e.target.value })
                        }
                        className="border border-gold p-2"
                      />
                    </label>
                  </div>
                )}
              </div>
            );
          })}
        </section>
      </div>

      <button
        type="submit"
        disabled={saving}
        className="border border-gold bg-gold text-background px-4 py-2 rounded disabled:opacity-50 mt-4"
      >
        {saving ? 'Sparar...' : 'Spara ändringar'}
      </button>
    </form>
  );
};

export default CaseEditForm;
