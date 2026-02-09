// Database types generated from Supabase schema
export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type UserRole = 'admin' | 'client'
export type CardStatus = 'in_stock' | 'assigned' | 'disabled'
export type OrderStatus = 'pending' | 'paid' | 'shipped' | 'completed' | 'cancelled'
export type TemplateId = 'classic' | 'card' | 'split'

export interface Database {
  public: {
    Tables: {
      profiles: {
        Row: {
          id: string
          role: UserRole
          full_name: string | null
          username: string | null
          bio: string | null
          avatar_url: string | null
          template_id: TemplateId
          theme_json: Json
          is_active: boolean
          contact_email: string | null
          contact_phone: string | null
          location: string | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id: string
          role?: UserRole
          full_name?: string | null
          username?: string | null
          bio?: string | null
          avatar_url?: string | null
          template_id?: TemplateId
          theme_json?: Json
          is_active?: boolean
          contact_email?: string | null
          contact_phone?: string | null
          location?: string | null
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          role?: UserRole
          full_name?: string | null
          username?: string | null
          bio?: string | null
          avatar_url?: string | null
          template_id?: TemplateId
          theme_json?: Json
          is_active?: boolean
          contact_email?: string | null
          contact_phone?: string | null
          location?: string | null
          created_at?: string
          updated_at?: string
        }
      }
      links: {
        Row: {
          id: string
          user_id: string
          title: string
          url: string
          icon: string | null
          sort_order: number
          is_active: boolean
          clicks_count: number
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          user_id: string
          title: string
          url: string
          icon?: string | null
          sort_order?: number
          is_active?: boolean
          clicks_count?: number
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          user_id?: string
          title?: string
          url?: string
          icon?: string | null
          sort_order?: number
          is_active?: boolean
          clicks_count?: number
          created_at?: string
          updated_at?: string
        }
      }
      cards: {
        Row: {
          id: string
          card_uid: string
          status: CardStatus
          assigned_to: string | null
          activated_at: string | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          card_uid: string
          status?: CardStatus
          assigned_to?: string | null
          activated_at?: string | null
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          card_uid?: string
          status?: CardStatus
          assigned_to?: string | null
          activated_at?: string | null
          created_at?: string
          updated_at?: string
        }
      }
      card_activations: {
        Row: {
          id: string
          card_id: string
          user_id: string | null
          activation_code: string
          is_used: boolean
          used_at: string | null
          created_at: string
        }
        Insert: {
          id?: string
          card_id: string
          user_id?: string | null
          activation_code: string
          is_used?: boolean
          used_at?: string | null
          created_at?: string
        }
        Update: {
          id?: string
          card_id?: string
          user_id?: string | null
          activation_code?: string
          is_used?: boolean
          used_at?: string | null
          created_at?: string
        }
      }
      products: {
        Row: {
          id: string
          name: string
          description: string | null
          price: number
          images: string[] | null
          is_active: boolean
          stock_count: number
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          name: string
          description?: string | null
          price: number
          images?: string[] | null
          is_active?: boolean
          stock_count?: number
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          name?: string
          description?: string | null
          price?: number
          images?: string[] | null
          is_active?: boolean
          stock_count?: number
          created_at?: string
          updated_at?: string
        }
      }
      orders: {
        Row: {
          id: string
          user_id: string
          product_id: string
          quantity: number
          status: OrderStatus
          amount: number
          payment_method: string | null
          shipping_address: string | null
          tracking_number: string | null
          notes: string | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          user_id: string
          product_id: string
          quantity?: number
          status?: OrderStatus
          amount: number
          payment_method?: string | null
          shipping_address?: string | null
          tracking_number?: string | null
          notes?: string | null
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          user_id?: string
          product_id?: string
          quantity?: number
          status?: OrderStatus
          amount?: number
          payment_method?: string | null
          shipping_address?: string | null
          tracking_number?: string | null
          notes?: string | null
          created_at?: string
          updated_at?: string
        }
      }
      templates: {
        Row: {
          id: string
          name: string
          description: string | null
          preview_image_url: string | null
          is_active: boolean
          created_at: string
        }
        Insert: {
          id: string
          name: string
          description?: string | null
          preview_image_url?: string | null
          is_active?: boolean
          created_at?: string
        }
        Update: {
          id?: string
          name?: string
          description?: string | null
          preview_image_url?: string | null
          is_active?: boolean
          created_at?: string
        }
      }
      page_views: {
        Row: {
          id: string
          user_id: string
          card_id: string | null
          viewed_at: string
          referrer: string | null
          country: string | null
          user_agent: string | null
        }
        Insert: {
          id?: string
          user_id: string
          card_id?: string | null
          viewed_at?: string
          referrer?: string | null
          country?: string | null
          user_agent?: string | null
        }
        Update: {
          id?: string
          user_id?: string
          card_id?: string | null
          viewed_at?: string
          referrer?: string | null
          country?: string | null
          user_agent?: string | null
        }
      }
      link_clicks: {
        Row: {
          id: string
          link_id: string
          user_id: string
          clicked_at: string
          referrer: string | null
        }
        Insert: {
          id?: string
          link_id: string
          user_id: string
          clicked_at?: string
          referrer?: string | null
        }
        Update: {
          id?: string
          link_id?: string
          user_id?: string
          clicked_at?: string
          referrer?: string | null
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
      [_ in never]: never
    }
  }
}
