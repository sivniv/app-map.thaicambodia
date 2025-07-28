'use client'

import { useState, useEffect, useRef } from 'react'

interface Source {
  id: string
  name: string
  type: 'FACEBOOK_POST' | 'NEWS_ARTICLE'
  isActive: boolean
  _count?: {
    articles: number
  }
}

interface SourceFilterProps {
  onFilterChange: (sourceId: string | null, sourceName: string | null) => void
  selectedSourceId?: string | null
}

type CountryFilter = 'all' | 'thailand' | 'cambodia' | 'international'

export default function SourceFilter({ onFilterChange, selectedSourceId }: SourceFilterProps) {
  const [sources, setSources] = useState<Source[]>([])
  const [loading, setLoading] = useState(true)
  const [showTypeFilter, setShowTypeFilter] = useState(false)
  const [showCountryFilter, setShowCountryFilter] = useState(false)
  const [selectedType, setSelectedType] = useState<string>('all')
  const [selectedCountry, setSelectedCountry] = useState<CountryFilter>('all')
  const typeFilterRef = useRef<HTMLDivElement>(null)
  const countryFilterRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    fetchSources()
  }, [])

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (typeFilterRef.current && !typeFilterRef.current.contains(event.target as Node)) {
        setShowTypeFilter(false)
      }
      if (countryFilterRef.current && !countryFilterRef.current.contains(event.target as Node)) {
        setShowCountryFilter(false)
      }
    }

    document.addEventListener('mousedown', handleClickOutside)
    return () => {
      document.removeEventListener('mousedown', handleClickOutside)
    }
  }, [])

  const fetchSources = async () => {
    try {
      const response = await fetch('/api/sources?withCounts=true&active=true')
      if (response.ok) {
        const data = await response.json()
        setSources(data)
      }
    } catch (error) {
      console.error('Error fetching sources:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleSourceChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    const value = event.target.value
    if (value === 'all') {
      onFilterChange(null, null)
    } else {
      const source = sources.find(s => s.id === value)
      if (source) {
        onFilterChange(source.id, source.name)
      }
    }
  }

  const handleTypeFilter = (type: string) => {
    setSelectedType(type)
    setShowTypeFilter(false)
  }

  const handleCountryFilter = (country: CountryFilter) => {
    setSelectedCountry(country)
    setShowCountryFilter(false)
  }

  const categorizeSourceByCountry = (sourceName: string): CountryFilter => {
    const name = sourceName.toLowerCase()
    
    // Thailand sources
    if (name.includes('bangkok') || name.includes('thai') || name.includes('thailand') || 
        name.includes('nation thailand') || name.includes('thaiger') || name.includes('pattaya')) {
      return 'thailand'
    }
    
    // Cambodia sources  
    if (name.includes('phnom penh') || name.includes('cambodia') || name.includes('khmer') ||
        name.includes('voa khmer') || name.includes('cambodian')) {
      return 'cambodia'
    }
    
    // International sources
    return 'international'
  }

  const filteredSources = sources.filter(source => {
    // Filter by type
    const matchesType = selectedType === 'all' || source.type === selectedType
    
    // Filter by country
    const matchesCountry = selectedCountry === 'all' || categorizeSourceByCountry(source.name) === selectedCountry
    
    return matchesType && matchesCountry
  })

  const getSourceIcon = (type: string) => {
    switch (type) {
      case 'FACEBOOK_POST':
        return '📘'
      case 'NEWS_ARTICLE':
        return '📰'
      default:
        return '📄'
    }
  }

  const getSourceTypeLabel = (type: string) => {
    switch (type) {
      case 'FACEBOOK_POST':
        return 'Facebook'
      case 'NEWS_ARTICLE':
        return 'News'
      default:
        return type
    }
  }

  const getCountryIcon = (country: CountryFilter) => {
    switch (country) {
      case 'thailand':
        return '🇹🇭'
      case 'cambodia':
        return '🇰🇭'
      case 'international':
        return '🌍'
      default:
        return '🌐'
    }
  }

  const getCountryLabel = (country: CountryFilter) => {
    switch (country) {
      case 'thailand':
        return 'Thailand'
      case 'cambodia':
        return 'Cambodia'
      case 'international':
        return 'International'
      default:
        return 'All Countries'
    }
  }

  if (loading) {
    return (
      <div className="flex items-center space-x-2">
        <div className="animate-pulse h-6 bg-gray-200 rounded w-32"></div>
        <div className="animate-pulse h-6 bg-gray-200 rounded w-24"></div>
        <div className="animate-pulse h-6 bg-gray-200 rounded w-28"></div>
      </div>
    )
  }

  return (
    <div className="flex items-center space-x-3">
      {/* Type Filter */}
      <div className="relative" ref={typeFilterRef}>
        <button
          onClick={() => setShowTypeFilter(!showTypeFilter)}
          className="inline-flex items-center px-3 py-1.5 border border-gray-300 text-sm rounded-md bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500"
        >
          <span className="mr-2">
            {selectedType === 'all' ? '📄' : getSourceIcon(selectedType)}
          </span>
          {selectedType === 'all' ? 'All Types' : getSourceTypeLabel(selectedType)}
          <svg className="ml-2 h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
          </svg>
        </button>

        {showTypeFilter && (
          <div className="absolute right-0 mt-1 w-36 bg-white border border-gray-200 rounded-md shadow-lg z-10">
            <div className="py-1">
              <button
                onClick={() => handleTypeFilter('all')}
                className={`w-full text-left px-3 py-2 text-sm hover:bg-gray-100 ${selectedType === 'all' ? 'bg-blue-50 text-blue-700' : ''}`}
              >
                📄 All Types
              </button>
              <button
                onClick={() => handleTypeFilter('NEWS_ARTICLE')}
                className={`w-full text-left px-3 py-2 text-sm hover:bg-gray-100 ${selectedType === 'NEWS_ARTICLE' ? 'bg-blue-50 text-blue-700' : ''}`}
              >
                📰 News Articles
              </button>
              <button
                onClick={() => handleTypeFilter('FACEBOOK_POST')}
                className={`w-full text-left px-3 py-2 text-sm hover:bg-gray-100 ${selectedType === 'FACEBOOK_POST' ? 'bg-blue-50 text-blue-700' : ''}`}
              >
                📘 Facebook Posts
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Country Filter */}
      <div className="relative" ref={countryFilterRef}>
        <button
          onClick={() => setShowCountryFilter(!showCountryFilter)}
          className="inline-flex items-center px-3 py-1.5 border border-gray-300 text-sm rounded-md bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500"
        >
          <span className="mr-2">
            {getCountryIcon(selectedCountry)}
          </span>
          {getCountryLabel(selectedCountry)}
          <svg className="ml-2 h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
          </svg>
        </button>

        {showCountryFilter && (
          <div className="absolute right-0 mt-1 w-40 bg-white border border-gray-200 rounded-md shadow-lg z-10">
            <div className="py-1">
              <button
                onClick={() => handleCountryFilter('all')}
                className={`w-full text-left px-3 py-2 text-sm hover:bg-gray-100 ${selectedCountry === 'all' ? 'bg-blue-50 text-blue-700' : ''}`}
              >
                🌐 All Countries
              </button>
              <button
                onClick={() => handleCountryFilter('thailand')}
                className={`w-full text-left px-3 py-2 text-sm hover:bg-gray-100 ${selectedCountry === 'thailand' ? 'bg-blue-50 text-blue-700' : ''}`}
              >
                🇹🇭 Thailand Only
              </button>
              <button
                onClick={() => handleCountryFilter('cambodia')}
                className={`w-full text-left px-3 py-2 text-sm hover:bg-gray-100 ${selectedCountry === 'cambodia' ? 'bg-blue-50 text-blue-700' : ''}`}
              >
                🇰🇭 Cambodia Only
              </button>
              <button
                onClick={() => handleCountryFilter('international')}
                className={`w-full text-left px-3 py-2 text-sm hover:bg-gray-100 ${selectedCountry === 'international' ? 'bg-blue-50 text-blue-700' : ''}`}
              >
                🌍 International
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Source Filter */}
      <div className="relative">
        <select
          value={selectedSourceId || 'all'}
          onChange={handleSourceChange}
          className="block w-64 pl-3 pr-8 py-1.5 text-sm border border-gray-300 rounded-md bg-white focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
        >
          <option value="all">All Sources ({filteredSources.length})</option>
          
          {/* Thailand Sources */}
          {filteredSources.filter(s => categorizeSourceByCountry(s.name) === 'thailand').length > 0 && (
            <optgroup label="🇹🇭 Thailand Sources">
              {filteredSources
                .filter(source => categorizeSourceByCountry(source.name) === 'thailand')
                .map(source => (
                  <option key={source.id} value={source.id}>
                    {getSourceIcon(source.type)} {source.name} {source._count ? `(${source._count.articles})` : ''}
                  </option>
                ))}
            </optgroup>
          )}

          {/* Cambodia Sources */}
          {filteredSources.filter(s => categorizeSourceByCountry(s.name) === 'cambodia').length > 0 && (
            <optgroup label="🇰🇭 Cambodia Sources">
              {filteredSources
                .filter(source => categorizeSourceByCountry(source.name) === 'cambodia')
                .map(source => (
                  <option key={source.id} value={source.id}>
                    {getSourceIcon(source.type)} {source.name} {source._count ? `(${source._count.articles})` : ''}
                  </option>
                ))}
            </optgroup>
          )}
          
          {/* International Sources */}
          {filteredSources.filter(s => categorizeSourceByCountry(s.name) === 'international').length > 0 && (
            <optgroup label="🌍 International Sources">
              {filteredSources
                .filter(source => categorizeSourceByCountry(source.name) === 'international')
                .map(source => (
                  <option key={source.id} value={source.id}>
                    {getSourceIcon(source.type)} {source.name} {source._count ? `(${source._count.articles})` : ''}
                  </option>
                ))}
            </optgroup>
          )}
        </select>
      </div>

      {/* Clear Filter */}
      {(selectedSourceId || selectedType !== 'all' || selectedCountry !== 'all') && (
        <button
          onClick={() => {
            onFilterChange(null, null)
            setSelectedType('all')
            setSelectedCountry('all')
          }}
          className="inline-flex items-center px-2 py-1.5 text-sm text-gray-500 hover:text-gray-700"
          title="Clear all filters"
        >
          <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>
      )}
    </div>
  )
}