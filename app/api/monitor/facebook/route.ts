import { NextRequest, NextResponse } from 'next/server'
import { FacebookMonitor, FACEBOOK_SEARCH_QUERIES, extractPostContent, isConflictRelated } from '@/lib/facebook'
import { analyzeContent } from '@/lib/openai'
import { prisma } from '@/lib/prisma'

const facebookMonitor = new FacebookMonitor(
  process.env.RAPIDAPI_KEY || '',
  process.env.RAPIDAPI_HOST || 'facebook-scraper3.p.rapidapi.com'
)

export async function POST(request: NextRequest) {
  try {
    await prisma.monitoringLog.create({
      data: {
        sourceType: 'FACEBOOK_POST',
        action: 'monitoring_started',
        status: 'INFO',
        message: 'Facebook monitoring cycle started',
      },
    })

    let totalProcessed = 0
    let totalRelevant = 0

    // Test connection first
    const connectionTest = await facebookMonitor.testConnection()
    if (!connectionTest) {
      throw new Error('RapidAPI connection test failed')
    }

    for (const query of FACEBOOK_SEARCH_QUERIES) {
      try {
        // Create a source entry for this search query
        const dbSource = await prisma.source.upsert({
          where: {
            url: `facebook-search:${query}`,
          },
          update: {
            name: `Facebook Search: ${query}`,
            isActive: true,
          },
          create: {
            name: `Facebook Search: ${query}`,
            type: 'FACEBOOK_POST',
            url: `facebook-search:${query}`,
            description: `Facebook search results for: ${query}`,
          },
        })

        // Search for posts using the working endpoint
        console.log(`🔍 Searching Facebook for: "${query}"`)
        const posts = await facebookMonitor.searchPosts(query, 10)
        console.log(`📊 Found ${posts.length} posts for query: "${query}"`)
        
        // Debug: Log raw post data for first post
        if (posts.length > 0) {
          console.log(`📝 Sample post for "${query}":`, JSON.stringify(posts[0], null, 2))
        } else {
          console.log(`❌ No posts found for query: "${query}"`)
        }

        for (const post of posts) {
          try {
            const content = extractPostContent(post)
            console.log(`📄 Post content extracted (${content.length} chars): "${content.substring(0, 100)}..."`)
            
            if (!content) {
              console.log(`⚠️ No content extracted from post ID: ${post.id}`)
              continue
            }
            
            const isRelevant = isConflictRelated(content)
            console.log(`🎯 Conflict relevance check: ${isRelevant ? 'RELEVANT' : 'NOT RELEVANT'}`)
            
            // TEMPORARILY DISABLE FILTER FOR DEBUGGING
            if (false && !isRelevant) {
              console.log(`❌ Post filtered out as not conflict-related: "${content.substring(0, 50)}..."`)
              continue
            }
            
            console.log(`🚫 DEBUG MODE: Filter disabled - processing all posts regardless of relevance`)
            
            console.log(`✅ Post passed relevance filter, processing...`)

            // Enhanced duplicate detection for Facebook posts
            const existingArticle = await prisma.article.findFirst({
              where: {
                OR: [
                  { originalUrl: post.permalink_url || `https://facebook.com/${post.id}` },
                  { 
                    title: `${post.from.name} - ${new Date(post.created_time).toLocaleDateString()}`,
                    sourceId: dbSource.id
                  }
                ]
              },
            })

            if (existingArticle) {
              console.log(`⚠️ Duplicate Facebook post detected: ${post.from.name}`)
              continue
            }

            // AI analysis
            const analysis = await analyzeContent(content, `Facebook post from ${post.from.name}`)

            if (analysis.conflictRelevance < 3) {
              continue
            }

            // Create article
            const article = await prisma.article.create({
              data: {
                sourceId: dbSource.id,
                title: `${post.from.name} - ${new Date(post.created_time).toLocaleDateString()}`,
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
                  fromName: post.from.name,
                  fromId: post.from.id,
                  importance: analysis.importance,
                  conflictRelevance: analysis.conflictRelevance,
                  sentiment: analysis.sentiment,
                },
              },
            })

            // Create timeline event
            await prisma.timelineEvent.create({
              data: {
                articleId: article.id,
                eventType: 'facebook_post',
                eventDate: new Date(post.created_time),
                title: `Facebook: ${post.from.name} posted about ${query}`,
                description: analysis.summary,
                importance: analysis.importance,
              },
            })

            totalRelevant++
            console.log(`Processed relevant Facebook post from ${post.from.name} for query: ${query}`)
          } catch (error) {
            console.error(`Error processing post for query "${query}":`, error)
          }
        }

        totalProcessed += posts.length
      } catch (error) {
        console.error(`Error processing search query "${query}":`, error)
        
        await prisma.monitoringLog.create({
          data: {
            sourceType: 'FACEBOOK_POST',
            action: 'search_processing',
            status: 'ERROR',
            message: `Error processing search query "${query}": ${error instanceof Error ? error.message : 'Unknown error'}`,
            metadata: { searchQuery: query },
          },
        })
      }
    }

    await prisma.monitoringLog.create({
      data: {
        sourceType: 'FACEBOOK_POST',
        action: 'monitoring_completed',
        status: 'SUCCESS',
        message: `Facebook monitoring completed. Processed ${totalProcessed} posts, found ${totalRelevant} relevant posts`,
        metadata: { totalProcessed, totalRelevant },
      },
    })

    return NextResponse.json({
      success: true,
      totalProcessed,
      totalRelevant,
      searchQueries: FACEBOOK_SEARCH_QUERIES.length,
    })
  } catch (error) {
    console.error('Facebook monitoring error:', error)
    
    await prisma.monitoringLog.create({
      data: {
        sourceType: 'FACEBOOK_POST',
        action: 'monitoring_error',
        status: 'ERROR',
        message: error instanceof Error ? error.message : 'Unknown error',
        metadata: { error: String(error) },
      },
    })

    return NextResponse.json(
      { error: 'Facebook monitoring failed', details: String(error) },
      { status: 500 }
    )
  }
}

export async function GET() {
  try {
    // Test RapidAPI connection
    const connectionTest = await facebookMonitor.testConnection()
    
    // Get monitoring stats
    const stats = await prisma.article.groupBy({
      by: ['status'],
      where: {
        source: {
          type: 'FACEBOOK_POST',
        },
        createdAt: {
          gte: new Date(Date.now() - 24 * 60 * 60 * 1000), // Last 24 hours
        },
      },
      _count: true,
    })

    const sources = await prisma.source.findMany({
      where: { type: 'FACEBOOK_POST', isActive: true },
      select: { id: true, name: true, url: true },
    })

    return NextResponse.json({
      connectionStatus: connectionTest,
      stats,
      sources,
      monitoredPages: FACEBOOK_SEARCH_QUERIES.length,
      lastUpdate: new Date().toISOString(),
    })
  } catch (error) {
    return NextResponse.json(
      { error: 'Failed to get Facebook monitoring status' },
      { status: 500 }
    )
  }
}