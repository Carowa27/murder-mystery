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
export interface ICaseObject {
  created_at: string;
  description: string | null;
  difficulty_id: number;
  id: string;
  image_url: string | null;
  location: string | null;
  price: number;
  stage: 'dev' | 'active' | 'inactive';
  story_date: string | null;
  title: string;
  difficulties: {
    id: number;
    max_accusations: number;
    name: string;
  };
  characters: {
    case_id: string;
    created_at: string;
    description: string | null;
    first_name: string;
    id: string;
    image_url: string | null;
    is_guilty: boolean;
    is_victim: boolean;
    last_name: string | null;
    relationship: string | null;
  }[];
  case_clues: {
    case_id: string;
    clue_type_id: number;
    content: string | null;
    created_at: string;
    id: string;
    image_url: string | null;
    is_key: boolean;
    title: string;
    clue_types: {
      id: number;
      name: string;
    };
    clue_requirements: {
      required_clue_id: string;
    }[];
    clue_characters: {
      character_id: string;
    }[];
  }[];
}
