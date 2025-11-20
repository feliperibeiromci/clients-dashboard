import React from 'react'
import { ArrowUpRight, Diamond, Zap, Car, Activity, Box, Leaf, Building2, Globe } from 'lucide-react'

const projects = [
  { name: 'COP30 ECCC', company: 'Government', icon: <Globe size={18} /> },
  { name: 'Canadian Wood Council', company: 'CWC', icon: <Leaf size={18} /> },
  { name: 'WRCC', company: 'Organization', icon: <Building2 size={18} /> },
  { name: 'Clio Car Launch', company: 'Renault', icon: <Diamond size={18} /> },
  { name: 'Civic Hybrid Release', company: 'Honda', icon: <Box size={18} /> },
  { name: 'Mustang Mach-E Update', company: 'Ford', icon: <Car size={18} /> },
  { name: 'Model S Plaid Introduction', company: 'Tesla', icon: <Zap size={18} /> },
  { name: 'Tucson Facelift Reveal', company: 'Hyundai', icon: <Activity size={18} /> },
]

export const OtherProjects: React.FC = () => {
  return (
    <div className="bg-[#17181A] p-6 rounded-3xl border border-gray-800/50 h-full">
      <div className="flex justify-between items-start mb-6">
        <div>
          <h2 className="text-xl font-bold text-white mb-1">Other Projects</h2>
          <p className="text-sm text-gray-500">55 Active Projects</p>
        </div>
        <button className="flex items-center space-x-1 text-xs font-medium text-gray-400 bg-[#1F1F1F] px-3 py-1.5 rounded-full hover:text-white transition-colors border border-gray-700/50">
          <span>See Full List</span>
          <ArrowUpRight size={14} />
        </button>
      </div>

      <div className="space-y-1 overflow-y-auto max-h-[600px] pr-2 custom-scrollbar">
        {projects.map((project, index) => (
          <div 
            key={index} 
            className="flex items-center justify-between p-3 rounded-xl hover:bg-white/5 transition-colors cursor-pointer group"
          >
            <div className="flex items-center space-x-4">
              <div className="text-gray-500 group-hover:text-white transition-colors">
                {project.icon}
              </div>
              <div>
                <h3 className="text-sm font-medium text-gray-200 group-hover:text-white transition-colors">
                  {project.name}
                </h3>
                <div className="flex items-center text-xs text-gray-500">
                  <span className="mr-1">⚡</span>
                  {project.company}
                </div>
              </div>
            </div>
            <ArrowUpRight size={16} className="text-gray-600 group-hover:text-white transition-colors" />
          </div>
        ))}
      </div>
    </div>
  )
}
