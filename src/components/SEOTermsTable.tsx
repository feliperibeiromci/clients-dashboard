import React from 'react'
import { ArrowUpRight, Diamond } from 'lucide-react'

const terms = [
  { rank: '#1', term: 'Renault', last7: 120, last30: 1245, custom1: 'Lorem Ipsum', custom2: 'Lorem Ipsum' },
  { rank: '#2', term: 'Renault Car', last7: 80, last30: 912, custom1: 'Lorem Ipsum', custom2: 'Lorem Ipsum' },
  { rank: '#3', term: 'Electric Car', last7: 76, last30: 1442, custom1: 'Lorem Ipsum', custom2: 'Lorem Ipsum' },
  { rank: '#4', term: 'City Car', last7: 66, last30: 872, custom1: 'Lorem Ipsum', custom2: 'Lorem Ipsum' },
  { rank: '#5', term: 'City Hatch', last7: 56, last30: 774, custom1: 'Lorem Ipsum', custom2: 'Lorem Ipsum' },
]

export const SEOTermsTable: React.FC = () => {
  return (
    <div className="bg-[#17181A] p-5 rounded-[20px] border border-gray-800/50 h-full">
      <div className="flex justify-between items-start mb-5">
        <div>
          <h2 className="text-2xl font-semibold leading-[28.8px] text-white mb-1 tracking-[-0.48px]">Most Searched SEO Terms</h2>
          <div className="flex items-center gap-1.5 text-[#ABAEB3]">
            <div className="w-5 h-5">
              <Diamond size={20} className="text-gray-500" />
            </div>
            <span className="font-semibold text-lg leading-[21.6px]">New Clio Car Launch | Renault</span>
          </div>
        </div>
        <button className="flex items-center gap-1.5 text-xs font-medium text-white bg-[#414141] px-3 py-2 rounded-full hover:opacity-80 transition-opacity">
          <span>See All Data</span>
          <ArrowUpRight size={16} />
        </button>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full text-left text-sm">
          <thead>
            <tr className="text-[#C7C9CD] border-b border-gray-800/50">
              <th className="pb-4 pl-4 font-semibold text-base">Rank #</th>
              <th className="pb-4 font-semibold text-base text-center">Term</th>
              <th className="pb-4 text-center font-semibold text-base">Last 7 Days</th>
              <th className="pb-4 text-center font-semibold text-base">Last 30 Days</th>
              <th className="pb-4 text-center font-semibold text-base">Lorem Ipsum</th>
              <th className="pb-4 text-center font-semibold text-base">Lorem Ipsum</th>
            </tr>
          </thead>
          <tbody className="text-[#C7C9CD]">
            {terms.map((item, index) => (
              <tr key={index} className="group hover:bg-white/5 transition-colors">
                <td className="py-3 pl-4 text-sm text-center">{item.rank}</td>
                <td className="py-3 text-sm text-center">{item.term}</td>
                <td className="py-3 text-center text-sm">{item.last7}</td>
                <td className="py-3 text-center text-sm">{item.last30}</td>
                <td className="py-3 text-center text-sm">{item.custom1}</td>
                <td className="py-3 text-center text-sm">{item.custom2}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}
