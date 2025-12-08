import React from 'react'
import { Plus } from 'lucide-react'

export const ReportsPage: React.FC = () => {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-end">
        <button 
          className="flex items-center gap-2 bg-[#FF3856] hover:bg-[#FF3856]/90 text-white px-6 py-2.5 rounded-full text-base font-medium transition-colors"
        >
          <span>Create New Report</span>
          <Plus size={18} strokeWidth={1.5} />
        </button>
      </div>
      
      <div className="text-[#ABAEB3] text-center py-20">
        {/* Content placeholder */}
      </div>
    </div>
  )
}

