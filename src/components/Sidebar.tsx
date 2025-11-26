import React from 'react'
import { Link, useLocation } from 'react-router-dom'
import { useAuth } from '../contexts/AuthContext'
import { Logo } from './Logo'

interface NavItem {
  label: string
  icon: React.ReactNode
  id: string
  path: string
}

// removed unused SidebarProps since we use router now
interface SidebarProps {}

const HomeIcon: React.FC<{ className?: string }> = ({ className }) => (
  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" className={className}>
    <g clipPath="url(#clip0_98_1364)">
      <path d="M21 20C21 20.2652 20.8946 20.5196 20.7071 20.7071C20.5196 20.8946 20.2652 21 20 21H4C3.73478 21 3.48043 20.8946 3.29289 20.7071C3.10536 20.5196 3 20.2652 3 20V9.49C2.99989 9.33761 3.03462 9.18721 3.10152 9.0503C3.16841 8.91338 3.26572 8.79356 3.386 8.7L11.386 2.478C11.5615 2.34144 11.7776 2.2673 12 2.2673C12.2224 2.2673 12.4385 2.34144 12.614 2.478L20.614 8.7C20.7343 8.79356 20.8316 8.91338 20.8985 9.0503C20.9654 9.18721 21.0001 9.33761 21 9.49V20ZM19 19V9.978L12 4.534L5 9.978V19H19ZM7 15H17V17H7V15Z" fill="currentColor"/>
    </g>
    <defs>
      <clipPath id="clip0_98_1364">
        <rect width="24" height="24" fill="white"/>
      </clipPath>
    </defs>
  </svg>
)

const ProjectsIcon: React.FC<{ className?: string }> = ({ className }) => (
  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" className={className}>
    <path d="M2 10H22M20 20C20.5304 20 21.0391 19.7893 21.4142 19.4142C21.7893 19.0391 22 18.5304 22 18V8C22 7.46957 21.7893 6.96086 21.4142 6.58579C21.0391 6.21071 20.5304 6 20 6H12.1C11.7655 6.00328 11.4355 5.92261 11.1403 5.76538C10.8451 5.60815 10.594 5.37938 10.41 5.1L9.6 3.9C9.41789 3.62347 9.16997 3.39648 8.8785 3.2394C8.58702 3.08231 8.26111 3.00005 7.93 3H4C3.46957 3 2.96086 3.21071 2.58579 3.58579C2.21071 3.96086 2 4.46957 2 5V18C2 18.5304 2.21071 19.0391 2.58579 19.4142C2.96086 19.7893 3.46957 20 4 20H20Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
  </svg>
)

const ClientsIcon: React.FC<{ className?: string }> = ({ className }) => (
  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" className={className}>
    <g clipPath="url(#clip0_98_1374)">
      <path d="M20 22H18V20C18 19.2044 17.6839 18.4413 17.1213 17.8787C16.5587 17.3161 15.7956 17 15 17H9C8.20435 17 7.44129 17.3161 6.87868 17.8787C6.31607 18.4413 6 19.2044 6 20V22H4V20C4 18.6739 4.52678 17.4021 5.46447 16.4645C6.40215 15.5268 7.67392 15 9 15H15C16.3261 15 17.5979 15.5268 18.5355 16.4645C19.4732 17.4021 20 18.6739 20 20V22ZM12 13C11.2121 13 10.4319 12.8448 9.7039 12.5433C8.97595 12.2417 8.31451 11.7998 7.75736 11.2426C7.20021 10.6855 6.75825 10.0241 6.45672 9.2961C6.15519 8.56815 6 7.78793 6 7C6 6.21207 6.15519 5.43185 6.45672 4.7039C6.75825 3.97595 7.20021 3.31451 7.75736 2.75736C8.31451 2.20021 8.97595 1.75825 9.7039 1.45672C10.4319 1.15519 11.2121 1 12 1C13.5913 1 15.1174 1.63214 16.2426 2.75736C17.3679 3.88258 18 5.4087 18 7C18 8.5913 17.3679 10.1174 16.2426 11.2426C15.1174 12.3679 13.5913 13 12 13ZM12 11C13.0609 11 14.0783 10.5786 14.8284 9.82843C15.5786 9.07828 16 8.06087 16 7C16 5.93913 15.5786 4.92172 14.8284 4.17157C14.0783 3.42143 13.0609 3 12 3C10.9391 3 9.92172 3.42143 9.17157 4.17157C8.42143 4.92172 8 5.93913 8 7C8 8.06087 8.42143 9.07828 9.17157 9.82843C9.92172 10.5786 10.9391 11 12 11Z" fill="currentColor"/>
    </g>
    <defs>
      <clipPath id="clip0_98_1374">
        <rect width="24" height="24" fill="white"/>
      </clipPath>
    </defs>
  </svg>
)

