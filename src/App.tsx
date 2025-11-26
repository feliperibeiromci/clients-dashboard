import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom'
import { AuthProvider } from './contexts/AuthContext'
import { useAuth } from './contexts/AuthContext'
import { Login } from './pages/Login'
import { Sidebar } from './components/Sidebar'
import { DashboardHeader } from './components/DashboardHeader'
import { SessionsChart } from './components/SessionsChart'
import { OtherProjects } from './components/OtherProjects'
import { SEOTermsTable } from './components/SEOTermsTable'
import { ClientsPage } from './components/ClientsPage'
import { ProjectsPage } from './components/ProjectsPage'

const ProtectedLayout = ({ children }: { children: React.ReactNode }) => {
  const { user, loading } = useAuth()

  if (loading) {
        return (
      <div className="min-h-screen bg-[#0b0c0d] flex items-center justify-center text-white">
        <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-[#FF3856]"></div>
          </div>
        )
    }

  if (!user) {
    return <Navigate to="/login" />
  }

  return (
    <div className="flex min-h-screen bg-[#0b0c0d] text-white font-sans">
      <Sidebar />
      
      <main className="flex-1 ml-[320px] overflow-y-auto h-screen">
        <div className="p-2">
          <div className="px-5 py-1.5">
            <DashboardHeader userName={user.email?.split('@')[0] || 'User'} />
          </div>
          
          <div className="h-px bg-[#2F3133] mx-5 my-5"></div>
          
          <div className="px-2 py-2">
            {children}
          </div>
        </div>
      </main>
    </div>
  )
}

const HomePage = () => (
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

function App() {
  return (
    <Router>
      <AuthProvider>
        <Routes>
          <Route path="/login" element={<Login />} />
          <Route
            path="/"
            element={
              <ProtectedLayout>
                <HomePage />
              </ProtectedLayout>
            }
          />
          <Route
            path="/projects"
            element={
              <ProtectedLayout>
                <ProjectsPage />
              </ProtectedLayout>
            }
          />
          <Route
            path="/clients"
            element={
              <ProtectedLayout>
                <ClientsPage />
              </ProtectedLayout>
            }
          />
          {/* Placeholder routes for now */}
          <Route
            path="/reports"
            element={
              <ProtectedLayout>
                <div className="text-center py-10 text-gray-500">Reports Page (Coming Soon)</div>
              </ProtectedLayout>
            }
          />
          <Route
            path="/users"
            element={
              <ProtectedLayout>
                <div className="text-center py-10 text-gray-500">Users Page (Coming Soon)</div>
              </ProtectedLayout>
            }
          />
           <Route
            path="/settings"
            element={
              <ProtectedLayout>
                <div className="text-center py-10 text-gray-500">Settings Page (Coming Soon)</div>
              </ProtectedLayout>
            }
          />
        </Routes>
      </AuthProvider>
    </Router>
  )
}

export default App
