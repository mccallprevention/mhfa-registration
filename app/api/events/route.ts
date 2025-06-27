// Update app/api/events/route.ts

export const runtime = 'nodejs' // 🚨 CRITICAL: Required for Redis

import { NextRequest, NextResponse } from 'next/server'
import { EventDatabase } from '@/lib/db/redis-client'
import { seedDatabaseIfEmpty } from '@/lib/db/seed'
import { filterEventsByArchiveStatus } from '@/lib/utils'

// GET /api/events - Get all events with optional archive filtering
export async function GET(request: NextRequest) {
  try {
    // Ensure database is seeded on first run
    await seedDatabaseIfEmpty()
    
    const { searchParams } = new URL(request.url)
    const includeArchived = searchParams.get('includeArchived') === 'true'
    const showOnlyArchived = searchParams.get('archived') === 'true'
    
    const allEvents = await EventDatabase.getAllEvents()
    
    let events = allEvents
    
    if (showOnlyArchived) {
      // Show only archived events
      events = filterEventsByArchiveStatus(allEvents, true)
    } else if (!includeArchived) {
      // Show only active events (default behavior)
      events = filterEventsByArchiveStatus(allEvents, false)
    }
    // If includeArchived=true and archived is not specified, show all events
    
    return NextResponse.json({ 
      events, 
      count: events.length,
      totalCount: allEvents.length
    })
  } catch (error) {
    console.error('API Error:', error)
    return NextResponse.json(
      { error: 'Failed to fetch events' },
      { status: 500 }
    )
  }
}

// POST /api/events - Create new event (unchanged)
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