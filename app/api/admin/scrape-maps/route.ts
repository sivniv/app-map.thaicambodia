import { NextRequest, NextResponse } from 'next/server'
import { MapScraper } from '@/lib/mapScraper'
import { prisma } from '@/lib/prisma'
import fs from 'fs'
import path from 'path'

export async function POST(request: NextRequest) {
  try {
    console.log('🗺️ Starting historical map scraping process...')
    
    // Log the start of scraping
    await prisma.monitoringLog.create({
      data: {
        sourceType: 'NEWS_ARTICLE',
        action: 'MAP_SCRAPING_STARTED',
        status: 'INFO',
        message: 'Historical map scraping process initiated',
        metadata: { timestamp: new Date().toISOString() }
      }
    })

    const scraper = new MapScraper()
    let scrapedMaps: any[] = []
    let errors: string[] = []

    try {
      await scraper.init()
      scrapedMaps = await scraper.scrapeAllMaps()
      
      console.log(`✅ Map scraping completed. Found ${scrapedMaps.length} maps`)
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Unknown scraping error'
      console.error('❌ Map scraping failed:', errorMessage)
      errors.push(errorMessage)
    } finally {
      await scraper.close()
    }

    // Log the completion
    await prisma.monitoringLog.create({
      data: {
        sourceType: 'NEWS_ARTICLE',
        action: 'MAP_SCRAPING_COMPLETED',
        status: errors.length > 0 ? 'WARNING' : 'SUCCESS',
        message: `Map scraping completed. ${scrapedMaps.length} maps downloaded, ${errors.length} errors`,
        metadata: { 
          mapsFound: scrapedMaps.length,
          errors: errors.length,
          maps: scrapedMaps.map(m => ({ period: m.period, source: m.source }))
        }
      }
    })

    return NextResponse.json({
      success: true,
      message: `Successfully scraped ${scrapedMaps.length} historical maps`,
      maps: scrapedMaps,
      errors: errors.length > 0 ? errors : undefined
    })

  } catch (error) {
    console.error('❌ Map scraping API error:', error)
    
    // Log the error
    await prisma.monitoringLog.create({
      data: {
        sourceType: 'NEWS_ARTICLE',
        action: 'MAP_SCRAPING_ERROR',
        status: 'ERROR',
        message: `Map scraping failed: ${error instanceof Error ? error.message : 'Unknown error'}`,
        metadata: { error: String(error) }
      }
    })

    return NextResponse.json(
      { 
        success: false, 
        error: 'Map scraping failed',
        details: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    )
  }
}

export async function GET(request: NextRequest) {
  try {
    // Return status of cached maps with original URLs
    
    const mapsDir = path.join(process.cwd(), 'public', 'maps')
    let cachedMaps: string[] = []
    
    if (fs.existsSync(mapsDir)) {
      const files = fs.readdirSync(mapsDir)
      cachedMaps = files.filter((file: string) => file.endsWith('.jpg') || file.endsWith('.png'))
    }

    // Map historical periods to their original image URLs (from our recent scraping)
    const mapUrls = {
      'Ancient_Times___1431_map.jpg': 'https://upload.wikimedia.org/wikipedia/commons/thumb/0/0b/Map-of-southeast-asia_900_CE.svg/330px-Map-of-southeast-asia_900_CE.svg.png',
      '1431_1863_map.jpg': 'https://upload.wikimedia.org/wikipedia/commons/thumb/e/e9/Carte_des_Royaumes_de_Siam%2C_Tunquin%2C_Pegu_%28Kingdoms_Map%29_1770_Bellin_Schley.jpg/250px-Carte_des_Royaumes_de_Siam%2C_Tunquin%2C_Pegu_%28Kingdoms_Map%29_1770_Bellin_Schley.jpg',
      '1863_1904_map.jpg': 'https://maps.wikimedia.org/img/osm-intl,13,a,a,250x200.png?lang=en&domain=en.wikipedia.org&title=French_Indochina&revid=1300548460&groups=_19daeb8e3808f1aa85ad490f39d7ec9a34f2eec3',
      '1904_1907_map.jpg': 'https://upload.wikimedia.org/wikipedia/commons/thumb/f/fb/Cambodia_adm_location_map.svg/250px-Cambodia_adm_location_map.svg.png',
      '1941_1946_map.jpg': 'https://upload.wikimedia.org/wikipedia/commons/thumb/0/0b/Map-of-southeast-asia_900_CE.svg/330px-Map-of-southeast-asia_900_CE.svg.png',
      '1954_1962_map.jpg': 'https://upload.wikimedia.org/wikipedia/commons/thumb/f/fb/Cambodia_adm_location_map.svg/250px-Cambodia_adm_location_map.svg.png',
      '1963_1997_map.jpg': 'https://upload.wikimedia.org/wikipedia/commons/thumb/f/fb/Cambodia_adm_location_map.svg/250px-Cambodia_adm_location_map.svg.png',
      '1997_2008_map.jpg': 'https://upload.wikimedia.org/wikipedia/commons/thumb/f/fb/Cambodia_adm_location_map.svg/250px-Cambodia_adm_location_map.svg.png',
      '2008_2013_map.jpg': 'https://upload.wikimedia.org/wikipedia/commons/thumb/c/c5/Preah_Vihear_Temple_location.png/300px-Preah_Vihear_Temple_location.png',
      '2014_2024_map.jpg': 'https://upload.wikimedia.org/wikipedia/commons/thumb/f/fb/Cambodia_adm_location_map.svg/250px-Cambodia_adm_location_map.svg.png',
      '2025_map.jpg': 'https://upload.wikimedia.org/wikipedia/commons/thumb/8/8c/Preah_Vihear_area_map.png/400px-Preah_Vihear_area_map.png'
    }

    const periodMap = {
      'Ancient_Times___1431_map.jpg': 'Ancient Times - 1431',
      '1431_1863_map.jpg': '1431-1863',
      '1863_1904_map.jpg': '1863-1904',
      '1904_1907_map.jpg': '1904-1907',
      '1941_1946_map.jpg': '1941-1946',
      '1954_1962_map.jpg': '1954-1962',
      '1963_1997_map.jpg': '1963-1997',
      '1997_2008_map.jpg': '1997-2008',
      '2008_2013_map.jpg': '2008-2013',
      '2014_2024_map.jpg': '2014-2024',
      '2025_map.jpg': '2025'
    }

    const maps = cachedMaps.map((filename: string) => ({
      period: periodMap[filename as keyof typeof periodMap] || filename.replace('_map.jpg', ''),
      localPath: `/maps/${filename}`,
      imageUrl: mapUrls[filename as keyof typeof mapUrls] || '',
      source: 'Wikipedia Commons'
    }))

    return NextResponse.json({
      cachedMaps: cachedMaps.length,
      maps: maps,
      mapsDirectory: '/maps/',
      lastUpdate: cachedMaps.length > 0 ? 
        Math.max(...cachedMaps.map((file: string) => {
          const filePath = path.join(mapsDir, file)
          return fs.statSync(filePath).mtime.getTime()
        })) : null
    })
  } catch (error) {
    return NextResponse.json(
      { error: 'Failed to get map status' },
      { status: 500 }
    )
  }
}