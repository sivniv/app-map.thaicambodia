import { NextRequest, NextResponse } from 'next/server'
import { openaiAnalytics } from '@/lib/openai-analytics'
import { prisma } from '@/lib/prisma'

// This endpoint will be called by a cron service every 12 hours
export async function POST(request: NextRequest) {
  try {
    // Verify the request is from a valid cron service
    const authHeader = request.headers.get('authorization')
    const cronSecret = process.env.CRON_SECRET || 'development-cron-secret'
    
    if (authHeader !== `Bearer ${cronSecret}`) {
      return NextResponse.json(
        { error: 'Unauthorized cron request' },
        { status: 401 }
      )
    }

    console.log('⏰ Cron job: Starting scheduled OpenAI analytics update...')
    
    // Log the cron update attempt
    await prisma.monitoringLog.create({
      data: {
        sourceType: 'NEWS_ARTICLE',
        action: 'openai_analytics_cron',
        status: 'STARTED',
        message: 'Scheduled OpenAI analytics update initiated by cron',
        metadata: {
          timestamp: new Date().toISOString(),
          requestOrigin: 'cron_scheduler',
          cronType: '12_hour_update'
        }
      }
    })

    // Run the OpenAI analytics update
    await openaiAnalytics.updateConflictAnalytics()

    // Log success
    await prisma.monitoringLog.create({
      data: {
        sourceType: 'NEWS_ARTICLE',
        action: 'openai_analytics_cron',
        status: 'SUCCESS',
        message: 'Scheduled OpenAI analytics update completed successfully',
        metadata: {
          timestamp: new Date().toISOString(),
          requestOrigin: 'cron_scheduler',
          cronType: '12_hour_update',
          nextScheduledUpdate: new Date(Date.now() + 12 * 60 * 60 * 1000).toISOString()
        }
      }
    })

    console.log('✅ Cron job: OpenAI analytics update completed successfully')

    return NextResponse.json({
      success: true,
      message: 'Scheduled OpenAI analytics update completed',
      timestamp: new Date().toISOString(),
      nextUpdate: new Date(Date.now() + 12 * 60 * 60 * 1000).toISOString()
    })

  } catch (error) {
    console.error('❌ Cron job: OpenAI analytics update error:', error)
    
    // Log error
    await prisma.monitoringLog.create({
      data: {
        sourceType: 'NEWS_ARTICLE',
        action: 'openai_analytics_cron',
        status: 'ERROR',
        message: `Scheduled OpenAI analytics update failed: ${error instanceof Error ? error.message : 'Unknown error'}`,
        metadata: {
          timestamp: new Date().toISOString(),
          error: error instanceof Error ? error.stack : String(error),
          requestOrigin: 'cron_scheduler',
          cronType: '12_hour_update'
        }
      }
    })

    return NextResponse.json(
      { 
        success: false, 
        error: 'Scheduled OpenAI analytics update failed',
        details: error instanceof Error ? error.message : 'Unknown error',
        timestamp: new Date().toISOString()
      },
      { status: 500 }
    )
  }
}

// GET endpoint to check cron job status and next scheduled update
export async function GET(request: NextRequest) {
  try {
    // Get the latest cron logs
    const recentLogs = await prisma.monitoringLog.findMany({
      where: {
        action: 'openai_analytics_cron'
      },
      orderBy: {
        createdAt: 'desc'
      },
      take: 10
    })

    // Get the latest successful update
    const lastSuccessfulUpdate = await prisma.monitoringLog.findFirst({
      where: {
        action: 'openai_analytics_cron',
        status: 'SUCCESS'
      },
      orderBy: {
        createdAt: 'desc'
      }
    })

    // Calculate next scheduled update (12 hours from last successful update)
    const nextUpdateTime = lastSuccessfulUpdate 
      ? new Date(lastSuccessfulUpdate.createdAt.getTime() + 12 * 60 * 60 * 1000)
      : new Date(Date.now() + 12 * 60 * 60 * 1000)

    return NextResponse.json({
      success: true,
      cronStatus: {
        lastUpdate: lastSuccessfulUpdate?.createdAt || null,
        nextScheduledUpdate: nextUpdateTime.toISOString(),
        hoursUntilNext: Math.max(0, Math.ceil((nextUpdateTime.getTime() - Date.now()) / (1000 * 60 * 60))),
        isOverdue: nextUpdateTime < new Date(),
        recentLogs: recentLogs.map(log => ({
          timestamp: log.createdAt,
          status: log.status,
          message: log.message
        }))
      }
    })

  } catch (error) {
    console.error('Error fetching cron status:', error)
    
    return NextResponse.json(
      { 
        success: false, 
        error: 'Failed to fetch cron status',
        details: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    )
  }
}