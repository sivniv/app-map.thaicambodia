import { NextRequest, NextResponse } from 'next/server'

// Note: This webhook endpoint is now deprecated since we're using RapidAPI polling instead of Facebook webhooks
// Keeping it for backward compatibility but it will redirect to the new monitoring endpoint

export async function GET(request: NextRequest) {
  return NextResponse.json({ 
    error: 'Facebook webhook endpoint deprecated',
    message: 'Facebook monitoring is now handled via RapidAPI polling. Use /api/monitor/facebook instead.',
    redirectTo: '/api/monitor/facebook'
  }, { status: 410 }) // 410 Gone
}

export async function POST(request: NextRequest) {
  return NextResponse.json({ 
    error: 'Facebook webhook endpoint deprecated',
    message: 'Facebook monitoring is now handled via RapidAPI polling. Use /api/monitor/facebook instead.',
    redirectTo: '/api/monitor/facebook'
  }, { status: 410 }) // 410 Gone
}