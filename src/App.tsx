import { useState } from 'react'
import { Sidebar } from './components/Sidebar'
import { DashboardHeader } from './components/DashboardHeader'
import { SessionsChart } from './components/SessionsChart'
import { OtherProjects } from './components/OtherProjects'
import { SEOTermsTable } from './components/SEOTermsTable'
import { ClientsPage } from './components/ClientsPage'
import { ProjectsPage } from './components/ProjectsPage'

function App() {
  const [currentView, setCurrentView] = useState('home')

  const renderContent = () => {
    switch (currentView) {
      case 'projects':
        return <ProjectsPage />
      case 'clients':
        return <ClientsPage />
      case 'home':
      default:
        return (
          <div className="flex gap-5">
            {/* Coluna Esquerda (Gráfico e Tabela) */}
            <div className="flex-1 flex flex-col gap-5">
              <SessionsChart />
              <SEOTermsTable />
            </div>
            
            {/* Coluna Direita (Projetos) */}
            <div className="w-[400px] flex-shrink-0">
              <OtherProjects />
            </div>
          </div>
        )
    }
  }

  return (
    <div className="flex min-h-screen bg-[#0b0c0d] text-white font-sans">
      <Sidebar activeItem={currentView} onNavigate={setCurrentView} />
      
      <main className="flex-1 ml-[320px] overflow-y-auto h-screen">
        <div className="p-2">
          <div className="px-5 py-1.5">
            <DashboardHeader userName="Michele" />
          </div>
          
          <div className="h-px bg-[#2F3133] mx-5 my-5"></div>
          
          <div className="px-2 py-2">
            {renderContent()}
          </div>
        </div>
      </main>
    </div>
  )
}

export default App
