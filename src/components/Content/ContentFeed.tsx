import React, { useEffect, useState } from 'react'
import { Heart, MessageCircle, Share2, Eye, Clock, Lock } from 'lucide-react'
import { contentService, type Content, type Profile } from '../../lib/supabase'
import { useAuth } from '../../contexts/AuthContext'
import { ContentPlayer } from './ContentPlayer'
import { format } from 'date-fns'

interface ContentFeedProps {
  creatorId?: string
  limit?: number
}

export function ContentFeed({ creatorId, limit = 20 }: ContentFeedProps) {
  const { profile } = useAuth()
  const [content, setContent] = useState<(Content & { creator?: { profiles: Profile } })[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  useEffect(() => {
    loadContent()
  }, [creatorId])

  const loadContent = async () => {
    try {
      setLoading(true)
      setError('')
      
      let data
      if (creatorId) {
        console.log('Loading content for creator:', creatorId)
        data = await contentService.getCreatorContent(creatorId, limit)
        console.log('Loaded content:', data)
      } else {
        // Load feed from all creators (would need to implement this)
        data = []
      }
      setContent(data)
    } catch (error: any) {
      console.error('Error loading content:', error)
      setError('Failed to load content')
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
        
        return (
          <article key={post.id} className="bg-white rounded-xl shadow-lg overflow-hidden hover:shadow-xl transition-shadow duration-300 border border-gray-200">
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
                        {format(new Date(post.created_at), 'MMM d, yyyy')}
                      </span>
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

              <ContentPlayer content={post} />

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

                {post.scheduled_publish_at && new Date(post.scheduled_publish_at) > new Date() && (
                  <div className="flex items-center space-x-1 text-orange-600 text-sm">
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