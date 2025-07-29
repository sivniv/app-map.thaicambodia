// Comprehensive RSS feed sources for Thailand-Cambodia conflict monitoring
// Based on research of top news sources from both countries

export interface RSSSource {
  name: string
  url: string
  country: 'thailand' | 'cambodia' | 'international'
  language: 'th' | 'km' | 'en'
  category: 'general' | 'politics' | 'business' | 'international' | 'government'
  priority: 'high' | 'medium' | 'low'
  cloudflareProtected: boolean
  active: boolean
  website?: string
  rssUrl?: string
}

// Thailand News Sources
export const THAILAND_RSS_SOURCES: RSSSource[] = [
  // English Language - High Priority
  {
    name: 'Bangkok Post',
    url: 'https://www.bangkokpost.com/rss/data/news.xml',
    country: 'thailand',
    language: 'en',
    category: 'general',
    priority: 'high',
    cloudflareProtected: false,
    active: true
  },
  {
    name: 'The Nation Thailand',
    url: 'https://www.nationthailand.com/feeds/rss',
    country: 'thailand',
    language: 'en',
    category: 'general',
    priority: 'high',
    cloudflareProtected: false,
    active: true
  },
  {
    name: 'Thai PBS World',
    url: 'https://www.thaipbsworld.com/feed/',
    country: 'thailand',
    language: 'en',
    category: 'general',
    priority: 'high',
    cloudflareProtected: false,
    active: true
  },
  {
    name: 'Khaosod English',
    url: 'https://www.khaosodenglish.com/feed/',
    country: 'thailand',
    language: 'en',
    category: 'general',
    priority: 'high',
    cloudflareProtected: true,
    active: true
  },

  // Thai Language - Medium Priority
  {
    name: 'Thai Rath',
    url: 'https://www.thairath.co.th/rss/news.xml',
    country: 'thailand',
    language: 'th',
    category: 'general',
    priority: 'medium',
    cloudflareProtected: true,
    active: true
  },
  {
    name: 'Daily News Thailand',
    url: 'https://www.dailynews.co.th/feed/',
    country: 'thailand',
    language: 'th',
    category: 'general',
    priority: 'medium',
    cloudflareProtected: false,
    active: true
  },
  {
    name: 'Manager Online',
    url: 'https://mgronline.com/rss.xml',
    country: 'thailand',
    language: 'th',
    category: 'business',
    priority: 'medium',
    cloudflareProtected: false,
    active: true
  },

  // Government Sources - High Priority
  {
    name: 'Thai Government News',
    url: 'https://www.thaigov.go.th/news/feed',
    country: 'thailand',
    language: 'th',
    category: 'government',
    priority: 'high',
    cloudflareProtected: false,
    active: true
  },
  {
    name: 'Ministry of Foreign Affairs Thailand',
    url: 'https://www.mfa.go.th/en/content/rss',
    country: 'thailand',
    language: 'en',
    category: 'government',
    priority: 'high',
    cloudflareProtected: false,
    active: true
  }
]

// Cambodia News Sources
export const CAMBODIA_RSS_SOURCES: RSSSource[] = [
  // English Language - High Priority
  {
    name: 'The Phnom Penh Post',
    url: 'https://www.phnompenhpost.com/rss.xml',
    country: 'cambodia',
    language: 'en',
    category: 'general',
    priority: 'high',
    cloudflareProtected: false,
    active: true
  },
  {
    name: 'Khmer Times',
    url: 'https://www.khmertimeskh.com/feed/',
    country: 'cambodia',
    language: 'en',
    category: 'general',
    priority: 'high',
    cloudflareProtected: false,
    active: true
  },
  {
    name: 'Cambodia Daily',
    url: 'https://english.cambodiadaily.com/feed/',
    country: 'cambodia',
    language: 'en',
    category: 'general',
    priority: 'high',
    cloudflareProtected: true,
    active: true
  },

  // Khmer Language - High Priority
  {
    name: 'Koh Santepheap Daily',
    url: 'https://kohsantepheapdaily.com.kh/feed/',
    country: 'cambodia',
    language: 'km',
    category: 'general',
    priority: 'high',
    cloudflareProtected: false,
    active: true
  },
  {
    name: 'Kampuchea Thmey',
    url: 'https://kampucheathmey.com/feed/',
    country: 'cambodia',
    language: 'km',
    category: 'general',
    priority: 'high',
    cloudflareProtected: false,
    active: true
  },
  {
    name: 'CEN (Cambodia Express News)',
    url: 'https://cen.com.kh/feed/',
    country: 'cambodia',
    language: 'km',
    category: 'general',
    priority: 'high',
    cloudflareProtected: false,
    active: true
  },
  {
    name: 'Thmey Thmey News',
    url: 'https://thmeythmey.com/feed/',
    country: 'cambodia',
    language: 'km',
    category: 'general',
    priority: 'medium',
    cloudflareProtected: false,
    active: true
  },

  // Government & Official Sources
  {
    name: 'Royal Government of Cambodia',
    url: 'https://www.gov.kh/feed/',
    country: 'cambodia',
    language: 'km',
    category: 'government',
    priority: 'high',
    cloudflareProtected: false,
    active: true
  },
  {
    name: 'Ministry of Foreign Affairs Cambodia',
    url: 'https://www.mfaic.gov.kh/feed/',
    country: 'cambodia',
    language: 'en',
    category: 'government',
    priority: 'high',
    cloudflareProtected: false,
    active: true
  },

  // International Coverage of Cambodia
  {
    name: 'VOA Khmer',
    url: 'https://khmer.voanews.com/api/epiqq',
    country: 'cambodia',
    language: 'km',
    category: 'international',
    priority: 'high',
    cloudflareProtected: false,
    active: true
  },
  {
    name: 'RFA Khmer',
    url: 'https://www.rfa.org/khmer/rss.xml',
    country: 'cambodia',
    language: 'km',
    category: 'international',
    priority: 'high',
    cloudflareProtected: false,
    active: true
  }
]

