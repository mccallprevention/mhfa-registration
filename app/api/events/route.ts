export const runtime = 'nodejs' // 🚨 CRITICAL: Required for Redis

import { NextRequest, NextResponse } from 'next/server'
import { EventDatabase } from '@/lib/db/redis-client'
import { seedDatabaseIfEmpty } from '@/lib/db/seed'

// GET /api/events - Get all events
export async function GET() {
  try {
    // Ensure database is seeded on first run
    await seedDatabaseIfEmpty()
    
    const events = await EventDatabase.getAllEvents()
    return NextResponse.json({ 
      events, 
      count: events.length 
    })
  } catch (error) {
    console.error('API Error:', error)
    return NextResponse.json(
      { error: 'Failed to fetch events' },
      { status: 500 }
    )
  }
}

// POST /api/events - Create new event
export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    
    // Validate required fields
    const requiredFields = ['title', 'date', 'startTime', 'endTime', 'location', 'trainingType', 'language', 'googleFormBaseUrl']
    for (const field of requiredFields) {
      if (!body[field]) {
        return NextResponse.json(
          { error: `Missing required field: ${field}` },
          { status: 400 }
        )
      }
    }

    const eventData = {
      ...body,
      isActive: body.isActive ?? true,
      timeZone: body.timeZone ?? 'America/Denver',
      dateEntryId: body.dateEntryId ?? 'entry.123456789',
      locationEntryId: body.locationEntryId ?? 'entry.987654321',
    }

    const newEvent = await EventDatabase.createEvent(eventData)
    
    return NextResponse.json({ event: newEvent }, { status: 201 })
  } catch (error) {
    console.error('API Error:', error)
    return NextResponse.json(
      { error: 'Failed to create event' },
      { status: 500 }
    )
  }
}