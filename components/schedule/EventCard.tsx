import Link from 'next/link'
import { Event, Attendee } from '@/lib/types'

interface EventCardProps {
  event: Event
  isAttending: boolean
  isHighlighted?: boolean
  attendees?: Attendee[]
}

export default function EventCard({ event, isAttending, isHighlighted = false, attendees = [] }: EventCardProps) {
  const formatTime = (timeString: string) => {
    const [hours, minutes] = timeString.split(':')
    const hour = parseInt(hours)
    const ampm = hour >= 12 ? 'PM' : 'AM'
    const displayHour = hour % 12 || 12
    return `${displayHour}:${minutes} ${ampm}`
  }

  const getTimeRange = () => {
    const startTime = formatTime(event.start_time)
    if (event.end_time) {
      const endTime = formatTime(event.end_time)
      return `${startTime} - ${endTime}`
    }
    return startTime
  }

  const eventAttendees = attendees.filter(a => event.attendee_ids.includes(a.id))

  return (
    <div className={`
      bg-white rounded-lg shadow-sm border p-4 hover:shadow-md transition-shadow
      ${isHighlighted ? 'ring-2 ring-primary-500 bg-primary-50' : ''}
      ${!isAttending ? 'opacity-60' : ''}
    `}>
      <div className="flex justify-between items-start mb-2">
        <div className="flex-1">
          <h3 className="font-semibold text-gray-900">{event.title}</h3>
          <p className="text-sm text-gray-600">{getTimeRange()}</p>
        </div>
        {!isAttending && (
          <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-gray-100 text-gray-600">
            Not attending
          </span>
        )}
      </div>

      {event.location && (
        <div className="flex items-center mb-2">
          <span className="text-lg mr-2">📍</span>
          <span className="text-sm text-gray-700">{event.location}</span>
          {event.map_link && (
            <Link
              href={event.map_link}
              target="_blank"
              rel="noopener noreferrer"
              className="ml-2 text-primary-600 hover:text-primary-700"
            >
              <span className="text-lg">🗺️</span>
            </Link>
          )}
        </div>
      )}

      {event.dress_code && (
        <div className="flex items-center mb-2">
          <span className="text-lg mr-2">👔</span>
          <span className="text-sm text-gray-600">{event.dress_code}</span>
        </div>
      )}

      {event.cost_per_person && (
        <div className="flex items-center mb-2">
          <span className="text-lg mr-2">💰</span>
          <span className="text-sm text-gray-600">${event.cost_per_person} per person</span>
        </div>
      )}

      {eventAttendees.length > 0 && (
        <div className="flex items-center">
          <span className="text-lg mr-2">👥</span>
          <span className="text-sm text-gray-600">
            {eventAttendees.length} attending
          </span>
          <div className="ml-2 flex -space-x-1 overflow-hidden">
            {eventAttendees.slice(0, 3).map((attendee) => (
              <div
                key={attendee.id}
                className="inline-block h-6 w-6 rounded-full bg-gray-300 text-xs flex items-center justify-center text-gray-700 font-medium border-2 border-white"
                title={attendee.name}
              >
                {attendee.name.split(' ').map(n => n[0]).join('').slice(0, 2)}
              </div>
            ))}
            {eventAttendees.length > 3 && (
              <div className="inline-block h-6 w-6 rounded-full bg-gray-200 text-xs flex items-center justify-center text-gray-600 font-medium border-2 border-white">
                +{eventAttendees.length - 3}
              </div>
            )}
          </div>
        </div>
      )}

      {event.notes && (
        <div className="mt-3 pt-3 border-t border-gray-100">
          <p className="text-sm text-gray-600">{event.notes}</p>
        </div>
      )}
    </div>
  )
}