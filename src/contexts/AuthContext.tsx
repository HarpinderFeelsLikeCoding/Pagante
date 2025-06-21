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
    // Get initial session
    supabase.auth.getSession().then(({ data: { session } }) => {
      console.log('Initial session:', session)
      setUser(session?.user ?? null)
      if (session?.user) {
        fetchProfile(session.user.id)
      } else {
        setLoading(false)
      }
    })

    // Listen for auth changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange(async (event, session) => {
      console.log('Auth state change:', event, session?.user?.id)
      setUser(session?.user ?? null)
      
      if (session?.user) {
        await fetchProfile(session.user.id)
      } else {
        setProfile(null)
        setLoading(false)
      }
    })

    return () => subscription.unsubscribe()
  }, [])

  const fetchProfile = async (userId: string) => {
    try {
      console.log('Fetching profile for user:', userId)
      
      const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', userId)
        .single()

      if (error) {
        console.error('Error fetching profile:', error)
        if (error.code === 'PGRST116') {
          // Profile doesn't exist - this is expected for new users
          console.log('Profile not found - user may need to complete registration')
          setProfile(null)
        } else {
          console.error('Database error fetching profile:', error)
          setProfile(null)
        }
      } else {
        console.log('Profile fetched successfully:', data)
        setProfile(data)
      }
    } catch (error) {
      console.error('Unexpected error fetching profile:', error)
      setProfile(null)
    } finally {
      setLoading(false)
    }
  }

  const signUp = async (email: string, password: string, userData: Partial<Profile>) => {
    console.log('Starting signup process...')
    console.log('Email:', email)
    console.log('User data:', userData)
    
    setLoading(true)
    
    try {
      // Step 1: Create the auth user
      console.log('Creating auth user...')
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

      console.log('Auth user created successfully:', authData.user.id)

      // Step 2: Create the profile manually
      console.log('Creating profile manually...')
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
          // Unique constraint violation
          if (profileError.message.includes('username')) {
            throw new Error('Username already exists. Please choose a different username.')
          } else if (profileError.message.includes('email')) {
            throw new Error('Email already exists. Please use a different email.')
          }
        }
        
        throw new Error('Failed to create user profile. Please try again.')
      }

      console.log('Profile created successfully:', profileData)
      console.log('Signup process completed successfully')

      // Set the profile in state
      setProfile(profileData)

    } catch (err: any) {
      console.error('Signup error:', err)
      throw err
    } finally {
      setLoading(false)
    }
  }

  const signIn = async (email: string, password: string) => {
    console.log('Attempting to sign in user:', email)
    
    setLoading(true)
    
    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      })

      if (error) {
        console.error('Sign in error:', error)
        
        // Provide more specific error messages
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
      
      // The auth state change listener will handle fetching the profile
      
    } catch (err: any) {
      console.error('Sign in error:', err)
      throw err
    } finally {
      // Don't set loading to false here - let the auth state change handler do it
      // setLoading(false)
    }
  }

  const signOut = async () => {
    console.log('Signing out user')
    setLoading(true)
    
    try {
      const { error } = await supabase.auth.signOut()
      if (error) {
        console.error('Sign out error:', error)
        throw error
      }
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
  }

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}