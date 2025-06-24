import React, { useState, useEffect } from 'react'
import { useAuth } from '../contexts/AuthContext'
import { supabase, type Creator, contentService } from '../lib/supabase'
import { ContentCreator } from '../components/Content/ContentCreator'
import { ContentFeed } from '../components/Content/ContentFeed'
import { LiveStreamManager } from '../components/Streaming/LiveStreamManager'
import { SubscriptionTiers } from '../components/Subscriptions/SubscriptionTiers'
import { 
  BarChart, Users, DollarSign, Eye, Settings, TrendingUp, Heart, MessageCircle, 
  Plus, Calendar, Bell, Gift, Target, Zap, Star, Crown, Award, Activity,
  FileText, Video, Image, Headphones, Radio, Download, BarChart3, PieChart,
  ArrowUp, ArrowDown, Clock, CheckCircle, AlertCircle
} from 'lucide-react'
import { useNavigate } from 'react-router-dom'
import { format, subDays, startOfMonth, endOfMonth } from 'date-fns'

export function CreatorDashboard() {
  const { profile, loading: authLoading, user } = useAuth()
  const navigate = useNavigate()
  const [creator, setCreator] = useState<Creator | null>(null)
  const [activeTab, setActiveTab] = useState('home')
  const [loadingCreator, setLoadingCreator] = useState(false)
  const [error, setError] = useState('')
  const [analytics, setAnalytics] = useState({
    totalEarnings: 2456,
    monthlyGrowth: 12.5,
    totalPatrons: 1234,
    patronGrowth: 8.3,
    totalPosts: 45,
    postGrowth: 15.2,
    engagementRate: 8.4,
    engagementGrowth: 2.1
  })

  useEffect(() => {
    if (!authLoading && !user) {
      console.log('No user found, redirecting to login')
      navigate('/login')
      return
    }

    if (profile && !creator && !loadingCreator && !error) {
      loadCreatorProfile()
    }
  }, [profile, authLoading, user, navigate, creator, loadingCreator, error])

  const loadCreatorProfile = async () => {
    if (!profile) return

    try {
      setLoadingCreator(true)
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
      setLoadingCreator(false)
    }
  }

  const refreshContent = () => {
    window.location.reload()
  }

  const tabs = [
    { id: 'home', label: 'Home', icon: BarChart },
    { id: 'posts', label: 'Posts', icon: FileText },
    { id: 'patrons', label: 'Patrons', icon: Users },
    { id: 'earnings', label: 'Earnings', icon: DollarSign },
    { id: 'analytics', label: 'Analytics', icon: TrendingUp },
    { id: 'settings', label: 'Settings', icon: Settings },
  ]

  const quickStats = [
    { 
      label: 'Monthly Earnings', 
      value: `$${analytics.totalEarnings.toLocaleString()}`, 
      change: `+${analytics.monthlyGrowth}%`, 
      changeType: 'positive',
      icon: DollarSign,
      color: 'text-green-600',
      bgColor: 'bg-green-100'
    },
    { 
      label: 'Total Patrons', 
      value: analytics.totalPatrons.toLocaleString(), 
      change: `+${analytics.patronGrowth}%`, 
      changeType: 'positive',
      icon: Users,
      color: 'text-blue-600',
      bgColor: 'bg-blue-100'
    },
    { 
      label: 'Posts This Month', 
      value: analytics.totalPosts.toString(), 
      change: `+${analytics.postGrowth}%`, 
      changeType: 'positive',
      icon: FileText,
      color: 'text-purple-600',
      bgColor: 'bg-purple-100'
    },
    { 
      label: 'Engagement Rate', 
      value: `${analytics.engagementRate}%`, 
      change: `+${analytics.engagementGrowth}%`, 
      changeType: 'positive',
      icon: Heart,
      color: 'text-pink-600',
      bgColor: 'bg-pink-100'
    },
  ]

  const recentActivity = [
    { type: 'patron', user: 'Alice Johnson', action: 'became a $25/month patron', time: '2 hours ago', amount: '$25' },
    { type: 'comment', user: 'Bob Smith', action: 'commented on "Getting Started"', time: '4 hours ago' },
    { type: 'like', user: 'Carol Davis', action: 'liked your latest post', time: '6 hours ago' },
    { type: 'patron', user: 'David Wilson', action: 'upgraded to $50/month tier', time: '1 day ago', amount: '$50' },
    { type: 'message', user: 'Emma Brown', action: 'sent you a message', time: '1 day ago' },
  ]

  const upcomingGoals = [
    { title: 'Reach 1,500 patrons', current: 1234, target: 1500, reward: 'Weekly live streams' },
    { title: 'Monthly earnings goal', current: 2456, target: 3000, reward: 'Bonus content series' },
  ]

  if (loadingCreator) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <div className="text-gray-600">Loading creator profile...</div>
        </div>
      </div>
    )
  }

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

  if (!profile || !creator) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <div className="text-gray-600">Loading dashboard...</div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b border-gray-200 sticky top-0 z-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center space-x-4">
              <h1 className="text-2xl font-bold text-gray-900">Creator Studio</h1>
              <div className="hidden md:flex items-center space-x-2 bg-blue-50 px-3 py-1 rounded-full">
                <Crown className="w-4 h-4 text-blue-600" />
                <span className="text-sm font-medium text-blue-800">Pro Creator</span>
              </div>
            </div>
            
            <div className="flex items-center space-x-4">
              <button className="relative p-2 text-gray-400 hover:text-gray-600 transition-colors">
                <Bell className="w-5 h-5" />
                <span className="absolute top-0 right-0 w-2 h-2 bg-red-500 rounded-full"></span>
              </button>
              
              <button
                onClick={() => setActiveTab('posts')}
                className="bg-gradient-to-r from-blue-600 to-indigo-600 text-white px-4 py-2 rounded-lg font-medium hover:from-blue-700 hover:to-indigo-700 transition-all duration-300 flex items-center space-x-2"
              >
                <Plus className="w-4 h-4" />
                <span>Create Post</span>
              </button>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Navigation Tabs */}
        <div className="bg-white rounded-xl shadow-sm mb-8 overflow-hidden">
          <nav className="flex space-x-0">
            {tabs.map((tab) => {
              const IconComponent = tab.icon
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`flex items-center space-x-2 px-6 py-4 font-medium text-sm transition-all duration-200 border-b-2 ${
                    activeTab === tab.id
                      ? 'border-blue-500 text-blue-600 bg-blue-50'
                      : 'border-transparent text-gray-500 hover:text-gray-700 hover:bg-gray-50'
                  }`}
                >
                  <IconComponent className="w-5 h-5" />
                  <span>{tab.label}</span>
                </button>
              )
            })}
          </nav>
        </div>

        {/* Tab Content */}
        {activeTab === 'home' && (
          <div className="space-y-8">
            {/* Welcome Section */}
            <div className="bg-gradient-to-r from-blue-600 to-indigo-600 rounded-xl p-8 text-white">
              <div className="flex items-center justify-between">
                <div>
                  <h2 className="text-3xl font-bold mb-2">Welcome back, {profile.full_name}!</h2>
                  <p className="text-blue-100 text-lg">Here's what's happening with your creator page</p>
                </div>
                <div className="hidden md:block">
                  <div className="w-24 h-24 bg-white/20 rounded-full flex items-center justify-center">
                    <Crown className="w-12 h-12 text-yellow-300" />
                  </div>
                </div>
              </div>
            </div>

            {/* Quick Stats */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {quickStats.map((stat, index) => {
                const IconComponent = stat.icon
                return (
                  <div key={index} className="bg-white rounded-xl shadow-sm p-6 hover:shadow-md transition-shadow">
                    <div className="flex items-center justify-between mb-4">
                      <div className={`p-3 ${stat.bgColor} rounded-lg`}>
                        <IconComponent className={`w-6 h-6 ${stat.color}`} />
                      </div>
                      <div className={`flex items-center space-x-1 text-sm ${
                        stat.changeType === 'positive' ? 'text-green-600' : 'text-red-600'
                      }`}>
                        {stat.changeType === 'positive' ? (
                          <ArrowUp className="w-4 h-4" />
                        ) : (
                          <ArrowDown className="w-4 h-4" />
                        )}
                        <span>{stat.change}</span>
                      </div>
                    </div>
                    <div className="text-2xl font-bold text-gray-900 mb-1">{stat.value}</div>
                    <div className="text-sm text-gray-600">{stat.label}</div>
                  </div>
                )
              })}
            </div>

            {/* Goals Section */}
            <div className="bg-white rounded-xl shadow-sm p-6">
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-xl font-bold text-gray-900 flex items-center space-x-2">
                  <Target className="w-6 h-6 text-blue-600" />
                  <span>Your Goals</span>
                </h3>
                <button className="text-blue-600 hover:text-blue-700 font-medium text-sm">
                  Manage Goals
                </button>
              </div>
              
              <div className="space-y-6">
                {upcomingGoals.map((goal, index) => {
                  const progress = (goal.current / goal.target) * 100
                  return (
                    <div key={index} className="border border-gray-200 rounded-lg p-4">
                      <div className="flex items-center justify-between mb-2">
                        <h4 className="font-semibold text-gray-900">{goal.title}</h4>
                        <span className="text-sm text-gray-600">
                          {goal.current.toLocaleString()} / {goal.target.toLocaleString()}
                        </span>
                      </div>
                      <div className="w-full bg-gray-200 rounded-full h-2 mb-2">
                        <div 
                          className="bg-blue-600 h-2 rounded-full transition-all duration-300"
                          style={{ width: `${Math.min(progress, 100)}%` }}
                        />
                      </div>
                      <div className="flex items-center justify-between text-sm">
                        <span className="text-gray-600">Reward: {goal.reward}</span>
                        <span className="font-medium text-blue-600">{progress.toFixed(1)}%</span>
                      </div>
                    </div>
                  )
                })}
              </div>
            </div>

            {/* Recent Activity & Quick Actions */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              {/* Recent Activity */}
              <div className="bg-white rounded-xl shadow-sm p-6">
                <h3 className="text-xl font-bold text-gray-900 mb-6 flex items-center space-x-2">
                  <Activity className="w-6 h-6 text-green-600" />
                  <span>Recent Activity</span>
                </h3>
                <div className="space-y-4">
                  {recentActivity.map((activity, index) => (
                    <div key={index} className="flex items-start space-x-3 p-3 hover:bg-gray-50 rounded-lg transition-colors">
                      <div className={`w-2 h-2 rounded-full mt-2 ${
                        activity.type === 'patron' ? 'bg-green-500' :
                        activity.type === 'comment' ? 'bg-blue-500' :
                        activity.type === 'like' ? 'bg-pink-500' :
                        'bg-gray-500'
                      }`} />
                      <div className="flex-1">
                        <div className="text-sm text-gray-900">
                          <span className="font-medium">{activity.user}</span> {activity.action}
                          {activity.amount && (
                            <span className="ml-2 bg-green-100 text-green-800 px-2 py-1 rounded-full text-xs font-medium">
                              {activity.amount}
                            </span>
                          )}
                        </div>
                        <div className="text-xs text-gray-500 flex items-center space-x-1">
                          <Clock className="w-3 h-3" />
                          <span>{activity.time}</span>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Quick Actions */}
              <div className="bg-white rounded-xl shadow-sm p-6">
                <h3 className="text-xl font-bold text-gray-900 mb-6 flex items-center space-x-2">
                  <Zap className="w-6 h-6 text-yellow-600" />
                  <span>Quick Actions</span>
                </h3>
                <div className="grid grid-cols-2 gap-4">
                  <button
                    onClick={() => setActiveTab('posts')}
                    className="p-4 border-2 border-dashed border-gray-300 rounded-lg hover:border-blue-500 hover:bg-blue-50 transition-all duration-200 group"
                  >
                    <FileText className="w-8 h-8 text-gray-400 group-hover:text-blue-600 mx-auto mb-2" />
                    <div className="text-sm font-medium text-gray-700 group-hover:text-blue-700">Create Post</div>
                  </button>
                  
                  <button className="p-4 border-2 border-dashed border-gray-300 rounded-lg hover:border-green-500 hover:bg-green-50 transition-all duration-200 group">
                    <Users className="w-8 h-8 text-gray-400 group-hover:text-green-600 mx-auto mb-2" />
                    <div className="text-sm font-medium text-gray-700 group-hover:text-green-700">Message Patrons</div>
                  </button>
                  
                  <button className="p-4 border-2 border-dashed border-gray-300 rounded-lg hover:border-purple-500 hover:bg-purple-50 transition-all duration-200 group">
                    <Radio className="w-8 h-8 text-gray-400 group-hover:text-purple-600 mx-auto mb-2" />
                    <div className="text-sm font-medium text-gray-700 group-hover:text-purple-700">Go Live</div>
                  </button>
                  
                  <button className="p-4 border-2 border-dashed border-gray-300 rounded-lg hover:border-orange-500 hover:bg-orange-50 transition-all duration-200 group">
                    <Gift className="w-8 h-8 text-gray-400 group-hover:text-orange-600 mx-auto mb-2" />
                    <div className="text-sm font-medium text-gray-700 group-hover:text-orange-700">Create Reward</div>
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}

        {activeTab === 'posts' && (
          <div className="space-y-8">
            <div className="bg-white rounded-xl shadow-sm p-6">
              <h3 className="text-xl font-bold text-gray-900 mb-6">Create New Post</h3>
              <ContentCreator 
                creatorId={creator.id} 
                onContentCreated={refreshContent} 
              />
            </div>
            
            <div className="bg-white rounded-xl shadow-sm p-6">
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-xl font-bold text-gray-900">Your Posts</h3>
                <div className="flex items-center space-x-2">
                  <select className="border border-gray-300 rounded-lg px-3 py-2 text-sm">
                    <option>All Posts</option>
                    <option>Published</option>
                    <option>Drafts</option>
                    <option>Scheduled</option>
                  </select>
                </div>
              </div>
              <ContentFeed creatorId={creator.id} showScheduled={true} />
            </div>
          </div>
        )}

        {activeTab === 'patrons' && (
          <div className="space-y-8">
            <div className="bg-white rounded-xl shadow-sm p-6">
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-xl font-bold text-gray-900">Patron Management</h3>
                <button className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors">
                  Message All Patrons
                </button>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                <div className="bg-gradient-to-r from-green-500 to-green-600 rounded-lg p-6 text-white">
                  <div className="text-3xl font-bold">1,234</div>
                  <div className="text-green-100">Total Patrons</div>
                </div>
                <div className="bg-gradient-to-r from-blue-500 to-blue-600 rounded-lg p-6 text-white">
                  <div className="text-3xl font-bold">$2,456</div>
                  <div className="text-blue-100">Monthly Revenue</div>
                </div>
                <div className="bg-gradient-to-r from-purple-500 to-purple-600 rounded-lg p-6 text-white">
                  <div className="text-3xl font-bold">$19.90</div>
                  <div className="text-purple-100">Avg. per Patron</div>
                </div>
              </div>

              <SubscriptionTiers creatorId={creator.id} isOwner={true} />
            </div>
          </div>
        )}

        {activeTab === 'earnings' && (
          <div className="space-y-8">
            <div className="bg-white rounded-xl shadow-sm p-6">
              <h3 className="text-xl font-bold text-gray-900 mb-6">Earnings Overview</h3>
              
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
                <div className="bg-green-50 rounded-lg p-6">
                  <div className="text-2xl font-bold text-green-600">$2,456</div>
                  <div className="text-sm text-gray-600">This Month</div>
                  <div className="text-xs text-green-600 mt-1">+12.5% from last month</div>
                </div>
                <div className="bg-blue-50 rounded-lg p-6">
                  <div className="text-2xl font-bold text-blue-600">$28,340</div>
                  <div className="text-sm text-gray-600">This Year</div>
                  <div className="text-xs text-blue-600 mt-1">+23.1% from last year</div>
                </div>
                <div className="bg-purple-50 rounded-lg p-6">
                  <div className="text-2xl font-bold text-purple-600">$1,890</div>
                  <div className="text-sm text-gray-600">Available</div>
                  <div className="text-xs text-gray-500 mt-1">Ready for payout</div>
                </div>
                <div className="bg-orange-50 rounded-lg p-6">
                  <div className="text-2xl font-bold text-orange-600">$566</div>
                  <div className="text-sm text-gray-600">Pending</div>
                  <div className="text-xs text-gray-500 mt-1">Processing</div>
                </div>
              </div>

              <div className="bg-gray-50 rounded-lg p-6">
                <h4 className="font-semibold text-gray-900 mb-4">Recent Transactions</h4>
                <div className="space-y-3">
                  {[
                    { date: 'Dec 15, 2024', description: 'Monthly patron payments', amount: '+$2,456', status: 'completed' },
                    { date: 'Dec 10, 2024', description: 'Payout to bank account', amount: '-$1,890', status: 'completed' },
                    { date: 'Dec 8, 2024', description: 'Platform fee', amount: '-$245', status: 'completed' },
                    { date: 'Dec 5, 2024', description: 'Tip from @alice_j', amount: '+$25', status: 'completed' },
                  ].map((transaction, index) => (
                    <div key={index} className="flex items-center justify-between p-3 bg-white rounded-lg">
                      <div>
                        <div className="font-medium text-gray-900">{transaction.description}</div>
                        <div className="text-sm text-gray-500">{transaction.date}</div>
                      </div>
                      <div className="flex items-center space-x-2">
                        <span className={`font-semibold ${
                          transaction.amount.startsWith('+') ? 'text-green-600' : 'text-red-600'
                        }`}>
                          {transaction.amount}
                        </span>
                        <CheckCircle className="w-4 h-4 text-green-500" />
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        )}

        {activeTab === 'analytics' && (
          <div className="space-y-8">
            <div className="bg-white rounded-xl shadow-sm p-6">
              <h3 className="text-xl font-bold text-gray-900 mb-6">Analytics Dashboard</h3>
              
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                <div className="bg-gray-50 rounded-lg p-6">
                  <h4 className="font-semibold text-gray-900 mb-4 flex items-center space-x-2">
                    <BarChart3 className="w-5 h-5 text-blue-600" />
                    <span>Patron Growth</span>
                  </h4>
                  <div className="h-64 flex items-center justify-center text-gray-500">
                    Chart visualization would go here
                  </div>
                </div>
                
                <div className="bg-gray-50 rounded-lg p-6">
                  <h4 className="font-semibold text-gray-900 mb-4 flex items-center space-x-2">
                    <PieChart className="w-5 h-5 text-green-600" />
                    <span>Revenue Breakdown</span>
                  </h4>
                  <div className="h-64 flex items-center justify-center text-gray-500">
                    Chart visualization would go here
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {activeTab === 'settings' && (
          <div className="space-y-8">
            <div className="bg-white rounded-xl shadow-sm p-6">
              <h3 className="text-xl font-bold text-gray-900 mb-6">Creator Settings</h3>
              
              <div className="space-y-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Creator Page Description
                  </label>
                  <textarea
                    rows={4}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="Tell your audience about yourself and what you create..."
                    defaultValue={creator.description}
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Creator Category
                  </label>
                  <select className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent">
                    <option>Art & Design</option>
                    <option>Music & Audio</option>
                    <option>Video & Film</option>
                    <option>Writing & Publishing</option>
                    <option>Technology</option>
                    <option>Education</option>
                    <option>Gaming</option>
                    <option>Other</option>
                  </select>
                </div>
                
                <div className="flex items-center space-x-4">
                  <input type="checkbox" id="public-profile" className="rounded" />
                  <label htmlFor="public-profile" className="text-sm text-gray-700">
                    Make my creator page public
                  </label>
                </div>
                
                <div className="flex items-center space-x-4">
                  <input type="checkbox" id="email-notifications" className="rounded" defaultChecked />
                  <label htmlFor="email-notifications" className="text-sm text-gray-700">
                    Email notifications for new patrons
                  </label>
                </div>
                
                <button className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition-colors">
                  Save Changes
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}