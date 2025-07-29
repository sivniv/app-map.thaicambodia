import axios from 'axios'
import Parser from 'rss-parser'
import * as cheerio from 'cheerio'
import { NewsArticle } from '@/types'
// Import CloudflareScraper conditionally for server environments only
const getCloudflareScraperModule = async () => {
  try {
    if (typeof window === 'undefined' && process.env.NODE_ENV !== 'production') {
      const { default: CloudflareScraper } = await import('./cloudflare-scraper')
      return CloudflareScraper
    }
  } catch (error) {
    console.warn('CloudflareScraper not available in production build')
  }
  return null
}
import { ALL_RSS_SOURCES, getCloudflareProtectedSources, getActiveRSSSources } from './rss-sources'

const parser = new Parser()

export class NewsMonitor {
  private newsApiKey: string

  constructor(newsApiKey: string) {
    this.newsApiKey = newsApiKey
  }

  async getNewsFromAPI(query: string = 'Thailand Cambodia', pageSize: number = 50): Promise<NewsArticle[]> {
    try {
      const response = await axios.get('https://newsapi.org/v2/everything', {
        params: {
          q: query,
          apiKey: this.newsApiKey,
          language: 'en',
          sortBy: 'publishedAt',
          pageSize,
          domains: 'reuters.com,bbc.com,cnn.com,aljazeera.com,apnews.com,channelnewsasia.com,bangkokpost.com,phnompenhpost.com',
        },
      })

      return response.data.articles.map((article: any) => ({
        title: article.title,
        description: article.description,
        content: article.content,
        url: article.url,
        publishedAt: article.publishedAt,
        source: {
          name: article.source.name,
          url: article.source.url,
        },
        author: article.author,
        urlToImage: article.urlToImage,
      }))
    } catch (error) {
      console.error('Error fetching news from API:', error)
      return []
    }
  }

  async fetchFromRSS(feedUrl: string, sourceName?: string): Promise<NewsArticle[]> {
    try {
      // Check if this source is known to be Cloudflare protected
      const isCloudflareProtected = this.isCloudflareProtectedSource(feedUrl)
      
      if (isCloudflareProtected) {
        console.log(`🛡️ Detected Cloudflare protected source: ${sourceName || feedUrl}`)
        return await this.fetchRSSWithCloudflareBypass(feedUrl, sourceName)
      }

      // Try standard RSS parsing first
      const feed = await parser.parseURL(feedUrl)
      
      return feed.items.map(item => ({
        title: item.title || '',
        description: item.contentSnippet || item.summary || '',
        content: item.content || item.contentSnippet || '',
        url: item.link || '',
        publishedAt: item.pubDate || new Date().toISOString(),
        source: {
          name: sourceName || feed.title || 'RSS Feed',
          url: feed.link || feedUrl,
        },
        author: item.creator || item.author,
      }))
    } catch (error) {
      console.error(`❌ Error fetching RSS feed ${feedUrl}:`, error)
      
      // If standard RSS parsing fails, try Cloudflare bypass as fallback
      if (!this.isCloudflareProtectedSource(feedUrl)) {
        console.log(`🔄 Attempting Cloudflare bypass fallback for: ${sourceName || feedUrl}`)
        return await this.fetchRSSWithCloudflareBypass(feedUrl, sourceName)
      }
      
      return []
    }
  }

