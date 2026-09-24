'use client';
import { dateFormatter } from '@/lib/helper fns/dateformatter';
import { INotes } from '@/lib/interfaces/gameRelated';
import { LinkIcon } from '@phosphor-icons/react';
import { useEffect, useState } from 'react';

interface INoteParams {
  n: INotes;
}

export const Note = ({ n }: INoteParams) => {
  const [rotation, setRotation] = useState(0);

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setRotation(Math.floor(Math.random() * 6 - 4));
  }, []);
  return (
    <section
      style={{ transform: `rotate(${rotation}deg)` }}
      className="flex flex-col gap-2 shadow-md rounded py-2 px-4 my-2 mx-4 bg-[url(/images/item-backgrounds/open-case-v2.png)] bg-center bg-no-repeat bg-fill"
    >
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
