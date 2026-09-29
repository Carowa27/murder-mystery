import { cookies } from 'next/headers';
import { redirect } from 'next/navigation';
import { AdminNav } from '../components/admin/AdminNav';
import { AdminOverviewSection } from '../components/admin/AdminOverviewSection';
import { AdminCasesSection } from '../components/admin/AdminCasesSection';
import { AdminInvestigationsSection } from '../components/admin/AdminInvestigationsSection';
import { AdminProfilesSection } from '../components/admin/AdminProfilesSection';

const AdminPage = async ({ searchParams }: { searchParams: Promise<{ tab?: string }> }) => {
  const { tab } = await searchParams;

  const activeTab = tab ?? 'overview';

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

  return (
    <div className="">
      <AdminNav />
      <section className="mt-4">
        {activeTab === 'overview' && <AdminOverviewSection />}
        {activeTab === 'cases' && <AdminCasesSection />}
        {activeTab === 'investigations' && <AdminInvestigationsSection />}
        {activeTab === 'profiles' && <AdminProfilesSection />}
      </section>
    </div>
  );
};
export default AdminPage;
