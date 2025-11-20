import React from 'react'

export const Logo: React.FC = () => {
  return (
    <div className="flex items-center justify-center h-16 mb-8">
      <div className="relative w-12 h-12">
       <img src="/src/assets/images/logo.png" alt="Logo" className="w-full h-full" />
      </div>
    </div>
  )
}

