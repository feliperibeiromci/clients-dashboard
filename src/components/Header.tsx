import React from 'react'

interface HeaderProps {
  title?: string
}

export const Header: React.FC<HeaderProps> = ({ title = 'Dashboard de Clientes' }) => {
  return (
    <header className="bg-white shadow-sm border-b border-gray-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          <h1 className="text-2xl font-bold text-gray-900">{title}</h1>
          <nav className="flex items-center space-x-4">
            {/* Navigation items will be added here */}
          </nav>
        </div>
      </div>
    </header>
  )
}

