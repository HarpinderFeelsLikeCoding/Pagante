import React, { createContext, useContext, useEffect, useState } from 'react'
import { supabase, type Profile } from '../lib/supabase'
import { User } from '@supabase/supabase-js'

interface AuthContextType {
  user: User | null
  profile: Profile | null
  loading: boolean
  signUp: (email: string, password: string, userData: Partial<Profile>) => Promise<void>
  signIn: (email: string, password: string, rememberMe?: boolean) => Promise<void>
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
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    let mounted = true

    const initializeAuth = async () => {
      try {
        console.log('Initializing auth...')
        
        // Check if user wants to be remembered
        const rememberMe = localStorage.getItem('pagante_remember_me') === 'true'
        
        if (!rememberMe) {
          // If user doesn't want to be remembered, clear any existing session
          console.log('Remember me disabled, clearing session')
          await supabase.auth.signOut()
          if (mounted) {
            setUser(null)
            setProfile(null)
            setLoading(false)
          }
          return
        }

        const { data: { session }, error } = await supabase.auth.getSession()
        
        if (error) {
          console.error('Error getting session:', error)
          if (mounted) {
            setLoading(false)
          }
          return
        }

        console.log('Initial session:', session?.user?.id || 'No session')
        
        if (mounted) {
          setUser(session?.user ?? null)
          
          if (session?.user) {
            await fetchProfile(session.user.id)
          } else {
            setLoading(false)
          }
        }
      } catch (error) {
        console.error('Error initializing auth:', error)
        if (mounted) {
          setLoading(false)
        }
      }
    }

    initializeAuth()

    // Listen for auth changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange(async (event, session) => {
      console.log('Auth state change:', event, session?.user?.id || 'No user')
      
      if (!mounted) return

      // Handle different auth events
      if (event === 'SIGNED_OUT') {
        setUser(null)
        setProfile(null)
        setLoading(false)
        // Clear remember me preference on explicit sign out
        localStorage.removeItem('pagante_remember_me')
        return
      }

      // Don't refetch profile on token refresh
      if (event === 'TOKEN_REFRESHED') {
        return
      }

      setUser(session?.user ?? null)
      
      if (session?.user && (event === 'SIGNED_IN' || event === 'INITIAL_SESSION')) {
        await fetchProfile(session.user.id)
      } else if (!session?.user) {
        setProfile(null)
        setLoading(false)
      }
    })

    // Only set up session refresh if remember me is enabled
    let refreshInterval: NodeJS.Timeout | null = null
    
    const setupSessionRefresh = () => {
      const rememberMe = localStorage.getItem('pagante_remember_me') === 'true'
      
      if (rememberMe) {
        refreshInterval = setInterval(async () => {
          try {
            const { data: { session } } = await supabase.auth.getSession()
            if (session?.user && mounted) {
              // Session is still valid, refresh it
              await supabase.auth.refreshSession()
            }
          } catch (error) {
            console.error('Error refreshing session:', error)
          }
        }, 30 * 60 * 1000) // Refresh every 30 minutes
      }
    }

    setupSessionRefresh()

    return () => {
      mounted = false
      subscription.unsubscribe()
      if (refreshInterval) {
        clearInterval(refreshInterval)
      }
    }
  }, [])

  const fetchProfile = async (userId: string) => {
    try {
      console.log('Fetching profile for user:', userId)
      
      // Add a timeout to prevent infinite hanging
      const timeoutPromise = new Promise((_, reject) => {
        setTimeout(() => reject(new Error('Profile fetch timeout')), 10000)
      })

      const fetchPromise = supabase
        .from('profiles')
        .select('*')
        .eq('id', userId)
        .maybeSingle()

      const { data, error } = await Promise.race([fetchPromise, timeoutPromise]) as any

      if (error) {
        console.error('Error fetching profile:', error)
        if (error.code === 'PGRST116') {
          console.log('Profile not found - user may need to complete registration')
          setProfile(null)
        } else {
          console.error('Database error:', error.message)
          setProfile(null)
        }
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
    } finally {
      console.log('Setting loading to false')
      setLoading(false)
    }
  }

  const refreshProfile = async () => {
    if (user) {
      setLoading(true)
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

      // Set remember me to true by default for new signups
      localStorage.setItem('pagante_remember_me', 'true')

    } catch (err: any) {
      console.error('Signup error:', err)
      throw err
    } finally {
      setLoading(false)
    }
  }

  const signIn = async (email: string, password: string, rememberMe: boolean = false) => {
    console.log('Signing in user:', email, 'Remember me:', rememberMe)
    
    try {
      setLoading(true)
      
      // Set remember me preference BEFORE signing in
      localStorage.setItem('pagante_remember_me', rememberMe.toString())
      
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

      console.log('Sign in successful, remember me:', rememberMe)
      
    } catch (err: any) {
      console.error('Sign in error:', err)
      // Clear remember me preference on failed login
      localStorage.removeItem('pagante_remember_me')
      throw err
    } finally {
      setLoading(false)
    }
  }

  const signOut = async () => {
    console.log('Signing out user')
    
    try {
      setLoading(true)
      
      // Clear remember me preference
      localStorage.removeItem('pagante_remember_me')
      
      const { error } = await supabase.auth.signOut()
      if (error) {
        console.error('Sign out error:', error)
        throw error
      }
      
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

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}