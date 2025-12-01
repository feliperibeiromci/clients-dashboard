import { createClient } from '@supabase/supabase-js'
import readline from 'readline'

const supabaseUrl = process.env.VITE_SUPABASE_URL || 'https://nqjttfbxxytbjnyaecvi.supabase.co'
const supabaseAnonKey = process.env.VITE_SUPABASE_ANON_KEY || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im5xanR0ZmJ4eHl0YmpueWFlY3ZpIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjM1NjcyNTYsImV4cCI6MjA3OTE0MzI1Nn0.zF-ZnRh3oMcijyttvltw7L4Y_7z4nfH3-gTkVc7cC-k'

const supabase = createClient(supabaseUrl, supabaseAnonKey)

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
})

function question(query) {
  return new Promise(resolve => rl.question(query, resolve))
}

async function createAccount() {
  try {
    console.log('\n=== Account Creation ===\n')
    
    const email = await question('Email: ')
    const password = await question('Password: ')
    const fullName = await question('Full name: ')
    const phone = await question('Phone (optional): ') || ''
    const role = await question('Role (admin/client) [admin]: ') || 'admin'

    console.log('\nCreating account...')

    // 1. Create user in Supabase Auth
    const { data: authData, error: authError } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: {
          full_name: fullName,
          phone: phone
        }
      }
    })

    if (authError) {
      throw authError
    }

    if (!authData.user) {
      throw new Error('Failed to create user')
    }

    console.log('✓ User created in Auth:', authData.user.id)

    // 2. Create profile in profiles table
    // AuthContext expects: id, client_id, role, created_at
    // But the profiles table may have a different structure
    // Let's try to create with the structure expected by AuthContext
    try {
      // First, try to create with the structure that AuthContext expects
      const { error: profileError } = await supabase
        .from('profiles')
        .insert({
          id: authData.user.id,
          client_id: null, // Can be null initially
          role: role, // 'admin' or 'client'
        })

      if (profileError) {
        // If it fails, try with the actual profiles table structure
        console.warn('⚠ Trying alternative profile structure...')
        const { error: altError } = await supabase
          .from('profiles')
          .insert({
            id: authData.user.id,
            full_name: fullName,
            email: email,
            phone: phone || null,
          })
        
        if (altError) {
          console.warn('⚠ Warning creating profile:', altError.message)
        } else {
          console.log('✓ Profile created in profiles table (alternative structure)')
        }
      } else {
        console.log('✓ Profile created in profiles table')
      }
    } catch (err) {
      console.warn('⚠ Error creating profile:', err.message)
    }

    // 3. Create in clients table (used by CreateUserModal)
    try {
      const { error: clientError } = await supabase
        .from('clients')
        .insert({
          id: authData.user.id,
          name: fullName,
          email: email,
          phone: phone || null,
          app_role: role === 'admin' ? 'Admin' : 'Viewer'
        })

      if (clientError) {
        console.warn('⚠ Warning creating client:', clientError.message)
      } else {
        console.log('✓ Client created in clients table')
      }
    } catch (err) {
      console.warn('⚠ Could not create in clients table:', err.message)
    }

    console.log('\n✅ Account created successfully!')
    console.log(`\nEmail: ${email}`)
    console.log(`User ID: ${authData.user.id}`)
    console.log(`\nYou can now log in to the application.`)
    
    if (authData.session) {
      console.log('\n✓ Session created automatically!')
    } else {
      console.log('\n⚠ Check your email to confirm the account (if required).')
    }

  } catch (error) {
    console.error('\n❌ Error creating account:', error.message)
    process.exit(1)
  } finally {
    rl.close()
  }
}

createAccount()

