import React, { useMemo } from 'react'
import { ArrowUpRight, ChevronDown, ArrowUp, ArrowDown } from 'lucide-react'
import { AreaChart, Area, YAxis, ResponsiveContainer, Tooltip } from 'recharts'
import { ClientLogo } from './ClientLogo'

interface OverallTrafficMetricProps {
  projectName: string
  companyName: string
  logo: string
  value: number // percentage
  trend: 'up' | 'down'
  data?: { name: string; value: number }[]
}

export const OverallTrafficMetric: React.FC<OverallTrafficMetricProps> = ({
  projectName,
  companyName,
  logo,
  value,
  trend,
  data
}) => {
  // Generate dynamic data if not provided
  const chartData = useMemo(() => {
    if (data) return data;
    
    // Generate 7 points ending with the current value
    // Create a curve that matches the trend
    const points = [];
    let currentValue = value;
    
    for (let i = 6; i >= 0; i--) {
      points.unshift({
        name: i.toString(),
        value: currentValue
      });
      
      // Generate previous points based on trend
      // If trend is UP, previous points should be lower
      // If trend is DOWN, previous points should be higher
      const variation = Math.random() * 5 + 1; // Random change between 1-6%
      if (trend === 'up') {
        currentValue -= variation;
      } else {
        currentValue += variation;
      }
      
      // Keep within logical bounds (0-100)
      currentValue = Math.max(0, Math.min(100, currentValue));
    }
    
    return points;
  }, [value, trend, data]);

  const isPositive = trend === 'up';
  const trendColor = isPositive ? '#45C347' : '#FF3856';
  const TrendIcon = isPositive ? ArrowUp : ArrowDown;

  // Create a safe ID for the gradient
  const gradientId = `trafficGradient-${projectName.replace(/\s+/g, '-')}`;

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
          Overall Traffic
        </h4>
        <button className="bg-[#414141] hover:bg-[#414141]/80 p-1 rounded-full transition-colors">
          <ChevronDown size={16} className="text-white" />
        </button>
      </div>

      {/* Line chart with area */}
      <div className="relative h-[141px] w-full">
        {/* Trend indicator */}
        <div className="absolute left-4 top-2.5 flex items-center gap-2 z-10">
          <div className="relative">
            <div 
              className="w-5 h-5 border bg-opacity-10 rounded flex items-center justify-center"
              style={{ borderColor: trendColor, backgroundColor: `${trendColor}1A` }}
            >
              <TrendIcon size={20} style={{ color: trendColor }} />
            </div>
          </div>
          <div className="flex items-center gap-1">
            <span className="text-4xl font-semibold leading-[48px] text-[#F1F2F3] tracking-[-0.8px]">
              {value}
            </span>
            <span className="text-4xl font-semibold leading-[48px] text-[#F1F2F3] tracking-[-0.8px]">
              %
            </span>
          </div>
        </div>
        
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart data={chartData} margin={{ top: 0, right: 0, bottom: 0, left: 0 }}>
            <defs>
              <linearGradient id={gradientId} x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor={trendColor} stopOpacity={0.2} />
                <stop offset="95%" stopColor={trendColor} stopOpacity={0} />
              </linearGradient>
            </defs>
            <YAxis hide domain={['dataMin - 5', 'dataMax + 5']} />
            <Area
              type="monotone"
              dataKey="value"
              stroke={trendColor}
              strokeWidth={2}
              fill={`url(#${gradientId})`}
            />
            <Tooltip
              contentStyle={{
                backgroundColor: '#17181A',
                border: '1px solid #2F3133',
                borderRadius: '8px',
                color: '#F1F2F3',
              }}
              itemStyle={{ color: trendColor }}
              labelStyle={{ color: '#ABAEB3' }}
              formatter={(value: number) => [`${value.toFixed(0)}%`, 'Traffic']}
            />
          </AreaChart>
        </ResponsiveContainer>
      </div>
    </div>
  )
}
