import React from 'react'
import { Search } from 'lucide-react'

interface DashboardHeaderProps {
  userName?: string
}

const BellIcon: React.FC = () => {
  return (
    <svg
      width="56"
      height="56"
      viewBox="0 0 56 56"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className="w-9 h-9"
    >
      <g clipPath="url(#clip0_89_492)">
        <path
          d="M36 33H38V35H18V33H20V26C20 23.8783 20.8429 21.8434 22.3431 20.3431C23.8434 18.8429 25.8783 18 28 18C30.1217 18 32.1566 18.8429 33.6569 20.3431C35.1571 21.8434 36 23.8783 36 26V33ZM34 33V26C34 24.4087 33.3679 22.8826 32.2426 21.7574C31.1174 20.6321 29.5913 20 28 20C26.4087 20 24.8826 20.6321 23.7574 21.7574C22.6321 22.8826 22 24.4087 22 26V33H34ZM25 37H31V39H25V37Z"
          fill="currentColor"
        />
      </g>
      <defs>
        <clipPath id="clip0_89_492">
          <rect width="24" height="24" fill="white" transform="translate(16 16)" />
        </clipPath>
      </defs>
    </svg>
  )
}

export const DashboardHeader: React.FC<DashboardHeaderProps> = ({
  userName = 'Michele',
}) => {
  return (
    <header className="flex items-center justify-between mb-8 pt-2">
      <div>
        <h1 className="text-2xl font-bold text-white">
          Welcome, {userName}
        </h1>
      </div>
      
      <div className="flex items-center space-x-4">
        <div className="relative group mr-2">
          <div className="flex items-center bg-[#1A1A1A] border border-gray-800 rounded-full px-4 py-2.5 w-64 focus-within:border-gray-600 transition-colors">
            <input 
              type="text" 
              placeholder="Search for Something" 
              className="bg-transparent border-none outline-none text-sm text-gray-300 placeholder-gray-500 w-full"
            />
            <Search size={18} className="text-gray-500 ml-2" />
          </div>
        </div>
        
        <button className="text-gray-400 hover:text-white transition-colors relative">
          <BellIcon />
          <span className="absolute top-[18px] right-[18px] w-2 h-2 bg-red-500 rounded-full border-2 border-[#0a0a0a]"></span>
        </button>
      </div>
    </header>
  )
}
