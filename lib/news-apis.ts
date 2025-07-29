// Additional News API integrations for Thailand-Cambodia conflict monitoring
// Provides alternatives to standard RSS feeds and handles rate limits

import axios from 'axios'
import { NewsArticle } from '@/types'

export interface NewsAPIConfig {
  apiKey: string
  baseUrl: string
  rateLimitDelay?: number
}

export interface NewsAPIResult {
  success: boolean
  articles: NewsArticle[]
  totalResults?: number
  error?: string
  rateLimited?: boolean
}

class NewsAPIManager {
  private static instance: NewsAPIManager
  private newsApiKey: string
  private worldNewsApiKey: string
  private newsCatcherApiKey: string
  private lastApiCall: { [key: string]: number } = {}
  private readonly MIN_DELAY = 1000 // 1 second between calls

  constructor() {
    this.newsApiKey = process.env.NEWS_API_KEY || ''
    this.worldNewsApiKey = process.env.WORLD_NEWS_API_KEY || ''
    this.newsCatcherApiKey = process.env.NEWSCATCHER_API_KEY || ''
  }

  static getInstance(): NewsAPIManager {
    if (!NewsAPIManager.instance) {
      NewsAPIManager.instance = new NewsAPIManager()
    }
    return NewsAPIManager.instance
  }

  private async respectRateLimit(apiName: string): Promise<void> {
    const now = Date.now()
    const lastCall = this.lastApiCall[apiName] || 0
    const timeSinceLastCall = now - lastCall
    
    if (timeSinceLastCall < this.MIN_DELAY) {
      const waitTime = this.MIN_DELAY - timeSinceLastCall
      await new Promise(resolve => setTimeout(resolve, waitTime))
    }
    
    this.lastApiCall[apiName] = Date.now()
  }

  // NewsAPI.org integration
  async fetchFromNewsAPI(query: string = 'Thailand Cambodia', options: {
    pageSize?: number
    sortBy?: 'relevancy' | 'popularity' | 'publishedAt'
    language?: string
    domains?: string[]
  } = {}): Promise<NewsAPIResult> {
    if (!this.newsApiKey) {
      return { success: false, articles: [], error: 'NewsAPI key not configured' }
    }

    try {
      await this.respectRateLimit('newsapi')

      const params: any = {
        q: query,
        apiKey: this.newsApiKey,
        language: options.language || 'en',
        sortBy: options.sortBy || 'publishedAt',
        pageSize: options.pageSize || 50,
        excludeDomains: 'facebook.com,twitter.com,instagram.com,youtube.com' // Exclude social media
      }

      if (options.domains && options.domains.length > 0) {
        params.domains = options.domains.join(',')
      }

      const response = await axios.get('https://newsapi.org/v2/everything', {
        params,
        timeout: 15000
      })

      const articles: NewsArticle[] = response.data.articles.map((article: any) => ({
        title: article.title || '',
        description: article.description || '',
        content: article.content || '',
        url: article.url || '',
        publishedAt: article.publishedAt || new Date().toISOString(),
        source: {
          name: article.source?.name || 'NewsAPI',
          url: article.source?.url || ''
        },
        author: article.author || '',
        urlToImage: article.urlToImage || ''
      }))

      return {
        success: true,
        articles,
        totalResults: response.data.totalResults
      }

    } catch (error: any) {
      console.error('❌ NewsAPI error:', error.response?.data || error.message)
      
      if (error.response?.status === 429) {
        return { success: false, articles: [], error: 'Rate limited', rateLimited: true }
      }
      
      return { 
        success: false, 
        articles: [], 
        error: error.response?.data?.message || error.message 
      }
    }
  }

  // World News API integration (Cambodia-specific)
  async fetchFromWorldNewsAPI(options: {
    country?: 'kh' | 'th' // Cambodia or Thailand
    category?: string
    language?: 'en' | 'km' | 'th'
    limit?: number
  } = {}): Promise<NewsAPIResult> {
    if (!this.worldNewsApiKey) {
      return { success: false, articles: [], error: 'World News API key not configured' }
    }

    try {
      await this.respectRateLimit('worldnews')

      const params: any = {
        'api-key': this.worldNewsApiKey,
        language: options.language || 'en',
        'source-countries': options.country || 'kh',
        'min-sentiment': -1,
        'max-sentiment': 1,
        number: options.limit || 50,
        'earliest-publish-date': new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString().split('T')[0] // Last 7 days
      }

      // Add Thailand-Cambodia conflict keywords
      params.text = 'Thailand Cambodia border conflict dispute diplomatic'

      const response = await axios.get('https://api.worldnewsapi.com/search-news', {
        params,
        timeout: 15000
      })

      const articles: NewsArticle[] = response.data.news.map((article: any) => ({
        title: article.title || '',
        description: article.summary || '',
        content: article.text || article.summary || '',
        url: article.url || '',
        publishedAt: article.publish_date || new Date().toISOString(),
        source: {
          name: article.source || 'World News API',
          url: article.source_url || ''
        },
        author: article.author || '',
        urlToImage: article.image || ''
      }))

      return {
        success: true,
        articles,
        totalResults: response.data.available
      }

    } catch (error: any) {
      console.error('❌ World News API error:', error.response?.data || error.message)
      
      if (error.response?.status === 429) {
        return { success: false, articles: [], error: 'Rate limited', rateLimited: true }
      }
      
      return { 
        success: false, 
        articles: [], 
        error: error.response?.data?.message || error.message 
      }
    }
  }

