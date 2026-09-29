'use client';

import { BackLink } from '@/app/components/BackLink';
import { Database } from '@/lib/database.types';
import { redirect, usePathname } from 'next/navigation';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';

type IProfile = Database['public']['Tables']['profiles']['Row'];

const AdminEditProfilePage = () => {
  const path = usePathname();
  const router = useRouter();
  const urlParts = path.split('/');
  const userId = urlParts[urlParts.length - 1];
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
      redirect('/admin?tab=profiles');
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
      <BackLink linkUrl={'/admin?tab=profiles'} linkText={'Back'} />
      <form onSubmit={handleSubmit} className="flex flex-col gap-4">
        <label>
          Display name
          <input
            value={displayName}
            onChange={(e) => setDisplayName(e.target.value)}
            className="border p-2 w-full mt-1"
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
            className="border p-2 w-full mt-1"
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
