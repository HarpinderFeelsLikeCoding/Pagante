import { createClient } from '@supabase/supabase-js'

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY

console.log('Supabase configuration:')
console.log('URL:', supabaseUrl)
console.log('Anon Key:', supabaseAnonKey ? `${supabaseAnonKey.substring(0, 20)}...` : 'NOT SET')

if (!supabaseUrl || !supabaseAnonKey) {
  console.error('Missing Supabase environment variables!')
  console.error('VITE_SUPABASE_URL:', supabaseUrl)
  console.error('VITE_SUPABASE_ANON_KEY:', supabaseAnonKey ? 'SET' : 'NOT SET')
  throw new Error('Missing Supabase environment variables')
}

export const supabase = createClient(supabaseUrl, supabaseAnonKey, {
  auth: {
    autoRefreshToken: false, // Don't auto-refresh tokens
    persistSession: false,   // Don't persist session in localStorage
    detectSessionInUrl: false, // Don't detect session from URL
    flowType: 'pkce',
    storage: {
      // Custom storage that doesn't persist anything
      getItem: () => null,
      setItem: () => {},
      removeItem: () => {}
    }
  },
  global: {
    headers: {
      'X-Client-Info': 'pagante-web'
    }
  }
})

// Test the connection with better error handling
supabase.auth.getSession().then(({ data, error }) => {
  if (error) {
    console.error('Supabase connection test failed:', error)
  } else {
    console.log('Supabase connection test successful')
    
    // Test database connection
    supabase.from('profiles').select('count').limit(1).then(({ error: dbError }) => {
      if (dbError) {
        console.error('Database connection test failed:', dbError)
      } else {
        console.log('Database connection test successful')
      }
    })
  }
})

export type UserRole = 'user' | 'creator' | 'elected_creator' | 'judge' | 'admin'
export type ContentType = 'text_post' | 'image' | 'video' | 'audio' | 'live_stream' | 'digital_download' | 'poll' | 'discussion' | 'article'
export type TierType = 'free' | 'supporter' | 'premium' | 'vip'
export type StreamStatus = 'scheduled' | 'live' | 'ended' | 'cancelled'

export interface Profile {
  id: string
  email: string
  username: string
  full_name: string
  avatar_url?: string
  role: UserRole
  created_at: string
  updated_at: string
}

export interface Creator {
  id: string
  user_id: string
  description: string
  is_elected: boolean
  election_votes: number
  term_start_date?: string
  term_end_date?: string
  created_at: string
}

export interface SubscriptionTier {
  id: string
  creator_id: string
  name: string
  description: string
  price_monthly: number
  tier_type: TierType
  benefits: string[]
  max_subscribers?: number
  is_active: boolean
  created_at: string
  updated_at: string
}

export interface Subscription {
  id: string
  user_id: string
  creator_id: string
  tier_id: string
  status: string
  started_at: string
  expires_at?: string
  auto_renew: boolean
  created_at: string
}

export interface Content {
  id: string
  creator_id: string
  title: string
  description: string
  content_type: ContentType
  content_data: Record<string, any>
  tier_required: TierType
  is_published: boolean
  scheduled_publish_at?: string
  view_count: number
  like_count: number
  comment_count: number
  tags: string[]
  created_at: string
  updated_at: string
}

export interface LiveStream {
  id: string
  creator_id: string
  title: string
  description?: string
  scheduled_start: string
  actual_start?: string
  ended_at?: string
  status: StreamStatus
  tier_required: TierType
  max_viewers?: number
  current_viewers: number
  stream_key?: string
  recording_url?: string
  created_at: string
}

export interface Comment {
  id: string
  content_id: string
  user_id: string
  parent_id?: string
  comment_text: string
  is_pinned: boolean
  like_count: number
  created_at: string
  updated_at: string
  user?: Profile
}

export interface Proposal {
  id: string
  creator_id: string
  title: string
  description: string
  proposal_type: 'platform_policy' | 'revenue_sharing' | 'creator_rights' | 'other'
  status: 'draft' | 'voting' | 'passed' | 'rejected' | 'implemented'
  votes_for: number
  votes_against: number
  voting_deadline: string
  created_at: string
}

