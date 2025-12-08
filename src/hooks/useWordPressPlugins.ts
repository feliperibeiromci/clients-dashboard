import { useState, useEffect } from 'react'
import { getWordPressPlugins, WordPressPlugin, WordPressCredentials } from '../services/platforms/wordpress'

export interface UseWordPressPluginsResult {
  plugins: WordPressPlugin[]
  loading: boolean
  error: string | null
  refetch: () => Promise<void>
}

/**
 * Hook para buscar plugins do WordPress
 * Só busca se url e credentials forem fornecidos
 */
export function useWordPressPlugins(
  url: string | null | undefined,
  credentials: WordPressCredentials | null | undefined,
  enabled: boolean = true
): UseWordPressPluginsResult {
  const [plugins, setPlugins] = useState<WordPressPlugin[]>([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const fetchPlugins = async () => {
    if (!url || !credentials) {
      return
    }

    setLoading(true)
    setError(null)

    try {
      const result = await getWordPressPlugins(url, credentials)
      
      if (result.error) {
        setError(result.error)
        setPlugins([])
      } else {
        setPlugins(result.plugins)
        setError(null)
      }
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Erro desconhecido'
      setError(errorMessage)
      setPlugins([])
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    if (enabled && url && credentials) {
      fetchPlugins()
    }
  }, [url, credentials?.username, credentials?.password, enabled])

  return {
    plugins,
    loading,
    error,
    refetch: fetchPlugins,
  }
}








