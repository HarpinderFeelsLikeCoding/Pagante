import React from 'react'
import { FakeDataManager } from '../components/Admin/FakeDataManager'
import { useAuth } from '../contexts/AuthContext'
import { Navigate } from 'react-router-dom'

export function DemoData() {
  const { profile, loading } = useAuth()

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <div className="text-gray-600">Loading...</div>
        </div>
      </div>
    )
  }

  // Only allow admin users to access this page
  if (!profile || profile.role !== 'admin') {
    return <Navigate to="/" replace />
  }

  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <FakeDataManager />
      </div>
    </div>
  )
}