  async scrapeArticleContent(url: string): Promise<string> {
    try {
      // First try standard scraping
      const response = await axios.get(url, {
        timeout: 10000,
        headers: {
          'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
          'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,*/*;q=0.8',
          'Accept-Language': 'en-US,en;q=0.5',
          'Accept-Encoding': 'gzip, deflate, br',
          'DNT': '1',
          'Connection': 'keep-alive',
          'Upgrade-Insecure-Requests': '1',
        },
      })

      const $ = cheerio.load(response.data)
      
      // Check for Cloudflare challenge indicators
      if (this.detectCloudflareInHTML(response.data)) {
        console.log(`🛡️ Cloudflare detected for article: ${url}`)
        return await this.scrapeWithCloudflareBypass(url)
      }
      
      $('script, style, nav, header, footer, aside, .advertisement, .ad').remove()
      
      const contentSelectors = [
        'article',
        '[data-module="ArticleBody"]',
        '.article-body',
        '.story-body',
        '.content',
        '.post-content',
        '.entry-content',
        'main',
        '.text-content',
        '.article-content',
        '.news-content'
      ]

      let content = ''
      for (const selector of contentSelectors) {
        const element = $(selector).first()
        if (element.length) {
          content = element.text().trim()
          break
        }
      }

      if (!content) {
        content = $('body').text().trim()
      }

      return content.replace(/\s+/g, ' ').substring(0, 5000)
    } catch (error) {
      console.error(`❌ Error with standard scraping for ${url}:`, error)
      
      // If standard scraping fails, try Cloudflare bypass
      if (error instanceof Error && (error.message.includes('403') || error.message.includes('503'))) {
        console.log(`🔄 Attempting Cloudflare bypass for article: ${url}`)
        return await this.scrapeWithCloudflareBypass(url)
      }
      
      return ''
    }
  }

  // New methods for Cloudflare bypass functionality
  private isCloudflareProtectedSource(feedUrl: string): boolean {
    const protectedSources = getCloudflareProtectedSources()
    return protectedSources.some(source => source.url === feedUrl)
  }

  private detectCloudflareInHTML(html: string): boolean {
    const cloudflareIndicators = [
      'cf-browser-verification',
      'cf-im-under-attack',
      'cf-wrapper',
      'cloudflare',
      'Checking your browser before accessing',
      'DDoS protection by Cloudflare'
    ]
    
    return cloudflareIndicators.some(indicator => html.includes(indicator))
  }

  private async fetchRSSWithCloudflareBypass(feedUrl: string, sourceName?: string): Promise<NewsArticle[]> {
    try {
      const CloudflareScraper = await getCloudflareScraperModule()
      if (!CloudflareScraper) {
        console.warn('CloudflareScraper not available, skipping protected feed:', feedUrl)
        return []
      }
      
      const scrapeResult = await CloudflareScraper.scrapeUrl(feedUrl, {
        timeout: 30000,
        waitForSelector: 'rss, feed, item, entry'
      })

      if (!scrapeResult.success || !scrapeResult.content) {
        console.error(`❌ Cloudflare bypass failed for RSS: ${feedUrl}`)
        return []
      }

      // Parse the scraped RSS content
      const feed = await parser.parseString(scrapeResult.content)
      
      return feed.items.map(item => ({
        title: item.title || '',
        description: item.contentSnippet || item.summary || '',
        content: item.content || item.contentSnippet || '',
        url: item.link || '',
        publishedAt: item.pubDate || new Date().toISOString(),
        source: {
          name: sourceName || feed.title || 'RSS Feed (Cloudflare Bypass)',
          url: feed.link || feedUrl,
        },
        author: item.creator || item.author,
      }))
    } catch (error) {
      console.error(`❌ Error with Cloudflare bypass RSS parsing for ${feedUrl}:`, error)
      return []
    }
  }

  private async scrapeWithCloudflareBypass(url: string): Promise<string> {
    try {
      const CloudflareScraper = await getCloudflareScraperModule()
      if (!CloudflareScraper) {
        console.warn('CloudflareScraper not available, falling back to basic scraping')
        return '' // Return empty content if scraper not available
      }
      
      const scrapeResult = await CloudflareScraper.scrapeUrl(url, {
        timeout: 30000,
        waitForSelector: 'article, .article-body, .content, main'
      })

      if (!scrapeResult.success || !scrapeResult.content) {
        console.error(`❌ Cloudflare bypass failed for article: ${url}`)
        return ''
      }

      const $ = cheerio.load(scrapeResult.content)
      
      $('script, style, nav, header, footer, aside, .advertisement, .ad').remove()
      
      const contentSelectors = [
        'article',
        '[data-module="ArticleBody"]',
        '.article-body',
        '.story-body',
        '.content',
        '.post-content',
        '.entry-content',
        'main',
        '.text-content',
        '.article-content',
        '.news-content'
      ]

      let content = ''
      for (const selector of contentSelectors) {
        const element = $(selector).first()
        if (element.length) {
          content = element.text().trim()
          break
        }
      }

      if (!content) {
        content = $('body').text().trim()
      }

      return content.replace(/\s+/g, ' ').substring(0, 5000)
    } catch (error) {
      console.error(`❌ Error with Cloudflare bypass scraping for ${url}:`, error)
      return ''
    }
  }

