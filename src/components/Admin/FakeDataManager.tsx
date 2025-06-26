import React, { useState } from 'react'
import { Database, Trash2, Users, FileText, Vote, Scale, DollarSign, CheckCircle, AlertCircle } from 'lucide-react'
import { createFakeData, clearFakeData } from '../../lib/fakeData'

export function FakeDataManager() {
  const [loading, setLoading] = useState(false)
  const [result, setResult] = useState<{ success: boolean; message?: string; error?: string } | null>(null)

  const handleCreateFakeData = async () => {
    setLoading(true)
    setResult(null)
    
    try {
      const result = await createFakeData()
      setResult(result)
    } catch (error: any) {
      setResult({ success: false, error: error.message })
    } finally {
      setLoading(false)
    }
  }

  const handleClearFakeData = async () => {
    if (!confirm('Are you sure you want to clear all fake data? This cannot be undone.')) {
      return
    }

    setLoading(true)
    setResult(null)
    
    try {
      await clearFakeData()
      setResult({ success: true, message: 'Fake data cleared successfully!' })
    } catch (error: any) {
      setResult({ success: false, error: error.message })
    } finally {
      setLoading(false)
    }
  }

  const fakeDataIncludes = [
    { icon: Users, label: '6 Demo Users', description: 'Creators, judges, and admin accounts' },
    { icon: FileText, label: '8 Content Posts', description: 'Articles, videos, images, polls, and audio' },
    { icon: Vote, label: '3 Governance Proposals', description: 'Platform policies and creator rights proposals' },
    { icon: Scale, label: '2 Dispute Cases', description: 'Copyright and revenue sharing disputes' },
    { icon: DollarSign, label: 'Subscription Tiers', description: 'Multiple pricing tiers for each creator' },
    { icon: Database, label: 'Engagement Data', description: 'Likes, comments, votes, and subscriptions' }
  ]

  return (
    <div className="bg-white rounded-xl shadow-lg p-8">
      <div className="text-center mb-8">
        <Database className="w-16 h-16 text-blue-600 mx-auto mb-4" />
        <h2 className="text-3xl font-bold text-gray-900 mb-4">Demo Data Manager</h2>
        <p className="text-xl text-gray-600 max-w-2xl mx-auto">
          Create comprehensive fake data to showcase all platform features for your presentation
        </p>
      </div>

      {/* What's Included */}
      <div className="mb-8">
        <h3 className="text-xl font-semibold text-gray-900 mb-6 text-center">What's Included in Demo Data</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {fakeDataIncludes.map((item, index) => {
            const IconComponent = item.icon
            return (
              <div key={index} className="bg-gray-50 rounded-lg p-6 text-center">
                <IconComponent className="w-8 h-8 text-blue-600 mx-auto mb-3" />
                <div className="font-semibold text-gray-900 mb-2">{item.label}</div>
                <div className="text-sm text-gray-600">{item.description}</div>
              </div>
            )
          })}
        </div>
      </div>

      {/* Demo Users Preview */}
      <div className="mb-8 bg-blue-50 rounded-lg p-6">
        <h4 className="font-semibold text-blue-900 mb-4">Demo User Accounts</h4>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
          <div>
            <div className="font-medium text-blue-800">Elected Creators:</div>
            <div className="text-blue-700">• Sarah Chen (@sarahcreates) - UI/UX Designer</div>
            <div className="text-blue-700">• Luna Rodriguez (@lunamusic) - Musician</div>
          </div>
          <div>
            <div className="font-medium text-blue-800">Regular Creators:</div>
            <div className="text-blue-700">• Marcus Williams (@techmarco) - Tech Educator</div>
            <div className="text-blue-700">• David Park (@davidwrites) - Writer</div>
          </div>
          <div>
            <div className="font-medium text-blue-800">Judicial Branch:</div>
            <div className="text-blue-700">• Judge Emily Smith (@judgesmithlaw)</div>
          </div>
          <div>
            <div className="font-medium text-blue-800">Platform Admin:</div>
            <div className="text-blue-700">• Platform Admin (@pagante_admin)</div>
          </div>
        </div>
      </div>

      {/* Result Display */}
      {result && (
        <div className={`mb-6 p-4 rounded-lg flex items-center space-x-3 ${
          result.success 
            ? 'bg-green-50 border border-green-200' 
            : 'bg-red-50 border border-red-200'
        }`}>
          {result.success ? (
            <CheckCircle className="w-6 h-6 text-green-600 flex-shrink-0" />
          ) : (
            <AlertCircle className="w-6 h-6 text-red-600 flex-shrink-0" />
          )}
          <div>
            <div className={`font-medium ${result.success ? 'text-green-800' : 'text-red-800'}`}>
              {result.success ? 'Success!' : 'Error'}
            </div>
            <div className={`text-sm ${result.success ? 'text-green-700' : 'text-red-700'}`}>
              {result.message || result.error}
            </div>
          </div>
        </div>
      )}

      {/* Action Buttons */}
      <div className="flex flex-col sm:flex-row gap-4 justify-center">
        <button
          onClick={handleCreateFakeData}
          disabled={loading}
          className="bg-gradient-to-r from-blue-600 to-indigo-600 text-white px-8 py-4 rounded-lg font-semibold text-lg hover:from-blue-700 hover:to-indigo-700 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center space-x-2"
        >
          {loading ? (
            <>
              <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
              <span>Creating Demo Data...</span>
            </>
          ) : (
            <>
              <Database className="w-5 h-5" />
              <span>Create Demo Data</span>
            </>
          )}
        </button>

        <button
          onClick={handleClearFakeData}
          disabled={loading}
          className="bg-gradient-to-r from-red-600 to-red-700 text-white px-8 py-4 rounded-lg font-semibold text-lg hover:from-red-700 hover:to-red-800 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center space-x-2"
        >
          <Trash2 className="w-5 h-5" />
          <span>Clear Demo Data</span>
        </button>
      </div>

      <div className="mt-6 text-center text-sm text-gray-500">
        <p>Demo data is safe to create multiple times - it will update existing records.</p>
        <p>This will not affect your real user account or any content you've created.</p>
      </div>
    </div>
  )
}