import { chromium, Browser, Page } from 'playwright'
import fs from 'fs'
import path from 'path'

export interface HistoricalMap {
  period: string
  title: string
  imageUrl: string
  source: string
  attribution: string
  localPath?: string
}

export class MapScraper {
  private browser: Browser | null = null

  async init() {
    if (!this.browser) {
      this.browser = await chromium.launch({ 
        headless: true,
        args: ['--no-sandbox', '--disable-setuid-sandbox']
      })
    }
  }

  async close() {
    if (this.browser) {
      await this.browser.close()
      this.browser = null
    }
  }

  private async createPage(): Promise<Page> {
    if (!this.browser) await this.init()
    
    const context = await this.browser!.newContext({
      userAgent: 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36'
    })
    
    const page = await context.newPage()
    return page
  }

  // Scrape Khmer Empire map from Wikipedia Commons
  async scrapeKhmerEmpireMap(): Promise<HistoricalMap> {
    const page = await this.createPage()
    
    try {
      // Navigate to Khmer Empire Wikipedia page
      await page.goto('https://en.wikipedia.org/wiki/Khmer_Empire', { waitUntil: 'networkidle' })
      
      // Look for historical map images
      const mapSelector = 'img[alt*="Khmer Empire"], img[alt*="Angkor"], .infobox img'
      await page.waitForSelector(mapSelector, { timeout: 10000 })
      
      // Get the best map image
      const mapData = await page.evaluate(() => {
        const images = document.querySelectorAll('img[alt*="Khmer Empire"], img[alt*="Angkor"], .infobox img')
        for (const img of images) {
          const alt = (img as HTMLImageElement).alt.toLowerCase()
          if (alt.includes('empire') || alt.includes('territory') || alt.includes('extent')) {
            return {
              src: (img as HTMLImageElement).src,
              alt: (img as HTMLImageElement).alt
            }
          }
        }
        return null
      })

      if (!mapData) {
        throw new Error('No suitable Khmer Empire map found')
      }

      return {
        period: 'Ancient Times - 1431',
        title: 'Khmer Empire at Peak',
        imageUrl: mapData.src,
        source: 'Wikipedia Commons',
        attribution: 'Wikimedia Commons - Khmer Empire territorial extent'
      }
    } finally {
      await page.context().close()
    }
  }

  // Scrape French Indochina map
  async scrapeFrenchProtectorateMap(): Promise<HistoricalMap> {
    const page = await this.createPage()
    
    try {
      // Try multiple sources for French Indochina maps
      const sources = [
        'https://en.wikipedia.org/wiki/French_Indochina',
        'https://en.wikipedia.org/wiki/French_protectorate_of_Cambodia',
        'https://en.wikipedia.org/wiki/History_of_Cambodia'
      ]

      for (const url of sources) {
        try {
          await page.goto(url, { waitUntil: 'networkidle', timeout: 15000 })
          
          const mapData = await page.evaluate(() => {
            const images = document.querySelectorAll('img')
            for (const img of images) {
              const alt = (img as HTMLImageElement).alt.toLowerCase()
              const src = (img as HTMLImageElement).src
              if ((alt.includes('indochina') || alt.includes('french') || alt.includes('protectorate') || alt.includes('cambodia')) && 
                  (alt.includes('map') || src.includes('map') || alt.includes('territory') || alt.includes('colonial'))) {
                return {
                  src: (img as HTMLImageElement).src,
                  alt: (img as HTMLImageElement).alt
                }
              }
            }
            // If no specific match, get any map from infobox
            const infoboxImages = document.querySelectorAll('.infobox img, .thumb img')
            for (const img of infoboxImages) {
              const src = (img as HTMLImageElement).src
              if (src.includes('map') || src.includes('Map')) {
                return {
                  src: (img as HTMLImageElement).src,
                  alt: (img as HTMLImageElement).alt || 'Historical map'
                }
              }
            }
            return null
          })

          if (mapData) {
            return {
              period: '1863-1904',
              title: 'French Protectorate Period',
              imageUrl: mapData.src,
              source: 'Wikipedia Commons',
              attribution: 'Wikimedia Commons - French protectorate period'
            }
          }
        } catch (error) {
          console.log(`Failed to scrape ${url}, trying next source...`)
          continue
        }
      }

      throw new Error('No suitable French Protectorate map found in any source')
    } finally {
      await page.context().close()
    }
  }

