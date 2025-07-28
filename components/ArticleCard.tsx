'use client'

import { format } from 'date-fns'
import Link from 'next/link'

interface Article {
  id: string
  title: string
  summary?: string
  publishedAt: string
  status: string
  tags: string[]
  metadata?: {
    importance?: number
    conflictRelevance?: number
    sentiment?: string
    imageUrl?: string
  }
  source: {
    name: string
    type: string
  }
  originalUrl?: string
}

interface ArticleCardProps {
  article: Article
  showFullContent?: boolean
}

export default function ArticleCard({ article, showFullContent = false }: ArticleCardProps) {
  const getSourceIcon = (type: string) => {
    switch (type) {
      case 'FACEBOOK_POST':
        return (
          <div className="w-5 h-5 bg-blue-500 rounded flex items-center justify-center">
            <svg className="w-3 h-3 text-white" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M20 10c0-5.523-4.477-10-10-10S0 4.477 0 10c0 4.991 3.657 9.128 8.438 9.878v-6.987h-2.54V10h2.54V7.797c0-2.506 1.492-3.89 3.777-3.89 1.094 0 2.238.195 2.238.195v2.46h-1.26c-1.243 0-1.63.771-1.63 1.562V10h2.773l-.443 2.89h-2.33v6.988C16.343 19.128 20 14.991 20 10z" clipRule="evenodd" />
            </svg>
          </div>
        )
      case 'NEWS_ARTICLE':
        return (
          <div className="w-5 h-5 bg-green-500 rounded flex items-center justify-center">
            <svg className="w-3 h-3 text-white" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M2 5a2 2 0 012-2h8a2 2 0 012 2v10a2 2 0 002 2H4a2 2 0 01-2-2V5zm3 1h6v4H5V6zm6 6H5v2h6v-2z" clipRule="evenodd" />
            </svg>
          </div>
        )
      default:
        return null
    }
  }

  const getImportanceBadge = (importance?: number) => {
    if (!importance) return null
    
    if (importance >= 4) {
      return (
        <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-red-100 text-red-800">
          High Priority
        </span>
      )
    }
    if (importance >= 3) {
      return (
        <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-yellow-100 text-yellow-800">
          Medium Priority
        </span>
      )
    }
    return null
  }

  const getSentimentColor = (sentiment?: string) => {
    switch (sentiment) {
      case 'positive':
        return 'text-green-600'
      case 'negative':
        return 'text-red-600'
      default:
        return 'text-gray-600'
    }
  }

  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 hover:shadow-md transition-shadow">
      <div className="flex items-start justify-between mb-3">
        <div className="flex items-center space-x-2">
          {getSourceIcon(article.source.type)}
          <span className="text-sm font-medium text-gray-700">{article.source.name}</span>
        </div>
        <div className="flex items-center space-x-2">
          {getImportanceBadge(article.metadata?.importance)}
          <span className="text-xs text-gray-500">
            {format(new Date(article.publishedAt), 'MMM d, yyyy HH:mm')}
          </span>
        </div>
      </div>

      <h3 className="text-lg font-semibold text-gray-900 mb-2 line-clamp-2">
        {article.title}
      </h3>

      {article.summary && (
        <p className="text-gray-600 text-sm mb-4 line-clamp-3">
          {article.summary}
        </p>
      )}

      {article.metadata?.imageUrl && (
        <img
          src={article.metadata.imageUrl}
          alt={article.title}
          className="w-full h-40 object-cover rounded-md mb-4"
        />
      )}

      <div className="flex flex-wrap gap-2 mb-4">
        {article.tags.slice(0, 5).map((tag, index) => (
          <span
            key={index}
            className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-gray-100 text-gray-800"
          >
            {tag}
          </span>
        ))}
      </div>

      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-4 text-xs text-gray-500">
          {article.metadata?.conflictRelevance && (
            <span>
              Relevance: {article.metadata.conflictRelevance}/10
            </span>
          )}
          {article.metadata?.sentiment && (
            <span className={getSentimentColor(article.metadata.sentiment)}>
              {article.metadata.sentiment}
            </span>
          )}
        </div>
        
        <div className="flex space-x-2">
          {article.originalUrl && (
            <a
              href={article.originalUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="text-xs text-blue-600 hover:text-blue-800 font-medium"
            >
              Original →
            </a>
          )}
          <Link
            href={`/article/${article.id}` as any}
            className="text-xs text-blue-600 hover:text-blue-800 font-medium"
          >
            Read More →
          </Link>
        </div>
      </div>
    </div>
  )
}