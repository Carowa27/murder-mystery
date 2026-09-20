export type Json = string | number | boolean | null | { [key: string]: Json | undefined } | Json[];

export type Database = {
  // Allows to automatically instantiate createClient with right options
  // instead of createClient<Database, { PostgrestVersion: 'XX' }>(URL, KEY)
  __InternalSupabase: {
    PostgrestVersion: '14.5';
  };
  public: {
    Tables: {
      accusations: {
        Row: {
          character_id: string;
          created_at: string;
          id: string;
          investigation_id: string;
          user_id: string | null;
        };
        Insert: {
          character_id: string;
          created_at?: string;
          id?: string;
          investigation_id: string;
          user_id?: string | null;
        };
        Update: {
          character_id?: string;
          created_at?: string;
          id?: string;
          investigation_id?: string;
          user_id?: string | null;
        };
        Relationships: [
          {
            foreignKeyName: 'accusations_character_id_fkey';
            columns: ['character_id'];
            isOneToOne: false;
            referencedRelation: 'characters';
            referencedColumns: ['id'];
          },
          {
            foreignKeyName: 'accusations_investigation_id_fkey';
            columns: ['investigation_id'];
            isOneToOne: false;
            referencedRelation: 'investigations';
            referencedColumns: ['id'];
          },
          {
            foreignKeyName: 'accusations_user_id_fkey';
            columns: ['user_id'];
            isOneToOne: false;
            referencedRelation: 'profiles';
            referencedColumns: ['id'];
          },
        ];
      };
      case_clues: {
        Row: {
          case_id: string;
          clue_type_id: number;
          content: string | null;
          created_at: string;
          id: string;
          image_url: string | null;
          is_key: boolean;
          title: string;
        };
        Insert: {
          case_id: string;
          clue_type_id: number;
          content?: string | null;
          created_at?: string;
          id?: string;
          image_url?: string | null;
          is_key?: boolean;
          title: string;
        };
        Update: {
          case_id?: string;
          clue_type_id?: number;
          content?: string | null;
          created_at?: string;
          id?: string;
          image_url?: string | null;
          is_key?: boolean;
          title?: string;
        };
        Relationships: [
          {
            foreignKeyName: 'case_clues_case_id_fkey';
            columns: ['case_id'];
            isOneToOne: false;
            referencedRelation: 'cases';
            referencedColumns: ['id'];
          },
          {
            foreignKeyName: 'case_clues_clue_type_id_fkey';
            columns: ['clue_type_id'];
            isOneToOne: false;
            referencedRelation: 'clue_types';
            referencedColumns: ['id'];
          },
        ];
      };
      cases: {
        Row: {
          created_at: string;
          description: string | null;
          difficulty_id: number;
          id: string;
          image_url: string | null;
          is_free: boolean;
          location: string | null;
          price: number;
          stage: string;
          story_date: string | null;
          title: string;
        };
        Insert: {
          created_at?: string;
          description?: string | null;
          difficulty_id: number;
          id?: string;
          image_url?: string | null;
          is_free?: boolean;
          location?: string | null;
          price?: number;
          stage?: string;
          story_date?: string | null;
          title: string;
        };
        Update: {
          created_at?: string;
          description?: string | null;
          difficulty_id?: number;
          id?: string;
          image_url?: string | null;
          is_free?: boolean;
          location?: string | null;
          price?: number;
          stage?: string;
          story_date?: string | null;
          title?: string;
        };
        Relationships: [
          {
            foreignKeyName: 'cases_difficulty_id_fkey';
            columns: ['difficulty_id'];
            isOneToOne: false;
            referencedRelation: 'difficulties';
            referencedColumns: ['id'];
          },
        ];
      };
      characters: {
        Row: {
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
        };
        Insert: {
          case_id: string;
          created_at?: string;
          description?: string | null;
          first_name: string;
          id?: string;
          image_url?: string | null;
          is_guilty?: boolean;
          is_victim?: boolean;
          last_name?: string | null;
          relationship?: string | null;
        };
        Update: {
          case_id?: string;
          created_at?: string;
          description?: string | null;
          first_name?: string;
          id?: string;
          image_url?: string | null;
          is_guilty?: boolean;
          is_victim?: boolean;
          last_name?: string | null;
          relationship?: string | null;
        };
        Relationships: [
          {
            foreignKeyName: 'characters_case_id_fkey';
            columns: ['case_id'];
            isOneToOne: false;
            referencedRelation: 'cases';
            referencedColumns: ['id'];
          },
        ];
      };
      clue_characters: {
        Row: {
          character_id: string;
          clue_id: string;
        };
        Insert: {
          character_id: string;
          clue_id: string;
        };
        Update: {
          character_id?: string;
          clue_id?: string;
        };
        Relationships: [
          {
            foreignKeyName: 'clue_characters_character_id_fkey';
            columns: ['character_id'];
            isOneToOne: false;
            referencedRelation: 'characters';
            referencedColumns: ['id'];
          },
          {
            foreignKeyName: 'clue_characters_clue_id_fkey';
            columns: ['clue_id'];
            isOneToOne: false;
            referencedRelation: 'case_clues';
            referencedColumns: ['id'];
          },
        ];
      };
      clue_requirements: {
        Row: {
          clue_id: string;
          required_clue_id: string;
        };
        Insert: {
          clue_id: string;
          required_clue_id: string;
        };
        Update: {
          clue_id?: string;
          required_clue_id?: string;
        };
        Relationships: [
          {
            foreignKeyName: 'clue_requirements_clue_id_fkey';
            columns: ['clue_id'];
            isOneToOne: false;
            referencedRelation: 'case_clues';
            referencedColumns: ['id'];
          },
          {
            foreignKeyName: 'clue_requirements_required_clue_id_fkey';
            columns: ['required_clue_id'];
            isOneToOne: false;
            referencedRelation: 'case_clues';
            referencedColumns: ['id'];
          },
        ];
      };
      clue_types: {
        Row: {
          id: number;
          name: string;
        };
        Insert: {
          id?: never;
          name: string;
        };
        Update: {
          id?: never;
          name?: string;
        };
        Relationships: [];
      };
      difficulties: {
        Row: {
          id: number;
          max_accusations: number;
          name: string;
        };
        Insert: {
          id?: never;
          max_accusations: number;
          name: string;
        };
        Update: {
          id?: never;
          max_accusations?: number;
          name?: string;
        };
        Relationships: [];
      };
      investigation_found_clues: {
        Row: {
          clue_id: string;
          found_at: string;
          found_by: string | null;
          investigation_id: string;
        };
        Insert: {
          clue_id: string;
          found_at?: string;
          found_by?: string | null;
          investigation_id: string;
        };
        Update: {
          clue_id?: string;
          found_at?: string;
          found_by?: string | null;
          investigation_id?: string;
        };
        Relationships: [
          {
            foreignKeyName: 'investigation_found_clues_clue_id_fkey';
            columns: ['clue_id'];
            isOneToOne: false;
            referencedRelation: 'case_clues';
            referencedColumns: ['id'];
          },
          {
            foreignKeyName: 'investigation_found_clues_found_by_fkey';
            columns: ['found_by'];
            isOneToOne: false;
            referencedRelation: 'profiles';
            referencedColumns: ['id'];
          },
          {
            foreignKeyName: 'investigation_found_clues_investigation_id_fkey';
            columns: ['investigation_id'];
            isOneToOne: false;
            referencedRelation: 'investigations';
            referencedColumns: ['id'];
          },
        ];
      };
      investigations: {
        Row: {
          case_id: string;
          ended_at: string | null;
          id: string;
          started_at: string;
          status: string;
          team_id: string;
        };
        Insert: {
          case_id: string;
          ended_at?: string | null;
          id?: string;
          started_at?: string;
          status?: string;
          team_id: string;
        };
        Update: {
          case_id?: string;
          ended_at?: string | null;
          id?: string;
          started_at?: string;
          status?: string;
          team_id?: string;
        };
        Relationships: [
          {
            foreignKeyName: 'investigations_case_id_fkey';
            columns: ['case_id'];
            isOneToOne: false;
            referencedRelation: 'cases';
            referencedColumns: ['id'];
          },
          {
            foreignKeyName: 'investigations_team_id_fkey';
            columns: ['team_id'];
            isOneToOne: false;
            referencedRelation: 'teams';
            referencedColumns: ['id'];
          },
        ];
      };
      notes: {
        Row: {
          clue_id: string | null;
          content: string;
          created_at: string;
          id: string;
          investigation_id: string;
          user_id: string | null;
        };
        Insert: {
          clue_id?: string | null;
          content: string;
          created_at?: string;
          id?: string;
          investigation_id: string;
          user_id?: string | null;
        };
        Update: {
          clue_id?: string | null;
          content?: string;
          created_at?: string;
          id?: string;
          investigation_id?: string;
          user_id?: string | null;
        };
        Relationships: [
          {
            foreignKeyName: 'notes_clue_id_fkey';
            columns: ['clue_id'];
            isOneToOne: false;
            referencedRelation: 'case_clues';
            referencedColumns: ['id'];
          },
          {
            foreignKeyName: 'notes_investigation_id_fkey';
            columns: ['investigation_id'];
            isOneToOne: false;
            referencedRelation: 'investigations';
            referencedColumns: ['id'];
          },
          {
            foreignKeyName: 'notes_user_id_fkey';
            columns: ['user_id'];
            isOneToOne: false;
            referencedRelation: 'profiles';
            referencedColumns: ['id'];
          },
        ];
      };
      payments: {
        Row: {
          amount: number;
          case_id: string | null;
          created_at: string;
          id: string;
          product: string;
          status: string;
          user_id: string;
        };
        Insert: {
          amount: number;
          case_id?: string | null;
          created_at?: string;
          id?: string;
          product: string;
          status?: string;
          user_id: string;
        };
        Update: {
          amount?: number;
          case_id?: string | null;
          created_at?: string;
          id?: string;
          product?: string;
          status?: string;
          user_id?: string;
        };
        Relationships: [
          {
            foreignKeyName: 'payments_case_id_fkey';
            columns: ['case_id'];
            isOneToOne: false;
            referencedRelation: 'cases';
            referencedColumns: ['id'];
          },
          {
            foreignKeyName: 'payments_user_id_fkey';
            columns: ['user_id'];
            isOneToOne: false;
            referencedRelation: 'profiles';
            referencedColumns: ['id'];
          },
        ];
      };
      profiles: {
        Row: {
          avatar_url: string | null;
          created_at: string;
          display_name: string;
          id: string;
          role: string;
          unlimited_until: string | null;
        };
        Insert: {
          avatar_url?: string | null;
          created_at?: string;
          display_name: string;
          id: string;
          role?: string;
          unlimited_until?: string | null;
        };
        Update: {
          avatar_url?: string | null;
          created_at?: string;
          display_name?: string;
          id?: string;
          role?: string;
          unlimited_until?: string | null;
        };
        Relationships: [];
      };
      purchases: {
        Row: {
          case_id: string;
          created_at: string;
          payment_id: string;
          user_id: string;
        };
        Insert: {
          case_id: string;
          created_at?: string;
          payment_id: string;
          user_id: string;
        };
        Update: {
          case_id?: string;
          created_at?: string;
          payment_id?: string;
          user_id?: string;
        };
        Relationships: [
          {
            foreignKeyName: 'purchases_case_id_fkey';
            columns: ['case_id'];
            isOneToOne: false;
            referencedRelation: 'cases';
            referencedColumns: ['id'];
          },
          {
            foreignKeyName: 'purchases_payment_id_fkey';
            columns: ['payment_id'];
            isOneToOne: true;
            referencedRelation: 'payments';
            referencedColumns: ['id'];
          },
          {
            foreignKeyName: 'purchases_user_id_fkey';
            columns: ['user_id'];
            isOneToOne: false;
            referencedRelation: 'profiles';
            referencedColumns: ['id'];
          },
        ];
      };
      receipts: {
        Row: {
          created_at: string;
          id: string;
          payment_id: string;
          receipt_number: string;
        };
        Insert: {
          created_at?: string;
          id?: string;
          payment_id: string;
          receipt_number: string;
        };
        Update: {
          created_at?: string;
          id?: string;
          payment_id?: string;
          receipt_number?: string;
        };
        Relationships: [
          {
            foreignKeyName: 'receipts_payment_id_fkey';
            columns: ['payment_id'];
            isOneToOne: true;
            referencedRelation: 'payments';
            referencedColumns: ['id'];
          },
        ];
      };
      team_members: {
        Row: {
          joined_at: string;
          team_id: string;
          user_id: string;
        };
        Insert: {
          joined_at?: string;
          team_id: string;
          user_id: string;
        };
        Update: {
          joined_at?: string;
          team_id?: string;
          user_id?: string;
        };
        Relationships: [
          {
            foreignKeyName: 'team_members_team_id_fkey';
            columns: ['team_id'];
            isOneToOne: false;
            referencedRelation: 'teams';
            referencedColumns: ['id'];
          },
          {
            foreignKeyName: 'team_members_user_id_fkey';
            columns: ['user_id'];
            isOneToOne: false;
            referencedRelation: 'profiles';
            referencedColumns: ['id'];
          },
        ];
      };
      teams: {
        Row: {
          created_at: string;
          id: string;
          invite_code: string;
          max_members: number;
          name: string;
          owner_id: string;
        };
        Insert: {
          created_at?: string;
          id?: string;
          invite_code: string;
          max_members?: number;
          name: string;
          owner_id: string;
        };
        Update: {
          created_at?: string;
          id?: string;
          invite_code?: string;
          max_members?: number;
          name?: string;
          owner_id?: string;
        };
        Relationships: [
          {
            foreignKeyName: 'teams_owner_id_fkey';
            columns: ['owner_id'];
            isOneToOne: false;
            referencedRelation: 'profiles';
            referencedColumns: ['id'];
          },
        ];
      };
    };
    Views: {
      [_ in never]: never;
    };
    Functions: {
      can_access_investigation: {
        Args: { p_investigation_id: string };
        Returns: boolean;
      };
      has_case_access: { Args: { p_case_id: string }; Returns: boolean };
      is_admin: { Args: never; Returns: boolean };
      is_team_member: { Args: { p_team_id: string }; Returns: boolean };
      owns_case: {
        Args: { p_case_id: string; p_user_id: string };
        Returns: boolean;
      };
      shares_team: { Args: { p_user_id: string }; Returns: boolean };
      subscription_tier: {
        Args: { p: Database['public']['Tables']['profiles']['Row'] };
        Returns: string;
      };
      team_owner_owns_case: {
        Args: { p_case_id: string; p_team_id: string };
        Returns: boolean;
      };
    };
    Enums: {
      [_ in never]: never;
    };
    CompositeTypes: {
      [_ in never]: never;
    };
  };
};

