import React from 'react'
import { ArrowUpRight, ChevronDown } from 'lucide-react'
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
  // Cálculos para o gráfico SVG
  const radius = 42
  const strokeWidth = 8
  const normalizedRadius = radius - strokeWidth / 2
  const circumference = normalizedRadius * 2 * Math.PI
  const strokeDashoffset = circumference - (percentage / 100) * circumference

  return (
    <div className="bg-[#17181A] rounded-[20px] p-4 flex flex-col gap-3 min-w-0 overflow-visible w-full h-[261px]">
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
          Email Open Rate
        </h4>
        <button className="bg-[#414141] hover:bg-[#414141]/80 p-1 rounded-full transition-colors">
          <ChevronDown size={16} className="text-white" />
        </button>
      </div>

      {/* Content with Chart and Stats */}
      <div className="flex items-center gap-4 h-[130px]">
        {/* SVG Donut Chart */}
        <div className="relative w-[110px] h-[110px] shrink-0 flex items-center justify-center">
          <svg
            height="110"
            width="110"
            className="transform -rotate-90 scale-y-[-1] overflow-visible"
          >
            <defs>
              <filter id={`glow-${projectName.replace(/\s+/g, '-')}`} x="-50%" y="-50%" width="200%" height="200%">
                <feGaussianBlur in="SourceGraphic" stdDeviation="3" result="blur"/>
                <feColorMatrix in="blur" mode="matrix" values="1 0 0 0 0  0 0.07 0.13 0 0  0 0 0.33 0 0  0 0 0 0.8 0" result="glow"/>
                <feBlend in="SourceGraphic" in2="glow" mode="normal"/>
              </filter>
            </defs>
            {/* Background Circle */}
            <circle
              stroke="#2F3133"
              strokeWidth={strokeWidth}
              fill="transparent"
              r={normalizedRadius}
              cx="55"
              cy="55"
            />
            {/* Progress Circle */}
            <circle
              stroke="#FF3856"
              strokeWidth={strokeWidth}
              strokeDasharray={`${circumference} ${circumference}`}
              style={{ 
                strokeDashoffset, 
                filter: `url(#glow-${projectName.replace(/\s+/g, '-')})` 
              }}
              strokeLinecap="round"
              fill="transparent"
              r={normalizedRadius}
              cx="55"
              cy="55"
            />
          </svg>
          
          {/* Text inside circle */}
          <div className="absolute inset-0 flex flex-col items-center justify-center text-center">
            <span 
              className="text-lg font-bold text-white leading-tight"
              style={{ fontFamily: 'Jost, sans-serif', fontWeight: 600 }}
            >
              {total.toLocaleString()}
            </span>
            <span 
              className="text-[10px] text-[#ABAEB3] font-medium"
              style={{ fontFamily: 'Jost, sans-serif' }}
            >
              Emails
            </span>
          </div>
        </div>

        {/* Stats Text */}
        <div className="flex flex-col">
          <span 
            className="text-5xl font-semibold text-[#F1F2F3] tracking-[-1px]"
            style={{ fontFamily: 'Jost, sans-serif', fontWeight: 600 }}
          >
            {percentage}%
          </span>
          <p 
            className="text-xs text-[#ABAEB3] mt-1"
            style={{ fontFamily: 'Jost, sans-serif' }}
          >
            {opened.toLocaleString()} of {total.toLocaleString()} emails opened
          </p>
        </div>
      </div>
    </div>
  )
}
