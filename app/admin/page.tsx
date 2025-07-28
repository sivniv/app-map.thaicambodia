'use client'

import { useState, useEffect } from 'react'
import { format } from 'date-fns'
import SchedulerControl from '@/components/SchedulerControl'

interface MonitoringLog {
  id: string
  sourceType: string
  action: string
  status: string
  message?: string
  metadata?: any
  createdAt: string
}

interface Source {
  id: string
  name: string
  type: string
  url: string
  isActive: boolean
  description?: string
}

interface ConflictAnalytics {
  id: string
  date: string
  thailandCasualties: number
  cambodiaCasualties: number
  totalCasualties: number
  casualtiesVerified: boolean
  affectedPopulation: number
  displacedCivilians: number
  affectedAreas: string[]
  weaponTypesReported: string[]
  militaryActivity?: string
  economicLoss?: number
  tradeDisruption: boolean
  borderStatus?: string
  diplomaticTension: number
  officialStatements: number
  meetingsScheduled: number
  dailySummary?: string
  keyDevelopments: string[]
  riskAssessment: number
  confidenceScore: number
  sourcesAnalyzed: number
  verificationLevel: string
}

export default function AdminDashboard() {
  const [logs, setLogs] = useState<MonitoringLog[]>([])
  const [sources, setSources] = useState<Source[]>([])
  const [analytics, setAnalytics] = useState<ConflictAnalytics | null>(null)
  const [loading, setLoading] = useState(true)
  const [activeTab, setActiveTab] = useState<'logs' | 'sources' | 'monitoring' | 'analytics'>('logs')

  useEffect(() => {
    fetchData()
  }, [])

  const fetchData = async () => {
    try {
      const [logsRes, sourcesRes, analyticsRes] = await Promise.all([
        fetch('/api/admin/logs'),
        fetch('/api/admin/sources'),
        fetch('/api/admin/conflict-analytics'),
      ])

      if (logsRes.ok) {
        const logsData = await logsRes.json()
        setLogs(logsData)
      }

      if (sourcesRes.ok) {
        const sourcesData = await sourcesRes.json()
        setSources(sourcesData)
      }

      if (analyticsRes.ok) {
        const analyticsData = await analyticsRes.json()
        setAnalytics(analyticsData)
      }
    } catch (error) {
      console.error('Failed to fetch admin data:', error)
    } finally {
      setLoading(false)
    }
  }

  const triggerMonitoring = async (type: 'news' | 'official-pages') => {
    try {
      let endpoint: string
      switch (type) {
        case 'news':
          endpoint = '/api/monitor/news'
          break
        case 'official-pages':
          endpoint = '/api/monitor/official-pages'
          break
      }
      
      const response = await fetch(endpoint, { method: 'POST' })
      
      if (response.ok) {
        const result = await response.json()
        const displayType = type === 'official-pages' ? 'Official Pages' : type
        alert(`${displayType} monitoring completed successfully`)
        fetchData()
      } else {
        alert(`Failed to trigger ${type} monitoring`)
      }
    } catch (error) {
      alert(`Error triggering ${type} monitoring`)
    }
  }

  const triggerAnalytics = async (type: 'daily' | 'weekly') => {
    try {
      const endpoint = type === 'daily' ? '/api/analytics/daily-summary' : '/api/analytics/weekly-trends'
      const response = await fetch(endpoint, { method: 'POST' })
      
      if (response.ok) {
        const result = await response.json()
        alert(`${type} analytics completed successfully`)
        fetchData()
      } else {
        alert(`Failed to trigger ${type} analytics`)
      }
    } catch (error) {
      alert(`Error triggering ${type} analytics`)
    }
  }

  const cleanupDuplicates = async () => {
    if (!confirm('This will remove duplicate articles. Continue?')) {
      return
    }

    try {
      const response = await fetch('/api/admin/cleanup-duplicates', { method: 'POST' })
      const data = await response.json()
      
      if (data.success) {
        alert(`Cleanup complete! Removed ${data.totalRemoved} duplicate articles`)
        fetchData()
      } else {
        alert('Cleanup failed: ' + data.error)
      }
    } catch (error) {
      alert('Error during cleanup: ' + error)
    }
  }

  const cleanupFacebookLogs = async () => {
    if (!confirm('This will remove all Facebook search log entries. Continue?')) {
      return
    }

    try {
      const response = await fetch('/api/admin/cleanup-facebook-logs', { method: 'POST' })
      const data = await response.json()
      
      if (data.success) {
        alert(`Cleanup complete! Removed ${data.deletedCount} Facebook search log entries`)
        fetchData()
      } else {
        alert('Cleanup failed: ' + data.error)
      }
    } catch (error) {
      alert('Error during cleanup: ' + error)
    }
  }

  const toggleSource = async (sourceId: string, isActive: boolean) => {
    try {
      const response = await fetch(`/api/admin/sources/${sourceId}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ isActive: !isActive }),
      })

      if (response.ok) {
        fetchData()
      }
    } catch (error) {
      console.error('Failed to toggle source:', error)
    }
  }

  const saveAnalytics = async (analyticsData: Partial<ConflictAnalytics>) => {
    try {
      const response = await fetch('/api/admin/conflict-analytics', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...analyticsData,
          date: analyticsData.date || new Date().toISOString().split('T')[0]
        }),
      })

      if (response.ok) {
        const updatedAnalytics = await response.json()
        setAnalytics(updatedAnalytics)
        alert('Analytics updated successfully!')
      } else {
        alert('Failed to update analytics')
      }
    } catch (error) {
      console.error('Failed to save analytics:', error)
      alert('Error saving analytics: ' + error)
    }
  }

  const getStatusColor = (status: string) => {
    switch (status.toLowerCase()) {
      case 'success':
        return 'text-green-600 bg-green-100'
      case 'error':
        return 'text-red-600 bg-red-100'
      case 'info':
        return 'text-blue-600 bg-blue-100'
      default:
        return 'text-gray-600 bg-gray-100'
    }
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16">
            <div className="flex items-center">
              <h1 className="text-xl font-semibold text-gray-900">
                Admin Dashboard
              </h1>
            </div>
            <div className="flex items-center space-x-3">
              <button
                onClick={() => triggerMonitoring('official-pages')}
                className="px-3 py-2 bg-orange-600 text-white text-sm rounded-md hover:bg-orange-700"
              >
                Official Pages
              </button>
              <button
                onClick={() => triggerMonitoring('news')}
                className="px-3 py-2 bg-green-600 text-white text-sm rounded-md hover:bg-green-700"
              >
                News Monitoring
              </button>
              <button
                onClick={() => triggerAnalytics('daily')}
                className="px-3 py-2 bg-purple-600 text-white text-sm rounded-md hover:bg-purple-700"
              >
                Daily Analytics
              </button>
              <button
                onClick={() => triggerAnalytics('weekly')}
                className="px-3 py-2 bg-indigo-600 text-white text-sm rounded-md hover:bg-indigo-700"
              >
                Weekly Trends
              </button>
            </div>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-6">
          <nav className="flex space-x-8">
            <button
              onClick={() => setActiveTab('logs')}
              className={`py-2 px-1 border-b-2 font-medium text-sm ${
                activeTab === 'logs'
                  ? 'border-indigo-500 text-indigo-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }`}
            >
              Monitoring Logs
            </button>
            <button
              onClick={() => setActiveTab('sources')}
              className={`py-2 px-1 border-b-2 font-medium text-sm ${
                activeTab === 'sources'
                  ? 'border-indigo-500 text-indigo-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }`}
            >
              Sources
            </button>
            <button
              onClick={() => setActiveTab('monitoring')}
              className={`py-2 px-1 border-b-2 font-medium text-sm ${
                activeTab === 'monitoring'
                  ? 'border-indigo-500 text-indigo-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }`}
            >
              Monitoring Status
            </button>
            <button
              onClick={() => setActiveTab('analytics')}
              className={`py-2 px-1 border-b-2 font-medium text-sm ${
                activeTab === 'analytics'
                  ? 'border-indigo-500 text-indigo-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }`}
            >
              Conflict Analytics
            </button>
          </nav>
        </div>

        {activeTab === 'logs' && (
          <div className="bg-white shadow rounded-lg">
            <div className="px-6 py-4 border-b border-gray-200">
              <h3 className="text-lg font-medium text-gray-900">Recent Monitoring Logs</h3>
            </div>
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Timestamp
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Source Type
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Action
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Status
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Message
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {logs.map((log) => (
                    <tr key={log.id}>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        {format(new Date(log.createdAt), 'MMM d, yyyy HH:mm:ss')}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        {log.sourceType}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        {log.action}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusColor(log.status)}`}>
                          {log.status}
                        </span>
                      </td>
                      <td className="px-6 py-4 text-sm text-gray-900 max-w-xs truncate">
                        {log.message}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {activeTab === 'sources' && (
          <div className="bg-white shadow rounded-lg">
            <div className="px-6 py-4 border-b border-gray-200">
              <h3 className="text-lg font-medium text-gray-900">Monitoring Sources</h3>
            </div>
            <div className="divide-y divide-gray-200">
              {sources.map((source) => (
                <div key={source.id} className="p-6 flex items-center justify-between">
                  <div className="flex-1">
                    <div className="flex items-center">
                      <h4 className="text-sm font-medium text-gray-900">{source.name}</h4>
                      <span className={`ml-2 inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                        source.type === 'FACEBOOK_POST' ? 'bg-blue-100 text-blue-800' : 'bg-green-100 text-green-800'
                      }`}>
                        {source.type}
                      </span>
                    </div>
                    <p className="mt-1 text-sm text-gray-500">{source.description || source.url}</p>
                  </div>
                  <div className="flex items-center space-x-4">
                    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                      source.isActive ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                    }`}>
                      {source.isActive ? 'Active' : 'Inactive'}
                    </span>
                    <button
                      onClick={() => toggleSource(source.id, source.isActive)}
                      className={`px-3 py-1 text-xs rounded-md ${
                        source.isActive
                          ? 'bg-red-100 text-red-700 hover:bg-red-200'
                          : 'bg-green-100 text-green-700 hover:bg-green-200'
                      }`}
                    >
                      {source.isActive ? 'Disable' : 'Enable'}
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {activeTab === 'monitoring' && (
          <div className="space-y-6">
            <div className="grid grid-cols-1 gap-6">
              <SchedulerControl />
            </div>
            
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <div className="bg-white shadow rounded-lg p-6">
              <h3 className="text-lg font-medium text-gray-900 mb-4">System Health</h3>
              <div className="space-y-4">
                <div className="flex justify-between items-center">
                  <span className="text-sm text-gray-600">Database Connection</span>
                  <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                    Connected
                  </span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm text-gray-600">OpenAI API</span>
                  <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                    Available
                  </span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm text-gray-600">News RSS Feeds</span>
                  <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                    Available
                  </span>
                </div>
              </div>
            </div>

            <div className="bg-white shadow rounded-lg p-6">
              <h3 className="text-lg font-medium text-gray-900 mb-4">Manual Actions</h3>
              <div className="space-y-3">
                <button
                  onClick={() => triggerMonitoring('news')}
                  className="w-full px-4 py-2 bg-green-600 text-white text-sm rounded-md hover:bg-green-700"
                >
                  🗞️ Run News Monitoring
                </button>
                <button
                  onClick={() => fetchData()}
                  className="w-full px-4 py-2 bg-purple-600 text-white text-sm rounded-md hover:bg-purple-700"
                >
                  🔄 Refresh Dashboard
                </button>
                <button
                  onClick={cleanupDuplicates}
                  className="w-full px-4 py-2 bg-orange-600 text-white text-sm rounded-md hover:bg-orange-700"
                >
                  🧹 Remove Duplicates
                </button>
                <button
                  onClick={cleanupFacebookLogs}
                  className="w-full px-4 py-2 bg-red-600 text-white text-sm rounded-md hover:bg-red-700"
                >
                  🗑️ Clean Facebook Logs
                </button>
                <button
                  onClick={() => window.location.href = '/'}
                  className="w-full px-4 py-2 bg-gray-600 text-white text-sm rounded-md hover:bg-gray-700"
                >
                  📊 View Public Dashboard
                </button>
              </div>
            </div>
          </div>
          </div>
        )}

        {activeTab === 'analytics' && (
          <div className="bg-white shadow rounded-lg">
            <div className="px-6 py-4 border-b border-gray-200">
              <h3 className="text-lg font-medium text-gray-900">Edit Conflict Analytics Dashboard</h3>
              <p className="text-sm text-gray-600 mt-1">Manually edit the values shown on the public dashboard</p>
            </div>
            <AnalyticsEditor analytics={analytics} onSave={saveAnalytics} />
          </div>
        )}
      </main>
    </div>
  )
}

// Analytics Editor Component
function AnalyticsEditor({ 
  analytics, 
  onSave 
}: { 
  analytics: ConflictAnalytics | null
  onSave: (data: Partial<ConflictAnalytics>) => void 
}) {
  const [formData, setFormData] = useState<Partial<ConflictAnalytics>>({
    date: new Date().toISOString().split('T')[0],
    thailandCasualties: 0,
    cambodiaCasualties: 0,
    totalCasualties: 0,
    casualtiesVerified: false,
    affectedPopulation: 0,
    displacedCivilians: 0,
    affectedAreas: [],
    weaponTypesReported: [],
    militaryActivity: '',
    economicLoss: 0,
    tradeDisruption: false,
    borderStatus: 'OPEN',
    diplomaticTension: 1,
    officialStatements: 0,
    meetingsScheduled: 0,
    dailySummary: '',
    keyDevelopments: [],
    riskAssessment: 1,
    confidenceScore: 0.0,
    sourcesAnalyzed: 0,
    verificationLevel: 'UNVERIFIED'
  })

  useEffect(() => {
    if (analytics) {
      setFormData({
        date: analytics.date ? new Date(analytics.date).toISOString().split('T')[0] : new Date().toISOString().split('T')[0],
        thailandCasualties: analytics.thailandCasualties || 0,
        cambodiaCasualties: analytics.cambodiaCasualties || 0,
        totalCasualties: analytics.totalCasualties || 0,
        casualtiesVerified: analytics.casualtiesVerified || false,
        affectedPopulation: analytics.affectedPopulation || 0,
        displacedCivilians: analytics.displacedCivilians || 0,
        affectedAreas: analytics.affectedAreas || [],
        weaponTypesReported: analytics.weaponTypesReported || [],
        militaryActivity: analytics.militaryActivity || '',
        economicLoss: analytics.economicLoss || 0,
        tradeDisruption: analytics.tradeDisruption || false,
        borderStatus: analytics.borderStatus || 'OPEN',
        diplomaticTension: analytics.diplomaticTension || 1,
        officialStatements: analytics.officialStatements || 0,
        meetingsScheduled: analytics.meetingsScheduled || 0,
        dailySummary: analytics.dailySummary || '',
        keyDevelopments: analytics.keyDevelopments || [],
        riskAssessment: analytics.riskAssessment || 1,
        confidenceScore: analytics.confidenceScore || 0.0,
        sourcesAnalyzed: analytics.sourcesAnalyzed || 0,
        verificationLevel: analytics.verificationLevel || 'UNVERIFIED'
      })
    }
  }, [analytics])

  const handleInputChange = (field: string, value: any) => {
    setFormData(prev => ({ ...prev, [field]: value }))
  }

  const handleArrayChange = (field: string, value: string) => {
    const items = value.split(',').map(item => item.trim()).filter(item => item.length > 0)
    setFormData(prev => ({ ...prev, [field]: items }))
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    onSave(formData)
  }

  return (
    <form onSubmit={handleSubmit} className="p-6 space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {/* Date */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Date</label>
          <input
            type="date"
            value={formData.date || ''}
            onChange={(e) => handleInputChange('date', e.target.value)}
            className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm"
          />
        </div>

        {/* Casualties */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Thailand Casualties</label>
          <input
            type="number"
            value={formData.thailandCasualties || 0}
            onChange={(e) => handleInputChange('thailandCasualties', parseInt(e.target.value) || 0)}
            className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Cambodia Casualties</label>
          <input
            type="number"
            value={formData.cambodiaCasualties || 0}
            onChange={(e) => handleInputChange('cambodiaCasualties', parseInt(e.target.value) || 0)}
            className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Total Casualties</label>
          <input
            type="number"
            value={formData.totalCasualties || 0}
            onChange={(e) => handleInputChange('totalCasualties', parseInt(e.target.value) || 0)}
            className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm"
          />
        </div>

        {/* Population Impact */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Affected Population</label>
          <input
            type="number"
            value={formData.affectedPopulation || 0}
            onChange={(e) => handleInputChange('affectedPopulation', parseInt(e.target.value) || 0)}
            className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Displaced Civilians</label>
          <input
            type="number"
            value={formData.displacedCivilians || 0}
            onChange={(e) => handleInputChange('displacedCivilians', parseInt(e.target.value) || 0)}
            className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm"
          />
        </div>

        {/* Risk & Tension */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Risk Level (1-10)</label>
          <input
            type="number"
            min="1"
            max="10"
            value={formData.riskAssessment || 1}
            onChange={(e) => handleInputChange('riskAssessment', parseInt(e.target.value) || 1)}
            className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Diplomatic Tension (1-10)</label>
          <input
            type="number"
            min="1"
            max="10"
            value={formData.diplomaticTension || 1}
            onChange={(e) => handleInputChange('diplomaticTension', parseInt(e.target.value) || 1)}
            className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Border Status</label>
          <select
            value={formData.borderStatus || 'OPEN'}
            onChange={(e) => handleInputChange('borderStatus', e.target.value)}
            className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm"
          >
            <option value="OPEN">Open</option>
            <option value="RESTRICTED">Restricted</option>
            <option value="CLOSED">Closed</option>
            <option value="UNKNOWN">Unknown</option>
          </select>
        </div>

        {/* Checkboxes */}
        <div className="flex items-center">
          <input
            type="checkbox"
            id="casualties-verified"
            checked={formData.casualtiesVerified || false}
            onChange={(e) => handleInputChange('casualtiesVerified', e.target.checked)}
            className="mr-2"
          />
          <label htmlFor="casualties-verified" className="text-sm text-gray-700">Casualties Verified</label>
        </div>

        <div className="flex items-center">
          <input
            type="checkbox"
            id="trade-disruption"
            checked={formData.tradeDisruption || false}
            onChange={(e) => handleInputChange('tradeDisruption', e.target.checked)}
            className="mr-2"
          />
          <label htmlFor="trade-disruption" className="text-sm text-gray-700">Trade Disruption</label>
        </div>
      </div>

      {/* Arrays - full width */}
      <div className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Affected Areas (comma-separated)</label>
          <input
            type="text"
            value={formData.affectedAreas?.join(', ') || ''}
            onChange={(e) => handleArrayChange('affectedAreas', e.target.value)}
            placeholder="e.g., Bangkok, Phnom Penh, Border Region"
            className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Weapon Types (comma-separated)</label>
          <input
            type="text"
            value={formData.weaponTypesReported?.join(', ') || ''}
            onChange={(e) => handleArrayChange('weaponTypesReported', e.target.value)}
            placeholder="e.g., Artillery, Small Arms, Tanks"
            className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Key Developments (comma-separated)</label>
          <input
            type="text"
            value={formData.keyDevelopments?.join(', ') || ''}
            onChange={(e) => handleArrayChange('keyDevelopments', e.target.value)}
            placeholder="e.g., Ceasefire talks announced, Border checkpoint closed"
            className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Daily Summary</label>
          <textarea
            value={formData.dailySummary || ''}
            onChange={(e) => handleInputChange('dailySummary', e.target.value)}
            rows={4}
            className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm"
            placeholder="Enter a comprehensive daily summary of the conflict situation..."
          />
        </div>
      </div>

      {/* Submit Button */}
      <div className="flex justify-end">
        <button
          type="submit"
          className="px-6 py-2 bg-blue-600 text-white text-sm font-medium rounded-md hover:bg-blue-700"
        >
          Save Changes
        </button>
      </div>
    </form>
  )
}