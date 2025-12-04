import React, { useState, useRef, useEffect } from 'react'
import { useNavigate, useSearchParams, Link } from 'react-router-dom'
import { supabase } from '../lib/supabase'
import { Loader2 } from 'lucide-react'

export const VerifyCode: React.FC = () => {
  const [searchParams] = useSearchParams()
  const navigate = useNavigate()
  const [code, setCode] = useState<string[]>(['', '', '', '', '', '', '', ''])
  const [loading, setLoading] = useState(false)
  const [resending, setResending] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [successMessage, setSuccessMessage] = useState<string | null>(null)
  const inputRefs = useRef<(HTMLInputElement | null)[]>([])

  // Get email from query params or sessionStorage
  const emailFromParams = searchParams.get('email')
  const emailFromStorage = sessionStorage.getItem('signup_email')
  const email = emailFromParams || emailFromStorage || ''

  // Mask email for display
  const maskEmail = (email: string) => {
    if (!email) return ''
    const [localPart, domain] = email.split('@')
    if (localPart.length <= 3) {
      return `${localPart}***@${domain}`
    }
    return `${localPart.substring(0, 3)}***@${domain}`
  }

  // Focus on first input on mount
  useEffect(() => {
    if (inputRefs.current[0]) {
      inputRefs.current[0].focus()
    }
  }, [])

  // Handle input change
  const handleChange = (index: number, value: string) => {
    // Only allow numbers
    if (value && !/^\d$/.test(value)) return

    const newCode = [...code]
    newCode[index] = value
    setCode(newCode)
    setError(null)

    // Auto-focus next input
    if (value && index < 7) {
      inputRefs.current[index + 1]?.focus()
    }

    // Auto-submit when all 8 digits are entered
    if (newCode.every(digit => digit !== '') && index === 7) {
      handleVerify(newCode.join(''))
    }
  }

  // Handle backspace
  const handleKeyDown = (index: number, e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Backspace' && !code[index] && index > 0) {
      inputRefs.current[index - 1]?.focus()
    }
  }

  // Handle paste
  const handlePaste = (e: React.ClipboardEvent<HTMLInputElement>) => {
    e.preventDefault()
    const pastedData = e.clipboardData.getData('text').trim()
    if (/^\d{8}$/.test(pastedData)) {
      const digits = pastedData.split('')
      const newCode = [...code]
      digits.forEach((digit, index) => {
        if (index < 8) {
          newCode[index] = digit
        }
      })
      setCode(newCode)
      // Focus last input
      inputRefs.current[7]?.focus()
      // Auto-verify
      handleVerify(newCode.join(''))
    }
  }

  // Resend OTP code
  const handleResendCode = async () => {
    if (!email) {
      setError('Email not found. Please start over.')
      return
    }

    setResending(true)
    setError(null)
    setSuccessMessage(null)

    try {
      const { error: resendError } = await supabase.auth.resend({
        type: 'signup',
        email: email,
      })

      if (resendError) throw resendError

      setSuccessMessage('Verification code has been resent to your email.')
      setTimeout(() => setSuccessMessage(null), 5000)
    } catch (err: any) {
      setError(err.message || 'Failed to resend code. Please try again.')
    } finally {
      setResending(false)
    }
  }

  const handleVerify = async (codeToVerify?: string) => {
    const codeString = codeToVerify || code.join('')
    
    if (codeString.length !== 8) {
      setError('Please enter the complete 8-digit code')
      return
    }

    if (!email) {
      setError('Email not found. Please start over.')
      navigate('/signup')
      return
    }

    setLoading(true)
    setError(null)
    setSuccessMessage(null)

    try {
      // Verify OTP with Supabase
      const { data, error: verifyError } = await supabase.auth.verifyOtp({
        email,
        token: codeString,
        type: 'signup',
      })

      if (verifyError) throw verifyError

      // Get user data from sessionStorage
      const fullName = sessionStorage.getItem('signup_full_name') || ''
      const phone = sessionStorage.getItem('signup_phone') || ''

      // Note: If Supabase trigger (handle_new_user) is set up correctly,
      // the profile and client should already be created automatically when the user signs up.
      // This is a fallback in case the trigger didn't execute or failed.
      if (data.user) {
        // Create profile in profiles table if needed (fallback)
        try {
          await supabase
            .from('profiles')
            .insert({
              id: data.user.id,
              role: 'client', // Default role
              full_name: fullName,
              email: email,
              phone: phone || null,
            })
            .select()
        } catch (profileError: any) {
          // Ignore if profile already exists (created by trigger)
          if (profileError?.code !== '23505') {
            console.warn('Profile creation warning:', profileError)
          }
        }

        // Create client record if needed (fallback)
        try {
          await supabase
            .from('clients')
            .insert({
              id: data.user.id,
              name: fullName,
              email: email,
              phone: phone || null,
              app_role: 'Viewer',
            })
            .select()
        } catch (clientError: any) {
          // Ignore if client already exists (created by trigger)
          if (clientError?.code !== '23505') {
            console.warn('Client creation warning:', clientError)
          }
        }
      }

      // Clear sessionStorage
      sessionStorage.removeItem('signup_email')
      sessionStorage.removeItem('signup_full_name')
      sessionStorage.removeItem('signup_phone')

      // Redirect to welcome page
      navigate('/welcome')
    } catch (err: any) {
      setError(err.message || 'Invalid verification code. Please try again.')
      // Clear code on error
      setCode(['', '', '', '', '', ''])
      inputRefs.current[0]?.focus()
    } finally {
      setLoading(false)
    }
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    handleVerify()
  }

  return (
    <div className="min-h-screen bg-[#17181a] flex flex-col items-center justify-center p-5 md:p-[120px] relative overflow-hidden">
      {/* Header - Logo - Fixed position relative to viewport */}
      <div className="fixed left-5 md:left-10 top-5 md:top-10 z-20">
        <img 
          src="/src/assets/images/logo.png" 
          alt="MCI Logo" 
          className="w-10 h-10 md:w-16 md:h-16 object-contain"
        />
      </div>

      {/* Main Content - Verify Code Form */}
      <div className="relative w-full max-w-[480px] z-10">
        <div className="flex flex-col gap-10 items-center">
          {/* Title Section */}
          <div className="flex flex-col gap-2 items-center text-center w-full">
            <p className="font-medium text-[18px] leading-[21.6px] tracking-[-0.36px] text-[#c7c9cd]">
              This is the Last Step
            </p>
            <p className="font-semibold text-[32px] leading-[38.4px] tracking-[-0.64px] text-white">
              Confirm Your Identity
            </p>
            <p className="font-normal text-[16px] leading-[20.8px] tracking-[-0.32px] text-[#c7c9cd] mt-2">
              We sent an 8-digit code to your email {maskEmail(email)} to confirm your identity. Write your code down below to proceed.
            </p>
          </div>

          {/* Success message */}
          {successMessage && (
            <div className="w-full bg-green-500/10 border border-green-500/30 text-green-400 p-4 rounded-xl text-sm flex items-center gap-2 animate-in fade-in slide-in-from-top-2">
              <div className="w-1.5 h-1.5 rounded-full bg-green-400"></div>
              <span>{successMessage}</span>
            </div>
          )}

          {/* Error message */}
          {error && (
            <div className="w-full bg-red-500/10 border border-red-500/30 text-red-400 p-4 rounded-xl text-sm flex items-center gap-2 animate-in fade-in slide-in-from-top-2">
              <div className="w-1.5 h-1.5 rounded-full bg-red-400"></div>
              <span>{error}</span>
            </div>
          )}

          {/* Code Input Form */}
          <form onSubmit={handleSubmit} className="flex flex-col gap-2 items-start w-full">
            {/* 8 Code Inputs */}
            <div className="flex gap-5 md:gap-5 w-full">
              {code.map((digit, index) => (
                <div key={index} className="flex flex-1 flex-col gap-1">
                  <input
                    ref={(el) => (inputRefs.current[index] = el)}
                    type="text"
                    inputMode="numeric"
                    maxLength={1}
                    value={digit}
                    onChange={(e) => handleChange(index, e.target.value)}
                    onKeyDown={(e) => handleKeyDown(index, e)}
                    onPaste={index === 0 ? handlePaste : undefined}
                    className="w-full bg-[#2f3133] rounded-[6px] px-3 py-3 text-[18px] leading-[23.4px] tracking-[-0.36px] text-white text-center focus:outline-none focus:ring-2 focus:ring-[#ff3856]/20 transition-all border-0"
                    disabled={loading}
                    autoComplete="off"
                  />
                </div>
              ))}
            </div>

            {/* Resend Code and Change Email */}
            <div className="flex flex-col items-center justify-center w-full gap-3">
              <button
                type="button"
                onClick={handleResendCode}
                disabled={resending || loading}
                className="font-normal text-[16px] leading-[20.8px] tracking-[-0.32px] text-[#ff3856] hover:text-[#ff3856]/80 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
              >
                {resending ? (
                  <>
                    <Loader2 size={16} className="animate-spin" />
                    <span>Sending...</span>
                  </>
                ) : (
                  <span>Resend code</span>
                )}
              </button>
              
              <div className="flex items-center justify-center gap-1">
                <p className="font-normal text-[16px] leading-[20.8px] tracking-[-0.32px] text-[#c7c9cd]">
                  Not the right email?
                </p>
                <Link
                  to="/signup"
                  className="font-normal text-[16px] leading-[20.8px] tracking-[-0.32px] text-[#ff3856] underline hover:text-[#ff3856]/80 transition-colors"
                >
                  Change email
                </Link>
              </div>
            </div>

            {/* Confirm Button */}
            <button
              type="submit"
              disabled={loading || code.some(digit => !digit)}
              className="w-full bg-[#ff3856] hover:bg-[#ff3856]/90 text-white font-medium text-[18px] leading-[23.4px] tracking-[-0.36px] px-5 py-4 rounded-full transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-3 mt-2"
            >
              {loading ? (
                <>
                  <Loader2 size={18} className="animate-spin" />
                  <span>Verifying...</span>
                </>
              ) : (
                <span>Confirm</span>
              )}
            </button>
          </form>
        </div>
      </div>

      {/* Footer - Fixed position relative to viewport */}
      <div className="fixed bottom-0 left-0 right-0 px-5 md:px-10 py-3 md:py-5 z-20 bg-[#17181a]">
        {/* Desktop: horizontal layout */}
        <div className="hidden md:flex items-center justify-between w-full">
          <p className="font-normal text-[12px] leading-[15.6px] tracking-[-0.24px] text-[#747980]">
            All Rights Reserved @MCI Group Canada 2026.
          </p>
          <div className="flex gap-5 items-center font-normal text-[12px] leading-[15.6px] tracking-[-0.24px] text-[#747980] underline">
            <Link 
              to="/privacy-policy" 
              className="hover:text-white transition-colors decoration-solid"
            >
              Privacy Policy
            </Link>
            <Link 
              to="/terms-of-service" 
              className="hover:text-white transition-colors decoration-solid"
            >
              Terms of Service
            </Link>
          </div>
        </div>
        
        {/* Mobile: vertical layout */}
        <div className="flex md:hidden flex-col items-center gap-3 w-full">
          <div className="flex gap-5 items-center justify-center font-normal text-[12px] leading-[15.6px] tracking-[-0.24px] text-[#747980] underline w-full">
            <Link 
              to="/privacy-policy" 
              className="hover:text-white transition-colors decoration-solid"
            >
              Privacy Policy
            </Link>
            <Link 
              to="/terms-of-service" 
              className="hover:text-white transition-colors decoration-solid"
            >
              Terms of Service
            </Link>
          </div>
          <p className="font-normal text-[12px] leading-[15.6px] tracking-[-0.24px] text-[#747980] text-center">
            All Rights Reserved @MCI Group Canada 2026.
          </p>
        </div>
      </div>
    </div>
  )
}

