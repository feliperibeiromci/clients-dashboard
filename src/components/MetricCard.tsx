import React from 'react'
import { DashboardMetric } from '../types'
import { Card } from './Card'

interface MetricCardProps {
  metric: DashboardMetric
}

export const MetricCard: React.FC<MetricCardProps> = ({ metric }) => {
  const getChangeColor = () => {
    if (!metric.change) return ''
    if (metric.changeType === 'increase') return 'text-green-600'
    if (metric.changeType === 'decrease') return 'text-red-600'
    return 'text-gray-600'
  }

  const getChangeIcon = () => {
    if (!metric.change) return null
    if (metric.changeType === 'increase') return '↑'
    if (metric.changeType === 'decrease') return '↓'
    return '→'
  }

  return (
    <Card className="hover:shadow-md transition-shadow">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm font-medium text-gray-600">{metric.title}</p>
          <p className="text-2xl font-bold text-gray-900 mt-2">{metric.value}</p>
          {metric.change !== undefined && (
            <p className={`text-sm mt-1 ${getChangeColor()}`}>
              {getChangeIcon()} {Math.abs(metric.change)}%
            </p>
          )}
        </div>
        {metric.icon && (
          <div className="text-3xl">{metric.icon}</div>
        )}
      </div>
    </Card>
  )
}