  // Enhanced method to fetch from all comprehensive RSS sources
  async fetchFromAllRSSSources(): Promise<NewsArticle[]> {
    const activeSources = getActiveRSSSources()
    const allArticles: NewsArticle[] = []
    
    console.log(`📡 Fetching from ${activeSources.length} RSS sources...`)
    
    // Process sources in batches to avoid overwhelming the system
    const batchSize = 5
    for (let i = 0; i < activeSources.length; i += batchSize) {
      const batch = activeSources.slice(i, i + batchSize)
      
      const batchPromises = batch.map(async (source) => {
        try {
          const articles = await this.fetchFromRSS(source.url, source.name)
          console.log(`✅ ${source.name}: ${articles.length} articles`)
          return articles
        } catch (error) {
          console.error(`❌ Failed to fetch from ${source.name}:`, error)
          return []
        }
      })
      
      const batchResults = await Promise.allSettled(batchPromises)
      batchResults.forEach((result) => {
        if (result.status === 'fulfilled') {
          allArticles.push(...result.value)
        }
      })
      
      // Small delay between batches to be respectful
      if (i + batchSize < activeSources.length) {
        await new Promise(resolve => setTimeout(resolve, 1000))
      }
    }
    
    console.log(`📊 Total articles fetched: ${allArticles.length}`)
    return allArticles
  }
}

