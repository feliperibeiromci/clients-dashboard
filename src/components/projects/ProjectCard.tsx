import React, { useState } from 'react'
import { ArrowUpRight } from 'lucide-react'
import { ClientLogo } from './ClientLogo'

interface ProjectCardProps {
  name: string
  company: string
  logo: string
  isHovered?: boolean
  onClick?: () => void
  isSelected?: boolean
}

export const ProjectCard: React.FC<ProjectCardProps> = ({ name, company, logo, isHovered = false, onClick, isSelected = false }) => {
  const [isLocalHovered, setIsLocalHovered] = useState(false)
  const hovered = isHovered || isLocalHovered
  
  // If selected, we want it to look active/highlighted similar to hover but maybe distinctive
  const active = hovered || isSelected

  return (
    <div 
      className={`
        border rounded-lg md:rounded-xl p-3 md:p-5 flex flex-col gap-2 md:gap-2.5 cursor-pointer transition-all duration-300 relative group overflow-hidden
        ${active 
          ? 'border-[#45484D] bg-[#2F3133]/50' 
          : 'border-[#2F3133] hover:border-[#45484D] hover:bg-[#2F3133]/30'
        }
        ${isSelected ? 'ring-1 ring-[#FF3856]/50' : ''} 
      `}
      onMouseEnter={() => setIsLocalHovered(true)}
      onMouseLeave={() => setIsLocalHovered(false)}
      onClick={onClick}
    >
      {/* Hover gradient background effect */}
      {active && (
        <div className="absolute inset-0 bg-gradient-to-br from-[#2F3133]/80 to-[#17181A]/80 opacity-50 transition-opacity duration-300" />
      )}

      <div className="flex items-start justify-between relative z-10">
        <div className="flex flex-col gap-1 flex-1 min-w-0">
          <h3 className={`
            text-lg md:text-2xl font-semibold leading-[21.6px] md:leading-[28.8px] tracking-[-0.36px] md:tracking-[-0.48px] transition-colors duration-300 truncate
            ${active ? 'text-[#F1F2F3]' : 'text-[#747980] group-hover:text-[#F1F2F3]'}
          `}>
            {name}
          </h3>
          <div className="flex items-center gap-1">
            <div className="shrink-0">
              <ClientLogo logo={logo} size={20} className="w-4 h-4 md:w-5 md:h-5" />
            </div>
            <span className={`
              text-sm md:text-lg font-semibold leading-[18px] md:leading-[21.6px] tracking-[-0.28px] md:tracking-[-0.36px] transition-colors duration-300 truncate
              ${active ? 'text-[#ABAEB3]' : 'text-[#5D6166] group-hover:text-[#ABAEB3]'}
            `}>
              {company}
            </span>
          </div>
        </div>
        
        <button 
          className={`
            shrink-0 p-1.5 md:p-2 rounded-full transition-all duration-300 relative z-10
            ${active 
              ? 'bg-[#414141] hover:bg-[#4A4A4A] opacity-100' 
              : 'bg-[#2F3133] hover:bg-[#414141] opacity-0 group-hover:opacity-100 md:opacity-0'
            }
          `}
        >
          <ArrowUpRight size={14} className="md:w-4 md:h-4 text-white" />
        </button>
      </div>
    </div>
  )
}
