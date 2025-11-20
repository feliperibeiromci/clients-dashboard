import React, { useState } from 'react'
import { ArrowUpRight, ChevronDown, Plus } from 'lucide-react'
import { SiteSpeedMetric } from './projects/SiteSpeedMetric'
import { OverallTrafficMetric } from './projects/OverallTrafficMetric'
import { EmailOpenRateMetric } from './projects/EmailOpenRateMetric'
import { DailyConversionsMetric } from './projects/DailyConversionsMetric'
import { ProjectCard } from './projects/ProjectCard'
import { ClientFilter } from './projects/ClientFilter'

// Dados mockados dos projetos - serão dinâmicos depois
const mockProjects = [
  { id: 1, name: 'Clio Marketing', company: 'Renault', logo: 'renault', metric: 'Site Speed' },
  { id: 2, name: 'Tundra 2026', company: 'Toyota', logo: 'toyota', metric: 'Overall Traffic' },
  { id: 3, name: 'New Civic', company: 'Honda', logo: 'honda', metric: 'Email Open Rate' },
  { id: 4, name: 'New Veloster Launch', company: 'Hyundai', logo: 'hyundai', metric: 'Daily Conversions' },
  { id: 5, name: 'Clio Marketing', company: 'Renault', logo: 'renault', metric: 'Site Speed' },
  { id: 6, name: 'Tundra 2026', company: 'Toyota', logo: 'toyota', metric: 'Overall Traffic' },
  { id: 7, name: 'New Civic', company: 'Honda', logo: 'honda', metric: 'Email Open Rate' },
  { id: 8, name: 'New Veloster Launch', company: 'Hyundai', logo: 'hyundai', metric: 'Daily Conversions' },
  { id: 9, name: 'Clio Marketing', company: 'Renault', logo: 'renault', metric: 'Site Speed' },
  { id: 10, name: 'Tundra 2026', company: 'Toyota', logo: 'toyota', metric: 'Overall Traffic' },
  { id: 11, name: 'New Civic', company: 'Honda', logo: 'honda', metric: 'Email Open Rate' },
  { id: 12, name: 'New Veloster Launch', company: 'Hyundai', logo: 'hyundai', metric: 'Daily Conversions' },
]

export const ProjectsPage: React.FC = () => {
  const [selectedClient, setSelectedClient] = useState<string>('all')

  return (
    <div className="flex flex-col gap-5 w-full">
      {/* Top row - 4 metric cards */}
      <div className="grid grid-cols-4 gap-5">
        <SiteSpeedMetric 
          projectName="Clio Marketing"
          companyName="Renault"
          logo="renault"
          value={95}
          status="Healthy"
        />
        <OverallTrafficMetric 
          projectName="Tundra 2026"
          companyName="Toyota"
          logo="toyota"
          value={95}
          trend="up"
        />
        <EmailOpenRateMetric 
          projectName="New Civic"
          companyName="Honda"
          logo="honda"
          percentage={66}
          opened={3855}
          total={5841}
        />
        <DailyConversionsMetric 
          projectName="New Veloster Launch"
          companyName="Hyundai"
          logo="hyundai"
        />
      </div>

      {/* All Your Projects section */}
      <div className="bg-[#17181A] rounded-[20px] p-5 flex flex-col gap-5">
        {/* Header */}
        <div className="flex items-center justify-between w-full">
          <div className="flex flex-col gap-1">
            <h2 className="text-2xl font-semibold leading-[28.8px] text-[#F1F2F3] tracking-[-0.48px]">
              All Your Projects
            </h2>
            <div className="flex items-center gap-1.5">
              <div className="w-5 h-5 relative">
                <img src="/src/assets/images/logo.png" alt="MCI" className="w-full h-full object-contain" />
              </div>
              <span className="text-lg font-semibold leading-[21.6px] text-white tracking-[-0.36px]">
                MCI Group
              </span>
            </div>
          </div>
          
          <div className="flex items-center gap-2">
            <button className="bg-[#414141] hover:bg-[#414141]/80 text-white px-3 py-2 rounded-full flex items-center gap-1.5 transition-colors">
              <span className="text-xs font-medium leading-[15.6px] tracking-[-0.24px]">See Full List</span>
              <ArrowUpRight size={16} />
            </button>
            <button className="bg-[#FF3856] hover:bg-[#FF3856]/90 text-white px-3 py-2 rounded-full flex items-center gap-1.5 transition-colors">
              <span className="text-xs font-medium leading-[15.6px] tracking-[-0.24px]">Create a New Project</span>
              <Plus size={16} />
            </button>
          </div>
        </div>

        {/* Client filters */}
        <ClientFilter selectedClient={selectedClient} onSelectClient={setSelectedClient} />

        {/* Projects grid */}
        <div className="grid grid-cols-4 gap-5">
          {mockProjects.map((project) => (
            <ProjectCard
              key={project.id}
              name={project.name}
              company={project.company}
              logo={project.logo}
            />
          ))}
        </div>
      </div>
    </div>
  )
}

