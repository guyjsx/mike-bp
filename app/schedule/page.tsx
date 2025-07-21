'use client'

import { useState, useEffect } from 'react'
import { createClient } from '@/lib/supabase/client'
import { Event, Attendee } from '@/lib/types'
import DayTabs from '@/components/schedule/DayTabs'
import EventTimeline from '@/components/schedule/EventTimeline'

export default function SchedulePage() {
  const [events, setEvents] = useState<Event[]>([])
  const [attendees, setAttendees] = useState<Attendee[]>([])
  const [selectedDay, setSelectedDay] = useState('2024-05-10')
  const [loading, setLoading] = useState(true)
  const [attendeeId, setAttendeeId] = useState<string | undefined>()
  
  const supabase = createClient()

  useEffect(() => {
    fetchData()
    // Get current user from session storage or cookie
    // This is a simplified approach - in production you'd get this from auth context
    const sessionData = document.cookie
      .split('; ')
      .find(row => row.startsWith('auth-session='))
    if (sessionData) {
      try {
        const session = JSON.parse(decodeURIComponent(sessionData.split('=')[1]))
        setAttendeeId(session.attendeeId)
      } catch (e) {
        // Handle parsing error
      }
    }
  }, [])

  const fetchData = async () => {
    try {
      const [eventsResult, attendeesResult] = await Promise.all([
        supabase.from('events').select('*').order('day').order('start_time'),
        supabase.from('attendees').select('*').order('name')
      ])

      if (eventsResult.data) setEvents(eventsResult.data)
      if (attendeesResult.data) setAttendees(attendeesResult.data)
    } catch (error) {
      console.error('Error fetching data:', error)
    } finally {
      setLoading(false)
    }
  }

  const filteredEvents = events.filter(event => event.day === selectedDay)
  
  const eventCounts = events.reduce((counts, event) => {
    counts[event.day] = (counts[event.day] || 0) + 1
    return counts
  }, {} as { [key: string]: number })

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-64">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading schedule...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-gray-900">Weekend Schedule</h1>
        <p className="mt-2 text-gray-600">
          Your complete itinerary for the bachelor party weekend
        </p>
      </div>

      <div className="bg-white rounded-lg shadow">
        <div className="px-6 py-4">
          <DayTabs
            selectedDay={selectedDay}
            onDayChange={setSelectedDay}
            eventCounts={eventCounts}
          />
        </div>
        <div className="px-6 pb-6">
          <EventTimeline
            events={filteredEvents}
            attendeeId={attendeeId}
            attendees={attendees}
          />
        </div>
      </div>
    </div>
  )
}