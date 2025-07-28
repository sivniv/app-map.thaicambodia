import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const limit = parseInt(searchParams.get('limit') || '50')
    const type = searchParams.get('type') // 'facebook_post' | 'news_article'
    const sourceId = searchParams.get('sourceId') // Filter by specific source
    const sourceName = searchParams.get('sourceName') // Filter by source name
    const days = parseInt(searchParams.get('days') || '30') // Number of days to look back
    
    const whereClause: any = {}
    
    // Filter by date range
    const endDate = new Date()
    const startDate = new Date(endDate.getTime() - days * 24 * 60 * 60 * 1000)
    whereClause.eventDate = {
      gte: startDate,
      lte: endDate
    }
    
    if (type) {
      whereClause.eventType = type
    }
    
    // Filter by source
    if (sourceId || sourceName) {
      whereClause.article = {}
      
      if (sourceId) {
        whereClause.article.sourceId = sourceId
      }
      
      if (sourceName) {
        whereClause.article.source = {
          name: {
            contains: sourceName,
            mode: 'insensitive'
          }
        }
      }
    }

    const timelineEvents = await prisma.timelineEvent.findMany({
      where: whereClause,
      include: {
        article: {
          include: {
            source: {
              select: {
                name: true,
                type: true,
                url: true,
              },
            },
            // Include conflict analytics data
            casualtyReports: {
              select: {
                casualties: true,
                injured: true,
                country: true,
                location: true,
                confidence: true
              }
            },
            weaponUsages: {
              select: {
                weaponType: true,
                country: true,
                threatLevel: true,
                confidence: true
              }
            },
            populationImpacts: {
              select: {
                impactType: true,
                affectedCount: true,
                severity: true,
                confidence: true
              }
            }
          },
        },
      },
      orderBy: {
        eventDate: 'desc',
      },
      take: limit,
    })

    // Enhance timeline events with additional analytics
    const enhancedEvents = timelineEvents.map(event => {
      const article = event.article
      let conflictData = null
      
      try {
        conflictData = article.conflictData ? JSON.parse(article.conflictData as string) : null
      } catch (e) {
        // Handle invalid JSON
      }

      return {
        ...event,
        article: {
          ...article,
          conflictData,
          // Add conflict analytics summary
          conflictSummary: {
            hasCasualties: article.casualtyReports.length > 0,
            totalCasualties: article.casualtyReports.reduce((sum, r) => sum + r.casualties + r.injured, 0),
            hasWeapons: article.weaponUsages.length > 0,
            weaponCount: article.weaponUsages.length,
            highThreatWeapons: article.weaponUsages.filter(w => w.threatLevel >= 7).length,
            hasPopulationImpact: article.populationImpacts.length > 0,
            totalAffected: article.populationImpacts.reduce((sum, i) => sum + i.affectedCount, 0),
            maxSeverity: Math.max(...article.populationImpacts.map(i => i.severity), 0)
          }
        }
      }
    })

    // Add statistics
    const stats = {
      totalEvents: enhancedEvents.length,
      eventTypes: {
        news: enhancedEvents.filter(e => e.eventType === 'news_article').length,
        facebook: enhancedEvents.filter(e => e.eventType === 'facebook_post').length
      },
      importanceBreakdown: {
        high: enhancedEvents.filter(e => e.importance >= 4).length,
        medium: enhancedEvents.filter(e => e.importance >= 3 && e.importance < 4).length,
        low: enhancedEvents.filter(e => e.importance < 3).length
      },
      conflictAnalytics: {
        eventsWithCasualties: enhancedEvents.filter(e => e.article.conflictSummary.hasCasualties).length,
        eventsWithWeapons: enhancedEvents.filter(e => e.article.conflictSummary.hasWeapons).length,
        eventsWithPopulationImpact: enhancedEvents.filter(e => e.article.conflictSummary.hasPopulationImpact).length,
        totalCasualties: enhancedEvents.reduce((sum, e) => sum + e.article.conflictSummary.totalCasualties, 0),
        totalAffected: enhancedEvents.reduce((sum, e) => sum + e.article.conflictSummary.totalAffected, 0)
      },
      dateRange: {
        start: startDate.toISOString(),
        end: endDate.toISOString(),
        days: days
      }
    }

    return NextResponse.json({
      events: enhancedEvents,
      stats,
      success: true
    })
  } catch (error) {
    console.error('Detailed timeline API error:', error)
    return NextResponse.json(
      { 
        error: 'Failed to fetch detailed timeline',
        success: false,
        details: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    )
  }
}