  // Scrape Southeast Asian historical atlas
  async scrapeSiameseExpansionMap(): Promise<HistoricalMap> {
    const page = await this.createPage()
    
    try {
      // Try multiple sources for Siamese expansion maps
      const sources = [
        'https://en.wikipedia.org/wiki/Kingdom_of_Siam',
        'https://en.wikipedia.org/wiki/Ayutthaya_Kingdom',
        'https://en.wikipedia.org/wiki/History_of_Thailand'
      ]

      for (const url of sources) {
        try {
          await page.goto(url, { waitUntil: 'networkidle', timeout: 15000 })
          
          const mapData = await page.evaluate(() => {
            const images = document.querySelectorAll('img')
            for (const img of images) {
              const alt = (img as HTMLImageElement).alt.toLowerCase()
              const src = (img as HTMLImageElement).src
              if ((alt.includes('siam') || alt.includes('ayutthaya') || alt.includes('thai')) && 
                  (alt.includes('map') || alt.includes('territory') || alt.includes('expansion'))) {
                return {
                  src: (img as HTMLImageElement).src,
                  alt: (img as HTMLImageElement).alt
                }
              }
            }
            return null
          })

          if (mapData) {
            return {
              period: '1431-1863',
              title: 'Siamese Expansion Period',
              imageUrl: mapData.src,
              source: 'Wikipedia Commons',
              attribution: 'Wikimedia Commons - Kingdom of Siam territorial expansion'
            }
          }
        } catch (error) {
          console.log(`Failed to scrape ${url}, trying next source...`)
          continue
        }
      }

      throw new Error('No suitable Siamese expansion map found in any source')
    } finally {
      await page.context().close()
    }
  }

  // Scrape modern border dispute maps with detailed conflict area
  async scrapeModernBorderMap(): Promise<HistoricalMap> {
    const page = await this.createPage()
    
    try {
      // Try multiple sources for detailed border maps
      const sources = [
        'https://en.wikipedia.org/wiki/Preah_Vihear_Temple',
        'https://en.wikipedia.org/wiki/Cambodia%E2%80%93Thailand_border_dispute',
        'https://en.wikipedia.org/wiki/2008_Cambodian%E2%80%93Thai_stand-off'
      ]

      for (const url of sources) {
        try {
          await page.goto(url, { waitUntil: 'networkidle', timeout: 15000 })
          
          const mapData = await page.evaluate(() => {
            const images = document.querySelectorAll('img')
            // Look for specific conflict zone or location maps
            for (const img of images) {
              const alt = (img as HTMLImageElement).alt.toLowerCase()
              const src = (img as HTMLImageElement).src
              if ((alt.includes('preah vihear') || alt.includes('location') || alt.includes('conflict') || alt.includes('stand-off')) && 
                  (alt.includes('map') || src.includes('map'))) {
                return {
                  src: (img as HTMLImageElement).src,
                  alt: (img as HTMLImageElement).alt
                }
              }
            }
            // Look for any topographic or satellite imagery of the area
            for (const img of images) {
              const src = (img as HTMLImageElement).src
              if (src.includes('Preah_Vihear') && (src.includes('map') || src.includes('satellite'))) {
                return {
                  src: (img as HTMLImageElement).src,
                  alt: (img as HTMLImageElement).alt || 'Preah Vihear area map'
                }
              }
            }
            return null
          })

          if (mapData) {
            return {
              period: '2008-2013',
              title: 'Modern Border Dispute - Preah Vihear Area',
              imageUrl: mapData.src,
              source: 'Wikipedia Commons',
              attribution: 'Wikimedia Commons - Preah Vihear Temple dispute area'
            }
          }
        } catch (error) {
          console.log(`Failed to scrape ${url}, trying next source...`)
          continue
        }
      }

      // Fallback to specific Preah Vihear area map
      return {
        period: '2008-2013',
        title: 'Modern Border Dispute - Preah Vihear Area',
        imageUrl: 'https://upload.wikimedia.org/wikipedia/commons/thumb/c/c5/Preah_Vihear_Temple_location.png/300px-Preah_Vihear_Temple_location.png',
        source: 'Wikipedia Commons',
        attribution: 'Wikimedia Commons - Preah Vihear Temple location and dispute area'
      }
    } finally {
      await page.context().close()
    }
  }

