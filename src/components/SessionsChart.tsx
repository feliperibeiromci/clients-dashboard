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
    <div className="bg-[#17181A] p-3 md:p-5 rounded-[20px] border border-gray-800/50">
      <div className="flex flex-col md:flex-row md:justify-between md:items-start gap-3 md:gap-0 mb-3 md:mb-5">
        <div className="flex-1 min-w-0">
          <h2 className="text-xl md:text-[40px] font-semibold leading-[24px] md:leading-[48px] text-white mb-1 tracking-[-0.4px] md:tracking-[-0.8px]">Number of Sessions</h2>
          <div className="flex items-center gap-1.5 text-[#ABAEB3] text-xs md:text-sm flex-wrap">
            <div className="w-4 h-4 md:w-5 md:h-5">
              <Diamond size={16} className="md:w-5 md:h-5 text-gray-500" />
            </div>
            <span className="font-semibold text-sm md:text-lg leading-[18px] md:leading-[21.6px]">New Clio Car Launch | Renault</span>
          </div>
        </div>
        <button className="flex items-center gap-1.5 text-[10px] md:text-xs font-medium text-white bg-[#414141] px-2.5 md:px-3 py-1.5 md:py-2 rounded-full hover:opacity-80 transition-opacity self-start md:self-auto">
          <span>More</span>
          <ArrowUpRight size={14} className="md:w-4 md:h-4" />
        </button>
      </div>

      <div className="h-[200px] md:h-[260px] w-full">
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

      <div className="flex justify-center items-center mt-3 md:mt-5 gap-4 md:gap-5 flex-wrap">
        <div className="flex items-center gap-1.5 md:gap-2">
          <span className="w-2 h-2 md:w-3 md:h-3 rounded bg-[#FF3856]"></span>
          <span className="text-xs md:text-base text-[#ABAEB3] leading-[15.6px] md:leading-[20.8px] tracking-[-0.24px] md:tracking-[-0.32px]" style={{ fontFamily: 'Jost, sans-serif' }}>Number of Sessions</span>
        </div>
        <div className="flex items-center gap-1.5 md:gap-2">
          <span className="w-2 h-2 md:w-3 md:h-3 rounded bg-[#1500FE]"></span>
          <span className="text-xs md:text-base text-[#ABAEB3] leading-[15.6px] md:leading-[20.8px] tracking-[-0.24px] md:tracking-[-0.32px]" style={{ fontFamily: 'Jost, sans-serif' }}>Number of Unique Visitors</span>
        </div>
      </div>
    </div>
  )
}
