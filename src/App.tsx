import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom'
import { AuthProvider } from './contexts/AuthContext'
import { useAuth } from './contexts/AuthContext'
import { Login } from './pages/Login'
import { ForgotPassword } from './pages/ForgotPassword'
import { ResetPassword } from './pages/ResetPassword'
import { SignUp } from './pages/SignUp'
import { TestInvite } from './pages/TestInvite'
import { VerifyCode } from './pages/VerifyCode'
import { Welcome } from './pages/Welcome'
import { Sidebar } from './components/Sidebar'
import { DashboardHeader } from './components/DashboardHeader'
import { MobileHeader } from './components/MobileHeader'
import { WelcomeSection } from './components/WelcomeSection'
import { SessionsChart } from './components/SessionsChart'
import { OtherProjects } from './components/OtherProjects'
import { SEOTermsTable } from './components/SEOTermsTable'
import { ClientsPage } from './components/ClientsPage'
import { UsersPage } from './components/UsersPage'
import { ProjectsPage } from './components/ProjectsPage'
import { ReportsPage } from './components/ReportsPage'
import { Settings } from './pages/Settings'

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
      {/* Desktop Sidebar */}
      <div className="hidden md:block">
        <Sidebar />
      </div>
      
      <main className="flex-1 md:ml-[320px] overflow-y-auto h-screen">
        <div className="p-0">
          {/* Mobile Header */}
          <div className="md:hidden">
            <MobileHeader />
          </div>
          
          {/* Desktop Header */}
          <div className="hidden md:block px-5 py-[15px]">
            <DashboardHeader userName={user.email?.split('@')[0] || 'User'} />
          </div>
          
          {/* Welcome Section - Mobile Only */}
          <div className="md:hidden px-5 pt-5 pb-0">
            <WelcomeSection variant="mobile" />
          </div>
          
          {/* Divider - Only show on mobile after Welcome, on desktop show after header */}
          <div className="h-px bg-[#2F3133] mx-5 mt-5 mb-0 md:mt-0 md:my-5"></div>
          
          <div className="px-5 pt-0 pb-2">
            {children}
          </div>
        </div>
      </main>
    </div>
  )
}

const HomePage = () => (
  <div className="flex flex-col md:flex-row gap-5">
    {/* Coluna Esquerda (Gráfico e Tabela) */}
    <div className="flex-1 flex flex-col gap-5">
      <SessionsChart />
      <SEOTermsTable />
    </div>
    
    {/* Coluna Direita (Projetos) */}
    <div className="w-full md:w-[400px] flex-shrink-0">
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
          <Route path="/signup" element={<SignUp />} />
          <Route path="/test-invite" element={<TestInvite />} />
          <Route path="/verify-code" element={<VerifyCode />} />
          <Route path="/welcome" element={<Welcome />} />
          <Route path="/forgot-password" element={<ForgotPassword />} />
          <Route path="/reset-password" element={<ResetPassword />} />
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
          <Route
            path="/users"
            element={
              <ProtectedLayout>
                <UsersPage />
              </ProtectedLayout>
            }
          />
          <Route
            path="/reports"
            element={
              <ProtectedLayout>
                <ReportsPage />
              </ProtectedLayout>
            }
          />
           <Route
            path="/settings"
            element={
              <ProtectedLayout>
                <Settings />
              </ProtectedLayout>
            }
          />
        </Routes>
      </AuthProvider>
    </Router>
  )
}

export default App
