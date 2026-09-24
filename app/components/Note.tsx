'use client';
import { dateFormatter } from '@/lib/helper fns/dateformatter';
import { INotes } from '@/lib/interfaces/gameRelated';
import { LinkIcon } from '@phosphor-icons/react';

interface INoteParams {
  n: INotes;
}

export const Note = ({ n }: INoteParams) => {
  return (
    <section className="shadow-sm rounded py-2 px-4 my-2 mx-4 bg-[url(/images/item-backgrounds/open-case-v2.png)] bg-center bg-no-repeat bg-fill">
      <p className="">{n.content}</p>
      {n.case_clues !== null && (
        <p className="flex gap-2 align-center">
          <LinkIcon size={20} />
          {n.case_clues.title}
        </p>
      )}
      <p className="">
        Written by: {n.profiles?.display_name} at: {dateFormatter(n.created_at)}
      </p>
    </section>
  );
};