export interface Dispute {
  id: string
  plaintiff_id: string
  defendant_id: string
  title: string
  description: string
  status: 'open' | 'under_review' | 'resolved' | 'dismissed'
  assigned_judge_id?: string
  resolution?: string
  created_at: string
  resolved_at?: string
}

export interface CreatorEarnings {
  id: string
  creator_id: string
  subscription_id?: string
  amount: number
  currency: string
  transaction_type: string
  platform_fee: number
  net_amount: number
  processed_at: string
  payout_date?: string
  created_at: string
}

// Helper functions for content management
export const contentService = {
  async getCreatorContent(creatorId: string, limit = 20) {
    console.log('Getting creator content for:', creatorId)
    
    try {
      const { data, error } = await supabase
        .from('content')
        .select('*')
        .eq('creator_id', creatorId)
        .order('created_at', { ascending: false })
        .limit(limit)

      if (error) {
        console.error('Error fetching creator content:', error)
        throw error
      }
      
      console.log('Fetched content:', data)
      return data || []
    } catch (error) {
      console.error('Error in getCreatorContent:', error)
      return []
    }
  },

  async getDiscoverContent(tab: string = 'trending', category: string = 'all', limit = 20) {
    console.log('Getting discover content for tab:', tab, 'category:', category)
    
    try {
      let query = supabase
        .from('content')
        .select(`
          *,
          creators!inner(
            *,
            profiles!inner(*)
          )
        `)
        .eq('is_published', true)
        .limit(limit)

      // Filter by category if not 'all'
      if (category !== 'all') {
        query = query.eq('content_type', category)
      }

      // Sort based on tab
      switch (tab) {
        case 'trending':
          query = query.order('like_count', { ascending: false })
          break
        case 'recent':
          query = query.order('created_at', { ascending: false })
          break
        case 'featured':
          query = query.gte('like_count', 10).order('view_count', { ascending: false })
          break
        case 'following':
          // This would need user's following list - for now just recent
          query = query.order('created_at', { ascending: false })
          break
        default:
          query = query.order('created_at', { ascending: false })
      }

      const { data, error } = await query

      if (error) {
        console.error('Error fetching discover content:', error)
        throw error
      }
      
      console.log('Fetched discover content:', data)
      return data || []
    } catch (error) {
      console.error('Error in getDiscoverContent:', error)
      return []
    }
  },

  async getAllPublishedContent(limit = 20) {
    console.log('Getting all published content')
    
    try {
      const { data, error } = await supabase
        .from('content')
        .select(`
          *,
          creators!inner(
            *,
            profiles!inner(*)
          )
        `)
        .eq('is_published', true)
        .order('created_at', { ascending: false })
        .limit(limit)

      if (error) {
        console.error('Error fetching all published content:', error)
        throw error
      }
      
      console.log('Fetched all published content:', data)
      return data || []
    } catch (error) {
      console.error('Error in getAllPublishedContent:', error)
      return []
    }
  },

  async createContent(contentData: Partial<Content>) {
    console.log('Creating content with data:', contentData)
    
    try {
      // Validate required fields
      if (!contentData.creator_id) {
        throw new Error('Creator ID is required')
      }
      if (!contentData.title?.trim()) {
        throw new Error('Title is required')
      }
      if (!contentData.content_type) {
        throw new Error('Content type is required')
      }

      // Ensure content_data is valid JSON
      const processedData = {
        ...contentData,
        content_data: contentData.content_data || {},
        tags: contentData.tags || [],
        tier_required: contentData.tier_required || 'free',
        is_published: contentData.is_published !== false, // Default to true unless explicitly false
        view_count: 0,
        like_count: 0,
        comment_count: 0,
      }

      console.log('Processed content data for insert:', processedData)

      const { data, error } = await supabase
        .from('content')
        .insert([processedData])
        .select()
        .single()

      if (error) {
        console.error('Error creating content:', error)
        throw new Error(`Failed to create content: ${error.message}`)
      }

      console.log('Content created successfully:', data)
      return data
    } catch (error) {
      console.error('Error in createContent:', error)
      throw error
    }
  },

  async updateContent(id: string, updates: Partial<Content>) {
    console.log('Updating content:', id, updates)
    
    try {
      const { data, error } = await supabase
        .from('content')
        .update(updates)
        .eq('id', id)
        .select()
        .single()

      if (error) {
        console.error('Error updating content:', error)
        throw error
      }
      
      return data
    } catch (error) {
      console.error('Error in updateContent:', error)
      throw error
    }
  },

  async deleteContent(id: string) {
    console.log('Deleting content:', id)
    
    try {
      const { error } = await supabase
        .from('content')
        .delete()
        .eq('id', id)

      if (error) {
        console.error('Error deleting content:', error)
        throw error
      }
    } catch (error) {
      console.error('Error in deleteContent:', error)
      throw error
    }
  },

  // Function to publish scheduled content
  async publishScheduledContent() {
    console.log('Checking for scheduled content to publish...')
    
    try {
      const now = new Date().toISOString()
      
      const { data, error } = await supabase
        .from('content')
        .update({ 
          is_published: true,
          scheduled_publish_at: null 
        })
        .eq('is_published', false)
        .not('scheduled_publish_at', 'is', null)
        .lte('scheduled_publish_at', now)
        .select()

      if (error) {
        console.error('Error publishing scheduled content:', error)
        throw error
      }

      console.log('Published scheduled content:', data)
      return data || []
    } catch (error) {
      console.error('Error in publishScheduledContent:', error)
      return []
    }
  }
}

