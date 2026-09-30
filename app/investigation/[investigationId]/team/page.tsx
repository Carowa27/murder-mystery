import { Scene } from '@/app/components/Scene';
import { Seat, tableSeatPositions } from '@/app/components/Seat';
import { ITeamSession } from '@/lib/interfaces/gameRelated';
import { cookies } from 'next/headers';
import Image from 'next/image';

const TeamPage = async ({ params }: { params: Promise<{ investigationId: string }> }) => {
  const { investigationId } = await params;
  const cookieStore = await cookies();

  const res = await fetch(
    `${process.env.NEXT_PUBLIC_SITE_URL}/api/investigations/${investigationId}/team`,
    {
      headers: {
        Cookie: cookieStore.toString(),
      },
      cache: 'no-store',
    }
  );

  const teamSession: ITeamSession = await res.json();

  const team = teamSession.teams;
  const team_members = teamSession.teams.team_members;
  const teamCase = teamSession.cases;

  return (
    <div className="relative h-[calc(100vh-64px-80px)] overflow-hidden bg-background">
      <Scene
        background="/images/backgrounds/team-floor.webp"
        image="/images/item-backgrounds/team-table.webp"
        width={1024}
        height={1536}
      >
        {tableSeatPositions.map((position, i) => (
          <Seat key={position} profile={team_members[i]?.profiles} className={position} />
        ))}

        {/* Mappen mitt på bordet. Positionerna inuti är i procent av mappbilden,
            vänster sida för teamet och höger sida för fallet. */}
        <div className="absolute top-[49%] left-1/2 w-[66cqw] -translate-x-1/2 -translate-y-1/2 -rotate-3">
          <div className="@container relative aspect-[1438/878]">
            <Image src="/images/item-backgrounds/open-case.png" alt="" fill sizes="90vw" />

            <div className="absolute top-[16%] left-[8%] w-[34%] break-words text-surface">
              <div className="font-printed text-[3.8cqw] leading-tight font-bold">{team.name}</div>
              <div className="mt-[2cqw] font-printed text-[3.2cqw]">Kod: {team.invite_code}</div>
            </div>

            <div className="absolute top-[18%] left-[60%] flex w-[30%] flex-col gap-[2cqw] text-surface">
              <div className="font-printed text-[3.6cqw] leading-tight">{teamCase.title}</div>
              <div className="relative aspect-square w-full rotate-2 shadow-md">
                <Image
                  src={teamCase.image_url}
                  alt={teamCase.title}
                  fill
                  sizes="30vw"
                  className="object-cover"
                />
              </div>
            </div>
          </div>
        </div>
      </Scene>
    </div>
  );
};
export default TeamPage;
