import { Database } from '@/lib/database.types';

export type IInvestigationDetails = Database['public']['Tables']['investigations']['Row'] & {
  cases: Database['public']['Tables']['cases']['Row'];

  investigation_found_clues: {
    found_at: string;
    case_clues: {
      id: string;
      title: string;
      content: string;
      clue_types: {
        id: number;
        name: string;
      };
    };
  }[];

  notes: {
    clue_id: string | null;
    content: string;
    created_at: string;
    id: string;
    investigation_id: string;
    user_id: string | null;
    profiles: {
      display_name: string;
    };
  }[];

  teams: {
    id: string;
    name: string;
    team_members: {
      joined_at: string;
      profiles: {
        id: string;
        display_name: string;
        avatar_url: string | null;
      };
    }[];
    invite_code: string;
    owner_id: string;
  };
};
