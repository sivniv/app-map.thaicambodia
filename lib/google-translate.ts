// Google Translate API service
export class GoogleTranslateService {
  private apiKey: string
  private baseUrl = 'https://translation.googleapis.com/language/translate/v2'

  constructor(apiKey?: string) {
    this.apiKey = apiKey || process.env.GOOGLE_TRANSLATE_API_KEY || ''
  }

  async translateText(text: string, targetLanguage: string, sourceLanguage = 'auto'): Promise<string> {
    if (!this.apiKey) {
      console.warn('Google Translate API key not configured')
      return text
    }

    try {
      const response = await fetch(`${this.baseUrl}?key=${this.apiKey}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          q: text,
          source: sourceLanguage,
          target: targetLanguage,
          format: 'text'
        })
      })

      if (!response.ok) {
        throw new Error(`Google Translate API error: ${response.status}`)
      }

      const data = await response.json()
      return data.data.translations[0].translatedText
    } catch (error) {
      console.error('Translation error:', error)
      return text // Return original text if translation fails
    }
  }

  async translateBatch(texts: string[], targetLanguage: string, sourceLanguage = 'auto'): Promise<string[]> {
    if (!this.apiKey) {
      console.warn('Google Translate API key not configured')
      return texts
    }

    try {
      const response = await fetch(`${this.baseUrl}?key=${this.apiKey}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          q: texts,
          source: sourceLanguage,
          target: targetLanguage,
          format: 'text'
        })
      })

      if (!response.ok) {
        throw new Error(`Google Translate API error: ${response.status}`)
      }

      const data = await response.json()
      return data.data.translations.map((t: any) => t.translatedText)
    } catch (error) {
      console.error('Batch translation error:', error)
      return texts // Return original texts if translation fails
    }
  }

  // Helper method to get language code for Google Translate
  getLanguageCode(language: string): string {
    const languageMap: Record<string, string> = {
      'en': 'en',
      'th': 'th',
      'km': 'km',
      'zh': 'zh',
      'ko': 'ko',
      'fr': 'fr'
    }
    return languageMap[language] || 'en'
  }

  // Check if translation is needed
  shouldTranslate(targetLanguage: string): boolean {
    return targetLanguage !== 'en' && this.apiKey !== ''
  }
}

export const googleTranslateService = new GoogleTranslateService()