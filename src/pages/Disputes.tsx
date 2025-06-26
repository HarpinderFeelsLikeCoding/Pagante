import React, { useState, useEffect } from 'react'
import { Scale, AlertCircle, CheckCircle, Clock, User, Calendar, FileText, Gavel, Filter, Search } from 'lucide-react'
import { supabase, type Dispute, type Profile } from '../lib/supabase'
import { format, formatDistanceToNow } from 'date-fns'

interface DisputeWithProfiles extends Dispute {
  plaintiff: Profile
  defendant: Profile
  assigned_judge?: Profile
}

export function Disputes() {
  const [disputes, setDisputes] = useState<DisputeWithProfiles[]>([])
  const [loading, setLoading] = useState(true)
  const [selectedStatus, setSelectedStatus] = useState('all')
  const [searchQuery, setSearchQuery] = useState('')

  useEffect(() => {
    loadDisputes()
  }, [])

  const loadDisputes = async () => {
    try {
      setLoading(true)
      
      const { data, error } = await supabase
        .from('disputes')
        .select(`
          *,
          plaintiff:plaintiff_id(id, username, full_name, avatar_url),
          defendant:defendant_id(id, username, full_name, avatar_url),
          assigned_judge:assigned_judge_id(id, username, full_name, avatar_url)
        `)
        .order('created_at', { ascending: false })

      if (error) throw error
      setDisputes(data || [])
    } catch (error) {
      console.error('Error loading disputes:', error)
    } finally {
      setLoading(false)
    }
  }

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'open':
        return <AlertCircle className="w-5 h-5 text-red-500" />
      case 'under_review':
        return <Clock className="w-5 h-5 text-yellow-500" />
      case 'resolved':
        return <CheckCircle className="w-5 h-5 text-green-500" />
      case 'dismissed':
        return <CheckCircle className="w-5 h-5 text-gray-500" />
      default:
        return <AlertCircle className="w-5 h-5 text-gray-500" />
    }
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'open':
        return 'bg-red-100 text-red-800 border-red-200'
      case 'under_review':
        return 'bg-yellow-100 text-yellow-800 border-yellow-200'
      case 'resolved':
        return 'bg-green-100 text-green-800 border-green-200'
      case 'dismissed':
        return 'bg-gray-100 text-gray-800 border-gray-200'
      default:
        return 'bg-gray-100 text-gray-800 border-gray-200'
    }
  }

  const filteredDisputes = disputes.filter(dispute => {
    const matchesStatus = selectedStatus === 'all' || dispute.status === selectedStatus
    const matchesSearch = dispute.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         dispute.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         dispute.plaintiff.full_name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         dispute.defendant.full_name.toLowerCase().includes(searchQuery.toLowerCase())
    
    return matchesStatus && matchesSearch
  })

  const statusCounts = {
    all: disputes.length,
    open: disputes.filter(d => d.status === 'open').length,
    under_review: disputes.filter(d => d.status === 'under_review').length,
    resolved: disputes.filter(d => d.status === 'resolved').length,
    dismissed: disputes.filter(d => d.status === 'dismissed').length
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50">
        <div className="bg-gradient-to-r from-purple-600 to-indigo-600 text-white py-16">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
            <Scale className="w-16 h-16 text-purple-200 mx-auto mb-4" />
            <h1 className="text-4xl font-bold mb-4">Dispute Resolution</h1>
            <p className="text-xl text-purple-100">Loading disputes...</p>
          </div>
        </div>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="space-y-6">
            {[...Array(5)].map((_, i) => (
              <div key={i} className="bg-white rounded-xl shadow-lg p-6 animate-pulse">
                <div className="h-6 bg-gray-200 rounded w-3/4 mb-4"></div>
                <div className="h-4 bg-gray-200 rounded w-full mb-2"></div>
                <div className="h-4 bg-gray-200 rounded w-2/3 mb-4"></div>
                <div className="flex space-x-4">
                  <div className="h-8 bg-gray-200 rounded w-24"></div>
                  <div className="h-8 bg-gray-200 rounded w-32"></div>
                </div>
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
      <div className="bg-gradient-to-r from-purple-600 to-indigo-600 text-white py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <Scale className="w-16 h-16 text-purple-200 mx-auto mb-4" />
            <h1 className="text-4xl font-bold mb-4">Dispute Resolution</h1>
            <p className="text-xl text-purple-100 mb-8 max-w-2xl mx-auto">
              Fair and transparent resolution of conflicts through our independent judicial system
            </p>
            
            {/* Stats */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 max-w-3xl mx-auto">
              <div className="bg-white/10 rounded-lg p-4">
                <div className="text-2xl font-bold">{statusCounts.all}</div>
                <div className="text-purple-100 text-sm">Total Cases</div>
              </div>
              <div className="bg-white/10 rounded-lg p-4">
                <div className="text-2xl font-bold">{statusCounts.open + statusCounts.under_review}</div>
                <div className="text-purple-100 text-sm">Active Cases</div>
              </div>
              <div className="bg-white/10 rounded-lg p-4">
                <div className="text-2xl font-bold">{statusCounts.resolved}</div>
                <div className="text-purple-100 text-sm">Resolved</div>
              </div>
              <div className="bg-white/10 rounded-lg p-4">
                <div className="text-2xl font-bold">
                  {statusCounts.resolved > 0 ? Math.round((statusCounts.resolved / statusCounts.all) * 100) : 0}%
                </div>
                <div className="text-purple-100 text-sm">Success Rate</div>
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
                className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                placeholder="Search disputes..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>

            {/* Status Filter */}
            <div className="flex items-center space-x-2">
              <Filter className="w-4 h-4 text-gray-500" />
              <select
                value={selectedStatus}
                onChange={(e) => setSelectedStatus(e.target.value)}
                className="border border-gray-300 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-purple-500 focus:border-transparent"
              >
                <option value="all">All Status ({statusCounts.all})</option>
                <option value="open">Open ({statusCounts.open})</option>
                <option value="under_review">Under Review ({statusCounts.under_review})</option>
                <option value="resolved">Resolved ({statusCounts.resolved})</option>
                <option value="dismissed">Dismissed ({statusCounts.dismissed})</option>
              </select>
            </div>
          </div>
        </div>

        {/* Disputes List */}
        <div className="space-y-6">
          {filteredDisputes.length === 0 ? (
            <div className="text-center py-12">
              <Scale className="w-16 h-16 text-gray-400 mx-auto mb-4" />
              <div className="text-xl text-gray-600 mb-2">No disputes found</div>
              <div className="text-gray-500">Try adjusting your search or filters</div>
            </div>
          ) : (
            filteredDisputes.map((dispute) => (
              <div key={dispute.id} className="bg-white rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 overflow-hidden">
                <div className="p-6">
                  {/* Header */}
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex-1">
                      <div className="flex items-center space-x-3 mb-2">
                        <h3 className="text-xl font-bold text-gray-900">{dispute.title}</h3>
                        <div className={`px-3 py-1 rounded-full text-xs font-medium border ${getStatusColor(dispute.status)}`}>
                          <div className="flex items-center space-x-1">
                            {getStatusIcon(dispute.status)}
                            <span className="capitalize">{dispute.status.replace('_', ' ')}</span>
                          </div>
                        </div>
                      </div>
                      <p className="text-gray-600 mb-4">{dispute.description}</p>
                    </div>
                  </div>

                  {/* Parties Involved */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                    <div className="bg-red-50 rounded-lg p-4">
                      <div className="flex items-center space-x-2 mb-2">
                        <User className="w-4 h-4 text-red-600" />
                        <span className="text-sm font-medium text-red-800">Plaintiff</span>
                      </div>
                      <div className="flex items-center space-x-3">
                        <div className="w-8 h-8 bg-red-100 rounded-full flex items-center justify-center text-sm font-bold text-red-600">
                          {dispute.plaintiff.full_name.charAt(0)}
                        </div>
                        <div>
                          <div className="font-medium text-gray-900">{dispute.plaintiff.full_name}</div>
                          <div className="text-sm text-gray-600">@{dispute.plaintiff.username}</div>
                        </div>
                      </div>
                    </div>

                    <div className="bg-blue-50 rounded-lg p-4">
                      <div className="flex items-center space-x-2 mb-2">
                        <User className="w-4 h-4 text-blue-600" />
                        <span className="text-sm font-medium text-blue-800">Defendant</span>
                      </div>
                      <div className="flex items-center space-x-3">
                        <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center text-sm font-bold text-blue-600">
                          {dispute.defendant.full_name.charAt(0)}
                        </div>
                        <div>
                          <div className="font-medium text-gray-900">{dispute.defendant.full_name}</div>
                          <div className="text-sm text-gray-600">@{dispute.defendant.username}</div>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Judge Assignment */}
                  {dispute.assigned_judge && (
                    <div className="bg-purple-50 rounded-lg p-4 mb-6">
                      <div className="flex items-center space-x-2 mb-2">
                        <Gavel className="w-4 h-4 text-purple-600" />
                        <span className="text-sm font-medium text-purple-800">Assigned Judge</span>
                      </div>
                      <div className="flex items-center space-x-3">
                        <div className="w-8 h-8 bg-purple-100 rounded-full flex items-center justify-center text-sm font-bold text-purple-600">
                          {dispute.assigned_judge.full_name.charAt(0)}
                        </div>
                        <div>
                          <div className="font-medium text-gray-900">{dispute.assigned_judge.full_name}</div>
                          <div className="text-sm text-gray-600">@{dispute.assigned_judge.username}</div>
                        </div>
                      </div>
                    </div>
                  )}

                  {/* Resolution */}
                  {dispute.resolution && (
                    <div className="bg-green-50 border border-green-200 rounded-lg p-4 mb-6">
                      <div className="flex items-center space-x-2 mb-2">
                        <CheckCircle className="w-4 h-4 text-green-600" />
                        <span className="text-sm font-medium text-green-800">Resolution</span>
                      </div>
                      <p className="text-gray-700">{dispute.resolution}</p>
                      {dispute.resolved_at && (
                        <div className="text-xs text-green-600 mt-2">
                          Resolved {formatDistanceToNow(new Date(dispute.resolved_at), { addSuffix: true })}
                        </div>
                      )}
                    </div>
                  )}

                  {/* Timeline */}
                  <div className="flex items-center justify-between text-sm text-gray-500 pt-4 border-t border-gray-200">
                    <div className="flex items-center space-x-4">
                      <div className="flex items-center space-x-1">
                        <Calendar className="w-4 h-4" />
                        <span>Filed {format(new Date(dispute.created_at), 'MMM d, yyyy')}</span>
                      </div>
                      <div className="flex items-center space-x-1">
                        <Clock className="w-4 h-4" />
                        <span>{formatDistanceToNow(new Date(dispute.created_at), { addSuffix: true })}</span>
                      </div>
                    </div>
                    
                    <div className="flex items-center space-x-1">
                      <FileText className="w-4 h-4" />
                      <span>Case #{dispute.id.slice(0, 8)}</span>
                    </div>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>

        {/* How Disputes Work */}
        <div className="mt-12 bg-white rounded-xl shadow-lg p-8">
          <h3 className="text-2xl font-bold text-gray-900 mb-6 text-center">How Our Dispute Resolution Works</h3>
          
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            <div className="text-center">
              <div className="w-12 h-12 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <FileText className="w-6 h-6 text-red-600" />
              </div>
              <h4 className="font-semibold text-gray-900 mb-2">1. File Dispute</h4>
              <p className="text-sm text-gray-600">Submit a detailed dispute with evidence and documentation</p>
            </div>
            
            <div className="text-center">
              <div className="w-12 h-12 bg-yellow-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <Gavel className="w-6 h-6 text-yellow-600" />
              </div>
              <h4 className="font-semibold text-gray-900 mb-2">2. Judge Assignment</h4>
              <p className="text-sm text-gray-600">Independent judge reviews case and gathers information</p>
            </div>
            
            <div className="text-center">
              <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <Scale className="w-6 h-6 text-blue-600" />
              </div>
              <h4 className="font-semibold text-gray-900 mb-2">3. Fair Review</h4>
              <p className="text-sm text-gray-600">Both parties present their case with evidence and witnesses</p>
            </div>
            
            <div className="text-center">
              <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <CheckCircle className="w-6 h-6 text-green-600" />
              </div>
              <h4 className="font-semibold text-gray-900 mb-2">4. Resolution</h4>
              <p className="text-sm text-gray-600">Judge issues binding decision with clear reasoning</p>
            </div>
          </div>
        </div>

        {/* Call to Action */}
        <div className="mt-8 bg-gradient-to-r from-purple-600 to-indigo-600 rounded-xl p-8 text-center text-white">
          <h3 className="text-2xl font-bold mb-4">Need to File a Dispute?</h3>
          <p className="text-purple-100 mb-6 max-w-2xl mx-auto">
            Our independent judicial system ensures fair resolution of conflicts between creators and users.
          </p>
          <button className="bg-white text-purple-600 px-8 py-3 rounded-lg font-semibold hover:bg-gray-100 transition-colors">
            File a Dispute
          </button>
        </div>
      </div>
    </div>
  )
}