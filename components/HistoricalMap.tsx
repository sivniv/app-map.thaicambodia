'use client'

import React, { useState, useEffect } from 'react'
import Image from 'next/image'

interface HistoricalMapProps {
  period: string
  title: string
  description: string
}

export default function HistoricalMap({ period, title, description }: HistoricalMapProps) {
  const [realMapUrl, setRealMapUrl] = useState<string | null>(null)
  const [originalImageUrl, setOriginalImageUrl] = useState<string | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [showZoom, setShowZoom] = useState(false)
  const [imageError, setImageError] = useState(false)

  // Handle keyboard shortcuts for zoom modal
  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (showZoom && event.key === 'Escape') {
        setShowZoom(false)
      }
    }

    if (showZoom) {
      document.addEventListener('keydown', handleKeyDown)
      // Prevent body scroll when modal is open
      document.body.style.overflow = 'hidden'
    }

    return () => {
      document.removeEventListener('keydown', handleKeyDown)
      document.body.style.overflow = 'unset'
    }
  }, [showZoom])

  useEffect(() => {
    // Check if we have a real map for this period and get original URL
    const checkForRealMap = async () => {
      try {
        const filename = `${period.replace(/[^a-zA-Z0-9]/g, '_')}_map.jpg`
        const mapPath = `/maps/${filename}`
        
        // Try to fetch the image to see if it exists
        const response = await fetch(mapPath, { method: 'HEAD' })
        if (response.ok) {
          setRealMapUrl(mapPath)
          
          // Get original image URL from our scraping data
          try {
            const mapDataResponse = await fetch('/api/admin/scrape-maps', { method: 'GET' })
            if (mapDataResponse.ok) {
              const mapData = await mapDataResponse.json()
              const matchingMap = mapData.maps?.find((map: any) => 
                map.period === period || map.localPath === mapPath
              )
              if (matchingMap) {
                setOriginalImageUrl(matchingMap.imageUrl)
              }
            }
          } catch (err) {
            console.log('Could not fetch original image URL')
          }
        }
      } catch (error) {
        console.log('No real map found for period:', period)
      } finally {
        setIsLoading(false)
      }
    }

    checkForRealMap()
  }, [period])

  const getMapForPeriod = (period: string) => {
    switch (period) {
      case "Ancient Times - 1431":
        return <KhmerEmpireMap />
      case "1431-1863":
        return <SiameseExpansionMap />
      case "1863-1904":
        return <FrenchProtectorateMap />
      case "1904-1907":
        return <BorderTreatyMap />
      case "1941-1946":
        return <WWIITerritorialMap />
      case "1954-1962":
        return <ICJCaseMap />
      case "1963-1997":
        return <CivilWarMap />
      case "1997-2008":
        return <ModernDisputeMap />
      case "2008-2013":
        return <UNESCOConflictMap />
      case "2014-2024":
        return <CurrentBorderMap />
      case "2025":
        return <CurrentBorderMap />
      default:
        return <GeneralCambodiaMap />
    }
  }

  const MapContent = () => {
    if (isLoading) {
      return (
        <div className="w-full h-32 bg-gray-200 rounded-lg flex items-center justify-center">
          <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-blue-600"></div>
          <span className="ml-2 text-sm text-gray-600">Loading map...</span>
        </div>
      )
    }

    if (realMapUrl) {
      const handleMapClick = () => {
        if (originalImageUrl) {
          // If zoom modal fails, open original image in new tab as backup
          try {
            setShowZoom(true)
          } catch (error) {
            window.open(originalImageUrl, '_blank')
          }
        } else {
          setShowZoom(true)
        }
      }

      return (
        <div className="relative group">
          <div 
            className="relative w-full h-32 cursor-pointer rounded-lg overflow-hidden border-2 border-transparent hover:border-green-400 transition-all duration-300"
            onClick={handleMapClick}
            title="Click to zoom and view full historical map"
          >
            <Image
              src={realMapUrl}
              alt={`Historical map: ${title}`}
              fill
              className="object-cover hover:scale-110 transition-transform duration-300"
              sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
              onError={() => setImageError(true)}
              onLoad={() => setImageError(false)}
            />
            <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-30 transition-all duration-300 flex items-center justify-center">
              <div className="opacity-0 group-hover:opacity-100 transition-opacity duration-300 bg-black bg-opacity-60 p-3 rounded-full">
                <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0zM10 7v3m0 0v3m0-3h3m-3 0H7" />
                </svg>
              </div>
            </div>
          </div>
          <div className="absolute top-2 right-2 bg-green-500 text-white text-xs px-2 py-1 rounded-full shadow-lg">
            Real Map
          </div>
          <div className="absolute bottom-2 left-2 bg-black bg-opacity-60 text-white text-xs px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition-opacity duration-300">
            🔍 Click to zoom
          </div>
          {originalImageUrl && (
            <div className="absolute bottom-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
              <a 
                href={originalImageUrl} 
                target="_blank" 
                rel="noopener noreferrer"
                className="bg-blue-500 text-white text-xs px-2 py-1 rounded hover:bg-blue-600 transition-colors duration-200"
                onClick={(e) => e.stopPropagation()}
              >
                🔗 Original
              </a>
            </div>
          )}
        </div>
      )
    }

    return (
      <div className="relative">
        {getMapForPeriod(period)}
        <div className="absolute top-2 right-2 bg-blue-500 text-white text-xs px-2 py-1 rounded-full">
          Diagram
        </div>
      </div>
    )
  }

  return (
    <>
      <div className="w-full max-w-md mx-auto">
        <div className="bg-white rounded-lg border border-gray-200 p-4 shadow-sm">
          <h4 className="text-sm font-semibold text-gray-800 mb-2">
            {period}
          </h4>
          <div className="bg-blue-50 rounded-lg p-3 mb-3">
            <MapContent />
          </div>
          <p className="text-xs text-gray-600 leading-relaxed">
            {description}
          </p>
          {realMapUrl && (
            <p className="text-xs text-green-600 mt-2 font-medium">
              📍 {period === '2025' || period === '2008-2013' ? 'Detailed conflict area map' : 'Historical map from archives'}
            </p>
          )}
        </div>
      </div>

      {/* Zoom Modal */}
      {showZoom && realMapUrl && (
        <div 
          className="fixed inset-0 bg-black bg-opacity-90 flex items-center justify-center z-[9999] p-4"
          onClick={() => setShowZoom(false)}
        >
          <div 
            className="relative max-w-7xl max-h-full bg-gray-100 rounded-lg overflow-hidden shadow-2xl"
            onClick={(e) => e.stopPropagation()}
          >
            <button
              onClick={() => setShowZoom(false)}
              className="absolute top-4 right-4 text-white hover:text-red-400 text-4xl z-20 bg-red-600 hover:bg-red-700 rounded-full w-14 h-14 flex items-center justify-center transition-all duration-200 shadow-lg"
              style={{ lineHeight: '1' }}
            >
              ×
            </button>
            <div className="relative w-full h-[80vh] max-w-[90vw]">
              <img
                src={realMapUrl}
                alt={`Historical map: ${title}`}
                className="w-full h-full object-contain bg-gray-100"
                style={{ maxWidth: '100%', maxHeight: '100%' }}
              />
            </div>
            <div className="absolute bottom-4 left-4 bg-black bg-opacity-90 text-white p-4 rounded-lg max-w-md shadow-2xl">
              <h3 className="font-bold text-lg">{title}</h3>
              <p className="text-sm opacity-90 mt-1">📅 {period}</p>
              <p className="text-xs opacity-75 mt-2">📍 Source: Wikipedia Commons</p>
              {originalImageUrl && (
                <a 
                  href={originalImageUrl} 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="inline-block mt-2 bg-blue-500 hover:bg-blue-600 text-white text-xs px-3 py-1 rounded transition-colors duration-200"
                >
                  🔗 View Original Source
                </a>
              )}
              <p className="text-xs opacity-60 mt-2">💡 Click outside, × or press ESC to close</p>
            </div>
          </div>
        </div>
      )}
    </>
  )
}

