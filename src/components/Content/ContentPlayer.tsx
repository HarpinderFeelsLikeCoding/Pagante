import React from 'react'
import ReactPlayer from 'react-player'
import { Play, Download, BarChart, ImageIcon } from 'lucide-react'
import { type Content } from '../../lib/supabase'

interface ContentPlayerProps {
  content: Content
}

export function ContentPlayer({ content }: ContentPlayerProps) {
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
              alt={content.title}
              className="w-full rounded-lg object-cover max-h-96"
              onError={(e) => {
                // Fallback to placeholder if image fails to load
                const target = e.target as HTMLImageElement
                target.src = 'https://images.pexels.com/photos/1591056/pexels-photo-1591056.jpeg?auto=compress&cs=tinysrgb&w=800'
              }}
            />
            {content.content_data.file_name && (
              <div className="absolute bottom-2 left-2 bg-black bg-opacity-50 text-white px-2 py-1 rounded text-xs">
                {content.content_data.file_name}
              </div>
            )}
          </div>
        )

      case 'video':
        return (
          <div className="relative bg-black rounded-lg overflow-hidden">
            <ReactPlayer
              url={content.content_data.video_url}
              width="100%"
              height="400px"
              controls
              light={content.content_data.thumbnail_url || 'https://images.pexels.com/photos/1591061/pexels-photo-1591061.jpeg?auto=compress&cs=tinysrgb&w=800'}
              playIcon={
                <div className="flex items-center justify-center w-16 h-16 bg-blue-600 rounded-full">
                  <Play className="w-8 h-8 text-white ml-1" />
                </div>
              }
            />
          </div>
        )

      case 'audio':
        return (
          <div className="bg-gradient-to-r from-purple-50 to-pink-50 rounded-lg p-6">
            <div className="flex items-center space-x-4 mb-4">
              <div className="w-16 h-16 bg-purple-100 rounded-lg flex items-center justify-center">
                <span className="text-2xl">🎵</span>
              </div>
              <div>
                <h4 className="font-semibold text-gray-900">{content.title}</h4>
                <p className="text-gray-600 text-sm">Audio Content</p>
              </div>
            </div>
            {content.content_data.audio_url && (
              <ReactPlayer
                url={content.content_data.audio_url}
                width="100%"
                height="60px"
                controls
              />
            )}
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
              Digital Download Available
            </div>
            <div className="text-gray-600 mb-4">
              {content.content_data.file_name || 'Download file'}
            </div>
            <button className="bg-blue-600 text-white px-6 py-2 rounded-lg font-medium hover:bg-blue-700 transition-colors">
              Download Now
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
                  className="w-full text-left p-3 bg-white rounded-lg border border-gray-200 hover:border-blue-300 hover:bg-blue-50 transition-colors"
                >
                  {option}
                </button>
              ))}
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
            <ImageIcon className="w-12 h-12 mx-auto mb-4 opacity-50" />
            <div>Content preview not available</div>
            <div className="text-sm mt-2">Content type: {content.content_type}</div>
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