// International News Sources with Thailand-Cambodia Coverage
export const INTERNATIONAL_RSS_SOURCES: RSSSource[] = [
  {
    name: 'Reuters Southeast Asia',
    url: 'https://feeds.reuters.com/reuters/worldNews',
    country: 'international',
    language: 'en',
    category: 'international',
    priority: 'high',
    cloudflareProtected: false,
    active: true
  },
  {
    name: 'BBC Asia',
    url: 'http://feeds.bbci.co.uk/news/world/asia/rss.xml',
    country: 'international',
    language: 'en',
    category: 'international',
    priority: 'high',
    cloudflareProtected: false,
    active: true
  },
  {
    name: 'Channel News Asia',
    url: 'https://www.channelnewsasia.com/api/v1/rss-outbound-feed?_format=xml',
    country: 'international',
    language: 'en',
    category: 'international',
    priority: 'high',
    cloudflareProtected: true,
    active: true
  },
  {
    name: 'Associated Press Asia',
    url: 'https://feeds.apnews.com/apnews/TopNews',
    country: 'international',
    language: 'en',
    category: 'international',
    priority: 'high',
    cloudflareProtected: false,
    active: true
  },
  {
    name: 'Al Jazeera Asia Pacific',
    url: 'https://www.aljazeera.com/xml/rss/all.xml',
    country: 'international',
    language: 'en',
    category: 'international',
    priority: 'medium',
    cloudflareProtected: true,
    active: true
  },
  {
    name: 'South China Morning Post Asia',
    url: 'https://www.scmp.com/rss/4/feed',
    country: 'international',
    language: 'en',
    category: 'international',
    priority: 'medium',
    cloudflareProtected: true,
    active: true
  },
  {
    name: 'Nikkei Asia',
    url: 'https://asia.nikkei.com/rss',
    country: 'international',
    language: 'en',
    category: 'business',
    priority: 'medium',
    cloudflareProtected: true,
    active: true
  }
]

// Combined sources array
export const ALL_RSS_SOURCES: RSSSource[] = [
  ...THAILAND_RSS_SOURCES,
  ...CAMBODIA_RSS_SOURCES,
  ...INTERNATIONAL_RSS_SOURCES
]

// Helper functions
export function getActiveRSSSources(): RSSSource[] {
  return ALL_RSS_SOURCES.filter(source => source.active)
}

export function getCloudflareProtectedSources(): RSSSource[] {
  return ALL_RSS_SOURCES.filter(source => source.cloudflareProtected && source.active)
}

export function getSourcesByCountry(country: 'thailand' | 'cambodia' | 'international'): RSSSource[] {
  return ALL_RSS_SOURCES.filter(source => source.country === country && source.active)
}

export function getSourcesByPriority(priority: 'high' | 'medium' | 'low'): RSSSource[] {
  return ALL_RSS_SOURCES.filter(source => source.priority === priority && source.active)
}

export function getGovernmentSources(): RSSSource[] {
  return ALL_RSS_SOURCES.filter(source => source.category === 'government' && source.active)
}