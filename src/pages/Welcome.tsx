import React, { useEffect } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import { useAuth } from '../contexts/AuthContext'

export const Welcome: React.FC = () => {
  const navigate = useNavigate()
  const { user, loading: authLoading } = useAuth()

  // Auto-redirect to dashboard after 5 seconds
  useEffect(() => {
    if (user && !authLoading) {
      const timer = setTimeout(() => {
        navigate('/')
      }, 5000)

      return () => clearTimeout(timer)
    }
  }, [user, authLoading, navigate])

  // Redirect to login if not authenticated
  useEffect(() => {
    if (!authLoading && !user) {
      navigate('/login')
    }
  }, [user, authLoading, navigate])

  const handleGoToHome = () => {
    navigate('/')
  }

  if (authLoading) {
    return (
      <div className="min-h-screen bg-[#17181a] flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-[#FF3856]"></div>
      </div>
    )
  }

  if (!user) {
    return null
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

      {/* Main Content - Welcome Message */}
      <div className="relative w-full max-w-[480px] z-10">
        <div className="flex flex-col gap-10 items-center">
          {/* Title Section */}
          <div className="flex flex-col gap-2 items-center text-center w-full">
            <p className="font-medium text-[18px] leading-[21.6px] tracking-[-0.36px] text-[#c7c9cd]">
              Identity Confirmed!
            </p>
            <p className="font-semibold text-[32px] leading-[38.4px] tracking-[-0.64px] text-white">
              Welcome to the MCI Dashboard!
            </p>
            <p className="font-normal text-[16px] leading-[20.8px] tracking-[-0.32px] text-[#c7c9cd] mt-2">
              Donec diam neque sapien mi maecenas sed enim penatibus. Tempor tincidunt egestas enim malesuada quam varius commodo aliquet purus.
            </p>
          </div>

          {/* Go to Home Button */}
          <button
            onClick={handleGoToHome}
            className="w-full bg-[#ff3856] hover:bg-[#ff3856]/90 text-white font-medium text-[18px] leading-[23.4px] tracking-[-0.36px] px-5 py-4 rounded-full transition-all duration-200 flex items-center justify-center gap-3"
          >
            <span>Go to Home</span>
          </button>
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

