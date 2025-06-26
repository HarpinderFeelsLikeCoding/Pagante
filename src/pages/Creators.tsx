import React, { useState, useEffect } from 'react'
import { Users, Crown, Star, TrendingUp, Search, Filter, MapPin, Calendar, Award, Vote } from 'lucide-react'
import { supabase, type Creator, type Profile } from '../lib/supabase'
import { Link } from 'react-router-dom'
import { format } from 'date-fns'

interface CreatorWithProfile extends Creator {
  profiles: Profile
  subscriber_count?: number
  monthly_earnings?: number
}

export function Creators() {
  const [creators, setCreators] = useState<CreatorWithProfile[]>([])
  const [loading, setLoading] = useState(true)
  const [searchQuery, setSearchQuery] = useState('')
  const [selectedFilter, setSelectedFilter] = useState('all')
  const [sortBy, setSortBy] = useState('election_votes')

  useEffect(() => {
    loadCreators()
  }, [])

  const loadCreators = async () => {
    try {
      setLoading(true)
      
      const { data, error } = await supabase
        .from('creators')
        .select(`
          *,
          profiles(*)
        `)
        .order('election_votes', { ascending: false })

      if (error) throw error

      // Add mock subscriber counts and earnings for demo
      const creatorsWithStats = data?.map(creator => ({
        ...creator,
        subscriber_count: Math.floor(Math.random() * 5000) + 100,
        monthly_earnings: Math.floor(Math.random() * 3000) + 200
      })) || []

      setCreators(creatorsWithStats)
    } catch (error) {
      console.error('Error loading creators:', error)
    } finally {
      setLoading(false)
    }
  }

  const filteredCreators = creators.filter(creator => {
    const matchesSearch = creator.profiles.full_name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         creator.profiles.username.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         creator.description.toLowerCase().includes(searchQuery.toLowerCase())
    
    const matchesFilter = selectedFilter === 'all' || 
                         (selectedFilter === 'elected' && creator.is_elected) ||
                         (selectedFilter === 'regular' && !creator.is_elected)
    
    return matchesSearch && matchesFilter
  })

  const sortedCreators = [...filteredCreators].sort((a, b) => {
    switch (sortBy) {
      case 'election_votes':
        return b.election_votes - a.election_votes
      case 'subscribers':
        return (b.subscriber_count || 0) - (a.subscriber_count || 0)
      case 'earnings':
        return (b.monthly_earnings || 0) - (a.monthly_earnings || 0)
      case 'newest':
        return new Date(b.created_at).getTime() - new Date(a.created_at).getTime()
      default:
        return 0
    }
  })

  const electedCreators = creators.filter(c => c.is_elected)
  const totalCreators = creators.length
  const totalVotes = creators.reduce((sum, c) => sum + c.election_votes, 0)

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50">
        <div className="bg-gradient-to-r from-blue-600 to-indigo-600 text-white py-16">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
            <Users className="w-16 h-16 text-blue-200 mx-auto mb-4" />
            <h1 className="text-4xl font-bold mb-4">Creator Community</h1>
            <p className="text-xl text-blue-100">Loading creators...</p>
          </div>
        </div>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[...Array(6)].map((_, i) => (
              <div key={i} className="bg-white rounded-xl shadow-lg p-6 animate-pulse">
                <div className="h-16 w-16 bg-gray-200 rounded-full mx-auto mb-4"></div>
                <div className="h-4 bg-gray-200 rounded w-3/4 mx-auto mb-2"></div>
                <div className="h-3 bg-gray-200 rounded w-1/2 mx-auto mb-4"></div>
                <div className="h-20 bg-gray-200 rounded mb-4"></div>
                <div className="h-8 bg-gray-200 rounded"></div>
              </div>
            ))}
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero Section */}
      <div className="bg-gradient-to-r from-blue-600 to-indigo-600 text-white py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <Users className="w-16 h-16 text-blue-200 mx-auto mb-4" />
            <h1 className="text-4xl font-bold mb-4">Creator Community</h1>
            <p className="text-xl text-blue-100 mb-8 max-w-2xl mx-auto">
              Discover talented creators and their elected representatives shaping the platform's future
            </p>
            
            {/* Stats */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-3xl mx-auto">
              <div className="bg-white/10 rounded-lg p-4">
                <div className="text-2xl font-bold">{totalCreators}</div>
                <div className="text-blue-100">Total Creators</div>
              </div>
              <div className="bg-white/10 rounded-lg p-4">
                <div className="text-2xl font-bold">{electedCreators.length}</div>
                <div className="text-blue-100">Elected Representatives</div>
              </div>
              <div className="bg-white/10 rounded-lg p-4">
                <div className="text-2xl font-bold">{totalVotes.toLocaleString()}</div>
                <div className="text-blue-100">Total Election Votes</div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Search and Filters */}
        <div className="bg-white rounded-xl shadow-lg p-6 mb-8">
          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between space-y-4 lg:space-y-0">
            {/* Search */}
            <div className="relative flex-1 max-w-md">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <Search className="h-5 w-5 text-gray-400" />
              </div>
              <input
                type="text"
                className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="Search creators..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>

            {/* Filters */}
            <div className="flex items-center space-x-4">
              <div className="flex items-center space-x-2">
                <Filter className="w-4 h-4 text-gray-500" />
                <select
                  value={selectedFilter}
                  onChange={(e) => setSelectedFilter(e.target.value)}
                  className="border border-gray-300 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                >
                  <option value="all">All Creators</option>
                  <option value="elected">Elected Representatives</option>
                  <option value="regular">Regular Creators</option>
                </select>
              </div>

              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                className="border border-gray-300 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                <option value="election_votes">Most Votes</option>
                <option value="subscribers">Most Subscribers</option>
                <option value="earnings">Highest Earnings</option>
                <option value="newest">Newest</option>
              </select>
            </div>
          </div>
        </div>

        {/* Elected Representatives Section */}
        {electedCreators.length > 0 && (
          <div className="mb-12">
            <div className="flex items-center space-x-3 mb-6">
              <Crown className="w-8 h-8 text-gold-500" />
              <h2 className="text-2xl font-bold text-gray-900">Elected Representatives</h2>
              <div className="bg-gold-100 text-gold-800 px-3 py-1 rounded-full text-sm font-medium">
                Legislative Branch
              </div>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
              {electedCreators.map((creator) => (
                <div key={creator.id} className="bg-gradient-to-br from-gold-50 to-yellow-50 border-2 border-gold-200 rounded-xl p-6 hover:shadow-lg transition-all duration-300">
                  <div className="text-center">
                    <div className="relative mb-4">
                      <div className="w-16 h-16 bg-gold-100 rounded-full flex items-center justify-center text-2xl font-bold text-gold-600 mx-auto">
                        {creator.profiles.full_name.charAt(0)}
                      </div>
                      <div className="absolute -top-1 -right-1">
                        <Crown className="w-6 h-6 text-gold-500" />
                      </div>
                    </div>
                    
                    <h3 className="text-lg font-bold text-gray-900 mb-1">
                      {creator.profiles.full_name}
                    </h3>
                    <p className="text-gold-600 font-medium mb-2">
                      @{creator.profiles.username}
                    </p>
                    
                    <div className="flex items-center justify-center space-x-4 text-sm text-gray-600 mb-4">
                      <div className="flex items-center space-x-1">
                        <Vote className="w-4 h-4" />
                        <span>{creator.election_votes.toLocaleString()}</span>
                      </div>
                      <div className="flex items-center space-x-1">
                        <Users className="w-4 h-4" />
                        <span>{creator.subscriber_count?.toLocaleString()}</span>
                      </div>
                    </div>
                    
                    <p className="text-sm text-gray-600 mb-4 line-clamp-3">
                      {creator.description}
                    </p>
                    
                    <Link
                      to={`/creator/${creator.profiles.username}`}
                      className="bg-gradient-to-r from-gold-600 to-gold-700 text-white px-4 py-2 rounded-lg text-sm font-medium hover:from-gold-700 hover:to-gold-800 transition-all duration-300 inline-block"
                    >
                      View Profile
                    </Link>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* All Creators Grid */}
        <div className="mb-8">
          <h2 className="text-2xl font-bold text-gray-900 mb-6">
            All Creators ({sortedCreators.length})
          </h2>
          
          {sortedCreators.length === 0 ? (
            <div className="text-center py-12">
              <Users className="w-16 h-16 text-gray-400 mx-auto mb-4" />
              <div className="text-xl text-gray-600 mb-2">No creators found</div>
              <div className="text-gray-500">Try adjusting your search or filters</div>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {sortedCreators.map((creator) => (
                <div key={creator.id} className="bg-white rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 overflow-hidden">
                  <div className="p-6">
                    <div className="flex items-start justify-between mb-4">
                      <div className="flex items-center space-x-3">
                        <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center text-lg font-bold text-blue-600">
                          {creator.profiles.full_name.charAt(0)}
                        </div>
                        <div>
                          <h3 className="text-lg font-bold text-gray-900">
                            {creator.profiles.full_name}
                          </h3>
                          <p className="text-blue-600 font-medium">
                            @{creator.profiles.username}
                          </p>
                        </div>
                      </div>
                      
                      {creator.is_elected && (
                        <div className="bg-gold-100 text-gold-800 px-2 py-1 rounded-full text-xs font-medium flex items-center space-x-1">
                          <Crown className="w-3 h-3" />
                          <span>Elected</span>
                        </div>
                      )}
                    </div>
                    
                    <p className="text-gray-600 text-sm mb-4 line-clamp-3">
                      {creator.description}
                    </p>
                    
                    <div className="grid grid-cols-3 gap-4 mb-4 text-center">
                      <div>
                        <div className="text-lg font-bold text-gray-900">
                          {creator.election_votes.toLocaleString()}
                        </div>
                        <div className="text-xs text-gray-500">Votes</div>
                      </div>
                      <div>
                        <div className="text-lg font-bold text-gray-900">
                          {creator.subscriber_count?.toLocaleString()}
                        </div>
                        <div className="text-xs text-gray-500">Subscribers</div>
                      </div>
                      <div>
                        <div className="text-lg font-bold text-gray-900">
                          ${creator.monthly_earnings?.toLocaleString()}
                        </div>
                        <div className="text-xs text-gray-500">Monthly</div>
                      </div>
                    </div>
                    
                    <div className="flex items-center justify-between text-xs text-gray-500 mb-4">
                      <div className="flex items-center space-x-1">
                        <Calendar className="w-3 h-3" />
                        <span>Joined {format(new Date(creator.created_at), 'MMM yyyy')}</span>
                      </div>
                      {creator.is_elected && creator.term_start_date && (
                        <div className="flex items-center space-x-1">
                          <Award className="w-3 h-3" />
                          <span>Term {format(new Date(creator.term_start_date), 'yyyy')}</span>
                        </div>
                      )}
                    </div>
                    
                    <Link
                      to={`/creator/${creator.profiles.username}`}
                      className="w-full bg-gradient-to-r from-blue-600 to-indigo-600 text-white py-2 px-4 rounded-lg text-sm font-medium hover:from-blue-700 hover:to-indigo-700 transition-all duration-300 text-center block"
                    >
                      View Profile
                    </Link>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Call to Action */}
        <div className="bg-gradient-to-r from-blue-600 to-indigo-600 rounded-xl p-8 text-center text-white">
          <h3 className="text-2xl font-bold mb-4">Join Our Creator Community</h3>
          <p className="text-blue-100 mb-6 max-w-2xl mx-auto">
            Start creating content, build your audience, and potentially become an elected representative 
            to shape the future of the platform.
          </p>
          <Link
            to="/register"
            className="bg-white text-blue-600 px-8 py-3 rounded-lg font-semibold hover:bg-gray-100 transition-colors inline-block"
          >
            Become a Creator
          </Link>
        </div>
      </div>
    </div>
  )
}