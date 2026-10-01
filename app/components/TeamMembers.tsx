'use client';

import { useEffect, useState } from 'react';
import { createClient } from '@/lib/supabase/client';
import type { ITeamMember } from '@/lib/interfaces/gameRelated';

interface TeamMembersProps {
  teamId: string;
  initialMembers: ITeamMember[];
  children: (members: ITeamMember[]) => React.ReactNode; // Istället för att låta den speciella `children` prop:en hanteras automatiskt tar vi manuell kontroll över det! Klickade när den integreras i dess förälder
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

  // `children` funktionen in action. Skicka tillbaka live members arrayen; team sidan väljer hur det renderas
  return <>{children(members)}</>;
}
