import React, { useState, useEffect } from 'react'
import { useAuth } from '../../contexts/AuthContext'
import { Shield, Mail, Lock, User, AlertCircle, CheckCircle } from 'lucide-react'
import { useNavigate } from 'react-router-dom'

interface AuthFormProps {
  mode: 'login' | 'register'
}

export function AuthForm({ mode }: AuthFormProps) {
  const { signIn, signUp, user, profile, loading: authLoading } = useAuth()
  const navigate = useNavigate()
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    username: '',
    fullName: '',
  })
  const [error, setError] = useState('')
  const [success, setSuccess] = useState('')
  const [loading, setLoading] = useState(false)

  // Redirect if already authenticated
  useEffect(() => {
    if (user && profile && !authLoading) {
      console.log('User already authenticated, redirecting to dashboard')
      navigate('/dashboard')
    }
  }, [user, profile, authLoading, navigate])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')
    setSuccess('')
    setLoading(true)

    try {
      if (mode === 'login') {
        await signIn(formData.email, formData.password)
        setSuccess('Successfully signed in! Redirecting...')
        // Wait a moment for auth state to update, then navigate
        setTimeout(() => {
          navigate('/dashboard')
        }, 1000)
      } else {
        // Validate required fields for registration
        if (!formData.username.trim()) {
          throw new Error('Username is required')
        }
        if (!formData.fullName.trim()) {
          throw new Error('Full name is required')
        }
        if (formData.username.length < 3) {
          throw new Error('Username must be at least 3 characters long')
        }
        if (formData.password.length < 6) {
          throw new Error('Password must be at least 6 characters long')
        }

        await signUp(formData.email, formData.password, {
          username: formData.username.trim(),
          full_name: formData.fullName.trim(),
          role: 'user',
        })
        
        setSuccess('Account created successfully! Redirecting...')
        // Wait a moment for auth state to update, then navigate
        setTimeout(() => {
          navigate('/dashboard')
        }, 1000)
      }
    } catch (err: any) {
      console.error('Auth error:', err)
      setError(err.message || 'An unexpected error occurred')
    } finally {
      setLoading(false)
    }
  }

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, type, checked, value } = e.target
    setFormData({
      ...formData,
      [name]: type === 'checkbox' ? checked : value,
    })
  }

  // Show loading state if auth is processing
  const isLoading = loading || authLoading

  // Show loading screen if already authenticated
  if (user && profile && !authLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-navy-900 via-navy-800 to-blue-900 flex items-center justify-center">
        <div className="text-center text-white">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-gold-400 mx-auto mb-4"></div>
          <div className="text-lg">Redirecting to dashboard...</div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-navy-900 via-navy-800 to-blue-900 flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8">
        <div className="text-center">
          <div className="flex justify-center">
            <Shield className="w-16 h-16 text-gold-400" />
          </div>
          <h2 className="mt-6 text-3xl font-extrabold text-white">
            {mode === 'login' ? 'Sign in to your account' : 'Create your account'}
          </h2>
          <p className="mt-2 text-sm text-gray-300">
            {mode === 'login' 
              ? 'Welcome back to Pagante' 
              : 'Join the democratic creator platform'
            }
          </p>
          
          {/* Session info notice */}
          <div className="mt-4 p-3 bg-orange-900/50 border border-orange-500 rounded-lg">
            <p className="text-orange-200 text-sm">
              <strong>Session-Only Login:</strong> You'll stay logged in for 2 hours of activity, 
              or until you close this tab/window.
            </p>
          </div>
        </div>

        <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
          <div className="space-y-4">
            {mode === 'register' && (
              <>
                <div>
                  <label htmlFor="fullName" className="sr-only">
                    Full Name
                  </label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <User className="h-5 w-5 text-gray-400" />
                    </div>
                    <input
                      id="fullName"
                      name="fullName"
                      type="text"
                      required
                      disabled={isLoading}
                      className="block w-full pl-10 pr-3 py-3 border border-gray-600 rounded-lg bg-gray-800 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-gold-400 focus:border-transparent disabled:opacity-50"
                      placeholder="Full Name"
                      value={formData.fullName}
                      onChange={handleChange}
                      spellCheck="true"
                      autoCorrect="on"
                      autoCapitalize="words"
                    />
                  </div>
                </div>

                <div>
                  <label htmlFor="username" className="sr-only">
                    Username
                  </label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <User className="h-5 w-5 text-gray-400" />
                    </div>
                    <input
                      id="username"
                      name="username"
                      type="text"
                      required
                      disabled={isLoading}
                      className="block w-full pl-10 pr-3 py-3 border border-gray-600 rounded-lg bg-gray-800 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-gold-400 focus:border-transparent disabled:opacity-50"
                      placeholder="Username (min 3 characters)"
                      value={formData.username}
                      onChange={handleChange}
                      spellCheck="false"
                      autoCorrect="off"
                      autoCapitalize="none"
                    />
                  </div>
                </div>
              </>
            )}

            <div>
              <label htmlFor="email" className="sr-only">
                Email address
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Mail className="h-5 w-5 text-gray-400" />
                </div>
                <input
                  id="email"
                  name="email"
                  type="email"
                  autoComplete="email"
                  required
                  disabled={isLoading}
                  className="block w-full pl-10 pr-3 py-3 border border-gray-600 rounded-lg bg-gray-800 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-gold-400 focus:border-transparent disabled:opacity-50"
                  placeholder="Email address"
                  value={formData.email}
                  onChange={handleChange}
                  spellCheck="false"
                  autoCorrect="off"
                  autoCapitalize="none"
                />
              </div>
            </div>

            <div>
              <label htmlFor="password" className="sr-only">
                Password
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Lock className="h-5 w-5 text-gray-400" />
                </div>
                <input
                  id="password"
                  name="password"
                  type="password"
                  autoComplete={mode === 'login' ? 'current-password' : 'new-password'}
                  required
                  disabled={isLoading}
                  className="block w-full pl-10 pr-3 py-3 border border-gray-600 rounded-lg bg-gray-800 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-gold-400 focus:border-transparent disabled:opacity-50"
                  placeholder={mode === 'register' ? 'Password (min 6 characters)' : 'Password'}
                  value={formData.password}
                  onChange={handleChange}
                  spellCheck="false"
                  autoCorrect="off"
                />
              </div>
            </div>
          </div>

          {error && (
            <div className="bg-red-900/50 border border-red-500 rounded-lg p-4 flex items-center space-x-2">
              <AlertCircle className="w-5 h-5 text-red-400 flex-shrink-0" />
              <span className="text-red-300 text-sm">{error}</span>
            </div>
          )}

          {success && (
            <div className="bg-green-900/50 border border-green-500 rounded-lg p-4 flex items-center space-x-2">
              <CheckCircle className="w-5 h-5 text-green-400 flex-shrink-0" />
              <span className="text-green-300 text-sm">{success}</span>
            </div>
          )}

          <div>
            <button
              type="submit"
              disabled={isLoading}
              className="group relative w-full flex justify-center py-3 px-4 border border-transparent text-sm font-medium rounded-lg text-white bg-gradient-to-r from-gold-600 to-gold-700 hover:from-gold-700 hover:to-gold-800 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gold-500 disabled:opacity-50 transition-all duration-300"
            >
              {isLoading ? (
                <div className="flex items-center space-x-2">
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                  <span>
                    {mode === 'login' ? 'Signing in...' : 'Creating account...'}
                  </span>
                </div>
              ) : (
                mode === 'login' ? 'Sign In' : 'Create Account'
              )}
            </button>
          </div>

          <div className="text-center">
            <span className="text-gray-300 text-sm">
              {mode === 'login' ? "Don't have an account? " : 'Already have an account? '}
            </span>
            <a
              href={mode === 'login' ? '/register' : '/login'}
              className="text-gold-400 hover:text-gold-300 font-medium"
            >
              {mode === 'login' ? 'Sign up' : 'Sign in'}
            </a>
          </div>
        </form>
      </div>
    </div>
  )
}