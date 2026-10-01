'use client';

import { useEffect, useState } from 'react';
import { createClient } from '@/lib/supabase/client';
import type { ITeamMember } from '@/lib/interfaces/gameRelated';

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
  useEffect(() => {
    const supabase = createClient();

    const channel = supabase
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

    // Cleanup
    return () => {
      supabase.removeChannel(channel);
    };
  }, [teamId]);

  // Avatarerna renderas här i komponenten nu istället! `children` (case files sektionen) placeras mellan dem
  // Så istället för att returnera *allt* som `children` blir endast den <section> tag:en `children` i detta fall
  return (
    <div className="flex flex-col justify-between pt-20 px-2 min-h-[calc(100vh-64px-80px)]">
      <section className="flex justify-between pt-8">
        {[0, 1].map((i) => (
          <div
            key={i}
            className="flex justify-center items-center bg-primary/50 rounded-full h-20 w-20 border-4 border-primary"
          >
            {members[i] ? members[i].profiles.display_name.charAt(0).toUpperCase() : ''}
          </div>
        ))}
      </section>

      {children}

      <section className="flex justify-between">
        {[2, 3].map((i) => (
          <div
            key={i}
            className="flex justify-center items-center bg-primary/50 rounded-full h-20 w-20 border-4 border-primary"
          >
            {members[i] ? members[i].profiles.display_name.charAt(0).toUpperCase() : ''}
          </div>
        ))}
      </section>
    </div>
  );
}
