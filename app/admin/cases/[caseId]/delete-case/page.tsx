'use client';

import { ICase } from '@/lib/interfaces/gameRelated';
import { useParams, useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';

const DeleteCasePage = () => {
  const params = useParams();
  const caseId = params.caseId as string;
  const router = useRouter();
  const [gameCase, setGameCase] = useState<ICase>();
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    fetch(`/api/admin/cases/${caseId}`)
      .then((r) => r.json())
      .then(setGameCase);
  }, []);
  const softDeleteCase = async () => {
    setLoading(true);

    const res = await fetch(`/api/admin/cases/deleteCase/${gameCase?.id}`, {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        stage: 'inactive',
      }),
    });

    if (res.ok || res.status === 200) {
      alert('Case set inactive');
      router.push(`/admin?tab=cases`);
    } else {
      const data = await res.json();
      alert(data.error ?? 'Case has not been updated, something went wrong');
      router.refresh();
    }
  };
  return (
    <div>
      <h3 className="text-center">Are you sure?</h3>
      {loading ? (
        'Loading ... '
      ) : (
        <>
          <div>
            <div className=" pb-1">
              <h4 className="border border-l-muted-secondary border-t-muted-secondary border-b-gold-light border-r-gold-light ps-2 my-2 !font-label text-gold uppercase">
                Case to delete
              </h4>
              <div className="px-2 flex flex-col gap-2">
                <h4 className="text-gold-light">{gameCase?.title}</h4>
                <div className="flex flex-col">
                  <p className="">Taking place:</p>
                  <div className="flex gap-5">
                    <p className="text-gold-light">{gameCase?.location}</p>
                    <p className="text-gold-light">{gameCase?.story_date}</p>
                  </div>
                </div>
                <div className="flex flex-col">
                  <p className="">Description:</p>
                  <p className="text-gold-light">{gameCase?.description}</p>
                </div>

                <div className="flex flex-col">
                  <h5 className="">Other info</h5>
                  <p className="text-gold-light">Difficulty: {gameCase?.difficulty_id}</p>
                  <p className="text-gold-light">
                    Price: {gameCase?.price === 0 ? 'free' : gameCase?.price + ' sek'}
                  </p>
                </div>
              </div>
            </div>
          </div>
          <div className="flex justify-evenly gap-3 mt-4">
            <button
              className="w-full rounded py-2.5 font-paragraph font-bold text-sm uppercase tracking-widest text-text-primary bg-danger hover:opacity-90 cursor-pointer disabled:bg-none disabled:bg-btn-disabled disabled:text-btn-disabled-text disabled:cursor-not-allowed"
              onClick={() => softDeleteCase()}
            >
              Yes, delete
            </button>
            <button
              className="w-full rounded py-2.5 font-paragraph font-bold text-sm uppercase tracking-widest text-text-primary border-gold border-2 hover:opacity-90 cursor-pointer disabled:bg-none disabled:bg-btn-disabled disabled:text-btn-disabled-text disabled:cursor-not-allowed"
              onClick={() => router.push(`/admin?tab=cases`)}
            >
              No, go back
            </button>
          </div>
        </>
      )}
    </div>
  );
};
export default DeleteCasePage;
