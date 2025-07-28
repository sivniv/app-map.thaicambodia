import { NextRequest, NextResponse } from 'next/server'
import { monitoringScheduler } from '@/lib/scheduler'

export async function GET() {
  try {
    const activeJobs = monitoringScheduler.getActiveJobs()
    
    return NextResponse.json({
      success: true,
      activeJobs,
      isInitialized: activeJobs.length > 0,
      message: activeJobs.length > 0 ? 'Scheduler is running' : 'Scheduler is not initialized'
    })
  } catch (error) {
    return NextResponse.json(
      { error: 'Failed to get scheduler status', details: String(error) },
      { status: 500 }
    )
  }
}

export async function POST(request: NextRequest) {
  try {
    const { action } = await request.json()
    
    switch (action) {
      case 'initialize':
        await monitoringScheduler.initialize()
        return NextResponse.json({
          success: true,
          message: 'Scheduler initialized successfully',
          activeJobs: monitoringScheduler.getActiveJobs()
        })
        
      case 'stop':
        monitoringScheduler.stopAll()
        return NextResponse.json({
          success: true,
          message: 'All scheduled jobs stopped',
          activeJobs: []
        })
        
      default:
        return NextResponse.json(
          { error: 'Invalid action. Use "initialize" or "stop"' },
          { status: 400 }
        )
    }
  } catch (error) {
    return NextResponse.json(
      { error: 'Scheduler operation failed', details: String(error) },
      { status: 500 }
    )
  }
}