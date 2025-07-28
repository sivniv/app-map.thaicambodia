import OpenAI from 'openai'
import { prisma } from './prisma'
import { Country, VerificationLevel, ImpactType } from '@prisma/client'

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
})

export interface ConflictStatistics {
  casualties: {
    thailand: number
    cambodia: number
    total: number
    verified: boolean
  }
  population: {
    affected: number
    displaced: number
    areas: string[]
  }
  weapons: {
    types: string[]
    activity: string
  }
  economy: {
    loss: number | null
    tradeDisruption: boolean
    borderStatus: string
  }
  diplomacy: {
    tension: number
    statements: number
    meetings: number
  }
  confidence: number
}

export interface DetailedConflictAnalysis {
  statistics: ConflictStatistics
  casualties: Array<{
    location: string
    date: string
    country: Country
    casualties: number
    injured: number
    cause?: string
    confidence: number
  }>
  weapons: Array<{
    type: string
    name?: string
    country: Country
    location?: string
    purpose?: string
    threatLevel: number
    confidence: number
  }>
  impacts: Array<{
    location: string
    country: Country
    type: ImpactType
    affected: number
    severity: number
    description?: string
    confidence: number
  }>
  summary: string
  keyDevelopments: string[]
  riskAssessment: number
  overallConfidence: number
}

export async function analyzeConflictStatistics(content: string, title?: string): Promise<DetailedConflictAnalysis> {
  try {
    const prompt = `
Analyze the following Thailand-Cambodia conflict content and extract detailed statistics:

Title: ${title || 'N/A'}
Content: ${content}

Extract and analyze the following information in JSON format:

{
  "statistics": {
    "casualties": {
      "thailand": 0,
      "cambodia": 0, 
      "total": 0,
      "verified": false
    },
    "population": {
      "affected": 0,
      "displaced": 0,
      "areas": []
    },
    "weapons": {
      "types": [],
      "activity": ""
    },
    "economy": {
      "loss": null,
      "tradeDisruption": false,
      "borderStatus": ""
    },
    "diplomacy": {
      "tension": 1,
      "statements": 0,
      "meetings": 0
    },
    "confidence": 0.0
  },
  "casualties": [
    {
      "location": "",
      "date": "YYYY-MM-DD",
      "country": "THAILAND|CAMBODIA|UNKNOWN",
      "casualties": 0,
      "injured": 0,
      "cause": "",
      "confidence": 0.0
    }
  ],
  "weapons": [
    {
      "type": "",
      "name": "",
      "country": "THAILAND|CAMBODIA|UNKNOWN",
      "location": "",
      "purpose": "",
      "threatLevel": 1,
      "confidence": 0.0
    }
  ],
  "impacts": [
    {
      "location": "",
      "country": "THAILAND|CAMBODIA|UNKNOWN",
      "type": "DISPLACEMENT|ECONOMIC_LOSS|INFRASTRUCTURE_DAMAGE|CIVILIAN_CASUALTIES|BORDER_CLOSURE|TRADE_DISRUPTION",
      "affected": 0,
      "severity": 1,
      "description": "",
      "confidence": 0.0
    }
  ],
  "summary": "",
  "keyDevelopments": [],
  "riskAssessment": 1,
  "overallConfidence": 0.0
}

EXTRACTION RULES:
1. Casualties: Extract specific numbers for deaths/injuries per country
2. Population: Count affected civilians and displaced persons
3. Weapons: List specific weapon types, military equipment mentioned
4. Economy: Assess economic impact and border status
5. Diplomacy: Rate tension (1-10), count official statements and meetings
6. Confidence: Rate 0-1 based on source credibility and detail level
7. Risk Assessment: Rate 1-10 based on escalation potential
8. Only include data explicitly mentioned in the content
9. Use "UNKNOWN" for country if not clearly specified
10. Provide confidence scores for each extracted item

Focus on factual extraction with high precision. Mark uncertain data with low confidence scores.
`

    const response = await openai.chat.completions.create({
      model: 'gpt-4o-mini',
      messages: [
        {
          role: 'system',
          content: 'You are an expert conflict analyst specializing in Thailand-Cambodia relations. Extract precise statistics and provide accurate analysis in valid JSON format only. Be conservative with estimates and mark uncertain data with low confidence scores.'
        },
        {
          role: 'user',
          content: prompt
        }
      ],
      temperature: 0.1,
      max_tokens: 2000,
    })

    const result = response.choices[0]?.message?.content?.trim()
    if (!result) {
      throw new Error('No response from OpenAI')
    }

    try {
      return JSON.parse(result) as DetailedConflictAnalysis
    } catch (parseError) {
      console.error('Failed to parse conflict analysis response:', result)
      throw new Error('Invalid JSON response from OpenAI conflict analysis')
    }
  } catch (error) {
    console.error('Conflict analysis error:', error)
    throw error
  }
}

