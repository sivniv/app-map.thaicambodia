import OpenAI from 'openai'
import { analyzeConflictStatistics, storeConflictAnalysis } from './conflict-analytics'

if (!process.env.OPENAI_API_KEY) {
  throw new Error('OPENAI_API_KEY is not configured')
}

export const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
})

export interface AnalysisResult {
  summary: string
  keywords: string[]
  sentiment: 'positive' | 'negative' | 'neutral'
  importance: number
  conflictRelevance: number
}

export async function analyzeContent(content: string, title?: string, articleId?: string): Promise<AnalysisResult> {
  try {
    const prompt = `
Analyze the following content for Thailand-Cambodia conflict relevance:

Title: ${title || 'N/A'}
Content: ${content}

Provide analysis in the following JSON format:
{
  "summary": "A concise 2-3 sentence summary preserving original meaning",
  "keywords": ["keyword1", "keyword2", "keyword3"],
  "sentiment": "positive|negative|neutral",
  "importance": 1-5,
  "conflictRelevance": 1-10
}

Focus on:
1. Border disputes
2. Diplomatic relations
3. Trade issues
4. Military activities
5. Cultural tensions
6. Government statements

Rate importance (1-5) and conflict relevance (1-10 where 10 is highly relevant).
`

    const response = await openai.chat.completions.create({
      model: 'gpt-4o-mini',
      messages: [
        {
          role: 'system',
          content: 'You are an expert analyst specializing in Thailand-Cambodia relations and Southeast Asian geopolitics. Provide accurate, unbiased analysis in valid JSON format only.'
        },
        {
          role: 'user',
          content: prompt
        }
      ],
      temperature: 0.3,
      max_tokens: 1000,
    })

    const result = response.choices[0]?.message?.content?.trim()
    if (!result) {
      throw new Error('No response from OpenAI')
    }

    let analysisResult: AnalysisResult
    try {
      analysisResult = JSON.parse(result) as AnalysisResult
    } catch (parseError) {
      console.error('Failed to parse OpenAI response:', result)
      throw new Error('Invalid JSON response from OpenAI')
    }

    // If conflict relevance is high and we have an article ID, perform detailed conflict analysis
    if (analysisResult.conflictRelevance >= 6 && articleId) {
      try {
        const conflictAnalysis = await analyzeConflictStatistics(content, title)
        await storeConflictAnalysis(articleId, conflictAnalysis)
        console.log(`✅ Enhanced conflict analysis completed for article ${articleId}`)
      } catch (conflictError) {
        console.error('Conflict analysis failed, continuing with basic analysis:', conflictError)
      }
    }

    return analysisResult
  } catch (error) {
    console.error('OpenAI analysis error:', error)
    throw error
  }
}

export async function generateSummary(content: string, maxLength: number = 300): Promise<string> {
  try {
    const response = await openai.chat.completions.create({
      model: 'gpt-4o-mini',
      messages: [
        {
          role: 'system',
          content: `You are a news summarizer. Create concise summaries that preserve the original meaning and key facts. Keep summaries under ${maxLength} characters.`
        },
        {
          role: 'user',
          content: `Summarize this content, focusing on Thailand-Cambodia relations:\n\n${content}`
        }
      ],
      temperature: 0.2,
      max_tokens: Math.floor(maxLength / 2),
    })

    return response.choices[0]?.message?.content?.trim() || content.substring(0, maxLength)
  } catch (error) {
    console.error('OpenAI summary error:', error)
    return content.substring(0, maxLength)
  }
}