// Serviço para integração com WordPress REST API

export interface WordPressPlugin {
  plugin: string
  status: 'active' | 'inactive'
  name: string
  plugin_uri?: string
  version: string
  description?: string
  author?: string
  author_uri?: string
  text_domain?: string
  domain_path?: string
  network?: boolean
  requires_wp?: string
  tested_wp?: string
  requires_php?: string
  update?: boolean
  auto_update?: boolean
}

export interface WordPressCredentials {
  username: string
  password: string
}

export interface WordPressPluginsResponse {
  plugins: WordPressPlugin[]
  error?: string
}

/**
 * Busca lista de plugins instalados no WordPress
 * @param url URL base do WordPress (ex: https://example.com)
 * @param credentials Credenciais de autenticação (username e application password)
 * @returns Lista de plugins ou erro
 */
export async function getWordPressPlugins(
  url: string,
  credentials: WordPressCredentials
): Promise<WordPressPluginsResponse> {
  try {
    const baseUrl = url.replace(/\/$/, '')
    const apiUrl = `${baseUrl}/wp-json/wp/v2/plugins`
    const authString = btoa(`${credentials.username}:${credentials.password}`)
    
    const response = await fetch(apiUrl, {
      method: 'GET',
      headers: {
        'Authorization': `Basic ${authString}`,
        'Content-Type': 'application/json',
      },
    })

    if (!response.ok) {
      if (response.status === 401) {
        return {
          plugins: [],
          error: 'Credenciais inválidas. Verifique o username e application password.',
        }
      }
      if (response.status === 403) {
        return {
          plugins: [],
          error: 'Acesso negado. Verifique as permissões do usuário.',
        }
      }
      if (response.status === 404) {
        return {
          plugins: [],
          error: 'API do WordPress não encontrada. Verifique a URL.',
        }
      }
      throw new Error(`HTTP error! status: ${response.status}`)
    }

    const data = await response.json()
    const plugins: WordPressPlugin[] = Array.isArray(data) ? data : []

    return {
      plugins: plugins.map((plugin: any) => ({
        plugin: plugin.plugin || '',
        status: plugin.status === 'active' ? 'active' : 'inactive',
        name: plugin.name || plugin.plugin || 'Unknown',
        plugin_uri: plugin.plugin_uri,
        version: plugin.version || '0.0.0',
        description: plugin.description,
        author: plugin.author,
        author_uri: plugin.author_uri,
        text_domain: plugin.text_domain,
        domain_path: plugin.domain_path,
        network: plugin.network || false,
        requires_wp: plugin.requires_wp,
        tested_wp: plugin.tested_wp,
        requires_php: plugin.requires_php,
        update: plugin.update || false,
        auto_update: plugin.auto_update || false,
      })),
    }
  } catch (error) {
    console.error('Erro ao buscar plugins do WordPress:', error)
    return {
      plugins: [],
      error: error instanceof Error ? error.message : 'Erro desconhecido ao buscar plugins',
    }
  }
}








