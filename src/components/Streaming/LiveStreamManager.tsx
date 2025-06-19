import React, { useState, useEffect } from 'react'
import { Radio, Calendar, Users, Settings, Play, Square } from 'lucide-react'
import { streamService, type LiveStream, type TierType } from '../../lib/supabase'
import { useAuth } from '../../contexts/AuthContext'
import { format } from 'date-fns'

interface LiveStreamManagerProps {
  creatorId: string
}

export function LiveStreamManager({ creatorId }: LiveStreamManagerProps) {
  const { profile } = useAuth()
  const [streams, setStreams] = useState<LiveStream[]>([])
  const [loading, setLoading] = useState(true)
  const [showCreateForm, setShowCreateForm] = useState(false)
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    scheduled_start: '',
    tier_required: 'free' as TierType,
    max_viewers: 100,
  })

  useEffect(() => {
    loadStreams()
  }, [creatorId])

  const loadStreams = async () => {
    try {
      // This would need to be implemented in streamService
      const data = await streamService.getUpcomingStreams()
      setStreams(data.filter(stream => stream.creator_id === creatorId))
    } catch (error) {
      console.error('Error loading streams:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleCreateStream = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!profile) return

    try {
      await streamService.createStream({
        ...formData,
        creator_id: creatorId,
        stream_key: generateStreamKey(),
      })
      
      setFormData({
        title: '',
        description: '',
        scheduled_start: '',
        tier_required: 'free',
        max_viewers: 100,
      })
      setShowCreateForm(false)
      loadStreams()
    } catch (error) {
      console.error('Error creating stream:', error)
    }
  }

  const generateStreamKey = () => {
    return 'stream_' + Math.random().toString(36).substr(2, 9)
  }

  const handleStreamAction = async (streamId: string, action: 'start' | 'end') => {
    try {
      if (action === 'start') {
        await streamService.updateStreamStatus(streamId, 'live')
      } else {
        await streamService.updateStreamStatus(streamId, 'ended')
      }
      loadStreams()
    } catch (error) {
      console.error('Error updating stream:', error)
    }
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'scheduled': return 'bg-blue-100 text-blue-800'
      case 'live': return 'bg-red-100 text-red-800'
      case 'ended': return 'bg-gray-100 text-gray-800'
      default: return 'bg-gray-100 text-gray-800'
    }
  }

  if (loading) {
    return (
      <div className="bg-white rounded-xl shadow-lg p-6">
        <div className="animate-pulse">
          <div className="h-6 bg-gray-200 rounded w-1/3 mb-4"></div>
          <div className="space-y-3">
            {[...Array(3)].map((_, i) => (
              <div key={i} className="h-16 bg-gray-200 rounded"></div>
            ))}
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="bg-white rounded-xl shadow-lg p-6">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center space-x-2">
          <Radio className="w-6 h-6 text-red-500" />
          <h3 className="text-xl font-bold text-gray-900">Live Streams</h3>
        </div>
        <button
          onClick={() => setShowCreateForm(true)}
          className="bg-gradient-to-r from-red-500 to-pink-500 text-white px-4 py-2 rounded-lg font-medium hover:from-red-600 hover:to-pink-600 transition-all duration-300"
        >
          Schedule Stream
        </button>
      </div>

      {showCreateForm && (
        <div className="mb-6 p-4 bg-gray-50 rounded-lg">
          <h4 className="text-lg font-semibold mb-4">Schedule New Stream</h4>
          <form onSubmit={handleCreateStream} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Stream Title
              </label>
              <input
                type="text"
                required
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent"
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
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent"
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Scheduled Start
                </label>
                <input
                  type="datetime-local"
                  required
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent"
                  value={formData.scheduled_start}
                  onChange={(e) => setFormData({ ...formData, scheduled_start: e.target.value })}
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Access Tier
                </label>
                <select
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent"
                  value={formData.tier_required}
                  onChange={(e) => setFormData({ ...formData, tier_required: e.target.value as TierType })}
                >
                  <option value="free">Free</option>
                  <option value="supporter">Supporter</option>
                  <option value="premium">Premium</option>
                  <option value="vip">VIP</option>
                </select>
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Max Viewers
              </label>
              <input
                type="number"
                min="1"
                max="10000"
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent"
                value={formData.max_viewers}
                onChange={(e) => setFormData({ ...formData, max_viewers: parseInt(e.target.value) })}
              />
            </div>

            <div className="flex space-x-3">
              <button
                type="button"
                onClick={() => setShowCreateForm(false)}
                className="flex-1 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="flex-1 bg-red-500 text-white px-4 py-2 rounded-lg font-medium hover:bg-red-600 transition-colors"
              >
                Schedule Stream
              </button>
            </div>
          </form>
        </div>
      )}

      <div className="space-y-4">
        {streams.length === 0 ? (
          <div className="text-center py-8 text-gray-500">
            <Radio className="w-12 h-12 mx-auto mb-4 opacity-50" />
            <div>No streams scheduled</div>
            <div className="text-sm">Create your first live stream!</div>
          </div>
        ) : (
          streams.map((stream) => (
            <div key={stream.id} className="border border-gray-200 rounded-lg p-4">
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <div className="flex items-center space-x-2 mb-2">
                    <h4 className="text-lg font-semibold text-gray-900">{stream.title}</h4>
                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(stream.status)}`}>
                      {stream.status.toUpperCase()}
                    </span>
                  </div>
                  
                  {stream.description && (
                    <p className="text-gray-600 mb-2">{stream.description}</p>
                  )}
                  
                  <div className="flex items-center space-x-4 text-sm text-gray-500">
                    <div className="flex items-center space-x-1">
                      <Calendar className="w-4 h-4" />
                      <span>{format(new Date(stream.scheduled_start), 'MMM d, yyyy h:mm a')}</span>
                    </div>
                    <div className="flex items-center space-x-1">
                      <Users className="w-4 h-4" />
                      <span>{stream.current_viewers}/{stream.max_viewers}</span>
                    </div>
                  </div>
                </div>

                <div className="flex items-center space-x-2">
                  {stream.status === 'scheduled' && (
                    <button
                      onClick={() => handleStreamAction(stream.id, 'start')}
                      className="flex items-center space-x-1 bg-red-500 text-white px-3 py-1 rounded-lg text-sm font-medium hover:bg-red-600 transition-colors"
                    >
                      <Play className="w-4 h-4" />
                      <span>Go Live</span>
                    </button>
                  )}
                  
                  {stream.status === 'live' && (
                    <button
                      onClick={() => handleStreamAction(stream.id, 'end')}
                      className="flex items-center space-x-1 bg-gray-500 text-white px-3 py-1 rounded-lg text-sm font-medium hover:bg-gray-600 transition-colors"
                    >
                      <Square className="w-4 h-4" />
                      <span>End Stream</span>
                    </button>
                  )}
                  
                  <button className="p-1 text-gray-400 hover:text-gray-600">
                    <Settings className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  )
}