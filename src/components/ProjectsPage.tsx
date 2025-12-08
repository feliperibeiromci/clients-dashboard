import React, { useState, useRef, useEffect } from 'react'
import { ArrowUpRight, Plus } from 'lucide-react'
import { useAuth } from '../contexts/AuthContext'
import { SiteSpeedMetric } from './projects/SiteSpeedMetric'
import { OverallTrafficMetric } from './projects/OverallTrafficMetric'
import { EmailOpenRateMetric } from './projects/EmailOpenRateMetric'
import { DailyConversionsMetric } from './projects/DailyConversionsMetric'
import { ProjectCard } from './projects/ProjectCard'
import { ClientFilter } from './projects/ClientFilter'
import { CreateClientModal } from './clients/CreateClientModal'

// Mock Data with Metrics
const mockProjectsWithMetrics = [
  { 
    id: 1, 
    name: 'Clio Marketing', 
    company: 'Renault', 
    logo: 'renault', 
    metrics: {
      siteSpeed: { value: 95, status: 'Healthy' },
      traffic: { value: 95, trend: 'up' as const },
      email: { percentage: 66, opened: 3855, total: 5841 },
      conversions: { data: [] } // Use default mock or specific if needed
    }
  },
  { 
    id: 2, 
    name: 'Tundra 2026', 
    company: 'Toyota', 
    logo: 'toyota', 
    metrics: {
      siteSpeed: { value: 88, status: 'Healthy' },
      traffic: { value: 92, trend: 'up' as const },
      email: { percentage: 72, opened: 4200, total: 5800 },
      conversions: { data: [] }
    }
  },
  { 
    id: 3, 
    name: 'New Civic', 
    company: 'Honda', 
    logo: 'honda', 
    metrics: {
      siteSpeed: { value: 91, status: 'Healthy' },
      traffic: { value: 89, trend: 'down' as const },
      email: { percentage: 55, opened: 3100, total: 5600 },
      conversions: { data: [] }
    }
  },
  { 
    id: 4, 
    name: 'New Veloster Launch', 
    company: 'Hyundai', 
    logo: 'hyundai', 
    metrics: {
      siteSpeed: { value: 85, status: 'Warning' },
      traffic: { value: 78, trend: 'down' as const },
      email: { percentage: 45, opened: 2500, total: 5500 },
      conversions: { data: [] }
    }
  },
  { 
    id: 5, 
    name: 'Model S Campaign', 
    company: 'Tesla', 
    logo: 'tesla', 
    metrics: {
      siteSpeed: { value: 98, status: 'Healthy' },
      traffic: { value: 99, trend: 'up' as const },
      email: { percentage: 80, opened: 8000, total: 10000 },
      conversions: { data: [] }
    }
  },
  { 
    id: 6, 
    name: 'Mustang 2025', 
    company: 'Ford', 
    logo: 'ford', 
    metrics: {
      siteSpeed: { value: 92, status: 'Healthy' },
      traffic: { value: 85, trend: 'up' as const },
      email: { percentage: 60, opened: 3600, total: 6000 },
      conversions: { data: [] }
    }
  },
  { 
    id: 7, 
    name: '208 Launch', 
    company: 'Peugeot', 
    logo: 'peugeot', 
    metrics: {
      siteSpeed: { value: 89, status: 'Healthy' },
      traffic: { value: 82, trend: 'up' as const },
      email: { percentage: 58, opened: 3480, total: 6000 },
      conversions: { data: [] }
    }
  },
  // Repeat some for filling the grid if needed, but unique IDs are better.
  // Let's stick to unique ones or duplicates with different IDs
  { 
    id: 8, 
    name: 'Clio Marketing', 
    company: 'Renault', 
    logo: 'renault', 
    metrics: {
      siteSpeed: { value: 95, status: 'Healthy' },
      traffic: { value: 95, trend: 'up' as const },
      email: { percentage: 66, opened: 3855, total: 5841 },
      conversions: { data: [] }
    }
  },
]

