'use client'

import { useEffect, useState, useRef } from 'react'
import { useLanguage } from '@/context/LanguageContext'

interface PageTranslatorProps {
  children: React.ReactNode
}

export default function PageTranslator({ children }: PageTranslatorProps) {
  const { language } = useLanguage()
  const [isTranslating, setIsTranslating] = useState(false)
  const [isInitialized, setIsInitialized] = useState(false)
  const translateElementRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    // Initialize Google Translate on first load
    if (!isInitialized) {
      initializeGoogleTranslate()
    }
  }, [isInitialized])

  useEffect(() => {
    // Handle language changes
    if (isInitialized) {
      handleLanguageChange()
    }
  }, [language, isInitialized])

  const initializeGoogleTranslate = async () => {
    try {
      await loadGoogleTranslateScript()
      setIsInitialized(true)
    } catch (error) {
      console.error('Failed to initialize Google Translate:', error)
    }
  }

  const loadGoogleTranslateScript = (): Promise<void> => {
    return new Promise((resolve, reject) => {
      // Check if already loaded
      if (window.google && window.google.translate) {
        resolve()
        return
      }

      if (document.getElementById('google-translate-script')) {
        resolve()
        return
      }

      // Set up the callback function first
      window.googleTranslateElementInit = () => {
        if (window.google && window.google.translate) {
          new window.google.translate.TranslateElement({
            pageLanguage: 'en',
            includedLanguages: 'en,th,km,zh-CN,ko,fr',
            layout: window.google.translate.TranslateElement.InlineLayout.SIMPLE,
            autoDisplay: false,
            multilanguagePage: true
          }, 'google_translate_element')
          resolve()
        }
      }

      // Load the script
      const script = document.createElement('script')
      script.id = 'google-translate-script'
      script.src = 'https://translate.google.com/translate_a/element.js?cb=googleTranslateElementInit'
      script.async = true
      script.defer = true
      
      script.onerror = () => reject(new Error('Failed to load Google Translate script'))
      
      document.head.appendChild(script)
    })
  }

  const handleLanguageChange = () => {
    if (language === 'en') {
      // Reset to original English
      resetToEnglish()
      return
    }

    // Translate to selected language
    translateToLanguage(language)
  }

  const resetToEnglish = () => {
    const selectElement = document.querySelector('.goog-te-combo') as HTMLSelectElement
    if (selectElement && selectElement.value !== 'en') {
      setIsTranslating(true)
      selectElement.value = 'en'
      selectElement.dispatchEvent(new Event('change'))
      
      // Wait for translation to complete
      setTimeout(() => {
        setIsTranslating(false)
      }, 2000)
    }
  }

  const translateToLanguage = (targetLang: string) => {
    const googleLangCode = getGoogleTranslateLanguageCode(targetLang)
    const selectElement = document.querySelector('.goog-te-combo') as HTMLSelectElement
    
    if (selectElement && selectElement.value !== googleLangCode) {
      setIsTranslating(true)
      selectElement.value = googleLangCode
      selectElement.dispatchEvent(new Event('change'))
      
      // Wait for translation to complete
      setTimeout(() => {
        setIsTranslating(false)
      }, 3000)
    }
  }

  const getGoogleTranslateLanguageCode = (lang: string): string => {
    const languageMap: Record<string, string> = {
      'th': 'th',
      'km': 'km', 
      'zh': 'zh-CN',
      'ko': 'ko',
      'fr': 'fr',
      'en': 'en'
    }
    return languageMap[lang] || 'en'
  }

  return (
    <div className="relative">
      {/* Google Translate Element - Hidden but functional */}
      <div 
        ref={translateElementRef}
        id="google_translate_element" 
        className="fixed top-0 left-0 opacity-0 pointer-events-none z-[-1]"
        style={{ 
          position: 'fixed',
          top: '-9999px',
          left: '-9999px',
          visibility: 'hidden'
        }}
      />
      
      {/* Translation Loading Indicator */}
      {isTranslating && (
        <div className="fixed top-4 right-4 z-50 bg-blue-600 text-white px-4 py-2 rounded-lg shadow-lg flex items-center space-x-2">
          <svg className="animate-spin h-4 w-4" fill="none" viewBox="0 0 24 24">
            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
          </svg>
          <span className="text-sm font-medium">Translating entire page...</span>
        </div>
      )}

      {/* Add CSS to hide Google Translate banner */}
      <style jsx global>{`
        .goog-te-banner-frame {
          display: none !important;
        }
        .goog-te-menu-value {
          display: none !important;
        }
        body {
          top: 0 !important;
        }
        #goog-gt-tt {
          display: none !important;
        }
        .goog-te-combo {
          display: none !important;
        }
        .skiptranslate {
          display: none !important;
        }
      `}</style>

      {/* Main Content */}
      <div id="content-to-translate">
        {children}
      </div>
    </div>
  )
}

// Extend Window interface for TypeScript
declare global {
  interface Window {
    google: any
    googleTranslateElementInit: () => void
  }
}