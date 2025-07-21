import { Event, Attendee } from '@/lib/types'
import { Box, Typography } from '@mui/material'
import { CalendarToday } from '@mui/icons-material'
import EventCard from './EventCard'

interface EventTimelineProps {
  events: Event[]
  attendeeId?: string
  attendees?: Attendee[]
}

export default function EventTimeline({ events, attendeeId, attendees = [] }: EventTimelineProps) {
  const sortedEvents = events.sort((a, b) => {
    const timeA = `${a.day} ${a.start_time}`
    const timeB = `${b.day} ${b.start_time}`
    return timeA.localeCompare(timeB)
  })

  if (sortedEvents.length === 0) {
    return (
      <Box sx={{ textAlign: 'center', py: 8 }}>
        <CalendarToday sx={{ fontSize: 64, color: 'text.secondary', mb: 2 }} />
        <Typography variant="h6" sx={{ fontWeight: 600, color: 'text.primary', mb: 1 }}>
          No events scheduled
        </Typography>
        <Typography color="text.secondary">
          Check back later for updates
        </Typography>
      </Box>
    )
  }

  const now = new Date()
  const currentEventIndex = sortedEvents.findIndex(event => {
    const eventEnd = new Date(`${event.day}T${event.end_time || event.start_time}`)
    return eventEnd > now
  })

  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
      {sortedEvents.map((event, index) => {
        const isAttending = attendeeId ? event.attendee_ids.includes(attendeeId) : true
        const isHighlighted = index === currentEventIndex
        
        return (
          <EventCard
            key={event.id}
            event={event}
            isAttending={isAttending}
            isHighlighted={isHighlighted}
            attendees={attendees}
          />
        )
      })}
    </Box>
  )
}