import React from 'react'
import { ArrowUpRight, Diamond, Zap, Car, Activity, Box, Leaf, Building2, Globe } from 'lucide-react'

const projects = [
  { name: 'Clio Car Launch', company: 'Renault', icon: <Diamond size={20} /> },
  { name: 'Civic Hybrid Release', company: 'Honda', icon: <Box size={20} /> },
  { name: 'Mustang Mach-E Update', company: 'Ford', icon: <Car size={20} /> },
  { name: 'Model S Plaid Introduction', company: 'Tesla', icon: <Zap size={20} /> },
  { name: 'Tucson Facelift Reveal', company: 'Hyundai', icon: <Activity size={20} /> },
  { name: 'Camry 2024 Model Launch', company: 'Toyota', icon: <Globe size={20} /> },
  { name: 'A6 e-Tron Debut', company: 'Audi', icon: <Building2 size={20} /> },
  { name: 'Cherokee Electric Unveiling', company: 'Jeep', icon: <Leaf size={20} /> },
  { name: 'Q5 Sportback Premiere', company: 'Audi', icon: <Building2 size={20} /> },
  { name: 'Kona EV Update', company: 'Hyundai', icon: <Activity size={20} /> },
]

export const OtherProjects: React.FC = () => {
  return (
    <div className="bg-[#17181A] p-5 rounded-[20px] border border-gray-800/50 h-full">
      <div className="flex justify-between items-start mb-5">
        <div>
          <h2 className="text-2xl font-semibold leading-[28.8px] text-white mb-1 tracking-[-0.48px]">Other Projects</h2>
          <p className="text-sm font-medium text-[#ABAEB3]">55 Active Projects</p>
        </div>
        <button className="flex items-center gap-1.5 text-xs font-medium text-white bg-[#414141] px-3 py-2 rounded-full hover:opacity-80 transition-opacity">
          <span>See Full List</span>
          <ArrowUpRight size={16} />
        </button>
      </div>

      <div className="space-y-[4px] overflow-y-auto max-h-[600px] pr-2 custom-scrollbar">
        {projects.map((project, index) => (
          <div 
            key={index} 
            className="flex items-center justify-between p-3 rounded-lg hover:bg-white/5 transition-colors cursor-pointer group"
          >
            <div className="flex items-start gap-3 flex-1">
              <div className="text-[#ABAEB3] group-hover:text-white transition-colors mt-0.5">
                {project.icon}
              </div>
              <div className="flex-1 min-w-0">
                <h3 className="text-lg font-semibold leading-[24px] text-[#ABAEB3] group-hover:text-white transition-colors tracking-[-0.4px]">
                  {project.name}
                </h3>
                <p className="text-sm font-medium text-[#ABAEB3] leading-[18.2px] tracking-[-0.28px]">
                  {project.company}
                </p>
              </div>
            </div>
            <div className="p-1 rounded-full">
              <ArrowUpRight size={16} className="text-[#ABAEB3] group-hover:text-white transition-colors" />
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
