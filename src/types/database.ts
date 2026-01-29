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
            leads: {
                Row: {
                    id: string
                    created_at: string
                    name: string
                    email: string
                    phone: string | null
                    business_description: string | null
                    requirements: string | null
                    status: 'new' | 'contacted' | 'closed'
                }
                Insert: {
                    id?: string
                    created_at?: string
                    name: string
                    email: string
                    phone?: string | null
                    business_description?: string | null
                    requirements?: string | null
                    status?: 'new' | 'contacted' | 'closed'
                }
                Update: {
                    id?: string
                    created_at?: string
                    name?: string
                    email?: string
                    phone?: string | null
                    business_description?: string | null
                    requirements?: string | null
                    status?: 'new' | 'contacted' | 'closed'
                }
            }
            feedbacks: {
                Row: {
                    id: string
                    created_at: string
                    name: string
                    email: string
                    subject: string | null
                    message: string
                    status: 'unread' | 'read'
                }
                Insert: {
                    id?: string
                    created_at?: string
                    name: string
                    email: string
                    subject?: string | null
                    message: string
                    status?: 'unread' | 'read'
                }
                Update: {
                    id?: string
                    created_at?: string
                    name?: string
                    email?: string
                    subject?: string | null
                    message?: string
                    status?: 'unread' | 'read'
                }
            }
            blog_posts: {
                Row: {
                    id: string
                    created_at: string
                    updated_at: string
                    title: string
                    slug: string
                    excerpt: string | null
                    content: string | null
                    cover_image: string | null
                    published: boolean
                    views: number
                    author_id: string | null
                }
                Insert: {
                    id?: string
                    created_at?: string
                    updated_at?: string
                    title: string
                    slug: string
                    excerpt?: string | null
                    content?: string | null
                    cover_image?: string | null
                    published?: boolean
                    views?: number
                    author_id?: string | null
                }
                Update: {
                    id?: string
                    created_at?: string
                    updated_at?: string
                    title?: string
                    slug?: string
                    excerpt?: string | null
                    content?: string | null
                    cover_image?: string | null
                    published?: boolean
                    views?: number
                    author_id?: string | null
                }
            }
            profiles: {
                Row: {
                    id: string
                    email: string | null
                    role: string | null
                    created_at: string
                }
                Insert: {
                    id: string
                    email?: string | null
                    role?: string | null
                    created_at?: string
                }
                Update: {
                    id?: string
                    email?: string | null
                    role?: string | null
                    created_at?: string
                }
            }
            services: {
                Row: {
                    id: string
                    name: string
                    created_at: string
                }
                Insert: {
                    id?: string
                    name: string
                    created_at?: string
                }
                Update: {
                    id?: string
                    name?: string
                    created_at?: string
                }
            },
            service_details: {
                Row: {
                    id: string
                    service_id: string
                    slug: string
                    icon_name: string
                    card_title: string
                    card_description: string
                    header_title: string
                    header_description: string
                    benefits: string[] | null
                    tech_stack: Json | null
                    success_stories: Json | null
                    created_at: string
                }
                Insert: {
                    id?: string
                    service_id: string
                    slug: string
                    icon_name: string
                    card_title: string
                    card_description: string
                    header_title: string
                    header_description: string
                    benefits?: string[] | null
                    tech_stack?: Json | null
                    success_stories?: Json | null
                    created_at?: string
                }
                Update: {
                    id?: string
                    service_id?: string
                    slug?: string
                    icon_name?: string
                    card_title?: string
                    card_description?: string
                    header_title?: string
                    header_description?: string
                    benefits?: string[] | null
                    tech_stack?: Json | null
                    success_stories?: Json | null
                    created_at?: string
                }
            }
            featured_work: {
                Row: {
                    id: string
                    title: string
                    subject: string
                    image_url: string
                    blog_post_url: string | null
                    category: string
                    color: string | null
                    created_at: string
                }
                Insert: {
                    id?: string
                    title: string
                    subject: string
                    image_url: string
                    blog_post_url?: string | null
                    category: string
                    color?: string | null
                    created_at?: string
                }
                Update: {
                    id?: string
                    title?: string
                    subject?: string
                    image_url?: string
                    blog_post_url?: string | null
                    category?: string
                    color?: string | null
                    created_at?: string
                }
            }
            team_members: {
                Row: {
                    id: string
                    name: string
                    role: string
                    bio: string
                    image_url: string
                    linkedin_url: string | null
                    twitter_url: string | null
                    github_url: string | null
                    display_order: number | null
                    created_at: string
                }
                Insert: {
                    id?: string
                    name: string
                    role: string
                    bio: string
                    image_url: string
                    linkedin_url?: string | null
                    twitter_url?: string | null
                    github_url?: string | null
                    display_order?: number | null
                    created_at?: string
                }
                Update: {
                    id?: string
                    name?: string
                    role?: string
                    bio?: string
                    image_url?: string
                    linkedin_url?: string | null
                    twitter_url?: string | null
                    github_url?: string | null
                    display_order?: number | null
                    created_at?: string
                }
            }
        }
    }
}