  // Download and cache map image locally
  async downloadAndCacheMap(map: HistoricalMap): Promise<string> {
    const page = await this.createPage()
    
    try {
      // Create maps directory if it doesn't exist
      const mapsDir = path.join(process.cwd(), 'public', 'maps')
      if (!fs.existsSync(mapsDir)) {
        fs.mkdirSync(mapsDir, { recursive: true })
      }

      // Generate filename from period and title
      const filename = `${map.period.replace(/[^a-zA-Z0-9]/g, '_')}_map.jpg`
      const localPath = path.join(mapsDir, filename)

      // Check if file already exists
      if (fs.existsSync(localPath)) {
        return `/maps/${filename}`
      }

      // Navigate to image URL and download
      const response = await page.goto(map.imageUrl, { waitUntil: 'networkidle' })
      
      if (!response) {
        throw new Error('Failed to load image')
      }

      const buffer = await response.body()
      fs.writeFileSync(localPath, buffer)

      console.log(`✅ Downloaded map: ${filename}`)
      return `/maps/${filename}`
    } finally {
      await page.context().close()
    }
  }

  // Scrape Border Treaty period map (1904-1907)
  async scrapeBorderTreatyMap(): Promise<HistoricalMap> {
    const page = await this.createPage()
    
    try {
      await page.goto('https://en.wikipedia.org/wiki/Preah_Vihear_Temple', { waitUntil: 'networkidle' })
      
      const mapData = await page.evaluate(() => {
        const images = document.querySelectorAll('img')
        for (const img of images) {
          const alt = (img as HTMLImageElement).alt.toLowerCase()
          const src = (img as HTMLImageElement).src
          if ((alt.includes('preah vihear') || alt.includes('temple') || alt.includes('border')) && 
              (alt.includes('map') || src.includes('map'))) {
            return {
              src: (img as HTMLImageElement).src,
              alt: (img as HTMLImageElement).alt
            }
          }
        }
        // Fallback to any temple or location map
        const infoboxImages = document.querySelectorAll('.infobox img, .thumb img')
        for (const img of infoboxImages) {
          const src = (img as HTMLImageElement).src
          if (src.includes('Cambodia') || src.includes('Temple')) {
            return {
              src: (img as HTMLImageElement).src,
              alt: (img as HTMLImageElement).alt || 'Border treaty period map'
            }
          }
        }
        return null
      })

      if (!mapData) {
        throw new Error('No suitable Border Treaty map found')
      }

      return {
        period: '1904-1907',
        title: 'Border Treaties and Mapping',
        imageUrl: mapData.src,
        source: 'Wikipedia Commons',
        attribution: 'Wikimedia Commons - Border demarcation period'
      }
    } finally {
      await page.context().close()
    }
  }

  // Scrape ICJ period map (1954-1962)
  async scrapeICJCaseMap(): Promise<HistoricalMap> {
    const page = await this.createPage()
    
    try {
      await page.goto('https://en.wikipedia.org/wiki/Temple_of_Preah_Vihear_case', { waitUntil: 'networkidle' })
      
      const mapData = await page.evaluate(() => {
        const images = document.querySelectorAll('img')
        for (const img of images) {
          const alt = (img as HTMLImageElement).alt.toLowerCase()
          const src = (img as HTMLImageElement).src
          if ((alt.includes('cambodia') || alt.includes('thailand') || alt.includes('border')) && 
              (alt.includes('map') || src.includes('map'))) {
            return {
              src: (img as HTMLImageElement).src,
              alt: (img as HTMLImageElement).alt
            }
          }
        }
        return null
      })

      if (!mapData) {
        // Fallback to general Southeast Asia map
        return {
          period: '1954-1962',
          title: 'ICJ Case Period',
          imageUrl: 'https://upload.wikimedia.org/wikipedia/commons/thumb/f/fb/Cambodia_adm_location_map.svg/250px-Cambodia_adm_location_map.svg.png',
          source: 'Wikipedia Commons',
          attribution: 'Wikimedia Commons - ICJ case period'
        }
      }

      return {
        period: '1954-1962',
        title: 'ICJ Case Period',
        imageUrl: mapData.src,
        source: 'Wikipedia Commons',
        attribution: 'Wikimedia Commons - ICJ case period'
      }
    } finally {
      await page.context().close()
    }
  }

