import Image from 'next/image';
import { createClient } from '@/lib/supabase/server';
import { redirect, notFound } from 'next/navigation';
import type { ITeam } from '@/lib/interfaces/gameRelated';

export default async function TeamDetailPage({ params }: { params: Promise<{ teamId: string }> }) {
  const { teamId } = await params;
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) {
    redirect('/login');
  }

  const { data: team } = await supabase
    .from('teams')
    .select('id, name, invite_code, owner_id, max_members, created_at, team_members(joined_at, profiles(id, display_name, avatar_url))')
    .eq('id', teamId)
    .single();

  if (!team) {
    notFound();
  }

  // Eftersom vi använder supabase klienten direkt på servern får vi ut team på en form som går emot vår
  // egen interface. Double cast via unknown för att konvertera
  // Alternativet skulle vara att skriva en GET route i api/teams/route.ts
  const typedTeam = team as unknown as ITeam;
  const members = typedTeam.team_members ?? [];

  return (
    <div className="min-h-[calc(100vh-64px-80px)] bg-[url(/images/backgrounds/team-bg.png)] bg-center bg-no-repeat bg-cover">
      <div className="flex flex-col justify-between pt-20 px-2 min-h-[calc(100vh-64px-80px)]">
        <section className="flex justify-between pt-8">
          {[0, 1].map((i) => (
            <div key={i} className="flex justify-center items-center bg-primary/50 rounded-full h-20 w-20 border-4 border-primary">
              {/* Visa första bokstaven i användarens namn! */}
              {members[i] ? members[i].profiles.display_name.charAt(0).toUpperCase() : ''}
            </div>
          ))}
        </section>

        <section>
          <div className="flex justify-center">
            <Image
              src={'/images/item-backgrounds/casefiles-w-lightsource.png'}
              alt={''}
              width={100}
              height={100}
              className="w-[80%] h-auto pe-4 pb-8 -rotate-10"
            />
          </div>
        </section>

        <section className="flex justify-between">
          {[2, 3].map((i) => (
            <div key={i} className="flex justify-center items-center bg-primary/50 rounded-full h-20 w-20 border-4 border-primary">
              {members[i] ? members[i].profiles.display_name.charAt(0).toUpperCase() : ''}
            </div>
          ))}
        </section>
      </div>
    </div>
  );
}