export const NEWS_SOURCES = [
  {
    name: 'BBC News',
    rssUrl: 'http://feeds.bbci.co.uk/news/world/rss.xml',
    website: 'https://bbc.com',
  },
  {
    name: 'Channel News Asia',
    rssUrl: 'https://www.channelnewsasia.com/api/v1/rss-outbound-feed?_format=xml&category=6511',
    website: 'https://channelnewsasia.com',
  },
  {
    name: 'Al Jazeera',
    rssUrl: 'https://www.aljazeera.com/xml/rss/all.xml',
    website: 'https://aljazeera.com',
  },
  {
    name: 'Associated Press',
    rssUrl: 'https://feeds.apnews.com/rss/apf-topnews',
    website: 'https://apnews.com',
  },
  {
    name: 'CNN World',
    rssUrl: 'http://rss.cnn.com/rss/edition.rss',
    website: 'https://cnn.com',
  },
  {
    name: 'Voice of America',
    rssUrl: 'https://www.voanews.com/api/zp$qieve',
    website: 'https://voanews.com',
  },
  // Regional Southeast Asian Sources
  {
    name: 'Bangkok Post - Most Recent',
    rssUrl: 'https://www.bangkokpost.com/rss/data/most-recent.xml',
    website: 'https://bangkokpost.com',
  },
  {
    name: 'Bangkok Post - Top Stories',
    rssUrl: 'https://www.bangkokpost.com/rss/data/topstories.xml',
    website: 'https://bangkokpost.com',
  },
  {
    name: 'Bangkok Post - Thailand News',
    rssUrl: 'https://www.bangkokpost.com/rss/data/thailand.xml',
    website: 'https://bangkokpost.com',
  },
  {
    name: 'Bangkok Post - Business',
    rssUrl: 'https://www.bangkokpost.com/rss/data/business.xml',
    website: 'https://bangkokpost.com',
  },
  {
    name: 'Bangkok Post - World News',
    rssUrl: 'https://www.bangkokpost.com/rss/data/world.xml',
    website: 'https://bangkokpost.com',
  },
  {
    name: 'The Nation Thailand',
    rssUrl: 'https://www.nationthailand.com/rss',
    website: 'https://nationthailand.com',
  },
  {
    name: 'The Thaiger',
    rssUrl: 'https://thethaiger.com/feed',
    website: 'https://thethaiger.com',
  },
  {
    name: 'The Thaiger - Business',
    rssUrl: 'https://thethaiger.com/news/business/feed',
    website: 'https://thethaiger.com',
  },
  {
    name: 'The Pattaya News',
    rssUrl: 'https://thepattayanews.com/feed',
    website: 'https://thepattayanews.com',
  },
  {
    name: 'Thai PBS World',
    rssUrl: 'https://world.thaipbs.or.th/rss',
    website: 'https://world.thaipbs.or.th',
  },
  {
    name: 'Phnom Penh Post',
    rssUrl: 'https://www.phnompenhpost.com/rss.xml',
    website: 'https://phnompenhpost.com',
  },
  // Cambodia-Specific Sources (Verified Working RSS Feeds)
  {
    name: 'VOA Khmer',
    rssUrl: 'https://khmer.voanews.com/api/epiqq',
    website: 'https://khmer.voanews.com',
  },
  {
    name: 'Cambodia Investment Review',
    rssUrl: 'https://cambodiainvestmentreview.com/feed/',
    website: 'https://cambodiainvestmentreview.com',
  },
  {
    name: 'Asia Times Cambodia',
    rssUrl: 'https://asiatimes.com/category/southeast-asia/cambodia/feed/',
    website: 'https://asiatimes.com',
  },
  {
    name: 'The Straits Times',
    rssUrl: 'https://www.straitstimes.com/news/asia/rss.xml',
    website: 'https://straitstimes.com',
  },
  {
    name: 'Reuters Asia',
    rssUrl: 'https://feeds.reuters.com/reuters/asiaNews',
    website: 'https://reuters.com',
  },
  // Specialized Asia-Pacific Sources
  {
    name: 'Nikkei Asia',
    rssUrl: 'https://asia.nikkei.com/rss/feed/nar',
    website: 'https://asia.nikkei.com',
  },
  {
    name: 'The Diplomat',
    rssUrl: 'https://thediplomat.com/feed/',
    website: 'https://thediplomat.com',
  },
  {
    name: 'South China Morning Post',
    rssUrl: 'https://www.scmp.com/rss/4/feed',
    website: 'https://scmp.com',
  },
  // International News Sources  
  {
    name: 'France24',
    rssUrl: 'https://www.france24.com/en/rss',
    website: 'https://france24.com',
  },
  {
    name: 'Deutsche Welle',
    rssUrl: 'https://rss.dw.com/rdf/rss-en-all',
    website: 'https://dw.com',
  },
  {
    name: 'The Guardian World',
    rssUrl: 'https://www.theguardian.com/world/rss',
    website: 'https://theguardian.com',
  },
  {
    name: 'The Independent World',
    rssUrl: 'https://www.independent.co.uk/news/world/rss',
    website: 'https://independent.co.uk',
  },
  {
    name: 'Euronews',
    rssUrl: 'https://www.euronews.com/rss',
    website: 'https://euronews.com',
  },
]

