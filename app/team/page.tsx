import { createClient } from '@/lib/supabase/server';
import { redirect } from 'next/navigation';
import Link from 'next/link';
import type { ITeam } from '@/lib/interfaces/gameRelated';

export default async function TeamPage() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) {
    redirect('/login');
  }

  // Genom att gå via team_members och använda teams() får vi både:
  // * teams vi själva har skapat
  // * teams vi har gått med i
  const { data: memberships } = await supabase
    .from('team_members')
    .select('team_id, joined_at, teams(id, name, invite_code, owner_id, max_members, created_at)')
    .eq('user_id', user.id);

  const teams = (memberships?.map((m) => m.teams) ?? []) as ITeam[];

  return (
    <div className="min-h-[calc(100vh-64px-80px)] bg-[url(/images/backgrounds/team-bg.png)] bg-center bg-no-repeat bg-cover">
      <div className="flex flex-col items-center pt-12 px-4">
        <h1 className="text-gold mb-6 text-2xl font-bold bg-background/80 px-6 py-2 rounded-lg border border-gold/30">Dina team</h1>

        {teams.length === 0 ? (
          <p className="text-text-secondary">Du är inte med i något team ännu.</p>
        ) : (
          <ul className="w-full max-w-sm flex flex-col gap-3">
            {teams.map((team) => (
              <li key={team.id}>
                <Link
                  href={`/team/${team.id}`}
                  className="block w-full border border-gold/30 rounded-lg bg-surface/80 p-4 hover:border-gold transition-colors"
                >
                  <span className="text-text-primary font-label uppercase tracking-widest text-sm">
                    {team.name}
                  </span>
                </Link>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
}
