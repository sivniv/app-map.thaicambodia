import { NextRequest, NextResponse } from 'next/server'
import { FacebookMonitor } from '@/lib/facebook'

const facebookMonitor = new FacebookMonitor(
  process.env.RAPIDAPI_KEY || '',
  process.env.RAPIDAPI_HOST || 'facebook-scraper3.p.rapidapi.com'
)

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url)
  const pageId = searchParams.get('pageId')
  
  if (!pageId) {
    return NextResponse.json({ error: 'pageId parameter is required' }, { status: 400 })
  }

  try {
    console.log(`🧪 Testing Facebook page ID: ${pageId}`)
    
    // Test connection first
    const connectionTest = await facebookMonitor.testConnection()
    console.log(`🔗 Connection test result: ${connectionTest}`)
    
    if (!connectionTest) {
      return NextResponse.json({
        error: 'RapidAPI connection failed',
        pageId,
        connectionTest: false
      }, { status: 500 })
    }

    // Fetch posts from the specific page
    const posts = await facebookMonitor.getPagePosts(pageId, 5)
    console.log(`📊 Raw API response for page ${pageId}:`, {
      postsCount: posts.length,
      posts: posts.length > 0 ? posts : 'No posts returned'
    })

    return NextResponse.json({
      success: true,
      pageId,
      connectionTest: true,
      postsCount: posts.length,
      posts: posts.length > 0 ? posts.map(post => ({
        id: post.id,
        message: post.message?.substring(0, 200) + '...' || 'No message',
        created_time: post.created_time,
        from: post.from,
        hasContent: !!(post.message || post.story)
      })) : [],
      rawFirstPost: posts.length > 0 ? posts[0] : null
    })
  } catch (error: any) {
    console.error(`❌ Error testing page ${pageId}:`, error)
    
    return NextResponse.json({
      error: 'Failed to test Facebook page',
      pageId,
      details: error.message,
      stack: error.stack
    }, { status: 500 })
  }
}