import React, { useState, useEffect } from 'react'
import { Compass, TrendingUp, Clock, Star, Users, Search, Filter } from 'lucide-react'
import { contentService, type Content } from '../lib/supabase'
import { ContentFeed } from '../components/Content/ContentFeed'
import { useAuth } from '../contexts/AuthContext'

export function Discover() {
  const { profile } = useAuth()
  const [activeTab, setActiveTab] = useState('trending')
  const [searchQuery, setSearchQuery] = useState('')
  const [selectedCategory, setSelectedCategory] = useState('all')
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  const tabs = [
    { id: 'trending', label: 'Trending', icon: TrendingUp },
    { id: 'recent', label: 'Recent', icon: Clock },
    { id: 'featured', label: 'Featured', icon: Star },
    { id: 'following', label: 'Following', icon: Users },
  ]

  const categories = [
    { id: 'all', label: 'All Content' },
    { id: 'text_post', label: 'Text Posts' },
    { id: 'video', label: 'Videos' },
    { id: 'image', label: 'Images' },
    { id: 'audio', label: 'Audio' },
    { id: 'article', label: 'Articles' },
    { id: 'poll', label: 'Polls' },
    { id: 'discussion', label: 'Discussions' },
  ]

  useEffect(() => {
    loadDiscoverContent()
  }, [activeTab, selectedCategory])

  const loadDiscoverContent = async () => {
    try {
      setLoading(true)
      setError('')
      
      console.log('Loading discover content for tab:', activeTab, 'category:', selectedCategory)
      
      // Try to get content with creator info, but fallback to simple content if that fails
      let data
      try {
        data = await contentService.getDiscoverContent(activeTab, selectedCategory)
      } catch (err) {
        console.log('Failed to get content with creator info, trying simple query...')
        data = await contentService.getAllPublishedContent()
      }
      
      console.log('Loaded discover content:', data)
      
    } catch (error: any) {
      console.error('Error loading discover content:', error)
      setError('Failed to load content: ' + error.message)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero Section */}
      <div className="bg-gradient-to-r from-blue-600 to-indigo-600 text-white py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <Compass className="w-16 h-16 text-blue-200 mx-auto mb-4" />
            <h1 className="text-4xl font-bold mb-4">Discover Amazing Content</h1>
            <p className="text-xl text-blue-100 mb-8 max-w-2xl mx-auto">
              Explore trending posts, discover new creators, and find content that inspires you
            </p>
            
            {/* Search Bar */}
            <div className="max-w-2xl mx-auto relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <Search className="h-5 w-5 text-gray-400" />
              </div>
              <input
                type="text"
                className="block w-full pl-10 pr-3 py-3 border border-transparent rounded-lg bg-white text-gray-900 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="Search content, creators, or tags..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Tabs and Filters */}
        <div className="bg-white rounded-xl shadow-lg mb-8">
          <div className="border-b border-gray-200">
            <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between p-6">
              {/* Tabs */}
              <nav className="flex space-x-8 mb-4 lg:mb-0">
                {tabs.map((tab) => {
                  const IconComponent = tab.icon
                  return (
                    <button
                      key={tab.id}
                      onClick={() => setActiveTab(tab.id)}
                      className={`flex items-center space-x-2 py-2 px-1 border-b-2 font-medium text-sm whitespace-nowrap ${
                        activeTab === tab.id
                          ? 'border-blue-500 text-blue-600'
                          : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                      }`}
                    >
                      <IconComponent className="w-4 h-4" />
                      <span>{tab.label}</span>
                    </button>
                  )
                })}
              </nav>

              {/* Category Filter */}
              <div className="flex items-center space-x-2">
                <Filter className="w-4 h-4 text-gray-500" />
                <select
                  value={selectedCategory}
                  onChange={(e) => setSelectedCategory(e.target.value)}
                  className="border border-gray-300 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                >
                  {categories.map((category) => (
                    <option key={category.id} value={category.id}>
                      {category.label}
                    </option>
                  ))}
                </select>
              </div>
            </div>
          </div>

          {/* Content Stats */}
          <div className="p-6 bg-gray-50">
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              <div className="text-center">
                <div className="text-2xl font-bold text-gray-900">2.3M</div>
                <div className="text-sm text-gray-600">Total Posts</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-gray-900">12.4K</div>
                <div className="text-sm text-gray-600">Active Creators</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-gray-900">847K</div>
                <div className="text-sm text-gray-600">Interactions Today</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-gray-900">156</div>
                <div className="text-sm text-gray-600">Trending Tags</div>
              </div>
            </div>
          </div>
        </div>

        {/* Content Feed */}
        <div>
          {loading ? (
            <div className="space-y-6">
              {[...Array(5)].map((_, i) => (
                <div key={i} className="bg-white rounded-xl shadow-lg p-6 animate-pulse">
                  <div className="h-4 bg-gray-200 rounded w-3/4 mb-4"></div>
                  <div className="h-32 bg-gray-200 rounded mb-4"></div>
                  <div className="h-4 bg-gray-200 rounded w-1/2"></div>
                </div>
              ))}
            </div>
          ) : error ? (
            <div className="text-center py-12">
              <div className="text-red-500 text-lg mb-2">Error loading content</div>
              <div className="text-gray-400 mb-4">{error}</div>
              <button
                onClick={loadDiscoverContent}
                className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors"
              >
                Try Again
              </button>
            </div>
          ) : (
            <div>
              <h3 className="text-lg font-semibold text-gray-900 mb-4">All Published Content</h3>
              <ContentFeed limit={20} />
            </div>
          )}
        </div>
      </div>
    </div>
  )
}