const ReportsIcon: React.FC<{ className?: string }> = ({ className }) => (
  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" className={className}>
    <g clipPath="url(#clip0_98_1383)">
      <path d="M21 8V20.993C21.0009 21.1243 20.976 21.2545 20.9266 21.3762C20.8772 21.4979 20.8043 21.6087 20.7121 21.7022C20.6199 21.7957 20.5101 21.8701 20.3892 21.9212C20.2682 21.9723 20.1383 21.9991 20.007 22H3.993C3.72981 22 3.47739 21.8955 3.2912 21.7095C3.105 21.5235 3.00027 21.2712 3 21.008V2.992C3 2.455 3.449 2 4.002 2H14.997L21 8ZM19 9H14V4H5V20H19V9ZM8 7H11V9H8V7ZM8 11H16V13H8V11ZM8 15H16V17H8V15Z" fill="currentColor"/>
    </g>
    <defs>
      <clipPath id="clip0_98_1383">
        <rect width="24" height="24" fill="white"/>
      </clipPath>
    </defs>
  </svg>
)

const UsersIcon: React.FC<{ className?: string }> = ({ className }) => (
  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" className={className}>
    <path d="M7 20.662V19C7 18.4696 7.21071 17.9609 7.58579 17.5858C7.96086 17.2107 8.46957 17 9 17H15C15.5304 17 16.0391 17.2107 16.4142 17.5858C16.7893 17.9609 17 18.4696 17 19V20.662M22 12C22 17.5228 17.5228 22 12 22C6.47715 22 2 17.5228 2 12C2 6.47715 6.47715 2 12 2C17.5228 2 22 6.47715 22 12ZM15 10C15 11.6569 13.6569 13 12 13C10.3431 13 9 11.6569 9 10C9 8.34315 10.3431 7 12 7C13.6569 7 15 8.34315 15 10Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
  </svg>
)

const SettingsIcon: React.FC<{ className?: string }> = ({ className }) => (
  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" className={className}>
    <path d="M2.21301 14.06C1.92542 12.7017 1.92542 11.2983 2.21301 9.94C3.32301 10.07 4.29301 9.703 4.60901 8.939C4.92601 8.174 4.50101 7.229 3.62301 6.536C4.38005 5.37232 5.37233 4.38004 6.53601 3.623C7.22801 4.5 8.17401 4.926 8.93901 4.609C9.70401 4.292 10.071 3.323 9.94001 2.213C11.2983 1.92541 12.7017 1.92541 14.06 2.213C13.93 3.323 14.297 4.293 15.061 4.609C15.826 4.926 16.771 4.501 17.464 3.623C18.6277 4.38004 19.62 5.37232 20.377 6.536C19.5 7.228 19.074 8.174 19.391 8.939C19.708 9.704 20.677 10.071 21.787 9.94C22.0746 11.2983 22.0746 12.7017 21.787 14.06C20.677 13.93 19.707 14.297 19.391 15.061C19.074 15.826 19.499 16.771 20.377 17.464C19.62 18.6277 18.6277 19.62 17.464 20.377C16.772 19.5 15.826 19.074 15.061 19.391C14.296 19.708 13.929 20.677 14.06 21.787C12.7017 22.0746 11.2983 22.0746 9.94001 21.787C10.07 20.677 9.70301 19.707 8.93901 19.391C8.17401 19.074 7.22901 19.499 6.53601 20.377C5.37233 19.62 4.38005 18.6277 3.62301 17.464C4.50001 16.772 4.92601 15.826 4.60901 15.061C4.29201 14.296 3.32301 13.929 2.21301 14.06ZM4.00001 12.21C5.10001 12.515 6.00701 13.212 6.45701 14.296C6.90601 15.381 6.75701 16.516 6.19501 17.508C6.29101 17.61 6.39001 17.709 6.49201 17.805C7.48501 17.243 8.61901 17.095 9.70401 17.543C10.788 17.993 11.485 18.9 11.79 20C11.93 20.004 12.07 20.004 12.21 20C12.515 18.9 13.212 17.993 14.296 17.543C15.381 17.094 16.516 17.243 17.508 17.805C17.61 17.709 17.709 17.61 17.805 17.508C17.243 16.515 17.095 15.381 17.543 14.296C17.993 13.212 18.9 12.515 20 12.21C20.004 12.07 20.004 11.93 20 11.79C18.9 11.485 17.993 10.788 17.543 9.704C17.094 8.619 17.243 7.484 17.805 6.492C17.7086 6.3904 17.6096 6.29136 17.508 6.195C16.515 6.757 15.381 6.905 14.296 6.457C13.212 6.007 12.515 5.1 12.21 4C12.07 3.99629 11.93 3.99629 11.79 4C11.485 5.1 10.788 6.007 9.70401 6.457C8.61901 6.906 7.48401 6.757 6.49201 6.195C6.39001 6.291 6.29101 6.39 6.19501 6.492C6.75701 7.485 6.90501 8.619 6.45701 9.704C6.00701 10.788 5.10001 11.485 4.00001 11.79C3.99601 11.93 3.99601 12.07 4.00001 12.21ZM12 15C11.2044 15 10.4413 14.6839 9.87869 14.1213C9.31608 13.5587 9.00001 12.7956 9.00001 12C9.00001 11.2043 9.31608 10.4413 9.87869 9.87868C10.4413 9.31607 11.2044 9 12 9C12.7957 9 13.5587 9.31607 14.1213 9.87868C14.6839 10.4413 15 11.2043 15 12C15 12.7956 14.6839 13.5587 14.1213 14.1213C13.5587 14.6839 12.7957 15 12 15ZM12 13C12.2652 13 12.5196 12.8946 12.7071 12.7071C12.8946 12.5196 13 12.2652 13 12C13 11.7348 12.8946 11.4804 12.7071 11.2929C12.5196 11.1054 12.2652 11 12 11C11.7348 11 11.4804 11.1054 11.2929 11.2929C11.1054 11.4804 11 11.7348 11 12C11 12.2652 11.1054 12.5196 11.2929 12.7071C11.4804 12.8946 11.7348 13 12 13Z" fill="currentColor"/>
  </svg>
)

