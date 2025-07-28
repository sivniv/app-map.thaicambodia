import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const period = searchParams.get('period') || '30' // Default to 30 days

    const days = parseInt(period)
    const endDate = new Date()
    const startDate = new Date(endDate.getTime() - days * 24 * 60 * 60 * 1000)

    // Get analytics for the period
    const analytics = await prisma.conflictAnalytics.findMany({
      where: {
        date: {
          gte: startDate,
          lte: endDate
        }
      },
      orderBy: {
        date: 'desc'
      }
    })

    // Get today's analytics
    const today = new Date()
    const todayStart = new Date(today.getFullYear(), today.getMonth(), today.getDate())
    const todayAnalytics = await prisma.conflictAnalytics.findUnique({
      where: { date: todayStart }
    })

    // Calculate totals
    const totalCasualties = analytics.reduce((sum, day) => sum + day.totalCasualties, 0)
    const totalThailandCasualties = analytics.reduce((sum, day) => sum + day.thailandCasualties, 0)
    const totalCambodiaCasualties = analytics.reduce((sum, day) => sum + day.cambodiaCasualties, 0)
    const totalAffectedPopulation = analytics.reduce((sum, day) => sum + day.affectedPopulation, 0)
    const totalDisplacedCivilians = analytics.reduce((sum, day) => sum + day.displacedCivilians, 0)

    // Get unique weapon types across all days
    const allWeaponTypes = new Set<string>()
    analytics.forEach(day => {
      day.weaponTypesReported.forEach(weapon => allWeaponTypes.add(weapon))
    })

    // Get unique affected areas
    const allAffectedAreas = new Set<string>()
    analytics.forEach(day => {
      day.affectedAreas.forEach(area => allAffectedAreas.add(area))
    })

    // Calculate current risk and diplomatic status
    const currentRisk = todayAnalytics?.riskAssessment || 1
    const currentDiplomaticTension = todayAnalytics?.diplomaticTension || 1
    const currentBorderStatus = todayAnalytics?.borderStatus || 'Unknown'

    // Get recent casualty reports for verification
    const recentCasualties = await prisma.casualtyReport.findMany({
      where: {
        reportedDate: {
          gte: startDate
        }
      },
      include: {
        article: {
          select: {
            title: true,
            publishedAt: true,
            source: {
              select: {
                name: true
              }
            }
          }
        }
      },
      orderBy: {
        reportedDate: 'desc'
      },
      take: 10
    })

    // Get recent weapon usage reports
    const recentWeapons = await prisma.weaponUsage.findMany({
      where: {
        createdAt: {
          gte: startDate
        }
      },
      include: {
        article: {
          select: {
            title: true,
            publishedAt: true,
            source: {
              select: {
                name: true
              }
            }
          }
        }
      },
      orderBy: {
        createdAt: 'desc'
      },
      take: 10
    })

    // Get recent population impacts
    const recentImpacts = await prisma.populationImpact.findMany({
      where: {
        createdAt: {
          gte: startDate
        }
      },
      include: {
        article: {
          select: {
            title: true,
            publishedAt: true,
            source: {
              select: {
                name: true
              }
            }
          }
        }
      },
      orderBy: {
        createdAt: 'desc'
      },
      take: 10
    })

    return NextResponse.json({
      success: true,
      period: {
        days,
        start: startDate.toDateString(),
        end: endDate.toDateString()
      },
      overview: {
        casualties: {
          total: totalCasualties,
          thailand: totalThailandCasualties,
          cambodia: totalCambodiaCasualties,
          today: todayAnalytics?.totalCasualties || 0
        },
        population: {
          affected: totalAffectedPopulation,
          displaced: totalDisplacedCivilians,
          affectedAreas: Array.from(allAffectedAreas).length,
          locations: Array.from(allAffectedAreas)
        },
        weapons: {
          typesReported: Array.from(allWeaponTypes).length,
          types: Array.from(allWeaponTypes)
        },
        status: {
          riskLevel: currentRisk,
          diplomaticTension: currentDiplomaticTension,
          borderStatus: currentBorderStatus,
          lastUpdate: todayAnalytics?.updatedAt || new Date()
        }
      },
      dailyTrend: analytics.map(day => ({
        date: day.date.toDateString(),
        casualties: day.totalCasualties,
        affected: day.affectedPopulation,
        risk: day.riskAssessment,
        tension: day.diplomaticTension
      })),
      recentReports: {
        casualties: recentCasualties.map(report => ({
          id: report.id,
          location: report.location,
          date: report.incidentDate.toDateString(),
          country: report.country,
          casualties: report.casualties,
          injured: report.injured,
          cause: report.cause,
          confidence: report.confidence,
          source: report.article.source.name,
          title: report.article.title
        })),
        weapons: recentWeapons.map(weapon => ({
          id: weapon.id,
          type: weapon.weaponType,
          name: weapon.weaponName,
          country: weapon.country,
          location: weapon.location,
          purpose: weapon.purpose,
          threatLevel: weapon.threatLevel,
          confidence: weapon.confidence,
          source: weapon.article.source.name,
          title: weapon.article.title
        })),
        impacts: recentImpacts.map(impact => ({
          id: impact.id,
          location: impact.location,
          country: impact.country,
          type: impact.impactType,
          affected: impact.affectedCount,
          severity: impact.severity,
          description: impact.description,
          confidence: impact.confidence,
          source: impact.article.source.name,
          title: impact.article.title
        }))
      },
      todaySummary: todayAnalytics?.dailySummary || 'No summary available for today.'
    })
  } catch (error) {
    console.error('Error fetching conflict statistics:', error)
    return NextResponse.json(
      { 
        success: false,
        error: 'Failed to fetch conflict statistics',
        details: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    )
  }
}