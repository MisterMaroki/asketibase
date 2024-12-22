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
      admins: {
        Row: {
          auth_id: string
          created_at: string | null
          email: string
          id: string
        }
        Insert: {
          auth_id: string
          created_at?: string | null
          email: string
          id?: string
        }
        Update: {
          auth_id?: string
          created_at?: string | null
          email?: string
          id?: string
        }
        Relationships: []
      }
      age_factors: {
        Row: {
          created_at: string | null
          daily_rate: number
          id: string
          max_age: number
          min_age: number
          updated_at: string | null
        }
        Insert: {
          created_at?: string | null
          daily_rate: number
          id?: string
          max_age: number
          min_age: number
          updated_at?: string | null
        }
        Update: {
          created_at?: string | null
          daily_rate?: number
          id?: string
          max_age?: number
          min_age?: number
          updated_at?: string | null
        }
        Relationships: []
      }
      applications: {
        Row: {
          coverage_type: string
          created_at: string | null
          currency: string
          duration_type: string
          end_date: string | null
          id: string
          membership_type: string
          referral_code: string | null
          referral_source: string | null
          start_date: string
          status: string
          updated_at: string | null
          user_id: string | null
        }
        Insert: {
          coverage_type: string
          created_at?: string | null
          currency: string
          duration_type: string
          end_date?: string | null
          id?: string
          membership_type: string
          referral_code?: string | null
          referral_source?: string | null
          start_date: string
          status?: string
          updated_at?: string | null
          user_id?: string | null
        }
        Update: {
          coverage_type?: string
          created_at?: string | null
          currency?: string
          duration_type?: string
          end_date?: string | null
          id?: string
          membership_type?: string
          referral_code?: string | null
          referral_source?: string | null
          start_date?: string
          status?: string
          updated_at?: string | null
          user_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "applications_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
        ]
      }
      country_base_prices: {
        Row: {
          base_price: number
          country: string
          country_code: string | null
          created_at: string | null
          id: string
          nationality: string | null
          updated_at: string | null
        }
        Insert: {
          base_price: number
          country: string
          country_code?: string | null
          created_at?: string | null
          id?: string
          nationality?: string | null
          updated_at?: string | null
        }
        Update: {
          base_price?: number
          country?: string
          country_code?: string | null
          created_at?: string | null
          id?: string
          nationality?: string | null
          updated_at?: string | null
        }
        Relationships: []
      }
      coverage_factors: {
        Row: {
          coverage_type: string
          created_at: string | null
          daily_rate: number
          id: string
          includes_high_risk: boolean
          updated_at: string | null
        }
        Insert: {
          coverage_type: string
          created_at?: string | null
          daily_rate: number
          id?: string
          includes_high_risk?: boolean
          updated_at?: string | null
        }
        Update: {
          coverage_type?: string
          created_at?: string | null
          daily_rate?: number
          id?: string
          includes_high_risk?: boolean
          updated_at?: string | null
        }
        Relationships: []
      }
      customers: {
        Row: {
          id: string
          stripe_customer_id: string | null
        }
        Insert: {
          id: string
          stripe_customer_id?: string | null
        }
        Update: {
          id?: string
          stripe_customer_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "customers_id_fkey"
            columns: ["id"]
            isOneToOne: true
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
        ]
      }
      logs: {
        Row: {
          details: Json | null
          error: string | null
          id: string
          level: string
          operation: string
          timestamp: string
        }
        Insert: {
          details?: Json | null
          error?: string | null
          id?: string
          level: string
          operation: string
          timestamp?: string
        }
        Update: {
          details?: Json | null
          error?: string | null
          id?: string
          level?: string
          operation?: string
          timestamp?: string
        }
        Relationships: []
      }
      medical_declarations: {
        Row: {
          created_at: string | null
          has_conditions: boolean
          id: string
          member_id: string
          risk_level: number | null
          updated_at: string | null
        }
        Insert: {
          created_at?: string | null
          has_conditions: boolean
          id?: string
          member_id: string
          risk_level?: number | null
          updated_at?: string | null
        }
        Update: {
          created_at?: string | null
          has_conditions?: boolean
          id?: string
          member_id?: string
          risk_level?: number | null
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "medical_declarations_member_id_fkey"
            columns: ["member_id"]
            isOneToOne: false
            referencedRelation: "members"
            referencedColumns: ["id"]
          },
        ]
      }
      medical_risk_factors: {
        Row: {
          created_at: string | null
          daily_rate: number
          description: string
          id: string
          risk_level: number
          updated_at: string | null
        }
        Insert: {
          created_at?: string | null
          daily_rate: number
          description: string
          id?: string
          risk_level: number
          updated_at?: string | null
        }
        Update: {
          created_at?: string | null
          daily_rate?: number
          description?: string
          id?: string
          risk_level?: number
          updated_at?: string | null
        }
        Relationships: []
      }
      members: {
        Row: {
          address: string
          application_id: string
          contact_number: string
          country_code: string
          country_of_residence: string
          created_at: string | null
          date_of_birth: string
          email: string
          first_name: string
          gender: string
          id: string
          is_primary: boolean
          last_name: string
          nationality: string
          salutation: string
          updated_at: string | null
        }
        Insert: {
          address: string
          application_id: string
          contact_number: string
          country_code: string
          country_of_residence: string
          created_at?: string | null
          date_of_birth: string
          email: string
          first_name: string
          gender: string
          id?: string
          is_primary?: boolean
          last_name: string
          nationality: string
          salutation: string
          updated_at?: string | null
        }
        Update: {
          address?: string
          application_id?: string
          contact_number?: string
          country_code?: string
          country_of_residence?: string
          created_at?: string | null
          date_of_birth?: string
          email?: string
          first_name?: string
          gender?: string
          id?: string
          is_primary?: boolean
          last_name?: string
          nationality?: string
          salutation?: string
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "members_application_id_fkey"
            columns: ["application_id"]
            isOneToOne: false
            referencedRelation: "applications"
            referencedColumns: ["id"]
          },
        ]
      }
      prices: {
        Row: {
          active: boolean | null
          currency: string | null
          description: string | null
          id: string
          metadata: Json | null
          product_id: string | null
          unit_amount: number | null
        }
        Insert: {
          active?: boolean | null
          currency?: string | null
          description?: string | null
          id: string
          metadata?: Json | null
          product_id?: string | null
          unit_amount?: number | null
        }
        Update: {
          active?: boolean | null
          currency?: string | null
          description?: string | null
          id?: string
          metadata?: Json | null
          product_id?: string | null
          unit_amount?: number | null
        }
        Relationships: [
          {
            foreignKeyName: "prices_product_id_fkey"
            columns: ["product_id"]
            isOneToOne: false
            referencedRelation: "products"
            referencedColumns: ["id"]
          },
        ]
      }
      products: {
        Row: {
          active: boolean | null
          description: string | null
          id: string
          image: string | null
          metadata: Json | null
          name: string | null
        }
        Insert: {
          active?: boolean | null
          description?: string | null
          id: string
          image?: string | null
          metadata?: Json | null
          name?: string | null
        }
        Update: {
          active?: boolean | null
          description?: string | null
          id?: string
          image?: string | null
          metadata?: Json | null
          name?: string | null
        }
        Relationships: []
      }
      quotes: {
        Row: {
          application_id: string
          base_price: number
          coverage_loading_price: number
          created_at: string
          currency: string
          discount_amount: number
          id: string
          medical_loading_price: number
          member_prices: Json
          total_price: number
        }
        Insert: {
          application_id: string
          base_price: number
          coverage_loading_price: number
          created_at?: string
          currency: string
          discount_amount?: number
          id?: string
          medical_loading_price: number
          member_prices: Json
          total_price: number
        }
        Update: {
          application_id?: string
          base_price?: number
          coverage_loading_price?: number
          created_at?: string
          currency?: string
          discount_amount?: number
          id?: string
          medical_loading_price?: number
          member_prices?: Json
          total_price?: number
        }
        Relationships: [
          {
            foreignKeyName: "quotes_application_id_fkey"
            columns: ["application_id"]
            isOneToOne: false
            referencedRelation: "applications"
            referencedColumns: ["id"]
          },
        ]
      }
      users: {
        Row: {
          auth_id: string | null
          created_at: string | null
          email: string
          first_name: string | null
          id: string
          last_name: string | null
        }
        Insert: {
          auth_id?: string | null
          created_at?: string | null
          email: string
          first_name?: string | null
          id?: string
          last_name?: string | null
        }
        Update: {
          auth_id?: string | null
          created_at?: string | null
          email?: string
          first_name?: string | null
          id?: string
          last_name?: string | null
        }
        Relationships: []
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      [_ in never]: never
    }
    Enums: {
      [_ in never]: never
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}

