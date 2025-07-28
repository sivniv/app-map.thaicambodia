import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export async function POST(request: NextRequest) {
  try {
    // Delete all monitoring logs related to Facebook searches
    const deleteResult = await prisma.monitoringLog.deleteMany({
      where: {
        OR: [
          { action: { contains: 'Facebook Search' } },
          { message: { contains: 'Facebook Search' } },
          { message: { contains: 'Hun Sen Thailand' } },
          { message: { contains: 'Preah Vihear Thailand' } },
          { message: { contains: 'Thai Cambodia cooperation' } },
          { message: { contains: 'Thai Cambodia diplomatic' } },
          { message: { contains: 'Thai Cambodia dispute' } },
          { message: { contains: 'Thailand Cambodia agreement' } },
          { message: { contains: 'Thailand Cambodia border' } },
          { message: { contains: 'Thailand Cambodia conflict' } },
          { message: { contains: 'Thailand Cambodia government' } },
          { message: { contains: 'Thailand Cambodia temple' } },
          { message: { contains: 'Thailand Cambodia trade' } },
          { message: { contains: 'Ministry of Foreign Affairs Thailand' } }
        ]
      }
    })

    // Log the cleanup action
    await prisma.monitoringLog.create({
      data: {
        sourceType: 'NEWS_ARTICLE',
        action: 'CLEANUP_FACEBOOK_LOGS',
        status: 'SUCCESS',
        message: `Removed ${deleteResult.count} Facebook search log entries`,
        metadata: { deletedCount: deleteResult.count }
      }
    })

    return NextResponse.json({
      success: true,
      deletedCount: deleteResult.count,
      message: `Successfully removed ${deleteResult.count} Facebook search log entries`
    })
  } catch (error) {
    console.error('Facebook logs cleanup error:', error)
    
    // Log the error
    await prisma.monitoringLog.create({
      data: {
        sourceType: 'NEWS_ARTICLE',
        action: 'CLEANUP_FACEBOOK_LOGS',
        status: 'ERROR',
        message: `Failed to cleanup Facebook logs: ${error}`,
        metadata: { error: String(error) }
      }
    })

    return NextResponse.json(
      { 
        success: false, 
        error: 'Failed to cleanup Facebook logs',
        details: String(error)
      },
      { status: 500 }
    )
  }
}