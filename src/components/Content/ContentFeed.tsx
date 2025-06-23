import React, { useEffect, useState } from 'react'
import { Heart, MessageCircle, Share2, Eye, Clock, Lock, Calendar, AlertCircle } from 'lucide-react'
import { contentService, type Content, type Profile } from '../../lib/supabase'
import { useAuth } from '../../contexts/AuthContext'
import { ContentPlayer } from './ContentPlayer'
import { format, formatDistanceToNow } from 'date-fns'

interface ContentFeedProps {
  creatorId?: string
  limit?: number
  showScheduled?: boolean
}

export function ContentFeed({ creatorId, limit = 20, showScheduled = false }: ContentFeedProps) {
  const { profile } = useAuth()
  const [content, setContent] = useState<(Content & { creator?: { profiles: Profile } })[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  useEffect(() => {
    loadContent()
    
    // Set up interval to check for scheduled posts
    const interval = setInterval(() => {
      loadContent()
    }, 60000) // Check every minute

    return () => clearInterval(interval)
  }, [creatorId, showScheduled])

  const loadContent = async () => {
    try {
      setLoading(true)
      setError('')
      
      console.log('Loading content feed...', { creatorId, showScheduled, limit })
      
      let data
      if (creatorId) {
        console.log('Loading content for creator:', creatorId)
        data = await contentService.getCreatorContent(creatorId, limit)
        console.log('Loaded creator content:', data)
        
        // If showScheduled is false, filter out unpublished content
        if (!showScheduled) {
          data = data.filter(post => post.is_published)
        }
      } else {
        // Load feed from all creators - try with creator info first, fallback to simple query
        console.log('Loading all published content...')
        try {
          data = await contentService.getDiscoverContent('recent', 'all', limit)
        } catch (err) {
          console.log('Failed to get content with creator info, trying simple query...')
          data = await contentService.getAllPublishedContent(limit)
        }
      }
      
      console.log('Final content data:', data)
      setContent(data)
    } catch (error: any) {
      console.error('Error loading content:', error)
      setError('Failed to load content: ' + error.message)
    } finally {
      setLoading(false)
    }
  }

  const getTierBadge = (tier: string) => {
    const badges = {
      free: { label: 'Free', color: 'bg-green-100 text-green-800' },
      supporter: { label: 'Supporter', color: 'bg-blue-100 text-blue-800' },
      premium: { label: 'Premium', color: 'bg-purple-100 text-purple-800' },
      vip: { label: 'VIP', color: 'bg-gold-100 text-gold-800' },
    }
    return badges[tier as keyof typeof badges] || badges.free
  }

  const getContentTypeIcon = (type: string) => {
    switch (type) {
      case 'video': return '🎥'
      case 'audio': return '🎵'
      case 'image': return '🖼️'
      case 'live_stream': return '📡'
      case 'poll': return '📊'
      case 'article': return '📝'
      case 'discussion': return '💬'
      case 'digital_download': return '📁'
      default: return '📄'
    }
  }

  const isScheduled = (post: Content) => {
    return !post.is_published && post.scheduled_publish_at && new Date(post.scheduled_publish_at) > new Date()
  }

  const getScheduledTime = (post: Content) => {
    if (!post.scheduled_publish_at) return null
    const scheduledDate = new Date(post.scheduled_publish_at)
    const now = new Date()
    
    if (scheduledDate > now) {
      return {
        relative: formatDistanceToNow(scheduledDate, { addSuffix: true }),
        absolute: format(scheduledDate, 'MMM d, yyyy h:mm a')
      }
    }
    return null
  }

  if (loading) {
    return (
      <div className="space-y-6">
        {[...Array(3)].map((_, i) => (
          <div key={i} className="bg-white rounded-xl shadow-lg p-6 animate-pulse">
            <div className="h-4 bg-gray-200 rounded w-3/4 mb-4"></div>
            <div className="h-32 bg-gray-200 rounded mb-4"></div>
            <div className="h-4 bg-gray-200 rounded w-1/2"></div>
          </div>
        ))}
      </div>
    )
  }

  if (error) {
    return (
      <div className="text-center py-12">
        <div className="text-red-500 text-lg mb-2">Error loading content</div>
        <div className="text-gray-400 mb-4">{error}</div>
        <button
          onClick={loadContent}
          className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors"
        >
          Try Again
        </button>
      </div>
    )
  }

  if (content.length === 0) {
    return (
      <div className="text-center py-12">
        <div className="text-gray-500 text-lg mb-2">No content available</div>
        <div className="text-gray-400">
          {creatorId ? 'This creator hasn\'t posted any content yet.' : 'Check back later for new posts!'}
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {content.map((post) => {
        const tierBadge = getTierBadge(post.tier_required)
        const contentIcon = getContentTypeIcon(post.content_type)
        const scheduled = isScheduled(post)
        const scheduledTime = getScheduledTime(post)
        
        return (
          <article 
            key={post.id} 
            className={`bg-white rounded-xl shadow-lg overflow-hidden hover:shadow-xl transition-shadow duration-300 border ${
              scheduled ? 'border-orange-200 bg-orange-50' : 'border-gray-200'
            }`}
          >
            {/* Scheduled Post Banner */}
            {scheduled && scheduledTime && (
              <div className="bg-orange-100 border-b border-orange-200 px-6 py-3">
                <div className="flex items-center space-x-2 text-orange-800">
                  <Calendar className="w-4 h-4" />
                  <span className="text-sm font-medium">
                    Scheduled to publish {scheduledTime.relative}
                  </span>
                  <span className="text-xs text-orange-600">
                    ({scheduledTime.absolute})
                  </span>
                </div>
              </div>
            )}

            <div className="p-6">
              <div className="flex items-start justify-between mb-4">
                <div className="flex items-center space-x-3">
                  <div className="text-2xl">{contentIcon}</div>
                  <div>
                    <h3 className="text-xl font-bold text-gray-900">{post.title}</h3>
                    <div className="flex items-center space-x-2 mt-1">
                      <span className={`px-2 py-1 rounded-full text-xs font-medium ${tierBadge.color}`}>
                        {post.tier_required === 'free' ? (
                          'Free'
                        ) : (
                          <>
                            <Lock className="w-3 h-3 inline mr-1" />
                            {tierBadge.label}
                          </>
                        )}
                      </span>
                      <span className="text-gray-500 text-sm">
                        {scheduled ? 'Draft' : format(new Date(post.created_at), 'MMM d, yyyy')}
                      </span>
                      {scheduled && (
                        <span className="flex items-center space-x-1 text-orange-600 text-xs">
                          <Clock className="w-3 h-3" />
                          <span>Scheduled</span>
                        </span>
                      )}
                    </div>
                  </div>
                </div>
                
                <div className="flex items-center space-x-2 text-gray-500 text-sm">
                  <Eye className="w-4 h-4" />
                  <span>{post.view_count}</span>
                </div>
              </div>

              {post.description && (
                <p className="text-gray-600 mb-4">{post.description}</p>
              )}

              {/* Only show content if published or if we're showing scheduled content */}
              {(post.is_published || showScheduled) && (
                <ContentPlayer content={post} />
              )}

              {/* Show preview message for scheduled content */}
              {scheduled && !showScheduled && (
                <div className="bg-gray-100 rounded-lg p-4 text-center">
                  <AlertCircle className="w-8 h-8 text-gray-400 mx-auto mb-2" />
                  <div className="text-gray-600">
                    This content is scheduled and will be published {scheduledTime?.relative}
                  </div>
                </div>
              )}

              {post.tags && post.tags.length > 0 && (
                <div className="flex flex-wrap gap-2 mt-4">
                  {post.tags.map((tag, index) => (
                    <span
                      key={index}
                      className="bg-blue-50 text-blue-700 px-3 py-1 rounded-full text-sm font-medium hover:bg-blue-100 transition-colors cursor-pointer"
                    >
                      #{tag}
                    </span>
                  ))}
                </div>
              )}

              <div className="flex items-center justify-between mt-6 pt-4 border-t border-gray-100">
                <div className="flex items-center space-x-6">
                  <button className="flex items-center space-x-2 text-gray-600 hover:text-red-500 transition-colors group">
                    <Heart className="w-5 h-5 group-hover:scale-110 transition-transform" />
                    <span>{post.like_count}</span>
                  </button>
                  
                  <button className="flex items-center space-x-2 text-gray-600 hover:text-blue-500 transition-colors group">
                    <MessageCircle className="w-5 h-5 group-hover:scale-110 transition-transform" />
                    <span>{post.comment_count}</span>
                  </button>
                  
                  <button className="flex items-center space-x-2 text-gray-600 hover:text-green-500 transition-colors group">
                    <Share2 className="w-5 h-5 group-hover:scale-110 transition-transform" />
                    <span>Share</span>
                  </button>
                </div>

                {scheduled && (
                  <div className="flex items-center space-x-1 text-orange-600 text-sm font-medium">
                    <Clock className="w-4 h-4" />
                    <span>Scheduled</span>
                  </div>
                )}
              </div>
            </div>
          </article>
        )
      })}
    </div>
  )
}