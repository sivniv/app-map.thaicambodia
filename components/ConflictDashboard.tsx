'use client'

import { useState, useEffect } from 'react'
import { useLanguage } from '@/context/LanguageContext'

interface ConflictStats {
  casualties: {
    total: number
    thailand: number
    cambodia: number
    today: number
  }
  population: {
    affected: number
    displaced: number
    affectedAreas: number
    locations: string[]
  }
  weapons: {
    typesReported: number
    types: string[]
  }
  status: {
    riskLevel: number
    diplomaticTension: number
    borderStatus: string
    lastUpdate: string
  }
}

interface ConflictDashboardProps {
  className?: string
  isAdmin?: boolean
}

export default function ConflictDashboard({ className = '', isAdmin = false }: ConflictDashboardProps) {
  const { t } = useLanguage()
  const [stats, setStats] = useState<ConflictStats | null>(null)
  const [loading, setLoading] = useState(true)
  const [todaySummary, setTodaySummary] = useState<string>('')
  const [updating, setUpdating] = useState(false)
  const [lastOpenAIUpdate, setLastOpenAIUpdate] = useState<string>('')

  useEffect(() => {
    fetchConflictStats()
  }, [])

  const fetchConflictStats = async () => {
    try {
      const response = await fetch('/api/analytics/stats?period=30')
      if (response.ok) {
        const data = await response.json()
        setStats(data.overview)
        setTodaySummary(data.todaySummary)
        setLastOpenAIUpdate(data.overview.status.lastUpdate)
      }
    } catch (error) {
      console.error('Failed to fetch conflict stats:', error)
    } finally {
      setLoading(false)
    }
  }

  const triggerOpenAIUpdate = async () => {
    setUpdating(true)
    try {
      const response = await fetch('/api/analytics/openai-update', { method: 'POST' })
      if (response.ok) {
        await fetchConflictStats() // Refresh data after update
        alert('✅ OpenAI analytics updated successfully!')
      } else {
        const errorData = await response.json()
        alert(`❌ Failed to update OpenAI analytics: ${errorData.details || 'Unknown error'}`)
      }
    } catch (error) {
      console.error('Failed to trigger OpenAI update:', error)
      alert('❌ Error triggering OpenAI update')
    } finally {
      setUpdating(false)
    }
  }

  const getRiskLevelColor = (level: number) => {
    if (level >= 8) return 'text-red-600 bg-red-100'
    if (level >= 6) return 'text-orange-600 bg-orange-100'
    if (level >= 4) return 'text-yellow-600 bg-yellow-100'
    return 'text-green-600 bg-green-100'
  }

  const getRiskLevelText = (level: number) => {
    if (level >= 8) return 'Critical'
    if (level >= 6) return t.high
    if (level >= 4) return t.medium
    return t.low
  }

  const getTensionColor = (level: number) => {
    if (level >= 8) return 'text-red-600'
    if (level >= 6) return 'text-orange-600'
    if (level >= 4) return 'text-yellow-600'
    return 'text-green-600'
  }

  const getBorderStatusColor = (status: string) => {
    switch (status.toLowerCase()) {
      case 'closed': return 'text-red-600 bg-red-100'
      case 'restricted': return 'text-yellow-600 bg-yellow-100'
      case 'open': return 'text-green-600 bg-green-100'
      default: return 'text-gray-600 bg-gray-100'
    }
  }

  if (loading) {
    return (
      <div className={`${className} animate-pulse`}>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {[...Array(8)].map((_, i) => (
            <div key={i} className="bg-white rounded-lg shadow p-6">
              <div className="h-4 bg-gray-300 rounded w-3/4 mb-4"></div>
              <div className="h-8 bg-gray-300 rounded w-1/2"></div>
            </div>
          ))}
        </div>
      </div>
    )
  }

  if (!stats) {
    return (
      <div className={className}>
        <div className="bg-white rounded-lg shadow p-6 text-center">
          <p className="text-gray-500">No conflict data available</p>
        </div>
      </div>
    )
  }

  return (
    <div className={className}>
      {/* Header */}
      <div className="mb-6">
        <div className="flex justify-between items-start">
          <div>
            <h2 className="text-2xl font-bold text-gray-900 mb-2">{t.dashboardTitle}</h2>
            <div className="flex items-center space-x-4 text-sm text-gray-600">
              <div className="flex items-center space-x-2">
                <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
                <span>{t.realTimeAnalysis}</span>
              </div>
              <span>•</span>
              <span>{t.lastUpdated}: {new Date(stats.status.lastUpdate).toLocaleString()}</span>
              <span>•</span>
              <span>{t.updatesEvery} 12 {t.hours}</span>
            </div>
          </div>
          {isAdmin && (
            <div className="flex items-center space-x-3">
              <button
                onClick={triggerOpenAIUpdate}
                disabled={updating}
                className={`px-4 py-2 text-sm font-medium rounded-md transition-colors ${
                  updating 
                    ? 'bg-gray-100 text-gray-400 cursor-not-allowed' 
                    : 'bg-indigo-600 text-white hover:bg-indigo-700'
                }`}
              >
                {updating ? (
                  <div className="flex items-center space-x-2">
                    <div className="w-4 h-4 border-2 border-gray-300 border-t-transparent rounded-full animate-spin"></div>
                    <span>Updating...</span>
                  </div>
                ) : (
                  <div className="flex items-center space-x-2">
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                    </svg>
                    <span>{t.updateNow}</span>
                  </div>
                )}
              </button>
              <div className="text-xs text-gray-500 text-right">
                <div>🤖 {t.poweredBy}</div>
                <div className="font-semibold">ChatGPT-4</div>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Main Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        {/* Total Casualties */}
        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center">
            <div className="p-2 bg-red-100 rounded-md">
              <svg className="w-6 h-6 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">{t.totalCasualties}</p>
              <p className="text-2xl font-semibold text-gray-900">{stats.casualties.total}</p>
              <div className="flex text-xs text-gray-500 mt-1">
                <span>🇹🇭 {stats.casualties.thailand}</span>
                <span className="mx-2">•</span>
                <span>🇰🇭 {stats.casualties.cambodia}</span>
              </div>
            </div>
          </div>
        </div>

        {/* Affected Population */}
        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center">
            <div className="p-2 bg-blue-100 rounded-md">
              <svg className="w-6 h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
              </svg>
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">{t.affectedPopulation}</p>
              <p className="text-2xl font-semibold text-gray-900">{stats.population.affected.toLocaleString()}</p>
              {stats.population.displaced > 0 && (
                <p className="text-xs text-gray-500">{stats.population.displaced.toLocaleString()} {t.displaced}</p>
              )}
            </div>
          </div>
        </div>

        {/* Weapon Types */}
        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center">
            <div className="p-2 bg-orange-100 rounded-md">
              <svg className="w-6 h-6 text-orange-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
              </svg>
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">{t.weaponTypes}</p>
              <p className="text-2xl font-semibold text-gray-900">{stats.weapons.typesReported}</p>
              <p className="text-xs text-gray-500">{t.typesReported}</p>
            </div>
          </div>
        </div>

        {/* Risk Level */}
        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center">
            <div className={`p-2 rounded-md ${getRiskLevelColor(stats.status.riskLevel)}`}>
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
              </svg>
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">{t.riskLevel}</p>
              <p className="text-2xl font-semibold text-gray-900">{stats.status.riskLevel}/10</p>
              <p className={`text-xs font-medium ${getRiskLevelColor(stats.status.riskLevel)}`}>
                {getRiskLevelText(stats.status.riskLevel)}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Secondary Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        {/* Diplomatic Tension */}
        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">{t.diplomaticTension}</p>
              <p className={`text-3xl font-bold ${getTensionColor(stats.status.diplomaticTension)}`}>
                {stats.status.diplomaticTension}/10
              </p>
            </div>
            <div className="w-16 h-16">
              <svg className="w-full h-full" viewBox="0 0 36 36">
                <path
                  d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                  fill="none"
                  stroke="#e5e7eb"
                  strokeWidth="2"
                />
                <path
                  d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                  fill="none"
                  stroke={stats.status.diplomaticTension >= 6 ? "#dc2626" : stats.status.diplomaticTension >= 4 ? "#f59e0b" : "#10b981"}
                  strokeWidth="2"
                  strokeDasharray={`${stats.status.diplomaticTension * 10}, 100`}
                />
              </svg>
            </div>
          </div>
        </div>

        {/* Border Status */}
        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">{t.borderStatus}</p>
              <p className={`text-lg font-semibold px-3 py-1 rounded-full inline-block ${getBorderStatusColor(stats.status.borderStatus)}`}>
                {stats.status.borderStatus || 'Unknown'}
              </p>
            </div>
            <svg className="w-12 h-12 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
            </svg>
          </div>
        </div>

        {/* Affected Areas */}
        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">{t.affectedAreas}</p>
              <p className="text-3xl font-bold text-gray-900">{stats.population.affectedAreas}</p>
              <p className="text-xs text-gray-500">{t.locations}</p>
            </div>
            <svg className="w-12 h-12 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 20l-5.447-2.724A1 1 0 013 16.382V5.618a1 1 0 011.447-.894L9 7m0 13l6-3m-6 3V7m6 10l4.553 2.276A1 1 0 0021 18.382V7.618a1 1 0 00-.553-.894L15 4m0 13V4m0 0L9 7" />
            </svg>
          </div>
        </div>
      </div>

      {/* Today's Summary */}
      {todaySummary && (
        <div className="bg-white rounded-lg shadow p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">{t.summary}</h3>
          <div className="prose prose-sm max-w-none">
            <p className="text-gray-700 leading-relaxed whitespace-pre-line">
              {todaySummary}
            </p>
          </div>
        </div>
      )}
    </div>
  )
}