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
