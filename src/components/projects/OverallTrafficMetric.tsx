import React from 'react'
import { ArrowUpRight, ChevronDown, ArrowUp } from 'lucide-react'
import { AreaChart, Area, XAxis, YAxis, ResponsiveContainer, Tooltip } from 'recharts'
import { ClientLogo } from './ClientLogo'

interface OverallTrafficMetricProps {
  projectName: string
  companyName: string
  logo: string
  value: number // percentage
  trend: 'up' | 'down'
}

// Dados mockados - serão dinâmicos depois
const trafficData = [
  { name: '1', value: 85 },
  { name: '2', value: 88 },
  { name: '3', value: 90 },
  { name: '4', value: 92 },
  { name: '5', value: 94 },
  { name: '6', value: 95 },
  { name: '7', value: 95 },
]

export const OverallTrafficMetric: React.FC<OverallTrafficMetricProps> = ({
  projectName,
  companyName,
  logo,
  value,
  trend,
}) => {
  return (
    <div className="bg-[#17181A] rounded-[20px] p-5 flex flex-col gap-4">
      {/* Header */}
      <div className="flex items-start justify-between">
        <div className="flex flex-col gap-1 flex-1">
          <h3 className="text-2xl font-semibold leading-[28.8px] text-[#F1F2F3] tracking-[-0.48px]">
            {projectName}
          </h3>
          <div className="flex items-center gap-1">
            <ClientLogo logo={logo} size={20} />
            <span className="text-lg font-semibold leading-[21.6px] text-[#ABAEB3] tracking-[-0.36px]">
              {companyName}
            </span>
          </div>
        </div>
        <button className="bg-[#414141] hover:bg-[#414141]/80 p-2 rounded-full transition-colors shrink-0">
          <ArrowUpRight size={16} className="text-white" />
        </button>
      </div>

      {/* Metric title and dropdown */}
      <div className="flex items-center gap-3">
        <h4 className="text-2xl font-semibold leading-[28.8px] text-[#F1F2F3] tracking-[-0.48px]">
          Overall Traffic
        </h4>
        <button className="bg-[#414141] hover:bg-[#414141]/80 p-1 rounded-full transition-colors">
          <ChevronDown size={16} className="text-white" />
        </button>
      </div>

      {/* Line chart with area - ocupando espaço completo */}
      <div className="relative flex-1 w-full" style={{ minHeight: '140px' }}>
        {/* Trend indicator */}
        <div className="absolute left-4 top-4 flex items-center gap-2.5 z-10">
          <div className="relative">
            <div className="w-6 h-6 border border-[#45C347] bg-[#45C347]/10 rounded flex items-center justify-center">
              <ArrowUp size={22} className="text-[#45C347]" />
            </div>
          </div>
          <div className="flex items-center gap-1">
            <span className="text-5xl font-semibold leading-[60px] text-[#F1F2F3] tracking-[-0.8px]">
              {value}
            </span>
            <span className="text-5xl font-semibold leading-[60px] text-[#F1F2F3] tracking-[-0.8px]">
              %
            </span>
          </div>
        </div>

        <ResponsiveContainer width="100%" height="100%">
          <AreaChart data={trafficData} margin={{ top: 10, right: 10, bottom: 10, left: 10 }}>
            <defs>
              <linearGradient id="trafficGradient" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#FF3856" stopOpacity={0.3} />
                <stop offset="95%" stopColor="#FF3856" stopOpacity={0} />
              </linearGradient>
            </defs>
            <Area
              type="monotone"
              dataKey="value"
              stroke="#FF3856"
              strokeWidth={3}
              fill="url(#trafficGradient)"
            />
            <XAxis dataKey="name" hide />
            <YAxis hide />
            <Tooltip
              contentStyle={{
                backgroundColor: '#17181A',
                border: '1px solid #2F3133',
                borderRadius: '8px',
                color: '#F1F2F3',
              }}
              labelStyle={{ color: '#ABAEB3' }}
            />
          </AreaChart>
        </ResponsiveContainer>
      </div>
    </div>
  )
}

