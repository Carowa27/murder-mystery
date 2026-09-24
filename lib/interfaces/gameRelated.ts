export interface IGameCharacter {
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
}
