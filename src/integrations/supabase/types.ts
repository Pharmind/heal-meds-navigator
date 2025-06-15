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
          image_url: string | null
          mv_code: string
          name: string
          observation: string
          updated_at: string
        }
        Insert: {
          created_at?: string
          id?: string
          image_url?: string | null
          mv_code: string
          name: string
          observation: string
          updated_at?: string
        }
        Update: {
          created_at?: string
          id?: string
          image_url?: string | null
          mv_code?: string
          name?: string
          observation?: string
          updated_at?: string
        }
        Relationships: []
      }
      drug_interactions: {
        Row: {
          bibliography: string | null
          clinical_effect: string
          created_at: string
          drug1_name: string
          drug2_name: string
          id: string
          interaction_type: string
          management: string
          mechanism: string
          severity_level: string
          updated_at: string
        }
        Insert: {
          bibliography?: string | null
          clinical_effect: string
          created_at?: string
          drug1_name: string
          drug2_name: string
          id?: string
          interaction_type: string
          management: string
          mechanism: string
          severity_level: string
          updated_at?: string
        }
        Update: {
          bibliography?: string | null
          clinical_effect?: string
          created_at?: string
          drug1_name?: string
          drug2_name?: string
          id?: string
          interaction_type?: string
          management?: string
          mechanism?: string
          severity_level?: string
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
      interaction_checks: {
        Row: {
          check_date: string
          created_at: string
          id: string
          interactions_found: Json | null
          medications: Json
          notes: string | null
          patient_age: string | null
          patient_name: string | null
          pharmacist_name: string | null
        }
        Insert: {
          check_date?: string
          created_at?: string
          id?: string
          interactions_found?: Json | null
          medications: Json
          notes?: string | null
          patient_age?: string | null
          patient_name?: string | null
          pharmacist_name?: string | null
        }
        Update: {
          check_date?: string
          created_at?: string
          id?: string
          interactions_found?: Json | null
          medications?: Json
          notes?: string | null
          patient_age?: string | null
          patient_name?: string | null
          pharmacist_name?: string | null
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
      multiprofessional_rounds: {
        Row: {
          adequate_administration_route: boolean | null
          adequate_administration_route_obs: string | null
          adequate_glycemic_control: boolean | null
          adequate_glycemic_control_obs: string | null
          adequate_sedation_level: boolean | null
          adequate_sedation_level_obs: string | null
          adequate_spectrum: boolean | null
          antibiotic_action: string | null
          antibiotic_therapy: boolean | null
          antibiotic_therapy_obs: string | null
          correct_dosage: boolean | null
          created_at: string
          discharge_criteria_met: boolean | null
          discharge_estimate: boolean | null
          discharge_pending_issues: string | null
          diuresis: string | null
          diuresis_obs: string | null
          drug_allergy: boolean | null
          drug_allergy_obs: string | null
          dvas_usage: boolean | null
          dvas_usage_obs: string | null
          evacuation: string | null
          evacuation_obs: string | null
          hepatic_function: string | null
          hepatic_function_obs: string | null
          id: string
          indication_compliance: boolean | null
          lamg_prophylaxis: boolean | null
          lamg_prophylaxis_obs: string | null
          medicine_actions: string | null
          next_evaluation: string | null
          nursing_actions: string | null
          nutrition_actions: string | null
          patient_id: string | null
          pharmacy_actions: string | null
          physiotherapy_actions: string | null
          present_professionals: string | null
          pulmonary_function: string | null
          pulmonary_function_obs: string | null
          renal_function: string | null
          renal_function_obs: string | null
          round_date: string
          round_type: string
          sedation_analgesia: boolean | null
          sedation_analgesia_obs: string | null
          sedation_can_be_reduced: boolean | null
          sedation_can_be_reduced_obs: string | null
          severe_drug_interaction: boolean | null
          severe_drug_interaction_obs: string | null
          tev_prophylaxis: boolean | null
          tev_prophylaxis_obs: string | null
          treatment_time_defined: boolean | null
          updated_at: string
          updated_lab_data: boolean | null
          updated_lab_data_obs: string | null
          user_id: string
        }
        Insert: {
          adequate_administration_route?: boolean | null
          adequate_administration_route_obs?: string | null
          adequate_glycemic_control?: boolean | null
          adequate_glycemic_control_obs?: string | null
          adequate_sedation_level?: boolean | null
          adequate_sedation_level_obs?: string | null
          adequate_spectrum?: boolean | null
          antibiotic_action?: string | null
          antibiotic_therapy?: boolean | null
          antibiotic_therapy_obs?: string | null
          correct_dosage?: boolean | null
          created_at?: string
          discharge_criteria_met?: boolean | null
          discharge_estimate?: boolean | null
          discharge_pending_issues?: string | null
          diuresis?: string | null
          diuresis_obs?: string | null
          drug_allergy?: boolean | null
          drug_allergy_obs?: string | null
          dvas_usage?: boolean | null
          dvas_usage_obs?: string | null
          evacuation?: string | null
          evacuation_obs?: string | null
          hepatic_function?: string | null
          hepatic_function_obs?: string | null
          id?: string
          indication_compliance?: boolean | null
          lamg_prophylaxis?: boolean | null
          lamg_prophylaxis_obs?: string | null
          medicine_actions?: string | null
          next_evaluation?: string | null
          nursing_actions?: string | null
          nutrition_actions?: string | null
          patient_id?: string | null
          pharmacy_actions?: string | null
          physiotherapy_actions?: string | null
          present_professionals?: string | null
          pulmonary_function?: string | null
          pulmonary_function_obs?: string | null
          renal_function?: string | null
          renal_function_obs?: string | null
          round_date?: string
          round_type: string
          sedation_analgesia?: boolean | null
          sedation_analgesia_obs?: string | null
          sedation_can_be_reduced?: boolean | null
          sedation_can_be_reduced_obs?: string | null
          severe_drug_interaction?: boolean | null
          severe_drug_interaction_obs?: string | null
          tev_prophylaxis?: boolean | null
          tev_prophylaxis_obs?: string | null
          treatment_time_defined?: boolean | null
          updated_at?: string
          updated_lab_data?: boolean | null
          updated_lab_data_obs?: string | null
          user_id: string
        }
        Update: {
          adequate_administration_route?: boolean | null
          adequate_administration_route_obs?: string | null
          adequate_glycemic_control?: boolean | null
          adequate_glycemic_control_obs?: string | null
          adequate_sedation_level?: boolean | null
          adequate_sedation_level_obs?: string | null
          adequate_spectrum?: boolean | null
          antibiotic_action?: string | null
          antibiotic_therapy?: boolean | null
          antibiotic_therapy_obs?: string | null
          correct_dosage?: boolean | null
          created_at?: string
          discharge_criteria_met?: boolean | null
          discharge_estimate?: boolean | null
          discharge_pending_issues?: string | null
          diuresis?: string | null
          diuresis_obs?: string | null
          drug_allergy?: boolean | null
          drug_allergy_obs?: string | null
          dvas_usage?: boolean | null
          dvas_usage_obs?: string | null
          evacuation?: string | null
          evacuation_obs?: string | null
          hepatic_function?: string | null
          hepatic_function_obs?: string | null
          id?: string
          indication_compliance?: boolean | null
          lamg_prophylaxis?: boolean | null
          lamg_prophylaxis_obs?: string | null
          medicine_actions?: string | null
          next_evaluation?: string | null
          nursing_actions?: string | null
          nutrition_actions?: string | null
          patient_id?: string | null
          pharmacy_actions?: string | null
          physiotherapy_actions?: string | null
          present_professionals?: string | null
          pulmonary_function?: string | null
          pulmonary_function_obs?: string | null
          renal_function?: string | null
          renal_function_obs?: string | null
          round_date?: string
          round_type?: string
          sedation_analgesia?: boolean | null
          sedation_analgesia_obs?: string | null
          sedation_can_be_reduced?: boolean | null
          sedation_can_be_reduced_obs?: string | null
          severe_drug_interaction?: boolean | null
          severe_drug_interaction_obs?: string | null
          tev_prophylaxis?: boolean | null
          tev_prophylaxis_obs?: string | null
          treatment_time_defined?: boolean | null
          updated_at?: string
          updated_lab_data?: boolean | null
          updated_lab_data_obs?: string | null
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "multiprofessional_rounds_patient_id_fkey"
            columns: ["patient_id"]
            isOneToOne: false
            referencedRelation: "round_patients"
            referencedColumns: ["id"]
          },
        ]
      }
      pathologies: {
        Row: {
          basic_info: string
          created_at: string
          curiosity: string
          description: string
          icon_name: string
          id: string
          name: string
          therapeutic: string
          updated_at: string
        }
        Insert: {
          basic_info: string
          created_at?: string
          curiosity: string
          description: string
          icon_name?: string
          id?: string
          name: string
          therapeutic: string
          updated_at?: string
        }
        Update: {
          basic_info?: string
          created_at?: string
          curiosity?: string
          description?: string
          icon_name?: string
          id?: string
          name?: string
          therapeutic?: string
          updated_at?: string
        }
        Relationships: []
      }
      profiles: {
        Row: {
          created_at: string
          email: string | null
          full_name: string | null
          id: string
          is_active: boolean
          role: Database["public"]["Enums"]["user_role"]
          updated_at: string
          user_type: Database["public"]["Enums"]["user_type"]
        }
        Insert: {
          created_at?: string
          email?: string | null
          full_name?: string | null
          id: string
          is_active?: boolean
          role?: Database["public"]["Enums"]["user_role"]
          updated_at?: string
          user_type?: Database["public"]["Enums"]["user_type"]
        }
        Update: {
          created_at?: string
          email?: string | null
          full_name?: string | null
          id?: string
          is_active?: boolean
          role?: Database["public"]["Enums"]["user_role"]
          updated_at?: string
          user_type?: Database["public"]["Enums"]["user_type"]
        }
        Relationships: []
      }
      round_active_problems: {
        Row: {
          created_at: string
          expected_result: string | null
          id: string
          observations: string | null
          problem_description: string
          problem_order: number
          round_id: string | null
          status: string | null
          updated_at: string
        }
        Insert: {
          created_at?: string
          expected_result?: string | null
          id?: string
          observations?: string | null
          problem_description: string
          problem_order?: number
          round_id?: string | null
          status?: string | null
          updated_at?: string
        }
        Update: {
          created_at?: string
          expected_result?: string | null
          id?: string
          observations?: string | null
          problem_description?: string
          problem_order?: number
          round_id?: string | null
          status?: string | null
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "round_active_problems_round_id_fkey"
            columns: ["round_id"]
            isOneToOne: false
            referencedRelation: "multiprofessional_rounds"
            referencedColumns: ["id"]
          },
        ]
      }
      round_patients: {
        Row: {
          bed: string
          birth_date: string | null
          created_at: string
          hospitalization_days: number | null
          id: string
          mother_name: string | null
          patient_name: string
          sector: string
          updated_at: string
          user_id: string
        }
        Insert: {
          bed: string
          birth_date?: string | null
          created_at?: string
          hospitalization_days?: number | null
          id?: string
          mother_name?: string | null
          patient_name: string
          sector: string
          updated_at?: string
          user_id: string
        }
        Update: {
          bed?: string
          birth_date?: string | null
          created_at?: string
          hospitalization_days?: number | null
          id?: string
          mother_name?: string | null
          patient_name?: string
          sector?: string
          updated_at?: string
          user_id?: string
        }
        Relationships: []
      }
      sequential_therapy_medications: {
        Row: {
          created_at: string
          id: string
          iv_dosage: string
          iv_posology: string
          medication_name: string
          oral_dosage: string
          oral_posology: string
          updated_at: string
        }
        Insert: {
          created_at?: string
          id?: string
          iv_dosage: string
          iv_posology: string
          medication_name: string
          oral_dosage: string
          oral_posology: string
          updated_at?: string
        }
        Update: {
          created_at?: string
          id?: string
          iv_dosage?: string
          iv_posology?: string
          medication_name?: string
          oral_dosage?: string
          oral_posology?: string
          updated_at?: string
        }
        Relationships: []
      }
      treatment_estimations: {
        Row: {
          active_patients: number
          active_patients_old: number
          alert_level: string
          antimicrobial_name: string
          created_at: string
          current_stock: number
          daily_total_consumption: number
          daily_total_consumption_old: number
          days_remaining: number
          dose_per_patient: number
          dose_per_patient_old: number
          estimated_days: number
          estimation_date: string
          hospital_unit: string
          id: string
          stock_coverage_days: number
          stock_unit: string
          updated_at: string
        }
        Insert: {
          active_patients?: number
          active_patients_old: number
          alert_level?: string
          antimicrobial_name: string
          created_at?: string
          current_stock: number
          daily_total_consumption?: number
          daily_total_consumption_old: number
          days_remaining?: number
          dose_per_patient?: number
          dose_per_patient_old: number
          estimated_days?: number
          estimation_date: string
          hospital_unit: string
          id?: string
          stock_coverage_days: number
          stock_unit?: string
          updated_at?: string
        }
        Update: {
          active_patients?: number
          active_patients_old?: number
          alert_level?: string
          antimicrobial_name?: string
          created_at?: string
          current_stock?: number
          daily_total_consumption?: number
          daily_total_consumption_old?: number
          days_remaining?: number
          dose_per_patient?: number
          dose_per_patient_old?: number
          estimated_days?: number
          estimation_date?: string
          hospital_unit?: string
          id?: string
          stock_coverage_days?: number
          stock_unit?: string
          updated_at?: string
        }
        Relationships: []
      }
      user_module_permissions: {
        Row: {
          created_at: string
          granted_at: string | null
          granted_by: string | null
          has_access: boolean
          id: string
          module_name: Database["public"]["Enums"]["module_name"]
          updated_at: string
          user_id: string
        }
        Insert: {
          created_at?: string
          granted_at?: string | null
          granted_by?: string | null
          has_access?: boolean
          id?: string
          module_name: Database["public"]["Enums"]["module_name"]
          updated_at?: string
          user_id: string
        }
        Update: {
          created_at?: string
          granted_at?: string | null
          granted_by?: string | null
          has_access?: boolean
          id?: string
          module_name?: Database["public"]["Enums"]["module_name"]
          updated_at?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "user_module_permissions_granted_by_fkey"
            columns: ["granted_by"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "user_module_permissions_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
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
      is_farmaceutico: {
        Args: { user_id: string }
        Returns: boolean
      }
    }
    Enums: {
      item_type: "medication" | "material" | "diet"
      module_name:
        | "search"
        | "medications"
        | "materials"
        | "diets"
        | "intoxication"
        | "high-alert"
        | "elderly"
        | "sequential-therapy"
        | "pharmacovigilance"
        | "cft"
        | "protocols"
        | "pictogram"
        | "discharge-guidelines"
        | "drug-interactions"
        | "treatment-estimation"
      user_role: "admin" | "user"
      user_type: "farmaceutico" | "usuario"
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
      module_name: [
        "search",
        "medications",
        "materials",
        "diets",
        "intoxication",
        "high-alert",
        "elderly",
        "sequential-therapy",
        "pharmacovigilance",
        "cft",
        "protocols",
        "pictogram",
        "discharge-guidelines",
        "drug-interactions",
        "treatment-estimation",
      ],
      user_role: ["admin", "user"],
      user_type: ["farmaceutico", "usuario"],
    },
  },
} as const
