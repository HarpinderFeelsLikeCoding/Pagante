import React, { useState } from 'react'
import { Plus, Image, Video, Headphones, Radio, Download, BarChart, MessageCircle, BookOpen, FileText } from 'lucide-react'
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
    if (!profile) return

    setLoading(true)
    try {
      await contentService.createContent({
        ...formData,
        creator_id: creatorId,
        is_published: !formData.scheduled_publish_at,
        content_data: getContentData(),
      })

      setFormData({
        title: '',
        description: '',
        content_type: 'text_post',
        content_data: {},
        tier_required: 'free',
        tags: [],
        scheduled_publish_at: '',
      })
      setIsOpen(false)
      onContentCreated?.()
    } catch (error) {
      console.error('Error creating content:', error)
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
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              placeholder="Write your content here..."
              value={formData.content_data.text || ''}
              onChange={(e) => setFormData({
                ...formData,
                content_data: { ...formData.content_data, text: e.target.value }
              })}
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
              />
            </div>
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
            />
          </div>
        )
    }
  }

  if (!isOpen) {
    return (
      <button
        onClick={() => setIsOpen(true)}
        className="w-full bg-gradient-to-r from-blue-600 to-indigo-600 text-white px-6 py-3 rounded-lg font-medium hover:from-blue-700 hover:to-indigo-700 transition-all duration-300 flex items-center justify-center space-x-2"
      >
        <Plus className="w-5 h-5" />
        <span>Create New Content</span>
      </button>
    )
  }

  return (
    <div className="bg-white rounded-xl shadow-lg p-6">
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-xl font-bold text-gray-900">Create New Content</h3>
        <button
          onClick={() => setIsOpen(false)}
          className="text-gray-500 hover:text-gray-700"
        >
          ×
        </button>
      </div>

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
            Tags (comma separated)
          </label>
          <input
            type="text"
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            placeholder="tag1, tag2, tag3"
            value={formData.tags.join(', ')}
            onChange={(e) => setFormData({
              ...formData,
              tags: e.target.value.split(',').map(tag => tag.trim()).filter(Boolean)
            })}
          />
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
            onClick={() => setIsOpen(false)}
            className="flex-1 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
          >
            Cancel
          </button>
          <button
            type="submit"
            disabled={loading}
            className="flex-1 bg-gradient-to-r from-blue-600 to-indigo-600 text-white px-4 py-2 rounded-lg font-medium hover:from-blue-700 hover:to-indigo-700 transition-all duration-300 disabled:opacity-50"
          >
            {loading ? 'Creating...' : 'Create Content'}
          </button>
        </div>
      </form>
    </div>
  )
}