import React from 'react'
import { Shield, Users, Scale, Crown, User, BarChart } from 'lucide-react'
import { useAuth } from '../../contexts/AuthContext'
import { Link } from 'react-router-dom'

export function Header() {
  const { profile, signOut } = useAuth()

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
              <Link to="/creators" className="hover:text-gold-300 transition-colors">
                Creators
              </Link>
              <Link to="/governance" className="hover:text-gold-300 transition-colors">
                Governance
              </Link>
              <Link to="/proposals" className="hover:text-gold-300 transition-colors">
                Proposals
              </Link>
              <Link to="/disputes" className="hover:text-gold-300 transition-colors">
                Disputes
              </Link>
            </nav>
          </div>

          <div className="flex items-center space-x-4">
            {profile ? (
              <>
                <Link
                  to="/dashboard"
                  className="flex items-center space-x-2 hover:text-gold-300 transition-colors"
                >
                  <BarChart className="w-5 h-5" />
                  <span className="hidden sm:inline">Dashboard</span>
                </Link>
                <div className="flex items-center space-x-2">
                  {getBranchIcon(profile.role)}
                  <span className="text-sm font-medium">{profile.username}</span>
                </div>
                <button
                  onClick={signOut}
                  className="bg-red-600 hover:bg-red-700 px-3 py-1 rounded-md text-sm font-medium transition-colors"
                >
                  Sign Out
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