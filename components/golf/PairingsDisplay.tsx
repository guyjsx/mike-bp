import { GolfPairing, Attendee } from '@/lib/types'

interface PairingsDisplayProps {
  pairings: GolfPairing[]
  attendees: Attendee[]
  currentUserId?: string
}

export default function PairingsDisplay({ pairings, attendees, currentUserId }: PairingsDisplayProps) {
  const sortedPairings = pairings.sort((a, b) => a.group_number - b.group_number)

  if (sortedPairings.length === 0) {
    return (
      <div className="text-center py-8">
        <span className="text-6xl">⛳</span>
        <h3 className="text-lg font-medium text-gray-900 mt-4">No pairings yet</h3>
        <p className="text-gray-500 mt-2">Pairings will be announced closer to tee time</p>
      </div>
    )
  }

  const getAttendeeDetails = (attendeeId: string) => {
    return attendees.find(a => a.id === attendeeId)
  }

  return (
    <div className="space-y-6">
      {sortedPairings.map((pairing) => {
        const groupAttendees = pairing.attendee_ids.map(id => getAttendeeDetails(id)).filter(Boolean) as Attendee[]
        const isUserInGroup = currentUserId && pairing.attendee_ids.includes(currentUserId)

        return (
          <div
            key={pairing.id}
            className={`bg-white rounded-lg shadow border p-6 ${
              isUserInGroup ? 'ring-2 ring-primary-500 bg-primary-50' : ''
            }`}
          >
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold text-gray-900">
                Group {pairing.group_number}
              </h3>
              {isUserInGroup && (
                <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-primary-100 text-primary-800">
                  Your Group
                </span>
              )}
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              {groupAttendees.map((attendee) => (
                <div
                  key={attendee.id}
                  className={`p-4 rounded-lg border ${
                    attendee.id === currentUserId
                      ? 'bg-primary-100 border-primary-200'
                      : 'bg-gray-50 border-gray-200'
                  }`}
                >
                  <div className="flex items-center justify-center w-12 h-12 mx-auto mb-2 bg-gray-300 rounded-full">
                    <span className="text-lg font-medium text-gray-700">
                      {attendee.name.split(' ').map(n => n[0]).join('')}
                    </span>
                  </div>
                  <h4 className="text-center font-medium text-gray-900">
                    {attendee.name}
                  </h4>
                  {attendee.golf_handicap !== null && attendee.golf_handicap !== undefined && (
                    <p className="text-center text-sm text-gray-600 mt-1">
                      Handicap: {attendee.golf_handicap}
                    </p>
                  )}
                  {attendee.phone && (
                    <p className="text-center text-xs text-gray-500 mt-1">
                      {attendee.phone}
                    </p>
                  )}
                </div>
              ))}
            </div>

            {groupAttendees.length < 4 && (
              <div className="mt-4 p-3 bg-yellow-50 border border-yellow-200 rounded-lg">
                <p className="text-sm text-yellow-800">
                  ⚠️ This group has {groupAttendees.length} player{groupAttendees.length !== 1 ? 's' : ''}. 
                  Pairings may be adjusted before tee time.
                </p>
              </div>
            )}
          </div>
        )
      })}
    </div>
  )
}