// Khmer Empire at its peak (802-1431 CE)
function KhmerEmpireMap() {
  return (
    <svg viewBox="0 0 300 200" className="w-full h-32">
      {/* Background */}
      <rect width="300" height="200" fill="#e8f4fd" />
      
      {/* Khmer Empire territory - much larger, including Thailand */}
      <path
        d="M50 60 L250 60 L250 160 L50 160 Z"
        fill="#f97316"
        fillOpacity={0.7}
        stroke="#ea580c"
        strokeWidth={2}
      />
      
      {/* Angkor Wat location */}
      <circle cx="140" cy="100" r="4" fill="#dc2626" />
      <text x="145" y="95" className="text-xs fill-gray-700">Angkor</text>
      
      {/* Preah Vihear */}
      <circle cx="160" cy="85" r="3" fill="#7c3aed" />
      <text x="165" y="80" className="text-xs fill-gray-700">Preah Vihear</text>
      
      {/* Legend */}
      <rect x="10" y="10" width="100" height="40" fill="white" fillOpacity={0.9} stroke="#d1d5db" rx="4" />
      <text x="15" y="25" className="text-xs font-semibold fill-gray-800">Khmer Empire</text>
      <text x="15" y="35" className="text-xs fill-gray-600">Peak Territory</text>
      <text x="15" y="45" className="text-xs fill-gray-600">802-1431 CE</text>
    </svg>
  )
}

