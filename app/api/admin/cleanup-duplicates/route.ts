import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export async function POST() {
  try {
    console.log('🧹 Starting duplicate cleanup...')

    // Find articles with duplicate titles from the same source
    const duplicateGroups = await prisma.article.groupBy({
      by: ['title', 'sourceId'],
      having: {
        id: {
          _count: {
            gt: 1
          }
        }
      },
      _count: {
        id: true
      }
    })

    let totalRemoved = 0

    for (const group of duplicateGroups) {
      // Get all articles with this title and source
      const duplicateArticles = await prisma.article.findMany({
        where: {
          title: group.title,
          sourceId: group.sourceId
        },
        orderBy: {
          createdAt: 'asc' // Keep the oldest one
        },
        include: {
          timelineEvents: true
        }
      })

      if (duplicateArticles.length > 1) {
        // Keep the first (oldest) article, remove the rest
        const toRemove = duplicateArticles.slice(1)
        
        for (const article of toRemove) {
          // Delete associated timeline events first
          await prisma.timelineEvent.deleteMany({
            where: {
              articleId: article.id
            }
          })

          // Delete the duplicate article
          await prisma.article.delete({
            where: {
              id: article.id
            }
          })

          console.log(`🗑️ Removed duplicate: ${article.title}`)
          totalRemoved++
        }
      }
    }

    // Also look for similar titles (fuzzy matching)
    const recentArticles = await prisma.article.findMany({
      where: {
        createdAt: {
          gte: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000) // Last 7 days
        }
      },
      orderBy: {
        createdAt: 'desc'
      },
      include: {
        source: true
      }
    })

    const potentialDuplicates = []
    
    for (let i = 0; i < recentArticles.length; i++) {
      for (let j = i + 1; j < recentArticles.length; j++) {
        const article1 = recentArticles[i]
        const article2 = recentArticles[j]
        
        // Check if titles are very similar (same first 60 characters)
        const title1Start = article1.title.substring(0, 60).toLowerCase()
        const title2Start = article2.title.substring(0, 60).toLowerCase()
        
        if (title1Start === title2Start && 
            article1.sourceId === article2.sourceId &&
            Math.abs(new Date(article1.createdAt).getTime() - new Date(article2.createdAt).getTime()) < 2 * 60 * 60 * 1000) { // Within 2 hours
          
          potentialDuplicates.push({
            keep: article1,
            remove: article2
          })
        }
      }
    }

    // Remove fuzzy duplicates
    for (const dup of potentialDuplicates) {
      try {
        // Delete timeline events
        await prisma.timelineEvent.deleteMany({
          where: {
            articleId: dup.remove.id
          }
        })

        // Delete the article
        await prisma.article.delete({
          where: {
            id: dup.remove.id
          }
        })

        console.log(`🗑️ Removed fuzzy duplicate: ${dup.remove.title}`)
        totalRemoved++
      } catch (error) {
        console.error('Error removing fuzzy duplicate:', error)
      }
    }

    await prisma.monitoringLog.create({
      data: {
        sourceType: 'NEWS_ARTICLE',
        action: 'cleanup_duplicates',
        status: 'SUCCESS',
        message: `Duplicate cleanup completed. Removed ${totalRemoved} duplicate articles`,
        metadata: { 
          totalRemoved,
          exactDuplicates: duplicateGroups.length,
          fuzzyDuplicates: potentialDuplicates.length
        }
      }
    })

    console.log(`✅ Cleanup complete. Removed ${totalRemoved} duplicates`)

    return NextResponse.json({
      success: true,
      totalRemoved,
      exactDuplicates: duplicateGroups.length,
      fuzzyDuplicates: potentialDuplicates.length,
      message: `Successfully removed ${totalRemoved} duplicate articles`
    })

  } catch (error) {
    console.error('❌ Duplicate cleanup failed:', error)
    
    await prisma.monitoringLog.create({
      data: {
        sourceType: 'NEWS_ARTICLE',
        action: 'cleanup_duplicates',
        status: 'ERROR',
        message: `Duplicate cleanup failed: ${error instanceof Error ? error.message : 'Unknown error'}`,
        metadata: { error: String(error) }
      }
    })

    return NextResponse.json(
      { error: 'Duplicate cleanup failed', details: String(error) },
      { status: 500 }
    )
  }
}