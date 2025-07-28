'use client'

import { useState, useEffect, useCallback } from 'react'
import Link from 'next/link'
import Timeline from '@/components/Timeline'
import EnhancedTimeline from '@/components/EnhancedTimeline'
import TimelineGraph from '@/components/TimelineGraph'
import ArticleCard from '@/components/ArticleCard'
import SourceFilter from '@/components/SourceFilter'
import ConflictDashboard from '@/components/ConflictDashboard'

interface Stats {
  totalArticles: number
  todayArticles: number
  activeSources: number
  pendingAnalysis: number
}

export default function Home() {
  const [articles, setArticles] = useState<any[]>([])
  const [stats, setStats] = useState<Stats>({
    totalArticles: 0,
    todayArticles: 0,
    activeSources: 0,
    pendingAnalysis: 0,
  })
  const [loading, setLoading] = useState(true)
  const [selectedSourceId, setSelectedSourceId] = useState<string | null>(null)
  const [selectedSourceName, setSelectedSourceName] = useState<string | null>(null)
  const [isAdmin, setIsAdmin] = useState(false)
  const [clickCount, setClickCount] = useState(0)

  const fetchData = useCallback(async () => {
    try {
      // Build API URLs with filters
      const articlesUrl = selectedSourceId 
        ? `/api/articles?limit=5&sourceId=${selectedSourceId}`
        : '/api/articles?limit=5'
      
      const [articlesRes, statsRes] = await Promise.all([
        fetch(articlesUrl),
        fetch('/api/stats'),
      ])

      if (articlesRes.ok) {
        const articlesData = await articlesRes.json()
        setArticles(articlesData.articles || [])
      }

      if (statsRes.ok) {
        const statsData = await statsRes.json()
        setStats(statsData)
      }
    } catch (error) {
      console.error('Failed to fetch data:', error)
    } finally {
      setLoading(false)
    }
  }, [selectedSourceId])

  useEffect(() => {
    fetchData()
    // Check admin status from localStorage
    const adminStatus = localStorage.getItem('isAdmin') === 'true'
    setIsAdmin(adminStatus)
  }, [fetchData])

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
        fetchData() // Refresh data after monitoring
        const displayType = type === 'official-pages' ? 'Official Pages' : type
        alert(`${displayType} monitoring completed successfully`)
      } else {
        alert(`Failed to trigger ${type} monitoring`)
      }
    } catch (error) {
      console.error('Failed to trigger monitoring:', error)
      alert(`Error triggering ${type} monitoring`)
    }
  }

  const handleFilterChange = (sourceId: string | null, sourceName: string | null) => {
    setSelectedSourceId(sourceId)
    setSelectedSourceName(sourceName)
  }

  const toggleAdmin = () => {
    if (isAdmin) {
      // If already admin, disable immediately
      setIsAdmin(false)
      setClickCount(0)
      localStorage.setItem('isAdmin', 'false')
    } else {
      // Require 3 clicks to enable admin mode
      const newCount = clickCount + 1
      setClickCount(newCount)
      
      if (newCount >= 3) {
        setIsAdmin(true)
        setClickCount(0)
        localStorage.setItem('isAdmin', 'true')
      } else {
        // Reset click count after 2 seconds if not completed
        setTimeout(() => {
          setClickCount(0)
        }, 2000)
      }
    }
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16">
            <div className="flex items-center">
              <h1 
                className="text-xl font-semibold text-gray-900 cursor-pointer select-none"
                onClick={toggleAdmin}
                title={isAdmin ? "Admin mode: ON (click to disable)" : `Click ${3 - clickCount} more times to enable admin mode`}
              >
                Thailand-Cambodia Conflict Monitor
              </h1>
              {isAdmin && (
                <span className="ml-3 px-2 py-1 bg-red-100 text-red-800 text-xs rounded-full font-medium">
                  ADMIN
                </span>
              )}
            </div>
            <div className="flex items-center space-x-4">
              <Link
                href="/conflict-origins"
                className="px-4 py-2 bg-red-600 text-white text-sm rounded-md hover:bg-red-700 transition-colors font-semibold"
              >
                The Truth
              </Link>
              <Link
                href="/analysis/thai-politics"
                className="px-4 py-2 bg-red-600 text-white text-sm rounded-md hover:bg-red-700 transition-colors"
              >
                Thai Politics
              </Link>
              <Link
                href="/conflict-history"
                className="px-4 py-2 bg-red-600 text-white text-sm rounded-md hover:bg-red-700 transition-colors"
              >
                Conflict History
              </Link>
              <Link
                href="/timeline"
                className="px-4 py-2 bg-indigo-600 text-white text-sm rounded-md hover:bg-indigo-700 transition-colors"
              >
                Full Timeline
              </Link>
              {isAdmin && (
                <Link
                  href="/admin"
                  className="px-4 py-2 bg-gray-600 text-white text-sm rounded-md hover:bg-gray-700 transition-colors"
                >
                  Admin
                </Link>
              )}
              {isAdmin && (
                <button
                  onClick={() => triggerMonitoring('official-pages')}
                  className="px-4 py-2 bg-orange-600 text-white text-sm rounded-md hover:bg-orange-700 transition-colors"
                >
                  Official Pages
                </button>
              )}
              <button
                onClick={() => triggerMonitoring('news')}
                className="px-4 py-2 bg-green-600 text-white text-sm rounded-md hover:bg-green-700 transition-colors"
              >
                Refresh News
              </button>
              <span className="text-sm text-gray-500">Real-time monitoring</span>
              <div className="w-3 h-3 bg-green-500 rounded-full animate-pulse"></div>
            </div>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6 mb-8">
          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center">
              <div className="p-2 bg-blue-100 rounded-md">
                <svg className="w-6 h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                </svg>
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Total Articles</p>
                <p className="text-2xl font-semibold text-gray-900">{stats.totalArticles}</p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center">
              <div className="p-2 bg-green-100 rounded-md">
                <svg className="w-6 h-6 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Today</p>
                <p className="text-2xl font-semibold text-gray-900">{stats.todayArticles}</p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center">
              <div className="p-2 bg-purple-100 rounded-md">
                <svg className="w-6 h-6 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.828 10.172a4 4 0 00-5.656 0l-4 4a4 4 0 105.656 5.656l1.102-1.101m-.758-4.899a4 4 0 005.656 0l4-4a4 4 0 00-5.656-5.656l-1.1 1.1" />
                </svg>
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Active Sources</p>
                <p className="text-2xl font-semibold text-gray-900">{stats.activeSources}</p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center">
              <div className="p-2 bg-yellow-100 rounded-md">
                <svg className="w-6 h-6 text-yellow-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
                </svg>
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Pending</p>
                <p className="text-2xl font-semibold text-gray-900">{stats.pendingAnalysis}</p>
              </div>
            </div>
          </div>
        </div>

        {/* Conflict Analytics Dashboard */}
        <ConflictDashboard className="mb-8" isAdmin={isAdmin} />

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2">
            <div className="bg-white rounded-lg shadow p-6">
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-lg font-medium text-gray-900">
                  Latest Articles
                  {selectedSourceName && (
                    <span className="ml-2 text-sm font-normal text-gray-500">
                      from {selectedSourceName}
                    </span>
                  )}
                </h2>
                <SourceFilter 
                  onFilterChange={handleFilterChange}
                  selectedSourceId={selectedSourceId}
                />
              </div>
              {loading ? (
                <div className="space-y-4">
                  {[...Array(3)].map((_, i) => (
                    <div key={i} className="animate-pulse">
                      <div className="h-4 bg-gray-300 rounded w-3/4 mb-2"></div>
                      <div className="h-3 bg-gray-300 rounded w-1/2"></div>
                    </div>
                  ))}
                </div>
              ) : articles.length > 0 ? (
                <div className="space-y-4">
                  {articles.slice(0, 3).map((article) => (
                    <ArticleCard key={article.id} article={article} />
                  ))}
                </div>
              ) : (
                <p className="text-gray-500 text-center py-8">
                  No articles found. Try refreshing news monitoring.
                </p>
              )}
            </div>
          </div>

          <div>
            <div className="bg-white rounded-lg shadow p-6">
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-xl font-bold text-gray-900">Recent Timeline</h2>
                <Link
                  href="/timeline"
                  className="inline-flex items-center px-4 py-2 text-sm font-medium text-indigo-600 hover:text-indigo-800 transition-colors"
                >
                  <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                  </svg>
                  View Full Timeline
                </Link>
              </div>
              <EnhancedTimeline 
                className="" 
                sourceId={selectedSourceId}
                sourceName={selectedSourceName}
              />
            </div>
          </div>
        </div>

        {/* Timeline Graph Section */}
        <div className="mt-8">
          <div className="bg-white rounded-lg shadow p-6">
            <TimelineGraph 
              className="" 
              sourceId={selectedSourceId}
              sourceName={selectedSourceName}
            />
          </div>
        </div>
      </main>
    </div>
  );
}