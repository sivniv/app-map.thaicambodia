import axios from 'axios'
import { FacebookPost } from '@/types'

const RAPIDAPI_BASE = 'https://facebook-scraper3.p.rapidapi.com'

export class FacebookMonitor {
  private rapidApiKey: string
  private rapidApiHost: string
  private maxRetries: number = 3
  private retryDelay: number = 1000 // 1 second base delay

  constructor(rapidApiKey: string, rapidApiHost: string) {
    this.rapidApiKey = rapidApiKey
    this.rapidApiHost = rapidApiHost
  }

  async searchPosts(query: string, limit: number = 25): Promise<FacebookPost[]> {
    return this.retryRequest(async () => {
      const response = await axios.get(`${RAPIDAPI_BASE}/search/posts`, {
        params: {
          query,
          limit,
        },
        headers: {
          'x-rapidapi-key': this.rapidApiKey,
          'x-rapidapi-host': this.rapidApiHost,
        },
        timeout: 15000, // 15 second timeout
      })

      const posts = response.data.results || response.data.data || response.data || []
      return posts.map((post: any) => this.transformRapidApiSearchPost(post))
    }, `searchPosts(${query})`)
  }

  // Keep the old method for backwards compatibility but mark as deprecated
  async getPagePosts(pageId: string, limit: number = 25): Promise<FacebookPost[]> {
    console.warn('⚠️ getPagePosts is deprecated - page/posts endpoint not working. Use searchPosts instead.')
    return []
  }

  // New method specifically for official government pages
  async getOfficialPagePosts(pageId: string, limit: number = 3): Promise<FacebookPost[]> {
    try {
      // Try direct page/posts endpoint first
      const directPosts = await this.tryDirectPagePosts(pageId, limit)
      if (directPosts.length > 0) {
        console.log(`✅ Successfully got ${directPosts.length} posts via direct method for page ${pageId}`)
        return directPosts.slice(0, limit)
      }

      // Fallback to page-specific search using known page names
      const page = ALL_MONITORED_PAGES.find(p => p.id === pageId)
      if (page) {
        console.log(`🔄 Falling back to search method for ${page.name}`)
        const searchPosts = await this.searchPageSpecificPosts(page, limit)
        return searchPosts.slice(0, limit)
      }

      console.warn(`⚠️ No posts found for page ${pageId}`)
      return []
    } catch (error) {
      console.error(`Error getting official page posts for ${pageId}:`, error)
      return []
    }
  }

  private async tryDirectPagePosts(pageId: string, limit: number): Promise<FacebookPost[]> {
    try {
      return await this.retryRequest(async () => {
        const response = await axios.get(`${RAPIDAPI_BASE}/page/posts`, {
          params: {
            page_id: pageId,
            limit,
          },
          headers: {
            'x-rapidapi-key': this.rapidApiKey,
            'x-rapidapi-host': this.rapidApiHost,
          },
          timeout: 15000,
        })

        const posts = response.data.results || response.data.data || response.data || []
        return posts.map((post: any) => this.transformRapidApiPost(post))
      }, `tryDirectPagePosts(${pageId})`)
    } catch (error) {
      console.log(`Direct page posts failed for ${pageId}, will try search fallback`)
      return []
    }
  }

  private async searchPageSpecificPosts(page: any, limit: number): Promise<FacebookPost[]> {
    try {
      // Search using page name and username
      const searchQueries = [
        page.name,
        page.username,
        `${page.name} official`,
        `${page.name} government`
      ]

      for (const query of searchQueries) {
        try {
          const posts = await this.searchPosts(query, limit * 2) // Get more to filter
          
          // Filter posts that are likely from this specific page
          const filteredPosts = posts.filter(post => {
            const fromName = post.from.name.toLowerCase()
            const pageName = page.name.toLowerCase()
            const username = page.username.toLowerCase()
            
            return (
              fromName.includes(pageName.split(' ')[0]) || // Match first word of page name
              fromName.includes(username) ||
              post.from.id === page.id ||
              (post.permalink_url && post.permalink_url.includes(username))
            )
          })

          if (filteredPosts.length > 0) {
            console.log(`✅ Found ${filteredPosts.length} posts for ${page.name} via search "${query}"`)
            return filteredPosts.slice(0, limit)
          }
        } catch (error) {
          console.log(`Search query "${query}" failed for ${page.name}`)
          continue
        }
      }

      return []
    } catch (error) {
      console.error(`Error in searchPageSpecificPosts for ${page.name}:`, error)
      return []
    }
  }

