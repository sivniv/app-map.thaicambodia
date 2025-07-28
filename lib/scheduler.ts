import * as cron from 'node-cron'
import { prisma } from './prisma'
import { SourceType } from '@prisma/client'

interface MonitoringJob {
  name: string
  schedule: string
  endpoint: string
  isActive: boolean
}

class MonitoringScheduler {
  private jobs: Map<string, cron.ScheduledTask> = new Map()
  private isInitialized = false

  async initialize() {
    if (this.isInitialized) return

    // Schedule Official Pages monitoring every 3 hours
    this.scheduleJob({
      name: 'official-pages-monitoring',
      schedule: '0 */3 * * *', // Every 3 hours
      endpoint: '/api/monitor/official-pages',
      isActive: true
    })

    // Schedule Facebook search monitoring less frequently (every 2 hours during business hours)
    this.scheduleJob({
      name: 'facebook-search-monitoring',
      schedule: '0 */2 8-20 * * *', // Every 2 hours between 8 AM and 8 PM
      endpoint: '/api/monitor/facebook',
      isActive: true
    })

    // Schedule News monitoring every 15 minutes
    this.scheduleJob({
      name: 'news-monitoring', 
      schedule: '*/15 * * * *', // Every 15 minutes
      endpoint: '/api/monitor/news',
      isActive: true
    })

    // Schedule less frequent Facebook search monitoring during off-hours
    this.scheduleJob({
      name: 'facebook-search-monitoring-offhours',
      schedule: '0 */4 21-23,0-7 * * *', // Every 4 hours during off-hours
      endpoint: '/api/monitor/facebook',
      isActive: true
    })

    // Schedule daily conflict analytics at 11 PM
    this.scheduleJob({
      name: 'daily-conflict-analytics',
      schedule: '0 23 * * *', // Daily at 11:00 PM Bangkok time
      endpoint: '/api/analytics/daily-summary',
      isActive: true
    })

    // Schedule weekly trend analysis on Sunday at 11:30 PM
    this.scheduleJob({
      name: 'weekly-trend-analysis',
      schedule: '30 23 * * 0', // Sunday at 11:30 PM Bangkok time
      endpoint: '/api/analytics/weekly-trends',
      isActive: true
    })

    this.isInitialized = true
    console.log('✅ Monitoring scheduler initialized with conflict analytics')
  }

  private scheduleJob(job: MonitoringJob) {
    if (!job.isActive) return

    const task = cron.schedule(job.schedule, async () => {
      await this.executeJob(job)
    }, {
      timezone: 'Asia/Bangkok' // Thailand timezone
    })

    this.jobs.set(job.name, task)
    task.start()
    
    console.log(`📅 Scheduled job: ${job.name} with schedule: ${job.schedule}`)
  }

  private async executeJob(job: MonitoringJob) {
    try {
      console.log(`🔄 Executing scheduled job: ${job.name}`)

      await prisma.monitoringLog.create({
        data: {
          sourceType: this.getSourceType(job.endpoint),
          action: 'scheduled_monitoring',
          status: 'INFO',
          message: `Scheduled ${job.name} started`,
          metadata: {
            jobName: job.name,
            schedule: job.schedule,
            timestamp: new Date().toISOString()
          }
        }
      })

      // Make HTTP request to the monitoring endpoint
      const baseUrl = process.env.NEXTAUTH_URL || 'http://localhost:3000'
      const response = await fetch(`${baseUrl}${job.endpoint}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
      })

      if (!response.ok) {
        throw new Error(`HTTP ${response.status}: ${response.statusText}`)
      }

      const result = await response.json()
      
      await prisma.monitoringLog.create({
        data: {
          sourceType: this.getSourceType(job.endpoint),
          action: 'scheduled_monitoring',
          status: 'SUCCESS',
          message: `Scheduled ${job.name} completed successfully`,
          metadata: {
            jobName: job.name,
            result,
            timestamp: new Date().toISOString()
          }
        }
      })

      console.log(`✅ Scheduled job ${job.name} completed:`, result)
    } catch (error) {
      console.error(`❌ Scheduled job ${job.name} failed:`, error)

      await prisma.monitoringLog.create({
        data: {
          sourceType: this.getSourceType(job.endpoint),
          action: 'scheduled_monitoring',
          status: 'ERROR',
          message: `Scheduled ${job.name} failed: ${error instanceof Error ? error.message : 'Unknown error'}`,
          metadata: {
            jobName: job.name,
            error: String(error),
            timestamp: new Date().toISOString()
          }
        }
      })
    }
  }

  private getSourceType(endpoint: string): SourceType {
    if (endpoint.includes('/official-pages')) {
      return SourceType.FACEBOOK_POST
    } else if (endpoint.includes('/facebook')) {
      return SourceType.FACEBOOK_POST
    } else if (endpoint.includes('/news')) {
      return SourceType.NEWS_ARTICLE
    } else if (endpoint.includes('/analytics')) {
      return SourceType.NEWS_ARTICLE  // Default to NEWS_ARTICLE for analytics
    }
    return SourceType.NEWS_ARTICLE  // Default fallback
  }

  stopJob(name: string) {
    const task = this.jobs.get(name)
    if (task) {
      task.stop()
      this.jobs.delete(name)
      console.log(`⏹️ Stopped job: ${name}`)
    }
  }

  stopAll() {
    this.jobs.forEach((task, name) => {
      task.stop()
      console.log(`⏹️ Stopped job: ${name}`)
    })
    this.jobs.clear()
    this.isInitialized = false
  }

  getActiveJobs(): string[] {
    return Array.from(this.jobs.keys())
  }

  isJobActive(name: string): boolean {
    return this.jobs.has(name)
  }
}

// Export singleton instance
export const monitoringScheduler = new MonitoringScheduler()

// Auto-initialize in production or when explicitly enabled
if (process.env.NODE_ENV === 'production' || process.env.ENABLE_SCHEDULER === 'true') {
  monitoringScheduler.initialize().catch(console.error)
}