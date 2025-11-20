import React from 'react'
import { Plus } from 'lucide-react'

export const ClientsPage: React.FC = () => {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold text-white">Your Clients</h2>
        <button className="flex items-center space-x-2 bg-[#FF3B5C] hover:bg-[#FF3B5C]/90 text-white px-4 py-2 rounded-lg text-sm font-medium transition-colors">
          <span>Add New Client</span>
          <Plus size={16} />
        </button>
      </div>

      <div className="bg-[#17181A] rounded-xl overflow-hidden border border-gray-800/20">
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead>
              <tr className="border-b border-gray-800/50">
                <th className="py-4 px-6 text-sm font-medium text-white">[Client Name]</th>
                <th className="py-4 px-6 text-sm font-medium text-white">[Client Email + Phone]</th>
                <th className="py-4 px-6 text-sm font-medium text-white">Company Name</th>
                <th className="py-4 px-6 text-sm font-medium text-white">Address</th>
                <th className="py-4 px-6 text-sm font-medium text-white">List of Projects Assigned</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-800/20">
              {/* Placeholders for now */}
              {[1, 2, 3].map((_, index) => (
                <tr key={index} className="hover:bg-white/5 transition-colors">
                  <td className="py-4 px-6 text-sm text-gray-400">Client Name Placeholder</td>
                  <td className="py-4 px-6 text-sm text-gray-400">
                    <div className="flex flex-col">
                      <span>email@example.com</span>
                      <span className="text-xs text-gray-500">+1 234 567 890</span>
                    </div>
                  </td>
                  <td className="py-4 px-6 text-sm text-gray-400">Company Ltd.</td>
                  <td className="py-4 px-6 text-sm text-gray-400">123 Street, City</td>
                  <td className="py-4 px-6 text-sm text-gray-400">Project A, Project B</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        
        {/* Empty state message if needed, or just keeping the table structure as requested */}
        <div className="p-8 text-center text-gray-500 text-sm border-t border-gray-800/20">
          Ready to receive clients...
        </div>
      </div>
    </div>
  )
}