// Siamese expansion period (1431-1863)
function SiameseExpansionMap() {
  return (
    <svg viewBox="0 0 300 200" className="w-full h-32">
      <rect width="300" height="200" fill="#e8f4fd" />
      
      {/* Original Khmer territory (reduced) */}
      <path
        d="M120 80 L220 80 L220 160 L120 160 Z"
        fill="#fbbf24"
        fillOpacity={0.6}
        stroke="#f59e0b"
        strokeWidth={2}
      />
      
      {/* Siamese-controlled areas */}
      <path
        d="M50 60 L140 60 L140 120 L50 120 Z"
        fill="#ef4444"
        fillOpacity={0.6}
        stroke="#dc2626"
        strokeWidth={2}
      />
      
      {/* Phnom Penh (new capital) */}
      <circle cx="180" cy="140" r="4" fill="#dc2626" />
      <text x="185" y="135" className="text-xs fill-gray-700">Phnom Penh</text>
      
      {/* Battambang & Sisophon (lost territories) */}
      <circle cx="100" cy="90" r="3" fill="#ef4444" />
      <text x="75" y="85" className="text-xs fill-gray-700">Battambang</text>
      
      <rect x="10" y="10" width="110" height="50" fill="white" fillOpacity={0.9} stroke="#d1d5db" rx="4" />
      <text x="15" y="25" className="text-xs font-semibold fill-gray-800">Siamese Expansion</text>
      <rect x="15" y="30" width="12" height="8" fill="#ef4444" fillOpacity={0.6} />
      <text x="30" y="37" className="text-xs fill-gray-600">Siam-controlled</text>
      <rect x="15" y="42" width="12" height="8" fill="#fbbf24" fillOpacity={0.6} />
      <text x="30" y="49" className="text-xs fill-gray-600">Cambodia</text>
    </svg>
  )
}

// French Protectorate era (1863-1904)
function FrenchProtectorateMap() {
  return (
    <svg viewBox="0 0 300 200" className="w-full h-32">
      <rect width="300" height="200" fill="#e8f4fd" />
      
      {/* French Indochina (Cambodia under protection) */}
      <path
        d="M120 70 L230 70 L230 170 L120 170 Z"
        fill="#3b82f6"
        fillOpacity={0.6}
        stroke="#2563eb"
        strokeWidth={2}
      />
      
      {/* Siamese territory */}
      <path
        d="M50 60 L140 60 L140 130 L50 130 Z"
        fill="#ef4444"
        fillOpacity={0.4}
        stroke="#dc2626"
        strokeWidth={2}
      />
      
      {/* French colonial buildings */}
      <rect x="175" y="135" width="6" height="6" fill="#1d4ed8" />
      <text x="185" y="142" className="text-xs fill-gray-700">French Admin</text>
      
      <rect x="10" y="10" width="120" height="50" fill="white" fillOpacity={0.9} stroke="#d1d5db" rx="4" />
      <text x="15" y="25" className="text-xs font-semibold fill-gray-800">French Protection</text>
      <rect x="15" y="30" width="12" height="8" fill="#3b82f6" fillOpacity={0.6} />
      <text x="30" y="37" className="text-xs fill-gray-600">French Protectorate</text>
      <rect x="15" y="42" width="12" height="8" fill="#ef4444" fillOpacity={0.4} />
      <text x="30" y="49" className="text-xs fill-gray-600">Siamese Territory</text>
    </svg>
  )
}

