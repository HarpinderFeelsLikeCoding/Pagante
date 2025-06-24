import React, { useState, useEffect } from 'react'
import { useAuth } from '../contexts/AuthContext'
import { supabase, type Creator, contentService } from '../lib/supabase'
import { ContentCreator } from '../components/Content/ContentCreator'
import { ContentFeed } from '../components/Content/ContentFeed'
import { LiveStreamManager } from '../components/Streaming/LiveStreamManager'
import { SubscriptionTiers } from '../components/Subscriptions/SubscriptionTiers'
import { BarChart, Users, DollarSign, Eye, Settings, TrendingUp, Heart, MessageCircle } from 'lucide-react'
import { useNavigate } from 'react-router-dom'

export function CreatorDashboard() {
  const { profile, loading: authLoading, user } = useAuth()
  const navigate = useNavigate()
  const [creator, setCreator] = useState<Creator | null>(null)
  const [activeTab, setActiveTab] = useState('overview')
  const [loading, setLoading] = useState(false) // Don't start with loading true
  const [error, setError] = useState('')

  useEffect(() => {
    // Only redirect if we're sure there's no user and auth is not loading
    if (!authLoading && !user) {
      navigate('/login')
      return
    }

    // Only load creator profile if we have a profile and auth is not loading
    if (profile && !authLoading) {
      loadCreatorProfile()
    }
  }, [profile, authLoading, user, navigate])

  const loadCreatorProfile = async () => {
    if (!profile) return

    try {
      setLoading(true)
      setError('')
      
      console.log('Loading creator profile for user:', profile.id)
      
      const { data, error } = await supabase
        .from('creators')
        .select('*')
        .eq('user_id', profile.id)
        .single()

      if (error && error.code !== 'PGRST116') {
        console.error('Error loading creator profile:', error)
        throw error
      }

      if (!data) {
        console.log('No creator profile found, creating one...')
        // Create creator profile if it doesn't exist
        const { data: newCreator, error: createError } = await supabase
          .from('creators')
          .insert([{
            user_id: profile.id,
            description: '',
          }])
          .select()
          .single()

        if (createError) {
          console.error('Error creating creator profile:', createError)
          throw createError
        }
        
        console.log('Created new creator profile:', newCreator)
        setCreator(newCreator)
      } else {
        console.log('Found existing creator profile:', data)
        setCreator(data)
      }
    } catch (error: any) {
      console.error('Error in loadCreatorProfile:', error)
      setError('Failed to load creator profile: ' + error.message)
    } finally {
      setLoading(false)
    }
  }

  const refreshContent = () => {
    // Force a refresh of the content feed
    window.location.reload()
  }

  const tabs = [
    { id: 'overview', label: 'Overview', icon: BarChart },
    { id: 'content', label: 'Content', icon: MessageCircle },
    { id: 'streams', label: 'Live Streams', icon: Users },
    { id: 'subscriptions', label: 'Subscriptions', icon: DollarSign },
    { id: 'analytics', label: 'Analytics', icon: TrendingUp },
    { id: 'settings', label: 'Settings', icon: Settings },
  ]

  const stats = [
    { label: 'Total Subscribers', value: '1,234', change: '+12%', color: 'text-green-600', icon: Users },
    { label: 'Monthly Revenue', value: '$2,456', change: '+8%', color: 'text-green-600', icon: DollarSign },
    { label: 'Content Views', value: '45.2K', change: '+15%', color: 'text-green-600', icon: Eye },
    { label: 'Engagement Rate', value: '8.4%', change: '+2%', color: 'text-green-600', icon: Heart },
  ]

  const recentActivity = [
    { type: 'subscription', user: 'Alice Johnson', action: 'subscribed to Premium tier', time: '2 hours ago' },
    { type: 'content', user: 'Bob Smith', action: 'liked your video "Getting Started"', time: '4 hours ago' },
    { type: 'comment', user: 'Carol Davis', action: 'commented on your post', time: '6 hours ago' },
    { type: 'stream', user: 'David Wilson', action: 'joined your live stream', time: '1 day ago' },
  ]

  // Show loading only when we're actively loading creator data
  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <div className="text-gray-600">Loading dashboard...</div>
        </div>
      </div>
    )
  }

  // Show message if no profile is found and auth is not loading
  if (!authLoading && !profile) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="text-gray-600 text-lg mb-2">Please log in to access your dashboard</div>
          <button
            onClick={() => navigate('/login')}
            className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors"
          >
            Go to Login
          </button>
        </div>
      </div>
    )
  }

  // Show error if there was a problem loading the creator profile
  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="text-red-600 text-lg mb-2">Error loading creator profile</div>
          <div className="text-gray-600 mb-4">{error}</div>
          <button
            onClick={loadCreatorProfile}
            className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors"
          >
            Retry
          </button>
        </div>
      </div>
    )
  }

  // Don't render the dashboard until we have both profile and creator data
  if (!profile || !creator) {
    return null // Return nothing while waiting for data
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Creator Dashboard</h1>
          <p className="text-gray-600">Welcome back, {profile.full_name}!</p>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          {stats.map((stat, index) => {
            const IconComponent = stat.icon
            return (
              <div key={index} className="bg-white rounded-xl shadow-lg p-6 hover:shadow-xl transition-shadow">
                <div className="flex items-center justify-between">
                  <div>
                    <div className="text-sm font-medium text-gray-600">{stat.label}</div>
                    <div className="text-2xl font-bold text-gray-900 mt-1">{stat.value}</div>
                    <div className={`text-sm ${stat.color} mt-1`}>{stat.change} from last month</div>
                  </div>
                  <div className="p-3 bg-blue-100 rounded-full">
                    <IconComponent className="w-6 h-6 text-blue-600" />
                  </div>
                </div>
              </div>
            )
          })}
        </div>

        {/* Tabs */}
        <div className="bg-white rounded-xl shadow-lg mb-8">
          <div className="border-b border-gray-200">
            <nav className="flex space-x-8 px-6 overflow-x-auto">
              {tabs.map((tab) => {
                const IconComponent = tab.icon
                return (
                  <button
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id)}
                    className={`flex items-center space-x-2 py-4 px-1 border-b-2 font-medium text-sm whitespace-nowrap ${
                      activeTab === tab.id
                        ? 'border-blue-500 text-blue-600'
                        : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                    }`}
                  >
                    <IconComponent className="w-5 h-5" />
                    <span>{tab.label}</span>
                  </button>
                )
              })}
            </nav>
          </div>

          <div className="p-6">
            {activeTab === 'overview' && (
              <div className="space-y-8">
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                  {/* Quick Actions */}
                  <div className="bg-gradient-to-r from-blue-50 to-indigo-50 rounded-xl p-6">
                    <h3 className="text-lg font-semibold text-gray-900 mb-4">Quick Actions</h3>
                    <div className="space-y-3">
                      <button
                        onClick={() => setActiveTab('content')}
                        className="w-full bg-white text-left p-4 rounded-lg shadow-sm hover:shadow-md transition-shadow border border-gray-200"
                      >
                        <div className="font-medium text-gray-900">Create New Content</div>
                        <div className="text-sm text-gray-600">Share your latest work with subscribers</div>
                      </button>
                      <button
                        onClick={() => setActiveTab('streams')}
                        className="w-full bg-white text-left p-4 rounded-lg shadow-sm hover:shadow-md transition-shadow border border-gray-200"
                      >
                        <div className="font-medium text-gray-900">Schedule Live Stream</div>
                        <div className="text-sm text-gray-600">Connect with your audience in real-time</div>
                      </button>
                      <button
                        onClick={() => setActiveTab('subscriptions')}
                        className="w-full bg-white text-left p-4 rounded-lg shadow-sm hover:shadow-md transition-shadow border border-gray-200"
                      >
                        <div className="font-medium text-gray-900">Manage Subscription Tiers</div>
                        <div className="text-sm text-gray-600">Update pricing and benefits</div>
                      </button>
                    </div>
                  </div>

                  {/* Recent Activity */}
                  <div className="bg-white rounded-xl border border-gray-200 p-6">
                    <h3 className="text-lg font-semibold text-gray-900 mb-4">Recent Activity</h3>
                    <div className="space-y-4">
                      {recentActivity.map((activity, index) => (
                        <div key={index} className="flex items-start space-x-3">
                          <div className="w-2 h-2 bg-blue-500 rounded-full mt-2"></div>
                          <div className="flex-1">
                            <div className="text-sm text-gray-900">
                              <span className="font-medium">{activity.user}</span> {activity.action}
                            </div>
                            <div className="text-xs text-gray-500">{activity.time}</div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>

                {/* Recent Content Preview */}
                <div>
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="text-lg font-semibold text-gray-900">Recent Content</h3>
                    <button
                      onClick={() => setActiveTab('content')}
                      className="text-blue-600 hover:text-blue-700 font-medium text-sm"
                    >
                      View All
                    </button>
                  </div>
                  <ContentFeed creatorId={creator.id} limit={3} showScheduled={true} />
                </div>
              </div>
            )}

            {activeTab === 'content' && (
              <div className="space-y-8">
                <ContentCreator 
                  creatorId={creator.id} 
                  onContentCreated={refreshContent} 
                />
                <div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-4">All Content</h3>
                  <ContentFeed creatorId={creator.id} showScheduled={true} />
                </div>
              </div>
            )}

            {activeTab === 'streams' && (
              <LiveStreamManager creatorId={creator.id} />
            )}

            {activeTab === 'subscriptions' && (
              <SubscriptionTiers creatorId={creator.id} isOwner={true} />
            )}

            {activeTab === 'analytics' && (
              <div className="text-center py-12">
                <TrendingUp className="w-16 h-16 text-gray-400 mx-auto mb-4" />
                <h3 className="text-lg font-medium text-gray-900 mb-2">Analytics Coming Soon</h3>
                <p className="text-gray-600">Detailed analytics and insights will be available here.</p>
              </div>
            )}

            {activeTab === 'settings' && (
              <div className="space-y-6">
                <div>
                  <h3 className="text-lg font-medium text-gray-900 mb-4">Creator Settings</h3>
                  <div className="bg-gray-50 rounded-lg p-6">
                    <div className="space-y-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Creator Description
                        </label>
                        <textarea
                          rows={4}
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                          placeholder="Tell your audience about yourself..."
                          defaultValue={creator.description}
                        />
                      </div>
                      <button className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors">
                        Save Changes
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}