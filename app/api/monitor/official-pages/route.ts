import { NextRequest, NextResponse } from 'next/server'
import { FacebookMonitor, ALL_MONITORED_PAGES, extractPostContent } from '@/lib/facebook'
import { analyzeContent } from '@/lib/openai'
import { prisma } from '@/lib/prisma'

const facebookMonitor = new FacebookMonitor(
  process.env.RAPIDAPI_KEY || '',
  process.env.RAPIDAPI_HOST || 'facebook-scraper3.p.rapidapi.com'
)

export async function POST(request: NextRequest) {
  try {
    console.log('🏛️ Starting Official Pages monitoring...')
    
    await prisma.monitoringLog.create({
      data: {
        sourceType: 'FACEBOOK_POST',
        action: 'official_pages_monitoring_started',
        status: 'INFO',
        message: 'Official Facebook pages monitoring cycle started',
      },
    })

    let totalNew = 0
    let errors = 0

    // Quick connection test with 5 second timeout
    console.log('🔍 Testing RapidAPI connection...')
    try {
      const testPosts = await facebookMonitor.searchPosts('test', 1)
      console.log('✅ RapidAPI connection successful')
    } catch (error) {
      throw new Error(`RapidAPI connection failed: ${error instanceof Error ? error.message : String(error)}`)
    }

    // Use search-based approach for government-related posts
    const governmentQueries = [
      'Royal Thai Government',
      'Ministry Foreign Affairs Thailand', 
      'Thai Government official',
      'Royal Government Cambodia',
      'Hun Sen Cambodia',
      'Cambodia Government',
      'Thailand Cambodia diplomatic',
      'Thai Cambodia official'
    ]

    for (const query of governmentQueries) {
      try {
        console.log(`🔍 Searching for: "${query}"`)
        
        const posts = await facebookMonitor.searchPosts(query, 3)
        console.log(`📊 Found ${posts.length} posts for "${query}"`)

        for (const post of posts) {
          try {
            const content = extractPostContent(post)
            if (!content || content.length < 50) {
              console.log(`⚠️ Skipping post with insufficient content`)
              continue
            }

            // Create/update source for this search
            const dbSource = await prisma.source.upsert({
              where: {
                url: `facebook-search:${query.replace(/\s+/g, '-').toLowerCase()}`,
              },
              update: {
                name: `Facebook: ${query}`,
                isActive: true,
                description: `Facebook posts related to: ${query}`,
              },
              create: {
                name: `Facebook: ${query}`,
                type: 'FACEBOOK_POST',
                url: `facebook-search:${query.replace(/\s+/g, '-').toLowerCase()}`,
                description: `Facebook posts related to: ${query}`,
              },
            })

            // Check for duplicates
            const existingArticle = await prisma.article.findFirst({
              where: {
                OR: [
                  { originalUrl: post.permalink_url || `https://facebook.com/${post.id}` },
                  { 
                    AND: [
                      { sourceId: dbSource.id },
                      { title: { contains: post.id } }
                    ]
                  }
                ]
              },
            })

            if (existingArticle) {
              console.log(`⚠️ Duplicate post detected, skipping...`)
              continue
            }

            // AI analysis
            console.log(`🤖 Analyzing content with AI...`)
            const analysis = await analyzeContent(content, `Official government-related post: ${query}`)

            // Create article
            const article = await prisma.article.create({
              data: {
                sourceId: dbSource.id,
                title: `${query} - ${new Date(post.created_time).toLocaleDateString()}`,
                content,
                originalUrl: post.permalink_url || `https://facebook.com/${post.id}`,
                summary: analysis.summary,
                aiAnalysis: JSON.stringify(analysis),
                publishedAt: new Date(post.created_time),
                status: 'ANALYZED',
                tags: analysis.keywords,
                metadata: {
                  postId: post.id,
                  searchQuery: query,
                  fromName: post.from?.name || 'Unknown',
                  fromId: post.from?.id || 'unknown',
                  importance: analysis.importance,
                  conflictRelevance: analysis.conflictRelevance,
                  sentiment: analysis.sentiment,
                  isOfficialSource: true,
                  monitoringType: 'official_search'
                },
              },
            })

            // Create timeline event for official post
            await prisma.timelineEvent.create({
              data: {
                articleId: article.id,
                eventType: 'facebook_post',
                eventDate: new Date(post.created_time),
                title: `Official: ${post.from?.name || query} posted update`,
                description: analysis.summary,
                importance: Math.max(analysis.importance, 3), // Official posts get minimum importance of 3
              },
            })

            totalNew++
            console.log(`✅ Processed new official post from search "${query}"`)
            
          } catch (postError) {
            console.error(`Error processing post from search "${query}":`, postError)
            errors++
          }
        }
        
      } catch (queryError) {
        console.error(`Error searching for "${query}":`, queryError)
        errors++
      }

      // Small delay between queries to be respectful to the API
      await new Promise(resolve => setTimeout(resolve, 1000))
    }

    await prisma.monitoringLog.create({
      data: {
        sourceType: 'FACEBOOK_POST',
        action: 'official_pages_monitoring_completed',
        status: errors > totalNew ? 'ERROR' : (errors > 0 ? 'WARNING' : 'SUCCESS'),
        message: `Official pages monitoring completed. Created ${totalNew} new articles, ${errors} errors`,
        metadata: { 
          totalNew, 
          errors,
          queriesSearched: governmentQueries.length,
          searchQueries: governmentQueries
        },
      },
    })

    console.log(`🏛️ Official Pages monitoring completed: ${totalNew} new posts, ${errors} errors`)

    return NextResponse.json({
      success: true,
      totalNew,
      errors,
      queriesSearched: governmentQueries.length,
      message: `Searched ${governmentQueries.length} government queries, found ${totalNew} new official posts`
    })
    
  } catch (error) {
    console.error('Official pages monitoring error:', error)
    
    await prisma.monitoringLog.create({
      data: {
        sourceType: 'FACEBOOK_POST',
        action: 'official_pages_monitoring_error',
        status: 'ERROR',
        message: error instanceof Error ? error.message : 'Unknown error',
        metadata: { error: String(error) },
      },
    })

    return NextResponse.json(
      { error: 'Official pages monitoring failed', details: String(error) },
      { status: 500 }
    )
  }
}

export async function GET() {
  try {
    // Get monitoring stats for official pages
    const stats = await prisma.article.groupBy({
      by: ['status'],
      where: {
        source: {
          type: 'FACEBOOK_POST',
          url: { startsWith: 'facebook-search:' }
        },
        createdAt: {
          gte: new Date(Date.now() - 24 * 60 * 60 * 1000), // Last 24 hours
        },
      },
      _count: true,
    })

    const sources = await prisma.source.findMany({
      where: { 
        type: 'FACEBOOK_POST', 
        url: { startsWith: 'facebook-search:' },
        isActive: true 
      },
      select: { id: true, name: true, url: true },
    })

    const lastMonitoring = await prisma.monitoringLog.findFirst({
      where: {
        sourceType: 'FACEBOOK_POST',
        action: 'official_pages_monitoring_completed'
      },
      orderBy: { createdAt: 'desc' }
    })

    return NextResponse.json({
      stats,
      sources,
      lastMonitoring: lastMonitoring?.createdAt,
      totalSources: sources.length,
      approach: 'search-based monitoring for government posts'
    })
  } catch (error) {
    return NextResponse.json(
      { error: 'Failed to get official pages monitoring status' },
      { status: 500 }
    )
  }
}