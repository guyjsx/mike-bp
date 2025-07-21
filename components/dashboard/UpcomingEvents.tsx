import Link from 'next/link'
import { Event } from '@/lib/types'

interface UpcomingEventsProps {
  events: Event[]
  attendeeId?: string
}

export default function UpcomingEvents({ events, attendeeId }: UpcomingEventsProps) {
  // Get next 3 events
  const upcomingEvents = events
    .filter(event => {
      const eventDateTime = new Date(`${event.day}T${event.start_time}`)
      return eventDateTime > new Date()
    })
    .sort((a, b) => {
      const dateA = new Date(`${a.day}T${a.start_time}`)
      const dateB = new Date(`${b.day}T${b.start_time}`)
      return dateA.getTime() - dateB.getTime()
    })
    .slice(0, 3)

  if (upcomingEvents.length === 0) {
    return (
      <div className="bg-white rounded-lg shadow p-6">
        <h3 className="text-lg font-semibold mb-4">Upcoming Events</h3>
        <p className="text-gray-500">No upcoming events</p>
      </div>
    )
  }

  const formatEventTime = (event: Event) => {
    const date = new Date(`${event.day}T${event.start_time}`)
    const day = date.toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric' })
    const time = date.toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit' })
    return `${day} at ${time}`
  }

  return (
    <div className="bg-white rounded-lg shadow">
      <div className="p-6">
        <h3 className="text-lg font-semibold mb-4">Upcoming Events</h3>
        <div className="space-y-4">
          {upcomingEvents.map((event) => {
            const isAttending = attendeeId ? event.attendee_ids.includes(attendeeId) : true
            return (
              <div key={event.id} className="flex items-start space-x-3">
                <div className="flex-shrink-0">
                  <div className="w-10 h-10 bg-primary-100 rounded-full flex items-center justify-center">
                    <span className="text-lg">📅</span>
                  </div>
                </div>
                <div className="flex-1">
                  <h4 className="font-medium text-gray-900">{event.title}</h4>
                  <p className="text-sm text-gray-500">{formatEventTime(event)}</p>
                  {event.location && (
                    <p className="text-sm text-gray-500">📍 {event.location}</p>
                  )}
                  {!isAttending && attendeeId && (
                    <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-gray-100 text-gray-600 mt-1">
                      Not attending
                    </span>
                  )}
                </div>
              </div>
            )
          })}
        </div>
        <Link
          href="/schedule"
          className="mt-4 block text-center text-sm text-primary-600 hover:text-primary-700 font-medium"
        >
          View full schedule →
        </Link>
      </div>
    </div>
  )
}