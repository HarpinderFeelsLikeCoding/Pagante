import { supabase } from './supabase'

export async function testDatabaseConnection() {
  console.log('🧪 Testing database connection...')
  
  try {
    // Test 1: Basic connection
    console.log('📡 Testing basic Supabase connection...')
    const { data: connectionTest, error: connectionError } = await supabase
      .from('profiles')
      .select('count')
      .limit(1)
    
    if (connectionError) {
      console.error('❌ Connection test failed:', connectionError)
      return {
        success: false,
        error: 'Database connection failed',
        details: connectionError
      }
    }
    
    console.log('✅ Basic connection successful')
    
    // Test 2: Check if tables exist
    console.log('📋 Checking if required tables exist...')
    const requiredTables = ['profiles', 'creators', 'content', 'subscription_tiers']
    
    for (const table of requiredTables) {
      try {
        const { error } = await supabase
          .from(table)
          .select('*')
          .limit(1)
        
        if (error) {
          console.error(`❌ Table '${table}' check failed:`, error)
          return {
            success: false,
            error: `Table '${table}' does not exist or is not accessible`,
            details: error
          }
        }
        
        console.log(`✅ Table '${table}' exists and is accessible`)
      } catch (err) {
        console.error(`❌ Error checking table '${table}':`, err)
        return {
          success: false,
          error: `Error checking table '${table}'`,
          details: err
        }
      }
    }
    
    // Test 3: Check RLS policies
    console.log('🔒 Testing RLS policies...')
    const { data: authUser } = await supabase.auth.getUser()
    
    if (authUser.user) {
      console.log('👤 User is authenticated, testing profile access...')
      
      const { data: profileData, error: profileError } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', authUser.user.id)
        .single()
      
      if (profileError && profileError.code !== 'PGRST116') {
        console.error('❌ Profile access test failed:', profileError)
        return {
          success: false,
          error: 'Profile access denied by RLS policies',
          details: profileError
        }
      }
      
      console.log('✅ Profile access test passed')
    } else {
      console.log('👤 No authenticated user, skipping profile access test')
    }
    
    console.log('🎉 All database tests passed!')
    return {
      success: true,
      message: 'Database is properly configured and accessible'
    }
    
  } catch (error) {
    console.error('💥 Database test failed with exception:', error)
    return {
      success: false,
      error: 'Database test failed with exception',
      details: error
    }
  }
}

export async function testUserCreation(email: string, username: string, fullName: string) {
  console.log('🧪 Testing user creation process...')
  
  try {
    // Test creating a profile directly (simulating what should happen)
    console.log('📝 Testing direct profile creation...')
    
    const testProfileData = {
      id: 'test-user-id-' + Date.now(),
      email: email,
      username: username + '_test',
      full_name: fullName,
      role: 'user' as const
    }
    
    const { data: profileData, error: profileError } = await supabase
      .from('profiles')
      .insert([testProfileData])
      .select()
      .single()
    
    if (profileError) {
      console.error('❌ Direct profile creation failed:', profileError)
      return {
        success: false,
        error: 'Profile creation failed',
        details: profileError
      }
    }
    
    console.log('✅ Direct profile creation successful:', profileData)
    
    // Clean up test data
    await supabase
      .from('profiles')
      .delete()
      .eq('id', testProfileData.id)
    
    console.log('🧹 Test data cleaned up')
    
    return {
      success: true,
      message: 'User creation test passed'
    }
    
  } catch (error) {
    console.error('💥 User creation test failed:', error)
    return {
      success: false,
      error: 'User creation test failed',
      details: error
    }
  }
}