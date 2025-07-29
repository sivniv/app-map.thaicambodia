import { NextRequest, NextResponse } from 'next/server'
import { googleTranslateService } from '@/lib/google-translate'

export async function POST(request: NextRequest) {
  try {
    const { text, texts, targetLanguage, sourceLanguage = 'auto' } = await request.json()

    if (!targetLanguage) {
      return NextResponse.json(
        { error: 'Target language is required' },
        { status: 400 }
      )
    }

    // Skip translation if target is English or no API key
    if (targetLanguage === 'en' || !process.env.GOOGLE_TRANSLATE_API_KEY) {
      return NextResponse.json({
        translatedText: text,
        translatedTexts: texts
      })
    }

    const languageCode = googleTranslateService.getLanguageCode(targetLanguage)

    if (texts && Array.isArray(texts)) {
      // Batch translation
      const translatedTexts = await googleTranslateService.translateBatch(
        texts,
        languageCode,
        sourceLanguage
      )
      return NextResponse.json({ translatedTexts })
    } else if (text) {
      // Single text translation
      const translatedText = await googleTranslateService.translateText(
        text,
        languageCode,
        sourceLanguage
      )
      return NextResponse.json({ translatedText })
    } else {
      return NextResponse.json(
        { error: 'Either text or texts array is required' },
        { status: 400 }
      )
    }
  } catch (error) {
    console.error('Translation API error:', error)
    return NextResponse.json(
      { error: 'Translation failed' },
      { status: 500 }
    )
  }
}