import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export async function GET() {
  try {
    const sources = await prisma.source.findMany({
      orderBy: [
        { type: 'asc' },
        { name: 'asc' },
      ],
    })

    return NextResponse.json(sources)
  } catch (error) {
    console.error('Admin sources API error:', error)
    return NextResponse.json(
      { error: 'Failed to fetch sources' },
      { status: 500 }
    )
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { name, type, url, description } = body

    if (!name || !type || !url) {
      return NextResponse.json(
        { error: 'Missing required fields: name, type, url' },
        { status: 400 }
      )
    }

    const source = await prisma.source.create({
      data: {
        name,
        type,
        url,
        description,
      },
    })

    return NextResponse.json(source)
  } catch (error) {
    console.error('Source creation error:', error)
    return NextResponse.json(
      { error: 'Failed to create source' },
      { status: 500 }
    )
  }
}