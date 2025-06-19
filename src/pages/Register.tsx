import React, { useState } from 'react'
import { AuthForm } from '../components/Auth/AuthForm'
import { DatabaseStatus } from '../components/DatabaseStatus'
import { Database } from 'lucide-react'

export function Register() {
  const [showDatabaseStatus, setShowDatabaseStatus] = useState(false)

  return (
    <div className="relative">
      <AuthForm mode="register" />
      
      {/* Database Status Button */}
      <button
        onClick={() => setShowDatabaseStatus(true)}
        className="fixed bottom-4 right-4 bg-blue-600 text-white p-3 rounded-full shadow-lg hover:bg-blue-700 transition-colors z-40"
        title="Check Database Status"
      >
        <Database className="w-6 h-6" />
      </button>

      {/* Database Status Modal */}
      {showDatabaseStatus && (
        <DatabaseStatus onClose={() => setShowDatabaseStatus(false)} />
      )}
    </div>
  )
}