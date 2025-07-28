import { NextRequest, NextResponse } from 'next/server'
import { openaiAnalytics } from '@/lib/openai-analytics'
import { prisma } from '@/lib/prisma'

export async function POST(request: NextRequest) {
  try {
    console.log('🚀 Starting OpenAI analytics update...')
    
    // Log the update attempt
    await prisma.monitoringLog.create({
      data: {
        sourceType: 'NEWS_ARTICLE',
        action: 'openai_analytics_update',
        status: 'STARTED',
        message: 'OpenAI analytics update initiated',
        metadata: {
          timestamp: new Date().toISOString(),
          requestOrigin: 'manual_trigger'
        }
      }
    })

    // Run the OpenAI analytics update
    await openaiAnalytics.updateConflictAnalytics()

    // Log success
    await prisma.monitoringLog.create({
      data: {
        sourceType: 'NEWS_ARTICLE',
        action: 'openai_analytics_update',
        status: 'SUCCESS',
        message: 'OpenAI analytics update completed successfully',
        metadata: {
          timestamp: new Date().toISOString(),
          requestOrigin: 'manual_trigger'
        }
      }
    })

    return NextResponse.json({
      success: true,
      message: 'OpenAI analytics updated successfully',
      timestamp: new Date().toISOString()
    })

  } catch (error) {
    console.error('OpenAI analytics update error:', error)
    
    // Log error
    await prisma.monitoringLog.create({
      data: {
        sourceType: 'NEWS_ARTICLE',
        action: 'openai_analytics_update',
        status: 'ERROR',
        message: `OpenAI analytics update failed: ${error instanceof Error ? error.message : 'Unknown error'}`,
        metadata: {
          timestamp: new Date().toISOString(),
          error: error instanceof Error ? error.stack : String(error),
          requestOrigin: 'manual_trigger'
        }
      }
    })

    return NextResponse.json(
      { 
        success: false, 
        error: 'Failed to update OpenAI analytics',
        details: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    )
  }
}

export async function GET(request: NextRequest) {
  try {
    // Get the latest OpenAI analytics analysis
    const analysis = await openaiAnalytics.getCurrentConflictAnalysis()
    
    return NextResponse.json({
      success: true,
      data: analysis,
      message: 'Real-time OpenAI conflict analysis retrieved'
    })

  } catch (error) {
    console.error('Error fetching OpenAI analysis:', error)
    
    return NextResponse.json(
      { 
        success: false, 
        error: 'Failed to fetch OpenAI analysis',
        details: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    )
  }
}