  // Scrape WWII period map (1941-1946)
  async scrapeWWIIMap(): Promise<HistoricalMap> {
    const page = await this.createPage()
    
    try {
      await page.goto('https://en.wikipedia.org/wiki/Franco-Thai_War', { waitUntil: 'networkidle' })
      
      const mapData = await page.evaluate(() => {
        const images = document.querySelectorAll('img')
        for (const img of images) {
          const alt = (img as HTMLImageElement).alt.toLowerCase()
          const src = (img as HTMLImageElement).src
          if ((alt.includes('thai') || alt.includes('franco') || alt.includes('war')) && 
              (alt.includes('map') || src.includes('map'))) {
            return {
              src: (img as HTMLImageElement).src,
              alt: (img as HTMLImageElement).alt
            }
          }
        }
        // Fallback to Southeast Asia map
        return {
          src: 'https://upload.wikimedia.org/wikipedia/commons/thumb/0/0b/Map-of-southeast-asia_900_CE.svg/330px-Map-of-southeast-asia_900_CE.svg.png',
          alt: 'WWII Southeast Asia'
        }
      })

      return {
        period: '1941-1946',
        title: 'WWII Territorial Changes',
        imageUrl: mapData.src,
        source: 'Wikipedia Commons',
        attribution: 'Wikimedia Commons - Franco-Thai War period'
      }
    } finally {
      await page.context().close()
    }
  }

  // Scrape Civil War period map (1963-1997)
  async scrapeCivilWarMap(): Promise<HistoricalMap> {
    const page = await this.createPage()
    
    try {
      await page.goto('https://en.wikipedia.org/wiki/Cambodian_Civil_War', { waitUntil: 'networkidle' })
      
      const mapData = await page.evaluate(() => {
        const images = document.querySelectorAll('img')
        for (const img of images) {
          const alt = (img as HTMLImageElement).alt.toLowerCase()
          const src = (img as HTMLImageElement).src
          if ((alt.includes('cambodia') || alt.includes('civil') || alt.includes('war')) && 
              (alt.includes('map') || src.includes('map'))) {
            return {
              src: (img as HTMLImageElement).src,
              alt: (img as HTMLImageElement).alt
            }
          }
        }
        return {
          src: 'https://upload.wikimedia.org/wikipedia/commons/thumb/f/fb/Cambodia_adm_location_map.svg/250px-Cambodia_adm_location_map.svg.png',
          alt: 'Cambodia during civil war'
        }
      })

      return {
        period: '1963-1997',
        title: 'Civil War Period',
        imageUrl: mapData.src,
        source: 'Wikipedia Commons',
        attribution: 'Wikimedia Commons - Cambodian Civil War period'
      }
    } finally {
      await page.context().close()
    }
  }

  // Scrape Cooperation period map (1997-2008)
  async scrapeCooperationMap(): Promise<HistoricalMap> {
    const page = await this.createPage()
    
    try {
      return {
        period: '1997-2008',
        title: 'Border Commission Period',
        imageUrl: 'https://upload.wikimedia.org/wikipedia/commons/thumb/f/fb/Cambodia_adm_location_map.svg/250px-Cambodia_adm_location_map.svg.png',
        source: 'Wikipedia Commons',
        attribution: 'Wikimedia Commons - Modern Cambodia-Thailand border'
      }
    } finally {
      await page.context().close()
    }
  }

  // Scrape Current period map (2014-2024)
  async scrapeCurrentMap(): Promise<HistoricalMap> {
    return {
      period: '2014-2024',
      title: 'Current Border Status',
      imageUrl: 'https://upload.wikimedia.org/wikipedia/commons/thumb/f/fb/Cambodia_adm_location_map.svg/250px-Cambodia_adm_location_map.svg.png',
      source: 'Wikipedia Commons',
      attribution: 'Wikimedia Commons - Current Thailand-Cambodia border'
    }
  }

