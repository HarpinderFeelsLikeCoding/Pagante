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
      console.log('Auth state change:', event, session)
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
      
      // Wait a bit for the trigger to complete if needed
      let attempts = 0
      let data = null
      let error = null

      while (attempts < 5) {
        const result = await supabase
          .from('profiles')
          .select('*')
          .eq('id', userId)
          .single()

        data = result.data
        error = result.error

        if (!error && data) {
          break
        }

        if (error && error.code !== 'PGRST116') {
          // Not a "not found" error, so break
          break
        }

        // Wait 500ms before retrying
        await new Promise(resolve => setTimeout(resolve, 500))
        attempts++
      }

      if (error) {
        console.error('Error fetching profile:', error)
        throw error
      }
      
      console.log('Profile fetched successfully:', data)
      setProfile(data)
    } catch (error) {
      console.error('Error fetching profile:', error)
    } finally {
      setLoading(false)
    }
  }

  const signUp = async (email: string, password: string, userData: Partial<Profile>) => {
    console.log('Starting signup process...')
    console.log('Email:', email)
    console.log('User data:', userData)
    
    try {
      // Sign up with Supabase Auth - the trigger should handle profile creation
      console.log('Calling supabase.auth.signUp...')
      const { data, error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: {
            username: userData.username,
            full_name: userData.full_name,
            role: userData.role || 'user'
          }
        }
      })

      console.log('Supabase auth signup response:', { data, error })

      if (error) {
        console.error('Supabase auth signup error:', error)
        throw error
      }

      if (!data.user) {
        console.error('No user returned from signup')
        throw new Error('No user returned from signup')
      }

      console.log('User created successfully:', data.user.id)
      console.log('Signup process completed successfully')

    } catch (err: any) {
      console.error('Signup error:', err)
      
      // Provide more user-friendly error messages
      let errorMessage = 'Failed to create account'
      
      if (err.message?.includes('duplicate key')) {
        if (err.message.includes('username')) {
          errorMessage = 'Username already exists. Please choose a different username.'
        } else if (err.message.includes('email')) {
          errorMessage = 'Email already exists. Please use a different email or try signing in.'
        }
      } else if (err.message?.includes('Database error')) {
        errorMessage = 'There was a problem setting up your account. Please try again.'
      } else if (err.message) {
        errorMessage = err.message
      }
      
      throw new Error(errorMessage)
    }
  }

  const signIn = async (email: string, password: string) => {
    console.log('Signing in user:', email)
    const { error } = await supabase.auth.signInWithPassword({
      email,
      password,
    })

    if (error) {
      console.error('Sign in error:', error)
      throw error
    }
    console.log('Sign in successful')
  }

  const signOut = async () => {
    console.log('Signing out user')
    const { error } = await supabase.auth.signOut()
    if (error) {
      console.error('Sign out error:', error)
      throw error
    }
    console.log('Sign out successful')
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