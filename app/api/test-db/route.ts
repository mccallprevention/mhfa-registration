// app/api/test-db/route.ts
export const runtime = 'nodejs'           // ⬅ important!

import { NextResponse } from 'next/server'
import { EventDatabase } from '@/lib/db/redis-client'

export async function GET() {
  try {
    // Test basic connection
    const events = await EventDatabase.getAllEvents()

    return NextResponse.json({
      success: true,
      message: 'Redis Cloud is working!',
      eventCount: events.length,
      redisUrl: process.env.REDIS_URL ? 'Set correctly' : 'Missing',
    })
  } catch (error) {
    console.error('Database test failed:', error)
    return NextResponse.json(
      { success: false, error: (error as Error).message },
      { status: 500 },
    )
  }
}