  // NewsCatcher API integration
  async fetchFromNewsCatcher(query: string = 'Thailand Cambodia', options: {
    countries?: string[]
    languages?: string[]
    sortBy?: 'relevancy' | 'date' | 'rank'
    pageSize?: number
  } = {}): Promise<NewsAPIResult> {
    if (!this.newsCatcherApiKey) {
      return { success: false, articles: [], error: 'NewsCatcher API key not configured' }
    }

    try {
      await this.respectRateLimit('newscatcher')

      const params: any = {
        q: query,
        lang: (options.languages || ['en']).join(','),
        countries: (options.countries || ['TH', 'KH']).join(','),
        sort_by: options.sortBy || 'date',
        page_size: options.pageSize || 50,
        from: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString() // Last 7 days
      }

      const response = await axios.get('https://api.newscatcherapi.com/v2/search', {
        params,
        headers: {
          'x-api-key': this.newsCatcherApiKey
        },
        timeout: 15000
      })

      const articles: NewsArticle[] = response.data.articles.map((article: any) => ({
        title: article.title || '',
        description: article.excerpt || '',
        content: article.summary || article.excerpt || '',
        url: article.link || '',
        publishedAt: article.published_date || new Date().toISOString(),
        source: {
          name: article.clean_url || 'NewsCatcher',
          url: article.link || ''
        },
        author: article.author || '',
        urlToImage: article.media || ''
      }))

      return {
        success: true,
        articles,
        totalResults: response.data.total_hits
      }

    } catch (error: any) {
      console.error('❌ NewsCatcher API error:', error.response?.data || error.message)
      
      if (error.response?.status === 429) {
        return { success: false, articles: [], error: 'Rate limited', rateLimited: true }
      }
      
      return { 
        success: false, 
        articles: [], 
        error: error.response?.data?.message || error.message 
      }
    }
  }

  // Google News RSS (alternative approach)
  async fetchFromGoogleNews(query: string = 'Thailand Cambodia conflict'): Promise<NewsAPIResult> {
    try {
      const encodedQuery = encodeURIComponent(query)
      const googleNewsUrl = `https://news.google.com/rss/search?q=${encodedQuery}&hl=en&gl=US&ceid=US:en`
      
      // Use axios to fetch RSS
      const response = await axios.get(googleNewsUrl, {
        timeout: 15000,
        headers: {
          'User-Agent': 'Mozilla/5.0 (compatible; GoogleNewsBot/1.0)'
        }
      })

      // Parse RSS manually since Google News has specific format
      const Parser = (await import('rss-parser')).default
      const parser = new Parser()
      const feed = await parser.parseString(response.data)

      const articles: NewsArticle[] = feed.items.map((item: any) => ({
        title: item.title || '',
        description: item.contentSnippet || '',
        content: item.content || item.contentSnippet || '',
        url: item.link || '',
        publishedAt: item.pubDate || new Date().toISOString(),
        source: {
          name: 'Google News',
          url: 'https://news.google.com'
        },
        author: item.creator || ''
      }))

      return {
        success: true,
        articles,
        totalResults: articles.length
      }

    } catch (error: any) {
      console.error('❌ Google News RSS error:', error.message)
      return { 
        success: false, 
        articles: [], 
        error: error.message 
      }
    }
  }

  // Combined fetch from all available APIs
  async fetchFromAllAPIs(query: string = 'Thailand Cambodia'): Promise<NewsAPIResult> {
    console.log('🌐 Fetching from multiple news APIs...')
    
    const results = await Promise.allSettled([
      this.fetchFromNewsAPI(query, { pageSize: 25 }),
      this.fetchFromWorldNewsAPI({ country: 'kh', limit: 25 }),
      this.fetchFromWorldNewsAPI({ country: 'th', limit: 25 }),
      this.fetchFromNewsCatcher(query, { pageSize: 25 }),
      this.fetchFromGoogleNews(query)
    ])

    const allArticles: NewsArticle[] = []
    let totalSuccess = 0
    const errors: string[] = []

    results.forEach((result, index) => {
      if (result.status === 'fulfilled' && result.value.success) {
        allArticles.push(...result.value.articles)
        totalSuccess++
      } else if (result.status === 'fulfilled' && result.value.error) {
        errors.push(result.value.error)
      } else if (result.status === 'rejected') {
        errors.push(`API ${index + 1} failed: ${result.reason}`)
      }
    })

    // Remove duplicates based on URL
    const uniqueArticles = allArticles.filter((article, index, self) => 
      index === self.findIndex(a => a.url === article.url)
    )

    console.log(`📊 API Results: ${totalSuccess}/5 APIs successful, ${uniqueArticles.length} unique articles`)

    return {
      success: totalSuccess > 0,
      articles: uniqueArticles,
      totalResults: uniqueArticles.length,
      error: errors.length > 0 ? errors.join('; ') : undefined
    }
  }
}

export default NewsAPIManager

// Export singleton instance
export const newsAPIManager = NewsAPIManager.getInstance()