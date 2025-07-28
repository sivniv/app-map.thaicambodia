import OpenAI from 'openai'
import { prisma } from './prisma'
import { VerificationLevel } from '@prisma/client'

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
})

export interface OpenAIConflictAnalysis {
  casualties: {
    total: number
    thailand: number
    cambodia: number
    verified: boolean
    confidence: number
  }
  population: {
    affected: number
    displaced: number
    affectedAreas: string[]
    confidence: number
  }
  weapons: {
    types: string[]
    deployments: Array<{
      type: string
      country: 'THAILAND' | 'CAMBODIA'
      location: string
      threatLevel: number
    }>
    confidence: number
  }
  diplomatic: {
    tension: number
    borderStatus: 'OPEN' | 'CLOSED' | 'RESTRICTED'
    recentStatements: string[]
    meetings: number
    confidence: number
  }
  risk: {
    level: number
    factors: string[]
    escalationProbability: number
    confidence: number
  }
  summary: string
  keyDevelopments: string[]
  lastUpdated: string
  sources: string
  overallConfidence: number
}

export class OpenAIAnalyticsService {
  private async queryOpenAI(prompt: string): Promise<string> {
    try {
      const response = await openai.chat.completions.create({
        model: 'gpt-4o-mini',
        messages: [
          {
            role: 'system',
            content: `You are an expert geopolitical analyst specializing in Thailand-Cambodia relations. 
            You have access to real-time information and provide accurate, structured analysis of current conflicts, 
            diplomatic tensions, military activities, and population impacts between Thailand and Cambodia.
            
            Always provide specific numbers when available, indicate confidence levels, and distinguish between 
            verified facts and estimates. Focus on recent developments within the last 24-48 hours.
            
            Return your analysis in valid JSON format matching the exact structure requested.`
          },
          {
            role: 'user',
            content: prompt
          }
        ],
        temperature: 0.3,
        max_tokens: 2000
      })

      return response.choices[0]?.message?.content || ''
    } catch (error) {
      console.error('OpenAI API error:', error)
      throw new Error(`Failed to query OpenAI: ${error instanceof Error ? error.message : 'Unknown error'}`)
    }
  }

  async getCurrentConflictAnalysis(): Promise<OpenAIConflictAnalysis> {
    const currentTime = new Date().toISOString()
    
    const prompt = `Please provide a comprehensive real-time analysis of the current Thailand-Cambodia conflict situation as of ${currentTime}.

    I need you to search for and analyze the most recent information (within the last 24-48 hours) about:

    1. Casualties and injuries from both Thai and Cambodian sides
    2. Affected civilian populations and displaced persons
    3. Military equipment and weapons being deployed
    4. Current diplomatic tensions and border status
    5. Risk assessment and escalation probability

    Please return your analysis in this exact JSON structure:

    {
      "casualties": {
        "total": <number>,
        "thailand": <number>,
        "cambodia": <number>,
        "verified": <boolean>,
        "confidence": <0.0-1.0>
      },
      "population": {
        "affected": <number>,
        "displaced": <number>,
        "affectedAreas": ["location1", "location2"],
        "confidence": <0.0-1.0>
      },
      "weapons": {
        "types": ["weapon_type1", "weapon_type2"],
        "deployments": [
          {
            "type": "weapon_name",
            "country": "THAILAND" or "CAMBODIA",
            "location": "deployment_location",
            "threatLevel": <1-10>
          }
        ],
        "confidence": <0.0-1.0>
      },
      "diplomatic": {
        "tension": <1-10>,
        "borderStatus": "OPEN" or "CLOSED" or "RESTRICTED",
        "recentStatements": ["statement1", "statement2"],
        "meetings": <number>,
        "confidence": <0.0-1.0>
      },
      "risk": {
        "level": <1-10>,
        "factors": ["factor1", "factor2"],
        "escalationProbability": <0.0-1.0>,
        "confidence": <0.0-1.0>
      },
      "summary": "Brief summary of current situation",
      "keyDevelopments": ["development1", "development2"],
      "lastUpdated": "${currentTime}",
      "sources": "Brief description of information sources used",
      "overallConfidence": <0.0-1.0>
    }

    Base your analysis on the most current and reliable information available. If specific data is not available, provide reasonable estimates based on the situation and clearly indicate this in your confidence scores.`

    try {
      const response = await this.queryOpenAI(prompt)
      
      // Parse the JSON response
      const analysis = JSON.parse(response) as OpenAIConflictAnalysis
      
      // Validate the structure
      if (!analysis.casualties || !analysis.population || !analysis.weapons || !analysis.diplomatic || !analysis.risk) {
        throw new Error('Invalid response structure from OpenAI')
      }

      return analysis
    } catch (error) {
      console.error('Error parsing OpenAI response:', error)
      
      // Return fallback analysis
      return {
        casualties: { total: 0, thailand: 0, cambodia: 0, verified: false, confidence: 0.1 },
        population: { affected: 0, displaced: 0, affectedAreas: [], confidence: 0.1 },
        weapons: { types: [], deployments: [], confidence: 0.1 },
        diplomatic: { tension: 1, borderStatus: 'OPEN', recentStatements: [], meetings: 0, confidence: 0.1 },
        risk: { level: 1, factors: ['No current data available'], escalationProbability: 0.1, confidence: 0.1 },
        summary: 'Unable to retrieve current conflict analysis. Please try again later.',
        keyDevelopments: ['Analysis service temporarily unavailable'],
        lastUpdated: currentTime,
        sources: 'OpenAI real-time analysis service',
        overallConfidence: 0.1
      }
    }
  }

