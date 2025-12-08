import React from 'react'
import { ArrowUpRight, Diamond, Zap, Car, Activity, Box, Leaf, Building2, Globe } from 'lucide-react'

const projects = [
  { name: 'Clio Car Launch', company: 'Renault', icon: Diamond },
  { name: 'Civic Hybrid Release', company: 'Honda', icon: Box },
  { name: 'Mustang Mach-E Update', company: 'Ford', icon: Car },
  { name: 'Model S Plaid Introduction', company: 'Tesla', icon: Zap },
  { name: 'Tucson Facelift Reveal', company: 'Hyundai', icon: Activity },
  { name: 'Camry 2024 Model Launch', company: 'Toyota', icon: Globe },
  { name: 'A6 e-Tron Debut', company: 'Audi', icon: Building2 },
  { name: 'Cherokee Electric Unveiling', company: 'Jeep', icon: Leaf },
  { name: 'Q5 Sportback Premiere', company: 'Audi', icon: Building2 },
  { name: 'Kona EV Update', company: 'Hyundai', icon: Activity },
]

export const OtherProjects: React.FC = () => {
  return (
    <div className="bg-[#17181A] p-3 md:p-5 rounded-[20px] border border-gray-800/50 h-full">
      <div className="flex flex-col md:flex-row md:justify-between md:items-start gap-3 md:gap-0 mb-3 md:mb-5">
        <div className="flex-1 min-w-0">
          <h2 className="text-xl md:text-2xl font-semibold leading-[24px] md:leading-[28.8px] text-white mb-1 tracking-[-0.4px] md:tracking-[-0.48px]">Other Projects</h2>
          <p className="text-xs md:text-sm font-medium text-[#ABAEB3] leading-[15.6px] md:leading-[18.2px] tracking-[-0.24px] md:tracking-[-0.28px]" style={{ fontFamily: 'Jost, sans-serif' }}>55 Active Projects</p>
        </div>
        <button className="flex items-center gap-1.5 text-[10px] md:text-xs font-medium text-white bg-[#414141] px-2.5 md:px-3 py-1.5 md:py-2 rounded-full hover:opacity-80 transition-opacity self-start md:self-auto">
          <span>See All</span>
          <ArrowUpRight size={14} className="md:w-4 md:h-4" />
        </button>
      </div>

      <div className="space-y-[4px] overflow-y-auto max-h-[400px] md:max-h-[600px] pr-2 custom-scrollbar">
        {projects.map((project, index) => (
          <div 
            key={index} 
            className="flex items-center justify-between p-3 rounded-lg hover:bg-white/5 transition-colors cursor-pointer group"
          >
            <div className="flex items-start gap-2 md:gap-3 flex-1 min-w-0">
              <div className="text-[#ABAEB3] group-hover:text-white transition-colors mt-0.5 shrink-0 w-4 h-4 md:w-5 md:h-5 flex items-center justify-center">
                {React.createElement(project.icon, { size: 16, className: 'md:w-5 md:h-5' })}
              </div>
              <div className="flex-1 min-w-0">
                <h3 className="text-base md:text-lg font-semibold leading-[20px] md:leading-[24px] text-[#ABAEB3] group-hover:text-white transition-colors tracking-[-0.32px] md:tracking-[-0.4px] truncate" style={{ fontFamily: 'Jost, sans-serif' }}>
                  {project.name}
                </h3>
                <p className="text-xs md:text-sm font-medium text-[#ABAEB3] leading-[15.6px] md:leading-[18.2px] tracking-[-0.24px] md:tracking-[-0.28px] truncate" style={{ fontFamily: 'Jost, sans-serif' }}>
                  {project.company}
                </p>
              </div>
            </div>
            <div className="p-1 rounded-full shrink-0">
              <ArrowUpRight size={14} className="md:w-4 md:h-4 text-[#ABAEB3] group-hover:text-white transition-colors" />
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
