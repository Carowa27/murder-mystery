'use client';
import { dateFormatter } from '@/lib/helper fns/dateformatter';
import { INotes } from '@/lib/interfaces/gameRelated';
import { CheckIcon, LinkIcon, PencilSimpleIcon, XIcon } from '@phosphor-icons/react';
import { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';

interface INoteParams {
  n: INotes;
}

export const Note = ({ n }: INoteParams) => {
  const router = useRouter(); // För router.refresh()
  const { investigationId } = useParams<{ investigationId: string }>(); // Behövs för våra DELETE och PATCH routes
  const [rotation, setRotation] = useState(0);
  const [deleting, setDeleting] = useState(false);
  const [editing, setEditing] = useState(false);
  const [editContent, setEditContent] = useState(n.content);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setRotation(Math.floor(Math.random() * 6 - 4));
  }, []);

  async function handleEdit() {
    if (saving || !editContent.trim()) return;
    setSaving(true);

    try {
      const res = await fetch(`/api/investigations/${investigationId}/notes/updateNote/${n.id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ content: editContent.trim() }),
      });

      if (!res.ok) {
        const data = await res.json();
        console.error(data.error);
        setSaving(false);
        return;
      }

      setEditing(false);
      router.refresh();
    } catch {
      setSaving(false);
    }
  }

  function handleCancelEdit() {
    setEditContent(n.content);
    setEditing(false);
  }

  async function handleDelete() {
    if (deleting) return;
    setDeleting(true);

    try {
      const res = await fetch(`/api/investigations/${investigationId}/notes/deleteNote/${n.id}`, {
        method: 'DELETE',
      });

      if (!res.ok) {
        const data = await res.json();
        console.error(data.error);
        setDeleting(false);
        return;
      }

      router.refresh();
    } catch {
      setDeleting(false);
    }
  }
  return (
    // Rutat papper ur ett kollegieblock. bg-cover håller rutorna kvadratiska och
    // bg-left gör att hålen till vänster alltid syns. pl-[8%] håller texten till höger om hålen.
    <section
      style={{ transform: `rotate(${rotation}deg)` }}
      className="flex flex-col gap-2 py-3 pr-5 pl-[8%] my-2 mx-4 bg-[url(/images/item-backgrounds/notepaper.webp)] bg-cover bg-left drop-shadow-[0_6px_12px_rgba(0,0,0,0.6)]"
    >
      <div className="flex justify-between items-start">
        {editing ? (
          <>
            {/* Check icon när vi ändrar en note. */}
            {/* X:et avbryter edit mode, skulle kunna ändras ifall det inte känns intuitivt nog */}
            <button
              onClick={handleEdit}
              disabled={saving}
              className="cursor-pointer opacity-80 active:opacity-100 transition-opacity disabled:opacity-30"
            >
              <CheckIcon size={20} />
            </button>
            <button
              // Eftersom X ikonen har "double duty" behöver de olika nycklar så att de behandlas som två olika element!
              // Utan denna key property på båda knappar (godtyckliga strings) kan vi inte ändra en anteckning, avbryta och
              // sedan ta bort den. X knappen blir "greyed out"
              key="cancel"
              onClick={handleCancelEdit}
              className="cursor-pointer opacity-80 active:opacity-100 transition-opacity"
            >
              <XIcon size={20} />
            </button>
          </>
        ) : (
          <>
            <button
              onClick={() => setEditing(true)}
              className="cursor-pointer opacity-80 active:opacity-100 transition-opacity"
            >
              <PencilSimpleIcon size={20} />
            </button>
            <button
              key="delete"
              onClick={handleDelete}
              disabled={deleting}
              className="cursor-pointer opacity-80 active:opacity-100 transition-opacity disabled:opacity-30"
            >
              <XIcon size={20} />
            </button>
          </>
        )}
      </div>
      {editing ? (
        // Auto resizing textarea när vi ändrar en note. Höjden anpassas dynamiskt efter innehållet
        <textarea
          ref={(el) => {
            if (el) {
              el.style.height = 'auto';
              el.style.height = el.scrollHeight + 'px';
            }
          }}
          value={editContent}
          onChange={(e) => {
            setEditContent(e.target.value);
            e.target.style.height = 'auto';
            e.target.style.height = e.target.scrollHeight + 'px';
          }}
          autoFocus
          rows={1}
          className="!font-handwritten !text-2xl bg-white/90 text-surface rounded px-2 py-1 focus:outline-none resize-none"
        />
      ) : (
        <p className="!font-handwritten !text-2xl">{n.content}</p>
      )}
      {n.case_clues !== null && (
        <p className="flex gap-2 align-center">
          <LinkIcon size={20} />
          {n.case_clues.title}
        </p>
      )}
      <p className="!text-sm self-end">
        {n.profiles?.display_name} {dateFormatter(n.created_at)}
      </p>
    </section>
  );
};
