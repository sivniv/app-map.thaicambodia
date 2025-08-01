'use client'

import { useState, useEffect, useMemo } from 'react'
import { TimelineItem } from '@/types'
import { format, parseISO, startOfDay, eachDayOfInterval, subDays } from 'date-fns'
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  ReferenceLine,
  Brush,
  Area,
  ComposedChart,
  Bar,
  ScatterChart,
  Scatter,
  Cell
} from 'recharts'

interface TimelineGraphProps {
  className?: string
  sourceId?: string | null
  sourceName?: string | null
}

interface ChartDataPoint {
  date: string
  displayDate: string
  conflictIntensity: number
  facebookEvents: number
  newsEvents: number
  totalEvents: number
  highImportanceEvents: number
  events: TimelineItem[]
}

export default function TimelineGraph({ className = '', sourceId, sourceName }: TimelineGraphProps) {
  const [timelineItems, setTimelineItems] = useState<TimelineItem[]>([])
  const [loading, setLoading] = useState(true)
  const [filter, setFilter] = useState<'all' | 'facebook' | 'news'>('all')
  const [timeRange, setTimeRange] = useState<'7d' | '30d' | '90d' | 'all'>('30d')
  const [selectedDay, setSelectedDay] = useState<ChartDataPoint | null>(null)
  const [showModal, setShowModal] = useState(false)

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

  // Transform timeline data for chart
  const chartData = useMemo(() => {
    if (!timelineItems.length) return []

    // Filter items based on current filter
    const filteredItems = timelineItems.filter(item => {
      if (filter === 'all') return true
      if (filter === 'facebook') return item.eventType === 'facebook_post'
      if (filter === 'news') return item.eventType === 'news_article'
      return true
    })

    // Determine date range
    const now = new Date()
    let startDate: Date
    switch (timeRange) {
      case '7d':
        startDate = subDays(now, 7)
        break
      case '30d':
        startDate = subDays(now, 30)
        break
      case '90d':
        startDate = subDays(now, 90)
        break
      default:
        startDate = filteredItems.length > 0 
          ? new Date(Math.min(...filteredItems.map(item => new Date(item.eventDate).getTime())))
          : subDays(now, 30)
    }

    // Get all days in the range
    const days = eachDayOfInterval({ start: startDate, end: now })

    // Group events by day
    const eventsByDay = new Map<string, TimelineItem[]>()
    filteredItems.forEach(item => {
      const day = format(startOfDay(new Date(item.eventDate)), 'yyyy-MM-dd')
      if (!eventsByDay.has(day)) {
        eventsByDay.set(day, [])
      }
      eventsByDay.get(day)!.push(item)
    })

    // Create chart data points
    return days.map(day => {
      const dayKey = format(day, 'yyyy-MM-dd')
      const dayEvents = eventsByDay.get(dayKey) || []
      
      const facebookEvents = dayEvents.filter(e => e.eventType === 'facebook_post').length
      const newsEvents = dayEvents.filter(e => e.eventType === 'news_article').length
      const highImportanceEvents = dayEvents.filter(e => e.importance >= 4).length
      
      // Calculate conflict intensity (weighted average of importance)
      const conflictIntensity = dayEvents.length > 0
        ? dayEvents.reduce((sum, event) => sum + event.importance, 0) / dayEvents.length
        : 0

      return {
        date: dayKey,
        displayDate: format(day, 'MMM d'),
        conflictIntensity: Math.round(conflictIntensity * 10) / 10,
        facebookEvents,
        newsEvents,
        totalEvents: dayEvents.length,
        highImportanceEvents,
        events: dayEvents
      } as ChartDataPoint
    })
  }, [timelineItems, filter, timeRange])

  // Handle dot click
  const handleDotClick = (data: ChartDataPoint) => {
    setSelectedDay(data)
    setShowModal(true)
  }

  // Custom dot component for timeline
  const CustomDot = (props: any) => {
    const { cx, cy, payload } = props
    if (!payload || payload.totalEvents === 0) return null
    
    const size = Math.max(4, Math.min(12, payload.totalEvents * 2))
    const intensity = payload.conflictIntensity
    const color = intensity >= 4 ? '#dc2626' : intensity >= 3 ? '#f59e0b' : intensity >= 2 ? '#3b82f6' : '#10b981'
    
    return (
      <circle
        cx={cx}
        cy={cy}
        r={size}
        fill={color}
        stroke="#fff"
        strokeWidth={2}
        className="cursor-pointer hover:opacity-80 transition-opacity"
        onClick={() => handleDotClick(payload)}
      />
    )
  }

  // Custom tooltip component
  const CustomTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
      const data = payload[0].payload as ChartDataPoint
      return (
        <div className="bg-white p-4 border border-gray-200 rounded-lg shadow-lg max-w-sm cursor-pointer hover:bg-gray-50" 
             onClick={() => handleDotClick(data)}>
          <p className="font-semibold text-gray-900 mb-2">{format(parseISO(data.date), 'MMMM d, yyyy')}</p>
          <div className="space-y-1 text-sm">
            <p className="text-red-600">Conflict Intensity: {data.conflictIntensity}/5</p>
            <p className="text-blue-600">Total Events: {data.totalEvents}</p>
            <p className="text-orange-600">High Priority: {data.highImportanceEvents}</p>
            <p className="text-green-500">Facebook: {data.facebookEvents}</p>
            <p className="text-purple-500">News: {data.newsEvents}</p>
          </div>
          {data.events.length > 0 && (
            <div className="mt-3 pt-2 border-t border-gray-100">
              <p className="text-xs font-medium text-gray-700 mb-1">Latest Events:</p>
              {data.events.slice(0, 2).map((event, i) => (
                <p key={i} className="text-xs text-gray-600 truncate">
                  • {event.title}
                </p>
              ))}
              {data.events.length > 2 && (
                <p className="text-xs text-blue-500 font-medium">Click to see all {data.events.length} events</p>
              )}
            </div>
          )}
        </div>
      )
    }
    return null
  }

  // News Detail Modal
  const NewsModal = () => {
    if (!showModal || !selectedDay) return null

    return (
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50" onClick={() => setShowModal(false)}>
        <div className="bg-white rounded-lg max-w-4xl max-h-[80vh] w-full mx-4 overflow-hidden" onClick={e => e.stopPropagation()}>
          <div className="p-6 border-b border-gray-200">
            <div className="flex justify-between items-center">
              <div>
                <h2 className="text-2xl font-bold text-gray-900">
                  {format(parseISO(selectedDay.date), 'MMMM d, yyyy')}
                </h2>
                <p className="text-gray-600 mt-1">
                  {selectedDay.totalEvents} events • Intensity: {selectedDay.conflictIntensity}/5
                </p>
              </div>
              <button 
                onClick={() => setShowModal(false)}
                className="text-gray-400 hover:text-gray-600 text-2xl"
              >
                ×
              </button>
            </div>
          </div>
          
          <div className="p-6 overflow-y-auto max-h-[60vh]">
            {selectedDay.events.length === 0 ? (
              <p className="text-gray-500 text-center py-8">No events recorded for this day</p>
            ) : (
              <div className="space-y-4">
                {selectedDay.events.map((event, index) => (
                  <div key={index} className="border border-gray-200 rounded-lg p-4 hover:bg-gray-50">
                    <div className="flex justify-between items-start mb-2">
                      <h3 className="font-semibold text-gray-900 flex-1">{event.title}</h3>
                      <div className="flex items-center space-x-2 ml-4">
                        <span className={`px-2 py-1 text-xs rounded-full ${
                          event.eventType === 'facebook_post' 
                            ? 'bg-blue-100 text-blue-800' 
                            : 'bg-green-100 text-green-800'
                        }`}>
                          {event.eventType === 'facebook_post' ? 'Facebook' : 'News'}
                        </span>
                        <span className={`px-2 py-1 text-xs rounded-full ${
                          event.importance >= 4 
                            ? 'bg-red-100 text-red-800' 
                            : event.importance >= 3 
                            ? 'bg-yellow-100 text-yellow-800'
                            : 'bg-gray-100 text-gray-800'
                        }`}>
                          Priority {event.importance}/5
                        </span>
                      </div>
                    </div>
                    <p className="text-gray-700 text-sm mb-2">{event.description}</p>
                    <p className="text-xs text-gray-500">
                      {format(new Date(event.eventDate), 'h:mm a')}
                    </p>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    )
  }

  if (loading) {
    return (
      <div className={`${className} animate-pulse`}>
        <div className="h-96 bg-gray-200 rounded-lg"></div>
      </div>
    )
  }

  return (
    <div className={className}>
      <div className="flex justify-between items-center mb-6">
        <div>
          <h2 className="text-xl font-semibold text-gray-900">Conflict Timeline</h2>
          <p className="text-sm text-gray-600 mt-1">
            Click on any dot to see detailed news for that day • Dot size = number of events • Color = intensity level
          </p>
        </div>
        <div className="flex space-x-4">
          {/* Time Range Filter */}
          <div className="flex space-x-1">
            {(['7d', '30d', '90d', 'all'] as const).map((range) => (
              <button
                key={range}
                onClick={() => setTimeRange(range)}
                className={`px-3 py-1 text-sm rounded-md ${
                  timeRange === range
                    ? 'bg-blue-500 text-white'
                    : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                }`}
              >
                {range === 'all' ? 'All' : range.toUpperCase()}
              </button>
            ))}
          </div>
          
          {/* Source Type Filter */}
          <div className="flex space-x-1">
            {(['all', 'facebook', 'news'] as const).map((f) => (
              <button
                key={f}
                onClick={() => setFilter(f)}
                className={`px-3 py-1 text-sm rounded-full ${
                  filter === f
                    ? 'bg-blue-500 text-white'
                    : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                }`}
              >
                {f.charAt(0).toUpperCase() + f.slice(1)}
              </button>
            ))}
          </div>
        </div>
      </div>

      {chartData.length === 0 ? (
        <div className="h-96 flex items-center justify-center bg-gray-50 rounded-lg">
          <p className="text-gray-500">No timeline data available</p>
        </div>
      ) : (
        <div className="bg-white p-4 rounded-lg border border-gray-200">
          <ResponsiveContainer width="100%" height={400}>
            <ComposedChart data={chartData} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
              <XAxis 
                dataKey="displayDate" 
                tick={{ fontSize: 12 }}
                interval="preserveStartEnd"
              />
              <YAxis 
                yAxisId="intensity"
                orientation="left"
                domain={[0, 5]}
                tick={{ fontSize: 12 }}
                label={{ value: 'Conflict Intensity', angle: -90, position: 'insideLeft' }}
              />
              <YAxis 
                yAxisId="events"
                orientation="right"
                tick={{ fontSize: 12 }}
                label={{ value: 'Event Count', angle: 90, position: 'insideRight' }}
              />
              
              {/* Conflict intensity line */}
              <Line
                yAxisId="intensity"
                type="monotone"
                dataKey="conflictIntensity"
                stroke="#dc2626"
                strokeWidth={2}
                dot={<CustomDot />}
                activeDot={{ 
                  r: 8, 
                  stroke: '#dc2626', 
                  strokeWidth: 3,
                  cursor: 'pointer'
                }}
                connectNulls={false}
              />
              
              {/* Event count bars */}
              <Bar
                yAxisId="events"
                dataKey="totalEvents"
                fill="#3b82f6"
                fillOpacity={0.6}
                radius={[2, 2, 0, 0]}
              />
              
              {/* High importance reference line */}
              <ReferenceLine 
                yAxisId="intensity" 
                y={4} 
                stroke="#f59e0b" 
                strokeDasharray="5 5" 
                label={{ value: "High Alert", position: "insideTopRight" }}
              />
              
              <Tooltip content={<CustomTooltip />} />
              <Legend />
              
              {/* Brush for zooming */}
              <Brush dataKey="displayDate" height={30} stroke="#3b82f6" />
            </ComposedChart>
          </ResponsiveContainer>
        </div>
      )}

      {/* Color Legend */}
      <div className="mt-4 flex justify-center">
        <div className="flex items-center space-x-6 text-sm text-gray-600 bg-gray-50 px-4 py-2 rounded-lg">
          <span className="flex items-center">
            <div className="w-3 h-3 rounded-full bg-red-600 mr-2"></div>
            High Alert (4-5)
          </span>
          <span className="flex items-center">
            <div className="w-3 h-3 rounded-full bg-yellow-500 mr-2"></div>
            Moderate (3)
          </span>
          <span className="flex items-center">
            <div className="w-3 h-3 rounded-full bg-blue-500 mr-2"></div>
            Low (2)
          </span>
          <span className="flex items-center">
            <div className="w-3 h-3 rounded-full bg-green-500 mr-2"></div>
            Minimal (0-1)
          </span>
        </div>
      </div>

      {/* Summary Stats */}
      <div className="mt-6 grid grid-cols-1 md:grid-cols-4 gap-4">
        {[
          { 
            label: 'Avg Intensity', 
            value: chartData.length > 0 
              ? (chartData.reduce((sum, d) => sum + d.conflictIntensity, 0) / chartData.length).toFixed(1)
              : '0.0',
            color: 'text-red-600'
          },
          { 
            label: 'Total Events', 
            value: chartData.reduce((sum, d) => sum + d.totalEvents, 0).toString(),
            color: 'text-blue-600'
          },
          { 
            label: 'High Priority', 
            value: chartData.reduce((sum, d) => sum + d.highImportanceEvents, 0).toString(),
            color: 'text-orange-600'
          },
          { 
            label: 'Peak Day', 
            value: chartData.length > 0 
              ? format(parseISO(chartData.reduce((max, d) => d.conflictIntensity > max.conflictIntensity ? d : max).date), 'MMM d')
              : 'N/A',
            color: 'text-purple-600'
          }
        ].map((stat, i) => (
          <div key={i} className="bg-white p-4 rounded-lg border border-gray-200">
            <p className="text-sm text-gray-600">{stat.label}</p>
            <p className={`text-2xl font-semibold ${stat.color}`}>{stat.value}</p>
          </div>
        ))}
      </div>

      {/* News Detail Modal */}
      <NewsModal />
    </div>
  )
}