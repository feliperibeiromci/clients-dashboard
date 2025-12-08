import React from 'react'
import { useAuth } from '../contexts/AuthContext'

// Remix Icon: notification-3-line
const NotificationIcon: React.FC<{ className?: string }> = ({ className }) => {
  return (
    <svg
      width="20"
      height="20"
      viewBox="0 0 24 24"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
    >
      <path
        d="M20 18H18V11C18 7.93 16.36 5.36 13.5 4.68V4C13.5 3.17 12.83 2.5 12 2.5C11.17 2.5 10.5 3.17 10.5 4V4.68C7.63 5.36 6 7.92 6 11V18H4V20H20V18ZM16 18H8V11C8 8.52 9.51 6.5 12 6.5C14.49 6.5 16 8.52 16 11V18ZM12 21.5C12.83 21.5 13.5 20.83 13.5 20H10.5C10.5 20.83 11.17 21.5 12 21.5Z"
        fill="currentColor"
      />
    </svg>
  )
}

interface WelcomeSectionProps {
  variant?: 'mobile' | 'desktop'
}

export const WelcomeSection: React.FC<WelcomeSectionProps> = ({ variant = 'mobile' }) => {
  const { user } = useAuth()
  const userName = user?.email?.split('@')[0] || 'User'

  if (variant === 'desktop') {
    // Desktop version - integrated with header
    return (
      <div className="flex items-center justify-between w-full">
        <div className="flex items-center gap-3">
          <div className="border border-[#8F949A] rounded-[6px] shrink-0 w-12 h-12 flex items-center justify-center bg-transparent overflow-hidden">
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M20 21V19C20 17.9391 19.5786 16.9217 18.8284 16.1716C18.0783 15.4214 17.0609 15 16 15H8C6.93913 15 5.92172 15.4214 5.17157 16.1716C4.42143 16.9217 4 17.9391 4 19V21" stroke="#ABAEB3" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
              <path d="M12 11C14.2091 11 16 9.20914 16 7C16 4.79086 14.2091 3 12 3C9.79086 3 8 4.79086 8 7C8 9.20914 9.79086 11 12 11Z" stroke="#ABAEB3" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
          </div>
          <p className="font-semibold leading-[24px] text-[#C7C9CD] text-xl tracking-[-0.4px]" style={{ fontFamily: 'Jost, sans-serif' }}>
            Welcome, {userName}
          </p>
        </div>
        
        <button className="p-3 rounded-full text-gray-400 hover:text-white transition-colors relative">
          <NotificationIcon className="w-5 h-5" />
        </button>
      </div>
    )
  }

  // Mobile version - current layout
  return (
    <div className="flex items-center justify-between w-full">
      <div className="flex items-center gap-3">
        <div className="border border-[#8F949A] rounded-[6px] shrink-0 w-12 h-12 flex items-center justify-center bg-transparent overflow-hidden">
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M20 21V19C20 17.9391 19.5786 16.9217 18.8284 16.1716C18.0783 15.4214 17.0609 15 16 15H8C6.93913 15 5.92172 15.4214 5.17157 16.1716C4.42143 16.9217 4 17.9391 4 19V21" stroke="#ABAEB3" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
            <path d="M12 11C14.2091 11 16 9.20914 16 7C16 4.79086 14.2091 3 12 3C9.79086 3 8 4.79086 8 7C8 9.20914 9.79086 11 12 11Z" stroke="#ABAEB3" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
        </div>
        <p className="font-semibold leading-[24px] text-[#C7C9CD] text-xl tracking-[-0.4px]" style={{ fontFamily: 'Jost, sans-serif' }}>
          Welcome, {userName}
        </p>
      </div>
      
      <button className="p-3 rounded-full text-gray-400 hover:text-white transition-colors relative">
        <NotificationIcon className="w-5 h-5" />
      </button>
    </div>
  )
}

