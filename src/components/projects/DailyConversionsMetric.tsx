import React from 'react'
import { ArrowUpRight, ChevronDown } from 'lucide-react'
import { ClientLogo } from './ClientLogo'

interface DailyConversionsMetricProps {
  projectName: string
  companyName: string
  logo: string
}

// Dados mockados - exatamente como na imagem
const conversionData = [
  { conversions: 20, bounceRate: 18 },
  { conversions: 30, bounceRate: 15 },
  { conversions: 15, bounceRate: 12 },
  { conversions: 25, bounceRate: 0 },
  { conversions: 45, bounceRate: 0 },
  { conversions: 40, bounceRate: 0 },
  { conversions: 55, bounceRate: 0 },
  { conversions: 50, bounceRate: 0 },
  { conversions: 60, bounceRate: 8 },
  { conversions: 70, bounceRate: 8 },
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
      <div className="flex flex-col gap-2 h-[141px] py-2">
        <div className="flex items-end justify-between gap-3 flex-1 px-2">
          {conversionData.map((item, index) => (
            <div key={index} className="flex flex-col gap-2 flex-1 items-center justify-end h-full">
              {/* Conversions bar (Red) */}
              <div
                className="bg-[#FF3856] rounded-full w-2.5"
                style={{
                  height: `${(item.conversions / maxValue) * 70}%`,
                  minHeight: '8px',
                }}
              />
              {/* Bounce Rate bar (Blue) */}
              {item.bounceRate > 0 && (
                <div
                  className="bg-[#1500FE] rounded-full w-2.5"
                  style={{
                    height: `${(item.bounceRate / maxValue) * 70}%`,
                    minHeight: '8px',
                  }}
                />
              )}
              {/* Spacer for alignment when no bounce rate */}
              {item.bounceRate === 0 && (
                <div className="w-2.5 h-2" /> // Altura fixa de 8px para manter alinhamento
              )}
            </div>
          ))}
        </div>
        
        {/* Legend */}
        <div className="flex items-center justify-center gap-6 mt-auto">
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 bg-[#FF3856] rounded-[4px]" />
            <span className="text-[13px] leading-none text-[#ABAEB3] tracking-[-0.26px] font-medium">
              Conversions
            </span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 bg-[#1500FE] rounded-[4px]" />
            <span className="text-[13px] leading-none text-[#ABAEB3] tracking-[-0.26px] font-medium">
              Bounce Rate
            </span>
          </div>
        </div>
      </div>
    </div>
  )
}