// Border Treaty period (1904-1907)
function BorderTreatyMap() {
  return (
    <svg viewBox="0 0 300 200" className="w-full h-32">
      <rect width="300" height="200" fill="#e8f4fd" />
      
      {/* Cambodia with new borders */}
      <path
        d="M110 75 L240 75 L240 165 L110 165 Z"
        fill="#10b981"
        fillOpacity={0.6}
        stroke="#059669"
        strokeWidth={2}
      />
      
      {/* Disputed Preah Vihear area */}
      <circle cx="160" cy="85" r="8" fill="#fbbf24" fillOpacity={0.8} stroke="#f59e0b" strokeWidth={2} />
      <text x="170" y="82" className="text-xs fill-gray-700">Preah Vihear</text>
      <text x="170" y="92" className="text-xs fill-red-600 font-bold">Disputed</text>
      
      {/* Watershed line (theoretical border) */}
      <path
        d="M110 75 L240 75"
        stroke="#dc2626"
        strokeWidth={2}
        strokeDasharray="5,5"
      />
      <text x="175" y="70" className="text-xs fill-red-600">Watershed Line</text>
      
      {/* French map line (actual drawn border) */}
      <path
        d="M110 90 L240 90"
        stroke="#3b82f6"
        strokeWidth={2}
      />
      <text x="175" y="105" className="text-xs fill-blue-600">French Map Line</text>
      
      <rect x="10" y="10" width="130" height="60" fill="white" fillOpacity={0.9} stroke="#d1d5db" rx="4" />
      <text x="15" y="25" className="text-xs font-semibold fill-gray-800">1904-1907 Treaties</text>
      <line x1="15" y1="30" x2="27" y2="30" stroke="#dc2626" strokeWidth={2} strokeDasharray="3,3" />
      <text x="30" y="34" className="text-xs fill-gray-600">Watershed (Treaty)</text>
      <line x1="15" y1="42" x2="27" y2="42" stroke="#3b82f6" strokeWidth={2} />
      <text x="30" y="46" className="text-xs fill-gray-600">French Map</text>
      <circle cx="21" cy="54" r="4" fill="#fbbf24" fillOpacity={0.8} />
      <text x="30" y="58" className="text-xs fill-gray-600">Disputed Zone</text>
    </svg>
  )
}

// WWII territorial changes (1941-1946)
function WWIITerritorialMap() {
  return (
    <svg viewBox="0 0 300 200" className="w-full h-32">
      <rect width="300" height="200" fill="#e8f4fd" />
      
      {/* Thai-occupied territories */}
      <path
        d="M110 75 L180 75 L180 120 L110 120 Z"
        fill="#ff6b6b"
        fillOpacity={0.7}
        stroke="#e53e3e"
        strokeWidth={2}
      />
      
      {/* Remaining Cambodian territory */}
      <path
        d="M160 100 L240 100 L240 165 L160 165 Z"
        fill="#38a169"
        fillOpacity={0.5}
        stroke="#2f855a"
        strokeWidth={2}
      />
      
      {/* Japanese flag symbol */}
      <circle cx="80" cy="50" r="12" fill="white" stroke="#e53e3e" strokeWidth={2} />
      <circle cx="80" cy="50" r="6" fill="#e53e3e" />
      <text x="60" y="35" className="text-xs fill-gray-700">Japanese</text>
      <text x="60" y="45" className="text-xs fill-gray-700">Support</text>
      
      <rect x="10" y="130" width="120" height="50" fill="white" fillOpacity={0.9} stroke="#d1d5db" rx="4" />
      <text x="15" y="145" className="text-xs font-semibold fill-gray-800">WWII Occupation</text>
      <rect x="15" y="150" width="12" height="8" fill="#ff6b6b" fillOpacity={0.7} />
      <text x="30" y="157" className="text-xs fill-gray-600">Thai-occupied</text>
      <rect x="15" y="162" width="12" height="8" fill="#38a169" fillOpacity={0.5} />
      <text x="30" y="169" className="text-xs fill-gray-600">Cambodia</text>
    </svg>
  )
}

