import { useState } from 'react'
import { Sidebar } from './components/Sidebar'
import { DashboardHeader } from './components/DashboardHeader'
import { SessionsChart } from './components/SessionsChart'
import { OtherProjects } from './components/OtherProjects'
import { SEOTermsTable } from './components/SEOTermsTable'
import { ClientsPage } from './components/ClientsPage'

function App() {
  const [currentView, setCurrentView] = useState('home')

  const renderContent = () => {
    switch (currentView) {
      case 'clients':
        return <ClientsPage />
      case 'home':
      default:
        return (
          <div className="grid grid-cols-12 gap-6">
            {/* Coluna Esquerda (Gráfico e Tabela) */}
            <div className="col-span-12 lg:col-span-8 space-y-6">
              <SessionsChart />
              <SEOTermsTable />
            </div>
            
            {/* Coluna Direita (Projetos) */}
            <div className="col-span-12 lg:col-span-4">
              <OtherProjects />
            </div>
          </div>
        )
    }
  }

  return (
    <div className="flex min-h-screen bg-[#0b0c0d] text-white font-sans">
      <Sidebar activeItem={currentView} onNavigate={setCurrentView} />
      
      <main className="flex-1 ml-64 p-8 overflow-y-auto h-screen">
        <div className="max-w-[1600px] mx-auto">
          <DashboardHeader userName="Michele" />
          
          <div className="mt-6">
            {renderContent()}
          </div>
        </div>
      </main>
    </div>
  )
}

export default App
