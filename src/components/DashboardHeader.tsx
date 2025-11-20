import React from 'react'
import { ArrowRight } from 'lucide-react'

interface DashboardHeaderProps {
  userName?: string
}

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

export const DashboardHeader: React.FC<DashboardHeaderProps> = ({
  userName = 'Michele',
}) => {
  return (
    <header className="flex items-center justify-between w-full">
      <div>
        <h1 className="text-2xl font-semibold leading-[28.8px] text-[#C7C9CD] tracking-[-0.48px]">
          Welcome, {userName}
        </h1>
      </div>
      
      <div className="flex items-center gap-2">
        <div className="relative group">
          <div className="flex items-center border border-[#45484D] rounded-full w-[300px] focus-within:border-gray-600 transition-colors">
            <button className="p-3 rounded-full flex items-center justify-center">
              <ArrowRight size={20} className="text-gray-500" />
            </button>
            <input 
              type="text" 
              placeholder="Search for Something" 
              className="flex-1 bg-transparent border-none outline-none text-base text-[#ABAEB3] placeholder-[#ABAEB3] py-2"
            />
          </div>
        </div>
        
        <button className="p-3 rounded-full text-gray-400 hover:text-white transition-colors relative">
          <NotificationIcon className="w-5 h-5" />
        </button>
      </div>
    </header>
  )
}