// ICJ case period (1954-1962)
function ICJCaseMap() {
  return (
    <svg viewBox="0 0 300 200" className="w-full h-32">
      <rect width="300" height="200" fill="#e8f4fd" />
      
      {/* Cambodia */}
      <path
        d="M110 80 L240 80 L240 165 L110 165 Z"
        fill="#38a169"
        fillOpacity={0.6}
        stroke="#2f855a"
        strokeWidth={2}
      />
      
      {/* Preah Vihear with ICJ ruling */}
      <circle cx="160" cy="85" r="10" fill="#1a365d" stroke="#2d3748" strokeWidth={2} />
      <text x="175" y="82" className="text-xs font-bold fill-blue-800">ICJ 1962</text>
      <text x="175" y="92" className="text-xs fill-blue-800">To Cambodia</text>
      
      {/* Legal symbol */}
      <rect x="155" y="80" width="10" height="10" fill="#2b6cb0" />
      <path d="M160 75 L160 95 M155 85 L165 85" stroke="white" strokeWidth={1} />
      
      <rect x="10" y="10" width="110" height="45" fill="white" fillOpacity={0.9} stroke="#d1d5db" rx="4" />
      <text x="15" y="25" className="text-xs font-semibold fill-gray-800">ICJ Decision 1962</text>
      <text x="15" y="35" className="text-xs fill-gray-600">Preah Vihear to</text>
      <text x="15" y="45" className="text-xs fill-gray-600">Cambodia (9-3)</text>
    </svg>
  )
}

// Civil War period (1963-1997)
function CivilWarMap() {
  return (
    <svg viewBox="0 0 300 200" className="w-full h-32">
      <rect width="300" height="200" fill="#e8f4fd" />
      
      {/* Cambodia with areas of control */}
      <path
        d="M110 80 L240 80 L240 165 L110 165 Z"
        fill="#a0a0a0"
        fillOpacity={0.6}
        stroke="#6b7280"
        strokeWidth={2}
      />
      
      {/* Khmer Rouge controlled areas */}
      <path
        d="M130 90 L200 90 L200 130 L130 130 Z"
        fill="#7c2d12"
        fillOpacity={0.7}
        stroke="#92400e"
        strokeWidth={2}
      />
      
      {/* Mine symbols */}
      <circle cx="145" cy="105" r="2" fill="#dc2626" />
      <circle cx="165" cy="115" r="2" fill="#dc2626" />
      <circle cx="185" cy="110" r="2" fill="#dc2626" />
      <text x="140" y="125" className="text-xs fill-red-600">Mined</text>
      
      <rect x="10" y="10" width="120" height="50" fill="white" fillOpacity={0.9} stroke="#d1d5db" rx="4" />
      <text x="15" y="25" className="text-xs font-semibold fill-gray-800">Civil War Period</text>
      <rect x="15" y="30" width="12" height="8" fill="#7c2d12" fillOpacity={0.7} />
      <text x="30" y="37" className="text-xs fill-gray-600">Khmer Rouge</text>
      <circle cx="21" cy="46" r="2" fill="#dc2626" />
      <text x="30" y="49" className="text-xs fill-gray-600">Landmines</text>
    </svg>
  )
}

// Modern dispute period (1997-2008)
function ModernDisputeMap() {
  return (
    <svg viewBox="0 0 300 200" className="w-full h-32">
      <rect width="300" height="200" fill="#e8f4fd" />
      
      {/* Cambodia */}
      <path
        d="M110 80 L240 80 L240 165 L110 165 Z"
        fill="#38a169"
        fillOpacity={0.6}
        stroke="#2f855a"
        strokeWidth={2}
      />
      
      {/* Preah Vihear dispute zone */}
      <circle cx="160" cy="85" r="12" fill="#fbbf24" fillOpacity={0.8} stroke="#f59e0b" strokeWidth={2} />
      <text x="175" y="82" className="text-xs fill-gray-700">Dispute</text>
      <text x="175" y="92" className="text-xs fill-gray-700">Resumes</text>
      
      {/* Modern conflict symbols */}
      <rect x="152" y="77" width="16" height="16" fill="none" stroke="#dc2626" strokeWidth={2} />
      
      <rect x="10" y="10" width="110" height="40" fill="white" fillOpacity={0.9} stroke="#d1d5db" rx="4" />
      <text x="15" y="25" className="text-xs font-semibold fill-gray-800">Modern Tensions</text>
      <text x="15" y="35" className="text-xs fill-gray-600">Border incidents</text>
      <text x="15" y="45" className="text-xs fill-gray-600">1997-2008</text>
    </svg>
  )
}

