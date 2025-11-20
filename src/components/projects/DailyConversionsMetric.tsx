import React from 'react'
import { ArrowUpRight, ChevronDown } from 'lucide-react'
import { ClientLogo } from './ClientLogo'

interface DailyConversionsMetricProps {
  projectName: string
  companyName: string
  logo: string
}

// Dados mockados - serão dinâmicos depois
const conversionData = [
  { conversions: 19, bounceRate: 12 },
  { conversions: 25, bounceRate: 16 },
  { conversions: 10, bounceRate: 8 },
  { conversions: 18, bounceRate: 0 },
  { conversions: 41, bounceRate: 0 },
  { conversions: 36, bounceRate: 0 },
  { conversions: 44, bounceRate: 8 },
  { conversions: 50, bounceRate: 12 },
  { conversions: 53, bounceRate: 8 },
  { conversions: 60, bounceRate: 12 },
]

const maxValue = Math.max(...conversionData.map(d => d.conversions))

export const DailyConversionsMetric: React.FC<DailyConversionsMetricProps> = ({
  projectName,
  companyName,
  logo,
}) => {
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
          Daily Conversions
        </h4>
        <button className="bg-[#414141] hover:bg-[#414141]/80 p-1 rounded-full transition-colors">
          <ChevronDown size={16} className="text-white" />
        </button>
      </div>

      {/* Bar chart */}
      <div className="flex flex-col gap-2 h-[141px] p-2">
        <div className="flex items-end justify-between gap-1 flex-1">
          {conversionData.map((item, index) => (
            <div key={index} className="flex flex-col gap-1 flex-1 items-center">
              <div className="flex flex-col gap-1 items-center justify-end flex-1 w-full">
                {/* Conversions bar */}
                {item.conversions > 0 && (
                  <div
                    className="bg-[#FF3856] rounded-full w-full"
                    style={{
                      height: `${(item.conversions / maxValue) * 100}%`,
                      minHeight: '8px',
                    }}
                  />
                )}
                {/* Bounce Rate bar */}
                {item.bounceRate > 0 && (
                  <div
                    className="bg-[#1500FE] rounded-full w-full"
                    style={{
                      height: `${(item.bounceRate / maxValue) * 100}%`,
                      minHeight: '8px',
                    }}
                  />
                )}
              </div>
            </div>
          ))}
        </div>
        
        {/* Legend */}
        <div className="flex items-center justify-center gap-5 mt-2">
          <div className="flex items-center gap-1.5">
            <div className="w-2.5 h-2.5 bg-[#FF3856] rounded-sm" />
            <span className="text-sm leading-[18.2px] text-[#ABAEB3] tracking-[-0.28px]">
              Conversions
            </span>
          </div>
          <div className="flex items-center gap-1.5">
            <div className="w-2.5 h-2.5 bg-[#1500FE] rounded-sm" />
            <span className="text-sm leading-[18.2px] text-[#ABAEB3] tracking-[-0.28px]">
              Bounce Rate
            </span>
          </div>
        </div>
      </div>
    </div>
  )
}

