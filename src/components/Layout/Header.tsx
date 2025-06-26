import React from 'react'
import { Shield, Users, Scale, Crown, User, BarChart, LogOut, Compass, Database } from 'lucide-react'
import { useAuth } from '../../contexts/AuthContext'
import { Link, useNavigate } from 'react-router-dom'

export function Header() {
  const { profile, signOut, loading } = useAuth()
  const navigate = useNavigate()

  const getBranchIcon = (role: string) => {
    switch (role) {
      case 'admin':
        return <Crown className="w-5 h-5 text-yellow-500" />
      case 'elected_creator':
        return <Users className="w-5 h-5 text-blue-500" />
      case 'judge':
        return <Scale className="w-5 h-5 text-purple-500" />
      case 'creator':
        return <User className="w-5 h-5 text-green-500" />
      default:
        return <Shield className="w-5 h-5 text-gray-500" />
    }
  }

  const handleSignOut = async () => {
    try {
      await signOut()
      navigate('/')
    } catch (error) {
      console.error('Error signing out:', error)
    }
  }

  return (
    <header className="bg-gradient-to-r from-navy-900 to-navy-800 text-white shadow-lg">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          <div className="flex items-center space-x-4">
            <Link to="/" className="flex items-center space-x-2">
              <Shield className="w-8 h-8 text-gold-400" />
              <span className="text-xl font-bold">Pagante</span>
            </Link>
            <nav className="hidden md:flex space-x-6">
              <Link to="/discover" className="flex items-center space-x-1 hover:text-gold-300 transition-colors">
                <Compass className="w-4 h-4" />
                <span>Discover</span>
              </Link>
              <Link to="/creators" className="hover:text-gold-300 transition-colors">
                Creators
              </Link>
              <Link to="/governance" className="hover:text-gold-300 transition-colors">
                Governance
              </Link>
              <Link to="/disputes" className="hover:text-gold-300 transition-colors">
                Disputes
              </Link>
            </nav>
          </div>

          <div className="flex items-center space-x-4">
            {/* Only show loading spinner during active operations */}
            {loading && profile ? (
              <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-gold-400"></div>
            ) : profile ? (
              <>
                <Link
                  to="/dashboard"
                  className="flex items-center space-x-2 hover:text-gold-300 transition-colors"
                >
                  <BarChart className="w-5 h-5" />
                  <span className="hidden sm:inline">Dashboard</span>
                </Link>
                
                {/* Admin Demo Data Link */}
                {profile.role === 'admin' && (
                  <Link
                    to="/demo-data"
                    className="flex items-center space-x-2 hover:text-gold-300 transition-colors"
                  >
                    <Database className="w-5 h-5" />
                    <span className="hidden sm:inline">Demo Data</span>
                  </Link>
                )}
                
                <div className="flex items-center space-x-2">
                  {getBranchIcon(profile.role)}
                  <span className="text-sm font-medium">{profile.username}</span>
                </div>
                <button
                  onClick={handleSignOut}
                  className="flex items-center space-x-1 bg-red-600 hover:bg-red-700 px-3 py-1 rounded-md text-sm font-medium transition-colors"
                >
                  <LogOut className="w-4 h-4" />
                  <span className="hidden sm:inline">Sign Out</span>
                </button>
              </>
            ) : (
              <div className="space-x-2">
                <Link
                  to="/login"
                  className="text-white hover:text-gold-300 px-3 py-2 rounded-md text-sm font-medium"
                >
                  Sign In
                </Link>
                <Link
                  to="/register"
                  className="bg-gold-600 hover:bg-gold-700 text-white px-3 py-2 rounded-md text-sm font-medium"
                >
                  Sign Up
                </Link>
              </div>
            )}
          </div>
        </div>
      </div>
    </header>
  )
}