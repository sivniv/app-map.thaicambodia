import { addExtra } from 'playwright-extra'
import { chromium } from 'playwright'
import StealthPlugin from 'puppeteer-extra-plugin-stealth'
import RecaptchaPlugin from 'puppeteer-extra-plugin-recaptcha'

// Add stealth plugin to playwright
const playwrightStealth = addExtra(chromium)
playwrightStealth.use(StealthPlugin())
playwrightStealth.use(RecaptchaPlugin({
  provider: {
    id: '2captcha',
    token: process.env.TWOCAPTCHA_TOKEN || ''
  }
}))

export interface ScrapingConfig {
  url: string
  waitForSelector?: string
  timeout?: number
  userAgent?: string
  viewport?: { width: number; height: number }
  locale?: string
  timezone?: string
  proxy?: {
    server: string
    username?: string
    password?: string
  }
}

export interface ScrapingResult {
  success: boolean
  content?: string
  title?: string
  error?: string
  cloudflareDetected?: boolean
  captchaSolved?: boolean
  responseStatus?: number
}

class CloudflareScraper {
  private static instance: CloudflareScraper
  private browser: any = null
  private userAgents = [
    'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
    'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
    'Mozilla/5.0 (Windows NT 10.0; Win64; x64; rv:121.0) Gecko/20100101 Firefox/121.0',
    'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/17.1 Safari/605.1.15'
  ]

  static getInstance(): CloudflareScraper {
    if (!CloudflareScraper.instance) {
      CloudflareScraper.instance = new CloudflareScraper()
    }
    return CloudflareScraper.instance
  }

  private getRandomUserAgent(): string {
    return this.userAgents[Math.floor(Math.random() * this.userAgents.length)]
  }

  private getRandomViewport() {
    const viewports = [
      { width: 1920, height: 1080 },
      { width: 1366, height: 768 },
      { width: 1536, height: 864 },
      { width: 1440, height: 900 }
    ]
    return viewports[Math.floor(Math.random() * viewports.length)]
  }

  private async initBrowser(config: ScrapingConfig) {
    if (this.browser) {
      try {
        // Test if browser is still connected
        await this.browser.version()
      } catch (error) {
        this.browser = null
      }
    }

    if (!this.browser) {
      const launchOptions: any = {
        headless: true,
        args: [
          '--no-sandbox',
          '--disable-setuid-sandbox',
          '--disable-dev-shm-usage',
          '--disable-accelerated-2d-canvas',
          '--no-first-run',
          '--no-zygote',
          '--disable-gpu',
          '--disable-web-security',
          '--disable-features=VizDisplayCompositor',
          '--disable-background-timer-throttling',
          '--disable-backgrounding-occluded-windows',
          '--disable-renderer-backgrounding',
          '--disable-field-trial-config',
          '--disable-back-forward-cache',
          '--disable-backgrounding-occluded-windows',
          '--disable-features=TranslateUI',
          '--disable-ipc-flooding-protection',
          '--enable-features=NetworkService,NetworkServiceInProcess',
          '--force-color-profile=srgb',
          '--metrics-recording-only',
          '--use-mock-keychain'
        ]
      }

      // Add proxy if provided
      if (config.proxy) {
        launchOptions.proxy = config.proxy
      }

      this.browser = await playwrightStealth.launch(launchOptions)
    }

    return this.browser
  }

