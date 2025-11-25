<!-- 8d2db8ff-9ccd-4427-8580-dff391d2a96b d97314a3-4b81-4af9-ba8f-6f8b989ec1ac -->
# Integração de Dados Externos para o Dashboard

## Objetivo

Implementar serviços para buscar e exibir dados de:

- **WordPress**: Lista de plugins instalados
- **Google Analytics**: Métricas de tráfego e sessões
- **Domínio**: Status do certificado SSL
- **Lighthouse**: Métricas de performance via PageSpeed Insights API

## Estrutura de Implementação

### 1. Configuração de Variáveis de Ambiente

Atualizar `env.example` e documentar as novas variáveis necessárias:

- `VITE_WORDPRESS_API_URL` - URL base da API REST do WordPress
- `VITE_WORDPRESS_USERNAME` - Usuário para autenticação WordPress
- `VITE_WORDPRESS_APPLICATION_PASSWORD` - Application Password do WordPress
- `VITE_GOOGLE_ANALYTICS_PROPERTY_ID` - ID da propriedade do GA4
- `VITE_GOOGLE_API_KEY` - Chave da API do Google (para PageSpeed Insights)
- `VITE_SSL_CHECK_API_KEY` - (Opcional) Chave para API de verificação SSL

### 2. Serviços de Integração

#### 2.1 WordPress Service (`src/services/platforms/wordpress.ts`)

- Função `getWordPressPlugins(url: string, credentials: {username: string, password: string})`
- Usar WordPress REST API: `/wp-json/wp/v2/plugins`
- Retornar lista de plugins com nome, versão, status (ativo/inativo)

#### 2.2 Google Analytics Service (`src/services/google/analytics.ts`)

- Função `getAnalyticsData(propertyId: string, dateRange: {start: string, end: string})`
- Usar Google Analytics Data API (GA4)
- Retornar métricas: sessões, usuários, pageviews, bounce rate
- **Nota**: Requer OAuth ou Service Account (implementar autenticação adequada)

#### 2.3 Domain/SSL Service (`src/services/hosting/ssl.ts`)

- Função `checkSSLStatus(domain: string)`
- Usar API pública (SSL Labs API ou similar) ou verificação local
- Retornar: status (válido/expirado), data de expiração, emissor

#### 2.4 Lighthouse/PageSpeed Service (`src/services/google/pagespeed.ts`)

- Função `getPageSpeedMetrics(url: string, apiKey: string)`
- Usar Google PageSpeed Insights API
- Retornar: Performance score, FCP, LCP, CLS, TBT

### 3. Tipos TypeScript

Atualizar `src/types/index.ts` com interfaces para:

- `WordPressPluginData`
- `AnalyticsData`
- `SSLStatus`
- `PageSpeedMetrics`

### 4. Hooks Customizados

Criar hooks em `src/hooks/`:

- `useWordPressPlugins(platformId: string)`
- `useAnalyticsData(clientId: string, dateRange)`
- `useSSLStatus(domain: string)`
- `usePageSpeedMetrics(url: string)`

### 5. Armazenamento no Supabase

Criar/atualizar tabelas no Supabase para cache:

- `wordpress_plugins` - Cache de plugins por plataforma
- `analytics_snapshots` - Snapshots de dados do Analytics
- `ssl_status` - Status SSL por domínio
- `pagespeed_metrics` - Métricas de performance

### 6. Integração com Componentes Existentes

- Atualizar `SiteSpeedMetric` para usar dados reais do PageSpeed
- Criar componente para exibir plugins do WordPress
- Integrar dados de Analytics no `OverallTrafficMetric`

## Arquivos a Modificar/Criar

**Novos arquivos:**

- `src/services/platforms/wordpress.ts`
- `src/services/google/analytics.ts`
- `src/services/google/pagespeed.ts`
- `src/services/hosting/ssl.ts`
- `src/hooks/useWordPressPlugins.ts`
- `src/hooks/useAnalyticsData.ts`
- `src/hooks/useSSLStatus.ts`
- `src/hooks/usePageSpeedMetrics.ts`

**Arquivos a modificar:**

- `env.example` - Adicionar novas variáveis
- `src/types/index.ts` - Adicionar novos tipos
- `src/services/google/index.ts` - Exportar novos serviços
- `src/services/platforms/index.ts` - Exportar serviço WordPress
- `src/services/hosting/index.ts` - Exportar serviço SSL
- Componentes de métricas para usar dados reais

## Considerações Importantes

1. **Autenticação Google Analytics**: GA4 requer OAuth 2.0 ou Service Account. Para produção, considerar Edge Functions do Supabase para manter credenciais seguras.

2. **Rate Limiting**: Implementar cache e throttling para evitar exceder limites de API.

3. **Tratamento de Erros**: Todos os serviços devem ter tratamento robusto de erros e fallbacks.

4. **CORS**: Algumas APIs podem requerer proxy via Supabase Edge Functions para evitar problemas de CORS.