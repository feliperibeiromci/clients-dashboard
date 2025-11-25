// Serviço para integração com Google PageSpeed Insights API

export interface PageSpeedMetrics {
  performanceScore: number // 0-100
  firstContentfulPaint: number // FCP em segundos
  largestContentfulPaint: number // LCP em segundos
  cumulativeLayoutShift: number // CLS
  totalBlockingTime: number // TBT em milissegundos
  speedIndex?: number
  timeToInteractive?: number
  firstInputDelay?: number
}

export interface PageSpeedResponse {
  metrics: PageSpeedMetrics | null
  error?: string
}

/**
 * Busca métricas de performance usando Google PageSpeed Insights API
 */
export async function getPageSpeedMetrics(
  url: string,
  apiKey: string,
  strategy: 'desktop' | 'mobile' = 'desktop'
): Promise<PageSpeedResponse> {
  try {
    if (!apiKey) {
      return {
        metrics: null,
        error: 'Chave da API não fornecida.',
      }
    }

    try {
      new URL(url)
    } catch {
      return {
        metrics: null,
        error: 'URL inválida.',
      }
    }

    const apiUrl = `https://www.googleapis.com/pagespeedonline/v5/runPagespeed`
    const params = new URLSearchParams({
      url: url,
      key: apiKey,
      strategy: strategy,
      category: 'performance',
    })

    const response = await fetch(`${apiUrl}?${params.toString()}`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
    })

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}))
      if (response.status === 400) {
        return {
          metrics: null,
          error: errorData.error?.message || 'Requisição inválida. Verifique a URL e a chave da API.',
        }
      }
      if (response.status === 403) {
        return {
          metrics: null,
          error: 'Acesso negado. Verifique se a chave da API está correta e habilitada.',
        }
      }
      throw new Error(
        errorData.error?.message || `HTTP error! status: ${response.status}`
      )
    }

    const data = await response.json()
    const lighthouseResult = data.lighthouseResult
    const audits = lighthouseResult?.audits || {}
    const categories = lighthouseResult?.categories || {}
    const performanceCategory = categories.performance || {}

    const metrics: PageSpeedMetrics = {
      performanceScore: Math.round(performanceCategory.score * 100) || 0,
      firstContentfulPaint: audits['first-contentful-paint']?.numericValue
        ? audits['first-contentful-paint'].numericValue / 1000
        : 0,
      largestContentfulPaint: audits['largest-contentful-paint']?.numericValue
        ? audits['largest-contentful-paint'].numericValue / 1000
        : 0,
      cumulativeLayoutShift: audits['cumulative-layout-shift']?.numericValue || 0,
      totalBlockingTime: audits['total-blocking-time']?.numericValue || 0,
      speedIndex: audits['speed-index']?.numericValue
        ? audits['speed-index'].numericValue / 1000
        : undefined,
      timeToInteractive: audits['interactive']?.numericValue
        ? audits['interactive'].numericValue / 1000
        : undefined,
      firstInputDelay: audits['max-potential-fid']?.numericValue
        ? audits['max-potential-fid'].numericValue / 1000
        : undefined,
    }

    return { metrics }
  } catch (error) {
    console.error('Erro ao buscar métricas do PageSpeed:', error)
    return {
      metrics: null,
      error: error instanceof Error ? error.message : 'Erro desconhecido ao buscar métricas do PageSpeed',
    }
  }
}