type DatabaseWithoutInternals = Omit<Database, '__InternalSupabase'>;

type DefaultSchema = DatabaseWithoutInternals[Extract<keyof Database, 'public'>];

export type Tables<
  DefaultSchemaTableNameOrOptions extends
    | keyof (DefaultSchema['Tables'] & DefaultSchema['Views'])
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends (DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals;
  }
    ? keyof (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions['schema']]['Tables'] &
        DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions['schema']]['Views'])
    : never) = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals;
}
  ? (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions['schema']]['Tables'] &
      DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions['schema']]['Views'])[TableName] extends {
      Row: infer R;
    }
    ? R
    : never
  : DefaultSchemaTableNameOrOptions extends keyof (DefaultSchema['Tables'] & DefaultSchema['Views'])
    ? (DefaultSchema['Tables'] & DefaultSchema['Views'])[DefaultSchemaTableNameOrOptions] extends {
        Row: infer R;
      }
      ? R
      : never
    : never;

export type TablesInsert<
  DefaultSchemaTableNameOrOptions extends
    keyof DefaultSchema['Tables'] | { schema: keyof DatabaseWithoutInternals },
  TableName extends (DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals;
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions['schema']]['Tables']
    : never) = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals;
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions['schema']]['Tables'][TableName] extends {
      Insert: infer I;
    }
    ? I
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema['Tables']
    ? DefaultSchema['Tables'][DefaultSchemaTableNameOrOptions] extends {
        Insert: infer I;
      }
      ? I
      : never
    : never;

