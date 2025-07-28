import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const page = parseInt(searchParams.get('page') || '1')
    const limit = parseInt(searchParams.get('limit') || '20')
    const type = searchParams.get('type') // 'FACEBOOK_POST' | 'NEWS_ARTICLE'
    const status = searchParams.get('status')
    const search = searchParams.get('search')
    const sourceId = searchParams.get('sourceId') // Filter by specific source
    const sourceName = searchParams.get('sourceName') // Filter by source name
    
    const skip = (page - 1) * limit
    
    const whereClause: any = {}
    
    // Build source filter
    if (type || sourceId || sourceName) {
      whereClause.source = {}
      
      if (type) {
        whereClause.source.type = type
      }
      
      if (sourceId) {
        whereClause.source.id = sourceId
      }
      
      if (sourceName) {
        whereClause.source.name = {
          contains: sourceName,
          mode: 'insensitive'
        }
      }
    }
    
    if (status) {
      whereClause.status = status
    }
    
    if (search) {
      whereClause.OR = [
        { title: { contains: search, mode: 'insensitive' } },
        { content: { contains: search, mode: 'insensitive' } },
        { summary: { contains: search, mode: 'insensitive' } },
      ]
    }

    const [articles, total] = await Promise.all([
      prisma.article.findMany({
        where: whereClause,
        include: {
          source: {
            select: {
              name: true,
              type: true,
            },
          },
        },
        orderBy: {
          publishedAt: 'desc',
        },
        skip,
        take: limit,
      }),
      prisma.article.count({ where: whereClause }),
    ])

    return NextResponse.json({
      articles,
      pagination: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit),
      },
    })
  } catch (error) {
    console.error('Articles API error:', error)
    return NextResponse.json(
      { error: 'Failed to fetch articles' },
      { status: 500 }
    )
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const {
      sourceId,
      title,
      content,
      originalUrl,
      summary,
      aiAnalysis,
      publishedAt,
      tags,
      metadata,
    } = body

    if (!sourceId || !title || !content) {
      return NextResponse.json(
        { error: 'Missing required fields: sourceId, title, content' },
        { status: 400 }
      )
    }

    const article = await prisma.article.create({
      data: {       
        sourceId,
        title,
        content,
        originalUrl,
        summary,
        aiAnalysis,
        publishedAt: publishedAt ? new Date(publishedAt) : new Date(),
        tags: tags || [],
        metadata: metadata || {},
        status: 'PENDING',
      },
      include: {
        source: {
          select: {
            name: true,
            type: true,
          },
        },
      },
    })

    return NextResponse.json(article)
  } catch (error) {
    console.error('Article creation error:', error)
    return NextResponse.json(
      { error: 'Failed to create article' },
      { status: 500 }
    )
  }
}