  async scrape(config: ScrapingConfig): Promise<ScrapingResult> {
    let context = null
    let page = null

    try {
      const browser = await this.initBrowser(config)
      
      // Create new context with randomized settings
      const viewport = config.viewport || this.getRandomViewport()
      const userAgent = config.userAgent || this.getRandomUserAgent()

      context = await browser.newContext({
        userAgent,
        viewport,
        locale: config.locale || 'en-US',
        timezoneId: config.timezone || 'America/New_York',
        permissions: [],
        extraHTTPHeaders: {
          'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,*/*;q=0.8',
          'Accept-Language': 'en-US,en;q=0.5',
          'Accept-Encoding': 'gzip, deflate, br',
          'DNT': '1',
          'Connection': 'keep-alive',
          'Upgrade-Insecure-Requests': '1',
          'Sec-Fetch-Dest': 'document',
          'Sec-Fetch-Mode': 'navigate',
          'Sec-Fetch-Site': 'none',
          'Cache-Control': 'max-age=0'
        }
      })

      page = await context.newPage()

      // Add additional stealth measures
      await page.addInitScript(() => {
        // Remove webdriver traces
        Object.defineProperty(navigator, 'webdriver', {
          get: () => undefined,
        })

        // Mock plugins
        Object.defineProperty(navigator, 'plugins', {
          get: () => [1, 2, 3, 4, 5]
        })

        // Mock languages
        Object.defineProperty(navigator, 'languages', {
          get: () => ['en-US', 'en']
        })

        // Mock permissions
        const originalQuery = window.navigator.permissions.query
        window.navigator.permissions.query = (parameters: any) => (
          parameters.name === 'notifications' ?
            Promise.resolve({ state: 'granted' } as any) :
            originalQuery(parameters)
        )
      })

      console.log(`🌐 Attempting to scrape: ${config.url}`)
      
      // Navigate with timeout
      const response = await page.goto(config.url, {
        waitUntil: 'domcontentloaded',
        timeout: config.timeout || 30000
      })

      if (!response) {
        throw new Error('Failed to load page - no response')
      }

      // Check for Cloudflare challenge
      const cloudflareDetected = await this.detectCloudflare(page)
      let captchaSolved = false

      if (cloudflareDetected) {
        console.log('🛡️ Cloudflare protection detected, attempting to solve...')
        captchaSolved = await this.handleCloudflareChallenge(page, config.timeout || 30000)
        
        if (!captchaSolved) {
          return {
            success: false,
            error: 'Failed to bypass Cloudflare protection',
            cloudflareDetected: true,
            captchaSolved: false,
            responseStatus: response.status()
          }
        }
      }

      // Wait for specific selector if provided
      if (config.waitForSelector) {
        try {
          await page.waitForSelector(config.waitForSelector, { timeout: 10000 })
        } catch (error) {
          console.warn(`⚠️ Wait selector timeout: ${config.waitForSelector}`)
        }
      }

      // Extract content
      const title = await page.title().catch(() => '')
      const content = await page.content().catch(() => '')

      // Additional wait to ensure dynamic content loads
      await page.waitForTimeout(2000)

      return {
        success: true,
        content,
        title,
        cloudflareDetected,
        captchaSolved,
        responseStatus: response.status()
      }

    } catch (error) {
      console.error('❌ Scraping failed:', error)
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Unknown error',
        cloudflareDetected: false,
        captchaSolved: false
      }
    } finally {
      if (page) {
        try {
          await page.close()
        } catch (error) {
          console.warn('Failed to close page:', error)
        }
      }
      if (context) {
        try {
          await context.close()
        } catch (error) {
          console.warn('Failed to close context:', error)
        }
      }
    }
  }

  private async detectCloudflare(page: any): Promise<boolean> {
    try {
      // Check for common Cloudflare indicators
      const cloudflareIndicators = [
        'cf-browser-verification',
        'cf-im-under-attack',
        'cf-wrapper',
        'cloudflare',
        'Checking your browser before accessing'
      ]

      const pageContent = await page.content().catch(() => '')
      const pageTitle = await page.title().catch(() => '')
      
      // Check content for Cloudflare indicators
      for (const indicator of cloudflareIndicators) {
        if (pageContent.includes(indicator) || pageTitle.includes(indicator)) {
          return true
        }
      }

      // Check for specific Cloudflare elements
      const cfElements = await page.$$eval('*', (elements: Element[]) => {
        return elements.some(el => 
          el.id?.includes('cf-') || 
          el.className?.includes('cf-') ||
          el.className?.includes('cloudflare')
        )
      }).catch(() => false)

      return cfElements
    } catch (error) {
      console.warn('Error detecting Cloudflare:', error)
      return false
    }
  }

  private async handleCloudflareChallenge(page: any, timeout: number): Promise<boolean> {
    try {
      // Wait for challenge to complete automatically (JavaScript challenge)
      const maxWaitTime = Math.min(timeout / 1000, 30) // Max 30 seconds
      let waitTime = 0
      
      while (waitTime < maxWaitTime) {
        await page.waitForTimeout(1000)
        waitTime++
        
        // Check if we've passed the challenge
        const stillInChallenge = await this.detectCloudflare(page)
        if (!stillInChallenge) {
          console.log('✅ Cloudflare challenge solved automatically')
          return true
        }
        
        // Check for CAPTCHA
        const hasCaptcha = await page.$('iframe[src*="captcha"]').catch(() => null)
        if (hasCaptcha) {
          console.log('🔍 CAPTCHA detected, attempting to solve...')
          // The RecaptchaPlugin should handle this automatically
          await page.waitForTimeout(5000)
        }
      }

      // One final check
      const finalCheck = await this.detectCloudflare(page)
      return !finalCheck
      
    } catch (error) {
      console.error('Error handling Cloudflare challenge:', error)
      return false
    }
  }

  async close() {
    if (this.browser) {
      try {
        await this.browser.close()
        this.browser = null
      } catch (error) {
        console.warn('Error closing browser:', error)
      }
    }
  }

  // Static method for one-off scraping
  static async scrapeUrl(url: string, options: Partial<ScrapingConfig> = {}): Promise<ScrapingResult> {
    const scraper = CloudflareScraper.getInstance()
    return scraper.scrape({
      url,
      timeout: 30000,
      ...options
    })
  }
}

export default CloudflareScraper