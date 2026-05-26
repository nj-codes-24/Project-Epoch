// supabase/types.ts

export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export interface Database {
  public: {
    Tables: {
      profiles: {
        Row: {
          id: string
          username: string
          display_name: string | null
          avatar_url: string | null
          bio: string | null
          skills: string[] | null
          github_username: string | null
          role: string | null
          created_at: string | null
          updated_at: string | null
        }
        Insert: {
          id: string
          username: string
          display_name?: string | null
          avatar_url?: string | null
          bio?: string | null
          skills?: string[] | null
          github_username?: string | null
          role?: string | null
          created_at?: string | null
          updated_at?: string | null
        }
        Update: {
          id?: string
          username?: string
          display_name?: string | null
          avatar_url?: string | null
          bio?: string | null
          skills?: string[] | null
          github_username?: string | null
          role?: string | null
          created_at?: string | null
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "profiles_id_fkey"
            columns: ["id"]
            referencedRelation: "users"
            referencedColumns: ["id"]
          }
        ]
      }
      papers: {
        Row: {
          id: string
          arxiv_id: string | null
          semantic_id: string | null
          title: string
          plain_title: string | null
          summary: string | null
          why_it_matters: string | null
          category: string
          topic_tags: string[] | null
          citation_count: number | null
          published_at: string | null
          processed_at: string | null
          is_active: boolean | null
        }
        Insert: {
          id?: string
          arxiv_id?: string | null
          semantic_id?: string | null
          title: string
          plain_title?: string | null
          summary?: string | null
          why_it_matters?: string | null
          category: string
          topic_tags?: string[] | null
          citation_count?: number | null
          published_at?: string | null
          processed_at?: string | null
          is_active?: boolean | null
        }
        Update: {
          id?: string
          arxiv_id?: string | null
          semantic_id?: string | null
          title?: string
          plain_title?: string | null
          summary?: string | null
          why_it_matters?: string | null
          category?: string
          topic_tags?: string[] | null
          citation_count?: number | null
          published_at?: string | null
          processed_at?: string | null
          is_active?: boolean | null
        }
        Relationships: []
      }
      tools: {
        Row: {
          id: string
          paper_id: string | null
          github_url: string
          name: string
          description: string | null
          stars: number | null
          forks: number | null
          last_commit_at: string | null
          is_deprecated: boolean | null
          updated_at: string | null
        }
        Insert: {
          id?: string
          paper_id?: string | null
          github_url: string
          name: string
          description?: string | null
          stars?: number | null
          forks?: number | null
          last_commit_at?: string | null
          is_deprecated?: boolean | null
          updated_at?: string | null
        }
        Update: {
          id?: string
          paper_id?: string | null
          github_url?: string
          name?: string
          description?: string | null
          stars?: number | null
          forks?: number | null
          last_commit_at?: string | null
          is_deprecated?: boolean | null
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "tools_paper_id_fkey"
            columns: ["paper_id"]
            referencedRelation: "papers"
            referencedColumns: ["id"]
          }
        ]
      }
      user_seen_papers: {
        Row: {
          user_id: string
          paper_id: string
          seen_at: string | null
        }
        Insert: {
          user_id: string
          paper_id: string
          seen_at?: string | null
        }
        Update: {
          user_id?: string
          paper_id?: string
          seen_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "user_seen_papers_paper_id_fkey"
            columns: ["paper_id"]
            referencedRelation: "papers"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "user_seen_papers_user_id_fkey"
            columns: ["user_id"]
            referencedRelation: "users"
            referencedColumns: ["id"]
          }
        ]
      }
      saved_papers: {
        Row: {
          user_id: string
          paper_id: string
          saved_at: string | null
        }
        Insert: {
          user_id: string
          paper_id: string
          saved_at?: string | null
        }
        Update: {
          user_id?: string
          paper_id?: string
          saved_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "saved_papers_paper_id_fkey"
            columns: ["paper_id"]
            referencedRelation: "papers"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "saved_papers_user_id_fkey"
            columns: ["user_id"]
            referencedRelation: "users"
            referencedColumns: ["id"]
          }
        ]
      }
      saved_tools: {
        Row: {
          user_id: string
          tool_id: string
          saved_at: string | null
        }
        Insert: {
          user_id: string
          tool_id: string
          saved_at?: string | null
        }
        Update: {
          user_id?: string
          tool_id?: string
          saved_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "saved_tools_tool_id_fkey"
            columns: ["tool_id"]
            referencedRelation: "tools"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "saved_tools_user_id_fkey"
            columns: ["user_id"]
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
