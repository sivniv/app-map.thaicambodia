'use client'

import { useState, useEffect } from 'react'

interface SchedulerStatus {
  success: boolean
  activeJobs: string[]
  isInitialized: boolean
  message: string
}

export default function SchedulerControl() {
  const [status, setStatus] = useState<SchedulerStatus | null>(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string>('')

  const fetchStatus = async () => {
    try {
      const response = await fetch('/api/scheduler')
      const data = await response.json()
      setStatus(data)
      setError('')
    } catch (err) {
      setError('Failed to fetch scheduler status')
      console.error('Error fetching scheduler status:', err)
    }
  }

  const handleAction = async (action: 'initialize' | 'stop') => {
    setLoading(true)
    setError('')
    
    try {
      const response = await fetch('/api/scheduler', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ action }),
      })

      const data = await response.json()
      
      if (data.success) {
        await fetchStatus() // Refresh status
      } else {
        setError(data.error || 'Operation failed')
      }
    } catch (err) {
      setError('Failed to perform action')
      console.error('Error performing scheduler action:', err)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchStatus()
    const interval = setInterval(fetchStatus, 30000) // Refresh every 30 seconds
    return () => clearInterval(interval)
  }, [])

  return (
    <div className="bg-white rounded-lg shadow p-6">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-medium text-gray-900">Monitoring Scheduler</h3>
        <button
          onClick={fetchStatus}
          className="text-sm text-blue-600 hover:text-blue-800"
        >
          Refresh
        </button>
      </div>

      {error && (
        <div className="mb-4 p-3 bg-red-100 border border-red-300 text-red-700 rounded">
          {error}
        </div>
      )}

      {status && (
        <div className="space-y-4">
          <div className="flex items-center space-x-2">
            <div className={`w-3 h-3 rounded-full ${
              status.isInitialized ? 'bg-green-500' : 'bg-red-500'
            }`}></div>
            <span className="text-sm text-gray-600">
              {status.message}
            </span>
          </div>

          {status.activeJobs.length > 0 && (
            <div>
              <h4 className="text-sm font-medium text-gray-700 mb-2">Active Jobs:</h4>
              <div className="space-y-1">
                {status.activeJobs.map((job) => (
                  <div key={job} className="text-sm text-gray-600 bg-gray-50 px-2 py-1 rounded">
                    📅 {job.replace('-', ' ')}
                  </div>
                ))}
              </div>
            </div>
          )}

          <div className="flex space-x-3">
            <button
              onClick={() => handleAction('initialize')}
              disabled={loading || status.isInitialized}
              className="px-4 py-2 bg-green-600 text-white text-sm rounded-md hover:bg-green-700 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? 'Processing...' : 'Start Scheduler'}
            </button>
            
            <button
              onClick={() => handleAction('stop')}
              disabled={loading || !status.isInitialized}
              className="px-4 py-2 bg-red-600 text-white text-sm rounded-md hover:bg-red-700 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? 'Processing...' : 'Stop Scheduler'}
            </button>
          </div>

          <div className="text-xs text-gray-500 mt-4">
            <p><strong>Scheduled Jobs:</strong></p>
            <ul className="mt-1 space-y-1">
              <li>• Facebook monitoring: Every 30 minutes (8 AM - 8 PM)</li>
              <li>• Facebook off-hours: Every 2 hours (8 PM - 8 AM)</li>
              <li>• News monitoring: Every 15 minutes</li>
            </ul>
          </div>
        </div>
      )}
    </div>
  )
}