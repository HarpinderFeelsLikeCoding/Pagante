import React, { useState, useEffect } from 'react'
import { useParams } from 'react-router-dom'
import { supabase, type Creator, type Profile } from '../lib/supabase'
import { ContentFeed } from '../components/Content/ContentFeed'
import { SubscriptionTiers } from '../components/Subscriptions/SubscriptionTiers'
import { Users, Calendar, Star, MapPin, Link as LinkIcon } from 'lucide-react'
import { format } from 'date-fns'

export function CreatorProfile() {
  const { username } = useParams<{ username: string }>()
  const [creator, setCreator] = useState<(Creator & { profiles: Profile }) | null>(null)
  const [loading, setLoading] = useState(true)
  const [activeTab, setActiveTab] = useState('content')

  useEffect(() => {
    if (username) {
      loadCreatorProfile()
    }
  }, [username])

  const loadCreatorProfile = async () => {
    try {
      const { data, error } = await supabase
        .from('creators')
        .select(`
          *,
          profiles(*)
        `)
        .eq('profiles.username', username)
        .single()

      if (error) throw error
      setCreator(data)
    } catch (error) {
      console.error('Error loading creator profile:', error)
    } finally {
      setLoading(false)
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <div className="text-gray-600">Loading creator profile...</div>
        </div>
      </div>
    )
  }

  if (!creator) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="text-gray-600 text-lg mb-2">Creator not found</div>
          <div className="text-gray-500">The creator you're looking for doesn't exist.</div>
        </div>
      </div>
    )
  }

  const tabs = [
    { id: 'content', label: 'Content' },
    { id: 'about', label: 'About' },
    { id: 'subscriptions', label: 'Support' },
  ]

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero Section */}
      <div className="bg-gradient-to-r from-blue-600 to-indigo-600 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
          <div className="flex items-start space-x-6">
            <div className="w-32 h-32 bg-white rounded-full flex items-center justify-center text-4xl font-bold text-blue-600">
              {creator.profiles.full_name.charAt(0)}
            </div>
            
            <div className="flex-1">
              <div className="flex items-center space-x-3 mb-2">
                <h1 className="text-4xl font-bold">{creator.profiles.full_name}</h1>
                {creator.is_elected && (
                  <div className="bg-gold-500 text-white px-3 py-1 rounded-full text-sm font-medium flex items-center space-x-1">
                    <Star className="w-4 h-4" />
                    <span>Elected Representative</span>
                  </div>
                )}
              </div>
              
              <div className="text-xl text-blue-100 mb-4">@{creator.profiles.username}</div>
              
              {creator.description && (
                <p className="text-lg text-blue-100 mb-6 max-w-2xl">{creator.description}</p>
              )}
              
              <div className="flex items-center space-x-6 text-blue-100">
                <div className="flex items-center space-x-2">
                  <Users className="w-5 h-5" />
                  <span>1,234 supporters</span>
                </div>
                <div className="flex items-center space-x-2">
                  <Calendar className="w-5 h-5" />
                  <span>Joined {format(new Date(creator.created_at), 'MMMM yyyy')}</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Tabs */}
        <div className="bg-white rounded-xl shadow-lg mb-8">
          <div className="border-b border-gray-200">
            <nav className="flex space-x-8 px-6">
              {tabs.map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`py-4 px-1 border-b-2 font-medium text-sm ${
                    activeTab === tab.id
                      ? 'border-blue-500 text-blue-600'
                      : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                  }`}
                >
                  {tab.label}
                </button>
              ))}
            </nav>
          </div>

          <div className="p-6">
            {activeTab === 'content' && (
              <ContentFeed creatorId={creator.id} />
            )}

            {activeTab === 'about' && (
              <div className="space-y-6">
                <div>
                  <h3 className="text-lg font-medium text-gray-900 mb-4">About {creator.profiles.full_name}</h3>
                  <div className="prose max-w-none">
                    <p className="text-gray-700 leading-relaxed">
                      {creator.description || 'This creator hasn\'t added a description yet.'}
                    </p>
                  </div>
                </div>

                {creator.is_elected && (
                  <div className="bg-gold-50 border border-gold-200 rounded-lg p-6">
                    <div className="flex items-center space-x-2 mb-3">
                      <Star className="w-6 h-6 text-gold-600" />
                      <h4 className="text-lg font-semibold text-gold-900">Elected Representative</h4>
                    </div>
                    <p className="text-gold-800">
                      This creator is an elected representative in the platform's Legislative branch, 
                      advocating for creator rights and platform improvements.
                    </p>
                    <div className="mt-4 text-sm text-gold-700">
                      <div>Election Votes: {creator.election_votes.toLocaleString()}</div>
                      {creator.term_start_date && (
                        <div>Term: {format(new Date(creator.term_start_date), 'MMM yyyy')} - {creator.term_end_date ? format(new Date(creator.term_end_date), 'MMM yyyy') : 'Present'}</div>
                      )}
                    </div>
                  </div>
                )}
              </div>
            )}

            {activeTab === 'subscriptions' && (
              <SubscriptionTiers creatorId={creator.id} />
            )}
          </div>
        </div>
      </div>
    </div>
  )
}