'use client'

import { useState, useEffect } from 'react'
import { TimelineItem } from '@/types'
import { format } from 'date-fns'

interface TimelineProps {
  className?: string
  sourceId?: string | null
  sourceName?: string | null
}

export default function Timeline({ className = '', sourceId, sourceName }: TimelineProps) {
  const [timelineItems, setTimelineItems] = useState<TimelineItem[]>([])
  const [loading, setLoading] = useState(true)
  const [filter, setFilter] = useState<'all' | 'facebook' | 'news'>('all')

  useEffect(() => {
    fetchTimelineItems()
  }, [sourceId])

  const fetchTimelineItems = async () => {
    try {
      // Build API URL with source filter
      const timelineUrl = sourceId 
        ? `/api/timeline?sourceId=${sourceId}`
        : '/api/timeline'
      
      const response = await fetch(timelineUrl)
      if (response.ok) {
        const data = await response.json()
        setTimelineItems(data)
      }
    } catch (error) {
      console.error('Failed to fetch timeline items:', error)
    } finally {
      setLoading(false)
    }
  }

  const filteredItems = timelineItems.filter(item => {
    if (filter === 'all') return true
    if (filter === 'facebook') return item.eventType === 'facebook_post'
    if (filter === 'news') return item.eventType === 'news_article'
    return true
  })

  const getEventIcon = (eventType: string) => {
    switch (eventType) {
      case 'facebook_post':
        return (
          <div className="w-8 h-8 bg-blue-500 rounded-full flex items-center justify-center">
            <svg className="w-4 h-4 text-blue-100" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M20 10c0-5.523-4.477-10-10-10S0 4.477 0 10c0 4.991 3.657 9.128 8.438 9.878v-6.987h-2.54V10h2.54V7.797c0-2.506 1.492-3.89 3.777-3.89 1.094 0 2.238.195 2.238.195v2.46h-1.26c-1.243 0-1.63.771-1.63 1.562V10h2.773l-.443 2.89h-2.33v6.988C16.343 19.128 20 14.991 20 10z" clipRule="evenodd" />
            </svg>
          </div>
        )
      case 'news_article':
        return (
          <div className="w-8 h-8 bg-green-500 rounded-full flex items-center justify-center">
            <svg className="w-4 h-4 text-green-100" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M2 5a2 2 0 012-2h8a2 2 0 012 2v10a2 2 0 002 2H4a2 2 0 01-2-2V5zm3 1h6v4H5V6zm6 6H5v2h6v-2z" clipRule="evenodd" />
              <path d="M15 7h1a2 2 0 012 2v5.5a1.5 1.5 0 01-3 0V7z" />
            </svg>
          </div>
        )
      default:
        return (
          <div className="w-8 h-8 bg-gray-500 rounded-full flex items-center justify-center">
            <div className="w-2 h-2 bg-gray-100 rounded-full"></div>
          </div>
        )
    }
  }

  const getImportanceColor = (importance: number) => {
    if (importance >= 4) return 'border-red-200 bg-red-50'
    if (importance >= 3) return 'border-yellow-200 bg-yellow-50'
    return 'border-gray-200 bg-white'
  }

  if (loading) {
    return (
      <div className={`${className} animate-pulse`}>
        <div className="space-y-4">
          {[...Array(5)].map((_, i) => (
            <div key={i} className="flex space-x-4">
              <div className="w-8 h-8 bg-gray-300 rounded-full"></div>
              <div className="flex-1 space-y-2">
                <div className="h-4 bg-gray-300 rounded w-3/4"></div>
                <div className="h-3 bg-gray-300 rounded w-1/2"></div>
              </div>
            </div>
          ))}
        </div>
      </div>
    )
  }

  return (
    <div className={className}>
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-xl font-semibold text-gray-900">Timeline</h2>
        <div className="flex space-x-2">
          <button
            onClick={() => setFilter('all')}
            className={`px-3 py-1 text-sm rounded-full ${
              filter === 'all'
                ? 'bg-blue-500 text-white'
                : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
            }`}
          >
            All
          </button>
          <button
            onClick={() => setFilter('facebook')}
            className={`px-3 py-1 text-sm rounded-full ${
              filter === 'facebook'
                ? 'bg-blue-500 text-white'
                : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
            }`}
          >
            Facebook
          </button>
          <button
            onClick={() => setFilter('news')}
            className={`px-3 py-1 text-sm rounded-full ${
              filter === 'news'
                ? 'bg-blue-500 text-white'
                : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
            }`}
          >
            News
          </button>
        </div>
      </div>

      <div className="space-y-6">
        {filteredItems.map((item, index) => (
          <div key={item.id} className="relative">
            {index !== filteredItems.length - 1 && (
              <div className="absolute left-4 top-8 w-0.5 h-16 bg-gray-200"></div>
            )}
            
            <div className="flex space-x-4">
              {getEventIcon(item.eventType)}
              
              <div className={`flex-1 border rounded-lg p-4 ${getImportanceColor(item.importance)}`}>
                <div className="flex justify-between items-start mb-2">
                  <h3 className="font-medium text-gray-900">{item.title}</h3>
                  <div className="flex items-center space-x-2">
                    <span className="text-xs text-gray-500">
                      {format(new Date(item.eventDate), 'MMM d, yyyy HH:mm')}
                    </span>
                    {item.importance >= 4 && (
                      <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-red-100 text-red-800">
                        High Priority
                      </span>
                    )}
                  </div>
                </div>
                
                {item.description && (
                  <p className="text-gray-600 text-sm mb-3">{item.description}</p>
                )}
                
                <div className="flex justify-between items-center">
                  <span className="text-xs text-gray-500">
                    {item.article.source.name}
                  </span>
                  <button
                    onClick={() => window.open(`/article/${item.article.id}`, '_blank')}
                    className="text-xs text-blue-600 hover:text-blue-800 font-medium"
                  >
                    Read more →
                  </button>
                </div>
              </div>
            </div>
          </div>
        ))}
        
        {filteredItems.length === 0 && (
          <div className="text-center py-8">
            <p className="text-gray-500">No timeline items found</p>
          </div>
        )}
      </div>
    </div>
  )
}