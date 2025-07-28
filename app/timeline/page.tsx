'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import TimelineGraph from '@/components/TimelineGraph'
import SourceFilter from '@/components/SourceFilter'

export default function TimelinePage() {
  const [selectedSourceId, setSelectedSourceId] = useState<string | null>(null)
  const [selectedSourceName, setSelectedSourceName] = useState<string | null>(null)

  const handleFilterChange = (sourceId: string | null, sourceName: string | null) => {
    setSelectedSourceId(sourceId)
    setSelectedSourceName(sourceName)
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center space-x-4">
              <Link
                href="/"
                className="inline-flex items-center px-3 py-2 text-sm text-gray-600 hover:text-gray-900 transition-colors"
              >
                <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
                </svg>
                Back to Dashboard
              </Link>
              <h1 className="text-2xl font-bold text-gray-900">
                Thailand-Cambodia Conflict Timeline
              </h1>
            </div>
            <div className="flex items-center space-x-4">
              <span className="text-sm text-gray-500">Filter by source:</span>
              <SourceFilter 
                onFilterChange={handleFilterChange}
                selectedSourceId={selectedSourceId}
              />
            </div>
          </div>
        </div>
      </header>

      <main className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Timeline Header */}
        <div className="mb-8">
          <div className="bg-gradient-to-r from-indigo-600 to-blue-600 rounded-xl p-6 text-white">
            <h2 className="text-3xl font-bold mb-2">Live Conflict Timeline</h2>
            <p className="text-indigo-100 text-lg">
              Real-time monitoring of Thailand-Cambodia relations with detailed event tracking
            </p>
            {selectedSourceName && (
              <div className="mt-4 inline-flex items-center bg-white/20 backdrop-blur-sm rounded-full px-4 py-2">
                <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 4a1 1 0 011-1h16a1 1 0 011 1v2.586a1 1 0 01-.293.707l-6.414 6.414a1 1 0 00-.293.707V17l-4 4v-6.586a1 1 0 00-.293-.707L3.293 7.293A1 1 0 013 6.586V4z" />
                </svg>
                Filtered by: {selectedSourceName}
              </div>
            )}
          </div>
        </div>

        {/* Timeline Legend */}
        <div className="mb-8">
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Timeline Legend</h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="flex items-center space-x-3">
                <div className="w-4 h-4 bg-green-600 rounded-full border-2 border-white shadow-sm ring-2 ring-green-200"></div>
                <div>
                  <p className="text-sm font-medium text-gray-900">📰 News Articles</p>
                  <p className="text-xs text-gray-500">From international news sources</p>
                </div>
              </div>
              <div className="flex items-center space-x-3">
                <div className="w-4 h-4 bg-blue-600 rounded-full border-2 border-white shadow-sm ring-2 ring-blue-200"></div>
                <div>
                  <p className="text-sm font-medium text-gray-900">📘 Facebook Posts</p>
                  <p className="text-xs text-gray-500">Official government pages</p>
                </div>
              </div>
              <div className="flex items-center space-x-3">
                <div className="flex space-x-1">
                  <div className="w-3 h-3 bg-gray-400 rounded-full"></div>
                  <div className="w-4 h-4 bg-yellow-500 rounded-full"></div>
                  <div className="w-5 h-5 bg-red-500 rounded-full animate-pulse"></div>
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-900">Importance Level</p>
                  <p className="text-xs text-gray-500">Low → Medium → High priority</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Enhanced Timeline */}
        <div className="bg-white rounded-xl shadow-lg border border-gray-100">
          <TimelineGraph 
            className="p-8"
            sourceId={selectedSourceId}
            sourceName={selectedSourceName}
          />
        </div>

        {/* Footer */}
        <div className="mt-12 text-center">
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-2">About This Timeline</h3>
            <p className="text-gray-600 max-w-3xl mx-auto leading-relaxed">
              This timeline automatically aggregates news and social media posts related to Thailand-Cambodia relations. 
              Each event is analyzed by AI for conflict relevance and importance. The system monitors multiple sources 
              24/7 to provide real-time updates on diplomatic, military, and social developments between the two countries.
            </p>
            <div className="mt-4 flex justify-center space-x-6 text-sm text-gray-500">
              <div className="flex items-center space-x-1">
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                <span>Real-time monitoring</span>
              </div>
              <div className="flex items-center space-x-1">
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
                </svg>
                <span>AI-powered analysis</span>
              </div>
              <div className="flex items-center space-x-1">
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                <span>Verified sources</span>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  )
}