export async function generateDailySummary(analyticsData: any[]): Promise<string> {
  try {
    const summaryData = analyticsData.map(data => ({
      title: data.title,
      summary: data.summary,
      conflictData: data.conflictData,
      publishedAt: data.publishedAt
    }))

    const prompt = `
Generate a comprehensive daily summary for Thailand-Cambodia conflict monitoring based on the following articles analyzed today:

${JSON.stringify(summaryData, null, 2)}

Create a professional daily briefing that includes:

1. EXECUTIVE SUMMARY (2-3 sentences)
2. KEY DEVELOPMENTS (bullet points)
3. CASUALTY UPDATE (if any)
4. MILITARY ACTIVITY (if any)
5. DIPLOMATIC STATUS (current state)
6. POPULATION IMPACT (if any)
7. RISK ASSESSMENT (current threat level 1-10)
8. OUTLOOK (what to watch for)

Format as a clear, professional briefing suitable for officials and analysts. Focus on facts and avoid speculation. If no significant developments occurred, state this clearly.

Keep the summary under 500 words but comprehensive.
`

    const response = await openai.chat.completions.create({
      model: 'gpt-4o-mini',
      messages: [
        {
          role: 'system',
          content: 'You are a senior conflict analyst preparing daily briefings for government officials. Create professional, fact-based summaries that highlight key developments and assess risks accurately.'
        },
        {
          role: 'user',
          content: prompt
        }
      ],
      temperature: 0.2,
      max_tokens: 800,
    })

    return response.choices[0]?.message?.content?.trim() || 'No significant developments reported today.'
  } catch (error) {
    console.error('Daily summary generation error:', error)
    return 'Error generating daily summary. Please check system logs.'
  }
}

export async function storeConflictAnalysis(articleId: string, analysis: DetailedConflictAnalysis) {
  try {
    // Store detailed conflict data in article
    await prisma.article.update({
      where: { id: articleId },
      data: {
        conflictData: analysis as any
      }
    })

    // Store casualty reports
    for (const casualty of analysis.casualties) {
      if (casualty.casualties > 0 || casualty.injured > 0) {
        await prisma.casualtyReport.create({
          data: {
            articleId,
            location: casualty.location,
            incidentDate: new Date(casualty.date),
            reportedDate: new Date(),
            country: casualty.country as Country,
            casualties: casualty.casualties,
            injured: casualty.injured,
            cause: casualty.cause,
            confidence: casualty.confidence,
            verificationLevel: casualty.confidence > 0.7 ? VerificationLevel.VERIFIED : VerificationLevel.UNVERIFIED
          }
        })
      }
    }

    // Store weapon usage
    for (const weapon of analysis.weapons) {
      if (weapon.type) {
        await prisma.weaponUsage.create({
          data: {
            articleId,
            weaponType: weapon.type,
            weaponName: weapon.name,
            country: weapon.country as Country,
            location: weapon.location,
            purpose: weapon.purpose,
            threatLevel: weapon.threatLevel,
            confidence: weapon.confidence,
            verificationLevel: weapon.confidence > 0.7 ? VerificationLevel.VERIFIED : VerificationLevel.UNVERIFIED
          }
        })
      }
    }

    // Store population impacts
    for (const impact of analysis.impacts) {
      if (impact.affected > 0) {
        await prisma.populationImpact.create({
          data: {
            articleId,
            location: impact.location,
            country: impact.country as Country,
            impactType: impact.type as ImpactType,
            affectedCount: impact.affected,
            description: impact.description,
            severity: impact.severity,
            confidence: impact.confidence,
            verificationLevel: impact.confidence > 0.7 ? VerificationLevel.VERIFIED : VerificationLevel.UNVERIFIED
          }
        })
      }
    }

    console.log(`✅ Stored conflict analysis for article ${articleId}`)
  } catch (error) {
    console.error('Error storing conflict analysis:', error)
    throw error
  }
}

