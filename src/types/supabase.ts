export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  // Allows to automatically instantiate createClient with right options
  // instead of createClient<Database, { PostgrestVersion: 'XX' }>(URL, KEY)
  __InternalSupabase: {
    PostgrestVersion: "12.2.3 (519615d)"
  }
  public: {
    Tables: {
      categories: {
        Row: {
          created_at: string | null
          description: string | null
          id: string
          name: string
        }
        Insert: {
          created_at?: string | null
          description?: string | null
          id?: string
          name: string
        }
        Update: {
          created_at?: string | null
          description?: string | null
          id?: string
          name?: string
        }
        Relationships: []
      }
      contracted_solutions: {
        Row: {
          category_id: string
          contract_date: string | null
          created_at: string | null
          customer_id: string
          description_solution: string | null
          id: string
          is_active: boolean | null
          updated_at: string | null
        }
        Insert: {
          category_id: string
          contract_date?: string | null
          created_at?: string | null
          customer_id: string
          description_solution?: string | null
          id?: string
          is_active?: boolean | null
          updated_at?: string | null
        }
        Update: {
          category_id?: string
          contract_date?: string | null
          created_at?: string | null
          customer_id?: string
          description_solution?: string | null
          id?: string
          is_active?: boolean | null
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "fk_contracted_solutions_category"
            columns: ["category_id"]
            isOneToOne: false
            referencedRelation: "categories"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "fk_contracted_solutions_customers"
            columns: ["customer_id"]
            isOneToOne: false
            referencedRelation: "customers"
            referencedColumns: ["id"]
          },
        ]
      }
      country: {
        Row: {
          code: string
          id: string
          name: string
        }
        Insert: {
          code: string
          id?: string
          name: string
        }
        Update: {
          code?: string
          id?: string
          name?: string
        }
        Relationships: []
      }
      customer_media: {
        Row: {
          created_at: string
          customer_id: string
          filename: string
          id: string
          type: string | null
          updated_at: string
          url_storage: string
        }
        Insert: {
          created_at?: string
          customer_id: string
          filename: string
          id?: string
          type?: string | null
          updated_at?: string
          url_storage: string
        }
        Update: {
          created_at?: string
          customer_id?: string
          filename?: string
          id?: string
          type?: string | null
          updated_at?: string
          url_storage?: string
        }
        Relationships: [
          {
            foreignKeyName: "fk_customer"
            columns: ["customer_id"]
            isOneToOne: false
            referencedRelation: "customers"
            referencedColumns: ["id"]
          },
        ]
      }
      customers: {
        Row: {
          accepted_privacy_policy: boolean
          accepted_terms_conditions: boolean
          company_name: string
          company_url: string | null
          created_at: string | null
          description: string | null
          email: string | null
          id: string
          job_title: string
          privacy_policy_accepted: boolean
          updated_at: string | null
          user_id: string
        }
        Insert: {
          accepted_privacy_policy?: boolean
          accepted_terms_conditions?: boolean
          company_name: string
          company_url?: string | null
          created_at?: string | null
          description?: string | null
          email?: string | null
          id?: string
          job_title: string
          privacy_policy_accepted?: boolean
          updated_at?: string | null
          user_id: string
        }
        Update: {
          accepted_privacy_policy?: boolean
          accepted_terms_conditions?: boolean
          company_name?: string
          company_url?: string | null
          created_at?: string | null
          description?: string | null
          email?: string | null
          id?: string
          job_title?: string
          privacy_policy_accepted?: boolean
          updated_at?: string | null
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "fk_customer_user"
            columns: ["user_id"]
            isOneToOne: true
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
        ]
      }
      expert_documents: {
        Row: {
          created_at: string | null
          expert_id: string | null
          filename: string
          id: string
          url_storage: string | null
        }
        Insert: {
          created_at?: string | null
          expert_id?: string | null
          filename: string
          id?: string
          url_storage?: string | null
        }
        Update: {
          created_at?: string | null
          expert_id?: string | null
          filename?: string
          id?: string
          url_storage?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "fk_expert_documents_expert_id"
            columns: ["expert_id"]
            isOneToOne: false
            referencedRelation: "experts"
            referencedColumns: ["id"]
          },
        ]
      }
      expert_expertise: {
        Row: {
          experience_time: Database["public"]["Enums"]["experience_time"] | null
          expert_id: string
          id: string
          platform_id: string
          rating: number | null
        }
        Insert: {
          experience_time?:
            | Database["public"]["Enums"]["experience_time"]
            | null
          expert_id: string
          id?: string
          platform_id: string
          rating?: number | null
        }
        Update: {
          experience_time?:
            | Database["public"]["Enums"]["experience_time"]
            | null
          expert_id?: string
          id?: string
          platform_id?: string
          rating?: number | null
        }
        Relationships: [
          {
            foreignKeyName: "expert_expertise_platform_id_fkey"
            columns: ["platform_id"]
            isOneToOne: false
            referencedRelation: "platforms"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "fk_expert_expertise_expert"
            columns: ["expert_id"]
            isOneToOne: false
            referencedRelation: "experts"
            referencedColumns: ["id"]
          },
        ]
      }
      expert_media: {
        Row: {
          created_at: string
          expert_id: string
          filename: string
          id: string
          type: string | null
          updated_at: string
          url_storage: string
        }
        Insert: {
          created_at?: string
          expert_id: string
          filename: string
          id?: string
          type?: string | null
          updated_at?: string
          url_storage: string
        }
        Update: {
          created_at?: string
          expert_id?: string
          filename?: string
          id?: string
          type?: string | null
          updated_at?: string
          url_storage?: string
        }
        Relationships: [
          {
            foreignKeyName: "fk_expert"
            columns: ["expert_id"]
            isOneToOne: false
            referencedRelation: "experts"
            referencedColumns: ["id"]
          },
        ]
      }
      experts: {
        Row: {
          anything_share_with_us: string | null
          bio: string | null
          certified: boolean | null
          created_at: string | null
          id: string
          is_currently_working: boolean | null
          profession_id: string
          understand_subject_pp: boolean | null
          updated_at: string | null
          user_id: string
        }
        Insert: {
          anything_share_with_us?: string | null
          bio?: string | null
          certified?: boolean | null
          created_at?: string | null
          id?: string
          is_currently_working?: boolean | null
          profession_id: string
          understand_subject_pp?: boolean | null
          updated_at?: string | null
          user_id: string
        }
        Update: {
          anything_share_with_us?: string | null
          bio?: string | null
          certified?: boolean | null
          created_at?: string | null
          id?: string
          is_currently_working?: boolean | null
          profession_id?: string
          understand_subject_pp?: boolean | null
          updated_at?: string | null
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "experts_profession_id_fkey"
            columns: ["profession_id"]
            isOneToOne: false
            referencedRelation: "it_professions"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "fk_experts_users"
            columns: ["user_id"]
            isOneToOne: true
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
        ]
      }
      it_professions: {
        Row: {
          category: string | null
          created_at: string | null
          description: string | null
          id: string
          profession_name: string
          updated_at: string | null
        }
        Insert: {
          category?: string | null
          created_at?: string | null
          description?: string | null
          id?: string
          profession_name: string
          updated_at?: string | null
        }
        Update: {
          category?: string | null
          created_at?: string | null
          description?: string | null
          id?: string
          profession_name?: string
          updated_at?: string | null
        }
        Relationships: []
      }
      it_projects: {
        Row: {
          budget: number | null
          customer_id: string | null
          description: string | null
          end_date: string | null
          id: string
          project_name: string
          responsible: string | null
          start_date: string | null
          status: string | null
        }
        Insert: {
          budget?: number | null
          customer_id?: string | null
          description?: string | null
          end_date?: string | null
          id?: string
          project_name: string
          responsible?: string | null
          start_date?: string | null
          status?: string | null
        }
        Update: {
          budget?: number | null
          customer_id?: string | null
          description?: string | null
          end_date?: string | null
          id?: string
          project_name?: string
          responsible?: string | null
          start_date?: string | null
          status?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "fk_customer_id"
            columns: ["customer_id"]
            isOneToOne: false
            referencedRelation: "customers"
            referencedColumns: ["id"]
          },
        ]
      }
      platforms: {
        Row: {
          id: string
          name: string
        }
        Insert: {
          id?: string
          name: string
        }
        Update: {
          id?: string
          name?: string
        }
        Relationships: []
      }
      service_request_subcategories: {
        Row: {
          created_at: string | null
          id: string
          service_request_id: string | null
          subcategory_id: string | null
        }
        Insert: {
          created_at?: string | null
          id?: string
          service_request_id?: string | null
          subcategory_id?: string | null
        }
        Update: {
          created_at?: string | null
          id?: string
          service_request_id?: string | null
          subcategory_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "service_request_subcategories_service_request_id_fkey"
            columns: ["service_request_id"]
            isOneToOne: false
            referencedRelation: "service_requests"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "service_request_subcategories_subcategory_id_fkey"
            columns: ["subcategory_id"]
            isOneToOne: false
            referencedRelation: "subcategories"
            referencedColumns: ["id"]
          },
        ]
      }
      service_requests: {
        Row: {
          budget_range: string | null
          certifications_details: string | null
          client_name: string
          company: string | null
          created_at: string | null
          email: string
          id: string
          modality: string | null
          phone: string | null
          project_description: string
          requires_certifications: boolean | null
          seniority_level: string | null
          status: string | null
          updated_at: string | null
        }
        Insert: {
          budget_range?: string | null
          certifications_details?: string | null
          client_name: string
          company?: string | null
          created_at?: string | null
          email: string
          id?: string
          modality?: string | null
          phone?: string | null
          project_description: string
          requires_certifications?: boolean | null
          seniority_level?: string | null
          status?: string | null
          updated_at?: string | null
        }
        Update: {
          budget_range?: string | null
          certifications_details?: string | null
          client_name?: string
          company?: string | null
          created_at?: string | null
          email?: string
          id?: string
          modality?: string | null
          phone?: string | null
          project_description?: string
          requires_certifications?: boolean | null
          seniority_level?: string | null
          status?: string | null
          updated_at?: string | null
        }
        Relationships: []
      }
      skills: {
        Row: {
          created_at: string
          expert_id: string
          id: string
          skill_level: number | null
          skill_name: string
          updated_at: string
        }
        Insert: {
          created_at?: string
          expert_id: string
          id?: string
          skill_level?: number | null
          skill_name: string
          updated_at?: string
        }
        Update: {
          created_at?: string
          expert_id?: string
          id?: string
          skill_level?: number | null
          skill_name?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "skills_expert_id_fkey"
            columns: ["expert_id"]
            isOneToOne: false
            referencedRelation: "experts"
            referencedColumns: ["id"]
          },
        ]
      }
      subcategories: {
        Row: {
          category_id: string | null
          created_at: string | null
          description: string | null
          id: string
          name: string
        }
        Insert: {
          category_id?: string | null
          created_at?: string | null
          description?: string | null
          id?: string
          name: string
        }
        Update: {
          category_id?: string | null
          created_at?: string | null
          description?: string | null
          id?: string
          name?: string
        }
        Relationships: [
          {
            foreignKeyName: "subcategories_category_id_fkey"
            columns: ["category_id"]
            isOneToOne: false
            referencedRelation: "categories"
            referencedColumns: ["id"]
          },
        ]
      }
      tools: {
        Row: {
          created_at: string
          expert_id: string
          id: string
          tool_name: string
          updated_at: string
        }
        Insert: {
          created_at?: string
          expert_id: string
          id?: string
          tool_name: string
          updated_at?: string
        }
        Update: {
          created_at?: string
          expert_id?: string
          id?: string
          tool_name?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "tools_expert_id_fkey"
            columns: ["expert_id"]
            isOneToOne: false
            referencedRelation: "experts"
            referencedColumns: ["id"]
          },
        ]
      }
      user_role: {
        Row: {
          id: string
          name: string
        }
        Insert: {
          id?: string
          name: string
        }
        Update: {
          id?: string
          name?: string
        }
        Relationships: []
      }
      users: {
        Row: {
          country_id: string | null
          created_at: string | null
          email: string | null
          first_name: string | null
          id: string
          last_name: string | null
          linkedin_profile: string | null
          other_link: string | null
          role_id: string | null
        }
        Insert: {
          country_id?: string | null
          created_at?: string | null
          email?: string | null
          first_name?: string | null
          id: string
          last_name?: string | null
          linkedin_profile?: string | null
          other_link?: string | null
          role_id?: string | null
        }
        Update: {
          country_id?: string | null
          created_at?: string | null
          email?: string | null
          first_name?: string | null
          id?: string
          last_name?: string | null
          linkedin_profile?: string | null
          other_link?: string | null
          role_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "users_country_id_fkey"
            columns: ["country_id"]
            isOneToOne: false
            referencedRelation: "country"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "users_role_id_fkey"
            columns: ["role_id"]
            isOneToOne: false
            referencedRelation: "user_role"
            referencedColumns: ["id"]
          },
        ]
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      upsert_user_media: {
        Args: { p_filename: string; p_url_storage: string; p_user_id: string }
        Returns: undefined
      }
    }
    Enums: {
      experience_time:
        | "less than 1 year"
        | "1 to 2 years"
        | "2 to 3 years"
        | "more than 3 years"
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
    Enums: {
      experience_time: [
        "less than 1 year",
        "1 to 2 years",
        "2 to 3 years",
        "more than 3 years",
      ],
    },
  },
} as const
