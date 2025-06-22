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
    autoRefreshToken: true,
    persistSession: true,
    detectSessionInUrl: true
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
    
    const { data, error } = await supabase
      .from('content')
      .select('*')
      .eq('creator_id', creatorId)
      .eq('is_published', true)
      .order('created_at', { ascending: false })
      .limit(limit)

    if (error) {
      console.error('Error fetching creator content:', error)
      throw error
    }
    
    console.log('Fetched content:', data)
    return data || []
  },

  async createContent(contentData: Partial<Content>) {
    console.log('Creating content with data:', contentData)
    
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
  },

  async updateContent(id: string, updates: Partial<Content>) {
    console.log('Updating content:', id, updates)
    
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
  },

  async deleteContent(id: string) {
    console.log('Deleting content:', id)
    
    const { error } = await supabase
      .from('content')
      .delete()
      .eq('id', id)

    if (error) {
      console.error('Error deleting content:', error)
      throw error
    }
  }
}

// Helper functions for subscriptions
export const subscriptionService = {
  async getCreatorTiers(creatorId: string) {
    const { data, error } = await supabase
      .from('subscription_tiers')
      .select('*')
      .eq('creator_id', creatorId)
      .eq('is_active', true)
      .order('price_monthly', { ascending: true })

    if (error) throw error
    return data
  },

  async createSubscription(subscription: Partial<Subscription>) {
    const { data, error } = await supabase
      .from('subscriptions')
      .insert([subscription])
      .select()
      .single()

    if (error) throw error
    return data
  },

  async getUserSubscriptions(userId: string) {
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
    return data
  }
}

// Helper functions for live streaming
export const streamService = {
  async createStream(stream: Partial<LiveStream>) {
    const { data, error } = await supabase
      .from('live_streams')
      .insert([stream])
      .select()
      .single()

    if (error) throw error
    return data
  },

  async updateStreamStatus(id: string, status: StreamStatus, additionalData?: Partial<LiveStream>) {
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
  },

  async getUpcomingStreams(limit = 10) {
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
    return data
  }
}