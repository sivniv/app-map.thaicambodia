import { NextRequest, NextResponse } from 'next/server'
import { NewsMonitor, NEWS_SOURCES, isThailandCambodiaRelated } from '@/lib/news'
import { analyzeContent } from '@/lib/openai'
import { prisma } from '@/lib/prisma'

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

    for (const source of NEWS_SOURCES) {
      try {
        const dbSource = await prisma.source.upsert({
          where: {
            url: source.rssUrl,
          },
          update: {
            name: source.name,
            isActive: true,
          },
          create: {
            name: source.name,
            type: 'NEWS_ARTICLE',
            url: source.rssUrl,
            description: `RSS feed from ${source.name}`,
          },
        })

        const articles = await newsMonitor.fetchFromRSS(source.rssUrl)
        console.log(`Fetched ${articles.length} articles from ${source.name}`)

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
                  sourceWebsite: source.website,
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
            metadata: { sourceName: source.name, sourceUrl: source.rssUrl },
          },
        })
      }
    }

    await prisma.monitoringLog.create({
      data: {
        sourceType: 'NEWS_ARTICLE',
        action: 'monitoring_completed',
        status: 'SUCCESS',
        message: `Monitoring completed. Processed ${totalProcessed} articles, found ${totalRelevant} relevant articles`,
        metadata: { totalProcessed, totalRelevant },
      },
    })

    return NextResponse.json({
      success: true,
      totalProcessed,
      totalRelevant,
      sources: NEWS_SOURCES.length,
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