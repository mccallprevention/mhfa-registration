// Updated app/api/events/route.ts - Auto-handle Google Form fields

export const runtime = 'nodejs' // 🚨 CRITICAL: Required for Redis

import { NextRequest, NextResponse } from 'next/server'
import { EventDatabase } from '@/lib/db/redis-client'
import { seedDatabaseIfEmpty } from '@/lib/db/seed'
import { filterEventsByArchiveStatus, createEventWithFormData } from '@/lib/utils'

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

// POST /api/events - Create new event with auto-generated Google Form data
export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    
    // Validate core required fields (Google Form fields will be auto-generated)
    const requiredFields = ['title', 'date', 'startTime', 'endTime', 'location', 'trainingType', 'language']
    for (const field of requiredFields) {
      if (!body[field]) {
        return NextResponse.json(
          { error: `Missing required field: ${field}` },
          { status: 400 }
        )
      }
    }

    // If Google Form fields are not provided, auto-generate them
    let eventData
    if (!body.googleFormBaseUrl || !body.dateEntryId || !body.locationEntryId) {
      // Use the utility function to auto-generate Google Form data
      eventData = createEventWithFormData({
        ...body,
        isActive: body.isActive ?? true,
        timeZone: body.timeZone ?? 'America/Denver'
      })
    } else {
      // Use provided Google Form data (for backwards compatibility)
      eventData = {
        ...body,
        isActive: body.isActive ?? true,
        timeZone: body.timeZone ?? 'America/Denver'
      }
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