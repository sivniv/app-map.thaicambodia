import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const limit = parseInt(searchParams.get('limit') || '50')
    const sourceType = searchParams.get('sourceType')

    const whereClause: any = {}
    if (sourceType) {
      whereClause.sourceType = sourceType
    }

    const logs = await prisma.monitoringLog.findMany({
      where: whereClause,
      orderBy: {
        createdAt: 'desc',
      },
      take: limit,
    })

    return NextResponse.json(logs)
  } catch (error) {
    console.error('Admin logs API error:', error)
    return NextResponse.json(
      { error: 'Failed to fetch logs' },
      { status: 500 }
    )
  }
}