type PublicSchema = Database[Extract<keyof Database, "public">]

export type Tables<
  PublicTableNameOrOptions extends
    | keyof (PublicSchema["Tables"] & PublicSchema["Views"])
    | { schema: keyof Database },
  TableName extends PublicTableNameOrOptions extends { schema: keyof Database }
    ? keyof (Database[PublicTableNameOrOptions["schema"]]["Tables"] &
        Database[PublicTableNameOrOptions["schema"]]["Views"])
    : never = never,
> = PublicTableNameOrOptions extends { schema: keyof Database }
  ? (Database[PublicTableNameOrOptions["schema"]]["Tables"] &
      Database[PublicTableNameOrOptions["schema"]]["Views"])[TableName] extends {
      Row: infer R
    }
    ? R
    : never
  : PublicTableNameOrOptions extends keyof (PublicSchema["Tables"] &
        PublicSchema["Views"])
    ? (PublicSchema["Tables"] &
        PublicSchema["Views"])[PublicTableNameOrOptions] extends {
        Row: infer R
      }
      ? R
      : never
    : never

export type TablesInsert<
  PublicTableNameOrOptions extends
    | keyof PublicSchema["Tables"]
    | { schema: keyof Database },
  TableName extends PublicTableNameOrOptions extends { schema: keyof Database }
    ? keyof Database[PublicTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = PublicTableNameOrOptions extends { schema: keyof Database }
  ? Database[PublicTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Insert: infer I
    }
    ? I
    : never
  : PublicTableNameOrOptions extends keyof PublicSchema["Tables"]
    ? PublicSchema["Tables"][PublicTableNameOrOptions] extends {
        Insert: infer I
      }
      ? I
      : never
    : never

export type TablesUpdate<
  PublicTableNameOrOptions extends
    | keyof PublicSchema["Tables"]
    | { schema: keyof Database },
  TableName extends PublicTableNameOrOptions extends { schema: keyof Database }
    ? keyof Database[PublicTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = PublicTableNameOrOptions extends { schema: keyof Database }
  ? Database[PublicTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Update: infer U
    }
    ? U
    : never
  : PublicTableNameOrOptions extends keyof PublicSchema["Tables"]
    ? PublicSchema["Tables"][PublicTableNameOrOptions] extends {
        Update: infer U
      }
      ? U
      : never
    : never

export type Enums<
  PublicEnumNameOrOptions extends
    | keyof PublicSchema["Enums"]
    | { schema: keyof Database },
  EnumName extends PublicEnumNameOrOptions extends { schema: keyof Database }
    ? keyof Database[PublicEnumNameOrOptions["schema"]]["Enums"]
    : never = never,
> = PublicEnumNameOrOptions extends { schema: keyof Database }
  ? Database[PublicEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : PublicEnumNameOrOptions extends keyof PublicSchema["Enums"]
    ? PublicSchema["Enums"][PublicEnumNameOrOptions]
    : never

export type CompositeTypes<
  PublicCompositeTypeNameOrOptions extends
    | keyof PublicSchema["CompositeTypes"]
    | { schema: keyof Database },
  CompositeTypeName extends PublicCompositeTypeNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never = never,
> = PublicCompositeTypeNameOrOptions extends { schema: keyof Database }
  ? Database[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof PublicSchema["CompositeTypes"]
    ? PublicSchema["CompositeTypes"][PublicCompositeTypeNameOrOptions]
    : never
