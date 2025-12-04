import React, { useState } from 'react'
import { supabase } from '../lib/supabase'
import { Copy, Check, Loader2 } from 'lucide-react'

export const TestInvite: React.FC = () => {
  const [inviteUrl, setInviteUrl] = useState<string | null>(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [copied, setCopied] = useState(false)

  const generateTestInvite = async () => {
    setLoading(true)
    setError(null)
    setInviteUrl(null)
    setCopied(false)

    try {
      // Call the SQL function to create a test invite
      const { data, error: rpcError } = await supabase.rpc('create_test_invite')

      if (rpcError) throw rpcError

      if (data?.token) {
        // Construct URL with current origin
        const url = `${window.location.origin}/signup?token=${data.token}`
        setInviteUrl(url)
      } else {
        throw new Error('Failed to generate invite')
      }
    } catch (err: any) {
      console.error('Error generating test invite:', err)
      setError(err.message || 'Failed to generate test invite')
    } finally {
      setLoading(false)
    }
  }

  const copyToClipboard = () => {
    if (inviteUrl) {
      navigator.clipboard.writeText(inviteUrl)
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    }
  }

  return (
    <div className="min-h-screen bg-[#17181a] flex flex-col items-center justify-center p-5">
      <div className="w-full max-w-md bg-[#1a1b1e] rounded-xl p-6 border border-[#2F3133]">
        <h1 className="text-2xl font-semibold text-white mb-2">Test Invite Generator</h1>
        <p className="text-[#ABAEB3] text-sm mb-6">
          Generate a test invitation link that never expires and doesn't require authentication.
        </p>

        {error && (
          <div className="mb-4 bg-red-500/10 border border-red-500/30 text-red-400 p-4 rounded-xl text-sm flex items-center gap-2">
            <div className="w-1.5 h-1.5 rounded-full bg-red-400"></div>
            <span>{error}</span>
          </div>
        )}

        <button
          onClick={generateTestInvite}
          disabled={loading}
          className="w-full bg-[#ff3856] hover:bg-[#ff3856]/90 text-white font-medium px-6 py-3 rounded-full transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2 mb-4"
        >
          {loading ? (
            <>
              <Loader2 size={18} className="animate-spin" />
              <span>Generating...</span>
            </>
          ) : (
            <span>Generate Test Invite Link</span>
          )}
        </button>

        {inviteUrl && (
          <div className="mt-4 p-4 bg-[#2f3133] rounded-lg">
            <p className="text-sm text-[#c7c9cd] mb-2">Test Invite URL:</p>
            <div className="flex items-center gap-2">
              <input
                type="text"
                value={inviteUrl}
                readOnly
                className="flex-1 bg-[#1a1b1e] border border-[#2F3133] rounded-lg px-3 py-2 text-white text-sm"
              />
              <button
                onClick={copyToClipboard}
                className="p-2 bg-[#2f3133] hover:bg-[#3a3c3f] rounded-lg transition-colors"
                title="Copy to clipboard"
              >
                {copied ? (
                  <Check size={18} className="text-green-400" />
                ) : (
                  <Copy size={18} className="text-[#c7c9cd]" />
                )}
              </button>
            </div>
            <p className="text-xs text-[#747980] mt-2">
              This invite never expires and can be used multiple times for testing.
            </p>
          </div>
        )}
      </div>
    </div>
  )
}

