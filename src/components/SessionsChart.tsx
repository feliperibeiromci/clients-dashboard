import React from 'react'
import { AreaChart, Area, XAxis, YAxis, Tooltip, ResponsiveContainer } from 'recharts'
import { ArrowUpRight, Diamond } from 'lucide-react'

const data = [
  { name: 'May', sessions: 4000, visitors: 2400 },
  { name: 'May', sessions: 10000, visitors: 3000 },
  { name: 'May', sessions: 16000, visitors: 5000 },
  { name: 'May', sessions: 14000, visitors: 8000 },
  { name: 'May', sessions: 16000, visitors: 6000 },
  { name: 'May', sessions: 24000, visitors: 10000 },
  { name: 'May', sessions: 25000, visitors: 8000 },
  { name: 'May', sessions: 31000, visitors: 11000 },
]

export const SessionsChart: React.FC = () => {
  return (
    <div className="bg-[#17181A] p-6 rounded-3xl border border-gray-800/50">
      <div className="flex justify-between items-start mb-8">
        <div>
          <h2 className="text-2xl font-bold text-white mb-1">Number of Sessions</h2>
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

      <div className="h-[250px] w-full">
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart data={data} margin={{ top: 10, right: 0, left: -20, bottom: 0 }}>
            <defs>
              <linearGradient id="colorSessions" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#FF3B5C" stopOpacity={0.2}/>
                <stop offset="95%" stopColor="#FF3B5C" stopOpacity={0}/>
              </linearGradient>
              <linearGradient id="colorVisitors" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#3B82F6" stopOpacity={0.2}/>
                <stop offset="95%" stopColor="#3B82F6" stopOpacity={0}/>
              </linearGradient>
            </defs>
            <XAxis 
              dataKey="name" 
              axisLine={false} 
              tickLine={false} 
              tick={{ fill: '#6B7280', fontSize: 12 }} 
              dy={10}
            />
            <YAxis 
              axisLine={false} 
              tickLine={false} 
              tick={{ fill: '#6B7280', fontSize: 12 }}
              tickFormatter={(value) => `${value / 1000}k`}
            />
            <Tooltip 
              contentStyle={{ backgroundColor: '#1F1F1F', border: 'none', borderRadius: '8px', color: '#fff' }}
              itemStyle={{ color: '#fff' }}
            />
            <Area 
              type="monotone" 
              dataKey="sessions" 
              stroke="#FF3B5C" 
              strokeWidth={2}
              fillOpacity={1} 
              fill="url(#colorSessions)" 
            />
            <Area 
              type="monotone" 
              dataKey="visitors" 
              stroke="#3B82F6" 
              strokeWidth={2}
              fillOpacity={1} 
              fill="url(#colorVisitors)" 
            />
          </AreaChart>
        </ResponsiveContainer>
      </div>

      <div className="flex justify-center items-center mt-6 space-x-8">
        <div className="flex items-center">
          <span className="w-3 h-3 rounded-full bg-[#FF3B5C] mr-2"></span>
          <span className="text-sm text-gray-400">Number of Sessions</span>
        </div>
        <div className="flex items-center">
          <span className="w-3 h-3 rounded-full bg-blue-500 mr-2"></span>
          <span className="text-sm text-gray-400">Number of Unique Visitors</span>
        </div>
      </div>
    </div>
  )
}