export const ProjectsPage: React.FC = () => {
  const { isAdmin } = useAuth()
  const [selectedClient, setSelectedClient] = useState<string>('all')
  const [isCreateClientModalOpen, setIsCreateClientModalOpen] = useState(false)
  const [activeProjectId, setActiveProjectId] = useState<number>(mockProjectsWithMetrics[0].id)
  const [currentCardIndex, setCurrentCardIndex] = useState(0)
  const scrollContainerRef = useRef<HTMLDivElement>(null)
  
  // Handle scroll to update current card index
  useEffect(() => {
    const container = scrollContainerRef.current
    if (!container) return

    const handleScroll = () => {
      const scrollLeft = container.scrollLeft
      const cardWidth = container.clientWidth
      const newIndex = Math.round(scrollLeft / cardWidth)
      setCurrentCardIndex(newIndex)
    }

    container.addEventListener('scroll', handleScroll)
    return () => container.removeEventListener('scroll', handleScroll)
  }, [])
  
  // Scroll to specific card
  const scrollToCard = (index: number) => {
    const container = scrollContainerRef.current
    if (container) {
      const cardWidth = container.clientWidth
      container.scrollTo({ left: index * cardWidth, behavior: 'smooth' })
    }
  }

  // Filter projects based on role
  const filteredProjects = mockProjectsWithMetrics.filter(project => {
    if (isAdmin) {
      return selectedClient === 'all' || project.company.toLowerCase() === selectedClient
    }
    // For demo purposes, clients only see Renault projects
    // In production, this would filter by profile.client_id
    return project.company === 'Renault'
  })

  // Get active project data
  const activeProject = mockProjectsWithMetrics.find(p => p.id === activeProjectId) || mockProjectsWithMetrics[0]

  return (
    <div className="flex flex-col gap-5 w-full">
      {/* Top row - 4 metric cards - Dynamic based on activeProject */}
      {isAdmin && activeProject && (
        <div className="grid grid-cols-4 gap-5">
          <SiteSpeedMetric 
            projectName={activeProject.name}
            companyName={activeProject.company}
            logo={activeProject.logo}
            value={activeProject.metrics.siteSpeed.value}
            status={activeProject.metrics.siteSpeed.status}
          />
          <OverallTrafficMetric 
            projectName={activeProject.name}
            companyName={activeProject.company}
            logo={activeProject.logo}
            value={activeProject.metrics.traffic.value}
            trend={activeProject.metrics.traffic.trend}
          />
          <EmailOpenRateMetric 
            projectName={activeProject.name}
            companyName={activeProject.company}
            logo={activeProject.logo}
            percentage={activeProject.metrics.email.percentage}
            opened={activeProject.metrics.email.opened}
            total={activeProject.metrics.email.total}
          />
          <DailyConversionsMetric 
            projectName={activeProject.name}
            companyName={activeProject.company}
            logo={activeProject.logo}
          />
        </div>
      )}

      {/* For client, show Site Speed, Overall Traffic, Email Open Rate and Daily Conversions */}
      {!isAdmin && activeProject && (
        <>
          {/* Desktop: Grid layout */}
          <div className="hidden md:flex gap-5 w-full">
            <div className="flex-1 min-w-0">
              <SiteSpeedMetric 
                projectName={activeProject.name}
                companyName={activeProject.company}
                logo={activeProject.logo}
                value={activeProject.metrics.siteSpeed.value}
                status={activeProject.metrics.siteSpeed.status}
              />
            </div>
            <div className="flex-1 min-w-0">
              <OverallTrafficMetric 
                projectName={activeProject.name}
                companyName={activeProject.company}
                logo={activeProject.logo}
                value={activeProject.metrics.traffic.value}
                trend={activeProject.metrics.traffic.trend}
              />
            </div>
            <div className="flex-1 min-w-0">
              <EmailOpenRateMetric 
                projectName={activeProject.name}
                companyName={activeProject.company}
                logo={activeProject.logo}
                percentage={activeProject.metrics.email.percentage}
                opened={activeProject.metrics.email.opened}
                total={activeProject.metrics.email.total}
              />
            </div>
            <div className="flex-1 min-w-0">
              <DailyConversionsMetric 
                projectName={activeProject.name}
                companyName={activeProject.company}
                logo={activeProject.logo}
              />
            </div>
          </div>

          {/* Mobile: Carousel with scroll */}
          <div className="md:hidden flex flex-col gap-5">
            <div 
              ref={scrollContainerRef}
              className="flex gap-5 overflow-x-auto snap-x snap-mandatory scrollbar-hide"
              style={{ scrollSnapType: 'x mandatory' }}
            >
              <div className="min-w-full snap-start flex-shrink-0">
                <SiteSpeedMetric 
                  projectName={activeProject.name}
                  companyName={activeProject.company}
                  logo={activeProject.logo}
                  value={activeProject.metrics.siteSpeed.value}
                  status={activeProject.metrics.siteSpeed.status}
                />
              </div>
              <div className="min-w-full snap-start flex-shrink-0">
                <OverallTrafficMetric 
                  projectName={activeProject.name}
                  companyName={activeProject.company}
                  logo={activeProject.logo}
                  value={activeProject.metrics.traffic.value}
                  trend={activeProject.metrics.traffic.trend}
                />
              </div>
              <div className="min-w-full snap-start flex-shrink-0">
                <EmailOpenRateMetric 
                  projectName={activeProject.name}
                  companyName={activeProject.company}
                  logo={activeProject.logo}
                  percentage={activeProject.metrics.email.percentage}
                  opened={activeProject.metrics.email.opened}
                  total={activeProject.metrics.email.total}
                />
              </div>
              <div className="min-w-full snap-start flex-shrink-0">
                <DailyConversionsMetric 
                  projectName={activeProject.name}
                  companyName={activeProject.company}
                  logo={activeProject.logo}
                />
              </div>
            </div>
            
            {/* Dots indicator */}
            <div className="flex items-center justify-center gap-4">
              {[0, 1, 2, 3].map((index) => (
                <button
                  key={index}
                  onClick={() => scrollToCard(index)}
                  className={`transition-all duration-300 rounded-full ${
                    currentCardIndex === index
                      ? 'w-[10px] h-[10px] bg-white'
                      : 'w-[10px] h-[10px] bg-[#45484D]'
                  }`}
                  aria-label={`Go to card ${index + 1}`}
                />
              ))}
            </div>
          </div>
        </>
      )}

      {/* All Your Projects section */}
      <div className="bg-[#17181A] rounded-[20px] p-3 md:p-5 flex flex-col gap-3 md:gap-5">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-center md:justify-between w-full gap-3 md:gap-0">
          <div className="flex flex-col gap-1">
            <h2 className="text-xl md:text-2xl font-semibold leading-[24px] md:leading-[28.8px] text-[#F1F2F3] tracking-[-0.4px] md:tracking-[-0.48px]">
              {isAdmin ? 'All Projects' : 'Your Projects'}
            </h2>
            {isAdmin && (
              <div className="flex items-center gap-1.5">
                <div className="w-4 h-4 md:w-5 md:h-5 relative">
                  <img src="/src/assets/images/logo.png" alt="MCI" className="w-full h-full object-contain" />
                </div>
                <span className="text-sm md:text-lg font-semibold leading-[18px] md:leading-[21.6px] text-white tracking-[-0.28px] md:tracking-[-0.36px]">
                  MCI Group
                </span>
              </div>
            )}
          </div>
          
          <div className="flex items-center gap-2 flex-wrap">
            <button className="bg-[#414141] hover:bg-[#414141]/80 text-white px-2.5 md:px-3 py-1.5 md:py-2 rounded-full flex items-center gap-1.5 transition-colors text-[10px] md:text-xs font-medium leading-[13px] md:leading-[15.6px] tracking-[-0.2px] md:tracking-[-0.24px]">
              <span>See Full List</span>
              <ArrowUpRight size={14} className="md:w-4 md:h-4" />
            </button>
            {isAdmin && (
              <button 
                onClick={() => setIsCreateClientModalOpen(true)}
                className="bg-[#FF3856] hover:bg-[#FF3856]/90 text-white px-2.5 md:px-3 py-1.5 md:py-2 rounded-full flex items-center gap-1.5 transition-colors text-[10px] md:text-xs font-medium leading-[13px] md:leading-[15.6px] tracking-[-0.2px] md:tracking-[-0.24px]"
              >
                <span>Create a New Project</span>
                <Plus size={14} className="md:w-4 md:h-4" />
              </button>
            )}
          </div>
        </div>

        {/* Client filters - Only for Admin */}
        {isAdmin && (
          <ClientFilter selectedClient={selectedClient} onSelectClient={setSelectedClient} />
        )}

        {/* Projects grid - Responsive */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-3 md:gap-5">
          {filteredProjects.map((project) => (
            <ProjectCard
              key={project.id}
              name={project.name}
              company={project.company}
              logo={project.logo}
              onClick={() => setActiveProjectId(project.id)}
              isSelected={activeProjectId === project.id}
            />
          ))}
          {filteredProjects.length === 0 && (
            <div className="col-span-1 sm:col-span-2 lg:col-span-3 xl:col-span-4 text-center py-10 text-gray-500">
              No projects found.
            </div>
          )}
        </div>
      </div>

      <CreateClientModal 
        isOpen={isCreateClientModalOpen}
        onClose={() => setIsCreateClientModalOpen(false)}
        onSuccess={() => {
          // Aqui poderíamos recarregar a lista de clientes se estivesse sendo usada aqui
          // Como o filtro é estático por enquanto, não precisamos fazer nada
          setIsCreateClientModalOpen(false)
        }}
      />
    </div>
  )
}
