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
    <div className="h-[calc(100vh-64px-80px)] bg-[url(/images/backgrounds/team-bg.png)] bg-center bg-no-repeat bg-cover">
      <div className="flex flex-col justify-center gap-3 h-[100%] px-2">
        <section className="flex justify-between">
          <div className="flex justify-center items-center bg-primary/50 rounded-full h-30 w-30 border border-4 border-primary">
            {team_members[0]
              ? (team_members[0].profiles.avatar_url ?? team_members[0].profiles.display_name)
              : ''}
          </div>
          <div className="flex justify-center items-center bg-primary/50 rounded-full h-30 w-30 border border-4 border-primary">
            {team_members[1]
              ? (team_members[1].profiles.avatar_url ?? team_members[1].profiles.display_name)
              : ''}
          </div>
        </section>
        <section>
          <div className="relative flex justify-center w-full">
            <Image
              src={'/images/item-backgrounds/open-case.png'}
              alt={'open case folder'}
              width={100}
              height={100}
              sizes="80vw"
              className="w-[80%] h-auto pe-10 -rotate-5"
            />
            <div className="w-[130] absolute top-7 left-16 -rotate-2 text-surface">
              <p className="!font-printed !text-sm !font-bold">{team.name} </p>
              <p className="!font-printed !text-sm"> {team.invite_code}</p>
            </div>
            <div className="w-[120] absolute top-5 left-63 -rotate-9 text-surface flex flex-col">
              <p className="!font-printed !text-sm"> {teamCase.title} </p>
              <Image
                src={teamCase.image_url}
                alt={teamCase.title}
                width={100}
                height={100}
                className="brightness-140 pt-4 self-center rotate-2"
              />
            </div>
          </div>
        </section>
        <section className="flex justify-between">
          <div className="flex justify-center items-center bg-primary/50 rounded-full h-30 w-30 border border-4 border-primary">
            {team_members[2]
              ? (team_members[2].profiles.avatar_url ?? team_members[2].profiles.display_name)
              : ''}
          </div>
          <div className="flex justify-center items-center bg-primary/50 rounded-full h-30 w-30 border border-4 border-primary">
            {team_members[3]
              ? (team_members[3].profiles.avatar_url ?? team_members[3].profiles.display_name)
              : ''}
          </div>
        </section>
      </div>
    </div>
  );
};
export default TeamPage;
