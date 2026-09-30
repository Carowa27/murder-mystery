'use client';

import { BackLink } from '@/app/components/BackLink';
import { useParams } from 'next/navigation';
import { useEffect, useState } from 'react';
import { IInvestigationDetails } from '@/lib/interfaces/adminRelated';
import Image from 'next/image';

const AdminInvestigationInfoPage = () => {
  const params = useParams();
  const investigationId = params.investigationId as string;
  const [investigation, setInvestigation] = useState<IInvestigationDetails>();
  const [showClues, setShowClues] = useState(false);
  const [showNotes, setShowNotes] = useState(false);

  useEffect(() => {
    fetch(`/api/admin/investigations/${investigationId}`)
      .then((r) => r.json())
      .then(setInvestigation);
  }, []);

  return (
    <div>
      <BackLink linkUrl={'/admin?tab=investigations'} linkText={'Utredningar'} />
      <div className="pb-1">
        <h4 className="border border-l-muted-secondary border-t-muted-secondary border-b-gold-light border-r-gold-light ps-2 my-2 !font-label text-gold uppercase">
          Utredning
        </h4>
        <div className="px-2">
          <label>
            Id
            <p className="text-gold-light">{investigation?.id}</p>
          </label>
          <div className="flex gap-15">
            <label>
              Startad
              <p className="text-gold-light">
                {investigation?.started_at &&
                  new Date(investigation?.started_at).toLocaleString('sv-SE', {
                    day: '2-digit',
                    month: '2-digit',
                    year: '2-digit',
                    hour: '2-digit',
                    minute: '2-digit',
                  })}
              </p>
            </label>
            <label>
              Status
              <p className="text-gold-light">{investigation?.status}</p>
            </label>
          </div>
        </div>
      </div>
      <div className="pb-1">
        <h4 className="border border-l-muted-secondary border-t-muted-secondary border-b-gold-light border-r-gold-light ps-2 my-2 !font-label text-gold uppercase">
          Team
        </h4>
        <div className="px-2">
          <div className="flex gap-15">
            <label>
              Namn <p className="text-gold-light">{investigation?.teams.name}</p>
            </label>
            <label>
              Kod <p className="text-gold-light">{investigation?.teams.invite_code}</p>
            </label>
          </div>
          <h5>Medlemmar</h5>
          {investigation?.teams.team_members.map((m, i) => (
            <div key={m.joined_at + i} className="my-1 py-1 ps-3 flex gap-2 items-center">
              <div className="w-10 h-10 overflow-hidden rounded-[50%]">
                {m.profiles.avatar_url === '' || m.profiles.avatar_url === null ? (
                  <div className="w-[100%] h-auto aspect-[1/1] bg-muted"></div>
                ) : (
                  m.profiles && (
                    <Image
                      src={m.profiles.avatar_url || ''}
                      alt={'avatar image'}
                      height={100}
                      width={100}
                      className="w-[100%] h-auto"
                    />
                  )
                )}
              </div>
              <div>
                <p className="ps-3 text-gold-light">{m.profiles.display_name}</p>
                <p className="ps-3 text-gold-light">
                  Gick med{' '}
                  {new Date(m.joined_at).toLocaleString('sv-SE', {
                    day: '2-digit',
                    month: '2-digit',
                    year: '2-digit',
                    hour: '2-digit',
                    minute: '2-digit',
                  })}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
      <div className=" pb-1">
        <h4 className="border border-l-muted-secondary border-t-muted-secondary border-b-gold-light border-r-gold-light ps-2 my-2 !font-label text-gold uppercase">
          Aktivt fall
        </h4>
        <div className="px-2">
          <p className="ps-3 text-gold-light">{investigation?.cases.title}</p>

          <div className="flex justify-between">
            <h5>Hittade bevis</h5>
            <button
              className="border border-gold active:bg-gold px-2 rounded !text-sm"
              onClick={() => setShowClues(!showClues)}
            >
              Visa bevis
            </button>
          </div>
          {showClues && (
            <>
              {investigation?.investigation_found_clues.map((cf, i) => (
                <div key={cf.found_at + i} className="rounded my-2 py-1 px-3 bg-surface">
                  <p className="text-gold-light">{cf.case_clues.title}</p>
                  <p className="text-text-primary text-end">{cf.case_clues.clue_types.name}</p>
                  <p className="text-text-primary text-end">
                    {new Date(cf.found_at).toLocaleString('sv-SE', {
                      day: '2-digit',
                      month: '2-digit',
                      year: '2-digit',
                      hour: '2-digit',
                      minute: '2-digit',
                    })}
                  </p>
                </div>
              ))}
            </>
          )}
          <div className="flex justify-between mt-3">
            <h5>Anteckningar</h5>
            <button
              className="border border-gold active:bg-gold px-2 rounded !text-sm"
              onClick={() => setShowNotes(!showNotes)}
            >
              Visa anteckningar
            </button>
          </div>
          {showNotes && (
            <>
              {investigation?.notes.map((n, i) => (
                <div key={n.created_at + i} className="rounded my-2 py-1 px-3 bg-surface">
                  <p className="text-gold-light">{n.content}</p>
                  <p className="text-text-primary text-end">{n.profiles.display_name}</p>
                  <p className="text-text-primary text-end">
                    {new Date(n.created_at).toLocaleString('sv-SE', {
                      day: '2-digit',
                      month: '2-digit',
                      year: '2-digit',
                      hour: '2-digit',
                      minute: '2-digit',
                    })}
                  </p>
                </div>
              ))}
            </>
          )}
        </div>
      </div>
    </div>
  );
};
export default AdminInvestigationInfoPage;
