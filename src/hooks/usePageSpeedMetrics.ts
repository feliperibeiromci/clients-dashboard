import { useState, useEffect } from 'react'
import { getPageSpeedMetrics } from '../services/google/pagespeed'
import type { PageSpeedMetrics } from '../services/google/pagespeed'

export interface UsePageSpeedMetricsResult {
  metrics: PageSpeedMetrics | null
  loading: boolean
  error: string | null
  refetch: () => Promise<void>
}

/**
 * Hook para buscar métricas do PageSpeed Insights
 * Só busca se url e apiKey forem fornecidos
 */
export function usePageSpeedMetrics(
  url: string | null | undefined,
  apiKey: string | null | undefined,
  strategy: 'desktop' | 'mobile' = 'desktop',
  enabled: boolean = true
): UsePageSpeedMetricsResult {
  const [metrics, setMetrics] = useState<PageSpeedMetrics | null>(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const fetchMetrics = async () => {
    if (!url || !apiKey) {
      return
    }

    setLoading(true)
    setError(null)

    try {
      const result = await getPageSpeedMetrics(url, apiKey, strategy)
      
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
    if (enabled && url && apiKey) {
      fetchMetrics()
    }
  }, [url, apiKey, strategy, enabled])

  return {
    metrics,
    loading,
    error,
    refetch: fetchMetrics,
  }
}




