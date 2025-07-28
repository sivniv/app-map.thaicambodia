'use client'

import { useState } from 'react'
import { format } from 'date-fns'

interface TimelineTooltipProps {
  children: React.ReactNode
  content: {
    title: string
    time: string
    source: string
    importance: number
    conflictRelevance?: number
    summary?: string
  }
  position?: 'top' | 'bottom' | 'left' | 'right'
}

export default function TimelineTooltip({ 
  children, 
  content, 
  position = 'top' 
}: TimelineTooltipProps) {
  const [isVisible, setIsVisible] = useState(false)

  const getPositionClasses = () => {
    switch (position) {
      case 'top':
        return 'bottom-full left-1/2 transform -translate-x-1/2 mb-2'
      case 'bottom':
        return 'top-full left-1/2 transform -translate-x-1/2 mt-2'
      case 'left':
        return 'right-full top-1/2 transform -translate-y-1/2 mr-2'
      case 'right':
        return 'left-full top-1/2 transform -translate-y-1/2 ml-2'
      default:
        return 'bottom-full left-1/2 transform -translate-x-1/2 mb-2'
    }
  }

  const getArrowClasses = () => {
    switch (position) {
      case 'top':
        return 'top-full left-1/2 transform -translate-x-1/2 border-l-transparent border-r-transparent border-b-transparent border-t-gray-800'
      case 'bottom':
        return 'bottom-full left-1/2 transform -translate-x-1/2 border-l-transparent border-r-transparent border-t-transparent border-b-gray-800'
      case 'left':
        return 'left-full top-1/2 transform -translate-y-1/2 border-t-transparent border-b-transparent border-r-transparent border-l-gray-800'
      case 'right':
        return 'right-full top-1/2 transform -translate-y-1/2 border-t-transparent border-b-transparent border-l-transparent border-r-gray-800'
      default:
        return 'top-full left-1/2 transform -translate-x-1/2 border-l-transparent border-r-transparent border-b-transparent border-t-gray-800'
    }
  }

  const getImportanceColor = (importance: number) => {
    if (importance >= 4) return 'text-red-400'
    if (importance >= 3) return 'text-yellow-400'
    return 'text-gray-400'
  }

  const getImportanceText = (importance: number) => {
    if (importance >= 4) return 'High Priority'
    if (importance >= 3) return 'Medium Priority'
    return 'Low Priority'
  }

  return (
    <div 
      className="relative inline-block"
      onMouseEnter={() => setIsVisible(true)}
      onMouseLeave={() => setIsVisible(false)}
    >
      {children}
      
      {isVisible && (
        <>
          <div 
            className={`absolute z-50 ${getPositionClasses()} w-80 max-w-sm`}
          >
            <div className="bg-gray-800 text-white p-4 rounded-lg shadow-2xl border border-gray-700">
              {/* Header */}
              <div className="mb-3">
                <h4 className="font-semibold text-sm leading-tight mb-1 text-white">
                  {content.title}
                </h4>
                <div className="flex items-center justify-between text-xs text-gray-300">
                  <span>{content.time}</span>
                  <span className="text-blue-300">{content.source}</span>
                </div>
              </div>

              {/* Importance and Relevance */}
              <div className="flex items-center justify-between mb-3 text-xs">
                <div className="flex items-center space-x-1">
                  <div className={`w-2 h-2 rounded-full ${
                    content.importance >= 4 ? 'bg-red-400' : 
                    content.importance >= 3 ? 'bg-yellow-400' : 'bg-gray-400'
                  }`}></div>
                  <span className={getImportanceColor(content.importance)}>
                    {getImportanceText(content.importance)}
                  </span>
                </div>
                {content.conflictRelevance && (
                  <div className="text-purple-300">
                    Relevance: {content.conflictRelevance}/10
                  </div>
                )}
              </div>

              {/* Summary */}
              {content.summary && (
                <div className="text-xs text-gray-200 leading-relaxed">
                  {content.summary.length > 150 
                    ? `${content.summary.substring(0, 150)}...` 
                    : content.summary
                  }
                </div>
              )}
            </div>
            
            {/* Arrow */}
            <div 
              className={`absolute w-0 h-0 border-4 ${getArrowClasses()}`}
            ></div>
          </div>
        </>
      )}
    </div>
  )
}