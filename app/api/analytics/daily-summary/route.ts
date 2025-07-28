import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { generateOrUpdateDailyAnalytics } from '@/lib/conflict-analytics'

export async function POST(request: NextRequest) {
  try {
    console.log('🔄 Starting daily conflict analytics generation...')

    // Generate analytics for today
    const today = new Date()
    const analytics = await generateOrUpdateDailyAnalytics(today)

    if (!analytics) {
      await prisma.monitoringLog.create({
        data: {
          sourceType: 'NEWS_ARTICLE',
          action: 'daily_analytics',
          status: 'INFO',
          message: 'No conflict data found for daily analytics generation',
          metadata: {
            date: today.toDateString(),
            timestamp: new Date().toISOString()
          }
        }
      })

      return NextResponse.json({
        success: true,
        message: 'No conflict data found for analysis',
        date: today.toDateString()
      })
    }

    // Log successful completion
    await prisma.monitoringLog.create({
      data: {
        sourceType: 'NEWS_ARTICLE',
        action: 'daily_analytics',
        status: 'SUCCESS',
        message: `Daily conflict analytics generated successfully`,
        metadata: {
          date: today.toDateString(),
          casualties: analytics.totalCasualties,
          affected: analytics.affectedPopulation,
          sources: analytics.sourcesAnalyzed,
          riskLevel: analytics.riskAssessment,
          timestamp: new Date().toISOString()
        }
      }
    })

    console.log(`✅ Daily conflict analytics completed for ${today.toDateString()}`)

    return NextResponse.json({
      success: true,
      analytics: {
        date: analytics.date,
        casualties: {
          thailand: analytics.thailandCasualties,
          cambodia: analytics.cambodiaCasualties,
          total: analytics.totalCasualties
        },
        population: {
          affected: analytics.affectedPopulation,
          displaced: analytics.displacedCivilians,
          areas: analytics.affectedAreas
        },
        weapons: analytics.weaponTypesReported,
        riskAssessment: analytics.riskAssessment,
        sourcesAnalyzed: analytics.sourcesAnalyzed,
        summary: analytics.dailySummary
      }
    })
  } catch (error) {
    console.error('❌ Daily analytics generation failed:', error)

    // Log the error
    await prisma.monitoringLog.create({
      data: {
        sourceType: 'NEWS_ARTICLE',
        action: 'daily_analytics',
        status: 'ERROR',
        message: `Daily analytics generation failed: ${error instanceof Error ? error.message : 'Unknown error'}`,
        metadata: {
          error: String(error),
          timestamp: new Date().toISOString()
        }
      }
    })

    return NextResponse.json(
      { 
        success: false,
        error: 'Failed to generate daily analytics',
        details: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    )
  }
}

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const dateParam = searchParams.get('date')
    const date = dateParam ? new Date(dateParam) : new Date()
    
    const startOfDay = new Date(date.getFullYear(), date.getMonth(), date.getDate())

    const analytics = await prisma.conflictAnalytics.findUnique({
      where: { date: startOfDay }
    })

    if (!analytics) {
      return NextResponse.json({
        success: false,
        message: 'No analytics found for the specified date',
        date: startOfDay.toDateString()
      }, { status: 404 })
    }

    return NextResponse.json({
      success: true,
      analytics: {
        date: analytics.date,
        casualties: {
          thailand: analytics.thailandCasualties,
          cambodia: analytics.cambodiaCasualties,
          total: analytics.totalCasualties,
          verified: analytics.casualtiesVerified
        },
        population: {
          affected: analytics.affectedPopulation,
          displaced: analytics.displacedCivilians,
          areas: analytics.affectedAreas
        },
        weapons: {
          types: analytics.weaponTypesReported,
          activity: analytics.militaryActivity
        },
        economy: {
          loss: analytics.economicLoss,
          tradeDisruption: analytics.tradeDisruption,
          borderStatus: analytics.borderStatus
        },
        diplomacy: {
          tension: analytics.diplomaticTension,
          statements: analytics.officialStatements,
          meetings: analytics.meetingsScheduled
        },
        analysis: {
          summary: analytics.dailySummary,
          keyDevelopments: analytics.keyDevelopments,
          riskAssessment: analytics.riskAssessment,
          confidence: analytics.confidenceScore
        },
        metadata: {
          sourcesAnalyzed: analytics.sourcesAnalyzed,
          verificationLevel: analytics.verificationLevel,
          createdAt: analytics.createdAt,
          updatedAt: analytics.updatedAt
        }
      }
    })
  } catch (error) {
    console.error('Error fetching daily analytics:', error)
    return NextResponse.json(
      { 
        success: false,
        error: 'Failed to fetch daily analytics',
        details: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    )
  }
}