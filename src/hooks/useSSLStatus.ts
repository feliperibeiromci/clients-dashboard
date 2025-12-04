import { useState, useEffect } from 'react'
import { checkSSLStatus, SSLStatus } from '../services/hosting/ssl'

export interface UseSSLStatusResult {
  status: SSLStatus | null
  loading: boolean
  error: string | null
  refetch: () => Promise<void>
}

/**
 * Hook para verificar status SSL de um domínio
 * Só verifica se domain for fornecido
 */
export function useSSLStatus(
  domain: string | null | undefined,
  apiKey: string | null | undefined = null,
  enabled: boolean = true
): UseSSLStatusResult {
  const [status, setStatus] = useState<SSLStatus | null>(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const fetchStatus = async () => {
    if (!domain) {
      return
    }

    setLoading(true)
    setError(null)

    try {
      const result = await checkSSLStatus(domain, apiKey || undefined)
      
      if (result.error) {
        setError(result.error)
        setStatus(null)
      } else {
        setStatus(result.status)
        setError(null)
      }
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Erro desconhecido'
      setError(errorMessage)
      setStatus(null)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    if (enabled && domain) {
      fetchStatus()
    }
  }, [domain, apiKey, enabled])

  return {
    status,
    loading,
    error,
    refetch: fetchStatus,
  }
}




