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
    PostgrestVersion: "14.5"
  }
  public: {
    Tables: {
      activity_log: {
        Row: {
          action: string
          created_at: string
          entity_id: number | null
          entity_type: string | null
          id: number
          ip_address: string | null
          user_agent: string | null
          user_id: string | null
        }
        Insert: {
          action: string
          created_at?: string
          entity_id?: number | null
          entity_type?: string | null
          id?: number
          ip_address?: string | null
          user_agent?: string | null
          user_id?: string | null
        }
        Update: {
          action?: string
          created_at?: string
          entity_id?: number | null
          entity_type?: string | null
          id?: number
          ip_address?: string | null
          user_agent?: string | null
          user_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "activity_log_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
        ]
      }
      blog_comments: {
        Row: {
          content: string
          created_at: string
          guest_email: string | null
          guest_name: string | null
          id: number
          parent_id: number | null
          post_id: number
          status: Database["public"]["Enums"]["moderation_status"] | null
          updated_at: string
          user_id: string | null
        }
        Insert: {
          content: string
          created_at?: string
          guest_email?: string | null
          guest_name?: string | null
          id?: number
          parent_id?: number | null
          post_id: number
          status?: Database["public"]["Enums"]["moderation_status"] | null
          updated_at?: string
          user_id?: string | null
        }
        Update: {
          content?: string
          created_at?: string
          guest_email?: string | null
          guest_name?: string | null
          id?: number
          parent_id?: number | null
          post_id?: number
          status?: Database["public"]["Enums"]["moderation_status"] | null
          updated_at?: string
          user_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "blog_comments_parent_id_fkey"
            columns: ["parent_id"]
            isOneToOne: false
            referencedRelation: "blog_comments"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "blog_comments_parent_id_fkey"
            columns: ["parent_id"]
            isOneToOne: false
            referencedRelation: "blog_comments_public"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "blog_comments_post_id_fkey"
            columns: ["post_id"]
            isOneToOne: false
            referencedRelation: "blog_posts"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "blog_comments_post_id_fkey"
            columns: ["post_id"]
            isOneToOne: false
            referencedRelation: "blog_posts_public"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "blog_comments_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
        ]
      }
      blog_likes: {
        Row: {
          created_at: string
          device_hash: string | null
          id: number
          post_id: number
          user_id: string | null
        }
        Insert: {
          created_at?: string
          device_hash?: string | null
          id?: number
          post_id: number
          user_id?: string | null
        }
        Update: {
          created_at?: string
          device_hash?: string | null
          id?: number
          post_id?: number
          user_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "blog_likes_post_id_fkey"
            columns: ["post_id"]
            isOneToOne: false
            referencedRelation: "blog_posts"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "blog_likes_post_id_fkey"
            columns: ["post_id"]
            isOneToOne: false
            referencedRelation: "blog_posts_public"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "blog_likes_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
        ]
      }
      blog_posts: {
        Row: {
          author_id: string
          category: string | null
          content: string
          created_at: string
          excerpt: string | null
          featured: boolean | null
          featured_image: string | null
          gallery: Json | null
          id: number
          likes: number
          published_at: string | null
          reading_time: number | null
          slug: string
          status: Database["public"]["Enums"]["blog_status"] | null
          tags: string | null
          title: string
          updated_at: string
          views: number
        }
        Insert: {
          author_id: string
          category?: string | null
          content: string
          created_at?: string
          excerpt?: string | null
          featured?: boolean | null
          featured_image?: string | null
          gallery?: Json | null
          id?: number
          likes?: number
          published_at?: string | null
          reading_time?: number | null
          slug: string
          status?: Database["public"]["Enums"]["blog_status"] | null
          tags?: string | null
          title: string
          updated_at?: string
          views?: number
        }
        Update: {
          author_id?: string
          category?: string | null
          content?: string
          created_at?: string
          excerpt?: string | null
          featured?: boolean | null
          featured_image?: string | null
          gallery?: Json | null
          id?: number
          likes?: number
          published_at?: string | null
          reading_time?: number | null
          slug?: string
          status?: Database["public"]["Enums"]["blog_status"] | null
          tags?: string | null
          title?: string
          updated_at?: string
          views?: number
        }
        Relationships: [
          {
            foreignKeyName: "blog_posts_author_id_fkey"
            columns: ["author_id"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
        ]
      }
      booking_invitations: {
        Row: {
          additional_details: string | null
          audience_size: string | null
          budget_range: string | null
          created_at: string
          duration: string | null
          email: string
          event_date: string
          event_time: string | null
          event_type: string
          id: number
          name: string
          organization: string | null
          performance_type: string | null
          phone: string
          status: string
          user_id: string | null
          venue: string
        }
        Insert: {
          additional_details?: string | null
          audience_size?: string | null
          budget_range?: string | null
          created_at?: string
          duration?: string | null
          email: string
          event_date: string
          event_time?: string | null
          event_type: string
          id?: number
          name: string
          organization?: string | null
          performance_type?: string | null
          phone: string
          status?: string
          user_id?: string | null
          venue: string
        }
        Update: {
          additional_details?: string | null
          audience_size?: string | null
          budget_range?: string | null
          created_at?: string
          duration?: string | null
          email?: string
          event_date?: string
          event_time?: string | null
          event_type?: string
          id?: number
          name?: string
          organization?: string | null
          performance_type?: string | null
          phone?: string
          status?: string
          user_id?: string | null
          venue?: string
        }
        Relationships: [
          {
            foreignKeyName: "booking_invitations_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
        ]
      }
      chapter_join_requests: {
        Row: {
          chapter_id: number
          created_at: string
          email: string
          first_name: string
          id: number
          last_name: string
          message: string | null
          phone: string | null
          review_note: string | null
          reviewed_at: string | null
          reviewed_by: string | null
          status: Database["public"]["Enums"]["moderation_status"] | null
          user_id: string | null
        }
        Insert: {
          chapter_id: number
          created_at?: string
          email: string
          first_name: string
          id?: number
          last_name: string
          message?: string | null
          phone?: string | null
          review_note?: string | null
          reviewed_at?: string | null
          reviewed_by?: string | null
          status?: Database["public"]["Enums"]["moderation_status"] | null
          user_id?: string | null
        }
        Update: {
          chapter_id?: number
          created_at?: string
          email?: string
          first_name?: string
          id?: number
          last_name?: string
          message?: string | null
          phone?: string | null
          review_note?: string | null
          reviewed_at?: string | null
          reviewed_by?: string | null
          status?: Database["public"]["Enums"]["moderation_status"] | null
          user_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "chapter_join_requests_chapter_id_fkey"
            columns: ["chapter_id"]
            isOneToOne: false
            referencedRelation: "chapters"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "chapter_join_requests_reviewed_by_fkey"
            columns: ["reviewed_by"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "chapter_join_requests_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
        ]
      }
      chapters: {
        Row: {
          about_text: string | null
          campus_university: string | null
          chapter_image: string | null
          chapter_logo: string | null
          contact_email: string | null
          contact_person: string | null
          contact_phone: string | null
          created_at: string
          description: string | null
          gallery: Json | null
          hero_image: string | null
          id: number
          image: string | null
          is_campus: boolean | null
          latitude: number | null
          leader_id: string | null
          location: string
          logo_image: string | null
          logo_path: string | null
          longitude: number | null
          meeting_schedule: string | null
          name: string
          slug: string
          status: Database["public"]["Enums"]["chapter_status"] | null
          updated_at: string | null
        }
        Insert: {
          about_text?: string | null
          campus_university?: string | null
          chapter_image?: string | null
          chapter_logo?: string | null
          contact_email?: string | null
          contact_person?: string | null
          contact_phone?: string | null
          created_at?: string
          description?: string | null
          gallery?: Json | null
          hero_image?: string | null
          id?: number
          image?: string | null
          is_campus?: boolean | null
          latitude?: number | null
          leader_id?: string | null
          location: string
          logo_image?: string | null
          logo_path?: string | null
          longitude?: number | null
          meeting_schedule?: string | null
          name: string
          slug: string
          status?: Database["public"]["Enums"]["chapter_status"] | null
          updated_at?: string | null
        }
        Update: {
          about_text?: string | null
          campus_university?: string | null
          chapter_image?: string | null
          chapter_logo?: string | null
          contact_email?: string | null
          contact_person?: string | null
          contact_phone?: string | null
          created_at?: string
          description?: string | null
          gallery?: Json | null
          hero_image?: string | null
          id?: number
          image?: string | null
          is_campus?: boolean | null
          latitude?: number | null
          leader_id?: string | null
          location?: string
          logo_image?: string | null
          logo_path?: string | null
          longitude?: number | null
          meeting_schedule?: string | null
          name?: string
          slug?: string
          status?: Database["public"]["Enums"]["chapter_status"] | null
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "chapters_leader_id_fkey"
            columns: ["leader_id"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
        ]
      }
      donations: {
        Row: {
          amount: number
          created_at: string
          currency: string | null
          donor_email: string | null
          donor_name: string | null
          fund_type: string | null
          id: number
          is_recurring: boolean | null
          payment_method: string | null
          recurring_frequency:
            | Database["public"]["Enums"]["recurring_frequency"]
            | null
          status: Database["public"]["Enums"]["donation_status"] | null
          transaction_id: string | null
          user_id: string | null
        }
        Insert: {
          amount: number
          created_at?: string
          currency?: string | null
          donor_email?: string | null
          donor_name?: string | null
          fund_type?: string | null
          id?: number
          is_recurring?: boolean | null
          payment_method?: string | null
          recurring_frequency?:
            | Database["public"]["Enums"]["recurring_frequency"]
            | null
          status?: Database["public"]["Enums"]["donation_status"] | null
          transaction_id?: string | null
          user_id?: string | null
        }
        Update: {
          amount?: number
          created_at?: string
          currency?: string | null
          donor_email?: string | null
          donor_name?: string | null
          fund_type?: string | null
          id?: number
          is_recurring?: boolean | null
          payment_method?: string | null
          recurring_frequency?:
            | Database["public"]["Enums"]["recurring_frequency"]
            | null
          status?: Database["public"]["Enums"]["donation_status"] | null
          transaction_id?: string | null
          user_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "donations_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
        ]
      }
      event_registrations: {
        Row: {
          additional_info: string | null
          attendance_confirmed: boolean | null
          chapter: string | null
          dietary_needs: string | null
          email: string
          event_id: number
          id: number
          name: string
          phone: string | null
          registered_at: string
          user_id: string | null
        }
        Insert: {
          additional_info?: string | null
          attendance_confirmed?: boolean | null
          chapter?: string | null
          dietary_needs?: string | null
          email: string
          event_id: number
          id?: number
          name: string
          phone?: string | null
          registered_at?: string
          user_id?: string | null
        }
        Update: {
          additional_info?: string | null
          attendance_confirmed?: boolean | null
          chapter?: string | null
          dietary_needs?: string | null
          email?: string
          event_id?: number
          id?: number
          name?: string
          phone?: string | null
          registered_at?: string
          user_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "event_registrations_event_id_fkey"
            columns: ["event_id"]
            isOneToOne: false
            referencedRelation: "events"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "event_registrations_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
        ]
      }
      event_rsvps: {
        Row: {
          email: string
          event_id: number
          guests_count: number | null
          id: number
          message: string | null
          name: string
          phone: string | null
          responded_at: string
          response: Database["public"]["Enums"]["rsvp_response"] | null
          user_id: string | null
        }
        Insert: {
          email: string
          event_id: number
          guests_count?: number | null
          id?: number
          message?: string | null
          name: string
          phone?: string | null
          responded_at?: string
          response?: Database["public"]["Enums"]["rsvp_response"] | null
          user_id?: string | null
        }
        Update: {
          email?: string
          event_id?: number
          guests_count?: number | null
          id?: number
          message?: string | null
          name?: string
          phone?: string | null
          responded_at?: string
          response?: Database["public"]["Enums"]["rsvp_response"] | null
          user_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "event_rsvps_event_id_fkey"
            columns: ["event_id"]
            isOneToOne: false
            referencedRelation: "events"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "event_rsvps_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
        ]
      }
      events: {
        Row: {
          archived_at: string | null
          chapter_id: number | null
          created_at: string
          created_by: string | null
          description: string | null
          end_date: string | null
          event_type: Database["public"]["Enums"]["event_type"] | null
          featured: boolean | null
          gallery: Json | null
          hero_image: string | null
          id: number
          latitude: number | null
          location: string | null
          longitude: number | null
          notify_newsletter: boolean | null
          registration_count: number
          registration_enabled: boolean | null
          registration_limit: number | null
          rsvp_enabled: boolean | null
          slug: string
          start_date: string
          status: Database["public"]["Enums"]["event_status"] | null
          title: string
          updated_at: string
          videos: string | null
          views: number
          virtual_link: string | null
        }
        Insert: {
          archived_at?: string | null
          chapter_id?: number | null
          created_at?: string
          created_by?: string | null
          description?: string | null
          end_date?: string | null
          event_type?: Database["public"]["Enums"]["event_type"] | null
          featured?: boolean | null
          gallery?: Json | null
          hero_image?: string | null
          id?: number
          latitude?: number | null
          location?: string | null
          longitude?: number | null
          notify_newsletter?: boolean | null
          registration_count?: number
          registration_enabled?: boolean | null
          registration_limit?: number | null
          rsvp_enabled?: boolean | null
          slug: string
          start_date: string
          status?: Database["public"]["Enums"]["event_status"] | null
          title: string
          updated_at?: string
          videos?: string | null
          views?: number
          virtual_link?: string | null
        }
        Update: {
          archived_at?: string | null
          chapter_id?: number | null
          created_at?: string
          created_by?: string | null
          description?: string | null
          end_date?: string | null
          event_type?: Database["public"]["Enums"]["event_type"] | null
          featured?: boolean | null
          gallery?: Json | null
          hero_image?: string | null
          id?: number
          latitude?: number | null
          location?: string | null
          longitude?: number | null
          notify_newsletter?: boolean | null
          registration_count?: number
          registration_enabled?: boolean | null
          registration_limit?: number | null
          rsvp_enabled?: boolean | null
          slug?: string
          start_date?: string
          status?: Database["public"]["Enums"]["event_status"] | null
          title?: string
          updated_at?: string
          videos?: string | null
          views?: number
          virtual_link?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "events_chapter_id_fkey"
            columns: ["chapter_id"]
            isOneToOne: false
            referencedRelation: "chapters"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "events_created_by_fkey"
            columns: ["created_by"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
        ]
      }
      homepage_videos: {
        Row: {
          created_at: string
          created_by: string | null
          description: string | null
          id: number
          row_title: string | null
          sort_order: number | null
          status: Database["public"]["Enums"]["active_status"] | null
          title: string
          updated_at: string
          video_date: string | null
          youtube_url: string
        }
        Insert: {
          created_at?: string
          created_by?: string | null
          description?: string | null
          id?: number
          row_title?: string | null
          sort_order?: number | null
          status?: Database["public"]["Enums"]["active_status"] | null
          title: string
          updated_at?: string
          video_date?: string | null
          youtube_url: string
        }
        Update: {
          created_at?: string
          created_by?: string | null
          description?: string | null
          id?: number
          row_title?: string | null
          sort_order?: number | null
          status?: Database["public"]["Enums"]["active_status"] | null
          title?: string
          updated_at?: string
          video_date?: string | null
          youtube_url?: string
        }
        Relationships: [
          {
            foreignKeyName: "homepage_videos_created_by_fkey"
            columns: ["created_by"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
        ]
      }
      instagram_manual_posts: {
        Row: {
          caption: string | null
          id: number
          post_url: string | null
          slot: number
          updated_at: string
        }
        Insert: {
          caption?: string | null
          id?: number
          post_url?: string | null
          slot: number
          updated_at?: string
        }
        Update: {
          caption?: string | null
          id?: number
          post_url?: string | null
          slot?: number
          updated_at?: string
        }
        Relationships: []
      }
      media_content: {
        Row: {
          category: string | null
          created_at: string
          description: string | null
          display_order: number | null
          featured: boolean | null
          file_path: string | null
          id: number
          media_type: Database["public"]["Enums"]["media_type"]
          rejection_reason: string | null
          status: Database["public"]["Enums"]["moderation_status"] | null
          submitter_email: string | null
          submitter_name: string | null
          thumbnail_path: string | null
          title: string
          updated_at: string
          user_id: string | null
          view_count: number
        }
        Insert: {
          category?: string | null
          created_at?: string
          description?: string | null
          display_order?: number | null
          featured?: boolean | null
          file_path?: string | null
          id?: number
          media_type: Database["public"]["Enums"]["media_type"]
          rejection_reason?: string | null
          status?: Database["public"]["Enums"]["moderation_status"] | null
          submitter_email?: string | null
          submitter_name?: string | null
          thumbnail_path?: string | null
          title: string
          updated_at?: string
          user_id?: string | null
          view_count?: number
        }
        Update: {
          category?: string | null
          created_at?: string
          description?: string | null
          display_order?: number | null
          featured?: boolean | null
          file_path?: string | null
          id?: number
          media_type?: Database["public"]["Enums"]["media_type"]
          rejection_reason?: string | null
          status?: Database["public"]["Enums"]["moderation_status"] | null
          submitter_email?: string | null
          submitter_name?: string | null
          thumbnail_path?: string | null
          title?: string
          updated_at?: string
          user_id?: string | null
          view_count?: number
        }
        Relationships: [
          {
            foreignKeyName: "media_content_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
        ]
      }
      media_featured_video: {
        Row: {
          created_at: string
          id: number
          title: string | null
          video_id: string
        }
        Insert: {
          created_at?: string
          id?: number
          title?: string | null
          video_id: string
        }
        Update: {
          created_at?: string
          id?: number
          title?: string | null
          video_id?: string
        }
        Relationships: []
      }
      media_hashtags: {
        Row: {
          created_at: string
          id: number
          tag: string
        }
        Insert: {
          created_at?: string
          id?: number
          tag: string
        }
        Update: {
          created_at?: string
          id?: number
          tag?: string
        }
        Relationships: []
      }
      media_upload_notify: {
        Row: {
          created_at: string
          email: string
          id: number
          notified: boolean | null
        }
        Insert: {
          created_at?: string
          email: string
          id?: number
          notified?: boolean | null
        }
        Update: {
          created_at?: string
          email?: string
          id?: number
          notified?: boolean | null
        }
        Relationships: []
      }
      ministries: {
        Row: {
          created_at: string
          description: string | null
          id: number
          image: string | null
          leader_id: string | null
          ministry_name: string
          slug: string
        }
        Insert: {
          created_at?: string
          description?: string | null
          id?: number
          image?: string | null
          leader_id?: string | null
          ministry_name: string
          slug: string
        }
        Update: {
          created_at?: string
          description?: string | null
          id?: number
          image?: string | null
          leader_id?: string | null
          ministry_name?: string
          slug?: string
        }
        Relationships: [
          {
            foreignKeyName: "ministries_leader_id_fkey"
            columns: ["leader_id"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
        ]
      }
      newsletter_emails: {
        Row: {
          email: string | null
          event_id: number | null
          id: number
          sent_at: string
          status: string | null
          subject: string | null
          subscriber_id: number | null
        }
        Insert: {
          email?: string | null
          event_id?: number | null
          id?: number
          sent_at?: string
          status?: string | null
          subject?: string | null
          subscriber_id?: number | null
        }
        Update: {
          email?: string | null
          event_id?: number | null
          id?: number
          sent_at?: string
          status?: string | null
          subject?: string | null
          subscriber_id?: number | null
        }
        Relationships: [
          {
            foreignKeyName: "newsletter_emails_event_id_fkey"
            columns: ["event_id"]
            isOneToOne: false
            referencedRelation: "events"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "newsletter_emails_subscriber_id_fkey"
            columns: ["subscriber_id"]
            isOneToOne: false
            referencedRelation: "newsletter_subscribers"
            referencedColumns: ["id"]
          },
        ]
      }
      newsletter_subscribers: {
        Row: {
          confirmation_date: string | null
          confirmation_token: string | null
          created_at: string
          email: string
          id: number
          name: string | null
          status: string
          unsubscribe_token: string | null
          updated_at: string
        }
        Insert: {
          confirmation_date?: string | null
          confirmation_token?: string | null
          created_at?: string
          email: string
          id?: number
          name?: string | null
          status?: string
          unsubscribe_token?: string | null
          updated_at?: string
        }
        Update: {
          confirmation_date?: string | null
          confirmation_token?: string | null
          created_at?: string
          email?: string
          id?: number
          name?: string | null
          status?: string
          unsubscribe_token?: string | null
          updated_at?: string
        }
        Relationships: []
      }
      prayer_interactions: {
        Row: {
          created_at: string
          device_hash: string | null
          id: number
          prayer_id: number
          user_id: string | null
        }
        Insert: {
          created_at?: string
          device_hash?: string | null
          id?: number
          prayer_id: number
          user_id?: string | null
        }
        Update: {
          created_at?: string
          device_hash?: string | null
          id?: number
          prayer_id?: number
          user_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "prayer_interactions_prayer_id_fkey"
            columns: ["prayer_id"]
            isOneToOne: false
            referencedRelation: "prayer_requests"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "prayer_interactions_prayer_id_fkey"
            columns: ["prayer_id"]
            isOneToOne: false
            referencedRelation: "prayer_requests_public"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "prayer_interactions_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
        ]
      }
      prayer_requests: {
        Row: {
          archived_at: string | null
          category: Database["public"]["Enums"]["prayer_category"] | null
          created_at: string
          description: string
          id: number
          is_anonymous: boolean | null
          prayer_count: number
          status: Database["public"]["Enums"]["prayer_status"] | null
          title: string
          user_id: string | null
        }
        Insert: {
          archived_at?: string | null
          category?: Database["public"]["Enums"]["prayer_category"] | null
          created_at?: string
          description: string
          id?: number
          is_anonymous?: boolean | null
          prayer_count?: number
          status?: Database["public"]["Enums"]["prayer_status"] | null
          title: string
          user_id?: string | null
        }
        Update: {
          archived_at?: string | null
          category?: Database["public"]["Enums"]["prayer_category"] | null
          created_at?: string
          description?: string
          id?: number
          is_anonymous?: boolean | null
          prayer_count?: number
          status?: Database["public"]["Enums"]["prayer_status"] | null
          title?: string
          user_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "prayer_requests_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
        ]
      }
      press_kit: {
        Row: {
          created_at: string
          filename: string
          filesize: number
          id: number
        }
        Insert: {
          created_at?: string
          filename: string
          filesize: number
          id?: number
        }
        Update: {
          created_at?: string
          filename?: string
          filesize?: number
          id?: number
        }
        Relationships: []
      }
      rate_limits: {
        Row: {
          hits: number
          key: string
          window_start: string
        }
        Insert: {
          hits?: number
          key: string
          window_start?: string
        }
        Update: {
          hits?: number
          key?: string
          window_start?: string
        }
        Relationships: []
      }
      site_settings: {
        Row: {
          key: string
          updated_at: string
          value: string
        }
        Insert: {
          key: string
          updated_at?: string
          value: string
        }
        Update: {
          key?: string
          updated_at?: string
          value?: string
        }
        Relationships: []
      }
      social_media_credentials: {
        Row: {
          access_token: string | null
          account_id: string | null
          account_name: string | null
          created_at: string
          expires_at: string | null
          id: number
          is_active: boolean | null
          platform: string | null
          refresh_token: string | null
          updated_at: string
        }
        Insert: {
          access_token?: string | null
          account_id?: string | null
          account_name?: string | null
          created_at?: string
          expires_at?: string | null
          id?: number
          is_active?: boolean | null
          platform?: string | null
          refresh_token?: string | null
          updated_at?: string
        }
        Update: {
          access_token?: string | null
          account_id?: string | null
          account_name?: string | null
          created_at?: string
          expires_at?: string | null
          id?: number
          is_active?: boolean | null
          platform?: string | null
          refresh_token?: string | null
          updated_at?: string
        }
        Relationships: []
      }
      social_media_stats: {
        Row: {
          follower_count: number | null
          id: number
          last_updated: string
          platform: string
        }
        Insert: {
          follower_count?: number | null
          id?: number
          last_updated?: string
          platform: string
        }
        Update: {
          follower_count?: number | null
          id?: number
          last_updated?: string
          platform?: string
        }
        Relationships: []
      }
      tiktok_featured: {
        Row: {
          id: number
          slot: number
          updated_at: string
          video_url: string | null
        }
        Insert: {
          id?: number
          slot: number
          updated_at?: string
          video_url?: string | null
        }
        Update: {
          id?: number
          slot?: number
          updated_at?: string
          video_url?: string | null
        }
        Relationships: []
      }
      user_badges: {
        Row: {
          auto_earned: boolean | null
          awarded_at: string
          awarded_by: string | null
          badge_type: Database["public"]["Enums"]["badge_type"]
          id: number
          user_id: string
        }
        Insert: {
          auto_earned?: boolean | null
          awarded_at?: string
          awarded_by?: string | null
          badge_type: Database["public"]["Enums"]["badge_type"]
          id?: number
          user_id: string
        }
        Update: {
          auto_earned?: boolean | null
          awarded_at?: string
          awarded_by?: string | null
          badge_type?: Database["public"]["Enums"]["badge_type"]
          id?: number
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "user_badges_awarded_by_fkey"
            columns: ["awarded_by"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "user_badges_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
        ]
      }
      user_ministries: {
        Row: {
          id: number
          joined_at: string
          ministry_id: number
          user_id: string
        }
        Insert: {
          id?: number
          joined_at?: string
          ministry_id: number
          user_id: string
        }
        Update: {
          id?: number
          joined_at?: string
          ministry_id?: number
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "user_ministries_ministry_id_fkey"
            columns: ["ministry_id"]
            isOneToOne: false
            referencedRelation: "ministries"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "user_ministries_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
        ]
      }
      users: {
        Row: {
          bio: string | null
          chapter_id: number | null
          created_at: string
          custom_tag: string | null
          custom_tag_color: string | null
          email: string
          email_verified: boolean | null
          first_name: string
          google_id: string | null
          id: string
          last_login: string | null
          last_name: string
          ministry_team: string | null
          phone: string | null
          primary_role: Database["public"]["Enums"]["user_primary_role"] | null
          profile_completion: number | null
          profile_photo: string | null
          role: Database["public"]["Enums"]["user_role"]
          role_tag_color: string | null
          show_chapter: boolean | null
          show_role: boolean | null
          show_team: boolean | null
          status: Database["public"]["Enums"]["user_status"]
          team_tag_color: string | null
          updated_at: string
        }
        Insert: {
          bio?: string | null
          chapter_id?: number | null
          created_at?: string
          custom_tag?: string | null
          custom_tag_color?: string | null
          email: string
          email_verified?: boolean | null
          first_name?: string
          google_id?: string | null
          id: string
          last_login?: string | null
          last_name?: string
          ministry_team?: string | null
          phone?: string | null
          primary_role?: Database["public"]["Enums"]["user_primary_role"] | null
          profile_completion?: number | null
          profile_photo?: string | null
          role?: Database["public"]["Enums"]["user_role"]
          role_tag_color?: string | null
          show_chapter?: boolean | null
          show_role?: boolean | null
          show_team?: boolean | null
          status?: Database["public"]["Enums"]["user_status"]
          team_tag_color?: string | null
          updated_at?: string
        }
        Update: {
          bio?: string | null
          chapter_id?: number | null
          created_at?: string
          custom_tag?: string | null
          custom_tag_color?: string | null
          email?: string
          email_verified?: boolean | null
          first_name?: string
          google_id?: string | null
          id?: string
          last_login?: string | null
          last_name?: string
          ministry_team?: string | null
          phone?: string | null
          primary_role?: Database["public"]["Enums"]["user_primary_role"] | null
          profile_completion?: number | null
          profile_photo?: string | null
          role?: Database["public"]["Enums"]["user_role"]
          role_tag_color?: string | null
          show_chapter?: boolean | null
          show_role?: boolean | null
          show_team?: boolean | null
          status?: Database["public"]["Enums"]["user_status"]
          team_tag_color?: string | null
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "users_chapter_id_fkey"
            columns: ["chapter_id"]
            isOneToOne: false
            referencedRelation: "chapters"
            referencedColumns: ["id"]
          },
        ]
      }
      volunteer_applications: {
        Row: {
          availability: string
          chapter: string | null
          created_at: string
          email: string
          first_name: string
          id: number
          last_name: string
          motivation: string
          opportunity_id: number | null
          phone: string
          skills: string
          status: string
          user_id: string | null
        }
        Insert: {
          availability: string
          chapter?: string | null
          created_at?: string
          email: string
          first_name: string
          id?: number
          last_name: string
          motivation: string
          opportunity_id?: number | null
          phone: string
          skills: string
          status?: string
          user_id?: string | null
        }
        Update: {
          availability?: string
          chapter?: string | null
          created_at?: string
          email?: string
          first_name?: string
          id?: number
          last_name?: string
          motivation?: string
          opportunity_id?: number | null
          phone?: string
          skills?: string
          status?: string
          user_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "volunteer_applications_opportunity_id_fkey"
            columns: ["opportunity_id"]
            isOneToOne: false
            referencedRelation: "volunteer_opportunities"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "volunteer_applications_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
        ]
      }
      volunteer_opportunities: {
        Row: {
          created_at: string
          department: string
          description: string
          id: number
          location_type: string | null
          priority: string | null
          requirements: string | null
          status: string | null
          time_commitment: string | null
          title: string
          updated_at: string
          urgency: string | null
          volunteers_needed: number | null
        }
        Insert: {
          created_at?: string
          department: string
          description: string
          id?: number
          location_type?: string | null
          priority?: string | null
          requirements?: string | null
          status?: string | null
          time_commitment?: string | null
          title: string
          updated_at?: string
          urgency?: string | null
          volunteers_needed?: number | null
        }
        Update: {
          created_at?: string
          department?: string
          description?: string
          id?: number
          location_type?: string | null
          priority?: string | null
          requirements?: string | null
          status?: string | null
          time_commitment?: string | null
          title?: string
          updated_at?: string
          urgency?: string | null
          volunteers_needed?: number | null
        }
        Relationships: []
      }
      volunteers: {
        Row: {
          applied_at: string
          availability: string | null
          hours_logged: number | null
          id: number
          roles: Json | null
          skills: string | null
          status: Database["public"]["Enums"]["volunteer_status"] | null
          testimony: string | null
          user_id: string
        }
        Insert: {
          applied_at?: string
          availability?: string | null
          hours_logged?: number | null
          id?: number
          roles?: Json | null
          skills?: string | null
          status?: Database["public"]["Enums"]["volunteer_status"] | null
          testimony?: string | null
          user_id: string
        }
        Update: {
          applied_at?: string
          availability?: string | null
          hours_logged?: number | null
          id?: number
          roles?: Json | null
          skills?: string | null
          status?: Database["public"]["Enums"]["volunteer_status"] | null
          testimony?: string | null
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "volunteers_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
        ]
      }
      youtube_videos_cache: {
        Row: {
          cached_at: string
          description: string | null
          duration: string | null
          id: number
          like_count: number | null
          published_at: string
          thumbnail_url: string | null
          title: string
          video_id: string
          view_count: number | null
        }
        Insert: {
          cached_at?: string
          description?: string | null
          duration?: string | null
          id?: number
          like_count?: number | null
          published_at?: string
          thumbnail_url?: string | null
          title: string
          video_id: string
          view_count?: number | null
        }
        Update: {
          cached_at?: string
          description?: string | null
          duration?: string | null
          id?: number
          like_count?: number | null
          published_at?: string
          thumbnail_url?: string | null
          title?: string
          video_id?: string
          view_count?: number | null
        }
        Relationships: []
      }
    }
    Views: {
      blog_comments_public: {
        Row: {
          author_name: string | null
          author_photo: string | null
          content: string | null
          created_at: string | null
          id: number | null
          parent_id: number | null
          post_id: number | null
        }
        Relationships: [
          {
            foreignKeyName: "blog_comments_parent_id_fkey"
            columns: ["parent_id"]
            isOneToOne: false
            referencedRelation: "blog_comments"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "blog_comments_parent_id_fkey"
            columns: ["parent_id"]
            isOneToOne: false
            referencedRelation: "blog_comments_public"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "blog_comments_post_id_fkey"
            columns: ["post_id"]
            isOneToOne: false
            referencedRelation: "blog_posts"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "blog_comments_post_id_fkey"
            columns: ["post_id"]
            isOneToOne: false
            referencedRelation: "blog_posts_public"
            referencedColumns: ["id"]
          },
        ]
      }
      blog_posts_public: {
        Row: {
          author_name: string | null
          author_photo: string | null
          category: string | null
          content: string | null
          created_at: string | null
          excerpt: string | null
          featured: boolean | null
          featured_image: string | null
          gallery: Json | null
          id: number | null
          likes: number | null
          published_at: string | null
          reading_time: number | null
          slug: string | null
          tags: string | null
          title: string | null
          updated_at: string | null
          views: number | null
        }
        Relationships: []
      }
      media_content_public: {
        Row: {
          category: string | null
          created_at: string | null
          description: string | null
          display_order: number | null
          featured: boolean | null
          file_path: string | null
          id: number | null
          media_type: Database["public"]["Enums"]["media_type"] | null
          submitter_name: string | null
          thumbnail_path: string | null
          title: string | null
          view_count: number | null
        }
        Insert: {
          category?: string | null
          created_at?: string | null
          description?: string | null
          display_order?: number | null
          featured?: boolean | null
          file_path?: string | null
          id?: number | null
          media_type?: Database["public"]["Enums"]["media_type"] | null
          submitter_name?: string | null
          thumbnail_path?: string | null
          title?: string | null
          view_count?: number | null
        }
        Update: {
          category?: string | null
          created_at?: string | null
          description?: string | null
          display_order?: number | null
          featured?: boolean | null
          file_path?: string | null
          id?: number | null
          media_type?: Database["public"]["Enums"]["media_type"] | null
          submitter_name?: string | null
          thumbnail_path?: string | null
          title?: string | null
          view_count?: number | null
        }
        Relationships: []
      }
      prayer_requests_public: {
        Row: {
          category: Database["public"]["Enums"]["prayer_category"] | null
          created_at: string | null
          description: string | null
          id: number | null
          prayer_count: number | null
          title: string | null
        }
        Insert: {
          category?: Database["public"]["Enums"]["prayer_category"] | null
          created_at?: string | null
          description?: string | null
          id?: number | null
          prayer_count?: number | null
          title?: string | null
        }
        Update: {
          category?: Database["public"]["Enums"]["prayer_category"] | null
          created_at?: string | null
          description?: string | null
          id?: number | null
          prayer_count?: number | null
          title?: string | null
        }
        Relationships: []
      }
    }
    Functions: {
      check_rate_limit: {
        Args: { p_key: string; p_limit: number; p_window_seconds: number }
        Returns: boolean
      }
      get_site_settings: { Args: never; Returns: Json }
      increment_event_views: {
        Args: { p_event_id: number }
        Returns: undefined
      }
      increment_media_views: {
        Args: { p_media_id: number }
        Returns: undefined
      }
      increment_post_views: { Args: { p_post_id: number }; Returns: undefined }
      is_admin: { Args: never; Returns: boolean }
      is_staff: { Args: never; Returns: boolean }
      refresh_event_statuses: { Args: never; Returns: undefined }
    }
    Enums: {
      active_status: "active" | "inactive"
      badge_type:
        | "verified"
        | "founder"
        | "ministry_leader"
        | "featured"
        | "certified"
        | "active"
      blog_status: "draft" | "published" | "archived"
      chapter_status: "active" | "pending" | "inactive"
      donation_status: "pending" | "completed" | "failed" | "refunded"
      event_status: "upcoming" | "ongoing" | "past" | "cancelled"
      event_type: "physical" | "virtual" | "hybrid"
      media_type: "image" | "video" | "audio" | "written"
      moderation_status: "pending" | "approved" | "rejected"
      prayer_category: "personal" | "family" | "ministry" | "global" | "other"
      prayer_status: "pending" | "approved" | "archived"
      recurring_frequency: "monthly" | "quarterly" | "yearly"
      rsvp_response: "yes" | "no" | "maybe"
      user_primary_role:
        | "poet"
        | "worship_leader"
        | "teacher"
        | "intercessor"
        | "writer"
        | "creative"
        | "evangelist"
        | "ministry_leader"
        | "volunteer"
        | "member"
      user_role:
        | "super_admin"
        | "administrator"
        | "editor"
        | "ministry_leader"
        | "member"
      user_status: "active" | "suspended" | "banned"
      volunteer_status: "pending" | "approved" | "inactive"
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
  TableName extends (DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
        DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])
    : never) = never,
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
  TableName extends (DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never) = never,
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
  TableName extends (DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never) = never,
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
  EnumName extends (DefaultSchemaEnumNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"]
    : never) = never,
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
  CompositeTypeName extends (PublicCompositeTypeNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never) = never,
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
      active_status: ["active", "inactive"],
      badge_type: [
        "verified",
        "founder",
        "ministry_leader",
        "featured",
        "certified",
        "active",
      ],
      blog_status: ["draft", "published", "archived"],
      chapter_status: ["active", "pending", "inactive"],
      donation_status: ["pending", "completed", "failed", "refunded"],
      event_status: ["upcoming", "ongoing", "past", "cancelled"],
      event_type: ["physical", "virtual", "hybrid"],
      media_type: ["image", "video", "audio", "written"],
      moderation_status: ["pending", "approved", "rejected"],
      prayer_category: ["personal", "family", "ministry", "global", "other"],
      prayer_status: ["pending", "approved", "archived"],
      recurring_frequency: ["monthly", "quarterly", "yearly"],
      rsvp_response: ["yes", "no", "maybe"],
      user_primary_role: [
        "poet",
        "worship_leader",
        "teacher",
        "intercessor",
        "writer",
        "creative",
        "evangelist",
        "ministry_leader",
        "volunteer",
        "member",
      ],
      user_role: [
        "super_admin",
        "administrator",
        "editor",
        "ministry_leader",
        "member",
      ],
      user_status: ["active", "suspended", "banned"],
      volunteer_status: ["pending", "approved", "inactive"],
    },
  },
} as const
