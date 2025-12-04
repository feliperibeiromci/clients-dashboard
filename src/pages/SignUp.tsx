import React, { useState, useEffect } from 'react'
import { useNavigate, Link, useSearchParams } from 'react-router-dom'
import { supabase } from '../lib/supabase'
import { EyeOff, Loader2 } from 'lucide-react'

export const SignUp: React.FC = () => {
  const [searchParams] = useSearchParams()
  const [fullName, setFullName] = useState('')
  const [phoneNumber, setPhoneNumber] = useState('')
  const [emailPrefix, setEmailPrefix] = useState('')
  const [password, setPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [invitedByName, setInvitedByName] = useState<string>('')
  const [loadingInvite, setLoadingInvite] = useState(true)
  const [inviteError, setInviteError] = useState<string | null>(null)
  const [inviteToken, setInviteToken] = useState<string | null>(null)
  const navigate = useNavigate()

  // Format phone number: remove +, spaces, and non-numeric characters
  const formatPhoneNumber = (value: string): string => {
    // Remove all non-numeric characters including +, spaces, dashes, parentheses
    return value.replace(/\D/g, '')
  }

  // Handle phone number input change
  const handlePhoneChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const formatted = formatPhoneNumber(e.target.value)
    setPhoneNumber(formatted)
  }

  // Get invite token from URL
  useEffect(() => {
    const token = searchParams.get('token')
    setInviteToken(token)
    
    const fetchInviterInfo = async () => {
      if (!token) {
        setError('Invalid invitation link. Please use a valid invitation URL.')
        setLoadingInvite(false)
        return
      }

      try {
        // Fetch invite information
        const { data: inviteData, error: inviteError } = await supabase
          .from('invites')
          .select('id, token, used, expires_at, invited_by')
          .eq('token', token)
          .single()

        if (inviteError) throw inviteError

        if (!inviteData) {
          throw new Error('Invitation not found')
        }

        if (inviteData.used) {
          throw new Error('This invitation has already been used')
        }

        if (inviteData.expires_at && new Date(inviteData.expires_at) < new Date()) {
          throw new Error('This invitation has expired')
        }

        // Fetch inviter's name using RPC function to avoid RLS issues
        // Only if invited_by exists (test invites may not have an inviter)
        if (inviteData.invited_by) {
          const { data: inviterName, error: nameError } = await supabase
            .rpc('get_inviter_name', { invite_token_param: token })

          if (!nameError && inviterName) {
            setInvitedByName(inviterName)
          } else {
            setInvitedByName('a team member')
          }
        } else {
          // Test invite without inviter
          setInvitedByName('the MCI Analytics team')
        }
        
        setLoadingInvite(false)
      } catch (err: any) {
        setInviteError(err.message || 'Failed to load invitation')
        setLoadingInvite(false)
      }
    }

    if (token) {
      fetchInviterInfo()
    } else {
      setInviteError('Invalid invitation link. Please use a valid invitation URL.')
      setLoadingInvite(false)
    }
  }, [searchParams])

  // Password validation
  const hasNumber = /\d/.test(password)
  const hasUppercase = /[A-Z]/.test(password)
  const hasSymbol = /[!@#$%^&*(),.?":{}|<>]/.test(password)
  const passwordValid = password.length >= 6 && hasNumber && hasUppercase && hasSymbol

  const handleSignUp = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError(null)

    // Validation
    if (!fullName.trim()) {
      setError('Full name is required')
      setLoading(false)
      return
    }

    if (!emailPrefix.trim()) {
      setError('Email is required')
      setLoading(false)
      return
    }

    if (!passwordValid) {
      setError('Password does not meet requirements')
      setLoading(false)
      return
    }

    if (password !== confirmPassword) {
      setError('Passwords do not match')
      setLoading(false)
      return
    }

    if (!inviteToken) {
      setError('Invalid invitation. Please use a valid invitation link.')
      setLoading(false)
      return
    }

    const fullEmail = `${emailPrefix}@wearemci.com`
    
    // Format phone number before saving (ensure only numbers, no +, spaces, etc.)
    const formattedPhone = phoneNumber ? formatPhoneNumber(phoneNumber) : null

    try {
      // Sign up user - Supabase will automatically send OTP email
      // Note: phone in options.data goes to user_metadata, not auth.users.phone
      // To save in auth.users.phone, we need to use the phone parameter directly
      const signUpData: any = {
        email: fullEmail,
        password,
        options: {
          data: {
            full_name: fullName,
            phone: formattedPhone, // Formatted as numbers only (no +, spaces, etc.) - saved in metadata
            invite_token: inviteToken, // Pass token to trigger function
          },
          // emailRedirectTo undefined means use OTP instead of confirmation link
          emailRedirectTo: undefined,
        },
      }
      
      // If phone is provided, also set it in the phone field (for auth.users.phone column)
      if (formattedPhone) {
        signUpData.phone = formattedPhone
      }
      
      const { data, error: signUpError } = await supabase.auth.signUp(signUpData)

      if (signUpError) throw signUpError

      // Check if user was created successfully
      if (!data?.user) {
        throw new Error('Failed to create user account')
      }

      // If user exists but needs confirmation, resend OTP
      if (data.user && !data.session) {
        // User created but not confirmed - OTP should have been sent automatically
        // But we can explicitly resend if needed
        console.log('User created, OTP email should have been sent to:', fullEmail)
        
        // Optional: Explicitly resend OTP to ensure it's sent
        try {
          const { error: resendError } = await supabase.auth.resend({
            type: 'signup',
            email: fullEmail,
          })
          
          if (resendError) {
            console.warn('Error resending OTP (may have already been sent):', resendError)
            // Don't throw - OTP might have already been sent
          }
        } catch (resendErr) {
          console.warn('Could not resend OTP:', resendErr)
          // Continue anyway - OTP might have been sent on signup
        }
      }

      // Store email in sessionStorage for verify code page
      // Store formatted phone (numbers only)
      sessionStorage.setItem('signup_email', fullEmail)
      sessionStorage.setItem('signup_full_name', fullName)
      sessionStorage.setItem('signup_phone', formattedPhone || '')

      // Redirect to verify code page
      navigate(`/verify-code?email=${encodeURIComponent(fullEmail)}`)
    } catch (err: any) {
      console.error('SignUp error:', err)
      
      // Handle specific error cases
      if (err.message?.includes('already registered') || err.message?.includes('User already registered')) {
        setError('This email is already registered. Please use a different email or sign in.')
      } else if (err.message?.includes('Database error')) {
        setError('There was an error creating your account. The profile may still be creating. Please wait a moment and try signing in, or contact support if the problem persists.')
        console.error('Database error details:', err)
      } else {
        setError(err.message || 'Failed to create account. Please try again.')
      }
    } finally {
      setLoading(false)
    }
  }

  // Show error if invite is invalid
  if (inviteError && !loadingInvite) {
    return (
      <div className="min-h-screen bg-[#17181a] flex flex-col items-center justify-center p-5 md:p-[120px] relative overflow-hidden">
        <div className="fixed left-5 md:left-10 top-5 md:top-10 z-20">
          <img 
            src="/src/assets/images/logo.png" 
            alt="MCI Logo" 
            className="w-10 h-10 md:w-16 md:h-16 object-contain"
          />
        </div>
        <div className="relative w-full max-w-[480px] z-10 text-center">
          <div className="bg-red-500/10 border border-red-500/30 text-red-400 p-6 rounded-xl">
            <p className="font-medium text-lg mb-2">Invalid Invitation</p>
            <p className="text-sm mb-4">{inviteError}</p>
            <Link 
              to="/login" 
              className="text-[#ff3856] underline hover:text-[#ff3856]/80"
            >
              Go to Login
            </Link>
          </div>
        </div>
      </div>
    )
  }

  // Show loading while fetching invite info
  if (loadingInvite) {
    return (
      <div className="min-h-screen bg-[#17181a] flex flex-col items-center justify-center p-5 md:p-[120px] relative overflow-hidden">
        <div className="fixed left-5 md:left-10 top-5 md:top-10 z-20">
          <img 
            src="/src/assets/images/logo.png" 
            alt="MCI Logo" 
            className="w-10 h-10 md:w-16 md:h-16 object-contain"
          />
        </div>
        <div className="relative w-full max-w-[480px] z-10 flex items-center justify-center">
          <Loader2 size={24} className="animate-spin text-[#ff3856]" />
        </div>
      </div>
    )
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

      {/* Main Content - SignUp Form */}
      <div className="relative w-full max-w-[480px] z-10">
        <div className="flex flex-col gap-5 items-center">
          {/* Title Section */}
          <div className="flex flex-col gap-2 items-center text-center w-full">
            <p className="font-medium text-[18px] leading-[21.6px] tracking-[-0.36px] text-[#c7c9cd]">
              Let's Get to Know Each Other
            </p>
            <p className="font-semibold text-[32px] leading-[38.4px] tracking-[-0.64px] text-white">
              Sign In to MCI Analytics
            </p>
            <p className="font-normal text-[16px] leading-[20.8px] tracking-[-0.32px] text-[#c7c9cd] mt-2">
              You've been invited by the MCI Analytics Dashboard by {invitedByName || 'a team member'}. Fill your information to get access to the dashboard and get started.
            </p>
          </div>

          {/* Error message */}
          {error && (
            <div className="w-full bg-red-500/10 border border-red-500/30 text-red-400 p-4 rounded-xl text-sm flex items-center gap-2 animate-in fade-in slide-in-from-top-2">
              <div className="w-1.5 h-1.5 rounded-full bg-red-400"></div>
              <span>{error}</span>
            </div>
          )}

          {/* Form */}
          <form onSubmit={handleSignUp} className="flex flex-col gap-5 items-start w-full">
            {/* Full Name and Phone Number - Side by side on desktop */}
            <div className="flex flex-col md:flex-row gap-5 w-full">
              {/* Full Name Input */}
              <div className="flex flex-1 flex-col gap-1 items-start w-full">
                <label className="font-normal text-[18px] leading-[23.4px] tracking-[-0.36px] text-[#c7c9cd]">
                  Full Name
                </label>
                <input
                  type="text"
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                  className="w-full bg-[#2f3133] rounded-[6px] px-3 py-3 text-[18px] leading-[23.4px] tracking-[-0.36px] text-white placeholder:text-[#747980] focus:outline-none focus:ring-2 focus:ring-[#ff3856]/20 transition-all border-0"
                  placeholder="e.g. James Smith"
                  required
                  disabled={loading}
                />
              </div>

                    {/* Phone Number Input */}
                    <div className="flex flex-1 flex-col gap-1 items-start w-full">
                      <label className="font-normal text-[18px] leading-[23.4px] tracking-[-0.36px] text-[#c7c9cd]">
                        Phone Number
                      </label>
                      <input
                        type="tel"
                        inputMode="numeric"
                        value={phoneNumber}
                        onChange={handlePhoneChange}
                        className="w-full bg-[#2f3133] rounded-[6px] px-3 py-3 text-[18px] leading-[23.4px] tracking-[-0.36px] text-white placeholder:text-[#747980] focus:outline-none focus:ring-2 focus:ring-[#ff3856]/20 transition-all border-0"
                        placeholder="551234567890"
                        disabled={loading}
                        maxLength={15}
                      />
                      {phoneNumber && (
                        <p className="text-xs text-[#747980] mt-1">
                          Numbers only (no +, spaces, or special characters)
                        </p>
                      )}
                    </div>
            </div>

            {/* Email Input with suffix */}
            <div className="flex flex-col gap-1 items-start w-full">
              <label className="font-normal text-[18px] leading-[23.4px] tracking-[-0.36px] text-[#c7c9cd]">
                Email
              </label>
              <div className="flex gap-2 items-end w-full">
                <input
                  type="text"
                  value={emailPrefix}
                  onChange={(e) => setEmailPrefix(e.target.value)}
                  className="flex-1 bg-[#2f3133] rounded-[6px] px-3 py-3 text-[18px] leading-[23.4px] tracking-[-0.36px] text-white placeholder:text-[#747980] focus:outline-none focus:ring-2 focus:ring-[#ff3856]/20 transition-all border-0"
                  placeholder="james.smith"
                  required
                  disabled={loading}
                />
                <div className="bg-[#2f3133] rounded-[6px] px-3 py-3 text-[18px] leading-[23.4px] tracking-[-0.36px] text-[#f1f2f3] whitespace-nowrap">
                  @wearemci.com
                </div>
              </div>
            </div>

            {/* Password Input */}
            <div className="flex flex-col gap-1 items-start w-full">
              <label className="font-normal text-[18px] leading-[23.4px] tracking-[-0.36px] text-[#c7c9cd]">
                Your Password
              </label>
              <div className="relative w-full">
                <input
                  type={showPassword ? 'text' : 'password'}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full bg-[#2f3133] rounded-[6px] px-3 py-3 pr-10 text-[18px] leading-[23.4px] tracking-[-0.36px] text-white placeholder:text-[#747980] focus:outline-none focus:ring-2 focus:ring-[#ff3856]/20 transition-all border-0"
                  placeholder="****"
                  required
                  disabled={loading}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-[#c7c9cd] hover:text-white transition-colors"
                  disabled={loading}
                >
                  <EyeOff size={24} />
                </button>
              </div>
            </div>

            {/* Confirm Password Input */}
            <div className="flex flex-col gap-1 items-start w-full">
              <label className="font-normal text-[18px] leading-[23.4px] tracking-[-0.36px] text-[#c7c9cd]">
                Confirm Your Password
              </label>
              <div className="relative w-full">
                <input
                  type={showConfirmPassword ? 'text' : 'password'}
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  className="w-full bg-[#2f3133] rounded-[6px] px-3 py-3 pr-10 text-[18px] leading-[23.4px] tracking-[-0.36px] text-white placeholder:text-[#747980] focus:outline-none focus:ring-2 focus:ring-[#ff3856]/20 transition-all border-0"
                  placeholder="****"
                  required
                  disabled={loading}
                />
                <button
                  type="button"
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-[#c7c9cd] hover:text-white transition-colors"
                  disabled={loading}
                >
                  <EyeOff size={24} />
                </button>
              </div>
            </div>

            {/* Password Requirements */}
            {password.length > 0 && (
              <div className="font-normal text-[18px] leading-[23.4px] tracking-[-0.36px] text-[#c7c9cd] w-full">
                <p className="mb-[18px]">Your password must contain:</p>
                <ul className="list-disc ml-[27px] space-y-0">
                  <li className={hasNumber ? 'text-[#c7c9cd]' : 'text-[#747980]'}>
                    One number
                  </li>
                  <li className={hasUppercase ? 'text-[#c7c9cd]' : 'text-[#747980]'}>
                    One uppercase letter
                  </li>
                  <li className={hasSymbol ? 'text-[#c7c9cd]' : 'text-[#747980]'}>
                    One symbol (e.g. $%&*)
                  </li>
                </ul>
              </div>
            )}

            {/* Sign Up Button */}
            <button
              type="submit"
              disabled={loading}
              className="w-full bg-[#ff3856] hover:bg-[#ff3856]/90 text-white font-medium text-[18px] leading-[23.4px] tracking-[-0.36px] px-5 py-4 rounded-full transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-3"
            >
              {loading ? (
                <>
                  <Loader2 size={18} className="animate-spin" />
                  <span>Signing up...</span>
                </>
              ) : (
                <span>Sign Up</span>
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

