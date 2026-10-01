'use client';

import { Database } from '@/lib/database.types';
import { useRouter, useParams } from 'next/navigation';
import { useEffect, useState } from 'react';
import Image from 'next/image';
import { AdminBackLink } from '@/app/components/admin/AdminBackLink';

type IProfile = Database['public']['Tables']['profiles']['Row'];

const AdminEditProfilePage = () => {
  const router = useRouter();
  const params = useParams();
  const userId = params.userId as string;
  const [profile, setProfile] = useState<IProfile>();
  const [displayName, setDisplayName] = useState('');
  const [avatarUrl, setAvatarUrl] = useState<string | null>('');
  const [role, setRole] = useState('');
  const [loading, setLoading] = useState(false);
  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);

    const res = await fetch(`/api/admin/profiles/${userId}`, {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        display_name: displayName,
        avatar_url: avatarUrl === '' ? null : avatarUrl,
        role: role || null,
      }),
    });

    if (res.ok || res.status === 200) {
      alert('Profile updated');
      router.push(`/admin/profiles/${userId}`);
    } else {
      const data = await res.json();
      alert(data.error ?? 'Profile has not been updated, something went wrong');
      router.refresh();
    }
  }

  useEffect(() => {
    fetch(`/api/admin/profiles/${userId}`)
      .then((r) => r.json())
      .then(setProfile);
  }, []);

  useEffect(() => {
    if (!profile) return;
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setDisplayName(profile!.display_name);
    setAvatarUrl(profile!.avatar_url);
    setRole(profile!.role);
  }, [profile]);

  return (
    <div>
      <AdminBackLink linkUrl={'/admin?tab=profiles'} linkText={'Profiler'} />
      <div className="w-50 h-50 overflow-hidden rounded-[50%] mx-auto my-4 border-3 border-gold">
        {avatarUrl === '' || avatarUrl === null ? (
          <div className="w-[100%] h-auto aspect-[1/1] bg-muted"></div>
        ) : (
          <Image
            src={avatarUrl}
            alt={'avatar image'}
            height={100}
            width={100}
            className="w-[100%] h-auto"
          />
        )}
      </div>
      <form onSubmit={handleSubmit} className="flex flex-col gap-4">
        <label>
          Display name
          <input
            value={displayName}
            onChange={(e) => setDisplayName(e.target.value)}
            className="border border-gold p-2 w-full mt-1"
          />
        </label>

        <label>
          Role
          <div className="flex gap-4 mt-1">
            <label>
              <input
                type="radio"
                name="role"
                value="user"
                checked={role === 'user'}
                onChange={(e) => setRole(e.target.value)}
                className="accent-surface"
              />{' '}
              User
            </label>
            <label>
              <input
                type="radio"
                name="role"
                value="admin"
                checked={role === 'admin'}
                onChange={(e) => setRole(e.target.value)}
                className="accent-surface"
              />{' '}
              Admin
            </label>
          </div>
        </label>
        <label>
          Avatar URL
          <input
            value={avatarUrl ?? ''}
            onChange={(e) => setAvatarUrl(e.target.value)}
            className="border border-gold p-2 w-full mt-1"
          />
        </label>

        <button type="submit" disabled={loading} className="bg-primary px-4 py-2">
          {loading ? 'Saving...' : 'Save'}
        </button>
      </form>
    </div>
  );
};
export default AdminEditProfilePage;
