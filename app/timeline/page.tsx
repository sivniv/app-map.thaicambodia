'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { ArrowLeft } from 'lucide-react'
import HorizontalTimeline from '@/components/HorizontalTimeline'

interface TimelineEvent {
  id: string
  title: string
  date: string
  description: string
  category: 'thailand' | 'cambodia' | 'international' | 'diplomatic'
  importance: 1 | 2 | 3 | 4 | 5
  source: string
  url?: string
  tags: string[]
}

export default function TimelinePage() {
  // Default to July 28, 2025 where our events are
  const [selectedDate, setSelectedDate] = useState(() => {
    const date = new Date('2025-07-28T00:00:00')
    return date
  })


  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50">
      {/* Header */}
      <div className="bg-white border-b shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center space-x-4">
            <Link
              href="/"
              className="flex items-center text-gray-600 hover:text-gray-900 transition-colors"
            >
              <ArrowLeft className="h-5 w-5 mr-2" />
              Back to Dashboard
            </Link>
            <div className="h-6 border-l border-gray-300" />
            <h1 className="text-2xl font-bold text-gray-900">
              Thailand-Cambodia Conflict Timeline
            </h1>
          </div>
        </div>
      </div>

      {/* Horizontal Timeline */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <HorizontalTimeline 
          selectedDate={selectedDate} 
          onDateChange={setSelectedDate}
        />
      </div>
    </div>
  )
}