import React, { useState } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import { supabase } from '../lib/supabase'
import { EyeOff, Loader2 } from 'lucide-react'

// Custom checkbox icon component matching Figma design - check crosses the field
const CheckboxIcon: React.FC<{ checked: boolean; className?: string }> = ({ checked, className }) => (
  <svg
    width="28"
    height="28"
    viewBox="0 0 32 32"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    className={className}
    style={{ width: '28px', height: '28px', flexShrink: 0 }}
  >
    {checked ? (
      <>
        {/* Checkbox square with rounded corners - check crosses the field (from Figma SVG) */}
        <path
          d="M6 23V9C6 8.20435 6.3163 7.44152 6.87891 6.87891C7.44152 6.3163 8.20435 6 9 6H21.3438C21.896 6 22.3438 6.44772 22.3438 7C22.3438 7.55228 21.896 8 21.3438 8H9C8.73478 8 8.4805 8.10543 8.29297 8.29297C8.10543 8.4805 8 8.73478 8 9V23C8 23.2652 8.10543 23.5195 8.29297 23.707C8.48051 23.8946 8.73478 24 9 24H23C23.2652 24 23.5195 23.8946 23.707 23.707C23.8946 23.5195 24 23.2652 24 23V14.6562C24 14.104 24.4477 13.6562 25 13.6562C25.5523 13.6562 26 14.104 26 14.6562V23C26 23.7957 25.6837 24.5585 25.1211 25.1211C24.5585 25.6837 23.7957 26 23 26H9C8.20435 26 7.44151 25.6837 6.87891 25.1211C6.3163 24.5585 6 23.7957 6 23ZM25.293 7.29297C25.6835 6.90244 26.3165 6.90244 26.707 7.29297C27.0976 7.68349 27.0976 8.31651 26.707 8.70703L16.707 18.707C16.3165 19.0976 15.6835 19.0976 15.293 18.707L12.293 15.707C11.9024 15.3165 11.9024 14.6835 12.293 14.293C12.6835 13.9024 13.3165 13.9024 13.707 14.293L16 16.5859L25.293 7.29297Z"
          fill="#FF3856"
        />
      </>
    ) : (
      <path
        d="M6 23V9C6 8.20435 6.3163 7.44152 6.87891 6.87891C7.44152 6.3163 8.20435 6 9 6H21.3438C21.896 6 22.3438 6.44772 22.3438 7C22.3438 7.55228 21.896 8 21.3438 8H9C8.73478 8 8.4805 8.10543 8.29297 8.29297C8.10543 8.4805 8 8.73478 8 9V23C8 23.2652 8.10543 23.5195 8.29297 23.707C8.48051 23.8946 8.73478 24 9 24H23C23.2652 24 23.5195 23.8946 23.707 23.707C23.8946 23.5195 24 23.2652 24 23V14.6562C24 14.104 24.4477 13.6562 25 13.6562C25.5523 13.6562 26 14.104 26 14.6562V23C26 23.7957 25.6837 24.5585 25.1211 25.1211C24.5585 25.6837 23.7957 26 23 26H9C8.20435 26 7.44151 25.6837 6.87891 25.1211C6.3163 24.5585 6 23.7957 6 23Z"
        fill="transparent"
        stroke="#747980"
        strokeWidth="2"
      />
    )}
  </svg>
)

export const Login: React.FC = () => {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [rememberMe, setRememberMe] = useState(false)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const navigate = useNavigate()

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError(null)

    try {
      const { error } = await supabase.auth.signInWithPassword({
        email,
        password,
      })

      if (error) throw error
      
      navigate('/')
    } catch (err: any) {
      setError(err.message || 'Failed to login')
    } finally {
      setLoading(false)
    }
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

      {/* Main Content - Login Form */}
      <div className="relative w-full max-w-[480px] z-10">
        <div className="flex flex-col gap-5 items-center">
          {/* Title Section */}
          <div className="flex flex-col gap-2 items-center text-center w-full">
            <p className="font-medium text-[18px] leading-[21.6px] tracking-[-0.36px] text-[#c7c9cd]">
              Let's Authenticate Your First
            </p>
            <p className="font-semibold text-[32px] leading-[38.4px] tracking-[-0.64px] text-white">
              Welcome to MCI Analytics
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
          <form onSubmit={handleLogin} className="flex flex-col gap-5 items-start w-full">
            {/* Email Input */}
            <div className="flex flex-col gap-1 items-start w-full">
              <label className="font-normal text-[18px] leading-[23.4px] tracking-[-0.36px] text-[#c7c9cd]">
                Your Email or Username
              </label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full bg-[#2f3133] rounded-[6px] px-3 py-3 text-[18px] leading-[23.4px] tracking-[-0.36px] text-white placeholder:text-[#747980] focus:outline-none focus:ring-2 focus:ring-[#ff3856]/20 transition-all border-0"
                placeholder="email@domain.com"
                required
                disabled={loading}
              />
            </div>

            {/* Password Input */}
            <div className="flex flex-col gap-1 items-start w-full">
              <div className="flex items-center justify-between w-full">
                <label className="font-normal text-[18px] leading-[23.4px] tracking-[-0.36px] text-[#c7c9cd]">
                  Your Password
                </label>
                <Link
                  to="/forgot-password"
                  className="text-[16px] leading-[21px] tracking-[-0.32px] text-[#ff3856] hover:text-[#ff3856]/80 transition-colors"
                >
                  Forgot password?
                </Link>
              </div>
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

            {/* Remember Me Checkbox */}
            <div className="flex gap-2 items-center p-1 rounded-[6px] w-full">
              <button
                type="button"
                onClick={() => setRememberMe(!rememberMe)}
                className="relative w-[28px] h-[28px] flex items-center justify-center transition-all flex-shrink-0 bg-transparent border-0 p-0"
                disabled={loading}
              >
                <CheckboxIcon checked={rememberMe} className="w-[28px] h-[28px]" />
              </button>
              <label 
                className="flex-1 font-normal text-[18px] leading-[23.4px] tracking-[-0.36px] text-white cursor-pointer flex items-center"
                onClick={() => setRememberMe(!rememberMe)}
              >
                Save My Login for Later
              </label>
            </div>

            {/* Login Button */}
            <button
              type="submit"
              disabled={loading}
              className="w-full bg-[#ff3856] hover:bg-[#ff3856]/90 text-white font-medium text-[18px] leading-[23.4px] tracking-[-0.36px] px-5 py-4 rounded-full transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-3"
            >
              {loading ? (
                <>
                  <Loader2 size={18} className="animate-spin" />
                  <span>Signing in...</span>
                </>
              ) : (
                <span>Login</span>
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
