'use client'

import { useState, useEffect } from 'react'
import { TimelineItem } from '@/types'
import { format, formatDistanceToNow } from 'date-fns'
import TimelineTooltip from './TimelineTooltip'

interface TimelineProps {
  className?: string
  sourceId?: string | null
  sourceName?: string | null
}

export default function EnhancedTimeline({ className = '', sourceId, sourceName }: TimelineProps) {
  const [timelineItems, setTimelineItems] = useState<TimelineItem[]>([])
  const [loading, setLoading] = useState(true)
  const [filter, setFilter] = useState<'all' | 'facebook' | 'news'>('all')
  const [hoveredItem, setHoveredItem] = useState<string | null>(null)

  useEffect(() => {
    fetchTimelineItems()
  }, [sourceId])

  const fetchTimelineItems = async () => {
    try {
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

  const getEventDot = (eventType: string, importance: number, isHovered: boolean) => {
    const baseSize = importance >= 4 ? 'w-5 h-5' : importance >= 3 ? 'w-4 h-4' : 'w-3 h-3'
    const hoverSize = isHovered ? 'scale-125' : 'scale-100'
    
    switch (eventType) {
      case 'facebook_post':
        return (
          <div className={`${baseSize} ${hoverSize} transition-all duration-200 bg-blue-600 rounded-full border-4 border-white shadow-lg ring-2 ring-blue-200 flex items-center justify-center cursor-pointer`}>
            <svg className="w-2 h-2 text-blue-100" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M20 10c0-5.523-4.477-10-10-10S0 4.477 0 10c0 4.991 3.657 9.128 8.438 9.878v-6.987h-2.54V10h2.54V7.797c0-2.506 1.492-3.89 3.777-3.89 1.094 0 2.238.195 2.238.195v2.46h-1.26c-1.243 0-1.63.771-1.63 1.562V10h2.773l-.443 2.89h-2.33v6.988C16.343 19.128 20 14.991 20 10z" clipRule="evenodd" />
            </svg>
          </div>
        )
      case 'news_article':
        return (
          <div className={`${baseSize} ${hoverSize} transition-all duration-200 bg-green-600 rounded-full border-4 border-white shadow-lg ring-2 ring-green-200 flex items-center justify-center cursor-pointer`}>
            <svg className="w-2 h-2 text-green-100" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M2 5a2 2 0 012-2h8a2 2 0 012 2v10a2 2 0 002 2H4a2 2 0 01-2-2V5zm3 1h6v4H5V6zm6 6H5v2h6v-2z" clipRule="evenodd" />
            </svg>
          </div>
        )
      default:
        return (
          <div className={`${baseSize} ${hoverSize} transition-all duration-200 bg-gray-500 rounded-full border-4 border-white shadow-lg ring-2 ring-gray-200 cursor-pointer`}>
          </div>
        )
    }
  }

  const getImportanceIndicator = (importance: number) => {
    if (importance >= 4) {
      return (
        <div className="flex items-center space-x-1">
          <div className="w-2 h-2 bg-red-500 rounded-full animate-pulse"></div>
          <span className="text-xs font-semibold text-red-600">HIGH</span>
        </div>
      )
    }
    if (importance >= 3) {
      return (
        <div className="flex items-center space-x-1">
          <div className="w-2 h-2 bg-yellow-500 rounded-full"></div>
          <span className="text-xs font-medium text-yellow-600">MED</span>
        </div>
      )
    }
    return (
      <div className="flex items-center space-x-1">
        <div className="w-2 h-2 bg-gray-400 rounded-full"></div>
        <span className="text-xs text-gray-500">LOW</span>
      </div>
    )
  }

  const getSourceIcon = (sourceName: string) => {
    if (sourceName.toLowerCase().includes('facebook')) {
      return '📘'
    }
    if (sourceName.toLowerCase().includes('bbc')) {
      return '🇬🇧'
    }
    if (sourceName.toLowerCase().includes('reuters')) {
      return '📰'
    }
    if (sourceName.toLowerCase().includes('channel news asia')) {
      return '🇸🇬'
    }
    if (sourceName.toLowerCase().includes('al jazeera')) {
      return '🌍'
    }
    return '📄'
  }

  if (loading) {
    return (
      <div className={`${className} animate-pulse`}>
        <div className="space-y-6">
          {[...Array(5)].map((_, i) => (
            <div key={i} className="flex items-start space-x-4">
              <div className="w-4 h-4 bg-gray-300 rounded-full mt-2"></div>
              <div className="flex-1 space-y-2">
                <div className="h-4 bg-gray-300 rounded w-3/4"></div>
                <div className="h-3 bg-gray-300 rounded w-1/2"></div>
                <div className="h-2 bg-gray-300 rounded w-1/4"></div>
              </div>
            </div>
          ))}
        </div>
      </div>
    )
  }

  return (
    <div className={className}>
      {/* Header */}
      <div className="flex justify-between items-center mb-6">
        <div>
          <h2 className="text-xl font-bold text-gray-900">News Timeline</h2>
          <p className="text-sm text-gray-500 mt-1">
            {filteredItems.length} events
            {sourceName && <span> from {sourceName}</span>}
          </p>
        </div>
        <div className="flex space-x-2">
          <button
            onClick={() => setFilter('all')}
            className={`px-3 py-1.5 text-sm rounded-full font-medium transition-colors ${
              filter === 'all'
                ? 'bg-indigo-600 text-white shadow-sm'
                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
            }`}
          >
            All
          </button>
          <button
            onClick={() => setFilter('facebook')}
            className={`px-3 py-1.5 text-sm rounded-full font-medium transition-colors ${
              filter === 'facebook'
                ? 'bg-blue-600 text-white shadow-sm'
                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
            }`}
          >
            📘 Facebook
          </button>
          <button
            onClick={() => setFilter('news')}
            className={`px-3 py-1.5 text-sm rounded-full font-medium transition-colors ${
              filter === 'news'
                ? 'bg-green-600 text-white shadow-sm'
                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
            }`}
          >
            📰 News
          </button>
        </div>
      </div>

      {/* Timeline */}
      <div className="relative">
        {/* Main timeline line */}
        <div className="absolute left-6 top-0 bottom-0 w-0.5 bg-gradient-to-b from-indigo-200 via-blue-200 to-green-200"></div>
        
        <div className="space-y-8">
          {filteredItems.map((item, index) => (
            <div 
              key={item.id} 
              className="relative group"
              onMouseEnter={() => setHoveredItem(item.id)}
              onMouseLeave={() => setHoveredItem(null)}
            >
              {/* Timeline dot with tooltip */}
              <div className="absolute left-4 top-3 z-10">
                <TimelineTooltip
                  content={{
                    title: item.title,
                    time: format(new Date(item.eventDate), 'MMM d, yyyy HH:mm'),
                    source: item.article.source.name,
                    importance: item.importance,
                    conflictRelevance: 5,
                    summary: item.description
                  }}
                  position="right"
                >
                  {getEventDot(item.eventType, item.importance, hoveredItem === item.id)}
                </TimelineTooltip>
              </div>
              
              {/* Content card */}
              <div className="ml-14 bg-white rounded-xl shadow-sm border border-gray-100 hover:shadow-md transition-all duration-200 overflow-hidden">
                {/* Card header */}
                <div className="px-5 py-4 border-b border-gray-50">
                  <div className="flex items-start justify-between">
                    <div className="flex-1 min-w-0">
                      <h3 className="text-base font-semibold text-gray-900 mb-2 leading-tight">
                        {item.title}
                      </h3>
                      <div className="flex items-center space-x-4 text-sm text-gray-500">
                        <div className="flex items-center space-x-1">
                          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                          </svg>
                          <span>{format(new Date(item.eventDate), 'MMM d, HH:mm')}</span>
                        </div>
                        <div className="flex items-center space-x-1">
                          <span>{getSourceIcon(item.article.source.name)}</span>
                          <span className="font-medium">{item.article.source.name}</span>
                        </div>
                        {getImportanceIndicator(item.importance)}
                      </div>
                    </div>
                    <div className="ml-4 text-right">
                      <span className="text-xs text-gray-600">
                        {formatDistanceToNow(new Date(item.eventDate), { addSuffix: true })}
                      </span>
                    </div>
                  </div>
                </div>

                {/* Card content */}
                <div className="px-5 py-4">
                  {item.description && (
                    <p className="text-gray-700 text-sm leading-relaxed mb-4">
                      {item.description}
                    </p>
                  )}
                  
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-4">
                      {item.article.originalUrl && (
                        <a
                          href={item.article.originalUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="inline-flex items-center text-sm text-blue-600 hover:text-blue-800 font-medium transition-colors"
                        >
                          <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                          </svg>
                          Original Article
                        </a>
                      )}
                      <button
                        onClick={() => window.open(`/article/${item.article.id}`, '_blank')}
                        className="inline-flex items-center text-sm text-indigo-600 hover:text-indigo-800 font-medium transition-colors"
                      >
                        <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                        </svg>
                        View Details
                      </button>
                    </div>
                    
                    {/* Conflict relevance indicator */}
                    <div className="flex items-center space-x-2">
                      <div className="text-xs text-gray-500">
                        Importance: <span className="font-medium">{item.importance}/5</span>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Hover indicator */}
                {hoveredItem === item.id && (
                  <div className="absolute left-0 top-0 bottom-0 w-1 bg-gradient-to-b from-indigo-500 to-blue-500 rounded-r"></div>
                )}
              </div>
            </div>
          ))}
        </div>
        
        {filteredItems.length === 0 && (
          <div className="text-center py-12">
            <div className="mx-auto w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mb-4">
              <svg className="w-6 h-6 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <p className="text-gray-500 text-lg font-medium">No timeline events found</p>
            <p className="text-gray-400 text-sm mt-1">
              {filter !== 'all' ? `Try switching to "All" or check other filters` : 'Try refreshing news monitoring'}
            </p>
          </div>
        )}
      </div>
    </div>
  )
}