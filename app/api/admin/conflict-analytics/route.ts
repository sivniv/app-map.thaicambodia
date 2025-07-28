import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const date = searchParams.get('date')
    
    if (date) {
      // Get specific date
      const startOfDay = new Date(date)
      startOfDay.setHours(0, 0, 0, 0)
      
      const analytics = await prisma.conflictAnalytics.findUnique({
        where: { date: startOfDay }
      })
      
      return NextResponse.json(analytics)
    } else {
      // Get latest analytics
      const analytics = await prisma.conflictAnalytics.findFirst({
        orderBy: { date: 'desc' }
      })
      
      return NextResponse.json(analytics)
    }
  } catch (error) {
    console.error('Failed to fetch conflict analytics:', error)
    return NextResponse.json(
      { error: 'Failed to fetch conflict analytics' },
      { status: 500 }
    )
  }
}

export async function POST(request: NextRequest) {
  try {
    const data = await request.json()
    
    // Parse and validate the date
    const date = new Date(data.date)
    date.setHours(0, 0, 0, 0)
    
    // Prepare the data for upsert
    const analyticsData = {
      date,
      thailandCasualties: parseInt(data.thailandCasualties) || 0,
      cambodiaCasualties: parseInt(data.cambodiaCasualties) || 0,
      totalCasualties: parseInt(data.totalCasualties) || 0,
      casualtiesVerified: Boolean(data.casualtiesVerified),
      affectedPopulation: parseInt(data.affectedPopulation) || 0,
      displacedCivilians: parseInt(data.displacedCivilians) || 0,
      affectedAreas: Array.isArray(data.affectedAreas) ? data.affectedAreas : [],
      weaponTypesReported: Array.isArray(data.weaponTypesReported) ? data.weaponTypesReported : [],
      militaryActivity: data.militaryActivity || null,
      economicLoss: data.economicLoss ? parseFloat(data.economicLoss) : null,
      tradeDisruption: Boolean(data.tradeDisruption),
      borderStatus: data.borderStatus || null,
      diplomaticTension: parseInt(data.diplomaticTension) || 1,
      officialStatements: parseInt(data.officialStatements) || 0,
      meetingsScheduled: parseInt(data.meetingsScheduled) || 0,
      dailySummary: data.dailySummary || null,
      keyDevelopments: Array.isArray(data.keyDevelopments) ? data.keyDevelopments : [],
      riskAssessment: parseInt(data.riskAssessment) || 1,
      confidenceScore: parseFloat(data.confidenceScore) || 0.0,
      sourcesAnalyzed: parseInt(data.sourcesAnalyzed) || 0,
      verificationLevel: data.verificationLevel || 'UNVERIFIED'
    }
    
    const analytics = await prisma.conflictAnalytics.upsert({
      where: { date },
      update: analyticsData,
      create: analyticsData
    })
    
    return NextResponse.json(analytics)
  } catch (error) {
    console.error('Failed to update conflict analytics:', error)
    return NextResponse.json(
      { error: 'Failed to update conflict analytics' },
      { status: 500 }
    )
  }
}