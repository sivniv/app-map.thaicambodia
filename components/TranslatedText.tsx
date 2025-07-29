'use client'

import { useTranslatedText } from '@/hooks/useTranslation'
import { ReactNode } from 'react'

interface TranslatedTextProps {
  children: string
  className?: string
  fallback?: ReactNode
  showLoadingSpinner?: boolean
}

export default function TranslatedText({ 
  children, 
  className = '', 
  fallback,
  showLoadingSpinner = false 
}: TranslatedTextProps) {
  const { translatedText, isLoading } = useTranslatedText(children)

  if (isLoading && showLoadingSpinner) {
    return (
      <span className={`${className} inline-flex items-center`}>
        <svg className="animate-spin -ml-1 mr-2 h-3 w-3 text-gray-400" fill="none" viewBox="0 0 24 24">
          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
        </svg>
        {children}
      </span>
    )
  }

  if (isLoading && fallback) {
    return <>{fallback}</>
  }

  return <span className={className}>{translatedText}</span>
}

// Component for translating HTML content (be careful with XSS)
interface TranslatedHTMLProps {
  html: string
  className?: string
  tag?: keyof JSX.IntrinsicElements
}

export function TranslatedHTML({ html, className = '', tag = 'div' }: TranslatedHTMLProps) {
  const { translatedText, isLoading } = useTranslatedText(html)
  const Tag = tag

  return (
    <Tag 
      className={className}
      dangerouslySetInnerHTML={{ 
        __html: isLoading ? html : translatedText 
      }} 
    />
  )
}