export function isThailandCambodiaRelated(content: string, title: string = ''): boolean {
  const text = `${title} ${content}`.toLowerCase()
  
  // English country keywords
  const englishCountryKeywords = ['thailand', 'thai', 'cambodia', 'cambodian', 'khmer']
  
  // Khmer language keywords (Cambodia-related)
  const khmerCountryKeywords = [
    'កម្ពុជា', // Cambodia
    'ថៃ', // Thailand  
    'ប្រទេសថៃ', // Thailand country
    'ព្រះរាជាណាចក្រកម្ពុជា', // Kingdom of Cambodia
    'រាជាណាចក្រថៃ', // Kingdom of Thailand
  ]
  
  // Check for both Thailand and Cambodia being mentioned together
  const hasThailand = text.includes('thailand') || text.includes('thai') || text.includes('ថៃ') || text.includes('ប្រទេសថៃ') || text.includes('រាជាណាចក្រថៃ')
  const hasCambodia = text.includes('cambodia') || text.includes('cambodian') || text.includes('khmer') || text.includes('កម្ពុជា') || text.includes('ព្រះរាជាណាចក្រកម្ពុជា')
  
  if (hasThailand && hasCambodia) {
    return true // If both countries are mentioned, it's likely relevant
  }
  
  // Check for specific conflict-related keywords with either country
  const allCountryKeywords = [...englishCountryKeywords, ...khmerCountryKeywords]
  const hasCountries = allCountryKeywords.some(keyword => text.includes(keyword))
  
  if (!hasCountries) return false
  
  // English conflict keywords
  const englishConflictKeywords = [
    'border', 'dispute', 'tension', 'conflict', 'diplomatic',
    'territory', 'maritime', 'fishing', 'trade', 'economic',
    'cooperation', 'agreement', 'embassy', 'ambassador',
    'foreign minister', 'preah vihear', 'temple', 'bilateral',
    'negotiation', 'summit', 'meeting', 'discussion', 'ceasefire',
    'talks', 'mediation', 'shelling', 'military', 'troops'
  ]
  
  // Khmer conflict-related keywords
  const khmerConflictKeywords = [
    'ព្រំដែន', // border
    'ជម្លោះ', // dispute/conflict
    'វិវាទ', // dispute
    'កិច្ចការទូត', // diplomatic
    'ដែនដី', // territory
    'កិច្ចសហប្រតិបត្តិការ', // cooperation
    'កិច្ចព្រមព្រៀង', // agreement
    'ការចរចា', // negotiation
    'កិច្ចប្រជុំ', // meeting
    'ពិភាក្សា', // discussion
    'យោធា', // military
    'កងទ័ព', // troops
  ]
  
  const allConflictKeywords = [...englishConflictKeywords, ...khmerConflictKeywords]
  
  return allConflictKeywords.some(keyword => text.includes(keyword))
}

export function extractKeywords(content: string): string[] {
  const text = content.toLowerCase()
  
  // English keyword patterns
  const englishKeywordPatterns = [
    /\b(thailand|thai|cambodia|cambodian|khmer)\b/g,
    /\b(border|dispute|tension|conflict|diplomatic)\b/g,
    /\b(territory|maritime|fishing|trade|economic)\b/g,
    /\b(cooperation|agreement|embassy|ambassador)\b/g,
    /\b(foreign minister|bilateral|negotiation|summit)\b/g,
  ]
  
  // Khmer keyword patterns (using Unicode word boundaries)
  const khmerKeywordPatterns = [
    /(កម្ពុជា|ថៃ|ប្រទេសថៃ|ព្រះរាជាណាចក្រកម្ពុជា|រាជាណាចក្រថៃ)/g,
    /(ព្រំដែន|ជម្លោះ|វិវាទ|កិច្ចការទូត)/g,
    /(ដែនដី|កិច្ចសហប្រតិបត្តិការ|កិច្ចព្រមព្រៀង)/g,
    /(ការចរចា|កិច្ចប្រជុំ|ពិភាក្សា|យោធា|កងទ័ព)/g,
  ]
  
  const keywords = new Set<string>()
  
  // Extract English keywords
  englishKeywordPatterns.forEach(pattern => {
    const matches = text.match(pattern)
    if (matches) {
      matches.forEach(match => keywords.add(match))
    }
  })
  
  // Extract Khmer keywords
  khmerKeywordPatterns.forEach(pattern => {
    const matches = content.match(pattern) // Use original content (not lowercased) for Khmer
    if (matches) {
      matches.forEach(match => keywords.add(match))
    }
  })
  
  return Array.from(keywords).slice(0, 15) // Increased to 15 to accommodate bilingual keywords
}