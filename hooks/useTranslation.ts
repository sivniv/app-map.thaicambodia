import { useState, useEffect, useCallback } from 'react'
import { useLanguage } from '@/context/LanguageContext'

interface TranslationCache {
  [key: string]: {
    [lang: string]: string
  }
}

const translationCache: TranslationCache = {}

export function useTranslation() {
  const { language } = useLanguage()
  const [isTranslating, setIsTranslating] = useState(false)

  const translateText = useCallback(async (text: string, forceRefresh = false): Promise<string> => {
    // Return immediately if English or empty text
    if (language === 'en' || !text || text.trim() === '') {
      return text
    }

    // Check cache first
    const cacheKey = text.trim()
    if (!forceRefresh && translationCache[cacheKey]?.[language]) {
      return translationCache[cacheKey][language]
    }

    try {
      setIsTranslating(true)
      const response = await fetch('/api/translate', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          text,
          targetLanguage: language,
          sourceLanguage: 'auto'
        })
      })

      if (response.ok) {
        const data = await response.json()
        const translatedText = data.translatedText || text

        // Cache the result
        if (!translationCache[cacheKey]) {
          translationCache[cacheKey] = {}
        }
        translationCache[cacheKey][language] = translatedText

        return translatedText
      } else {
        console.error('Translation API error:', response.status)
        return text
      }
    } catch (error) {
      console.error('Translation error:', error)
      return text
    } finally {
      setIsTranslating(false)
    }
  }, [language])

  const translateTexts = useCallback(async (texts: string[], forceRefresh = false): Promise<string[]> => {
    // Return immediately if English or empty array
    if (language === 'en' || !texts || texts.length === 0) {
      return texts
    }

    const uncachedTexts: string[] = []
    const uncachedIndices: number[] = []
    const result: string[] = new Array(texts.length)

    // Check cache and identify uncached texts
    texts.forEach((text, index) => {
      const cacheKey = text.trim()
      if (!forceRefresh && translationCache[cacheKey]?.[language]) {
        result[index] = translationCache[cacheKey][language]
      } else {
        uncachedTexts.push(text)
        uncachedIndices.push(index)
      }
    })

    // If all texts are cached, return immediately
    if (uncachedTexts.length === 0) {
      return result
    }

    try {
      setIsTranslating(true)
      const response = await fetch('/api/translate', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          texts: uncachedTexts,
          targetLanguage: language,
          sourceLanguage: 'auto'
        })
      })

      if (response.ok) {
        const data = await response.json()
        const translatedTexts = data.translatedTexts || uncachedTexts

        // Fill in the results and update cache
        uncachedIndices.forEach((originalIndex, translatedIndex) => {
          const originalText = texts[originalIndex]
          const translatedText = translatedTexts[translatedIndex] || originalText
          
          result[originalIndex] = translatedText

          // Cache the result
          const cacheKey = originalText.trim()
          if (!translationCache[cacheKey]) {
            translationCache[cacheKey] = {}
          }
          translationCache[cacheKey][language] = translatedText
        })

        return result
      } else {
        console.error('Batch translation API error:', response.status)
        // Fill in original texts for uncached items
        uncachedIndices.forEach((originalIndex, translatedIndex) => {
          result[originalIndex] = texts[originalIndex]
        })
        return result
      }
    } catch (error) {
      console.error('Batch translation error:', error)
      // Fill in original texts for uncached items
      uncachedIndices.forEach((originalIndex, translatedIndex) => {
        result[originalIndex] = texts[originalIndex]
      })
      return result
    } finally {
      setIsTranslating(false)
    }
  }, [language])

  return {
    translateText,
    translateTexts,
    isTranslating,
    currentLanguage: language
  }
}

// Hook for translating a single text with automatic re-translation on language change
export function useTranslatedText(text: string) {
  const { translateText, currentLanguage } = useTranslation()
  const [translatedText, setTranslatedText] = useState(text)
  const [isLoading, setIsLoading] = useState(false)

  useEffect(() => {
    if (!text) {
      setTranslatedText('')
      return
    }

    setIsLoading(true)
    translateText(text)
      .then(setTranslatedText)
      .finally(() => setIsLoading(false))
  }, [text, currentLanguage, translateText])

  return { translatedText, isLoading }
}

// Hook for translating multiple texts with automatic re-translation on language change
export function useTranslatedTexts(texts: string[]) {
  const { translateTexts, currentLanguage } = useTranslation()
  const [translatedTexts, setTranslatedTexts] = useState(texts)
  const [isLoading, setIsLoading] = useState(false)

  useEffect(() => {
    if (!texts || texts.length === 0) {
      setTranslatedTexts([])
      return
    }

    setIsLoading(true)
    translateTexts(texts)
      .then(setTranslatedTexts)
      .finally(() => setIsLoading(false))
  }, [texts, currentLanguage, translateTexts])

  return { translatedTexts, isLoading }
}