import React from 'react'
import ReactPlayer from 'react-player'
import { Play, Download, BarChart, FileText, ExternalLink } from 'lucide-react'
import { type Content } from '../../lib/supabase'

interface ContentPlayerProps {
  content: Content
}

export function ContentPlayer({ content }: ContentPlayerProps) {
  const formatFileSize = (bytes: number) => {
    if (bytes === 0) return '0 Bytes'
    const k = 1024
    const sizes = ['Bytes', 'KB', 'MB', 'GB']
    const i = Math.floor(Math.log(bytes) / Math.log(k))
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i]
  }

  const renderContent = () => {
    switch (content.content_type) {
      case 'text_post':
      case 'article':
        return (
          <div className="prose max-w-none">
            <div className="whitespace-pre-wrap text-gray-800 leading-relaxed">
              {content.content_data.text}
            </div>
          </div>
        )

      case 'image':
        return (
          <div className="relative">
            <img
              src={content.content_data.image_url}
              alt={content.content_data.alt_text || content.title}
              className="w-full rounded-lg object-cover max-h-96"
              onError={(e) => {
                console.error('Image failed to load:', content.content_data.image_url)
                e.currentTarget.style.display = 'none'
              }}
            />
            {content.content_data.file_name && (
              <div className="mt-2 text-sm text-gray-500">
                {content.content_data.file_name}
                {content.content_data.file_size && (
                  <span> • {formatFileSize(content.content_data.file_size)}</span>
                )}
              </div>
            )}
          </div>
        )

      case 'video':
        return (
          <div className="relative bg-black rounded-lg overflow-hidden">
            {content.content_data.video_url.includes('youtube.com') || 
             content.content_data.video_url.includes('youtu.be') ||
             content.content_data.video_url.includes('vimeo.com') ? (
              <ReactPlayer
                url={content.content_data.video_url}
                width="100%"
                height="400px"
                controls
                light={content.content_data.thumbnail_url}
                playIcon={
                  <div className="flex items-center justify-center w-16 h-16 bg-blue-600 rounded-full">
                    <Play className="w-8 h-8 text-white ml-1" />
                  </div>
                }
              />
            ) : (
              <video
                src={content.content_data.video_url}
                controls
                className="w-full max-h-96 rounded-lg"
                poster={content.content_data.thumbnail_url}
                onError={(e) => {
                  console.error('Video failed to load:', content.content_data.video_url)
                }}
              >
                Your browser does not support the video tag.
              </video>
            )}
            {content.content_data.file_name && (
              <div className="mt-2 text-sm text-gray-300">
                {content.content_data.file_name}
                {content.content_data.file_size && (
                  <span> • {formatFileSize(content.content_data.file_size)}</span>
                )}
                {content.content_data.duration && (
                  <span> • {Math.floor(content.content_data.duration / 60)}:{(content.content_data.duration % 60).toString().padStart(2, '0')}</span>
                )}
              </div>
            )}
          </div>
        )

      case 'audio':
        return (
          <div className="bg-gray-50 rounded-lg p-6">
            <div className="flex items-center space-x-4 mb-4">
              <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center">
                <Play className="w-6 h-6 text-blue-600" />
              </div>
              <div>
                <div className="font-medium text-gray-900">
                  {content.content_data.file_name || 'Audio File'}
                </div>
                {content.content_data.file_size && (
                  <div className="text-sm text-gray-500">
                    {formatFileSize(content.content_data.file_size)}
                    {content.content_data.duration && (
                      <span> • {Math.floor(content.content_data.duration / 60)}:{(content.content_data.duration % 60).toString().padStart(2, '0')}</span>
                    )}
                  </div>
                )}
              </div>
            </div>
            <audio
              src={content.content_data.audio_url}
              controls
              className="w-full"
              onError={(e) => {
                console.error('Audio failed to load:', content.content_data.audio_url)
              }}
            >
              Your browser does not support the audio element.
            </audio>
          </div>
        )

      case 'live_stream':
        return (
          <div className="bg-gradient-to-r from-red-500 to-pink-500 rounded-lg p-6 text-white text-center">
            <div className="text-2xl font-bold mb-2">🔴 Live Stream</div>
            <div className="text-lg">This was a live streaming session</div>
            {content.content_data.recording_url && (
              <button className="mt-4 bg-white text-red-500 px-4 py-2 rounded-lg font-medium hover:bg-gray-100 transition-colors">
                Watch Recording
              </button>
            )}
          </div>
        )

      case 'digital_download':
        return (
          <div className="bg-blue-50 rounded-lg p-6 text-center">
            <Download className="w-12 h-12 text-blue-600 mx-auto mb-4" />
            <div className="text-lg font-semibold text-gray-900 mb-2">
              {content.content_data.file_name || 'Digital Download Available'}
            </div>
            {content.content_data.description && (
              <div className="text-gray-600 mb-4">
                {content.content_data.description}
              </div>
            )}
            <div className="flex items-center justify-center space-x-4 text-sm text-gray-500 mb-4">
              {content.content_data.file_size && (
                <span>{formatFileSize(content.content_data.file_size)}</span>
              )}
              <span>•</span>
              <span>Downloadable File</span>
            </div>
            <button 
              onClick={() => {
                if (content.content_data.download_url) {
                  // In a real app, this would trigger a secure download
                  window.open(content.content_data.download_url, '_blank')
                }
              }}
              className="bg-blue-600 text-white px-6 py-2 rounded-lg font-medium hover:bg-blue-700 transition-colors inline-flex items-center space-x-2"
            >
              <Download className="w-4 h-4" />
              <span>Download Now</span>
            </button>
          </div>
        )

      case 'poll':
        return (
          <div className="bg-gray-50 rounded-lg p-6">
            <div className="flex items-center space-x-2 mb-4">
              <BarChart className="w-5 h-5 text-blue-600" />
              <div className="text-lg font-semibold text-gray-900">
                {content.content_data.question}
              </div>
            </div>
            <div className="space-y-3">
              {content.content_data.options?.map((option: string, index: number) => (
                <button
                  key={index}
                  className="w-full text-left p-3 bg-white rounded-lg border border-gray-200 hover:border-blue-300 hover:bg-blue-50 transition-colors flex items-center justify-between"
                >
                  <span>{option}</span>
                  <span className="text-sm text-gray-500">0%</span>
                </button>
              ))}
            </div>
            <div className="mt-4 text-sm text-gray-500 text-center">
              {content.content_data.multiple_choice ? 'Multiple choice allowed' : 'Single choice only'}
            </div>
          </div>
        )

      case 'discussion':
        return (
          <div className="bg-indigo-50 rounded-lg p-6">
            <div className="text-lg font-semibold text-gray-900 mb-4">
              💬 Community Discussion
            </div>
            <div className="text-gray-700 mb-4">
              {content.content_data.discussion_prompt || 'Join the conversation!'}
            </div>
            <button className="bg-indigo-600 text-white px-4 py-2 rounded-lg font-medium hover:bg-indigo-700 transition-colors">
              Join Discussion
            </button>
          </div>
        )

      default:
        return (
          <div className="bg-gray-100 rounded-lg p-6 text-center text-gray-600">
            <FileText className="w-12 h-12 text-gray-400 mx-auto mb-4" />
            <div className="text-lg font-medium mb-2">Content Preview Not Available</div>
            <div className="text-sm">This content type is not yet supported for preview</div>
          </div>
        )
    }
  }

  return (
    <div className="content-player">
      {renderContent()}
    </div>
  )
}