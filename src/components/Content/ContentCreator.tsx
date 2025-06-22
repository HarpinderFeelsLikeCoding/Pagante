import React, { useState, useRef } from 'react'
import { Plus, Image, Video, Headphones, Radio, Download, BarChart, MessageCircle, BookOpen, FileText, AlertCircle, CheckCircle, Hash, Upload, X } from 'lucide-react'
import { contentService, type ContentType, type TierType } from '../../lib/supabase'
import { useAuth } from '../../contexts/AuthContext'

interface ContentCreatorProps {
  creatorId: string
  onContentCreated?: () => void
}

export function ContentCreator({ creatorId, onContentCreated }: ContentCreatorProps) {
  const { profile } = useAuth()
  const fileInputRef = useRef<HTMLInputElement>(null)
  const [isOpen, setIsOpen] = useState(false)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [success, setSuccess] = useState('')
  const [uploadingImage, setUploadingImage] = useState(false)
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

  // Placeholder images for different content types
  const getPlaceholderImage = (contentType: string) => {
    const placeholders = {
      image: 'https://images.pexels.com/photos/1591056/pexels-photo-1591056.jpeg?auto=compress&cs=tinysrgb&w=800',
      video: 'https://images.pexels.com/photos/1591061/pexels-photo-1591061.jpeg?auto=compress&cs=tinysrgb&w=800',
      audio: 'https://images.pexels.com/photos/1591062/pexels-photo-1591062.jpeg?auto=compress&cs=tinysrgb&w=800',
      article: 'https://images.pexels.com/photos/1591063/pexels-photo-1591063.jpeg?auto=compress&cs=tinysrgb&w=800',
      default: 'https://images.pexels.com/photos/1591064/pexels-photo-1591064.jpeg?auto=compress&cs=tinysrgb&w=800'
    }
    return placeholders[contentType as keyof typeof placeholders] || placeholders.default
  }

  const handleImageUpload = async (file: File) => {
    if (!file.type.startsWith('image/')) {
      setError('Please select a valid image file')
      return
    }

    if (file.size > 10 * 1024 * 1024) { // 10MB limit
      setError('Image file size must be less than 10MB')
      return
    }

    setUploadingImage(true)
    setError('')

    try {
      // Convert file to base64 for preview (in a real app, you'd upload to a service like Supabase Storage)
      const reader = new FileReader()
      reader.onload = (e) => {
        const imageUrl = e.target?.result as string
        setFormData({
          ...formData,
          content_data: { 
            ...formData.content_data, 
            image_url: imageUrl,
            file_name: file.name,
            file_size: file.size
          }
        })
        setUploadingImage(false)
      }
      reader.onerror = () => {
        setError('Failed to read image file')
        setUploadingImage(false)
      }
      reader.readAsDataURL(file)
    } catch (error) {
      console.error('Error uploading image:', error)
      setError('Failed to upload image')
      setUploadingImage(false)
    }
  }

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
          image_url: formData.content_data.image_url || getPlaceholderImage('image'),
          file_name: formData.content_data.file_name || 'image.jpg',
          file_size: formData.content_data.file_size || 0
        }
      case 'video':
        return {
          video_url: formData.content_data.video_url || '',
          thumbnail_url: formData.content_data.thumbnail_url || getPlaceholderImage('video'),
          duration: formData.content_data.duration || 0
        }
      case 'audio':
        return {
          audio_url: formData.content_data.audio_url || '',
          duration: formData.content_data.duration || 0,
          thumbnail_url: getPlaceholderImage('audio')
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
    const cleanTag = tagText.replace(/^#/, '').trim().toLowerCase()
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
                Upload Image
              </label>
              
              {/* Image Preview */}
              {formData.content_data.image_url && (
                <div className="relative mb-4">
                  <img
                    src={formData.content_data.image_url}
                    alt="Preview"
                    className="w-full h-48 object-cover rounded-lg border border-gray-300"
                  />
                  <button
                    type="button"
                    onClick={() => setFormData({
                      ...formData,
                      content_data: { ...formData.content_data, image_url: '', file_name: '', file_size: 0 }
                    })}
                    className="absolute top-2 right-2 bg-red-500 text-white rounded-full p-1 hover:bg-red-600 transition-colors"
                  >
                    <X className="w-4 h-4" />
                  </button>
                </div>
              )}

              {/* Upload Button */}
              <div className="flex items-center space-x-4">
                <button
                  type="button"
                  onClick={() => fileInputRef.current?.click()}
                  disabled={uploadingImage}
                  className="flex items-center space-x-2 bg-blue-50 text-blue-700 px-4 py-2 rounded-lg border border-blue-200 hover:bg-blue-100 transition-colors disabled:opacity-50"
                >
                  {uploadingImage ? (
                    <>
                      <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-blue-600"></div>
                      <span>Uploading...</span>
                    </>
                  ) : (
                    <>
                      <Upload className="w-4 h-4" />
                      <span>Choose Image</span>
                    </>
                  )}
                </button>
                
                <input
                  ref={fileInputRef}
                  type="file"
                  accept="image/*"
                  onChange={(e) => {
                    const file = e.target.files?.[0]
                    if (file) {
                      handleImageUpload(file)
                    }
                  }}
                  className="hidden"
                />
                
                <span className="text-sm text-gray-500">
                  or drag and drop (max 10MB)
                </span>
              </div>

              {/* Alternative URL input */}
              <div className="mt-4">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Or paste image URL
                </label>
                <input
                  type="url"
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="https://example.com/image.jpg"
                  value={formData.content_data.image_url?.startsWith('data:') ? '' : formData.content_data.image_url || ''}
                  onChange={(e) => setFormData({
                    ...formData,
                    content_data: { 
                      ...formData.content_data, 
                      image_url: e.target.value,
                      file_name: e.target.value.split('/').pop() || 'image.jpg'
                    }
                  })}
                  spellCheck="false"
                />
              </div>
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
              <div className="text-xs text-gray-500 mt-1">
                If not provided, a default thumbnail will be used
              </div>
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
          
          {/* Display current tags */}
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
          
          {/* Tag input */}
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
            disabled={loading || !formData.title.trim() || uploadingImage}
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