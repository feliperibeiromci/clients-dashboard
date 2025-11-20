// Tipos para tabelas do Supabase
// Estes tipos devem ser atualizados conforme o schema do banco de dados

export interface Database {
  public: {
    Tables: {
      clients: {
        Row: {
          id: string
          name: string
          email: string | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          name: string
          email?: string | null
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          name?: string
          email?: string | null
          created_at?: string
          updated_at?: string
        }
      }
      platforms: {
        Row: {
          id: string
          client_id: string
          type: 'swoogo' | 'wordpress' | 'drupal'
          name: string
          url: string
          status: 'active' | 'inactive' | 'error'
          last_sync: string | null
          metadata: Record<string, unknown> | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          client_id: string
          type: 'swoogo' | 'wordpress' | 'drupal'
          name: string
          url: string
          status?: 'active' | 'inactive' | 'error'
          last_sync?: string | null
          metadata?: Record<string, unknown> | null
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          client_id?: string
          type?: 'swoogo' | 'wordpress' | 'drupal'
          name?: string
          url?: string
          status?: 'active' | 'inactive' | 'error'
          last_sync?: string | null
          metadata?: Record<string, unknown> | null
          created_at?: string
          updated_at?: string
        }
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      [_ in never]: never
    }
    Enums: {
      platform_type: 'swoogo' | 'wordpress' | 'drupal'
      platform_status: 'active' | 'inactive' | 'error'
    }
  }
}

