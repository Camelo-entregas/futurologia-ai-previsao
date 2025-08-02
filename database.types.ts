export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  __InternalSupabase: {
    PostgrestVersion: "12.2.12 (cd3cf9e)"
  }
  public: {
    Tables: {
      leagues: {
        Row: {
          id: string
          name: string
          country: string | null
          logo_url: string | null
          is_active: boolean
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          name: string
          country?: string | null
          logo_url?: string | null
          is_active?: boolean
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          name?: string
          country?: string | null
          logo_url?: string | null
          is_active?: boolean
          created_at?: string
          updated_at?: string
        }
        Relationships: []
      }
      teams: {
        Row: {
          id: string
          name: string
          short_name: string | null
          league_id: string | null
          logo_url: string | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          name: string
          short_name?: string | null
          league_id?: string | null
          logo_url?: string | null
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          name?: string
          short_name?: string | null
          league_id?: string | null
          logo_url?: string | null
          created_at?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "teams_league_id_fkey"
            columns: ["league_id"]
            isOneToOne: false
            referencedRelation: "leagues"
            referencedColumns: ["id"]
          }
        ]
      }
      profiles: {
        Row: {
          id: string
          user_id: string
          email: string
          full_name: string | null
          avatar_url: string | null
          favorite_team_id: string | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          user_id: string
          email: string
          full_name?: string | null
          avatar_url?: string | null
          favorite_team_id?: string | null
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          user_id?: string
          email?: string
          full_name?: string | null
          avatar_url?: string | null
          favorite_team_id?: string | null
          created_at?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "profiles_favorite_team_id_fkey"
            columns: ["favorite_team_id"]
            isOneToOne: false
            referencedRelation: "teams"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "profiles_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: true
            referencedRelation: "users"
            referencedColumns: ["id"]
          }
        ]
      }
      subscriptions: {
        Row: {
          id: string
          user_id: string
          plan_type: "free" | "premium" | "pro"
          status: "active" | "inactive" | "cancelled"
          stripe_customer_id: string | null
          stripe_subscription_id: string | null
          current_period_start: string | null
          current_period_end: string | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          user_id: string
          plan_type: "free" | "premium" | "pro"
          status: "active" | "inactive" | "cancelled"
          stripe_customer_id?: string | null
          stripe_subscription_id?: string | null
          current_period_start?: string | null
          current_period_end?: string | null
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          user_id?: string
          plan_type?: "free" | "premium" | "pro"
          status?: "active" | "inactive" | "cancelled"
          stripe_customer_id?: string | null
          stripe_subscription_id?: string | null
          current_period_start?: string | null
          current_period_end?: string | null
          created_at?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "subscriptions_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: true
            referencedRelation: "users"
            referencedColumns: ["id"]
          }
        ]
      }
      matches: {
        Row: {
          id: string
          league_id: string
          home_team_id: string
          away_team_id: string
          match_date: string
          status: "scheduled" | "in_play" | "finished" | "postponed" | "canceled"
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          league_id: string
          home_team_id: string
          away_team_id: string
          match_date: string
          status?: "scheduled" | "in_play" | "finished" | "postponed" | "canceled"
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          league_id?: string
          home_team_id?: string
          away_team_id?: string
          match_date?: string
          status?: "scheduled" | "in_play" | "finished" | "postponed" | "canceled"
          created_at?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "matches_away_team_id_fkey"
            columns: ["away_team_id"]
            isOneToOne: false
            referencedRelation: "teams"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "matches_home_team_id_fkey"
            columns: ["home_team_id"]
            isOneToOne: false
            referencedRelation: "teams"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "matches_league_id_fkey"
            columns: ["league_id"]
            isOneToOne: false
            referencedRelation: "leagues"
            referencedColumns: ["id"]
          }
        ]
      }
      match_analytics: {
        Row: {
          id: string
          match_id: string
          home_win_probability: number | null
          draw_probability: number | null
          away_win_probability: number | null
          home_goals: number | null
          away_goals: number | null
          home_corners: number | null
          away_corners: number | null
          home_yellow_cards: number | null
          away_yellow_cards: number | null
          home_red_cards: number | null
          away_red_cards: number | null
          home_possession: number | null
          away_possession: number | null
          home_shots_on_target: number | null
          away_shots_on_target: number | null
          home_shots_off_target: number | null
          away_shots_off_target: number | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          match_id: string
          home_win_probability?: number | null
          draw_probability?: number | null
          away_win_probability?: number | null
          home_goals?: number | null
          away_goals?: number | null
          home_corners?: number | null
          away_corners?: number | null
          home_yellow_cards?: number | null
          away_yellow_cards?: number | null
          home_red_cards?: number | null
          away_red_cards?: number | null
          home_possession?: number | null
          away_possession?: number | null
          home_shots_on_target?: number | null
          away_shots_on_target?: number | null
          home_shots_off_target?: number | null
          away_shots_off_target?: number | null
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          match_id?: string
          home_win_probability?: number | null
          draw_probability?: number | null
          away_win_probability?: number | null
          home_goals?: number | null
          away_goals?: number | null
          home_corners?: number | null
          away_corners?: number | null
          home_yellow_cards?: number | null
          away_yellow_cards?: number | null
          home_red_cards?: number | null
          away_red_cards?: number | null
          home_possession?: number | null
          away_possession?: number | null
          home_shots_on_target?: number | null
          away_shots_on_target?: number | null
          home_shots_off_target?: number | null
          away_shots_off_target?: number | null
          created_at?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "match_analytics_match_id_fkey"
            columns: ["match_id"]
            isOneToOne: false
            referencedRelation: "matches"
            referencedColumns: ["id"]
          }
        ]
      }
      ai_recommendations: {
        Row: {
          id: string
          match_id: string | null
          recommendation_type: "1x2" | "over_under" | "both_teams_to_score" | "handicap" | "correct_score"
          confidence_score: number
          description: string | null
          reasoning: string | null
          is_correct: boolean | null
          created_at: string
        }
        Insert: {
          id?: string
          match_id?: string | null
          recommendation_type: "1x2" | "over_under" | "both_teams_to_score" | "handicap" | "correct_score"
          confidence_score: number
          description?: string | null
          reasoning?: string | null
          is_correct?: boolean | null
          created_at?: string
        }
        Update: {
          id?: string
          match_id?: string | null
          recommendation_type?: "1x2" | "over_under" | "both_teams_to_score" | "handicap" | "correct_score"
          confidence_score?: number
          description?: string | null
          reasoning?: string | null
          is_correct?: boolean | null
          created_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "ai_recommendations_match_id_fkey"
            columns: ["match_id"]
            isOneToOne: false
            referencedRelation: "matches"
            referencedColumns: ["id"]
          }
        ]
      }
      user_favorites: {
        Row: {
          id: string
          user_id: string
          team_id: string | null
          league_id: string | null
          created_at: string
        }
        Insert: {
          id?: string
          user_id: string
          team_id?: string | null
          league_id?: string | null
          created_at?: string
        }
        Update: {
          id?: string
          user_id?: string
          team_id?: string | null
          league_id?: string | null
          created_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "user_favorites_league_id_fkey"
            columns: ["league_id"]
            isOneToOne: false
            referencedRelation: "leagues"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "user_favorites_team_id_fkey"
            columns: ["team_id"]
            isOneToOne: false
            referencedRelation: "teams"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "user_favorites_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          }
        ]
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      calculate_match_probabilities: {
        Args: {
          p_home_team_id: string
          p_away_team_id: string
        }
        Returns: {
          home_win_prob: number
          draw_prob: number
          away_win_prob: number
        }[]
      }
      handle_new_user: {
        Args: Record<PropertyKey, never>
        Returns: undefined
      }
      update_updated_at_column: {
        Args: Record<PropertyKey, never>
        Returns: undefined
      }
    }
    Enums: {
      [_ in never]: never
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}

