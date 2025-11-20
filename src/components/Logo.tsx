import React from 'react'

export const Logo: React.FC = () => {
  return (
    <div className="flex items-center justify-start mb-5">
      <div className="relative w-16 h-16">
       <img src="/src/assets/images/logo.png" alt="MCI Logo" className="w-full h-full object-contain" />
      </div>
    </div>
  )
}