export const Sidebar: React.FC<SidebarProps> = () => {
  const { signOut, user, isAdmin } = useAuth()
  const location = useLocation()
  const activeItem = location.pathname

  const primaryNavItems: NavItem[] = [
    { id: 'home', label: 'Home', icon: <HomeIcon className="w-6 h-6" />, path: '/' },
    { id: 'projects', label: 'Projects', icon: <ProjectsIcon className="w-6 h-6" />, path: '/projects' },
  ]

  if (isAdmin) {
    primaryNavItems.push({ id: 'clients', label: 'Clients', icon: <ClientsIcon className="w-6 h-6" />, path: '/clients' })
  }
  
  primaryNavItems.push({ id: 'reports', label: 'Reports', icon: <ReportsIcon className="w-6 h-6" />, path: '/reports' })

  const secondaryNavItems: NavItem[] = []
  
  if (isAdmin) {
    secondaryNavItems.push({ id: 'users', label: 'Users', icon: <UsersIcon className="w-6 h-6" />, path: '/users' })
  }
  
  secondaryNavItems.push({ id: 'settings', label: 'Settings', icon: <SettingsIcon className="w-6 h-6" />, path: '/settings' })

  const handleNavigation = (e: React.MouseEvent, id: string) => {
    e.preventDefault()
    if (onNavigate) {
      onNavigate(id)
    }
  }

  const handleSignOut = async () => {
    try {
      await signOut()
    } catch (error) {
      console.error('Error signing out:', error)
    }
  }

  const renderNavItem = (item: NavItem) => {
    // Check if current path starts with item path (for nested routes) or is exact match
    // Special case for home '/' to avoid matching everything
    const isActive = item.path === '/' 
      ? activeItem === '/' 
      : activeItem.startsWith(item.path);

    return (
      <li key={item.id}>
        <Link
          to={item.path}
          className={`
            relative flex items-center gap-2.5 px-3 py-4 rounded-lg transition-all duration-500 ease-in-out group isolate
            ${isActive
              ? 'bg-[#FF3856] text-white' 
              : 'text-[#C7C9CD] hover:text-white'}
          `}
        >
          {/* Gradient Border on Hover - for ALL items when not active */}
          {!isActive && (
            <>
              {/* Blur shadow gradient border (glow effect) */}
              <div 
                className="absolute inset-0 rounded-lg pointer-events-none opacity-0 group-hover:opacity-50 blur-sm transition-opacity duration-500 ease-in-out z-0"
                style={{
                  background: 'linear-gradient(to right, #FF9600, #FF3856, #A035DD, #1500FE, #00BBFF)',
                }}
              />
              {/* Main gradient border - only border */}
              <div 
                className="absolute inset-0 rounded-lg pointer-events-none opacity-0 group-hover:opacity-100 transition-opacity duration-500 ease-in-out z-[1]"
                style={{
                  background: 'linear-gradient(to right, #FF9600, #FF3856, #A035DD, #1500FE, #00BBFF)',
                  padding: '2px',
                  WebkitMask: 'linear-gradient(#fff 0 0) content-box, linear-gradient(#fff 0 0)',
                  WebkitMaskComposite: 'xor',
                  mask: 'linear-gradient(#fff 0 0) content-box, linear-gradient(#fff 0 0)',
                  maskComposite: 'exclude',
                }}
              />
              {/* Inner background - matches sidebar background */}
              <div className="absolute inset-[2px] rounded-lg bg-[#17181A] z-[1] pointer-events-none" />
              {/* Subtle background on hover */}
              <div className="absolute inset-[2px] rounded-lg bg-[#17181A] group-hover:bg-white/5 transition-colors duration-500 ease-in-out z-[2] pointer-events-none" />
            </>
          )}

          <span className="relative z-10">{item.icon}</span>
          <span className="relative z-10 font-medium text-xl leading-[24px] tracking-[-0.4px]">{item.label}</span>
        </Link>
      </li>
    )
  }

  return (
    <aside className="fixed left-0 top-0 h-full w-[320px] flex items-center gap-[10px] p-2 z-50">
      {/* Nav-side container - external container with no background */}
      <div className="h-full flex flex-col gap-[10px] flex-1">
        {/* Inner container with background #17181A and rounded corners */}
        <div className="bg-[#17181A] rounded-[20px] p-5 flex flex-col gap-5 h-full">
          {/* Logo section */}
          <div className="flex flex-col">
            <Logo />
            {/* Divider after logo */}
            <div className="h-px bg-[#5D6166] w-full" />
          </div>

          {/* Navigation section */}
          <nav className="flex-1 flex flex-col gap-5">
            {/* Primary Navigation Items */}
            <ul className="space-y-2">
              {primaryNavItems.map((item) => renderNavItem(item))}
            </ul>

            {/* Divider between primary and secondary nav */}
            <div className="h-px bg-[#5D6166] w-full" />

            {/* Secondary Navigation Items */}
            <ul className="space-y-2">
              {secondaryNavItems.map((item) => renderNavItem(item))}
            </ul>
          </nav>

          {/* User profile section */}
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-lg overflow-hidden border border-[#8F949A] flex items-center justify-center bg-transparent flex-shrink-0">
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M20 21V19C20 17.9391 19.5786 16.9217 18.8284 16.1716C18.0783 15.4214 17.0609 15 16 15H8C6.93913 15 5.92172 15.4214 5.17157 16.1716C4.42143 16.9217 4 17.9391 4 19V21" stroke="#ABAEB3" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                <path d="M12 11C14.2091 11 16 9.20914 16 7C16 4.79086 14.2091 3 12 3C9.79086 3 8 4.79086 8 7C8 9.20914 9.79086 11 12 11Z" stroke="#ABAEB3" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-[#F1F2F3] font-medium text-lg leading-[21.6px] tracking-[-0.36px] truncate">
                {user?.email?.split('@')[0] || 'User'}
              </p>
              <p className="text-[#ABAEB3] font-medium text-sm leading-[18.2px] tracking-[-0.28px] truncate">
                {isAdmin ? 'Admin' : 'Client'}
              </p>
            </div>
            <button 
              onClick={handleSignOut}
              className="text-[#ABAEB3] hover:text-white transition-colors flex-shrink-0 cursor-pointer"
              title="Sign out"
              onMouseEnter={(e) => {
                const icon = e.currentTarget.querySelector('i');
                if (icon) icon.style.color = '#ffffff';
              }}
              onMouseLeave={(e) => {
                const icon = e.currentTarget.querySelector('i');
                if (icon) icon.style.color = '#ABAEB3';
              }}
            >
              {/* Remix Icon: ri-logout-box-r-line */}
              <i className="ri-logout-box-r-line text-2xl leading-none" style={{ color: '#ABAEB3', fontSize: '24px' }}></i>
            </button>
          </div>
        </div>
      </div>
    </aside>
  )
}
