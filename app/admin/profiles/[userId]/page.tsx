'use client';

import { BackLink } from '@/app/components/BackLink';
import { Database } from '@/lib/database.types';
import { redirect, useParams } from 'next/navigation';
import { useEffect, useState } from 'react';
import Image from 'next/image';

type IProfile = Database['public']['Tables']['profiles']['Row'];

const AdminProfileInfoPage = () => {
  const params = useParams();
  const userId = params.userId as string;
  const [profile, setProfile] = useState<IProfile>();

  useEffect(() => {
    fetch(`/api/admin/profiles/${userId}`)
      .then((r) => r.json())
      .then(setProfile);
  }, []);

  return (
    <div>
      <BackLink linkUrl={'/admin?tab=profiles'} linkText={'Back'} />
      <div className="w-50 h-50 overflow-hidden rounded-[50%] mx-auto my-4 border-3 border-gold">
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
          onClick={() => redirect(`/admin/profiles/${profile?.id}/edit-profile/`)}
        >
          Edit
        </button>
      </div>
    </div>
  );
};
export default AdminProfileInfoPage;
