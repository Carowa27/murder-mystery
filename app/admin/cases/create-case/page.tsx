'use client';

import { BackLink } from '@/app/components/BackLink';
import { ICaseObject } from '@/lib/interfaces/adminRelated';
import { useRouter } from 'next/navigation';
import { useState } from 'react';

type Clue = ICaseObject['case_clues'][number];
type Character = ICaseObject['characters'][number];

const SectionHeader = ({
  title,
  buttonText,
  onButtonClick,
  className = '',
}: {
  title: string;
  buttonText?: string;
  onButtonClick?: () => void;
  className?: string;
}) => (
  <div
    className={`flex justify-between items-center border border-l-muted-secondary border-t-muted-secondary border-b-gold-light border-r-gold-light ps-2 pe-1 py-1 my-2 ${className}`}
  >
    <h4 className="!font-label text-gold uppercase">{title}</h4>
    {buttonText && (
      <button
        type="button"
        onClick={onButtonClick}
        className="border border-gold active:bg-gold px-3 py-1 rounded !text-sm normal-case"
      >
        {buttonText}
      </button>
    )}
  </div>
);

const createEmptyCase = (): ICaseObject => ({
  id: crypto.randomUUID(),
  created_at: new Date().toISOString(),
  title: '',
  description: '',
  image_url: null,
  location: null,
  price: 0,
  stage: 'dev',
  story_date: null,
  difficulty_id: 1,
  difficulties: { id: 1, max_accusations: 0, name: '' }, // adjust to your real default
  characters: [],
  case_clues: [],
});

const NewCasePage = () => {
  const router = useRouter();

  // Lazy initializer so the UUID is generated once, not on every render
  const [gameCase, setGameCase] = useState<ICaseObject>(createEmptyCase);
  const [saving, setSaving] = useState(false);
  const [openClues, setOpenClues] = useState<Record<string, boolean>>({});
  const [openCharacters, setOpenCharacters] = useState<Record<string, boolean>>({});

  // ---- Updaters ----
  const updateCase = (updates: Partial<ICaseObject>) =>
    setGameCase((prev) => ({ ...prev, ...updates }));

  const updateClue = (clueId: string, updates: Partial<Clue>) =>
    setGameCase((prev) => ({
      ...prev,
      case_clues: prev.case_clues.map((c) => (c.id === clueId ? { ...c, ...updates } : c)),
    }));

  const updateCharacter = (characterId: string, updates: Partial<Character>) =>
    setGameCase((prev) => ({
      ...prev,
      characters: prev.characters.map((c) => (c.id === characterId ? { ...c, ...updates } : c)),
    }));

  // ---- Adders ----
  const addClue = () => {
    const newId = crypto.randomUUID();
    const newClue: Clue = {
      id: newId,
      case_id: gameCase.id,
      clue_type_id: 1,
      title: '',
      content: '',
      image_url: null,
      is_key: false,
      created_at: new Date().toISOString(),
      clue_types: { id: 1, name: 'Brottsplatsrapport' },
      clue_requirements: [],
    };
    setGameCase((prev) => ({ ...prev, case_clues: [...prev.case_clues, newClue] }));
    setOpenClues((prev) => ({ ...prev, [newId]: true }));
  };

  const addCharacter = () => {
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
    setGameCase((prev) => ({ ...prev, characters: [...prev.characters, newCharacter] }));
    setOpenCharacters((prev) => ({ ...prev, [newId]: true }));
  };

  // ---- Removers (handy when creating from scratch) ----
  const removeClue = (clueId: string) =>
    setGameCase((prev) => ({
      ...prev,
      case_clues: prev.case_clues
        .filter((c) => c.id !== clueId)
        // also drop any requirements pointing at the removed clue
        .map((c) => ({
          ...c,
          clue_requirements: c.clue_requirements.filter((r) => r.required_clue_id !== clueId),
        })),
    }));

  const removeCharacter = (characterId: string) =>
    setGameCase((prev) => ({
      ...prev,
      characters: prev.characters.filter((c) => c.id !== characterId),
    }));

  // ---- Submit ----
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!gameCase.title.trim()) {
      alert('Titel krävs');
      return;
    }

    setSaving(true);
    try {
      const res = await fetch('/api/admin/cases/createCase', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(gameCase),
      });

      if (res.ok) {
        router.push('/admin?tab=cases');
      } else {
        const data = await res.json().catch(() => ({}));
        alert(data.error ?? 'Failed to create case');
      }
    } finally {
      setSaving(false);
    }
  };
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
        {/* <div className="flex justify-between items-center mt-5 mb-3">
          <h4 className={headingClass}>Bevis</h4>
          <button type="button" onClick={addClue} className="border border-gold px-3 py-1 rounded">
            + Lägg till bevis
          </button>
        </div> */}
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
          {/* <div className="flex justify-between items-center mt-5 mb-3">
            <h4 className={headingClass}>Karaktärer</h4>
            <button
              type="button"
              onClick={addCharacter}
              className="border border-gold px-3 py-1 rounded"
            >
              + Lägg till karaktär
            </button>
          </div> */}
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
                            onChange={(e) =>
                              updateCharacter(character.id, { is_victim: e.target.checked })
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
                              updateCharacter(character.id, { is_guilty: e.target.checked })
                            }
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
        {saving ? 'Sparar...' : 'Skapa fall'}
      </button>
    </form>
  );
};

export default NewCasePage;
