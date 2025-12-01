import React, { useState, useEffect } from 'react'
import { useNavigate, useSearchParams } from 'react-router-dom'
import { supabase } from '../lib/supabase'
import { Logo } from '../components/Logo'
import { Lock, Loader2, CheckCircle, AlertCircle } from 'lucide-react'

export const ResetPassword: React.FC = () => {
  const [password, setPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [success, setSuccess] = useState(false)
  const [searchParams] = useSearchParams()
  const navigate = useNavigate()

  useEffect(() => {
    // Check if user has a valid session from the reset link
    const checkSession = async () => {
      const { data: { session } } = await supabase.auth.getSession()
      if (!session) {
        setError('Invalid or expired reset link. Please request a new password reset.')
      }
    }
    checkSession()
  }, [])

  const handleResetPassword = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError(null)

    // Validation
    if (password.length < 6) {
      setError('Password must be at least 6 characters long')
      setLoading(false)
      return
    }

    if (password !== confirmPassword) {
      setError('Passwords do not match')
      setLoading(false)
      return
    }

    try {
      const { error } = await supabase.auth.updateUser({
        password: password,
      })

      if (error) throw error

      setSuccess(true)
      
      // Redirect to login after 2 seconds
      setTimeout(() => {
        navigate('/login')
      }, 2000)
    } catch (err: any) {
      setError(err.message || 'Failed to reset password')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-[#0b0c0d] flex flex-col items-center justify-center p-4 relative overflow-hidden">
      {/* Background gradient overlay */}
      <div className="absolute inset-0 bg-gradient-to-br from-[#0b0c0d] via-[#0f1112] to-[#0b0c0d] opacity-100"></div>
      
      {/* Subtle grid pattern */}
      <div 
        className="absolute inset-0 opacity-[0.03]"
        style={{
          backgroundImage: `
            linear-gradient(rgba(255, 255, 255, 0.1) 1px, transparent 1px),
            linear-gradient(90deg, rgba(255, 255, 255, 0.1) 1px, transparent 1px)
          `,
          backgroundSize: '50px 50px'
        }}
      ></div>

      {/* Animated gradient orbs */}
      <div className="absolute top-0 -left-1/4 w-96 h-96 bg-[#FF3856]/10 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '0s' }}></div>
      <div className="absolute bottom-0 -right-1/4 w-96 h-96 bg-[#FF3856]/5 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '1s' }}></div>

      <div className="relative w-full max-w-md z-10">
        {/* Card with glassmorphism effect */}
        <div className="bg-[#17181A]/95 backdrop-blur-xl p-10 rounded-3xl border border-[#2F3133]/50 shadow-2xl">
          {/* Logo section */}
          <div className="flex flex-col items-center mb-10">
            <div className="mb-6 transform transition-transform hover:scale-105 duration-300">
              <Logo className="w-20 h-20" />
            </div>
            <h1 className="text-3xl font-semibold text-white mb-2 tracking-tight">
              New Password
            </h1>
            <p className="text-[#ABAEB3] text-sm text-center">
              Enter your new password below
            </p>
          </div>

          {/* Success message */}
          {success && (
            <div className="mb-6 bg-green-500/10 border border-green-500/30 text-green-400 p-4 rounded-xl text-sm flex items-start gap-3 animate-in fade-in slide-in-from-top-2">
              <CheckCircle size={18} className="mt-0.5 flex-shrink-0" />
              <div>
                <p className="font-medium mb-1">Password updated successfully!</p>
                <p className="text-green-400/80 text-xs">
                  Redirecting to login...
                </p>
              </div>
            </div>
          )}

          {/* Error message */}
          {error && !success && (
            <div className="mb-6 bg-red-500/10 border border-red-500/30 text-red-400 p-4 rounded-xl text-sm flex items-start gap-3 animate-in fade-in slide-in-from-top-2">
              <AlertCircle size={18} className="mt-0.5 flex-shrink-0" />
              <span>{error}</span>
            </div>
          )}

          {!success ? (
            <form onSubmit={handleResetPassword} className="flex flex-col gap-6">
              {/* New Password field */}
              <div className="space-y-2">
                <label className="block text-sm font-medium text-[#C7C9CD] mb-2">
                  New Password
                </label>
                <div className="relative group">
                  <div className="absolute left-4 top-1/2 -translate-y-1/2 text-[#5D6166] group-focus-within:text-[#FF3856] transition-colors">
                    <Lock size={18} />
                  </div>
                  <input
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="w-full bg-[#0b0c0d]/50 border border-[#2F3133] rounded-xl px-12 py-3.5 text-white placeholder-[#5D6166] focus:outline-none focus:border-[#FF3856] focus:ring-2 focus:ring-[#FF3856]/20 transition-all duration-200"
                    placeholder="Enter new password"
                    required
                    disabled={loading}
                    minLength={6}
                  />
                </div>
                <p className="text-xs text-[#5D6166]">Must be at least 6 characters</p>
              </div>

              {/* Confirm Password field */}
              <div className="space-y-2">
                <label className="block text-sm font-medium text-[#C7C9CD] mb-2">
                  Confirm Password
                </label>
                <div className="relative group">
                  <div className="absolute left-4 top-1/2 -translate-y-1/2 text-[#5D6166] group-focus-within:text-[#FF3856] transition-colors">
                    <Lock size={18} />
                  </div>
                  <input
                    type="password"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    className="w-full bg-[#0b0c0d]/50 border border-[#2F3133] rounded-xl px-12 py-3.5 text-white placeholder-[#5D6166] focus:outline-none focus:border-[#FF3856] focus:ring-2 focus:ring-[#FF3856]/20 transition-all duration-200"
                    placeholder="Confirm new password"
                    required
                    disabled={loading}
                    minLength={6}
                  />
                </div>
              </div>

              {/* Submit button */}
              <button
                type="submit"
                disabled={loading}
                className="w-full bg-gradient-to-r from-[#FF3856] to-[#FF3856]/90 hover:from-[#FF3856]/90 hover:to-[#FF3856] text-white font-semibold py-3.5 rounded-xl transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed mt-2 shadow-lg shadow-[#FF3856]/20 hover:shadow-[#FF3856]/30 flex items-center justify-center gap-2 group"
              >
                {loading ? (
                  <>
                    <Loader2 size={18} className="animate-spin" />
                    <span>Updating password...</span>
                  </>
                ) : (
                  <span>Update password</span>
                )}
              </button>
            </form>
          ) : null}
        </div>
      </div>
    </div>
  )
}

