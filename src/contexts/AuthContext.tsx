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
    console.log('🔄 AuthProvider: Initializing...')
    
    // Get initial session
    supabase.auth.getSession().then(({ data: { session }, error }) => {
      console.log('🔍 Initial session check:', { session: !!session, error })
      
      if (error) {
        console.error('❌ Session error:', error)
      }
      
      setUser(session?.user ?? null)
      if (session?.user) {
        console.log('👤 User found in session:', session.user.id)
        fetchProfile(session.user.id)
      } else {
        console.log('👤 No user in session')
        setLoading(false)
      }
    })

    // Listen for auth changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange(async (event, session) => {
      console.log('🔄 Auth state change:', { event, session: !!session })
      
      setUser(session?.user ?? null)
      if (session?.user) {
        console.log('👤 User authenticated:', session.user.id)
        await fetchProfile(session.user.id)
      } else {
        console.log('👤 User signed out')
        setProfile(null)
        setLoading(false)
      }
    })

    return () => {
      console.log('🧹 Cleaning up auth subscription')
      subscription.unsubscribe()
    }
  }, [])

  const fetchProfile = async (userId: string) => {
    console.log('📋 Fetching profile for user:', userId)
    
    try {
      const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', userId)
        .single()

      console.log('📋 Profile query result:', { data: !!data, error })

      if (error) {
        console.error('❌ Profile fetch error:', error)
        throw error
      }
      
      console.log('✅ Profile loaded:', data)
      setProfile(data)
    } catch (error) {
      console.error('💥 Error fetching profile:', error)
    } finally {
      setLoading(false)
    }
  }

  const signUp = async (email: string, password: string, userData: Partial<Profile>) => {
    console.log('📝 Starting signup process:', { email, userData })
    
    try {
      // First, sign up the user
      const { data, error } = await supabase.auth.signUp({
        email,
        password,
      })

      console.log('📝 Supabase auth signup result:', { 
        user: !!data.user, 
        session: !!data.session,
        error 
      })

      if (error) {
        console.error('❌ Auth signup error:', error)
        throw error
      }

      if (!data.user) {
        console.error('❌ No user returned from signup')
        throw new Error('No user returned from signup')
      }

      console.log('👤 User created successfully:', data.user.id)

      // Check if profile was created by trigger
      console.log('⏳ Waiting for profile creation...')
      
      // Wait a moment for the trigger to execute
      await new Promise(resolve => setTimeout(resolve, 1000))
      
      // Check if profile exists
      const { data: existingProfile, error: profileCheckError } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', data.user.id)
        .single()

      console.log('🔍 Profile check result:', { 
        exists: !!existingProfile, 
        error: profileCheckError 
      })

      if (profileCheckError && profileCheckError.code !== 'PGRST116') {
        console.error('❌ Profile check error:', profileCheckError)
      }

      if (!existingProfile) {
        console.log('📝 Creating profile manually...')
        
        // Create profile manually if trigger didn't work
        const { error: profileError } = await supabase
          .from('profiles')
          .insert([
            {
              id: data.user.id,
              email: data.user.email,
              ...userData,
            },
          ])

        console.log('📝 Manual profile creation result:', { error: profileError })

        if (profileError) {
          console.error('❌ Profile creation error:', profileError)
          throw profileError
        }
        
        console.log('✅ Profile created manually')
      } else {
        console.log('✅ Profile already exists from trigger')
      }

    } catch (error) {
      console.error('💥 Signup process failed:', error)
      throw error
    }
  }

  const signIn = async (email: string, password: string) => {
    console.log('🔑 Starting signin process:', { email })
    
    try {
      const { error } = await supabase.auth.signInWithPassword({
        email,
        password,
      })

      console.log('🔑 Signin result:', { error })

      if (error) {
        console.error('❌ Signin error:', error)
        throw error
      }
      
      console.log('✅ Signin successful')
    } catch (error) {
      console.error('💥 Signin failed:', error)
      throw error
    }
  }

  const signOut = async () => {
    console.log('👋 Starting signout process')
    
    try {
      const { error } = await supabase.auth.signOut()
      
      console.log('👋 Signout result:', { error })
      
      if (error) {
        console.error('❌ Signout error:', error)
        throw error
      }
      
      console.log('✅ Signout successful')
    } catch (error) {
      console.error('💥 Signout failed:', error)
      throw error
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

  console.log('🔄 AuthProvider render:', { 
    user: !!user, 
    profile: !!profile, 
    loading 
  })

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}