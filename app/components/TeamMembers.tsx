'use client';

import { useEffect, useState } from 'react';
import { createClient } from '@/lib/supabase/client';
import type { ITeamMember } from '@/lib/interfaces/gameRelated';
import { Seat, tableSeatPositions } from '@/app/components/Seat';

interface TeamMembersProps {
  teamId: string;
  initialMembers: ITeamMember[];
  // Att ha `children` som en funktion fick appen att krascha! "[browser] Uncaught Error: Functions are not valid as a child of Client Components."
  // Om jag förstår rätt blir det någon typ av serialization bug: funktioner kan inte serialiseras över server/client-gränsen i Next.js App Router
  // Vanlig ReactNode `children` nu istället för funktion
  children: React.ReactNode;
}

export default function TeamMembers({ teamId, initialMembers, children }: TeamMembersProps) {
  const [members, setMembers] = useState<ITeamMember[]>(initialMembers);

  // Vår subscription via supabase.channel()! Viktigt att denna är i en useEffect med teamId i dess dependency
  // array! Nytt team -> ny subscription. Och om vi navigerar bort körs denna cleanup function körs
  // supabase.removeChannel för att upphäva subscription
  //
  // För att det ska funka även på Vercel (förhoppningsvis!): Vi väntar på att auth-sessionen ska finnas innan subscribe. Hypotesen är att utan detta
  // kopplar Realtime upp sig som 'anon' och RLS-policyn (TO authenticated) blockerar alla events tyst.
  useEffect(() => {
    const supabase = createClient();
    let channel: ReturnType<typeof supabase.channel> | null = null;
    let cancelled = false;

    supabase.auth.getSession().then(({ data: { session } }) => {
      if (cancelled || !session) return;

      channel = supabase
        .channel(`team-${teamId}`) // Godtyckligt namn som vi väljer
        .on(
          'postgres_changes', // Det finns även 'broadcast' och 'presence' men vi vill ha 'postgres_changes': database changes (INSERT, UPDATE, DELETE)
          {
            event: 'INSERT', // Vi prioriterar INSERT över INSERT och DELETE. Just nu har vi inte heller ett sätt att lämna ett team
            schema: 'public',
            table: 'team_members',
            filter: `team_id=eq.${teamId}`,
          },
          // Tredje parametern är callback:en vi vill ska köra när eventet (INSERT) sker
          // Fetch profile data och uppdaterna members.
          async (payload) => {
            const { data: profile } = await supabase
              .from('profiles')
              .select('id, display_name, avatar_url')
              .eq('id', payload.new.user_id)
              .single();

            // Spread operatorn är viktig här för re-rendering, vi skulle inte se den nya team medlemmen annars!
            if (profile) {
              setMembers((prev) => [
                ...prev,
                { profiles: profile, joined_at: payload.new.joined_at },
              ]);
            }
          }
        )
        .subscribe();
    });

    // Cleanup: cancelled-flagga så att vi inte skapar en kanal om effekten
    // redan har städats (React StrictMode kör effekten två gånger i dev)
    return () => {
      cancelled = true;
      if (channel) supabase.removeChannel(channel);
    };
  }, [teamId]);

  // Vi rendrerar inte avatarerna här längre utan använder de nya Seat och tableSeatPositions
  // komponenterna! Med live members-data
  // `children` (case files bilden) placeras efter stolarna i Scene
  return (
    <>
      {tableSeatPositions.map((position, i) => (
        <Seat key={position} profile={members[i]?.profiles} className={position} />
      ))}
      {children}
    </>
  );
}
