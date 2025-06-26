// app/admin/page.tsx
'use client'

import { useState, useEffect } from 'react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { LogoHeader } from '@/components/ui/logo-header'
import { TrainingFilter } from '@/components/training-filter'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog'
import type { Event } from '@/lib/types'
import { formatDate, formatTimeRange } from '@/lib/utils'
import { MapPin, Clock, Trash2, Plus, RefreshCw, Edit2, LogOut, User } from 'lucide-react'

interface EventFormData {
  title: string
  date: string
  startTime: string
  endTime: string
  location: string
  street: string
  town: string
  state: string
  zip: string
  trainingType: 'MHFA' | 'QPR'
  language: 'en' | 'es'
  googleFormBaseUrl: string
  dateEntryId: string
  locationEntryId: string
}

const emptyFormData: EventFormData = {
  title: '',
  date: '',
  startTime: '',
  endTime: '',
  location: '',
  street: '',
  town: 'Torrington',
  state: 'CT',
  zip: '06790',
  trainingType: 'MHFA',
  language: 'en',
  googleFormBaseUrl: '',
  dateEntryId: '',
  locationEntryId: ''
}

export default function AdminDashboard() {
  const [events, setEvents] = useState<Event[]>([])
  const [loading, setLoading] = useState(true)
  const [message, setMessage] = useState<string>('')
  const [activeFilter, setActiveFilter] = useState<'all' | 'MHFA' | 'QPR'>('all')
  
  // Modal and form state
  const [showModal, setShowModal] = useState(false)
  const [editingEvent, setEditingEvent] = useState<Event | null>(null)
  const [formData, setFormData] = useState<EventFormData>(emptyFormData)
  const [formLoading, setFormLoading] = useState(false)
  const [formErrors, setFormErrors] = useState<Record<string, string>>({})

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

  const handleLogout = async () => {
    try {
      await fetch('/api/test-auth', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ action: 'logout' })
      })
      window.location.href = '/admin/login'
    } catch (error) {
      console.error('Logout error:', error)
    }
  }

  const deleteEvent = async (eventId: string) => {
    if (!confirm('Are you sure you want to delete this event?')) return

    try {
      const response = await fetch(`/api/events/${eventId}`, {
        method: 'DELETE'
      })

      if (response.ok) {
        setMessage(`Event deleted successfully!`)
        fetchEvents()
      } else {
        const error = await response.json()
        setMessage(`Error: ${error.error}`)
      }
    } catch (error) {
      setMessage(`Error: ${error}`)
    }
  }

  const openCreateModal = () => {
    setEditingEvent(null)
    setFormData(emptyFormData)
    setFormErrors({})
    setShowModal(true)
  }

  const openEditModal = (event: Event) => {
    setEditingEvent(event)
    
    // Parse existing address or use defaults
    const addressParts = event.address ? event.address.split(', ') : []
    const street = addressParts[0] || ''
    const town = addressParts[1] || 'Torrington'
    const stateZip = addressParts[2] || 'CT 06790'
    const [state, zip] = stateZip.split(' ')
    
    setFormData({
      title: event.title,
      date: event.date,
      startTime: event.startTime,
      endTime: event.endTime,
      location: event.location,
      street: street,
      town: town,
      state: state || 'CT',
      zip: zip || '06790',
      trainingType: event.trainingType,
      language: event.language,
      googleFormBaseUrl: event.googleFormBaseUrl || '',
      dateEntryId: event.dateEntryId || '',
      locationEntryId: event.locationEntryId || ''
    })
    setFormErrors({})
    setShowModal(true)
  }

  const validateForm = (): boolean => {
    const errors: Record<string, string> = {}
    
    if (!formData.title.trim()) errors.title = 'Title is required'
    if (!formData.date) errors.date = 'Date is required'
    if (!formData.startTime) errors.startTime = 'Start time is required'
    if (!formData.endTime) errors.endTime = 'End time is required'
    if (!formData.location.trim()) errors.location = 'Location is required'
    
    // Validate time range
    if (formData.startTime && formData.endTime && formData.startTime >= formData.endTime) {
      errors.endTime = 'End time must be after start time'
    }
    
    setFormErrors(errors)
    return Object.keys(errors).length === 0
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!validateForm()) return
    
    setFormLoading(true)
    
    try {
      // Combine address fields into a single address string
      const address = formData.street.trim() 
        ? `${formData.street}, ${formData.town}, ${formData.state} ${formData.zip}`
        : ''
      
      const eventData = {
        title: formData.title,
        date: formData.date,
        startTime: formData.startTime,
        endTime: formData.endTime,
        location: formData.location,
        address: address,
        trainingType: formData.trainingType,
        language: formData.language,
        googleFormBaseUrl: formData.googleFormBaseUrl,
        dateEntryId: formData.dateEntryId,
        locationEntryId: formData.locationEntryId
      }
      
      const url = editingEvent ? `/api/events/${editingEvent.id}` : '/api/events'
      const method = editingEvent ? 'PUT' : 'POST'
      
      const response = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(eventData)
      })

      if (response.ok) {
        setMessage(editingEvent ? 'Event updated successfully!' : `Event created successfully!`)
        setShowModal(false)
        fetchEvents()
      } else {
        const error = await response.json()
        setMessage(`Error: ${error.error}`)
      }
    } catch (error) {
      setMessage(`Error: ${error}`)
    } finally {
      setFormLoading(false)
    }
  }

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
              <p className="mt-4 text-mccall-navy font-medium">Loading admin dashboard...</p>
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
          <div className="flex justify-between items-start mb-6">
            <LogoHeader />
            <div className="flex items-center gap-4 text-white">
              <div className="flex items-center gap-2">
                <User className="w-4 h-4" />
                <span className="text-sm">Logged in as: admin</span>
              </div>
              <Button
                onClick={handleLogout}
                variant="outline"
                size="sm"
                className="bg-white/10 border-white/20 text-white hover:bg-white/20"
              >
                <LogOut className="w-4 h-4 mr-1" />
                Logout
              </Button>
            </div>
          </div>
          
          <div className="text-center text-white">
            <h1 className="text-4xl font-bold mb-2">Admin Dashboard</h1>
            <p className="text-xl text-white/90">Event Management System</p>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-8">
        {/* Action Buttons */}
        <Card className="mb-8">
          <CardHeader>
            <CardTitle className="text-mccall-navy">Event Management</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex flex-wrap gap-4">
              <Dialog open={showModal} onOpenChange={setShowModal}>
                <DialogTrigger asChild>
                  <Button 
                    onClick={openCreateModal}
                    className="bg-mccall-green hover:bg-mccall-green/90 text-white rounded-full"
                  >
                    <Plus className="w-4 h-4 mr-2" />
                    Create Event
                  </Button>
                </DialogTrigger>
                
                <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
                  <DialogHeader>
                    <DialogTitle className="text-mccall-navy">
                      {editingEvent ? 'Edit Event' : 'Create New Event'}
                    </DialogTitle>
                  </DialogHeader>
                  
                  <form onSubmit={handleSubmit} className="space-y-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      {/* Title - Full Width */}
                      <div className="md:col-span-2">
                        <label className="block text-sm font-medium text-mccall-navy mb-1">
                          Event Title *
                        </label>
                        <input
                          type="text"
                          value={formData.title}
                          onChange={(e) => setFormData(prev => ({ ...prev, title: e.target.value }))}
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-mccall-green"
                          placeholder="Mental Health First Aid Training"
                        />
                        {formErrors.title && <p className="text-red-600 text-xs mt-1">{formErrors.title}</p>}
                      </div>

                      {/* Training Type */}
                      <div>
                        <label className="block text-sm font-medium text-mccall-navy mb-1">
                          Training Type *
                        </label>
                        <select
                          value={formData.trainingType}
                          onChange={(e) => setFormData(prev => ({ ...prev, trainingType: e.target.value as 'MHFA' | 'QPR' }))}
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-mccall-green"
                        >
                          <option value="MHFA">MHFA</option>
                          <option value="QPR">QPR</option>
                        </select>
                      </div>

                      {/* Language */}
                      <div>
                        <label className="block text-sm font-medium text-mccall-navy mb-1">
                          Language *
                        </label>
                        <select
                          value={formData.language}
                          onChange={(e) => setFormData(prev => ({ ...prev, language: e.target.value as 'en' | 'es' }))}
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-mccall-green"
                        >
                          <option value="en">English</option>
                          <option value="es">Spanish</option>
                        </select>
                      </div>

                      {/* Date */}
                      <div>
                        <label className="block text-sm font-medium text-mccall-navy mb-1">
                          Date *
                        </label>
                        <input
                          type="date"
                          value={formData.date}
                          onChange={(e) => setFormData(prev => ({ ...prev, date: e.target.value }))}
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-mccall-green"
                        />
                        {formErrors.date && <p className="text-red-600 text-xs mt-1">{formErrors.date}</p>}
                      </div>

                      {/* Time Range */}
                      <div className="grid grid-cols-2 gap-2">
                        <div>
                          <label className="block text-sm font-medium text-mccall-navy mb-1">
                            Start Time *
                          </label>
                          <input
                            type="time"
                            value={formData.startTime}
                            onChange={(e) => setFormData(prev => ({ ...prev, startTime: e.target.value }))}
                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-mccall-green"
                          />
                          {formErrors.startTime && <p className="text-red-600 text-xs mt-1">{formErrors.startTime}</p>}
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-mccall-navy mb-1">
                            End Time *
                          </label>
                          <input
                            type="time"
                            value={formData.endTime}
                            onChange={(e) => setFormData(prev => ({ ...prev, endTime: e.target.value }))}
                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-mccall-green"
                          />
                          {formErrors.endTime && <p className="text-red-600 text-xs mt-1">{formErrors.endTime}</p>}
                        </div>
                      </div>

                      {/* Location */}
                      <div>
                        <label className="block text-sm font-medium text-mccall-navy mb-1">
                          Location Name *
                        </label>
                        <input
                          type="text"
                          value={formData.location}
                          onChange={(e) => setFormData(prev => ({ ...prev, location: e.target.value }))}
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-mccall-green"
                          placeholder="Community Center"
                        />
                        {formErrors.location && <p className="text-red-600 text-xs mt-1">{formErrors.location}</p>}
                      </div>

                      {/* Address Fields */}
                      <div className="md:col-span-2">
                        <h3 className="text-lg font-medium text-mccall-navy mb-3">Address</h3>
                        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                          <div className="md:col-span-4">
                            <label className="block text-sm font-medium text-mccall-navy mb-1">
                              Street Address
                            </label>
                            <input
                              type="text"
                              value={formData.street}
                              onChange={(e) => setFormData(prev => ({ ...prev, street: e.target.value }))}
                              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-mccall-green"
                              placeholder="123 Main Street"
                            />
                          </div>
                          <div className="md:col-span-2">
                            <label className="block text-sm font-medium text-mccall-navy mb-1">
                              Town/City
                            </label>
                            <input
                              type="text"
                              value={formData.town}
                              onChange={(e) => setFormData(prev => ({ ...prev, town: e.target.value }))}
                              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-mccall-green"
                              placeholder="Torrington"
                            />
                          </div>
                          <div>
                            <label className="block text-sm font-medium text-mccall-navy mb-1">
                              State
                            </label>
                            <input
                              type="text"
                              value={formData.state}
                              onChange={(e) => setFormData(prev => ({ ...prev, state: e.target.value }))}
                              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-mccall-green"
                              placeholder="CT"
                              maxLength={2}
                            />
                          </div>
                          <div>
                            <label className="block text-sm font-medium text-mccall-navy mb-1">
                              ZIP Code
                            </label>
                            <input
                              type="text"
                              value={formData.zip}
                              onChange={(e) => setFormData(prev => ({ ...prev, zip: e.target.value }))}
                              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-mccall-green"
                              placeholder="06790"
                              maxLength={5}
                            />
                          </div>
                        </div>
                      </div>
                    </div>

                    <div className="flex gap-4 pt-4">
                      <Button
                        type="submit"
                        disabled={formLoading}
                        className="bg-mccall-navy hover:bg-mccall-navy/90 text-white"
                      >
                        {formLoading ? 'Saving...' : (editingEvent ? 'Update Event' : 'Create Event')}
                      </Button>
                      <Button
                        type="button"
                        variant="outline"
                        onClick={() => setShowModal(false)}
                        disabled={formLoading}
                      >
                        Cancel
                      </Button>
                    </div>
                  </form>
                </DialogContent>
              </Dialog>
              
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
              <div className="p-4 bg-green-50 border border-green-200 rounded-lg">
                <p className="text-green-800">{message}</p>
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
                  Manage Events ({filteredEvents.length} shown)
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
                      
                      <div className="flex gap-2">
                        <Button
                          onClick={() => openEditModal(event)}
                          variant="outline"
                          size="sm"
                          className="border-blue-300 text-blue-600 hover:bg-blue-50 hover:border-blue-400"
                        >
                          <Edit2 className="w-4 h-4" />
                        </Button>
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