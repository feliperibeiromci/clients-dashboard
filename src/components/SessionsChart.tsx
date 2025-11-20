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
    <div className="bg-[#17181A] p-5 rounded-[20px] border border-gray-800/50">
      <div className="flex justify-between items-start mb-5">
        <div>
          <h2 className="text-[40px] font-semibold leading-[48px] text-white mb-1 tracking-[-0.8px]">Number of Sessions</h2>
          <div className="flex items-center gap-1.5 text-[#ABAEB3] text-sm">
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

      <div className="h-[260px] w-full">
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart data={data} margin={{ top: 10, right: 0, left: -20, bottom: 0 }}>
            <defs>
              <linearGradient id="colorSessions" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#FF3B5C" stopOpacity={0.2}/>
                <stop offset="95%" stopColor="#FF3B5C" stopOpacity={0}/>
              </linearGradient>
              <linearGradient id="colorVisitors" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#1500FE" stopOpacity={0.2}/>
                <stop offset="95%" stopColor="#1500FE" stopOpacity={0}/>
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
              stroke="#1500FE" 
              strokeWidth={2}
              fillOpacity={1} 
              fill="url(#colorVisitors)" 
            />
          </AreaChart>
        </ResponsiveContainer>
      </div>

      <div className="flex justify-center items-center mt-5 gap-5">
        <div className="flex items-center gap-2">
          <span className="w-3 h-3 rounded bg-[#FF3856]"></span>
          <span className="text-base text-[#ABAEB3]">Number of Sessions</span>
        </div>
        <div className="flex items-center gap-2">
          <span className="w-3 h-3 rounded bg-[#1500FE]"></span>
          <span className="text-base text-[#ABAEB3]">Number of Unique Visitors</span>
        </div>
      </div>
    </div>
  )
}
