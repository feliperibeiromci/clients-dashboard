import React, { useState, useEffect } from 'react'
import { useAuth } from '../contexts/AuthContext'
import { supabase } from '../lib/supabase'
import { Copy, Check, Loader2, Trash2, Calendar, User } from 'lucide-react'

interface Invite {
  id: string
  token: string
  email: string | null
  used: boolean
  expires_at: string | null
  created_at: string
  used_at: string | null
  used_by: string | null
}

export const Settings: React.FC = () => {
  const { user } = useAuth()
  const [invites, setInvites] = useState<Invite[]>([])
  const [loading, setLoading] = useState(false)
  const [loadingInvites, setLoadingInvites] = useState(true)
  const [deletingId, setDeletingId] = useState<string | null>(null)
  const [error, setError] = useState<string | null>(null)
  const [copiedToken, setCopiedToken] = useState<string | null>(null)
  const [expirationDays, setExpirationDays] = useState<number>(30)

  // Generate a random token
  const generateToken = (): string => {
    const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789'
    let token = ''
    for (let i = 0; i < 32; i++) {
      token += chars.charAt(Math.floor(Math.random() * chars.length))
    }
    return token
  }

  // Fetch existing invites (only those created by the current user, exclude test invites)
  const fetchInvites = async () => {
    if (!user?.id) return
    
    try {
      setLoadingInvites(true)
      const { data, error: fetchError } = await supabase
        .from('invites')
        .select('*')
        .eq('invited_by', user.id) // Only fetch invites created by current user
        .order('created_at', { ascending: false })

      if (fetchError) throw fetchError
      setInvites(data || [])
    } catch (err: any) {
      console.error('Error fetching invites:', err)
    } finally {
      setLoadingInvites(false)
    }
  }

  useEffect(() => {
    if (user?.id) {
      fetchInvites()
    }
  }, [user?.id])

  // Create new invite
  const handleCreateInvite = async () => {
    if (!user) return

    setLoading(true)
    setError(null)

    try {
      const token = generateToken()
      const expiresAt = expirationDays > 0 
        ? new Date(Date.now() + expirationDays * 24 * 60 * 60 * 1000).toISOString()
        : null

      const { data, error: createError } = await supabase
        .from('invites')
        .insert({
          token,
          invited_by: user.id,
          expires_at: expiresAt,
        })
        .select()
        .single()

      if (createError) throw createError

      // Refresh invites list
      await fetchInvites()

      // Auto-copy to clipboard
      const inviteUrl = `${window.location.origin}/signup?token=${token}`
      await navigator.clipboard.writeText(inviteUrl)
      setCopiedToken(token)
      setTimeout(() => setCopiedToken(null), 2000)
    } catch (err: any) {
      setError(err.message || 'Failed to create invitation')
    } finally {
      setLoading(false)
    }
  }

  // Delete invite
  const handleDeleteInvite = async (inviteId: string) => {
    if (!confirm('Are you sure you want to delete this invitation?')) return

    setDeletingId(inviteId)
    setError(null)

    try {
      const { data, error: deleteError } = await supabase
        .from('invites')
        .delete()
        .eq('id', inviteId)
        .select()

      if (deleteError) {
        console.error('Delete error:', deleteError)
        throw deleteError
      }

      console.log('Delete successful:', data)

      // Remove from local state immediately for better UX
      setInvites(prevInvites => prevInvites.filter(invite => invite.id !== inviteId))
    } catch (err: any) {
      console.error('Error deleting invite:', err)
      setError(err.message || 'Failed to delete invitation. Please try again.')
      // Refresh list in case of error to show current state
      await fetchInvites()
    } finally {
      setDeletingId(null)
    }
  }

  // Copy invite link to clipboard
  const handleCopyInvite = async (token: string) => {
    const inviteUrl = `${window.location.origin}/signup?token=${token}`
    try {
      await navigator.clipboard.writeText(inviteUrl)
      setCopiedToken(token)
      setTimeout(() => setCopiedToken(null), 2000)
    } catch (err) {
      setError('Failed to copy to clipboard')
    }
  }

  // Format date
  const formatDate = (dateString: string | null) => {
    if (!dateString) return 'Never'
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    })
  }

  // Check if invite is expired
  const isExpired = (expiresAt: string | null) => {
    if (!expiresAt) return false
    return new Date(expiresAt) < new Date()
  }

  return (
    <div className="max-w-4xl mx-auto">
      <div className="mb-8">
        <h1 className="text-3xl font-semibold text-white mb-2">Settings</h1>
        <p className="text-[#ABAEB3]">Manage your account settings and invitations</p>
      </div>

      {/* Error message */}
      {error && (
        <div className="mb-6 bg-red-500/10 border border-red-500/30 text-red-400 p-4 rounded-xl text-sm flex items-center gap-2">
          <div className="w-1.5 h-1.5 rounded-full bg-red-400"></div>
          <span>{error}</span>
        </div>
      )}

      {/* Create Invite Section */}
      <div className="bg-[#1a1b1e] rounded-xl p-6 mb-6 border border-[#2F3133]">
        <h2 className="text-xl font-semibold text-white mb-4">Create Invitation</h2>
        <p className="text-[#ABAEB3] text-sm mb-4">
          Generate a shareable invitation link for new users to join the MCI Analytics Dashboard.
        </p>

        <div className="flex flex-col md:flex-row gap-4 items-center">
          <div className="flex-1 w-full">
            <label className="block text-sm font-medium text-[#c7c9cd] mb-2">
              Expiration (days)
            </label>
            <input
              type="text"
              inputMode="numeric"
              pattern="[0-9]*"
              value={expirationDays}
              onChange={(e) => {
                const value = e.target.value
                if (value === '' || /^\d+$/.test(value)) {
                  const numValue = value === '' ? 0 : parseInt(value)
                  if (numValue >= 0 && numValue <= 365) {
                    setExpirationDays(numValue)
                  }
                }
              }}
              className="w-full bg-[#2f3133] rounded-[6px] px-4 py-3 text-white placeholder:text-[#747980] focus:outline-none focus:ring-2 focus:ring-[#ff3856]/20 transition-all border-0 text-[16px]"
              placeholder="30"
            />
            <p className="text-xs text-[#747980] mt-1.5">
              {expirationDays === 0 ? 'No expiration' : `Expires in ${expirationDays} day${expirationDays !== 1 ? 's' : ''}`}
            </p>
          </div>
          <div className="w-full md:w-auto md:pt-6">
            <button
              onClick={handleCreateInvite}
              disabled={loading}
              className="w-full md:w-auto bg-[#ff3856] hover:bg-[#ff3856]/90 text-white font-medium px-6 py-3 rounded-full transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
            >
              {loading ? (
                <>
                  <Loader2 size={16} className="animate-spin" />
                  <span>Creating...</span>
                </>
              ) : (
                <span>Generate Invite Link</span>
              )}
            </button>
          </div>
        </div>
      </div>

      {/* Invites List */}
      <div className="bg-[#1a1b1e] rounded-xl p-6 border border-[#2F3133]">
        <h2 className="text-xl font-semibold text-white mb-4">Your Invitations</h2>

        {loadingInvites ? (
          <div className="flex items-center justify-center py-8">
            <Loader2 size={24} className="animate-spin text-[#ff3856]" />
          </div>
        ) : invites.length === 0 ? (
          <div className="text-center py-8 text-[#ABAEB3]">
            <p>No invitations created yet.</p>
            <p className="text-sm mt-2">Create your first invitation above.</p>
          </div>
        ) : (
          <div className="space-y-3">
            {invites.map((invite) => (
              <div
                key={invite.id}
                className={`group relative overflow-hidden rounded-xl border transition-all duration-200 ${
                  invite.used
                    ? 'bg-gradient-to-br from-[#2f3133]/40 to-[#1a1b1e]/40 border-[#2F3133]/50 opacity-70'
                    : isExpired(invite.expires_at)
                    ? 'bg-gradient-to-br from-yellow-500/5 to-[#1a1b1e] border-yellow-500/20 hover:border-yellow-500/40'
                    : 'bg-gradient-to-br from-[#2f3133] to-[#1a1b1e] border-[#2F3133] hover:border-[#3a3c3f] hover:shadow-lg hover:shadow-[#ff3856]/5'
                }`}
              >
                <div className="p-5">
                  <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-3 mb-3">
                        <div className="flex items-center gap-2 min-w-0">
                          <code className="text-sm font-mono text-[#ff3856] bg-[#1a1b1e] px-3 py-1.5 rounded-lg border border-[#2F3133] font-semibold">
                            {invite.token.substring(0, 12)}...
                          </code>
                        </div>
                        {invite.used && (
                          <span className="inline-flex items-center text-xs font-medium bg-green-500/15 text-green-400 px-2.5 py-1 rounded-full border border-green-500/20">
                            Used
                          </span>
                        )}
                        {!invite.used && isExpired(invite.expires_at) && (
                          <span className="inline-flex items-center text-xs font-medium bg-yellow-500/15 text-yellow-400 px-2.5 py-1 rounded-full border border-yellow-500/20">
                            Expired
                          </span>
                        )}
                        {!invite.used && !isExpired(invite.expires_at) && (
                          <span className="inline-flex items-center text-xs font-medium bg-blue-500/15 text-blue-400 px-2.5 py-1 rounded-full border border-blue-500/20">
                            Active
                          </span>
                        )}
                      </div>
                      <div className="flex flex-wrap gap-x-6 gap-y-2 text-sm text-[#ABAEB3]">
                        <div className="flex items-center gap-2">
                          <Calendar size={14} className="text-[#747980]" />
                          <span className="font-medium">Created:</span>
                          <span>{formatDate(invite.created_at)}</span>
                        </div>
                        {invite.expires_at && (
                          <div className="flex items-center gap-2">
                            <Calendar size={14} className="text-[#747980]" />
                            <span className="font-medium">Expires:</span>
                            <span>{formatDate(invite.expires_at)}</span>
                          </div>
                        )}
                        {invite.used_at && (
                          <div className="flex items-center gap-2">
                            <User size={14} className="text-[#747980]" />
                            <span className="font-medium">Used:</span>
                            <span>{formatDate(invite.used_at)}</span>
                          </div>
                        )}
                      </div>
                    </div>
                    <div className="flex items-center gap-2 flex-shrink-0">
                      {!invite.used && (
                        <button
                          onClick={() => handleCopyInvite(invite.token)}
                          className="p-2.5 bg-[#2f3133] hover:bg-[#3a3c3f] rounded-lg transition-all duration-200 border border-[#2F3133] hover:border-[#3a3c3f] group/btn"
                          title="Copy invite link"
                        >
                          {copiedToken === invite.token ? (
                            <Check size={18} className="text-green-400" />
                          ) : (
                            <Copy size={18} className="text-[#c7c9cd] group-hover/btn:text-white transition-colors" />
                          )}
                        </button>
                      )}
                    <button
                      onClick={() => handleDeleteInvite(invite.id)}
                      disabled={deletingId === invite.id}
                      className="p-2.5 bg-[#2f3133] hover:bg-red-500/20 rounded-lg transition-all duration-200 border border-[#2F3133] hover:border-red-500/30 group/btn disabled:opacity-50 disabled:cursor-not-allowed"
                      title="Delete invitation"
                    >
                      {deletingId === invite.id ? (
                        <Loader2 size={18} className="text-red-400 animate-spin" />
                      ) : (
                        <Trash2 size={18} className="text-red-400 group-hover/btn:text-red-300 transition-colors" />
                      )}
                    </button>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}

