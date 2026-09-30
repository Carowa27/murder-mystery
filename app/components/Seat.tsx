import Image from 'next/image';
import type { IProfile } from '@/lib/interfaces/gameRelated';

// Stolarna i team-table.webp, i samma ordning som team_members.
export const tableSeatPositions = [
  'top-[24%] left-[12%]',
  'top-[24%] left-[88%]',
  'top-[75%] left-[12%]',
  'top-[75%] left-[88%]',
];

interface IParams {
  profile?: IProfile | null;
  className: string;
}

// En spelares plats vid bordet: avatar, eller första bokstaven, och namnet under.
// translate gör att mitten av stolen hamnar på platsen i className.
export const Seat = ({ profile, className }: IParams) => {
  return (
    <div
      className={`absolute flex -translate-x-1/2 -translate-y-1/2 flex-col items-center gap-[1cqw] ${className}`}
    >
      <div className="relative flex aspect-square w-[17cqw] items-center justify-center overflow-hidden rounded-full border-[0.8cqw] border-primary bg-primary/50">
        {profile?.avatar_url ? (
          <Image
            src={profile.avatar_url}
            alt={profile.display_name}
            fill
            sizes="96px"
            className="object-cover"
          />
        ) : (
          profile && (
            <div className="font-label text-[7cqw] text-text-primary">
              {profile.display_name.charAt(0).toUpperCase()}
            </div>
          )
        )}
      </div>

      {profile && (
        <div className="max-w-[24cqw] truncate rounded bg-background/80 px-[1.5cqw] font-label text-[3cqw] text-text-primary">
          {profile.display_name}
        </div>
      )}
    </div>
  );
};