export async function generateOrUpdateDailyAnalytics(date: Date = new Date()) {
  try {
    const startOfDay = new Date(date.getFullYear(), date.getMonth(), date.getDate())
    const endOfDay = new Date(date.getFullYear(), date.getMonth(), date.getDate() + 1)

    // Get all articles from the day
    const articles = await prisma.article.findMany({
      where: {
        publishedAt: {
          gte: startOfDay,
          lt: endOfDay
        },
        conflictData: {
          not: null
        }
      },
      include: {
        casualtyReports: true,
        weaponUsages: true,
        populationImpacts: true
      }
    })

    if (articles.length === 0) {
      console.log('No articles with conflict data found for', startOfDay.toDateString())
      return null
    }

    // Aggregate statistics
    let thailandCasualties = 0
    let cambodiaCasualties = 0
    let affectedPopulation = 0
    let displacedCivilians = 0
    const affectedAreas = new Set<string>()
    const weaponTypes = new Set<string>()
    let economicLoss = 0
    let tradeDisruption = false
    let officialStatements = 0
    let diplomaticTension = 1
    let riskLevel = 1

    articles.forEach(article => {
      if (article.conflictData) {
        const data = article.conflictData as any
        if (data.statistics) {
          thailandCasualties += data.statistics.casualties?.thailand || 0
          cambodiaCasualties += data.statistics.casualties?.cambodia || 0
          affectedPopulation += data.statistics.population?.affected || 0
          
          data.statistics.population?.areas?.forEach((area: string) => affectedAreas.add(area))
          data.statistics.weapons?.types?.forEach((weapon: string) => weaponTypes.add(weapon))
          
          if (data.statistics.economy?.loss) economicLoss += data.statistics.economy.loss
          if (data.statistics.economy?.tradeDisruption) tradeDisruption = true
          if (data.statistics.diplomacy?.statements) officialStatements += data.statistics.diplomacy.statements
          if (data.statistics.diplomacy?.tension) diplomaticTension = Math.max(diplomaticTension, data.statistics.diplomacy.tension)
          if (data.riskAssessment) riskLevel = Math.max(riskLevel, data.riskAssessment)
        }
      }
    })

    // Generate daily summary
    const dailySummary = await generateDailySummary(articles)

    // Create or update daily analytics
    const analytics = await prisma.conflictAnalytics.upsert({
      where: { date: startOfDay },
      update: {
        thailandCasualties,
        cambodiaCasualties,
        totalCasualties: thailandCasualties + cambodiaCasualties,
        affectedPopulation,
        displacedCivilians,
        affectedAreas: Array.from(affectedAreas),
        weaponTypesReported: Array.from(weaponTypes),
        economicLoss: economicLoss > 0 ? economicLoss : null,
        tradeDisruption,
        officialStatements,
        diplomaticTension,
        dailySummary,
        riskAssessment: riskLevel,
        sourcesAnalyzed: articles.length,
        verificationLevel: articles.some(a => a.conflictData) ? VerificationLevel.PARTIAL : VerificationLevel.UNVERIFIED
      },
      create: {
        date: startOfDay,
        thailandCasualties,
        cambodiaCasualties,
        totalCasualties: thailandCasualties + cambodiaCasualties,
        affectedPopulation,
        displacedCivilians,
        affectedAreas: Array.from(affectedAreas),
        weaponTypesReported: Array.from(weaponTypes),
        economicLoss: economicLoss > 0 ? economicLoss : null,
        tradeDisruption,
        officialStatements,
        diplomaticTension,
        dailySummary,
        riskAssessment: riskLevel,
        sourcesAnalyzed: articles.length,
        verificationLevel: VerificationLevel.PARTIAL
      }
    })

    console.log(`✅ Generated daily analytics for ${startOfDay.toDateString()}:`, {
      casualties: thailandCasualties + cambodiaCasualties,
      affected: affectedPopulation,
      sources: articles.length
    })

    return analytics
  } catch (error) {
    console.error('Error generating daily analytics:', error)
    throw error
  }
}