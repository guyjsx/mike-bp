import { Attendee } from '@/lib/types'
import AttendeeCard from './AttendeeCard'

interface AttendeeGridProps {
  attendees: Attendee[]
  currentUserId?: string
}

export default function AttendeeGrid({ attendees, currentUserId }: AttendeeGridProps) {
  const sortedAttendees = attendees.sort((a, b) => {
    // Put current user first
    if (currentUserId) {
      if (a.id === currentUserId) return -1
      if (b.id === currentUserId) return 1
    }
    return a.name.localeCompare(b.name)
  })

  if (attendees.length === 0) {
    return (
      <div className="text-center py-12">
        <span className="text-8xl">👥</span>
        <h2 className="text-2xl font-bold text-gray-900 mt-4">No Attendees</h2>
        <p className="text-gray-600 mt-2">Attendee information will appear here</p>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Stats */}
      <div className="bg-white rounded-lg shadow p-6">
        <h2 className="text-lg font-semibold text-gray-900 mb-4">Group Stats</h2>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div className="text-center p-4 bg-blue-50 rounded-lg">
            <div className="text-2xl font-bold text-blue-600">{attendees.length}</div>
            <div className="text-sm text-blue-600">Total Attendees</div>
          </div>
          <div className="text-center p-4 bg-green-50 rounded-lg">
            <div className="text-2xl font-bold text-green-600">
              {attendees.filter(a => a.golf_handicap !== null && a.golf_handicap !== undefined).length}
            </div>
            <div className="text-sm text-green-600">Golfers</div>
          </div>
          <div className="text-center p-4 bg-purple-50 rounded-lg">
            <div className="text-2xl font-bold text-purple-600">
              {attendees.filter(a => a.dietary_restrictions && a.dietary_restrictions.toLowerCase() !== 'none').length}
            </div>
            <div className="text-sm text-purple-600">Dietary Restrictions</div>
          </div>
        </div>
      </div>

      {/* Attendee cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {sortedAttendees.map((attendee) => (
          <AttendeeCard
            key={attendee.id}
            attendee={attendee}
            isCurrentUser={attendee.id === currentUserId}
          />
        ))}
      </div>
    </div>
  )
}