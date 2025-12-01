import React, { useState } from 'react'
import { Link } from 'react-router-dom'
import { supabase } from '../lib/supabase'
import { Logo } from '../components/Logo'
import { Mail, Loader2, ArrowLeft, CheckCircle } from 'lucide-react'

export const ForgotPassword: React.FC = () => {
  const [email, setEmail] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [success, setSuccess] = useState(false)

  const handleResetPassword = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError(null)
    setSuccess(false)

    try {
      const { error } = await supabase.auth.resetPasswordForEmail(email, {
        redirectTo: `${window.location.origin}/reset-password`,
      })

      if (error) throw error

      setSuccess(true)
    } catch (err: any) {
      setError(err.message || 'Failed to send reset email')
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
              Reset Password
            </h1>
            <p className="text-[#ABAEB3] text-sm text-center">
              Enter your email address and we'll send you a link to reset your password
            </p>
          </div>

          {/* Success message */}
          {success && (
            <div className="mb-6 bg-green-500/10 border border-green-500/30 text-green-400 p-4 rounded-xl text-sm flex items-start gap-3 animate-in fade-in slide-in-from-top-2">
              <CheckCircle size={18} className="mt-0.5 flex-shrink-0" />
              <div>
                <p className="font-medium mb-1">Email sent successfully!</p>
                <p className="text-green-400/80 text-xs">
                  Check your inbox for a password reset link. If you don't see it, check your spam folder.
                </p>
              </div>
            </div>
          )}

          {/* Error message */}
          {error && !success && (
            <div className="mb-6 bg-red-500/10 border border-red-500/30 text-red-400 p-4 rounded-xl text-sm flex items-center gap-2 animate-in fade-in slide-in-from-top-2">
              <div className="w-1.5 h-1.5 rounded-full bg-red-400"></div>
              <span>{error}</span>
            </div>
          )}

          {!success ? (
            <form onSubmit={handleResetPassword} className="flex flex-col gap-6">
              {/* Email field */}
              <div className="space-y-2">
                <label className="block text-sm font-medium text-[#C7C9CD] mb-2">
                  Email address
                </label>
                <div className="relative group">
                  <div className="absolute left-4 top-1/2 -translate-y-1/2 text-[#5D6166] group-focus-within:text-[#FF3856] transition-colors">
                    <Mail size={18} />
                  </div>
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full bg-[#0b0c0d]/50 border border-[#2F3133] rounded-xl px-12 py-3.5 text-white placeholder-[#5D6166] focus:outline-none focus:border-[#FF3856] focus:ring-2 focus:ring-[#FF3856]/20 transition-all duration-200"
                    placeholder="you@example.com"
                    required
                    disabled={loading}
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
                    <span>Sending...</span>
                  </>
                ) : (
                  <span>Send reset link</span>
                )}
              </button>
            </form>
          ) : null}

          {/* Back to login */}
          <div className="mt-6 text-center">
            <Link
              to="/login"
              className="inline-flex items-center gap-2 text-sm text-[#ABAEB3] hover:text-white transition-colors group"
            >
              <ArrowLeft size={16} className="group-hover:-translate-x-1 transition-transform" />
              <span>Back to login</span>
            </Link>
          </div>
        </div>
      </div>
    </div>
  )
}

