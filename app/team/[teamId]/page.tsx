import Image from 'next/image';
import { createClient } from '@/lib/supabase/server';
import { redirect, notFound } from 'next/navigation';
import type { ITeam } from '@/lib/interfaces/gameRelated';
import CopyInviteLink from '@/app/components/CopyInviteLink';
import CaseDrawer from '@/app/components/CaseDrawer';
import OngoingInvestigation from '@/app/components/OngoingInvestigation';
import TeamMembers from '@/app/components/TeamMembers';
import { Scene } from '@/app/components/Scene';

export default async function TeamDetailPage({ params }: { params: Promise<{ teamId: string }> }) {
  const { teamId } = await params;
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect('/login');
  }

  const { data: team } = await supabase
    .from('teams')
    .select(
      'id, name, invite_code, owner_id, max_members, created_at, team_members(joined_at, profiles(id, display_name, avatar_url))'
    )
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

  // Kolla om teamet har en pågående utredning (active/paused)
  const { data: ongoingInvestigation } = await supabase
    .from('investigations')
    .select('id, status')
    .eq('team_id', teamId)
    .in('status', ['active', 'paused'])
    .single();

  // Boolean för att visa "Visa fall" knappen endast till ägaren av rummet
  const isOwner = user.id === typedTeam.owner_id;
  const ownerName =
    members.find((m) => m.profiles.id === typedTeam.owner_id)?.profiles.display_name ?? 'Ägaren';

  return (
    <div className="relative h-[calc(100vh-64px-80px)] overflow-hidden bg-background">
      <Scene
        background="/images/backgrounds/team-floor.webp"
        image="/images/item-backgrounds/team-table.webp"
        width={1015}
        height={1233}
      >
        {/* TeamMembers renderar avatarerna och hanterar real-time uppdateringar */}
        {/* Det här ser fortfarande lite konstigt ut. Som sagt: JSX hanterar `children` som allt mellan öppnande och stängande taggen */}
        <TeamMembers teamId={typedTeam.id} initialMembers={members}>
          <div className="absolute top-[50%] left-1/2 w-[62cqw] -translate-x-1/2 -translate-y-1/2 -rotate-10">
            <div className="relative aspect-[1537/1025]">
              <Image
                src="/images/item-backgrounds/casefiles-w-lightsource.png"
                alt=""
                fill
                sizes="90vw"
              />
            </div>
          </div>
        </TeamMembers>
      </Scene>

      <div className="absolute top-2 left-0 right-0 flex justify-center z-10">
        <CopyInviteLink inviteCode={typedTeam.invite_code} />
      </div>

      {/* Utanför Scene, annars fastnar lådan i scenen. Sidans mitt är bordets mitt. */}
      <div className="absolute inset-0 flex items-center justify-center">
        {/* Här används ongoingInvestigation! Pågående utredning finns → visa "Fortsätt" och "Överge" istället för CaseDrawer */}
        {ongoingInvestigation ? (
          <OngoingInvestigation
            investigationId={ongoingInvestigation.id}
            status={ongoingInvestigation.status}
            isOwner={isOwner}
          />
        ) : (
          // CaseDrawer hanterar nu våra tre states:
          // * Inget fall valt, non-owner → "{ownerName} väljer fall att lösa..."
          // * Inget fall valt, owner → "Välj fall" knapp → öppna drawer
          // * Fall valt → Polaroid med case cover + "Starta fall" knapp (owner) eller "Väntar på att {ownerName} ska starta fallet..." (non-owner)
          <CaseDrawer teamId={typedTeam.id} isOwner={isOwner} ownerName={ownerName} />
        )}
      </div>
    </div>
  );
}