  async updateConflictAnalytics(): Promise<void> {
    try {
      console.log('🔄 Starting OpenAI conflict analytics update...')
      
      const analysis = await this.getCurrentConflictAnalysis()
      
      // Create today's date (start of day)
      const today = new Date()
      const todayStart = new Date(today.getFullYear(), today.getMonth(), today.getDate())

      // Check if we already have analytics for today
      const existingAnalytics = await prisma.conflictAnalytics.findUnique({
        where: { date: todayStart }
      })

      const analyticsData = {
        date: todayStart,
        thailandCasualties: analysis.casualties.thailand,
        cambodiaCasualties: analysis.casualties.cambodia,
        totalCasualties: analysis.casualties.total,
        casualtiesVerified: analysis.casualties.verified,
        affectedPopulation: analysis.population.affected,
        displacedCivilians: analysis.population.displaced,
        affectedAreas: analysis.population.affectedAreas,
        weaponTypesReported: analysis.weapons.types,
        militaryActivity: analysis.weapons.deployments.map(d => 
          `${d.country}: ${d.type} in ${d.location} (Threat: ${d.threatLevel}/10)`
        ).join('; '),
        economicLoss: null, // Will be estimated separately if needed
        tradeDisruption: analysis.diplomatic.borderStatus !== 'OPEN',
        borderStatus: analysis.diplomatic.borderStatus,
        diplomaticTension: analysis.diplomatic.tension,
        officialStatements: analysis.diplomatic.recentStatements.length,
        meetingsScheduled: analysis.diplomatic.meetings,
        dailySummary: analysis.summary,
        keyDevelopments: analysis.keyDevelopments,
        riskAssessment: analysis.risk.level,
        confidenceScore: analysis.overallConfidence,
        sourcesAnalyzed: 1, // OpenAI real-time analysis
        verificationLevel: analysis.casualties.verified ? VerificationLevel.VERIFIED : VerificationLevel.UNVERIFIED
      }

      if (existingAnalytics) {
        // Update existing record
        await prisma.conflictAnalytics.update({
          where: { date: todayStart },
          data: analyticsData
        })
        console.log('✅ Updated existing conflict analytics for today')
      } else {
        // Create new record
        await prisma.conflictAnalytics.create({
          data: analyticsData
        })
        console.log('✅ Created new conflict analytics for today')
      }

      // Store detailed analysis as metadata for debugging
      console.log('📊 OpenAI Conflict Analysis Summary:')
      console.log(`- Total Casualties: ${analysis.casualties.total}`)
      console.log(`- Affected Population: ${analysis.population.affected}`)
      console.log(`- Risk Level: ${analysis.risk.level}/10`)
      console.log(`- Diplomatic Tension: ${analysis.diplomatic.tension}/10`)
      console.log(`- Border Status: ${analysis.diplomatic.borderStatus}`)
      console.log(`- Overall Confidence: ${(analysis.overallConfidence * 100).toFixed(1)}%`)

    } catch (error) {
      console.error('❌ Error updating conflict analytics:', error)
      throw error
    }
  }

  async schedulePeriodicUpdates(): Promise<void> {
    console.log('🕐 Starting 12-hour periodic OpenAI analytics updates...')
    
    // Run immediately
    await this.updateConflictAnalytics()
    
    // Schedule updates every 12 hours (43,200,000 milliseconds)
    setInterval(async () => {
      try {
        console.log('⏰ Running scheduled OpenAI analytics update...')
        await this.updateConflictAnalytics()
      } catch (error) {
        console.error('❌ Scheduled update failed:', error)
      }
    }, 12 * 60 * 60 * 1000) // 12 hours
  }
}

export const openaiAnalytics = new OpenAIAnalyticsService()