  // Scrape 2025 map - Current BBC conflict zone map
  async scrape2025Map(): Promise<HistoricalMap> {
    const page = await this.createPage()
    
    try {
      // Scrape the current BBC article about Thailand-Cambodia tensions
      console.log('📍 Scraping BBC current conflict map...')
      await page.goto('https://www.bbc.com/news/articles/c5yl9l60e3no', { waitUntil: 'networkidle', timeout: 20000 })
      
      const mapData = await page.evaluate(() => {
        const images = document.querySelectorAll('img')
        for (const img of images) {
          const alt = (img as HTMLImageElement).alt.toLowerCase()
          const src = (img as HTMLImageElement).src
          
          // Look for maps showing Thailand-Cambodia border or conflict zones
          if ((alt.includes('map') || alt.includes('cambodia') || alt.includes('thailand') || alt.includes('border')) && 
              (src.includes('map') || src.includes('cambodia') || src.includes('thailand'))) {
            return {
              src: (img as HTMLImageElement).src,
              alt: (img as HTMLImageElement).alt
            }
          }
        }
        
        // Look for any geographic visualization
        for (const img of images) {
          const src = (img as HTMLImageElement).src
          if (src.includes('ichef') && (src.includes('976') || src.includes('660'))) {
            // BBC article images are often in ichef format
            return {
              src: (img as HTMLImageElement).src,
              alt: (img as HTMLImageElement).alt || 'Thailand-Cambodia border conflict map'
            }
          }
        }
        
        return null
      })

      if (mapData) {
        return {
          period: '2025',
          title: 'Current Thailand-Cambodia Border Tensions',
          imageUrl: mapData.src,
          source: 'BBC News',
          attribution: 'BBC News - Current Thailand-Cambodia border conflict map'
        }
      }

      // Fallback to detailed border region map if BBC scraping fails
      console.log('BBC map not found, using fallback...')
      return {
        period: '2025',
        title: 'Current Conflict Zone - Thailand-Cambodia Border',
        imageUrl: 'https://upload.wikimedia.org/wikipedia/commons/thumb/8/8c/Preah_Vihear_area_map.png/400px-Preah_Vihear_area_map.png',
        source: 'Wikipedia Commons',
        attribution: 'Wikimedia Commons - Preah Vihear border dispute area'
      }
    } catch (error) {
      console.error('Failed to scrape BBC article:', error)
      // Fallback to detailed border region map
      return {
        period: '2025',
        title: 'Current Conflict Zone - Thailand-Cambodia Border',
        imageUrl: 'https://upload.wikimedia.org/wikipedia/commons/thumb/8/8c/Preah_Vihear_area_map.png/400px-Preah_Vihear_area_map.png',
        source: 'Wikipedia Commons',
        attribution: 'Wikimedia Commons - Preah Vihear border dispute area'
      }
    } finally {
      await page.context().close()
    }
  }

  // Scrape all historical maps
  async scrapeAllMaps(): Promise<HistoricalMap[]> {
    console.log('🗺️ Starting historical map scraping...')
    
    const maps: HistoricalMap[] = []
    const scrapers = [
      { name: 'Khmer Empire', scraper: () => this.scrapeKhmerEmpireMap() },
      { name: 'Siamese Expansion', scraper: () => this.scrapeSiameseExpansionMap() },
      { name: 'French Protectorate', scraper: () => this.scrapeFrenchProtectorateMap() },
      { name: 'Border Treaty', scraper: () => this.scrapeBorderTreatyMap() },
      { name: 'WWII Period', scraper: () => this.scrapeWWIIMap() },
      { name: 'ICJ Case', scraper: () => this.scrapeICJCaseMap() },
      { name: 'Civil War', scraper: () => this.scrapeCivilWarMap() },
      { name: 'Cooperation Period', scraper: () => this.scrapeCooperationMap() },
      { name: 'Modern Border', scraper: () => this.scrapeModernBorderMap() },
      { name: 'Current Period', scraper: () => this.scrapeCurrentMap() },
      { name: '2025 Conflict', scraper: () => this.scrape2025Map() }
    ]

    for (const { name, scraper } of scrapers) {
      try {
        console.log(`📍 Scraping ${name} map...`)
        const map = await scraper()
        
        // Download and cache the image
        const localPath = await this.downloadAndCacheMap(map)
        map.localPath = localPath
        
        maps.push(map)
        console.log(`✅ Successfully scraped ${name} map`)
        
        // Add delay between requests to be respectful
        await new Promise(resolve => setTimeout(resolve, 1500))
      } catch (error) {
        console.error(`❌ Failed to scrape ${name} map:`, error)
      }
    }

    return maps
  }
}

// Utility function to get cached map or scrape if needed
export async function getHistoricalMap(period: string): Promise<string | null> {
  try {
    // Check if we have a cached version
    const filename = `${period.replace(/[^a-zA-Z0-9]/g, '_')}_map.jpg`
    const localPath = path.join(process.cwd(), 'public', 'maps', filename)
    
    if (fs.existsSync(localPath)) {
      return `/maps/${filename}`
    }

    // If not cached, we could trigger scraping here
    // For now, return null to fall back to SVG
    return null
  } catch (error) {
    console.error('Error getting historical map:', error)
    return null
  }
}