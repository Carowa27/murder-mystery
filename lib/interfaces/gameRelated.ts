export interface IGameCharacter {
  id: string;
  first_name: string;
  last_name: string;
  relationship: string;
  description: string;
  image_url: string | null;
  is_victim: boolean;
}
export interface INotes {
  clue_id: string | null;
  content: string;
  created_at: string;
  id: string;
  investigation_id: string;
  user_id: string;
  profiles: {
    avatar_url: string | null;
    display_name: string;
    id: string;
  } | null;
  case_clues: {
    case_id: string;
    clue_type_id: number;
    content: string;
    created_at: string;
    id: string;
    image_url: string | null;
    is_key: boolean;
    title: string;
  };
}
export interface IFoundClues {
  case_clues: {
    case_id: string;
    clue_type_id: number;
    clue_types: {
      id: number;
      name: string;
    };
    content: string;
    created_at: string;
    id: string;
    image_url: string | null;
    is_key: boolean;
    title: string;
  };
  found_at: string;
}
export interface ITeamSession {
  id: string;
  team_id: string;
  case_id: string;
  cases: ICase;
  status: string;
  started_at: string;
  ended_at: string | null;
  teams: ITeam;
}

export interface ITeam {
  id: string;
  name: string;
  owner_id: string;
  created_at: string;
  invite_code: string;
  max_members: number;
  team_members: ITeamMember[];
}

export interface ITeamMember {
  profiles: IProfile;
  joined_at: string;
}

export interface IProfile {
  id: string;
  avatar_url: string | null;
  display_name: string;
}
export interface ICase {
  created_at: string;
  description: string;
  difficulty_id: number;
  id: string;
  image_url: string;
  location: string;
  price: number;
  stage: 'active' | 'inactive';
  story_date: string;
  title: string;
}
