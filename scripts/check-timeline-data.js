require('dotenv').config({ path: '.env.local' })
const { PrismaClient } = require('@prisma/client')

const prisma = new PrismaClient()

async function checkData() {
  try {
    console.log('🔍 Checking timeline data...')

    const timelineEvents = await prisma.timelineEvent.findMany({
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
      take: 10,
    })

    console.log(`📊 Found ${timelineEvents.length} timeline events:`)
    
    timelineEvents.forEach((event, index) => {
      console.log(`\n${index + 1}. ${event.title}`)
      console.log(`   Date: ${event.eventDate}`)
      console.log(`   Importance: ${event.importance}`)
      console.log(`   Source: ${event.article.source.name}`)
      console.log(`   Description: ${event.description}`)
    })

  } catch (error) {
    console.error('❌ Error checking data:', error)
  } finally {
    await prisma.$disconnect()
  }
}

checkData()