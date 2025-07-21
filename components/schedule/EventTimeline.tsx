import { Event, Attendee } from '@/lib/types'
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
      <div className="text-center py-8">
        <span className="text-6xl">📅</span>
        <h3 className="text-lg font-medium text-gray-900 mt-4">No events scheduled</h3>
        <p className="text-gray-500 mt-2">Check back later for updates</p>
      </div>
    )
  }

  const now = new Date()
  const currentEventIndex = sortedEvents.findIndex(event => {
    const eventEnd = new Date(`${event.day}T${event.end_time || event.start_time}`)
    return eventEnd > now
  })

  return (
    <div className="space-y-4">
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
    </div>
  )
}