// Helper functions for subscriptions
export const subscriptionService = {
  async getCreatorTiers(creatorId: string) {
    try {
      const { data, error } = await supabase
        .from('subscription_tiers')
        .select('*')
        .eq('creator_id', creatorId)
        .eq('is_active', true)
        .order('price_monthly', { ascending: true })

      if (error) throw error
      return data || []
    } catch (error) {
      console.error('Error in getCreatorTiers:', error)
      return []
    }
  },

  async createSubscription(subscription: Partial<Subscription>) {
    try {
      const { data, error } = await supabase
        .from('subscriptions')
        .insert([subscription])
        .select()
        .single()

      if (error) throw error
      return data
    } catch (error) {
      console.error('Error in createSubscription:', error)
      throw error
    }
  },

  async getUserSubscriptions(userId: string) {
    try {
      const { data, error } = await supabase
        .from('subscriptions')
        .select(`
          *,
          subscription_tiers(*),
          creators(*, profiles(*))
        `)
        .eq('user_id', userId)
        .eq('status', 'active')

      if (error) throw error
      return data || []
    } catch (error) {
      console.error('Error in getUserSubscriptions:', error)
      return []
    }
  }
}

// Helper functions for live streaming
export const streamService = {
  async createStream(stream: Partial<LiveStream>) {
    try {
      const { data, error } = await supabase
        .from('live_streams')
        .insert([stream])
        .select()
        .single()

      if (error) throw error
      return data
    } catch (error) {
      console.error('Error in createStream:', error)
      throw error
    }
  },

  async updateStreamStatus(id: string, status: StreamStatus, additionalData?: Partial<LiveStream>) {
    try {
      const updates = { status, ...additionalData }
      
      if (status === 'live' && !additionalData?.actual_start) {
        updates.actual_start = new Date().toISOString()
      }
      
      if (status === 'ended' && !additionalData?.ended_at) {
        updates.ended_at = new Date().toISOString()
      }

      const { data, error } = await supabase
        .from('live_streams')
        .update(updates)
        .eq('id', id)
        .select()
        .single()

      if (error) throw error
      return data
    } catch (error) {
      console.error('Error in updateStreamStatus:', error)
      throw error
    }
  },

  async getUpcomingStreams(limit = 10) {
    try {
      const { data, error } = await supabase
        .from('live_streams')
        .select(`
          *,
          creators(*, profiles(*))
        `)
        .in('status', ['scheduled', 'live'])
        .order('scheduled_start', { ascending: true })
        .limit(limit)

      if (error) throw error
      return data || []
    } catch (error) {
      console.error('Error in getUpcomingStreams:', error)
      return []
    }
  }
}

// Auto-publish scheduled content every minute
if (typeof window !== 'undefined') {
  setInterval(() => {
    contentService.publishScheduledContent().catch(console.error)
  }, 60000) // Check every minute
}