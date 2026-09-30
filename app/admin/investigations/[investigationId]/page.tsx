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

  useEffect(() => {
    fetch(`/api/admin/investigations/${investigationId}`)
      .then((r) => r.json())
      .then(setInvestigation);
  }, []);

  return (
    <div>
      <BackLink linkUrl={'/admin?tab=investigations'} linkText={'Back'} />
      <div className="px-2 pb-1">
        <h4 className="border-l border-b border-l-muted-secondary ps-2 my-2 !font-label text-gold uppercase">
          Investigation
        </h4>
        <label>
          Id
          <p className="text-gold-light">{investigation?.id}</p>
        </label>
        <div className="flex gap-15">
          <label>
            Started at
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
      <div className="px-2 pb-1">
        <h4 className="border-l border-b border-l-muted-secondary ps-2 my-2 !font-label text-gold uppercase">
          Team
        </h4>
        <div className="flex gap-15">
          <label>
            Name <p className="text-gold-light">{investigation?.teams.name}</p>
          </label>
          <label>
            Code <p className="text-gold-light">{investigation?.teams.invite_code}</p>
          </label>
        </div>
        <h5>Members</h5>
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
                Joined{' '}
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
      <div className="border border-gold-light px-2 pb-1">
        <h4>Case</h4>
        <label>
          Title <p className="ps-3 text-gold-light">{investigation?.cases.title}</p>
        </label>
        <h5>Clues</h5>
        {investigation?.investigation_found_clues.map((cf, i) => (
          <div key={cf.found_at + i} className="border my-1 py-1">
            <p className="ps-3 text-gold-light">{cf.case_clues.title}</p>
            <p className="ps-3 text-gold-light">{cf.case_clues.clue_types.name}</p>
            <p className="ps-3 text-gold-light">
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
        <h5>Notes</h5>
        {investigation?.notes.map((n, i) => (
          <div key={n.created_at + i} className="border my-1 py-1">
            <p className="ps-3 text-gold-light">{n.content}</p>
            <p className="ps-3 text-gold-light">{n.profiles.display_name}</p>
            <p className="ps-3 text-gold-light">
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
      </div>
      {/* <div className="w-50 h-50 overflow-hidden rounded-[50%] mx-auto my-4 border-3 border-gold">
        {profile?.avatar_url === '' || profile?.avatar_url === null ? (
          <div className="w-[100%] h-auto aspect-[1/1] bg-muted"></div>
        ) : (
          profile && (
            <Image
              src={profile.avatar_url}
              alt={'avatar image'}
              height={100}
              width={100}
              className="w-[100%] h-auto"
            />
          )
        )}
      </div>
      <div className="flex flex-col gap-4">
        <label>
          Display name
          <p className="ps-3 text-gold-light">{profile?.display_name}</p>
        </label>

        <label>
          Role
          <p className="ps-3 text-gold-light">{profile?.role}</p>
        </label>
        <label>
          Avatar URL
          <p className="ps-3 text-gold-light">{profile?.avatar_url ?? 'no avatar available'}</p>
        </label>

        <button
          className="bg-primary px-4 py-2"
          onClick={() => redirect(`/admin/investigations/${investigation?.id}/edit-investigation/`)}
        >
          Edit
        </button>
      </div> */}
    </div>
  );
};
export default AdminInvestigationInfoPage;
