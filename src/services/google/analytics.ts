// Serviço para integração com Google Analytics Data API (GA4)

export interface AnalyticsDateRange {
  start: string // Formato: YYYY-MM-DD
  end: string // Formato: YYYY-MM-DD
}

export interface AnalyticsMetrics {
  sessions: number
  users: number
  pageviews: number
  bounceRate: number
  averageSessionDuration?: number
  newUsers?: number
  returningUsers?: number
}

export interface AnalyticsResponse {
  metrics: AnalyticsMetrics | null
  error?: string
}

/**
 * Busca dados do Google Analytics 4
 * 
 * NOTA: Esta implementação requer autenticação OAuth 2.0 ou Service Account.
 * Para produção, recomenda-se usar Supabase Edge Functions para manter
 * as credenciais seguras no servidor.
 */
export async function getAnalyticsData(
  propertyId: string,
  dateRange: AnalyticsDateRange,
  accessToken?: string
): Promise<AnalyticsResponse> {
  try {
    if (!accessToken) {
      return {
        metrics: null,
        error: 'Token de acesso não fornecido. É necessário autenticação OAuth 2.0 ou Service Account.',
      }
    }

    const formattedPropertyId = propertyId.startsWith('properties/')
      ? propertyId
      : `properties/${propertyId}`

    const apiUrl = `https://analyticsdata.googleapis.com/v1beta/${formattedPropertyId}:runReport`

    const requestBody = {
      dateRanges: [
        {
          startDate: dateRange.start,
          endDate: dateRange.end,
        },
      ],
      metrics: [
        { name: 'sessions' },
        { name: 'activeUsers' },
        { name: 'screenPageViews' },
        { name: 'bounceRate' },
        { name: 'averageSessionDuration' },
        { name: 'newUsers' },
      ],
      dimensions: [],
    }

    const response = await fetch(apiUrl, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${accessToken}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(requestBody),
    })

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}))
      if (response.status === 401) {
        return {
          metrics: null,
          error: 'Token de acesso inválido ou expirado.',
        }
      }
      if (response.status === 403) {
        return {
          metrics: null,
          error: 'Acesso negado. Verifique as permissões da conta de serviço.',
        }
      }
      throw new Error(
        errorData.error?.message || `HTTP error! status: ${response.status}`
      )
    }

    const data = await response.json()
    const metricValues = data.rows?.[0]?.metricValues || []
    
    const metrics: AnalyticsMetrics = {
      sessions: parseFloat(metricValues[0]?.value || '0'),
      users: parseFloat(metricValues[1]?.value || '0'),
      pageviews: parseFloat(metricValues[2]?.value || '0'),
      bounceRate: parseFloat(metricValues[3]?.value || '0') * 100,
      averageSessionDuration: metricValues[4]?.value
        ? parseFloat(metricValues[4].value)
        : undefined,
      newUsers: metricValues[5]?.value
        ? parseFloat(metricValues[5].value)
        : undefined,
      returningUsers: metricValues[1]?.value && metricValues[5]?.value
        ? parseFloat(metricValues[1].value) - parseFloat(metricValues[5].value)
        : undefined,
    }

    return { metrics }
  } catch (error) {
    console.error('Erro ao buscar dados do Analytics:', error)
    return {
      metrics: null,
      error: error instanceof Error ? error.message : 'Erro desconhecido ao buscar dados do Analytics',
    }
  }
}