  async getPageVideos(pageId: string, limit: number = 10): Promise<any[]> {
    try {
      return await this.retryRequest(async () => {
        const response = await axios.get(`${RAPIDAPI_BASE}/page/videos`, {
          params: {
            page_id: pageId,
            limit,
          },
          headers: {
            'x-rapidapi-key': this.rapidApiKey,
            'x-rapidapi-host': this.rapidApiHost,
          },
          timeout: 15000,
        })

        return response.data.results || response.data.data || response.data || []
      }, `getPageVideos(${pageId})`)
    } catch (error) {
      console.error('Error fetching Facebook videos from RapidAPI:', error)
      return []
    }
  }

  private async retryRequest<T>(
    request: () => Promise<T>,
    operation: string,
    attempt: number = 1
  ): Promise<T> {
    try {
      return await request()
    } catch (error: any) {
      console.error(`${operation} failed (attempt ${attempt}):`, error.message)

      if (attempt >= this.maxRetries) {
        console.error(`${operation} failed after ${this.maxRetries} attempts`)
        throw error
      }

      // Check if error is retryable
      const isRetryable = this.isRetryableError(error)
      if (!isRetryable) {
        console.error(`${operation} failed with non-retryable error:`, error.message)
        throw error
      }

      // Calculate delay with exponential backoff
      const delay = this.retryDelay * Math.pow(2, attempt - 1)
      console.log(`Retrying ${operation} in ${delay}ms...`)
      
      await this.sleep(delay)
      return this.retryRequest(request, operation, attempt + 1)
    }
  }

  private isRetryableError(error: any): boolean {
    // Retry on network errors, timeouts, and certain HTTP status codes
    if (error.code === 'ECONNRESET' || error.code === 'ETIMEDOUT') {
      return true
    }

    if (error.response?.status) {
      const status = error.response.status
      // Retry on 429 (rate limit), 500, 502, 503, 504
      return [429, 500, 502, 503, 504].includes(status)
    }

    return false
  }

  private sleep(ms: number): Promise<void> {
    return new Promise(resolve => setTimeout(resolve, ms))
  }

  private transformRapidApiSearchPost(searchPost: any): FacebookPost {
    // Transform search posts format to our FacebookPost interface
    return {
      id: searchPost.post_id || searchPost.id,
      message: searchPost.message || searchPost.text,
      story: undefined, // Search posts don't typically have story field
      created_time: searchPost.timestamp ? new Date(searchPost.timestamp * 1000).toISOString() : new Date().toISOString(),
      from: {
        id: searchPost.author?.id || 'unknown',
        name: searchPost.author?.name || 'Unknown User',
      },
      link: searchPost.external_url,
      permalink_url: searchPost.url,
      attachments: searchPost.image ? {
        data: [{
          type: 'photo',
          url: searchPost.image.uri,
          title: undefined,
          description: undefined,
        }]
      } : undefined,
    }
  }

  // Keep old method for any legacy code
  private transformRapidApiPost(rapidApiPost: any): FacebookPost {
    return {
      id: rapidApiPost.id || rapidApiPost.post_id,
      message: rapidApiPost.message || rapidApiPost.text || rapidApiPost.content,
      story: rapidApiPost.story,
      created_time: rapidApiPost.created_time || rapidApiPost.time || rapidApiPost.timestamp,
      from: {
        id: rapidApiPost.from?.id || rapidApiPost.author_id,
        name: rapidApiPost.from?.name || rapidApiPost.author_name || rapidApiPost.page_name,
      },
      link: rapidApiPost.link || rapidApiPost.external_link,
      permalink_url: rapidApiPost.permalink_url || rapidApiPost.url || rapidApiPost.post_url,
      attachments: rapidApiPost.attachments ? {
        data: rapidApiPost.attachments.map((att: any) => ({
          type: att.type,
          url: att.url,
          title: att.title,
          description: att.description,
        }))
      } : undefined,
    }
  }

  async testConnection(): Promise<boolean> {
    try {
      await this.retryRequest(async () => {
        // Test with a known public page (Facebook's own page)
        const response = await axios.get(`${RAPIDAPI_BASE}/page/posts`, {
          params: {
            page_id: '111975152184324', // Facebook page ID
            limit: 1,
          },
          headers: {
            'x-rapidapi-key': this.rapidApiKey,
            'x-rapidapi-host': this.rapidApiHost,
          },
          timeout: 10000,
        })

        if (response.status !== 200) {
          throw new Error(`HTTP ${response.status}`)
        }
        
        return response.data
      }, 'testConnection')

      return true
    } catch (error) {
      console.error('RapidAPI connection test failed:', error)
      return false
    }
  }
}

