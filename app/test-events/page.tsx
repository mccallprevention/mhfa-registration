'use client'

import { useState, useEffect } from 'react'
import type { Event } from '@/lib/types'

export default function TestEventsPage() {
  const [events, setEvents] = useState<Event[]>([])
  const [loading, setLoading] = useState(true)
  const [message, setMessage] = useState<string>('')

  const fetchEvents = async () => {
    try {
      const response = await fetch('/api/events')
      const data = await response.json()
      setEvents(data.events || [])
    } catch (error) {
      console.error('Failed to fetch events:', error)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchEvents()
  }, [])

  const deleteEvent = async (eventId: string) => {
    if (!confirm('Are you sure you want to delete this event?')) return

    try {
      const response = await fetch(`/api/events/${eventId}`, {
        method: 'DELETE'
      })

      if (response.ok) {
        setMessage(`Event ${eventId} deleted successfully!`)
        fetchEvents() // Refresh the list
      } else {
        const error = await response.json()
        setMessage(`Error: ${error.error}`)
      }
    } catch (error) {
      setMessage(`Error: ${error}`)
    }
  }

  const addTestEvent = async () => {
    const newEvent = {
      title: `Test Event - ${new Date().toLocaleTimeString()}`,
      date: '2025-12-31',
      startTime: '10:00',
      endTime: '12:00',
      location: 'Test Location',
      address: '123 Test Street, Test City, CT 06000',
      trainingType: 'MHFA' as const,
      language: 'en' as const,
      googleFormBaseUrl: 'https://docs.google.com/forms/d/test',
      dateEntryId: 'entry.test',
      locationEntryId: 'entry.test'
    }

    try {
      const response = await fetch('/api/events', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(newEvent)
      })

      if (response.ok) {
        const data = await response.json()
        setMessage(`Event created: ${data.event.id}`)
        fetchEvents() // Refresh the list
      } else {
        const error = await response.json()
        setMessage(`Error: ${error.error}`)
      }
    } catch (error) {
      setMessage(`Error: ${error}`)
    }
  }

  if (loading) {
    return <div className="p-8">Loading events...</div>
  }

  return (
    <div className="p-8 max-w-6xl mx-auto">
      <h1 className="text-3xl font-bold mb-6">Event Database Test</h1>
      
      <div className="mb-6 space-x-4">
        <button 
          onClick={addTestEvent}
          className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
        >
          Add Test Event
        </button>
        <button 
          onClick={fetchEvents}
          className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700"
        >
          Refresh Events
        </button>
      </div>

      {message && (
        <div className="mb-4 p-3 bg-yellow-100 border border-yellow-400 rounded">
          {message}
        </div>
      )}

      <div className="mb-4">
        <strong>Total Events: {events.length}</strong>
      </div>

      <div className="grid gap-4">
        {events.map((event) => (
          <div key={event.id} className="border p-4 rounded bg-white shadow">
            <div className="flex justify-between items-start">
              <div>
                <h3 className="font-bold">{event.title}</h3>
                <p className="text-sm text-gray-600">ID: {event.id}</p>
                <p>{event.date} • {event.startTime}-{event.endTime}</p>
                <p>{event.location}</p>
                <p className="text-sm">
                  {event.trainingType} • {event.language.toUpperCase()}
                </p>
              </div>
              <button
                onClick={() => deleteEvent(event.id)}
                className="bg-red-600 text-white px-3 py-1 rounded text-sm hover:bg-red-700"
              >
                Delete
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}