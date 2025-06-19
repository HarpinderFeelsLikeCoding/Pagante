import React, { useState, useEffect } from 'react'
import { useAuth } from '../contexts/AuthContext'
import { supabase, type Creator } from '../lib/supabase'
import { ContentCreator } from '../components/Content/ContentCreator'
import { ContentFeed } from '../components/Content/ContentFeed'
import { LiveStreamManager } from '../components/Streaming/LiveStreamManager'
import { SubscriptionTiers } from '../components/Subscriptions/SubscriptionTiers'
import { BarChart, Users, DollarSign, Eye, Plus, Settings } from 'lucide-react'

export function CreatorDashboard() {
  const { profile } = useAuth()
  const [creator, setCreator] = useState<Creator | null>(null)
  const [activeTab, setActiveTab] = useState('content')
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (profile) {
      loadCreatorProfile()
    }
  }, [profile])

  const loadCreatorProfile = async () => {
    if (!profile) return

    try {
      const { data, error } = await supabase
        .from('creators')
        .select('*')
        .eq('user_id', profile.id)
        .single()

      if (error && error.code !== 'PGRST116') {
        throw error
      }

      if (!data) {
        // Create creator profile if it doesn't exist
        const { data: newCreator, error: createError } = await supabase
          .from('creators')
          .insert([{
            user_id: profile.id,
            description: '',
          }])
          .select()
          .single()

        if (createError) throw createError
        setCreator(newCreator)
      } else {
        setCreator(data)
      }
    } catch (error) {
      console.error('Error loading creator profile:', error)
    } finally {
      setLoading(false)
    }
  }

  const tabs = [
    { id: 'content', label: 'Content', icon: BarChart },
    { id: 'streams', label: 'Live Streams', icon: Users },
    { id: 'subscriptions', label: 'Subscriptions', icon: DollarSign },
    { id: 'analytics', label: 'Analytics', icon: Eye },
    { id: 'settings', label: 'Settings', icon: Settings },
  ]

  const stats = [
    { label: 'Total Subscribers', value: '1,234', change: '+12%', color: 'text-green-600' },
    { label: 'Monthly Revenue', value: '$2,456', change: '+8%', color: 'text-green-600' },
    { label: 'Content Views', value: '45.2K', change: '+15%', color: 'text-green-600' },
    { label: 'Engagement Rate', value: '8.4%', change: '+2%', color: 'text-green-600' },
  ]

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

  if (!creator) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="text-red-600 text-lg mb-2">Error loading creator profile</div>
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

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Creator Dashboard</h1>
          <p className="text-gray-600">Welcome back, {profile?.full_name}!</p>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          {stats.map((stat, index) => (
            <div key={index} className="bg-white rounded-xl shadow-lg p-6">
              <div className="text-sm font-medium text-gray-600">{stat.label}</div>
              <div className="text-2xl font-bold text-gray-900 mt-1">{stat.value}</div>
              <div className={`text-sm ${stat.color} mt-1`}>{stat.change} from last month</div>
            </div>
          ))}
        </div>

        {/* Tabs */}
        <div className="bg-white rounded-xl shadow-lg mb-8">
          <div className="border-b border-gray-200">
            <nav className="flex space-x-8 px-6">
              {tabs.map((tab) => {
                const IconComponent = tab.icon
                return (
                  <button
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id)}
                    className={`flex items-center space-x-2 py-4 px-1 border-b-2 font-medium text-sm ${
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
            {activeTab === 'content' && (
              <div className="space-y-8">
                <ContentCreator 
                  creatorId={creator.id} 
                  onContentCreated={() => window.location.reload()} 
                />
                <ContentFeed creatorId={creator.id} />
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
                <BarChart className="w-16 h-16 text-gray-400 mx-auto mb-4" />
                <h3 className="text-lg font-medium text-gray-900 mb-2">Analytics Coming Soon</h3>
                <p className="text-gray-600">Detailed analytics and insights will be available here.</p>
              </div>
            )}

            {activeTab === 'settings' && (
              <div className="space-y-6">
                <div>
                  <h3 className="text-lg font-medium text-gray-900 mb-4">Creator Settings</h3>
                  <div className="bg-gray-50 rounded-lg p-4">
                    <p className="text-gray-600">Creator settings panel coming soon...</p>
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