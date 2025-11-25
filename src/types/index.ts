// Tipos base para o dashboard
export interface Client {
  id: string
  name: string
  email?: string
  created_at: string
  updated_at: string
}

// Tipos para Platforms
export type PlatformType = 'swoogo' | 'wordpress' | 'drupal'

export interface Platform {
  id: string
  client_id: string
  type: PlatformType
  name: string
  url: string
  status: 'active' | 'inactive' | 'error'
  last_sync?: string
  metadata?: Record<string, unknown>
}

// Tipos para WordPress Plugins
export interface WPPlugin {
  id: string
  platform_id: string
  name: string
  version: string
  status: 'active' | 'inactive' | 'update_available'
  last_checked?: string
}

// Tipos para Zapier
export interface ZapierData {
  id: string
  client_id: string
  zap_name: string
  status: 'on' | 'off' | 'error'
  last_run?: string
  run_count?: number
  metadata?: Record<string, unknown>
}

// Tipos para Email Marketing
export type EmailProvider = 'mailjet' | 'constant_contact'

export interface EmailCampaign {
  id: string
  client_id: string
  provider: EmailProvider
  campaign_name: string
  sent_date?: string
  open_rate?: number
  click_rate?: number
  bounce_rate?: number
  metadata?: Record<string, unknown>
}

// Tipos para Social Media
export type SocialPlatform = 'facebook' | 'twitter' | 'instagram' | 'linkedin' | 'reddit'

export interface SocialAccount {
  id: string
  client_id: string
  platform: SocialPlatform
  account_name: string
  followers?: number
  engagement_rate?: number
  last_post_date?: string
  metadata?: Record<string, unknown>
}

// Tipos para Google Services
export interface GoogleAnalytics {
  id: string
  client_id: string
  property_id: string
  property_name: string
  sessions?: number
  users?: number
  pageviews?: number
  bounce_rate?: number
  last_sync?: string
}

export interface GoogleSearchResult {
  id: string
  client_id: string
  keyword: string
  position?: number
  url?: string
  search_volume?: number
  last_checked?: string
}

export interface GoogleAds {
  id: string
  client_id: string
  campaign_name: string
  impressions?: number
  clicks?: number
  cost?: number
  conversions?: number
  ctr?: number
  last_sync?: string
}

// Tipos para Hosting Performance
export interface HostingPerformance {
  id: string
  client_id: string
  host_name: string
  uptime?: number
  response_time?: number
  last_check?: string
  status?: 'online' | 'offline' | 'degraded'
  metadata?: Record<string, unknown>
}

// Tipos para métricas do dashboard
export interface DashboardMetric {
  id: string
  title: string
  value: string | number
  change?: number
  changeType?: 'increase' | 'decrease' | 'neutral'
  icon?: string
}

// Tipos para integrações externas (preparados para uso futuro)
export interface WordPressPluginData {
  id: string
  platform_id: string
  plugin: string
  name: string
  version: string
  status: 'active' | 'inactive'
  description?: string
  author?: string
  update_available?: boolean
  last_checked?: string
}

export interface AnalyticsData {
  id: string
  client_id: string
  property_id: string
  sessions: number
  users: number
  pageviews: number
  bounce_rate: number
  average_session_duration?: number
  new_users?: number
  returning_users?: number
  date_range_start: string
  date_range_end: string
  last_sync?: string
}

export interface SSLStatusData {
  id: string
  client_id: string
  domain: string
  is_valid: boolean
  is_expired: boolean
  expiration_date: string | null
  issuer: string | null
  days_until_expiration: number | null
  grade?: string
  last_checked?: string
}

export interface PageSpeedMetricsData {
  id: string
  client_id: string
  url: string
  performance_score: number // 0-100
  first_contentful_paint: number // FCP em segundos
  largest_contentful_paint: number // LCP em segundos
  cumulative_layout_shift: number // CLS
  total_blocking_time: number // TBT em milissegundos
  speed_index?: number
  time_to_interactive?: number
  first_input_delay?: number
  strategy: 'desktop' | 'mobile'
  last_checked?: string
}

