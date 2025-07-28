import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const limit = parseInt(searchParams.get('limit') || '50')
    const type = searchParams.get('type') // 'facebook_post' | 'news_article'
    const sourceId = searchParams.get('sourceId') // Filter by specific source
    const sourceName = searchParams.get('sourceName') // Filter by source name
    
    const whereClause: any = {}
    
    if (type) {
      whereClause.eventType = type
    }
    
    // Filter by source
    if (sourceId || sourceName) {
      whereClause.article = {}
      
      if (sourceId) {
        whereClause.article.sourceId = sourceId
      }
      
      if (sourceName) {
        whereClause.article.source = {
          name: {
            contains: sourceName,
            mode: 'insensitive'
          }
        }
      }
    }

    const timelineEvents = await prisma.timelineEvent.findMany({
      where: whereClause,
      include: {
        article: {
          select: {
            id: true,
            title: true,
            originalUrl: true,
            source: {
              select: {
                name: true,
                type: true,
              },
            },
          },
        },
      },
      orderBy: {
        eventDate: 'desc',
      },
      take: limit,
    })

    return NextResponse.json(timelineEvents)
  } catch (error) {
    console.error('Timeline API error:', error)
    return NextResponse.json(
      { error: 'Failed to fetch timeline' },
      { status: 500 }
    )
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { articleId, eventType, eventDate, title, description, importance } = body

    if (!articleId || !eventType || !eventDate || !title) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      )
    }

    const timelineEvent = await prisma.timelineEvent.create({
      data: {
        articleId,
        eventType,
        eventDate: new Date(eventDate),
        title,
        description,
        importance: importance || 1,
      },
      include: {
        article: {
          include: {
            source: {
              select: {
                name: true,
                type: true,
              },
            },
          },
        },
      },
    })

    return NextResponse.json(timelineEvent)
  } catch (error) {
    console.error('Timeline creation error:', error)
    return NextResponse.json(
      { error: 'Failed to create timeline event' },
      { status: 500 }
    )
  }
}