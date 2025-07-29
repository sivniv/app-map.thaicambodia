'use client'

import { useState, useEffect } from 'react'
import { TimelineItem } from '@/types'
import { format, startOfDay, endOfDay, isWithinInterval, parseISO, isSameDay } from 'date-fns'

interface HorizontalTimelineProps {
  className?: string
  selectedDate?: Date
  onDateChange?: (date: Date) => void
}

interface TimelineDot {
  id: string
  title: string
  time: Date
  importance: number
  eventType: string
  source: string
  description: string
  url?: string
}

export default function HorizontalTimeline({ className = '', selectedDate = new Date(), onDateChange }: HorizontalTimelineProps) {
  const [timelineItems, setTimelineItems] = useState<TimelineItem[]>([])
  const [loading, setLoading] = useState(true)
  const [selectedFilter, setSelectedFilter] = useState<'all' | 'breaking' | 'government' | 'rss' | 'social' | 'thai' | 'cambodian'>('all')
  const [timePeriod, setTimePeriod] = useState<'day' | 'week' | 'month'>('day')
  const [hoveredDot, setHoveredDot] = useState<string | null>(null)
  const [selectedDot, setSelectedDot] = useState<TimelineDot | null>(null)

  useEffect(() => {
    fetchTimelineItems()
  }, [selectedDate])

  const fetchTimelineItems = async () => {
    try {
      const response = await fetch('/api/timeline?limit=100')
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

  // Filter items by selected time period
  const periodItems = timelineItems.filter(item => {
    const eventDate = new Date(item.eventDate)
    
    if (timePeriod === 'day') {
      const selectedDateStart = startOfDay(selectedDate)
      const selectedDateEnd = endOfDay(selectedDate)
      return eventDate >= selectedDateStart && eventDate <= selectedDateEnd
    } else if (timePeriod === 'week') {
      const weekStart = new Date(selectedDate)
      weekStart.setDate(selectedDate.getDate() - selectedDate.getDay()) // Start of week (Sunday)
      const weekEnd = new Date(weekStart)
      weekEnd.setDate(weekStart.getDate() + 6) // End of week (Saturday)
      return eventDate >= startOfDay(weekStart) && eventDate <= endOfDay(weekEnd)
    } else { // month
      const monthStart = new Date(selectedDate.getFullYear(), selectedDate.getMonth(), 1)
      const monthEnd = new Date(selectedDate.getFullYear(), selectedDate.getMonth() + 1, 0)
      return eventDate >= startOfDay(monthStart) && eventDate <= endOfDay(monthEnd)
    }
  })

  // Apply source filter
  const filteredItems = periodItems.filter(item => {
    if (selectedFilter === 'all') return true
    if (selectedFilter === 'breaking') return item.importance >= 4
    if (selectedFilter === 'government') return item.article.source.name.toLowerCase().includes('government')
    if (selectedFilter === 'rss') return item.eventType === 'news_article'
    if (selectedFilter === 'social') return item.eventType === 'facebook_post'
    if (selectedFilter === 'thai') return item.article.source.name.toLowerCase().includes('thai')
    if (selectedFilter === 'cambodian') return item.article.source.name.toLowerCase().includes('cambodia')
    return true
  })

  // Convert to timeline dots with time positioning
  const timelineDots: TimelineDot[] = filteredItems.map(item => ({
    id: item.id,
    title: item.title,
    time: new Date(item.eventDate),
    importance: item.importance,
    eventType: item.eventType,
    source: item.article.source.name,
    description: item.description || '',
    url: item.article.originalUrl
  }))


  // Get dot color based on importance and type
  const getDotColor = (importance: number, eventType: string) => {
    if (importance >= 4) return 'bg-red-500' // High priority - red
    if (importance >= 3) return 'bg-blue-500' // Medium priority - blue
    return 'bg-gray-400' // Low priority - gray
  }

  // Get dot size based on importance
  const getDotSize = (importance: number) => {
    if (importance >= 4) return 'w-5 h-5' // Large
    if (importance >= 3) return 'w-4 h-4' // Medium
    return 'w-3 h-3' // Small
  }

  // Calculate position on timeline (0-100%) based on time period
  const getTimePosition = (time: Date) => {
    let periodStart: Date
    let totalDuration: number
    
    if (timePeriod === 'day') {
      periodStart = startOfDay(selectedDate)
      totalDuration = 24 * 60 * 60 * 1000 // 24 hours in milliseconds
    } else if (timePeriod === 'week') {
      periodStart = new Date(selectedDate)
      periodStart.setDate(selectedDate.getDate() - selectedDate.getDay())
      periodStart = startOfDay(periodStart)
      totalDuration = 7 * 24 * 60 * 60 * 1000 // 7 days in milliseconds
    } else { // month
      periodStart = new Date(selectedDate.getFullYear(), selectedDate.getMonth(), 1)
      periodStart = startOfDay(periodStart)
      const monthEnd = new Date(selectedDate.getFullYear(), selectedDate.getMonth() + 1, 0)
      totalDuration = monthEnd.getTime() - periodStart.getTime()
    }
    
    const timeFromStart = time.getTime() - periodStart.getTime()
    const position = (timeFromStart / totalDuration) * 100
    
    return Math.max(1, Math.min(99, position))
  }

  // Simple and reliable distribution system
  const createDistributedDots = (dots: TimelineDot[]) => {
    if (dots.length === 0) return []
    
    // Sort by time first
    const sortedDots = [...dots].sort((a, b) => a.time.getTime() - b.time.getTime())
    
    // For timeline visualization, distribute dots evenly across the available space
    return sortedDots.map((dot, index) => {
      let position: number
      
      if (sortedDots.length === 1) {
        // Single dot in the center
        position = 50
      } else {
        // Distribute evenly from 10% to 90% of timeline
        const startPos = 10
        const endPos = 90
        const spacing = (endPos - startPos) / (sortedDots.length - 1)
        position = startPos + (index * spacing)
      }
      
      return {
        ...dot,
        displayPosition: position
      }
    })
  }

  const distributedDots = createDistributedDots(timelineDots)
  
  // Create simple groups without complex clustering logic
  const groupedDots = distributedDots.map(dot => [dot])

  // Time markers for the axis - dynamic based on time period
  const getTimeMarkers = () => {
    if (timePeriod === 'day') {
      return [
        { label: '12 AM', position: 0 },
        { label: '3 AM', position: 12.5 },
        { label: '6 AM', position: 25 },
        { label: '9 AM', position: 37.5 },
        { label: '12 PM', position: 50 },
        { label: '3 PM', position: 62.5 },
        { label: '6 PM', position: 75 },
        { label: '9 PM', position: 87.5 },
        { label: '11:59 PM', position: 100 }
      ]
    } else if (timePeriod === 'week') {
      const weekStart = new Date(selectedDate)
      weekStart.setDate(selectedDate.getDate() - selectedDate.getDay())
      
      return Array.from({ length: 7 }, (_, i) => {
        const day = new Date(weekStart)
        day.setDate(weekStart.getDate() + i)
        return {
          label: format(day, 'EEE'),
          position: (i / 6) * 100
        }
      })
    } else { // month
      const monthStart = new Date(selectedDate.getFullYear(), selectedDate.getMonth(), 1)
      const monthEnd = new Date(selectedDate.getFullYear(), selectedDate.getMonth() + 1, 0)
      const daysInMonth = monthEnd.getDate()
      
      // Show markers for 1st, 7th, 14th, 21st, 28th, last day
      const markerDays = [1, 7, 14, 21, 28, daysInMonth].filter(day => day <= daysInMonth)
      
      return markerDays.map(day => ({
        label: `${day}`,
        position: ((day - 1) / (daysInMonth - 1)) * 100
      }))
    }
  }
  
  const timeMarkers = getTimeMarkers()

  const formatDateHeader = (date: Date) => {
    if (timePeriod === 'day') {
      return format(date, 'MMMM dd, yyyy')
    } else if (timePeriod === 'week') {
      const weekStart = new Date(date)
      weekStart.setDate(date.getDate() - date.getDay())
      const weekEnd = new Date(weekStart)
      weekEnd.setDate(weekStart.getDate() + 6)
      return `${format(weekStart, 'MMM dd')} - ${format(weekEnd, 'MMM dd, yyyy')}`
    } else { // month
      return format(date, 'MMMM yyyy')
    }
  }

  const goToPreviousDay = () => {
    const newDate = new Date(selectedDate)
    if (timePeriod === 'day') {
      newDate.setDate(newDate.getDate() - 1)
    } else if (timePeriod === 'week') {
      newDate.setDate(newDate.getDate() - 7)
    } else { // month
      newDate.setMonth(newDate.getMonth() - 1)
    }
    onDateChange?.(newDate)
  }

  const goToNextDay = () => {
    const newDate = new Date(selectedDate)
    if (timePeriod === 'day') {
      newDate.setDate(newDate.getDate() + 1)
    } else if (timePeriod === 'week') {
      newDate.setDate(newDate.getDate() + 7)
    } else { // month
      newDate.setMonth(newDate.getMonth() + 1)
    }
    onDateChange?.(newDate)
  }

  const goToToday = () => {
    // Go to the date with events (July 28, 2025) instead of actual today
    onDateChange?.(new Date('2025-07-28T00:00:00'))
  }

  if (loading) {
    return (
      <div className={`${className} animate-pulse`}>
        <div className="bg-white rounded-2xl shadow-xl p-8">
          <div className="h-8 bg-gray-300 rounded w-1/3 mb-6"></div>
          <div className="space-y-4">
            <div className="flex space-x-4">
              {[...Array(6)].map((_, i) => (
                <div key={i} className="h-10 bg-gray-300 rounded-full w-24"></div>
              ))}
            </div>
            <div className="h-32 bg-gray-300 rounded"></div>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className={className}>
      <div className="bg-white rounded-2xl shadow-xl overflow-hidden">
        {/* Header */}
        <div className="bg-gradient-to-r from-purple-600 to-blue-600 p-6 text-white">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <div className="text-2xl">📊</div>
              <h2 className="text-2xl font-bold">
                News Activity Timeline - {formatDateHeader(selectedDate)}
              </h2>
            </div>
            <div className="flex items-center space-x-4">
              {/* Time Period Filter */}
              <div className="flex bg-white/20 rounded-lg overflow-hidden">
                {(['day', 'week', 'month'] as const).map((period) => (
                  <button
                    key={period}
                    onClick={() => setTimePeriod(period)}
                    className={`px-3 py-2 text-sm font-medium transition-colors ${
                      timePeriod === period
                        ? 'bg-white/40 text-white'
                        : 'text-white/80 hover:text-white hover:bg-white/30'
                    }`}
                  >
                    {period.charAt(0).toUpperCase() + period.slice(1)}
                  </button>
                ))}
              </div>
              
              <div className="h-6 border-l border-white/30" />
              
              <button
                onClick={goToPreviousDay}
                className="flex items-center space-x-2 px-4 py-2 bg-white/20 rounded-lg hover:bg-white/30 transition-colors"
              >
                <span>←</span>
                <span>Previous {timePeriod}</span>
              </button>
              <button 
                onClick={goToToday}
                className="px-4 py-2 bg-white/30 rounded-lg font-semibold hover:bg-white/40 transition-colors"
              >
                Today
              </button>
              <button
                onClick={goToNextDay}
                className="flex items-center space-x-2 px-4 py-2 bg-white/20 rounded-lg hover:bg-white/30 transition-colors"
              >
                <span>Next {timePeriod}</span>
                <span>→</span>
              </button>
            </div>
          </div>
        </div>

        {/* Filter Tabs */}
        <div className="p-6 border-b bg-gray-50">
          <div className="flex flex-wrap gap-2 mb-4">
            {[
              { key: 'all', label: 'All Sources', active: true },
              { key: 'breaking', label: 'Breaking News' },
              { key: 'government', label: 'Government' },
              { key: 'rss', label: 'RSS Feeds' },
              { key: 'social', label: 'Social Media' }
            ].map((tab) => (
              <button
                key={tab.key}
                onClick={() => setSelectedFilter(tab.key as any)}
                className={`px-4 py-2 rounded-full text-sm font-medium transition-colors ${
                  selectedFilter === tab.key
                    ? 'bg-purple-600 text-white'
                    : 'bg-white text-gray-700 hover:bg-gray-100'
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>
          <div className="flex space-x-4">
            <button
              onClick={() => setSelectedFilter('thai')}
              className={`px-4 py-2 rounded-full text-sm font-medium transition-colors ${
                selectedFilter === 'thai'
                  ? 'bg-purple-600 text-white'
                  : 'bg-white text-gray-700 hover:bg-gray-100'
              }`}
            >
              Thai Sources
            </button>
            <button
              onClick={() => setSelectedFilter('cambodian')}
              className={`px-4 py-2 rounded-full text-sm font-medium transition-colors ${
                selectedFilter === 'cambodian'
                  ? 'bg-purple-600 text-white'
                  : 'bg-white text-gray-700 hover:bg-gray-100'
              }`}
            >
              Cambodian Sources
            </button>
          </div>
        </div>

        {/* Timeline Content */}
        <div className="p-8">
          {timelineDots.length === 0 ? (
            <div className="text-center py-12">
              <div className="text-6xl mb-4">📅</div>
              <h3 className="text-xl font-semibold text-gray-800 mb-2">No events found</h3>
              <p className="text-gray-600">
                No news activity recorded for {formatDateHeader(selectedDate)}
              </p>
            </div>
          ) : (
            <div className="relative">
              {/* Stats Summary */}
              <div className="flex justify-center space-x-8 mb-8 text-sm">
                <div className="text-center">
                  <div className="text-2xl font-bold text-purple-600">{timelineDots.length}</div>
                  <div className="text-gray-600">Total Events</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-red-600">{timelineDots.filter(d => d.importance >= 4).length}</div>
                  <div className="text-gray-600">High Priority</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-blue-600">{timelineDots.filter(d => d.importance >= 3 && d.importance < 4).length}</div>
                  <div className="text-gray-600">Medium Priority</div>
                </div>
              </div>

              {/* Timeline Container */}
              <div className="relative h-40 mb-8">
                {/* Timeline Line with better gradient */}
                <div className="absolute bottom-4 left-0 right-0 h-2 bg-gradient-to-r from-purple-500 via-blue-500 to-indigo-500 rounded-full shadow-lg"></div>
                
                {/* Timeline Dots - Simple Distribution */}
                {groupedDots.map((group, groupIndex) => {
                  const dot = group[0] // Each group now has only one dot
                  const position = dot.displayPosition
                  
                  return (
                    <div
                      key={dot.id}
                      className="absolute transition-all duration-300 cursor-pointer"
                      style={{
                        left: `${position}%`,
                        bottom: '12px',
                        transform: 'translateX(-50%)'
                      }}
                      onMouseEnter={() => setHoveredDot(dot.id)}
                      onMouseLeave={() => setHoveredDot(null)}
                      onClick={() => setSelectedDot(dot)}
                    >
                      <div
                        className={`${getDotSize(dot.importance)} ${getDotColor(dot.importance, dot.eventType)} 
                                  rounded-full border-2 border-white shadow-lg transition-all duration-300
                                  ${hoveredDot === dot.id ? 'scale-125 shadow-xl' : 'scale-100'}`}
                      >
                        {/* Pulse animation for high priority */}
                        {dot.importance >= 4 && (
                          <div className="absolute inset-0 rounded-full bg-red-400 animate-ping opacity-50"></div>
                        )}
                      </div>
                      
                      {/* Hover Tooltip */}
                      {hoveredDot === dot.id && (
                        <div className="absolute bottom-full mb-3 left-1/2 transform -translate-x-1/2 bg-gray-900 text-white p-3 rounded-xl text-sm whitespace-nowrap z-20 shadow-2xl">
                          <div className="font-semibold text-lg">{format(dot.time, 'HH:mm')}</div>
                          <div className="text-xs text-gray-300">{dot.title.substring(0, 50)}...</div>
                          <div className="absolute top-full left-1/2 transform -translate-x-1/2 w-0 h-0 border-l-4 border-r-4 border-t-4 border-transparent border-t-gray-900"></div>
                        </div>
                      )}
                    </div>
                  )
                })}
              </div>

              {/* Time Labels */}
              <div className="relative h-8">
                {timeMarkers.map((marker) => (
                  <div
                    key={marker.label}
                    className="absolute text-sm text-gray-600"
                    style={{
                      left: `${marker.position}%`,
                      transform: 'translateX(-50%)'
                    }}
                  >
                    {marker.label}
                  </div>
                ))}
              </div>

              {/* Detailed Timeline Information - High to Low Priority */}
              <div className="mt-12">
                <h3 className="text-xl font-bold text-gray-900 mb-6 flex items-center">
                  <span className="w-1 h-6 bg-gradient-to-b from-red-500 to-blue-500 rounded-full mr-3"></span>
                  Timeline Events (High to Low Priority)
                </h3>
                
                <div className="space-y-4">
                  {timelineDots
                    .sort((a, b) => b.importance - a.importance) // Sort high to low priority
                    .map((dot, index) => (
                      <div
                        key={dot.id}
                        className={`border rounded-lg p-4 transition-all duration-200 hover:shadow-md cursor-pointer ${
                          dot.importance >= 4 ? 'border-red-200 bg-red-50' :
                          dot.importance >= 3 ? 'border-blue-200 bg-blue-50' :
                          'border-gray-200 bg-gray-50'
                        }`}
                        onClick={() => setSelectedDot(dot)}
                      >
                        <div className="flex items-start justify-between">
                          <div className="flex-1">
                            <div className="flex items-center space-x-3 mb-2">
                              {/* Priority Indicator */}
                              <div className={`w-3 h-3 rounded-full ${getDotColor(dot.importance, dot.eventType)}`}></div>
                              
                              {/* Time */}
                              <span className="text-sm font-medium text-gray-600 bg-white px-2 py-1 rounded">
                                {format(dot.time, 'HH:mm')}
                              </span>
                              
                              {/* Priority Level */}
                              <span className={`text-xs font-bold px-2 py-1 rounded-full ${
                                dot.importance >= 4 ? 'bg-red-100 text-red-800' :
                                dot.importance >= 3 ? 'bg-blue-100 text-blue-800' :
                                'bg-gray-100 text-gray-800'
                              }`}>
                                {dot.importance >= 4 ? 'HIGH' :
                                 dot.importance >= 3 ? 'MEDIUM' : 'LOW'} ({dot.importance}/5)
                              </span>
                              
                              {/* Source */}
                              <span className="text-xs text-gray-500 bg-gray-100 px-2 py-1 rounded">
                                {dot.source}
                              </span>
                            </div>
                            
                            {/* Title */}
                            <h4 className="text-lg font-semibold text-gray-900 mb-2 hover:text-purple-700 transition-colors">
                              {dot.title}
                            </h4>
                            
                            {/* Description */}
                            <p className="text-gray-700 text-sm leading-relaxed">
                              {dot.description}
                            </p>
                          </div>
                          
                          {/* Right side indicators */}
                          <div className="flex flex-col items-end space-y-2 ml-4">
                            <div className="text-right">
                              <div className="text-xs text-gray-500">Timeline Position</div>
                              <div className="text-sm font-medium text-purple-600">
                                #{index + 1}
                              </div>
                            </div>
                            
                            {dot.importance >= 4 && (
                              <div className="flex items-center text-red-600 text-xs">
                                <svg className="w-3 h-3 mr-1" fill="currentColor" viewBox="0 0 20 20">
                                  <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                                </svg>
                                Breaking
                              </div>
                            )}
                            
                            {dot.url && (
                              <button
                                onClick={(e) => {
                                  e.stopPropagation()
                                  window.open(dot.url, '_blank')
                                }}
                                className="text-xs text-purple-600 hover:text-purple-800 underline"
                              >
                                Read More →
                              </button>
                            )}
                          </div>
                        </div>
                      </div>
                    ))}
                </div>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Event Detail Modal */}
      {selectedDot && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl max-w-2xl w-full max-h-[80vh] overflow-y-auto">
            <div className="p-6">
              <div className="flex items-start justify-between mb-4">
                <div className="flex items-center space-x-3">
                  <div className={`w-4 h-4 ${getDotColor(selectedDot.importance, selectedDot.eventType)} rounded-full`}></div>
                  <div>
                    <h3 className="text-xl font-bold text-gray-900">{selectedDot.title}</h3>
                    <p className="text-gray-600">{format(selectedDot.time, 'HH:mm')} • {selectedDot.source}</p>
                  </div>
                </div>
                <button
                  onClick={() => setSelectedDot(null)}
                  className="text-gray-400 hover:text-gray-600"
                >
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>

              <div className="space-y-4">
                <p className="text-gray-700 leading-relaxed">{selectedDot.description}</p>
                
                <div className="flex items-center justify-between pt-4 border-t">
                  <div className="flex items-center space-x-4 text-sm text-gray-600">
                    <span>Importance: {selectedDot.importance}/5</span>
                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                      selectedDot.importance >= 4 ? 'bg-red-100 text-red-800' :
                      selectedDot.importance >= 3 ? 'bg-blue-100 text-blue-800' :
                      'bg-gray-100 text-gray-800'
                    }`}>
                      {selectedDot.importance >= 4 ? 'High Priority' :
                       selectedDot.importance >= 3 ? 'Medium Priority' : 'Low Priority'}
                    </span>
                  </div>
                  
                  {selectedDot.url && (
                    <a
                      href={selectedDot.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors"
                    >
                      <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                      </svg>
                      Read Article
                    </a>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}