import { redirect } from 'next/navigation';
import { createServiceClient } from '@/lib/supabase/service';
import { getCurrentUser } from '@/lib/supabase/auth';
import { notFound } from 'next/navigation';
import Link from 'next/link';
import JoinTeamButton from '@/app/components/JoinTeamButton';

export default async function JoinPage({ params }: { params: Promise<{ inviteCode: string }> }) {
  const user = await getCurrentUser();
  // Ingen redirect on vi inte har en user. Gäster som ännu inte registrerat och loggat in ska kunna se inbjudningssidan!

  const { inviteCode } = await params;

  // Secret key klienten används så att vi kan bypass RLS och hitta teamet via invite code
  const supabasePrivileged = createServiceClient();

  const { data: team } = await supabasePrivileged
    .from('teams')
    .select('id, name, owner_id, profiles!teams_owner_id_fkey(display_name)')
    .eq('invite_code', inviteCode)
    .single();

  if (!team) {
    notFound();
  }

  // Kringgå Supabase's inferred types genom dubbel type casting
  const ownerName = (team.profiles as unknown as { display_name: string })?.display_name ?? 'Okänd';

  return (
    <div className="flex flex-col items-center justify-center min-h-[calc(100vh-128px)] px-4">
      <div className="w-full max-w-sm border border-gold/30 rounded-lg bg-surface p-8 text-center">
        <h1 className="text-gold mb-2">Du är inbjuden!</h1>
        <p className="text-text-secondary text-sm mb-6">
          <span className="text-text-primary font-bold">{ownerName}</span> vill att du går med i{' '}
          <span className="text-text-primary font-bold">{team.name}</span>
        </p>

        {user ? (
          <JoinTeamButton inviteCode={inviteCode} teamId={team.id} />
        ) : (
          <div className="flex flex-col gap-3">
            <p className="text-text-secondary text-xs">Du behöver ett konto för att gå med</p>
            <Link
              href="/login"
              className="block w-full rounded py-2.5 font-label text-sm uppercase tracking-widest text-background text-center"
              style={{ backgroundImage: 'var(--btn-primary)' }}
            >
              Logga in
            </Link>
            <Link
              href="/register"
              className="text-gold hover:text-gold-light transition-colors text-sm"
            >
              Inget konto? Registrera dig
            </Link>
          </div>
        )}
      </div>
    </div>
  );
}
