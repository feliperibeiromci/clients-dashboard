import React from 'react'
import { ArrowRight } from 'lucide-react'
import { WelcomeSection } from './WelcomeSection'

interface DashboardHeaderProps {
  userName?: string
}

export const DashboardHeader: React.FC<DashboardHeaderProps> = ({
  userName = 'Michele',
}) => {
  return (
    <header className="flex items-center justify-between w-full">
      <WelcomeSection variant="desktop" />
      
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
      </div>
    </header>
  )
}
