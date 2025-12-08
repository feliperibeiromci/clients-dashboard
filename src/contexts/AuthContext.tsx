import React, { createContext, useContext, useEffect, useState } from 'react'
import { type User, type Session } from '@supabase/supabase-js'
import { supabase } from '../lib/supabase'

export type UserRole = 'admin' | 'client'
export type AppRole = 'Admin' | 'Editor' | 'Viewer'

export interface Profile {
  id: string
  client_id: string | null
  role: UserRole
  created_at: string
}

interface AuthContextType {
  user: User | null
  session: Session | null
  profile: Profile | null
  appRole: AppRole | null
  loading: boolean
  isAdmin: boolean
  signOut: () => Promise<void>
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null)
  const [session, setSession] = useState<Session | null>(null)
  const [profile, setProfile] = useState<Profile | null>(null)
  const [appRole, setAppRole] = useState<AppRole | null>(null)
  const [loading, setLoading] = useState(true)
  const fetchingProfileRef = React.useRef<Set<string>>(new Set()) // Track ongoing fetches

  const fetchProfile = React.useCallback(async (userId: string, retryCount = 0) => {
    // Prevent multiple simultaneous fetches for the same user
    if (fetchingProfileRef.current.has(userId) && retryCount === 0) {
      return
    }

    if (retryCount === 0) {
      fetchingProfileRef.current.add(userId)
    }

    try {
      // Fetch profile and app role in parallel
      const [profileResult, clientResult] = await Promise.all([
        supabase.from('profiles').select('*').eq('id', userId).single(),
        supabase.from('clients').select('app_role').eq('id', userId).single()
      ])

      const { data: profileData, error: profileError } = profileResult
      const { data: clientData, error: clientError } = clientResult

      if (profileError) {
        // If profile doesn't exist yet (PGRST116), it might still be creating
        if (profileError.code !== 'PGRST116') {
            console.error('Error fetching profile:', profileError)
        }
        if (clientError && clientError.code !== 'PGRST116') {
             console.error('Error fetching client data:', clientError)
        }

        // If profile doesn't exist yet (PGRST116), it might still be creating
        // Retry only once after a delay, then give up
        if (profileError.code === 'PGRST116' && retryCount === 0) {
          console.log('Profile not found yet, retrying once after delay...')
          // Retry only once after a short delay (trigger might still be running)
          setTimeout(() => {
            fetchProfile(userId, 1) // Pass retryCount = 1 to prevent further retries
          }, 2000) // 2 second delay
          return // Don't set loading to false yet, wait for retry
        } else {
          // Profile doesn't exist or other error - just log and continue
          if (profileError.code !== 'PGRST116') {
            console.error('Error fetching profile:', profileError)
          }
          // Set profile to null if it doesn't exist
          setProfile(null)
          setAppRole(null)
          setLoading(false)
        }
      } else {
        setProfile(profileData)
        // Set App Role from clients table, fallback to Viewer if missing
        setAppRole((clientData?.app_role as AppRole) || 'Viewer')
        setLoading(false)
        // Remove from fetching set on success
        fetchingProfileRef.current.delete(userId)
      }
    } catch (error) {
      console.error('Error fetching profile/role:', error)
      setProfile(null)
      setAppRole(null)
      setLoading(false)
      // Remove from fetching set on error
      fetchingProfileRef.current.delete(userId)
    }
  }, [])

  useEffect(() => {
    // Check active session
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session)
      setUser(session?.user ?? null)
      if (session?.user) {
        fetchProfile(session.user.id)
      } else {
        setLoading(false)
      }
    })

    // Listen for auth changes
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session)
      setUser(session?.user ?? null)
      if (session?.user) {
        fetchProfile(session.user.id)
      } else {
        setProfile(null)
        setAppRole(null)
        setLoading(false)
      }
    })

    return () => subscription.unsubscribe()
  }, [fetchProfile])

  const signOut = async () => {
    await supabase.auth.signOut()
    setProfile(null)
    setAppRole(null)
    setUser(null)
    setSession(null)
  }

  const isAdmin = profile?.role === 'admin'

  return (
    <AuthContext.Provider value={{ user, session, profile, appRole, loading, isAdmin, signOut }}>
      {children}
    </AuthContext.Provider>
  )
}

export const useAuth = () => {
  const context = useContext(AuthContext)
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider')
  }
  return context
}
