// app/test-events/page.tsx
'use client'

import { useState, useEffect } from 'react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { LogoHeader } from '@/components/ui/logo-header'
import { TrainingFilter } from '@/components/training-filter'
import type { Event } from '@/lib/types'
import { formatDate, formatTimeRange } from '@/lib/utils'
import { MapPin, Clock, Trash2, Plus, RefreshCw } from 'lucide-react'

export default function TestEventsPage() {
  const [events, setEvents] = useState<Event[]>([])
  const [loading, setLoading] = useState(true)
  const [message, setMessage] = useState<string>('')
  const [activeFilter, setActiveFilter] = useState<'all' | 'MHFA' | 'QPR'>('all')

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
        fetchEvents()
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
        fetchEvents()
      } else {
        const error = await response.json()
        setMessage(`Error: ${error.error}`)
      }
    } catch (error) {
      setMessage(`Error: ${error}`)
    }
  }

  // Filter events based on active filter
  const filteredEvents = events.filter(event => 
    activeFilter === 'all' || event.trainingType === activeFilter
  )

  if (loading) {
    return (
      <div className="min-h-screen bg-mccall-cream">
        <div className="container mx-auto px-4 py-8">
          <div className="flex items-center justify-center py-20">
            <div className="text-center">
              <div className="animate-spin rounded-full h-12 w-12 border-4 border-mccall-navy border-t-transparent mx-auto"></div>
              <p className="mt-4 text-mccall-navy font-medium">Loading events...</p>
            </div>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-mccall-cream">
      {/* Header */}
      <div className="bg-mccall-gradient-blue">
        <div className="container mx-auto px-4 py-8">
          <LogoHeader className="mb-6" />
          <div className="text-center text-white">
            <h1 className="text-4xl font-bold mb-2">Event Database Test</h1>
            <p className="text-xl text-white/90">Admin Testing Interface</p>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-8">
        {/* Action Buttons */}
        <Card className="mb-8">
          <CardHeader>
            <CardTitle className="text-mccall-navy">Database Operations</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex flex-wrap gap-4">
              <Button 
                onClick={addTestEvent}
                className="bg-mccall-green hover:bg-mccall-green/90 text-white rounded-full"
              >
                <Plus className="w-4 h-4 mr-2" />
                Add Test Event
              </Button>
              <Button 
                onClick={fetchEvents}
                variant="outline"
                className="border-mccall-navy text-mccall-navy hover:bg-mccall-navy hover:text-white rounded-full"
              >
                <RefreshCw className="w-4 h-4 mr-2" />
                Refresh Events
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Status Message */}
        {message && (
          <Card className="mb-6">
            <CardContent className="pt-6">
              <div className="p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
                <p className="text-yellow-800">{message}</p>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Stats & Filter */}
        <div className="mb-6 space-y-4">
          <Card>
            <CardContent className="pt-6">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-center">
                <div>
                  <p className="text-3xl font-bold text-mccall-navy">{events.length}</p>
                  <p className="text-sm text-gray-600">Total Events</p>
                </div>
                <div>
                  <p className="text-3xl font-bold text-mccall-green">
                    {events.filter(e => e.trainingType === 'MHFA').length}
                  </p>
                  <p className="text-sm text-gray-600">MHFA Events</p>
                </div>
                <div>
                  <p className="text-3xl font-bold text-mccall-green">
                    {events.filter(e => e.trainingType === 'QPR').length}
                  </p>
                  <p className="text-sm text-gray-600">QPR Events</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="pt-6">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <h2 className="text-xl font-semibold text-mccall-navy">
                  Filter Events ({filteredEvents.length} shown)
                </h2>
                <TrainingFilter
                  activeFilter={activeFilter}
                  onFilterChange={setActiveFilter}
                  currentLanguage="en"
                />
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Events Grid */}
        {filteredEvents.length === 0 ? (
          <Card>
            <CardContent className="pt-6">
              <div className="text-center py-12">
                <p className="text-gray-600 text-lg">
                  {events.length === 0 ? 'No events found. Create your first event to get started.' : 'No events match the current filter.'}
                </p>
              </div>
            </CardContent>
          </Card>
        ) : (
          <div className="grid gap-6">
            {filteredEvents.map((event) => (
              <Card key={event.id} className="border-0 shadow-md hover:shadow-lg transition-shadow duration-200 overflow-hidden">
                {/* Top accent bar */}
                <div className={`h-2 ${
                  event.trainingType === 'MHFA' ? 'bg-mccall-gradient-blue' : 'bg-mccall-gradient-green'
                }`} />
                
                <CardHeader className="pb-3">
                  <div className="flex items-start justify-between gap-3">
                    <div className="flex-1">
                      <CardTitle className="text-xl text-mccall-navy mb-2">{event.title}</CardTitle>
                      <div className="text-xs text-gray-500 mb-3">ID: {event.id}</div>
                      <div className="flex items-center gap-2 text-gray-600 text-sm mb-2">
                        <Clock className="w-4 h-4" />
                        <span>{formatDate(event.date)} • {formatTimeRange(event.startTime, event.endTime)}</span>
                      </div>
                      <div className="flex items-start gap-2">
                        <MapPin className="w-4 h-4 text-gray-500 mt-0.5 flex-shrink-0" />
                        <div>
                          <p className="text-sm font-medium text-gray-700">{event.location}</p>
                          {event.address && (
                            <p className="text-sm text-gray-600">{event.address}</p>
                          )}
                        </div>
                      </div>
                    </div>
                    
                    <div className="flex flex-col items-end gap-3">
                      <span className={`px-4 py-1.5 text-xs font-bold rounded-full ${
                        event.trainingType === "MHFA" 
                          ? "bg-mccall-navy text-white" 
                          : "bg-mccall-green text-white"
                      }`}>
                        {event.trainingType}
                      </span>
                      
                      <Button
                        onClick={() => deleteEvent(event.id)}
                        variant="outline"
                        size="sm"
                        className="border-red-300 text-red-600 hover:bg-red-50 hover:border-red-400"
                      >
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    </div>
                  </div>
                </CardHeader>
              </Card>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}