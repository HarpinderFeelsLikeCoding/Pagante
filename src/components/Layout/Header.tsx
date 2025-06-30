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
        return <Users className="w-5 h-5 text-royal-500" />
      case 'judge':
        return <Scale className="w-5 h-5 text-yellow-500" />
      case 'creator':
        return <User className="w-5 h-5 text-royal-500" />
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
    <header className="bg-gradient-to-r from-royal-900 to-royal-800 text-white shadow-2xl border-b-4 border-yellow-400">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          <div className="flex items-center space-x-4">
            <Link to="/" className="flex items-center space-x-3 group">
              {/* Logo Image */}
              <div className="relative">
                <img 
                  src="/black_circle_360x360.png" 
                  alt="Pagante Logo" 
                  className="w-10 h-10 rounded-full shadow-lg group-hover:scale-110 transition-transform duration-300"
                />
                <div className="absolute inset-0 rounded-full bg-yellow-400/20 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
              </div>
              
              {/* Brand Name */}
              <div className="flex items-center space-x-2">
                <span className="text-2xl font-bold bg-gradient-to-r from-yellow-400 to-yellow-300 bg-clip-text text-transparent group-hover:from-yellow-300 group-hover:to-yellow-200 transition-all duration-300">
                  Pagante
                </span>
                <div className="hidden sm:block bg-yellow-400/20 px-2 py-1 rounded-full">
                  <span className="text-xs font-medium text-yellow-300">BETA</span>
                </div>
              </div>
            </Link>
            
            <nav className="hidden md:flex space-x-6 ml-8">
              <Link 
                to="/discover" 
                className="flex items-center space-x-1 hover:text-yellow-300 transition-colors duration-300 group"
              >
                <Compass className="w-4 h-4 group-hover:rotate-12 transition-transform duration-300" />
                <span className="font-medium">Discover</span>
              </Link>
              <Link 
                to="/creators" 
                className="hover:text-yellow-300 transition-colors duration-300 font-medium hover:scale-105 transform transition-transform"
              >
                Creators
              </Link>
              <Link 
                to="/governance" 
                className="hover:text-yellow-300 transition-colors duration-300 font-medium hover:scale-105 transform transition-transform"
              >
                Governance
              </Link>
              <Link 
                to="/disputes" 
                className="hover:text-yellow-300 transition-colors duration-300 font-medium hover:scale-105 transform transition-transform"
              >
                Disputes
              </Link>
            </nav>
          </div>

          <div className="flex items-center space-x-4">
            {/* Only show loading spinner during active operations */}
            {loading && profile ? (
              <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-yellow-400"></div>
            ) : profile ? (
              <>
                <Link
                  to="/dashboard"
                  className="flex items-center space-x-2 hover:text-yellow-300 transition-colors duration-300 group"
                >
                  <BarChart className="w-5 h-5 group-hover:scale-110 transition-transform duration-300" />
                  <span className="hidden sm:inline font-medium">Dashboard</span>
                </Link>
                
                {/* Admin Demo Data Link */}
                {profile.role === 'admin' && (
                  <Link
                    to="/demo-data"
                    className="flex items-center space-x-2 hover:text-yellow-300 transition-colors duration-300 group"
                  >
                    <Database className="w-5 h-5 group-hover:scale-110 transition-transform duration-300" />
                    <span className="hidden sm:inline font-medium">Demo Data</span>
                  </Link>
                )}
                
                <div className="flex items-center space-x-2 bg-royal-800/50 rounded-lg px-3 py-2 border border-yellow-400/30">
                  {getBranchIcon(profile.role)}
                  <span className="text-sm font-medium text-yellow-200">{profile.username}</span>
                </div>
                
                <button
                  onClick={handleSignOut}
                  className="flex items-center space-x-1 bg-gradient-to-r from-red-600 to-red-700 hover:from-red-700 hover:to-red-800 px-3 py-2 rounded-lg text-sm font-medium transition-all duration-300 shadow-lg hover:shadow-xl transform hover:scale-105"
                >
                  <LogOut className="w-4 h-4" />
                  <span className="hidden sm:inline">Sign Out</span>
                </button>
              </>
            ) : (
              <div className="space-x-2">
                <Link
                  to="/login"
                  className="text-white hover:text-yellow-300 px-4 py-2 rounded-lg text-sm font-medium transition-all duration-300 hover:bg-royal-700/50"
                >
                  Sign In
                </Link>
                <Link
                  to="/register"
                  className="bg-gradient-to-r from-yellow-600 to-yellow-700 hover:from-yellow-700 hover:to-yellow-800 text-white px-4 py-2 rounded-lg text-sm font-medium transition-all duration-300 shadow-lg hover:shadow-xl transform hover:scale-105"
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