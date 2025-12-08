import { useState, useEffect } from 'react'
import { getAnalyticsData, AnalyticsDateRange, AnalyticsMetrics } from '../services/google/analytics'

export interface UseAnalyticsDataResult {
  metrics: AnalyticsMetrics | null
  loading: boolean
  error: string | null
  refetch: () => Promise<void>
}

/**
 * Hook para buscar dados do Google Analytics
 * Só busca se propertyId, dateRange e accessToken forem fornecidos
 */
export function useAnalyticsData(
  propertyId: string | null | undefined,
  dateRange: AnalyticsDateRange | null | undefined,
  accessToken: string | null | undefined = null,
  enabled: boolean = true
): UseAnalyticsDataResult {
  const [metrics, setMetrics] = useState<AnalyticsMetrics | null>(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const fetchData = async () => {
    if (!propertyId || !dateRange) {
      return
    }

    setLoading(true)
    setError(null)

    try {
      const result = await getAnalyticsData(propertyId, dateRange, accessToken || undefined)
      
      if (result.error) {
        setError(result.error)
        setMetrics(null)
      } else {
        setMetrics(result.metrics)
        setError(null)
      }
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Erro desconhecido'
      setError(errorMessage)
      setMetrics(null)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    if (enabled && propertyId && dateRange) {
      fetchData()
    }
  }, [propertyId, dateRange?.start, dateRange?.end, accessToken, enabled])

  return {
    metrics,
    loading,
    error,
    refetch: fetchData,
  }
}








