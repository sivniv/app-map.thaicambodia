import axios from 'axios'
import Parser from 'rss-parser'
import * as cheerio from 'cheerio'
import { NewsArticle } from '@/types'

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

  async fetchFromRSS(feedUrl: string): Promise<NewsArticle[]> {
    try {
      const feed = await parser.parseURL(feedUrl)
      
      return feed.items.map(item => ({
        title: item.title || '',
        description: item.contentSnippet || item.summary || '',
        content: item.content || item.contentSnippet || '',
        url: item.link || '',
        publishedAt: item.pubDate || new Date().toISOString(),
        source: {
          name: feed.title || 'RSS Feed',
          url: feed.link || feedUrl,
        },
        author: item.creator || item.author,
      }))
    } catch (error) {
      console.error('Error fetching RSS feed:', error)
      return []
    }
  }

  async scrapeArticleContent(url: string): Promise<string> {
    try {
      const response = await axios.get(url, {
        timeout: 10000,
        headers: {
          'User-Agent': 'Mozilla/5.0 (compatible; NewsMonitor/1.0)',
        },
      })

      const $ = cheerio.load(response.data)
      
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
      console.error('Error scraping article content:', error)
      return ''
    }
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