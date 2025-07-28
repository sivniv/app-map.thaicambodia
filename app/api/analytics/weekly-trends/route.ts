import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export async function POST(request: NextRequest) {
  try {
    console.log('🔄 Starting weekly trend analysis...')

    const today = new Date()
    const weekAgo = new Date(today.getTime() - 7 * 24 * 60 * 60 * 1000)

    // Get all daily analytics from the past week
    const weeklyAnalytics = await prisma.conflictAnalytics.findMany({
      where: {
        date: {
          gte: weekAgo,
          lte: today
        }
      },
      orderBy: {
        date: 'asc'
      }
    })

    if (weeklyAnalytics.length === 0) {
      await prisma.monitoringLog.create({
        data: {
          sourceType: 'NEWS_ARTICLE',
          action: 'weekly_trends',
          status: 'INFO',
          message: 'No weekly analytics data found for trend analysis',
          metadata: {
            weekStart: weekAgo.toDateString(),
            weekEnd: today.toDateString(),
            timestamp: new Date().toISOString()
          }
        }
      })

      return NextResponse.json({
        success: true,
        message: 'No weekly data available for trend analysis',
        period: {
          start: weekAgo.toDateString(),
          end: today.toDateString()
        }
      })
    }

    // Calculate trends
    const totalCasualties = weeklyAnalytics.reduce((sum, day) => sum + day.totalCasualties, 0)
    const totalAffected = weeklyAnalytics.reduce((sum, day) => sum + day.affectedPopulation, 0)
    const avgRiskLevel = weeklyAnalytics.reduce((sum, day) => sum + day.riskAssessment, 0) / weeklyAnalytics.length
    const avgDiplomaticTension = weeklyAnalytics.reduce((sum, day) => sum + day.diplomaticTension, 0) / weeklyAnalytics.length

    // Identify trends
    const riskTrend = weeklyAnalytics.length > 1 ? 
      weeklyAnalytics[weeklyAnalytics.length - 1].riskAssessment - weeklyAnalytics[0].riskAssessment : 0

    const casualtyTrend = weeklyAnalytics.length > 3 ? 
      weeklyAnalytics.slice(-3).reduce((sum, day) => sum + day.totalCasualties, 0) -
      weeklyAnalytics.slice(0, 3).reduce((sum, day) => sum + day.totalCasualties, 0) : 0

    // Create weekly summary
    const weeklyTrends = {
      period: {
        start: weekAgo,
        end: today
      },
      totals: {
        casualties: totalCasualties,
        affected: totalAffected,
        daysAnalyzed: weeklyAnalytics.length
      },
      averages: {
        riskLevel: Math.round(avgRiskLevel * 10) / 10,
        diplomaticTension: Math.round(avgDiplomaticTension * 10) / 10
      },
      trends: {
        riskDirection: riskTrend > 0 ? 'increasing' : riskTrend < 0 ? 'decreasing' : 'stable',
        riskChange: riskTrend,
        casualtyTrend: casualtyTrend > 0 ? 'increasing' : casualtyTrend < 0 ? 'decreasing' : 'stable',
        casualtyChange: casualtyTrend
      },
      keyMetrics: {
        peakRiskDay: weeklyAnalytics.reduce((max, day) => day.riskAssessment > max.riskAssessment ? day : max),
        mostActiveDay: weeklyAnalytics.reduce((max, day) => day.sourcesAnalyzed > max.sourcesAnalyzed ? day : max),
        highestCasualtyDay: weeklyAnalytics.reduce((max, day) => day.totalCasualties > max.totalCasualties ? day : max)
      }
    }

    // Log successful analysis
    await prisma.monitoringLog.create({
      data: {
        sourceType: 'NEWS_ARTICLE',
        action: 'weekly_trends',
        status: 'SUCCESS',
        message: `Weekly trend analysis completed`,
        metadata: {
          weekStart: weekAgo.toDateString(),
          weekEnd: today.toDateString(),
          totalCasualties,
          totalAffected,
          avgRiskLevel: Math.round(avgRiskLevel * 10) / 10,
          riskTrend: riskTrend > 0 ? 'increasing' : riskTrend < 0 ? 'decreasing' : 'stable',
          timestamp: new Date().toISOString()
        }
      }
    })

    console.log(`✅ Weekly trend analysis completed for ${weekAgo.toDateString()} to ${today.toDateString()}`)

    return NextResponse.json({
      success: true,
      trends: weeklyTrends
    })
  } catch (error) {
    console.error('❌ Weekly trend analysis failed:', error)

    await prisma.monitoringLog.create({
      data: {
        sourceType: 'NEWS_ARTICLE',
        action: 'weekly_trends',
        status: 'ERROR',
        message: `Weekly trend analysis failed: ${error instanceof Error ? error.message : 'Unknown error'}`,
        metadata: {
          error: String(error),
          timestamp: new Date().toISOString()
        }
      }
    })

    return NextResponse.json(
      { 
        success: false,
        error: 'Failed to generate weekly trends analysis',
        details: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    )
  }
}

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const weeksParam = searchParams.get('weeks')
    const weeks = weeksParam ? parseInt(weeksParam) : 4 // Default to 4 weeks

    const today = new Date()
    const startDate = new Date(today.getTime() - weeks * 7 * 24 * 60 * 60 * 1000)

    const analytics = await prisma.conflictAnalytics.findMany({
      where: {
        date: {
          gte: startDate,
          lte: today
        }
      },
      orderBy: {
        date: 'asc'
      }
    })

    // Group by weeks
    const weeklyData = []
    let currentWeekStart = new Date(startDate)
    
    for (let i = 0; i < weeks; i++) {
      const weekEnd = new Date(currentWeekStart.getTime() + 7 * 24 * 60 * 60 * 1000)
      const weekData = analytics.filter(a => a.date >= currentWeekStart && a.date < weekEnd)
      
      if (weekData.length > 0) {
        weeklyData.push({
          week: i + 1,
          period: {
            start: currentWeekStart.toDateString(),
            end: weekEnd.toDateString()
          },
          casualties: weekData.reduce((sum, day) => sum + day.totalCasualties, 0),
          affected: weekData.reduce((sum, day) => sum + day.affectedPopulation, 0),
          avgRisk: weekData.reduce((sum, day) => sum + day.riskAssessment, 0) / weekData.length,
          avgTension: weekData.reduce((sum, day) => sum + day.diplomaticTension, 0) / weekData.length,
          daysActive: weekData.length
        })
      }
      
      currentWeekStart = weekEnd
    }

    return NextResponse.json({
      success: true,
      period: {
        start: startDate.toDateString(),
        end: today.toDateString(),
        weeks: weeks
      },
      weeklyData
    })
  } catch (error) {
    console.error('Error fetching weekly trends:', error)
    return NextResponse.json(
      { 
        success: false,
        error: 'Failed to fetch weekly trends',
        details: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    )
  }
}