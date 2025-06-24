import React, { useState } from 'react'
import { Plus, Image, Video, Headphones, Radio, Download, BarChart, MessageCircle, BookOpen, FileText, AlertCircle, CheckCircle, Hash, Calendar, Lock, Eye, Users } from 'lucide-react'
import { contentService, type ContentType, type TierType } from '../../lib/supabase'
import { useAuth } from '../../contexts/AuthContext'

interface ContentCreatorProps {
  creatorId: string
  onContentCreated?: () => void
}

export function ContentCreator({ creatorId, onContentCreated }: ContentCreatorProps) {
  const { profile } = useAuth()
  const [isOpen, setIsOpen] = useState(false)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [success, setSuccess] = useState('')
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    content_type: 'text_post' as ContentType,
    content_data: {},
    tier_required: 'free' as TierType,
    tags: [] as string[],
    scheduled_publish_at: '',
  })

  const contentTypes = [
    { type: 'text_post', label: 'Text Post', icon: FileText, description: 'Share thoughts and updates' },
    { type: 'image', label: 'Image', icon: Image, description: 'Photos and artwork' },
    { type: 'video', label: 'Video', icon: Video, description: 'Video content' },
    { type: 'audio', label: 'Audio', icon: Headphones, description: 'Podcasts and music' },
    { type: 'live_stream', label: 'Live Stream', icon: Radio, description: 'Real-time streaming' },
    { type: 'digital_download', label: 'Download', icon: Download, description: 'Files and resources' },
    { type: 'poll', label: 'Poll', icon: BarChart, description: 'Community polls' },
    { type: 'discussion', label: 'Discussion', icon: MessageCircle, description: 'Start conversations' },
    { type: 'article', label: 'Article', icon: BookOpen, description: 'Long-form content' },
  ]

  const tierOptions = [
    { value: 'free', label: 'Free', color: 'bg-green-100 text-green-800', description: 'Available to everyone' },
    { value: 'supporter', label: 'Supporter', color: 'bg-blue-100 text-blue-800', description: '$5+ patrons' },
    { value: 'premium', label: 'Premium', color: 'bg-purple-100 text-purple-800', description: '$15+ patrons' },
    { value: 'vip', label: 'VIP', color: 'bg-gold-100 text-gold-800', description: '$50+ patrons' },
  ]

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!profile) {
      setError('You must be logged in to create content')
      return
    }

    setLoading(true)
    setError('')
    setSuccess('')

    try {
      console.log('Creating content with form data:', formData)

      const contentData = {
        creator_id: creatorId,
        title: formData.title.trim(),
        description: formData.description.trim(),
        content_type: formData.content_type,
        content_data: getContentData(),
        tier_required: formData.tier_required,
        tags: formData.tags,
        is_published: !formData.scheduled_publish_at,
        scheduled_publish_at: formData.scheduled_publish_at || null,
      }

      console.log('Processed content data:', contentData)

      const result = await contentService.createContent(contentData)
      console.log('Content created successfully:', result)

      setSuccess('Content created successfully!')
      
      // Reset form
      setFormData({
        title: '',
        description: '',
        content_type: 'text_post',
        content_data: {},
        tier_required: 'free',
        tags: [],
        scheduled_publish_at: '',
      })
      
      // Close form after a delay
      setTimeout(() => {
        setIsOpen(false)
        setSuccess('')
        onContentCreated?.()
      }, 2000)

    } catch (error: any) {
      console.error('Error creating content:', error)
      setError(error.message || 'Failed to create content. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  const getContentData = () => {
    switch (formData.content_type) {
      case 'text_post':
      case 'article':
        return { text: formData.content_data.text || '' }
      case 'image':
        return { 
          image_url: formData.content_data.image_url || '',
          alt_text: formData.content_data.alt_text || ''
        }
      case 'video':
        return {
          video_url: formData.content_data.video_url || '',
          thumbnail_url: formData.content_data.thumbnail_url || '',
          duration: formData.content_data.duration || 0
        }
      case 'audio':
        return {
          audio_url: formData.content_data.audio_url || '',
          duration: formData.content_data.duration || 0
        }
      case 'poll':
        return {
          question: formData.content_data.question || '',
          options: formData.content_data.options || [],
          multiple_choice: formData.content_data.multiple_choice || false
        }
      case 'discussion':
        return {
          discussion_prompt: formData.content_data.discussion_prompt || ''
        }
      default:
        return formData.content_data
    }
  }

  const addTag = (tagText: string) => {
    const cleanTag = tagText.replace(/^#/, '').trim()
    if (cleanTag && !formData.tags.includes(cleanTag)) {
      setFormData({
        ...formData,
        tags: [...formData.tags, cleanTag]
      })
    }
  }

  const removeTag = (index: number) => {
    setFormData({
      ...formData,
      tags: formData.tags.filter((_, i) => i !== index)
    })
  }

  const handleTagInput = (e: React.KeyboardEvent<HTMLInputElement>) => {
    const input = e.currentTarget
    const value = input.value.trim()
    
    if ((e.key === 'Enter' || e.key === ',' || e.key === ' ') && value) {
      e.preventDefault()
      addTag(value)
      input.value = ''
    }
  }

  const renderContentFields = () => {
    switch (formData.content_type) {
      case 'text_post':
      case 'article':
        return (
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Content
            </label>
            <textarea
              rows={formData.content_type === 'article' ? 10 : 6}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-vertical"
              placeholder={formData.content_type === 'article' ? 'Write your article here...' : 'What\'s on your mind?'}
              value={formData.content_data.text || ''}
              onChange={(e) => setFormData({
                ...formData,
                content_data: { ...formData.content_data, text: e.target.value }
              })}
              spellCheck="true"
              autoCorrect="on"
              autoCapitalize="sentences"
            />
          </div>
        )
      
      case 'image':
        return (
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Image URL
              </label>
              <input
                type="url"
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="https://example.com/image.jpg"
                value={formData.content_data.image_url || ''}
                onChange={(e) => setFormData({
                  ...formData,
                  content_data: { ...formData.content_data, image_url: e.target.value }
                })}
                spellCheck="false"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Alt Text
              </label>
              <input
                type="text"
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="Describe the image..."
                value={formData.content_data.alt_text || ''}
                onChange={(e) => setFormData({
                  ...formData,
                  content_data: { ...formData.content_data, alt_text: e.target.value }
                })}
                spellCheck="true"
                autoCorrect="on"
                autoCapitalize="sentences"
              />
            </div>
          </div>
        )

      case 'video':
        return (
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Video URL
              </label>
              <input
                type="url"
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="https://example.com/video.mp4 or YouTube/Vimeo URL"
                value={formData.content_data.video_url || ''}
                onChange={(e) => setFormData({
                  ...formData,
                  content_data: { ...formData.content_data, video_url: e.target.value }
                })}
                spellCheck="false"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Thumbnail URL (optional)
              </label>
              <input
                type="url"
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="https://example.com/thumbnail.jpg"
                value={formData.content_data.thumbnail_url || ''}
                onChange={(e) => setFormData({
                  ...formData,
                  content_data: { ...formData.content_data, thumbnail_url: e.target.value }
                })}
                spellCheck="false"
              />
            </div>
          </div>
        )

      case 'poll':
        return (
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Poll Question
              </label>
              <input
                type="text"
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="What's your question?"
                value={formData.content_data.question || ''}
                onChange={(e) => setFormData({
                  ...formData,
                  content_data: { ...formData.content_data, question: e.target.value }
                })}
                spellCheck="true"
                autoCorrect="on"
                autoCapitalize="sentences"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Options (one per line)
              </label>
              <textarea
                rows={4}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="Option 1&#10;Option 2&#10;Option 3"
                value={(formData.content_data.options || []).join('\n')}
                onChange={(e) => setFormData({
                  ...formData,
                  content_data: { 
                    ...formData.content_data, 
                    options: e.target.value.split('\n').filter(opt => opt.trim())
                  }
                })}
                spellCheck="true"
                autoCorrect="on"
                autoCapitalize="sentences"
              />
            </div>
          </div>
        )

      case 'discussion':
        return (
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Discussion Prompt
            </label>
            <textarea
              rows={4}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              placeholder="What would you like to discuss with your community?"
              value={formData.content_data.discussion_prompt || ''}
              onChange={(e) => setFormData({
                ...formData,
                content_data: { ...formData.content_data, discussion_prompt: e.target.value }
              })}
              spellCheck="true"
              autoCorrect="on"
              autoCapitalize="sentences"
            />
          </div>
        )

      default:
        return (
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Content Details
            </label>
            <textarea
              rows={4}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              placeholder="Add content details..."
              value={JSON.stringify(formData.content_data, null, 2)}
              onChange={(e) => {
                try {
                  const parsed = JSON.parse(e.target.value)
                  setFormData({ ...formData, content_data: parsed })
                } catch {
                  // Invalid JSON, ignore
                }
              }}
              spellCheck="false"
            />
          </div>
        )
    }
  }

  if (!isOpen) {
    return (
      <div className="space-y-4">
        {/* Quick Post Options */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
          {contentTypes.slice(0, 4).map((type) => {
            const IconComponent = type.icon
            return (
              <button
                key={type.type}
                onClick={() => {
                  setFormData({ ...formData, content_type: type.type as ContentType })
                  setIsOpen(true)
                }}
                className="p-4 border-2 border-dashed border-gray-300 rounded-lg hover:border-blue-500 hover:bg-blue-50 transition-all duration-200 group"
              >
                <IconComponent className="w-6 h-6 text-gray-400 group-hover:text-blue-600 mx-auto mb-2" />
                <div className="text-sm font-medium text-gray-700 group-hover:text-blue-700">{type.label}</div>
              </button>
            )
          })}
        </div>
        
        <button
          onClick={() => setIsOpen(true)}
          className="w-full bg-gradient-to-r from-blue-600 to-indigo-600 text-white px-6 py-4 rounded-lg font-medium hover:from-blue-700 hover:to-indigo-700 transition-all duration-300 flex items-center justify-center space-x-2 shadow-lg hover:shadow-xl"
        >
          <Plus className="w-5 h-5" />
          <span>Create New Post</span>
        </button>
      </div>
    )
  }

  return (
    <div className="bg-white rounded-xl shadow-lg border border-gray-200">
      <div className="flex items-center justify-between p-6 border-b border-gray-200">
        <h3 className="text-xl font-bold text-gray-900">Create New Post</h3>
        <button
          onClick={() => {
            setIsOpen(false)
            setError('')
            setSuccess('')
          }}
          className="text-gray-500 hover:text-gray-700 text-2xl font-bold"
        >
          ×
        </button>
      </div>

      <div className="p-6">
        {error && (
          <div className="mb-4 bg-red-50 border border-red-200 rounded-lg p-4 flex items-center space-x-2">
            <AlertCircle className="w-5 h-5 text-red-500 flex-shrink-0" />
            <span className="text-red-700 text-sm">{error}</span>
          </div>
        )}

        {success && (
          <div className="mb-4 bg-green-50 border border-green-200 rounded-lg p-4 flex items-center space-x-2">
            <CheckCircle className="w-5 h-5 text-green-500 flex-shrink-0" />
            <span className="text-green-700 text-sm">{success}</span>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Content Type Selection */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-3">
              Post Type
            </label>
            <div className="grid grid-cols-3 gap-3">
              {contentTypes.map((type) => {
                const IconComponent = type.icon
                return (
                  <button
                    key={type.type}
                    type="button"
                    onClick={() => setFormData({ ...formData, content_type: type.type as ContentType })}
                    className={`p-3 rounded-lg border-2 transition-all duration-200 ${
                      formData.content_type === type.type
                        ? 'border-blue-500 bg-blue-50 text-blue-700'
                        : 'border-gray-200 hover:border-gray-300 text-gray-600'
                    }`}
                  >
                    <IconComponent className="w-5 h-5 mx-auto mb-1" />
                    <div className="text-xs font-medium">{type.label}</div>
                  </button>
                )
              })}
            </div>
          </div>

          {/* Title */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Title
            </label>
            <input
              type="text"
              required
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              placeholder="Give your post a catchy title..."
              value={formData.title}
              onChange={(e) => setFormData({ ...formData, title: e.target.value })}
              spellCheck="true"
              autoCorrect="on"
              autoCapitalize="words"
            />
          </div>

          {/* Description */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Description
            </label>
            <textarea
              rows={2}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              placeholder="Brief description or teaser..."
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              spellCheck="true"
              autoCorrect="on"
              autoCapitalize="sentences"
            />
          </div>

          {/* Content Fields */}
          {renderContentFields()}

          {/* Access Tier */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-3">
              Who can see this post?
            </label>
            <div className="grid grid-cols-2 gap-3">
              {tierOptions.map((tier) => (
                <button
                  key={tier.value}
                  type="button"
                  onClick={() => setFormData({ ...formData, tier_required: tier.value as TierType })}
                  className={`p-4 rounded-lg border-2 transition-all duration-200 text-left ${
                    formData.tier_required === tier.value
                      ? 'border-blue-500 bg-blue-50'
                      : 'border-gray-200 hover:border-gray-300'
                  }`}
                >
                  <div className="flex items-center justify-between mb-2">
                    <div className={`inline-block px-2 py-1 rounded-full text-xs font-medium ${tier.color}`}>
                      {tier.value === 'free' ? (
                        <div className="flex items-center space-x-1">
                          <Eye className="w-3 h-3" />
                          <span>{tier.label}</span>
                        </div>
                      ) : (
                        <div className="flex items-center space-x-1">
                          <Lock className="w-3 h-3" />
                          <span>{tier.label}</span>
                        </div>
                      )}
                    </div>
                  </div>
                  <div className="text-xs text-gray-600">{tier.description}</div>
                </button>
              ))}
            </div>
          </div>

          {/* Tags */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Tags
            </label>
            
            {formData.tags.length > 0 && (
              <div className="flex flex-wrap gap-2 mb-3">
                {formData.tags.map((tag, index) => (
                  <span
                    key={index}
                    className="inline-flex items-center bg-blue-100 text-blue-800 px-3 py-1 rounded-full text-sm"
                  >
                    <Hash className="w-3 h-3 mr-1" />
                    {tag}
                    <button
                      type="button"
                      onClick={() => removeTag(index)}
                      className="ml-2 text-blue-600 hover:text-blue-800"
                    >
                      ×
                    </button>
                  </span>
                ))}
              </div>
            )}
            
            <input
              type="text"
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              placeholder="Type a tag and press Enter, Space, or Comma"
              onKeyDown={handleTagInput}
              spellCheck="false"
              autoCorrect="off"
            />
            <div className="text-xs text-gray-500 mt-1">
              Press Enter, Space, or Comma to add tags. Use # or just type the tag name.
            </div>
          </div>

          {/* Schedule */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              <Calendar className="w-4 h-4 inline mr-1" />
              Schedule Publication (optional)
            </label>
            <input
              type="datetime-local"
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              value={formData.scheduled_publish_at}
              onChange={(e) => setFormData({ ...formData, scheduled_publish_at: e.target.value })}
            />
            {formData.scheduled_publish_at && (
              <div className="text-xs text-gray-500 mt-1">
                This post will be published automatically at the scheduled time.
              </div>
            )}
          </div>

          {/* Actions */}
          <div className="flex space-x-4 pt-4 border-t border-gray-200">
            <button
              type="button"
              onClick={() => {
                setIsOpen(false)
                setError('')
                setSuccess('')
              }}
              className="flex-1 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
              disabled={loading}
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={loading || !formData.title.trim()}
              className="flex-1 bg-gradient-to-r from-blue-600 to-indigo-600 text-white px-4 py-2 rounded-lg font-medium hover:from-blue-700 hover:to-indigo-700 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? (
                <div className="flex items-center justify-center space-x-2">
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                  <span>Publishing...</span>
                </div>
              ) : formData.scheduled_publish_at ? (
                'Schedule Post'
              ) : (
                'Publish Post'
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}