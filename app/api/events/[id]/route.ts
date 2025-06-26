export const runtime = 'nodejs' // 🚨 CRITICAL: Required for Redis

import { NextRequest, NextResponse } from 'next/server'
import { EventDatabase } from '@/lib/db/redis-client'

interface RouteContext {
  params: Promise<{ id: string }> // ← Changed to Promise!
}

// GET /api/events/[id] - Get single event
export async function GET(
  request: NextRequest,
  { params }: RouteContext
) {
  try {
    const { id } = await params // ← Added await!
    const event = await EventDatabase.getEventById(id)
    
    if (!event) {
      return NextResponse.json(
        { error: 'Event not found' },
        { status: 404 }
      )
    }

    return NextResponse.json({ event })
  } catch (error) {
    console.error('API Error:', error)
    return NextResponse.json(
      { error: 'Failed to fetch event' },
      { status: 500 }
    )
  }
}

// PUT /api/events/[id] - Update event
export async function PUT(
  request: NextRequest,
  { params }: RouteContext
) {
  try {
    const { id } = await params // ← Added await!
    const body = await request.json()
    const updatedEvent = await EventDatabase.updateEvent(id, body)
    
    if (!updatedEvent) {
      return NextResponse.json(
        { error: 'Event not found' },
        { status: 404 }
      )
    }

    return NextResponse.json({ event: updatedEvent })
  } catch (error) {
    console.error('API Error:', error)
    return NextResponse.json(
      { error: 'Failed to update event' },
      { status: 500 }
    )
  }
}

// DELETE /api/events/[id] - Delete event
export async function DELETE(
  request: NextRequest,
  { params }: RouteContext
) {
  try {
    const { id } = await params // ← Added await!
    const success = await EventDatabase.deleteEvent(id)
    
    if (!success) {
      return NextResponse.json(
        { error: 'Event not found' },
        { status: 404 }
      )
    }

    return NextResponse.json({ message: 'Event deleted successfully' })
  } catch (error) {
    console.error('API Error:', error)
    return NextResponse.json(
      { error: 'Failed to delete event' },
      { status: 500 }
    )
  }
}