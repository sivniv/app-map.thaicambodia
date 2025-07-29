import { NextRequest, NextResponse } from 'next/server'
import { NewsMonitor, NEWS_SOURCES, isThailandCambodiaRelated } from '@/lib/news'
import { analyzeContent } from '@/lib/openai'
import { prisma } from '@/lib/prisma'
import { newsAPIManager } from '@/lib/news-apis'
import { getActiveRSSSources } from '@/lib/rss-sources'

const newsMonitor = new NewsMonitor(process.env.NEWS_API_KEY || '')

export async function POST(request: NextRequest) {
  try {
    await prisma.monitoringLog.create({
      data: {
        sourceType: 'NEWS_ARTICLE',
        action: 'monitoring_started',
        status: 'INFO',
        message: 'News monitoring cycle started',
      },
    })

    let totalProcessed = 0
    let totalRelevant = 0

    // First, fetch from enhanced RSS sources with Cloudflare bypass
    const enhancedRSSSources = getActiveRSSSources()
    console.log(`🔍 Processing ${enhancedRSSSources.length} enhanced RSS sources...`)

    for (const source of enhancedRSSSources) {
      try {
        const dbSource = await prisma.source.upsert({
          where: {
            url: source.url,
          },
          update: {
            name: source.name,
            isActive: source.active,
          },
          create: {
            name: source.name,
            type: 'NEWS_ARTICLE',
            url: source.url,
            description: `${source.country} news - ${source.category} (${source.language})`,
          },
        })

        const articles = await newsMonitor.fetchFromRSS(source.url, source.name)
        console.log(`✅ ${source.name}: ${articles.length} articles (CF protected: ${source.cloudflareProtected})`)

        for (const article of articles) {
          try {
            if (!isThailandCambodiaRelated(article.content || article.description || '', article.title)) {
              continue
            }

            // Enhanced duplicate detection - check by URL, title, and content similarity
            const existingArticle = await prisma.article.findFirst({
              where: {
                OR: [
                  { originalUrl: article.url },
                  { 
                    title: article.title,
                    sourceId: dbSource.id
                  },
                  {
                    title: {
                      contains: article.title.substring(0, 50) // Check first 50 chars of title
                    },
                    sourceId: dbSource.id,
                    createdAt: {
                      gte: new Date(Date.now() - 24 * 60 * 60 * 1000) // Within last 24 hours
                    }
                  }
                ]
              },
            })

            if (existingArticle) {
              console.log(`⚠️ Duplicate article detected: ${article.title}`)
              continue
            }

            let fullContent = article.content || article.description || ''
            if (fullContent.length < 200 && article.url) {
              try {
                const scrapedContent = await newsMonitor.scrapeArticleContent(article.url)
                if (scrapedContent.length > fullContent.length) {
                  fullContent = scrapedContent
                }
              } catch (error) {
                console.error(`Error scraping ${article.url}:`, error)
              }
            }

            if (!fullContent || fullContent.length < 100) {
              continue
            }

            // Create article first to get ID for enhanced analysis
            const createdArticle = await prisma.article.create({
              data: {
                sourceId: dbSource.id,
                title: article.title,
                content: fullContent,
                originalUrl: article.url,
                publishedAt: new Date(article.publishedAt),
                status: 'PROCESSING',
                tags: [],
                metadata: {
                  author: article.author,
                  sourceWebsite: source.website,
                  imageUrl: article.urlToImage,
                },
              },
            })

            // Now analyze with the article ID for enhanced conflict analysis
            const analysis = await analyzeContent(fullContent, article.title, createdArticle.id)

            if (analysis.conflictRelevance < 3) {
              // Delete the article if it's not relevant enough
              await prisma.article.delete({
                where: { id: createdArticle.id }
              })
              continue
            }

            // Update the article with analysis results
            await prisma.article.update({
              where: { id: createdArticle.id },
              data: {
                summary: analysis.summary,
                aiAnalysis: JSON.stringify(analysis),
                status: 'ANALYZED',
                tags: analysis.keywords,
                metadata: {
                  author: article.author,
                  sourceWebsite: source.website || source.url,
                  imageUrl: article.urlToImage,
                  importance: analysis.importance,
                  conflictRelevance: analysis.conflictRelevance,
                  sentiment: analysis.sentiment,
                },
              },
            })

            await prisma.timelineEvent.create({
              data: {
                articleId: createdArticle.id,
                eventType: 'news_article',
                eventDate: new Date(article.publishedAt),
                title: `${source.name}: ${article.title}`,
                description: analysis.summary,
                importance: analysis.importance,
              },
            })

            totalRelevant++
            console.log(`Processed relevant article: ${article.title}`)
          } catch (error) {
            console.error(`Error processing article "${article.title}":`, error)
          }
        }

        totalProcessed += articles.length
      } catch (error) {
        console.error(`Error processing source ${source.name}:`, error)
        
        await prisma.monitoringLog.create({
          data: {
            sourceType: 'NEWS_ARTICLE',
            action: 'source_processing',
            status: 'ERROR',
            message: `Error processing ${source.name}: ${error instanceof Error ? error.message : 'Unknown error'}`,
            metadata: { sourceName: source.name, sourceUrl: source.rssUrl || source.url },
          },
        })
      }
    }

    // Now fetch from additional news APIs as backup/supplement
    console.log('🌐 Fetching from additional news APIs...')
    try {
      const apiResult = await newsAPIManager.fetchFromAllAPIs('Thailand Cambodia conflict border dispute')
      console.log(`📊 API Results: ${apiResult.articles.length} articles from multiple APIs`)

      for (const article of apiResult.articles) {
        try {
          if (!isThailandCambodiaRelated(article.content || article.description || '', article.title)) {
            continue
          }

          // Check for duplicates
          const existingArticle = await prisma.article.findFirst({
            where: {
              OR: [
                { originalUrl: article.url },
                { 
                  AND: [
                    { title: { contains: article.title.substring(0, 50) } },
                    { publishedAt: { gte: new Date(Date.now() - 24 * 60 * 60 * 1000) } }
                  ]
                }
              ]
            }
          })

          if (existingArticle) {
            continue
          }

          // Create source for API if it doesn't exist
          const apiSource = await prisma.source.upsert({
            where: { url: article.source.url || 'api-source' },
            update: { name: article.source.name },
            create: {
              name: article.source.name,
              type: 'NEWS_ARTICLE',
              url: article.source.url || 'api-source',
              description: 'News API source'
            }
          })

          const fullContent = article.content || article.description || ''

          const createdArticle = await prisma.article.create({
            data: {
              sourceId: apiSource.id,
              title: article.title,
              content: fullContent,
              originalUrl: article.url,
              publishedAt: new Date(article.publishedAt),
              status: 'PROCESSING',
              tags: [],
              metadata: {
                author: article.author,
                imageUrl: article.urlToImage,
                sourceType: 'API'
              },
            },
          })

          const analysis = await analyzeContent(fullContent, article.title, createdArticle.id)

          if (analysis.conflictRelevance < 3) {
            await prisma.article.delete({ where: { id: createdArticle.id } })
            continue
          }

          await prisma.article.update({
            where: { id: createdArticle.id },
            data: {
              summary: analysis.summary,
              aiAnalysis: JSON.stringify(analysis),
              status: 'ANALYZED',
              tags: analysis.keywords,
              metadata: {
                author: article.author,
                imageUrl: article.urlToImage,
                importance: analysis.importance,
                conflictRelevance: analysis.conflictRelevance,
                sentiment: analysis.sentiment,
                sourceType: 'API'
              },
            },
          })

          await prisma.timelineEvent.create({
            data: {
              articleId: createdArticle.id,
              eventType: 'news_article',
              eventDate: new Date(article.publishedAt),
              title: article.title,
              description: analysis.summary,
              importance: analysis.importance,
            },
          })

          totalProcessed++
          totalRelevant++

        } catch (error) {
          console.error('Error processing API article:', error)
        }
      }
    } catch (error) {
      console.error('❌ Error fetching from news APIs:', error)
      await prisma.monitoringLog.create({
        data: {
          sourceType: 'NEWS_ARTICLE',
          action: 'api_fetch_error',
          status: 'ERROR',
          message: `Error fetching from news APIs: ${error instanceof Error ? error.message : 'Unknown error'}`
        },
      })
    }

    await prisma.monitoringLog.create({
      data: {
        sourceType: 'NEWS_ARTICLE',
        action: 'monitoring_completed',
        status: 'SUCCESS',
        message: `Enhanced monitoring completed. Processed ${totalProcessed} articles, found ${totalRelevant} relevant articles`,
        metadata: { 
          totalProcessed, 
          totalRelevant, 
          enhancedRSSSources: enhancedRSSSources.length,
          cloudflareBypassEnabled: true
        },
      },
    })

    return NextResponse.json({
      success: true,
      totalProcessed,
      totalRelevant,
      sources: enhancedRSSSources.length,
      cloudflareBypassEnabled: true,
      message: `Enhanced monitoring with Cloudflare bypass capability`
    })
  } catch (error) {
    console.error('News monitoring error:', error)
    
    await prisma.monitoringLog.create({
      data: {
        sourceType: 'NEWS_ARTICLE',
        action: 'monitoring_error',
        status: 'ERROR',
        message: error instanceof Error ? error.message : 'Unknown error',
        metadata: { error: String(error) },
      },
    })

    return NextResponse.json(
      { error: 'News monitoring failed', details: String(error) },
      { status: 500 }
    )
  }
}

export async function GET() {
  try {
    const stats = await prisma.article.groupBy({
      by: ['status'],
      where: {
        createdAt: {
          gte: new Date(Date.now() - 24 * 60 * 60 * 1000), // Last 24 hours
        },
      },
      _count: true,
    })

    const sources = await prisma.source.findMany({
      where: { type: 'NEWS_ARTICLE', isActive: true },
      select: { id: true, name: true, url: true },
    })

    return NextResponse.json({
      stats,
      sources,
      lastUpdate: new Date().toISOString(),
    })
  } catch (error) {
    return NextResponse.json(
      { error: 'Failed to get monitoring status' },
      { status: 500 }
    )
  }
}