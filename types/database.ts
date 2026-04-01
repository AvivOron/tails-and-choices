export type Json = string | number | boolean | null | { [key: string]: Json } | Json[];

export type Database = {
  public: {
    Tables: {
      stories: {
        Row: {
          id: string;
          user_id: string;
          hero_name: string;
          hero_gender: 'male' | 'female';
          companion_names: string[] | null;
          setting: string | null;
          rolling_summary: string | null;
          is_active: boolean;
          created_at: string;
        };
        Insert: {
          id?: string;
          user_id: string;
          hero_name: string;
          hero_gender: 'male' | 'female';
          companion_names?: string[] | null;
          setting?: string | null;
          rolling_summary?: string | null;
          is_active?: boolean;
          created_at?: string;
        };
        Update: {
          id?: string;
          user_id?: string;
          hero_name?: string;
          hero_gender?: 'male' | 'female';
          companion_names?: string[] | null;
          setting?: string | null;
          rolling_summary?: string | null;
          is_active?: boolean;
          created_at?: string;
        };
        Relationships: [];
      };
      chapters: {
        Row: {
          id: string;
          story_id: string;
          chapter_number: number;
          content: string;
          choice_made: string | null;
          option_a: string | null;
          option_b: string | null;
          image_url: string | null;
          created_at: string;
        };
        Insert: {
          id?: string;
          story_id: string;
          chapter_number: number;
          content: string;
          choice_made?: string | null;
          option_a?: string | null;
          option_b?: string | null;
          image_url?: string | null;
          created_at?: string;
        };
        Update: {
          id?: string;
          story_id?: string;
          chapter_number?: number;
          content?: string;
          choice_made?: string | null;
          option_a?: string | null;
          option_b?: string | null;
          image_url?: string | null;
          created_at?: string;
        };
        Relationships: [];
      };
    };
    Views: Record<string, never>;
    Functions: Record<string, never>;
    Enums: Record<string, never>;
    CompositeTypes: Record<string, never>;
  };
};

export type Story = Database['public']['Tables']['stories']['Row'];
export type Chapter = Database['public']['Tables']['chapters']['Row'];
