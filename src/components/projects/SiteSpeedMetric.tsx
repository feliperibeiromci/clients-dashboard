import React from 'react'
import { ArrowUpRight, ChevronDown } from 'lucide-react'
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

  // Calcular comprimento do arco para o gauge semicircular
  const radius = 110
  const circumference = Math.PI * radius // Comprimento do semicírculo
  const progress = value / 100 // Progresso de 0 a 1
  const arcLength = circumference * progress

  return (
    <div className="bg-[#17181A] rounded-[20px] p-5 flex flex-col gap-5 aspect-square min-w-0 overflow-visible">
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
      <div className="flex items-center gap-3">
        <h4 className="text-2xl font-semibold leading-[28.8px] text-[#F1F2F3] tracking-[-0.48px]">
          Site Speed
        </h4>
        <button className="bg-[#414141] hover:bg-[#414141]/80 p-1 rounded-full transition-colors">
          <ChevronDown size={16} className="text-white" />
        </button>
      </div>

      {/* Gauge semicircular chart - conforme design Figma */}
      <div className="relative h-[141px] w-full flex items-center justify-center overflow-hidden">
        {/* Background semicircle (track) - dark gray */}
        <svg 
          viewBox="0 0 261 141" 
          className="absolute left-1/2 top-0 -translate-x-1/2"
          style={{ 
            width: '261px',
            height: '141px',
            maxWidth: '100%',
            aspectRatio: '261 / 141',
          }}
          preserveAspectRatio="xMidYMin meet"
        >
          <path
            d="M 20.5 31 A 110 110 0 0 1 240.5 31"
            fill="none"
            stroke="#2F3133"
            strokeWidth="20"
            strokeLinecap="round"
          />
        </svg>
        
        {/* Progress semicircle - red with glow */}
        <svg 
          viewBox="0 0 261 141" 
          className="absolute left-1/2 top-0 -translate-x-1/2"
          style={{ 
            width: '261px',
            height: '141px',
            maxWidth: '100%',
            aspectRatio: '261 / 141',
          }}
          preserveAspectRatio="xMidYMin meet"
        >
          <defs>
            <filter id={`gaugeGlow-${value}`} x="-50%" y="-50%" width="200%" height="200%">
              <feGaussianBlur in="SourceGraphic" stdDeviation="3" result="blur"/>
              <feColorMatrix in="blur" mode="matrix" values="1 0 0 0 0  0 0.07 0.13 0 0  0 0 0.33 0 0  0 0 0 0.8 0" result="glow"/>
              <feBlend in="SourceGraphic" in2="glow" mode="normal"/>
            </filter>
          </defs>
          <path
            d="M 20.5 31 A 110 110 0 0 1 240.5 31"
            fill="none"
            stroke="#FF3856"
            strokeWidth="20"
            strokeLinecap="round"
            strokeDasharray={`${arcLength} ${circumference}`}
            strokeDashoffset={0}
            style={{
              filter: `url(#gaugeGlow-${value})`,
            }}
          />
        </svg>
        
        {/* Value text centered in the semicircle */}
        <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 z-10" style={{ marginTop: '-10px' }}>
          <span 
            className="text-4xl font-semibold leading-[48px] text-[#F1F2F3] tracking-[-0.8px]" 
            style={{ fontFamily: 'Jost, sans-serif', fontWeight: 600 }}
          >
            {value}
          </span>
        </div>
        
        {/* Status badge at bottom */}
        <div className="absolute bottom-[12px] left-1/2 -translate-x-1/2 flex items-center z-10">
          <span 
            className="text-base font-normal leading-[20.8px] text-[#F1F2F3] tracking-[-0.32px]" 
            style={{ fontFamily: 'Jost, sans-serif' }}
          >
            Site is
          </span>
          <div className="relative ml-0.5 px-1 py-0 rounded-md border border-[#45C347] bg-[#45C347]/10">
            <span 
              className="relative text-base font-normal leading-[20.8px] text-[#ECF9ED] tracking-[-0.32px] z-[4]" 
              style={{ fontFamily: 'Jost, sans-serif' }}
            >
              {status}
            </span>
            <div className="absolute inset-0 border border-[#45C347] rounded-md z-[2]" />
            <div className="absolute inset-0 bg-[#45C347] opacity-10 rounded-md z-[1]" />
          </div>
        </div>
      </div>
    </div>
  )
}

