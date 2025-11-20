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
    <div className="bg-[#17181A] p-6 rounded-3xl border border-gray-800/50 h-full">
      <div className="flex justify-between items-start mb-8">
        <div>
          <h2 className="text-xl font-bold text-white mb-1">Most Searched SEO Terms</h2>
          <div className="flex items-center text-gray-400 text-sm">
            <Diamond size={14} className="mr-2 text-gray-500" />
            <span>New Clio Car Launch | Renault</span>
          </div>
        </div>
        <button className="flex items-center space-x-1 text-xs font-medium text-gray-400 bg-[#1F1F1F] px-3 py-1.5 rounded-full hover:text-white transition-colors border border-gray-700/50">
          <span>See All Data</span>
          <ArrowUpRight size={14} />
        </button>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full text-left text-sm">
          <thead>
            <tr className="text-gray-500 border-b border-gray-800/50">
              <th className="pb-4 pl-4 font-medium">Rank #</th>
              <th className="pb-4 font-medium">Term</th>
              <th className="pb-4 text-center font-medium">Last 7 Days</th>
              <th className="pb-4 text-center font-medium">Last 30 Days</th>
              <th className="pb-4 text-center font-medium">Lorem Ipsum</th>
              <th className="pb-4 text-center font-medium">Lorem Ipsum</th>
            </tr>
          </thead>
          <tbody className="text-gray-300">
            {terms.map((item, index) => (
              <tr key={index} className="group hover:bg-white/5 transition-colors">
                <td className="py-4 pl-4 text-gray-500">{item.rank}</td>
                <td className="py-4 font-medium">{item.term}</td>
                <td className="py-4 text-center">{item.last7}</td>
                <td className="py-4 text-center">{item.last30}</td>
                <td className="py-4 text-center text-gray-500">{item.custom1}</td>
                <td className="py-4 text-center text-gray-500">{item.custom2}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}