// UNESCO conflict period (2008-2011)
function UNESCOConflictMap() {
  return (
    <svg viewBox="0 0 300 200" className="w-full h-32">
      <rect width="300" height="200" fill="#e8f4fd" />
      
      {/* Cambodia */}
      <path
        d="M110 80 L240 80 L240 165 L110 165 Z"
        fill="#38a169"
        fillOpacity={0.6}
        stroke="#2f855a"
        strokeWidth={2}
      />
      
      {/* Preah Vihear as UNESCO site */}
      <circle cx="160" cy="85" r="10" fill="#3b82f6" stroke="#1d4ed8" strokeWidth={2} />
      <text x="175" y="82" className="text-xs font-bold fill-blue-800">UNESCO</text>
      <text x="175" y="92" className="text-xs fill-blue-800">2008</text>
      
      {/* Conflict indicators */}
      <path d="M150 95 L170 95" stroke="#dc2626" strokeWidth={3} />
      <path d="M160 85 L160 105" stroke="#dc2626" strokeWidth={3} />
      
      <rect x="10" y="10" width="120" height="50" fill="white" fillOpacity={0.9} stroke="#d1d5db" rx="4" />
      <text x="15" y="25" className="text-xs font-semibold fill-gray-800">UNESCO Crisis</text>
      <text x="15" y="35" className="text-xs fill-gray-600">World Heritage</text>
      <text x="15" y="45" className="text-xs fill-gray-600">listing triggers</text>
      <text x="15" y="55" className="text-xs fill-gray-600">armed clashes</text>
    </svg>
  )
}

// Current border situation (2011-Present)
function CurrentBorderMap() {
  return (
    <svg viewBox="0 0 300 200" className="w-full h-32">
      <rect width="300" height="200" fill="#e8f4fd" />
      
      {/* Cambodia */}
      <path
        d="M110 80 L240 80 L240 165 L110 165 Z"
        fill="#38a169"
        fillOpacity={0.6}
        stroke="#2f855a"
        strokeWidth={2}
      />
      
      {/* Preah Vihear - settled */}
      <circle cx="160" cy="85" r="8" fill="#059669" stroke="#047857" strokeWidth={2} />
      <text x="175" y="82" className="text-xs fill-green-700">Settled</text>
      <text x="175" y="92" className="text-xs fill-green-700">2013</text>
      
      {/* Monitoring presence */}
      <rect x="155" y="100" width="10" height="6" fill="#3b82f6" />
      <text x="170" y="108" className="text-xs fill-blue-600">Monitoring</text>
      
      <rect x="10" y="10" width="110" height="45" fill="white" fillOpacity={0.9} stroke="#d1d5db" rx="4" />
      <text x="15" y="25" className="text-xs font-semibold fill-gray-800">Current Status</text>
      <text x="15" y="35" className="text-xs fill-gray-600">ICJ reaffirms</text>
      <text x="15" y="45" className="text-xs fill-gray-600">Cambodia sovereignty</text>
      <text x="15" y="55" className="text-xs fill-gray-600">Joint monitoring</text>
    </svg>
  )
}

// General Cambodia map fallback
function GeneralCambodiaMap() {
  return (
    <svg viewBox="0 0 300 200" className="w-full h-32">
      <rect width="300" height="200" fill="#e8f4fd" />
      
      {/* Modern Cambodia */}
      <path
        d="M110 80 L240 80 L240 165 L110 165 Z"
        fill="#38a169"
        fillOpacity={0.6}
        stroke="#2f855a"
        strokeWidth={2}
      />
      
      {/* Capital */}
      <circle cx="180" cy="140" r="4" fill="#dc2626" />
      <text x="185" y="135" className="text-xs fill-gray-700">Phnom Penh</text>
      
      <rect x="10" y="10" width="80" height="30" fill="white" fillOpacity={0.9} stroke="#d1d5db" rx="4" />
      <text x="15" y="25" className="text-xs font-semibold fill-gray-800">Cambodia</text>
      <text x="15" y="35" className="text-xs fill-gray-600">Current borders</text>
    </svg>
  )
}