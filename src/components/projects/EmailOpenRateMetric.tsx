import React from 'react'
import { ArrowUpRight, ChevronDown } from 'lucide-react'
import { PieChart, Pie, Cell, ResponsiveContainer } from 'recharts'
import { ClientLogo } from './ClientLogo'

interface EmailOpenRateMetricProps {
  projectName: string
  companyName: string
  logo: string
  percentage: number // 0-100
  opened: number
  total: number
}

export const EmailOpenRateMetric: React.FC<EmailOpenRateMetricProps> = ({
  projectName,
  companyName,
  logo,
  percentage,
  opened,
  total,
}) => {
  const data = [
    { name: 'Opened', value: percentage },
    { name: 'Not Opened', value: 100 - percentage },
  ]

  const COLORS = ['#FF3856', '#2F3133']

  return (
    <div className="bg-[#17181A] rounded-[20px] p-5 flex flex-col gap-5 aspect-square">
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
          Email Open Rate
        </h4>
        <button className="bg-[#414141] hover:bg-[#414141]/80 p-1 rounded-full transition-colors">
          <ChevronDown size={16} className="text-white" />
        </button>
      </div>

      {/* Donut chart */}
      <div className="flex items-center gap-5 h-[141px] px-2 py-3">
        <div className="relative w-20 h-20 shrink-0">
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie
                data={data}
                cx="50%"
                cy="50%"
                innerRadius={25}
                outerRadius={40}
                startAngle={90}
                endAngle={-270}
                dataKey="value"
              >
                {data.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                ))}
              </Pie>
            </PieChart>
          </ResponsiveContainer>
        </div>

        <div className="flex flex-col gap-0.5 flex-1">
          <div className="flex items-center gap-1">
            <span className="text-[32px] font-semibold leading-[38.4px] text-[#F1F2F3] tracking-[-0.64px]">
              {percentage}%
            </span>
          </div>
          <p className="text-xs font-normal leading-[15.6px] text-[#ABAEB3] tracking-[-0.24px]">
            {opened.toLocaleString()} of {total.toLocaleString()} emails opened
          </p>
        </div>
      </div>
    </div>
  )
}

