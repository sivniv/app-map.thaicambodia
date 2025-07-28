import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const type = searchParams.get('type') // Optional filter by type
    const active = searchParams.get('active') // Optional filter by active status
    const withCounts = searchParams.get('withCounts') === 'true' // Include article counts

    const whereClause: any = {}
    
    if (type) {
      whereClause.type = type
    }
    
    if (active !== null) {
      whereClause.isActive = active === 'true'
    }

    if (withCounts) {
      // Get sources with article counts
      const sources = await prisma.source.findMany({
        where: whereClause,
        select: {
          id: true,
          name: true,
          type: true,
          url: true,
          isActive: true,
          description: true,
          _count: {
            select: {
              articles: true
            }
          }
        },
        orderBy: [
          { type: 'asc' },
          { name: 'asc' }
        ]
      })

      return NextResponse.json(sources)
    } else {
      // Get basic source info
      const sources = await prisma.source.findMany({
        where: whereClause,
        select: {
          id: true,
          name: true,
          type: true,
          url: true,
          isActive: true,
          description: true,
        },
        orderBy: [
          { type: 'asc' },
          { name: 'asc' }
        ]
      })

      return NextResponse.json(sources)
    }
  } catch (error) {
    console.error('Sources API error:', error)
    return NextResponse.json(
      { error: 'Failed to fetch sources' },
      { status: 500 }
    )
  }
}