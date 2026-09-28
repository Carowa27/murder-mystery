import { cookies } from 'next/headers';
import { redirect } from 'next/navigation';

const AdminPage = async () => {
  const cookieStore = await cookies();
  const res = await fetch(`${process.env.NEXT_PUBLIC_SITE_URL}/api/admin/isAdmin`, {
    headers: {
      Cookie: cookieStore.toString(),
    },
    cache: 'no-store',
  });
  const user = await res.json();
  if (user.role !== 'admin') {
    redirect('/');
  }
  return <div className="">Admin</div>;
};
export default AdminPage;
