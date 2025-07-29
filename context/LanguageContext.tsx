'use client'

import React, { createContext, useContext, useState, useEffect } from 'react'
import { Language, useTranslation } from '@/lib/translations'

interface LanguageContextType {
  language: Language
  setLanguage: (lang: Language) => void
  t: ReturnType<typeof useTranslation>
}

const LanguageContext = createContext<LanguageContextType | undefined>(undefined)

export function LanguageProvider({ children }: { children: React.ReactNode }) {
  const [language, setLanguage] = useState<Language>('en')
  const t = useTranslation(language)

  // Load saved language from localStorage on mount
  useEffect(() => {
    const savedLang = localStorage.getItem('dashboard-language') as Language
    if (savedLang && ['en', 'th', 'km', 'zh', 'ko', 'fr'].includes(savedLang)) {
      setLanguage(savedLang)
    }
  }, [])

  // Save language to localStorage when changed
  const handleLanguageChange = (lang: Language) => {
    setLanguage(lang)
    localStorage.setItem('dashboard-language', lang)
  }

  return (
    <LanguageContext.Provider value={{ 
      language, 
      setLanguage: handleLanguageChange, 
      t 
    }}>
      {children}
    </LanguageContext.Provider>
  )
}

export function useLanguage() {
  const context = useContext(LanguageContext)
  if (context === undefined) {
    throw new Error('useLanguage must be used within a LanguageProvider')
  }
  return context
}