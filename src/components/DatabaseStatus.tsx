import React, { useState, useEffect } from 'react'
import { Database, CheckCircle, XCircle, AlertTriangle, RefreshCw } from 'lucide-react'
import { testDatabaseConnection } from '../lib/database-test'

interface DatabaseStatusProps {
  onClose: () => void
}

export function DatabaseStatus({ onClose }: DatabaseStatusProps) {
  const [status, setStatus] = useState<'loading' | 'success' | 'error'>('loading')
  const [message, setMessage] = useState('')
  const [details, setDetails] = useState<any>(null)

  useEffect(() => {
    runTest()
  }, [])

  const runTest = async () => {
    setStatus('loading')
    setMessage('Testing database connection...')
    
    const result = await testDatabaseConnection()
    
    if (result.success) {
      setStatus('success')
      setMessage(result.message || 'Database is working correctly')
    } else {
      setStatus('error')
      setMessage(result.error || 'Database test failed')
      setDetails(result.details)
    }
  }

  const getStatusIcon = () => {
    switch (status) {
      case 'loading':
        return <RefreshCw className="w-6 h-6 text-blue-500 animate-spin" />
      case 'success':
        return <CheckCircle className="w-6 h-6 text-green-500" />
      case 'error':
        return <XCircle className="w-6 h-6 text-red-500" />
    }
  }

  const getStatusColor = () => {
    switch (status) {
      case 'loading':
        return 'border-blue-500 bg-blue-50'
      case 'success':
        return 'border-green-500 bg-green-50'
      case 'error':
        return 'border-red-500 bg-red-50'
    }
  }

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-xl p-6 w-full max-w-md">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center space-x-2">
            <Database className="w-6 h-6 text-gray-700" />
            <h3 className="text-lg font-semibold text-gray-900">Database Status</h3>
          </div>
          <button
            onClick={onClose}
            className="text-gray-500 hover:text-gray-700"
          >
            ×
          </button>
        </div>

        <div className={`border-2 rounded-lg p-4 mb-4 ${getStatusColor()}`}>
          <div className="flex items-center space-x-3">
            {getStatusIcon()}
            <div className="flex-1">
              <div className="font-medium text-gray-900">{message}</div>
              {details && (
                <div className="text-sm text-gray-600 mt-2">
                  <details>
                    <summary className="cursor-pointer">View Details</summary>
                    <pre className="mt-2 text-xs bg-gray-100 p-2 rounded overflow-auto">
                      {JSON.stringify(details, null, 2)}
                    </pre>
                  </details>
                </div>
              )}
            </div>
          </div>
        </div>

        {status === 'error' && (
          <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4 mb-4">
            <div className="flex items-start space-x-2">
              <AlertTriangle className="w-5 h-5 text-yellow-600 flex-shrink-0 mt-0.5" />
              <div className="text-sm text-yellow-800">
                <div className="font-medium mb-2">Common Solutions:</div>
                <ul className="list-disc list-inside space-y-1">
                  <li>Check if your .env file exists with correct Supabase credentials</li>
                  <li>Run the database migrations in your Supabase dashboard</li>
                  <li>Verify your Supabase project is active and accessible</li>
                  <li>Check if RLS policies are properly configured</li>
                </ul>
              </div>
            </div>
          </div>
        )}

        <div className="flex space-x-3">
          <button
            onClick={runTest}
            disabled={status === 'loading'}
            className="flex-1 bg-blue-600 text-white px-4 py-2 rounded-lg font-medium hover:bg-blue-700 transition-colors disabled:opacity-50"
          >
            {status === 'loading' ? 'Testing...' : 'Test Again'}
          </button>
          <button
            onClick={onClose}
            className="flex-1 bg-gray-300 text-gray-700 px-4 py-2 rounded-lg font-medium hover:bg-gray-400 transition-colors"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  )
}