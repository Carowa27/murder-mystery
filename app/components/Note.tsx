'use client';
import { dateFormatter } from '@/lib/helper fns/dateformatter';
import { INotes } from '@/lib/interfaces/gameRelated';
import { LinkIcon, PencilSimpleIcon, XIcon } from '@phosphor-icons/react';
import { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';

interface INoteParams {
  n: INotes;
}

export const Note = ({ n }: INoteParams) => {
  const router = useRouter(); // För router.refresh()
  const { investigationId } = useParams<{ investigationId: string }>(); // Behövs för vår DELETE route
  const [rotation, setRotation] = useState(0);
  const [deleting, setDeleting] = useState(false);

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setRotation(Math.floor(Math.random() * 6 - 4));
  }, []);

  async function handleDelete() {
    if (deleting) return;
    setDeleting(true);

    try {
      const res = await fetch(
        `/api/investigations/${investigationId}/notes/deleteNote/${n.id}`,
        { method: 'DELETE' }
      );

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
    <section
      style={{ transform: `rotate(${rotation}deg)` }}
      className="flex flex-col gap-2 shadow-md rounded py-2 px-4 my-2 mx-4 bg-[url(/images/item-backgrounds/open-case-v2.png)] bg-center bg-no-repeat bg-fill"
    >
      <div className="flex justify-between items-start">
        {/* `active:opacity-100` istället för `hover:opacity-100` */}
        <button className="cursor-pointer opacity-60 active:opacity-100 transition-opacity">
          <PencilSimpleIcon size={16} />
        </button>
        <button
          onClick={handleDelete}
          disabled={deleting}
          className="cursor-pointer opacity-60 active:opacity-100 transition-opacity disabled:opacity-30"
        >
          <XIcon size={16} />
        </button>
      </div>
      <p className="!font-handwritten !text-2xl">{n.content}</p>
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
