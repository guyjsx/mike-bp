'use client'

import { useState, useEffect } from 'react'
import { createClient } from '@/lib/supabase/client'
import { Event, Attendee } from '@/lib/types'
import { Box, Typography, Card, CircularProgress } from '@mui/material'
import { Schedule } from '@mui/icons-material'
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
      <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: 400 }}>
        <Box sx={{ textAlign: 'center' }}>
          <CircularProgress size={48} sx={{ color: 'primary.main' }} />
          <Typography sx={{ mt: 2, color: 'text.secondary' }}>
            Loading schedule...
          </Typography>
        </Box>
      </Box>
    )
  }

  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
      <Box>
        <Typography variant="h3" component="h1" sx={{ fontWeight: 700, color: 'text.primary' }}>
          Weekend Schedule
        </Typography>
        <Typography sx={{ mt: 1, color: 'text.secondary' }}>
          Your complete itinerary for the bachelor party weekend
        </Typography>
      </Box>

      <Card>
        <Box sx={{ px: 3, py: 2 }}>
          <DayTabs
            selectedDay={selectedDay}
            onDayChange={setSelectedDay}
            eventCounts={eventCounts}
          />
        </Box>
        <Box sx={{ px: 3, pb: 3 }}>
          <EventTimeline
            events={filteredEvents}
            attendeeId={attendeeId}
            attendees={attendees}
          />
        </Box>
      </Card>
    </Box>
  )
}