export type TablesUpdate<
  DefaultSchemaTableNameOrOptions extends
    keyof DefaultSchema['Tables'] | { schema: keyof DatabaseWithoutInternals },
  TableName extends (DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals;
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions['schema']]['Tables']
    : never) = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals;
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions['schema']]['Tables'][TableName] extends {
      Update: infer U;
    }
    ? U
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema['Tables']
    ? DefaultSchema['Tables'][DefaultSchemaTableNameOrOptions] extends {
        Update: infer U;
      }
      ? U
      : never
    : never;

export type Enums<
  DefaultSchemaEnumNameOrOptions extends
    keyof DefaultSchema['Enums'] | { schema: keyof DatabaseWithoutInternals },
  EnumName extends (DefaultSchemaEnumNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals;
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions['schema']]['Enums']
    : never) = never,
> = DefaultSchemaEnumNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals;
}
  ? DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions['schema']]['Enums'][EnumName]
  : DefaultSchemaEnumNameOrOptions extends keyof DefaultSchema['Enums']
    ? DefaultSchema['Enums'][DefaultSchemaEnumNameOrOptions]
    : never;

export type CompositeTypes<
  PublicCompositeTypeNameOrOptions extends
    keyof DefaultSchema['CompositeTypes'] | { schema: keyof DatabaseWithoutInternals },
  CompositeTypeName extends (PublicCompositeTypeNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals;
  }
    ? keyof DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions['schema']]['CompositeTypes']
    : never) = never,
> = PublicCompositeTypeNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals;
}
  ? DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions['schema']]['CompositeTypes'][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof DefaultSchema['CompositeTypes']
    ? DefaultSchema['CompositeTypes'][PublicCompositeTypeNameOrOptions]
    : never;

export const Constants = {
  public: {
    Enums: {},
  },
} as const;
