import { SourceType, ContentStatus } from '@prisma/client'

export interface FacebookPost {
  id: string
  message?: string
  story?: string
  created_time: string
  from: {
    id: string
    name: string
  }
  link?: string
  permalink_url?: string
  attachments?: {
    data: Array<{
      type: string
      url?: string
      title?: string
      description?: string
    }>
  }
}

export interface NewsArticle {
  title: string
  description?: string
  content?: string
  url: string
  publishedAt: string
  source: {
    name: string
    url?: string
  }
  author?: string
  urlToImage?: string
}

export interface MonitoringSource {
  id: string
  name: string
  type: SourceType
  url: string
  isActive: boolean
  lastChecked?: Date
}

export interface ProcessedArticle {
  title: string
  content: string
  summary?: string
  aiAnalysis?: string
  originalUrl?: string
  publishedAt: Date
  sourceId: string
  tags: string[]
  metadata?: Record<string, any>
  status: ContentStatus
}

export interface TimelineItem {
  id: string
  title: string
  description?: string
  eventDate: Date
  eventType: string
  importance: number
  article: {
    id: string
    title: string
    originalUrl?: string
    source: {
      name: string
      type: SourceType
    }
  }
}

export interface MonitoringStats {
  totalArticles: number
  todayArticles: number
  activeSources: number
  pendingAnalysis: number
  errorCount: number
}

export interface WebhookPayload {
  object: string
  entry: Array<{
    id: string
    time: number
    changes: Array<{
      field: string
      value: any
    }>
  }>
}