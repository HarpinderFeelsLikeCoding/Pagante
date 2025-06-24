import React, { createContext, useContext, useEffect, useState } from 'react'
import { supabase, type Profile } from '../lib/supabase'
import { User } from '@supabase/supabase-js'

interface AuthContextType {
  user: User | null
  profile: Profile | null
  loading: boolean
  signUp: (email: string, password: string, userData: Partial<Profile>) => Promise<void>
  signIn: (email: string, password: string) => Promise<void>
  signOut: () => Promise<void>
  refreshProfile: () => Promise<void>
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export function useAuth() {
  const context = useContext(AuthContext)
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider')
  }
  return context
}

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null)
  const [profile, setProfile] = useState<Profile | null>(null)
  const [loading, setLoading] = useState(true) // Start with loading true
  const [initialized, setInitialized] = useState(false)

  useEffect(() => {
    let mounted = true
    let sessionTimeout: NodeJS.Timeout | null = null

    // Initialize auth state
    const initializeAuth = async () => {
      try {
        const { data: { session } } = await supabase.auth.getSession()
        
        if (mounted) {
          if (session?.user) {
            console.log('Found existing session for user:', session.user.id)
            setUser(session.user)
            await fetchProfile(session.user.id)
            setupSessionTimeout()
          } else {
            console.log('No existing session found')
            setUser(null)
            setProfile(null)
          }
          setInitialized(true)
          setLoading(false)
        }
      } catch (error) {
        console.error('Error initializing auth:', error)
        if (mounted) {
          setUser(null)
          setProfile(null)
          setInitialized(true)
          setLoading(false)
        }
      }
    }

    // Set up session timeout (2 hours of inactivity)
    const setupSessionTimeout = () => {
      if (sessionTimeout) {
        clearTimeout(sessionTimeout)
      }
      
      // Auto logout after 2 hours of inactivity
      sessionTimeout = setTimeout(async () => {
        console.log('Session timeout - signing out user')
        await signOut()
      }, 2 * 60 * 60 * 1000) // 2 hours
    }

    // Reset timeout on user activity
    const resetSessionTimeout = () => {
      if (user) {
        setupSessionTimeout()
      }
    }

    // Listen for auth changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange(async (event, session) => {
      console.log('Auth state change:', event, session?.user?.id || 'No user')
      
      if (!mounted) return

      if (event === 'SIGNED_IN' && session?.user) {
        console.log('User signed in:', session.user.id)
        setUser(session.user)
        await fetchProfile(session.user.id)
        setupSessionTimeout()
        setLoading(false)
      } else if (event === 'SIGNED_OUT') {
        console.log('User signed out')
        setUser(null)
        setProfile(null)
        if (sessionTimeout) {
          clearTimeout(sessionTimeout)
          sessionTimeout = null
        }
        setLoading(false)
      }
    })

    // Handle tab/window close - automatically sign out
    const handleBeforeUnload = async () => {
      if (user) {
        console.log('Tab/window closing - signing out user')
        await supabase.auth.signOut()
      }
    }

    // Handle page visibility change - sign out when tab becomes hidden for too long
    let visibilityTimeout: NodeJS.Timeout | null = null
    const handleVisibilityChange = () => {
      if (document.hidden && user) {
        // Give user 30 seconds before logging out when tab is hidden
        visibilityTimeout = setTimeout(async () => {
          console.log('Tab hidden too long - signing out user')
          await supabase.auth.signOut()
        }, 30000) // 30 seconds
      } else if (!document.hidden && visibilityTimeout) {
        // Cancel logout if user comes back to tab
        clearTimeout(visibilityTimeout)
        visibilityTimeout = null
        resetSessionTimeout() // Reset the main session timeout
      }
    }

    // Listen for user activity to reset session timeout
    const activityEvents = ['mousedown', 'mousemove', 'keypress', 'scroll', 'touchstart', 'click']
    activityEvents.forEach(event => {
      document.addEventListener(event, resetSessionTimeout, { passive: true })
    })

    window.addEventListener('beforeunload', handleBeforeUnload)
    document.addEventListener('visibilitychange', handleVisibilityChange)

    // Initialize auth state
    initializeAuth()

    return () => {
      mounted = false
      subscription.unsubscribe()
      
      if (sessionTimeout) clearTimeout(sessionTimeout)
      if (visibilityTimeout) clearTimeout(visibilityTimeout)
      
      window.removeEventListener('beforeunload', handleBeforeUnload)
      document.removeEventListener('visibilitychange', handleVisibilityChange)
      
      activityEvents.forEach(event => {
        document.removeEventListener(event, resetSessionTimeout)
      })
    }
  }, [])

  const fetchProfile = async (userId: string) => {
    try {
      console.log('Fetching profile for user:', userId)
      
      const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', userId)
        .maybeSingle()

      if (error) {
        console.error('Error fetching profile:', error)
        setProfile(null)
      } else if (data) {
        console.log('Profile found:', data.username)
        setProfile(data)
      } else {
        console.log('No profile found for user')
        setProfile(null)
      }
    } catch (error) {
      console.error('Unexpected error fetching profile:', error)
      setProfile(null)
    }
  }

  const refreshProfile = async () => {
    if (user) {
      await fetchProfile(user.id)
    }
  }

  const signUp = async (email: string, password: string, userData: Partial<Profile>) => {
    console.log('Starting signup process for:', email)
    
    try {
      setLoading(true)
      
      // Step 1: Create the auth user
      const { data: authData, error: authError } = await supabase.auth.signUp({
        email,
        password,
      })

      if (authError) {
        console.error('Auth signup error:', authError)
        throw authError
      }

      if (!authData.user) {
        throw new Error('No user returned from auth signup')
      }

      console.log('Auth user created:', authData.user.id)

      // Step 2: Create the profile
      const { data: profileData, error: profileError } = await supabase
        .from('profiles')
        .insert([
          {
            id: authData.user.id,
            email: authData.user.email!,
            username: userData.username!,
            full_name: userData.full_name!,
            role: userData.role || 'user',
          },
        ])
        .select()
        .single()

      if (profileError) {
        console.error('Profile creation error:', profileError)
        
        if (profileError.code === '23505') {
          if (profileError.message.includes('username')) {
            throw new Error('Username already exists. Please choose a different username.')
          } else if (profileError.message.includes('email')) {
            throw new Error('Email already exists. Please use a different email.')
          }
        }
        
        throw new Error('Failed to create user profile. Please try again.')
      }

      console.log('Profile created successfully')
      setProfile(profileData)

    } catch (err: any) {
      console.error('Signup error:', err)
      throw err
    } finally {
      setLoading(false)
    }
  }

  const signIn = async (email: string, password: string) => {
    console.log('Signing in user:', email)
    
    try {
      setLoading(true)
      
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      })

      if (error) {
        console.error('Sign in error:', error)
        
        if (error.message.includes('Invalid login credentials')) {
          throw new Error('Invalid email or password. Please check your credentials and try again.')
        } else if (error.message.includes('Email not confirmed')) {
          throw new Error('Please check your email and click the confirmation link before signing in.')
        } else {
          throw new Error(error.message)
        }
      }

      if (!data.user) {
        throw new Error('No user data returned from sign in')
      }

      console.log('Sign in successful for user:', data.user.id)
      
      // The auth state change listener will handle setting user and profile
      // Don't set loading to false here, let the listener handle it
      
    } catch (err: any) {
      console.error('Sign in error:', err)
      setLoading(false) // Only set loading false on error
      throw err
    }
  }

  const signOut = async () => {
    console.log('Signing out user')
    
    try {
      setLoading(true)
      
      const { error } = await supabase.auth.signOut()
      if (error) {
        console.error('Sign out error:', error)
        throw error
      }
      
      // Clear state immediately
      setProfile(null)
      setUser(null)
      console.log('Sign out successful')
    } catch (error) {
      console.error('Sign out error:', error)
      throw error
    } finally {
      setLoading(false)
    }
  }

  const value = {
    user,
    profile,
    loading,
    signUp,
    signIn,
    signOut,
    refreshProfile,
  }

  // Don't render children until auth is initialized
  if (!initialized) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <div className="text-gray-600">Initializing...</div>
        </div>
      </div>
    )
  }

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}