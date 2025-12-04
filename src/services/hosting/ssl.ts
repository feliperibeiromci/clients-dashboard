// Serviço para verificação de status SSL

export interface SSLStatus {
  domain: string
  isValid: boolean
  isExpired: boolean
  expirationDate: string | null
  issuer: string | null
  daysUntilExpiration: number | null
  grade?: string
  error?: string
}

export interface SSLResponse {
  status: SSLStatus | null
  error?: string
}

/**
 * Verifica o status do certificado SSL de um domínio
 * 
 * Esta implementação usa uma abordagem que funciona no navegador.
 * Para produção, recomenda-se usar uma API externa (SSL Labs, etc.)
 * ou implementar no backend via Supabase Edge Functions.
 */
export async function checkSSLStatus(
  domain: string,
  apiKey?: string
): Promise<SSLResponse> {
  try {
    const cleanDomain = domain.replace(/^https?:\/\//, '').replace(/\/$/, '')

    if (apiKey) {
      return await checkSSLStatusWithAPI(cleanDomain, apiKey)
    }

    return await checkSSLStatusBasic(cleanDomain)
  } catch (error) {
    console.error('Erro ao verificar status SSL:', error)
    return {
      status: null,
      error: error instanceof Error ? error.message : 'Erro desconhecido ao verificar SSL',
    }
  }
}

async function checkSSLStatusBasic(domain: string): Promise<SSLResponse> {
  try {
    const apiUrl = `https://api.ssllabs.com/api/v3/analyze?host=${domain}&publish=off&fromCache=on&maxAge=24`
    
    try {
      const response = await fetch(apiUrl, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
      })

      if (response.ok) {
        const data = await response.json()
        const endpoints = data.endpoints || []
        const endpoint = endpoints[0]

        if (endpoint) {
          const grade = endpoint.grade || 'N/A'
          const status: SSLStatus = {
            domain,
            isValid: grade !== 'F' && grade !== 'T',
            isExpired: false,
            expirationDate: null,
            issuer: endpoint.serverName || null,
            daysUntilExpiration: null,
            grade,
          }

          return { status }
        }
      }
    } catch (fetchError) {
      console.warn('Falha ao usar SSL Labs API:', fetchError)
    }

    return {
      status: {
        domain,
        isValid: true,
        isExpired: false,
        expirationDate: null,
        issuer: null,
        daysUntilExpiration: null,
        error: 'Verificação completa requer backend ou API externa',
      },
    }
  } catch (error) {
    return {
      status: null,
      error: error instanceof Error ? error.message : 'Erro ao verificar SSL',
    }
  }
}

async function checkSSLStatusWithAPI(
  domain: string,
  apiKey: string
): Promise<SSLResponse> {
  try {
    // Exemplo de implementação com API externa
    // Ajustar conforme a API escolhida
    const apiUrl = `https://api.example-ssl-service.com/v1/check`
    
    const response = await fetch(apiUrl, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${apiKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ domain }),
    })

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`)
    }

    const data = await response.json()

    const expirationDate = data.expiration_date
      ? new Date(data.expiration_date).toISOString()
      : null

    const daysUntilExpiration = expirationDate
      ? Math.ceil(
          (new Date(expirationDate).getTime() - new Date().getTime()) /
            (1000 * 60 * 60 * 24)
        )
      : null

    const status: SSLStatus = {
      domain,
      isValid: data.is_valid || false,
      isExpired: data.is_expired || false,
      expirationDate,
      issuer: data.issuer || null,
      daysUntilExpiration,
      grade: data.grade,
    }

    return { status }
  } catch (error) {
    return {
      status: null,
      error: error instanceof Error ? error.message : 'Erro ao verificar SSL com API',
    }
  }
}




