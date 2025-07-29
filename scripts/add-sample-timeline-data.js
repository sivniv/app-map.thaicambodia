require('dotenv').config({ path: '.env.local' })
const { PrismaClient } = require('@prisma/client')

const prisma = new PrismaClient()

async function addSampleData() {
  try {
    console.log('🔧 Adding sample timeline data...')

    // Create a sample source
    const source = await prisma.source.upsert({
      where: { url: 'https://sample-news.com' },
      update: {},
      create: {
        name: 'Sample News Source',
        type: 'NEWS_ARTICLE',
        url: 'https://sample-news.com',
        description: 'Sample news source for testing'
      }
    })

    // Create sample articles
    const articles = await Promise.all([
      prisma.article.create({
        data: {
          sourceId: source.id,
          title: 'Thailand-Cambodia Border Dispute Escalates',
          content: 'Recent tensions at the Thailand-Cambodia border have escalated following disputed territorial claims. Both governments are calling for diplomatic resolution while maintaining military presence at key checkpoints.',
          originalUrl: 'https://sample-news.com/article1',
          publishedAt: new Date(Date.now() - 2 * 60 * 60 * 1000), // 2 hours ago
          status: 'ANALYZED',
          tags: ['border', 'dispute', 'diplomacy'],
          summary: 'Border tensions escalate with both nations maintaining diplomatic stance',
          aiAnalysis: JSON.stringify({
            conflictRelevance: 8,
            importance: 4,
            sentiment: 'negative',
            keywords: ['border', 'dispute', 'diplomacy', 'military']
          }),
          metadata: {
            importance: 4,
            conflictRelevance: 8,
            sentiment: 'negative'
          }
        }
      }),
      prisma.article.create({
        data: {
          sourceId: source.id,
          title: 'ASEAN Mediates Thailand-Cambodia Talks',
          content: 'ASEAN has stepped in to mediate ongoing discussions between Thailand and Cambodia regarding recent border incidents. The regional bloc emphasizes peaceful resolution and mutual respect.',
          originalUrl: 'https://sample-news.com/article2',
          publishedAt: new Date(Date.now() - 4 * 60 * 60 * 1000), // 4 hours ago
          status: 'ANALYZED',
          tags: ['ASEAN', 'mediation', 'diplomacy'],
          summary: 'ASEAN mediates diplomatic talks between Thailand and Cambodia',
          aiAnalysis: JSON.stringify({
            conflictRelevance: 6,
            importance: 3,
            sentiment: 'neutral',
            keywords: ['ASEAN', 'mediation', 'diplomacy', 'peaceful']
          }),
          metadata: {
            importance: 3,
            conflictRelevance: 6,
            sentiment: 'neutral'
          }
        }
      }),
      prisma.article.create({
        data: {
          sourceId: source.id,
          title: 'Historical Temple Dispute Resurfaces',
          content: 'The long-standing dispute over the Preah Vihear temple has resurfaced in recent diplomatic discussions. Both nations claim historical rights to the ancient temple complex.',
          originalUrl: 'https://sample-news.com/article3',
          publishedAt: new Date(Date.now() - 6 * 60 * 60 * 1000), // 6 hours ago
          status: 'ANALYZED',
          tags: ['temple', 'history', 'heritage'],
          summary: 'Preah Vihear temple dispute returns to diplomatic agenda',
          aiAnalysis: JSON.stringify({
            conflictRelevance: 7,
            importance: 5,
            sentiment: 'negative',
            keywords: ['temple', 'heritage', 'historical', 'dispute']
          }),
          metadata: {
            importance: 5,
            conflictRelevance: 7,
            sentiment: 'negative'
          }
        }
      })
    ])

    // Create timeline events for each article
    const timelineEvents = await Promise.all(articles.map((article, index) => 
      prisma.timelineEvent.create({
        data: {
          articleId: article.id,
          eventType: 'news_article',
          eventDate: article.publishedAt,
          title: article.title,
          description: article.summary,
          importance: article.metadata.importance
        }
      })
    ))

    console.log(`✅ Successfully created:`)
    console.log(`   - 1 source: ${source.name}`)
    console.log(`   - ${articles.length} articles`)
    console.log(`   - ${timelineEvents.length} timeline events`)

  } catch (error) {
    console.error('❌ Error adding sample data:', error)
  } finally {
    await prisma.$disconnect()
  }
}

addSampleData()