export const THAI_GOVERNMENT_PAGES = [
  {
    id: '139040889463495', // Royal Thai Government - will need to verify actual ID
    name: 'Royal Thai Government',
    url: 'https://www.facebook.com/ThaiGovt',
    username: 'ThaiGovt',
  },
  {
    id: '161207220571769', // Ministry of Foreign Affairs Thailand - will need to verify actual ID
    name: 'Ministry of Foreign Affairs Thailand',
    url: 'https://www.facebook.com/mfathailand',
    username: 'mfathailand',
  },
  {
    id: '142699589063706', // Prime Minister of Thailand - will need to verify actual ID
    name: 'Prime Minister of Thailand',
    url: 'https://www.facebook.com/ThaiPM',
    username: 'ThaiPM',
  },
]

export const CAMBODIAN_GOVERNMENT_PAGES = [
  {
    id: '183726738320894', // Royal Government of Cambodia - will need to verify actual ID
    name: 'Royal Government of Cambodia',
    url: 'https://www.facebook.com/RoyalGovernmentofCambodia',
    username: 'RoyalGovernmentofCambodia',
  },
  {
    id: '157803177577987', // Ministry of Foreign Affairs Cambodia - will need to verify actual ID
    name: 'Ministry of Foreign Affairs Cambodia',
    url: 'https://www.facebook.com/MFACambodia',
    username: 'MFACambodia',
  },
  {
    id: '111975152184324', // Samdech Hun Sen of Cambodia - official page
    name: 'Samdech Hun Sen of Cambodia',
    url: 'https://www.facebook.com/profile.php?id=111975152184324',
    username: '111975152184324',
  },
  {
    id: '2538115383099051', // Cambodia Government Spokesperson Unit
    name: 'Cambodia Government Spokesperson Unit',
    url: 'https://www.facebook.com/profile.php?id=2538115383099051',
    username: '2538115383099051',
  },
]

export const ALL_MONITORED_PAGES = [
  ...THAI_GOVERNMENT_PAGES,
  ...CAMBODIAN_GOVERNMENT_PAGES,
]

// Search queries for Facebook posts related to Thailand-Cambodia relations
export const FACEBOOK_SEARCH_QUERIES = [
  // Government and diplomatic terms
  'Thailand Cambodia government',
  'Thai Cambodia diplomatic',
  'Thailand Cambodia border',
  'Hun Sen Thailand',
  'Prayuth Cambodia',
  'Thailand Cambodia conflict',
  'Thai Cambodia dispute',
  
  // Specific locations and issues
  'Preah Vihear Thailand',
  'Thailand Cambodia temple',
  'Thailand Cambodia trade',
  'Thai Cambodia cooperation',
  'Thailand Cambodia agreement',
  
  // Key Thai terms
  'รัฐบาลไทย กัมพูชา',
  'ไทย กัมพูชา ข้อพิพาท',
  'ไทย กัมพูชา พรมแดน',
  
  // Key Khmer terms (if available)
  'កម្ពុជា ថៃ',
  'រាជរដ្ឋាភិបាល កម្ពុជា ថៃ',
]

export function isConflictRelated(content: string): boolean {
  const keywords = [
    'border', 'dispute', 'territory', 'conflict', 'tension',
    'diplomatic', 'embassy', 'ambassador', 'foreign minister',
    'trade', 'economic', 'cooperation', 'agreement',
    'preah vihear', 'temple', 'maritime', 'fishing',
    'cambodia', 'thailand', 'thai', 'khmer', 'siem reap',
    'aranyaprathet', 'poipet', 'border crossing'
  ]

  const lowerContent = content.toLowerCase()
  return keywords.some(keyword => lowerContent.includes(keyword))
}

export function extractPostContent(post: FacebookPost): string {
  const message = post.message || ''
  const story = post.story || ''
  
  let content = message
  if (story && !message) {
    content = story
  } else if (story && message) {
    content = `${message}\n\n${story}`
  }

  if (post.attachments?.data) {
    const attachmentTexts = post.attachments.data
      .filter(att => att.title || att.description)
      .map(att => `${att.title || ''} ${att.description || ''}`.trim())
      .join('\n')
    
    if (attachmentTexts) {
      content += `\n\n${attachmentTexts}`
    }
  }

  return content.trim()
}