type DatabaseWithoutInternals = Omit<Database, "__InternalSupabase">

type DefaultSchema = DatabaseWithoutInternals[Extract<keyof Database, "public">]

export type Tables<
  DefaultSchemaTableNameOrOptions extends
    | keyof (DefaultSchema["Tables"] & DefaultSchema["Views"])
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
        DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
      DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])[TableName] extends {
      Row: infer R
    }
    ? R
    : never
  : DefaultSchemaTableNameOrOptions extends keyof (DefaultSchema["Tables"] &
        DefaultSchema["Views"])
    ? (DefaultSchema["Tables"] &
        DefaultSchema["Views"])[DefaultSchemaTableNameOrOptions] extends {
        Row: infer R
      }
      ? R
      : never
    : never

export type TablesInsert<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Insert: infer I
    }
    ? I
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Insert: infer I
      }
      ? I
      : never
    : never

export type TablesUpdate<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Update: infer U
    }
    ? U
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Update: infer U
      }
      ? U
      : never
    : never

export type Enums<
  DefaultSchemaEnumNameOrOptions extends
    | keyof DefaultSchema["Enums"]
    | { schema: keyof DatabaseWithoutInternals },
  EnumName extends DefaultSchemaEnumNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"]
    : never = never,
> = DefaultSchemaEnumNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : DefaultSchemaEnumNameOrOptions extends keyof DefaultSchema["Enums"]
    ? DefaultSchema["Enums"][DefaultSchemaEnumNameOrOptions]
    : never

export type CompositeTypes<
  PublicCompositeTypeNameOrOptions extends
    | keyof DefaultSchema["CompositeTypes"]
    | { schema: keyof DatabaseWithoutInternals },
  CompositeTypeName extends PublicCompositeTypeNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never = never,
> = PublicCompositeTypeNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof DefaultSchema["CompositeTypes"]
    ? DefaultSchema["CompositeTypes"][PublicCompositeTypeNameOrOptions]
    : never

export const Constants = {
  public: {
    Enums: {},
  },
} as const