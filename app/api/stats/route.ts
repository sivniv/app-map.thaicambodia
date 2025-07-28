import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export async function GET() {
  try {
    const now = new Date()
    const startOfDay = new Date(now.getFullYear(), now.getMonth(), now.getDate())

    const [
      totalArticles,
      todayArticles,
      activeSources,
      pendingAnalysis,
    ] = await Promise.all([
      prisma.article.count(),
      prisma.article.count({
        where: {
          createdAt: {
            gte: startOfDay,
          },
        },
      }),
      prisma.source.count({
        where: {
          isActive: true,
        },
      }),
      prisma.article.count({
        where: {
          status: 'PENDING',
        },
      }),
    ])

    return NextResponse.json({
      totalArticles,
      todayArticles,
      activeSources,
      pendingAnalysis,
    })
  } catch (error) {
    console.error('Stats API error:', error)
    return NextResponse.json(
      { error: 'Failed to fetch statistics' },
      { status: 500 }
    )
  }
}