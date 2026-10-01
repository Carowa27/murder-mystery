import { IGameCharacter } from '@/lib/interfaces/gameRelated';
import { AccusationPhoto } from './AccusationPhoto';
import { cookies } from 'next/headers';

export const AccusationCard = async ({
  c,
  investigationId,
}: {
  c: IGameCharacter;
  investigationId: string;
}) => {
  const cookieStore = await cookies();

  const res = await fetch(
    `${process.env.NEXT_PUBLIC_SITE_URL}/api/investigations/${investigationId}/accusation/getAccused`,
    {
      headers: {
        Cookie: cookieStore.toString(),
      },
      cache: 'no-store',
    }
  );

  const accusations = await res.json();

  return <AccusationPhoto c={c} accused={c.id in accusations} wasGuilty={accusations[c.id]} />;
};
