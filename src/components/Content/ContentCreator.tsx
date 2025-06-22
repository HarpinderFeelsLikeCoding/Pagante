import React, { useState } from 'react'
import { Plus, Image, Video, Headphones, Radio, Download, BarChart, MessageCircle, BookOpen, FileText, AlertCircle, CheckCircle } from 'lucide-react'
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
    tags: '',
    scheduled_publish_at: '',
  })

  const contentTypes = [
    { type: 'text_post', label: 'Text Post', icon: FileText },
    { type: 'image', label: 'Image', icon: Image },
    { type: 'video', label: 'Video', icon: Video },
    { type: 'audio', label: 'Audio', icon: Headphones },
    { type: 'live_stream', label: 'Live Stream', icon: Radio },
    { type: 'digital_download', label: 'Digital Download', icon: Download },
    { type: 'poll', label: 'Poll', icon: BarChart },
    { type: 'discussion', label: 'Discussion', icon: MessageCircle },
    { type: 'article', label: 'Article', icon: BookOpen },
  ]

  const tierOptions = [
    { value: 'free', label: 'Free', color: 'bg-green-100 text-green-800' },
    { value: 'supporter', label: 'Supporter', color: 'bg-blue-100 text-blue-800' },
    { value: 'premium', label: 'Premium', color: 'bg-purple-100 text-purple-800' },
    { value: 'vip', label: 'VIP', color: 'bg-gold-100 text-gold-800' },
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
      console.log('Creating content with data:', formData)

      // Parse hashtags from the tags string
      const parsedTags = formData.tags
        .split(/[\s,]+/)
        .map(tag => tag.replace(/^#/, '').trim())
        .filter(tag => tag.length > 0)

      const contentData = {
        creator_id: creatorId,
        title: formData.title.trim(),
        description: formData.description.trim(),
        content_type: formData.content_type,
        content_data: getContentData(),
        tier_required: formData.tier_required,
        tags: parsedTags,
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
        tags: '',
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
              rows={6}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-vertical"
              placeholder="Write your content here..."
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
                placeholder="https://example.com/video.mp4"
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
                Thumbnail URL
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
      <button
        onClick={() => setIsOpen(true)}
        className="w-full bg-gradient-to-r from-blue-600 to-indigo-600 text-white px-6 py-3 rounded-lg font-medium hover:from-blue-700 hover:to-indigo-700 transition-all duration-300 flex items-center justify-center space-x-2 shadow-lg hover:shadow-xl"
      >
        <Plus className="w-5 h-5" />
        <span>Create New Content</span>
      </button>
    )
  }

  return (
    <div className="bg-white rounded-xl shadow-lg p-6 border border-gray-200">
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-xl font-bold text-gray-900">Create New Content</h3>
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
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Content Type
          </label>
          <div className="grid grid-cols-3 gap-3">
            {contentTypes.map((type) => {
              const IconComponent = type.icon
              return (
                <button
                  key={type.type}
                  type="button"
                  onClick={() => setFormData({ ...formData, content_type: type.type as ContentType })}
                  className={`p-3 rounded-lg border-2 transition-colors ${
                    formData.content_type === type.type
                      ? 'border-blue-500 bg-blue-50'
                      : 'border-gray-200 hover:border-gray-300'
                  }`}
                >
                  <IconComponent className="w-6 h-6 mx-auto mb-1" />
                  <div className="text-xs font-medium">{type.label}</div>
                </button>
              )
            })}
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Title
          </label>
          <input
            type="text"
            required
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            placeholder="Enter content title..."
            value={formData.title}
            onChange={(e) => setFormData({ ...formData, title: e.target.value })}
            spellCheck="true"
            autoCorrect="on"
            autoCapitalize="words"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Description
          </label>
          <textarea
            rows={3}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            placeholder="Brief description..."
            value={formData.description}
            onChange={(e) => setFormData({ ...formData, description: e.target.value })}
            spellCheck="true"
            autoCorrect="on"
            autoCapitalize="sentences"
          />
        </div>

        {renderContentFields()}

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Access Tier Required
          </label>
          <div className="grid grid-cols-2 gap-3">
            {tierOptions.map((tier) => (
              <button
                key={tier.value}
                type="button"
                onClick={() => setFormData({ ...formData, tier_required: tier.value as TierType })}
                className={`p-3 rounded-lg border-2 transition-colors ${
                  formData.tier_required === tier.value
                    ? 'border-blue-500 bg-blue-50'
                    : 'border-gray-200 hover:border-gray-300'
                }`}
              >
                <div className={`inline-block px-2 py-1 rounded-full text-xs font-medium ${tier.color}`}>
                  {tier.label}
                </div>
              </button>
            ))}
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Tags
          </label>
          <input
            type="text"
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            placeholder="#tag1 #tag2 #tag3 or tag1, tag2, tag3"
            value={formData.tags}
            onChange={(e) => setFormData({ ...formData, tags: e.target.value })}
            spellCheck="false"
            autoCorrect="off"
          />
          <div className="text-xs text-gray-500 mt-1">
            Use hashtags (#tag) or separate with commas
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Schedule Publication (optional)
          </label>
          <input
            type="datetime-local"
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            value={formData.scheduled_publish_at}
            onChange={(e) => setFormData({ ...formData, scheduled_publish_at: e.target.value })}
          />
        </div>

        <div className="flex space-x-4">
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
                <span>Creating...</span>
              </div>
            ) : (
              'Create Content'
            )}
          </button>
        </div>
      </form>
    </div>
  )
}