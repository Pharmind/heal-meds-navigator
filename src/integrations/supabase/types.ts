export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  public: {
    Tables: {
      diets: {
        Row: {
          created_at: string
          id: string
          mv_code: string
          name: string
          observation: string
          updated_at: string
        }
        Insert: {
          created_at?: string
          id?: string
          mv_code: string
          name: string
          observation: string
          updated_at?: string
        }
        Update: {
          created_at?: string
          id?: string
          mv_code?: string
          name?: string
          observation?: string
          updated_at?: string
        }
        Relationships: []
      }
      high_alert_medications: {
        Row: {
          active_ingredient: string
          created_at: string
          id: string
          type: string
          updated_at: string
        }
        Insert: {
          active_ingredient: string
          created_at?: string
          id?: string
          type: string
          updated_at?: string
        }
        Update: {
          active_ingredient?: string
          created_at?: string
          id?: string
          type?: string
          updated_at?: string
        }
        Relationships: []
      }
      intoxications: {
        Row: {
          antidote: string
          antidote_dosage: string
          bibliography: string
          created_at: string
          id: string
          intoxication_agent: string
          preparation_administration: string
          updated_at: string
        }
        Insert: {
          antidote: string
          antidote_dosage: string
          bibliography: string
          created_at?: string
          id?: string
          intoxication_agent: string
          preparation_administration: string
          updated_at?: string
        }
        Update: {
          antidote?: string
          antidote_dosage?: string
          bibliography?: string
          created_at?: string
          id?: string
          intoxication_agent?: string
          preparation_administration?: string
          updated_at?: string
        }
        Relationships: []
      }
      materials: {
        Row: {
          created_at: string
          id: string
          mv_code: string
          name: string
          observation: string
          updated_at: string
        }
        Insert: {
          created_at?: string
          id?: string
          mv_code: string
          name: string
          observation: string
          updated_at?: string
        }
        Update: {
          created_at?: string
          id?: string
          mv_code?: string
          name?: string
          observation?: string
          updated_at?: string
        }
        Relationships: []
      }
      medications: {
        Row: {
          administration_route: string
          created_at: string
          dose_adjustment: string
          dose_adult: string
          dose_maximum: string
          dose_pediatric: string
          id: string
          indication: string
          mv_code: string
          name: string
          observation: string
          photosensitive: boolean
          preparation_dilution: string
          preparation_heal_standard: string
          preparation_reconstitution: string
          presentation: string
          stability: string
          therapeutic_class: string
          updated_at: string
        }
        Insert: {
          administration_route: string
          created_at?: string
          dose_adjustment: string
          dose_adult: string
          dose_maximum: string
          dose_pediatric: string
          id?: string
          indication: string
          mv_code: string
          name: string
          observation: string
          photosensitive?: boolean
          preparation_dilution: string
          preparation_heal_standard: string
          preparation_reconstitution: string
          presentation: string
          stability: string
          therapeutic_class: string
          updated_at?: string
        }
        Update: {
          administration_route?: string
          created_at?: string
          dose_adjustment?: string
          dose_adult?: string
          dose_maximum?: string
          dose_pediatric?: string
          id?: string
          indication?: string
          mv_code?: string
          name?: string
          observation?: string
          photosensitive?: boolean
          preparation_dilution?: string
          preparation_heal_standard?: string
          preparation_reconstitution?: string
          presentation?: string
          stability?: string
          therapeutic_class?: string
          updated_at?: string
        }
        Relationships: []
      }
      profiles: {
        Row: {
          created_at: string
          email: string | null
          id: string
          role: Database["public"]["Enums"]["user_role"]
          updated_at: string
        }
        Insert: {
          created_at?: string
          email?: string | null
          id: string
          role?: Database["public"]["Enums"]["user_role"]
          updated_at?: string
        }
        Update: {
          created_at?: string
          email?: string | null
          id?: string
          role?: Database["public"]["Enums"]["user_role"]
          updated_at?: string
        }
        Relationships: []
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      is_admin: {
        Args: { user_id: string }
        Returns: boolean
      }
    }
    Enums: {
      item_type: "medication" | "material" | "diet"
      user_role: "admin" | "user"
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}

type DefaultSchema = Database[Extract<keyof Database, "public">]

export type Tables<
  DefaultSchemaTableNameOrOptions extends
    | keyof (DefaultSchema["Tables"] & DefaultSchema["Views"])
    | { schema: keyof Database },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof (Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
        Database[DefaultSchemaTableNameOrOptions["schema"]]["Views"])
    : never = never,
> = DefaultSchemaTableNameOrOptions extends { schema: keyof Database }
  ? (Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
      Database[DefaultSchemaTableNameOrOptions["schema"]]["Views"])[TableName] extends {
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
    | { schema: keyof Database },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends { schema: keyof Database }
  ? Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
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
    | { schema: keyof Database },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends { schema: keyof Database }
  ? Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
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
    | { schema: keyof Database },
  EnumName extends DefaultSchemaEnumNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"]
    : never = never,
> = DefaultSchemaEnumNameOrOptions extends { schema: keyof Database }
  ? Database[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : DefaultSchemaEnumNameOrOptions extends keyof DefaultSchema["Enums"]
    ? DefaultSchema["Enums"][DefaultSchemaEnumNameOrOptions]
    : never

export type CompositeTypes<
  PublicCompositeTypeNameOrOptions extends
    | keyof DefaultSchema["CompositeTypes"]
    | { schema: keyof Database },
  CompositeTypeName extends PublicCompositeTypeNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never = never,
> = PublicCompositeTypeNameOrOptions extends { schema: keyof Database }
  ? Database[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof DefaultSchema["CompositeTypes"]
    ? DefaultSchema["CompositeTypes"][PublicCompositeTypeNameOrOptions]
    : never

export const Constants = {
  public: {
    Enums: {
      item_type: ["medication", "material", "diet"],
      user_role: ["admin", "user"],
    },
  },
} as const
