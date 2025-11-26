import React from 'react'
import { ArrowUpRight, ChevronDown } from 'lucide-react'
import { PieChart, Pie, Cell, ResponsiveContainer } from 'recharts'
import { ClientLogo } from './ClientLogo'

interface SiteSpeedMetricProps {
  projectName: string
  companyName: string
  logo: string
  value: number // 0-100
  status: string // "Healthy", etc.
}

export const SiteSpeedMetric: React.FC<SiteSpeedMetricProps> = ({
  projectName,
  companyName,
  logo,
  value,
  status,
}) => {

  // Dados para o gauge semicircular usando Recharts
  const gaugeData = [
    { name: 'Progress', value: value },
    { name: 'Remaining', value: 100 - value },
  ]
  
  const COLORS = ['#FF3856', '#2F3133']

  return (
    <div 
      className="bg-[#17181A] rounded-[20px] p-5 flex flex-col gap-4 min-w-0 overflow-visible-card" 
      style={{ 
        overflow: 'visible',
        isolation: 'auto',
      }}
    >
      {/* Header */}
      <div className="flex items-start justify-between min-w-0">
        <div className="flex flex-col gap-1 flex-1 min-w-0">
          <h3 className="text-2xl font-semibold leading-[28.8px] text-[#F1F2F3] tracking-[-0.48px] truncate">
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
      <div className="flex items-center gap-3" style={{ marginBottom: '-20px' }}>
        <h4 className="text-2xl font-semibold leading-[28.8px] text-[#F1F2F3] tracking-[-0.48px]">
          Site Speed
        </h4>
        <button className="bg-[#414141] hover:bg-[#414141]/80 p-1 rounded-full transition-colors">
          <ChevronDown size={16} className="text-white" />
        </button>
      </div>

      {/* Gauge semicircular chart - design do Figma */}
      <div className="flex flex-col items-center w-full flex-1 justify-start" style={{ paddingTop: '0px', paddingBottom: '20px', minHeight: '0', marginTop: '-4px' }}>
        {/* Container único com gauge e texto */}
        <div className="flex flex-col items-center justify-center w-full relative" style={{ zIndex: 10, gap: '8px' }}>
          {/* Gauge semicircular usando Recharts - ocupando mais espaço */}
          <div className="w-full flex justify-center" style={{ marginBottom: '-70px', height: '200px', maxWidth: '100%', paddingLeft: '0px', paddingRight: '0px' }}>
            <ResponsiveContainer width="100%" height="100%">
              <PieChart margin={{ top: 0, right: 0, bottom: 0, left: 0 }}>
                <defs>
                  <filter id={`gaugeGlow-${value}`} x="-50%" y="-50%" width="200%" height="200%">
                    <feGaussianBlur in="SourceGraphic" stdDeviation="4" result="blur"/>
                    <feColorMatrix in="blur" mode="matrix" values="1 0 0 0 0  0 0.07 0.13 0 0  0 0 0.33 0 0  0 0 0 0.9 0" result="glow"/>
                    <feBlend in="SourceGraphic" in2="glow" mode="normal"/>
                  </filter>
                </defs>
                <Pie
                  data={gaugeData}
                  cx="50%"
                  cy="100%"
                  startAngle={180}
                  endAngle={0}
                  innerRadius={95}
                  outerRadius={130}
                  dataKey="value"
                  stroke="none"
                >
                  {gaugeData.map((_, index) => (
                    <Cell 
                      key={`cell-${index}`} 
                      fill={COLORS[index % COLORS.length]}
                      style={index === 0 ? { filter: `url(#gaugeGlow-${value})` } : {}}
                    />
                  ))}
                </Pie>
              </PieChart>
            </ResponsiveContainer>
          </div>
          
          {/* Value text centered - posicionado dentro do espaço do semicírculo, sem compressão */}
          <div className="flex items-center justify-center" style={{ marginTop: '-32px', marginBottom: '4px' }}>
            <span 
              style={{ 
                fontFamily: 'Jost, sans-serif', 
                fontSize: '40px',
                fontWeight: 600,
                lineHeight: '48px',
                letterSpacing: '-0.8px',
                color: '#F1F2F3'
              }}
            >
              {value}
            </span>
          </div>
          
          {/* Status badge - posicionado abaixo do número */}
          <div className="flex items-center gap-1.5">
            <span 
              className="text-base font-normal leading-[20.8px] text-[#F1F2F3] tracking-[-0.32px]" 
              style={{ fontFamily: 'Jost, sans-serif' }}
            >
              Site is
            </span>
            <div className="px-2.5 py-0.5 rounded-md border border-[#45C347] bg-[#45C347]/10">
              <span 
                className="text-base font-normal leading-[20.8px] text-[#ECF9ED] tracking-[-0.32px]" 
                style={{ fontFamily: 'Jost, sans-serif' }}
              >
                {status}
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

