import { Room, Attendee } from '@/lib/types'

interface RoomCardProps {
  room: Room
  attendees: Attendee[]
  currentUserId?: string
}

export default function RoomCard({ room, attendees, currentUserId }: RoomCardProps) {
  const roommates = attendees.filter(a => room.attendee_ids.includes(a.id))
  const isUserInRoom = currentUserId && room.attendee_ids.includes(currentUserId)
  const hasAvailableSpace = roommates.length < room.capacity

  return (
    <div className={`
      bg-white rounded-lg shadow border p-6 
      ${isUserInRoom ? 'ring-2 ring-primary-500 bg-primary-50' : ''}
    `}>
      <div className="flex items-center justify-between mb-4">
        <div>
          <h3 className="text-xl font-bold text-gray-900">
            Room {room.room_number}
          </h3>
          {room.check_in_name && (
            <p className="text-sm text-gray-600">
              Check-in: {room.check_in_name}
            </p>
          )}
        </div>
        <div className="text-right">
          <div className="flex items-center space-x-1">
            <span className="text-2xl">🛏️</span>
            <span className="text-lg font-medium">
              {roommates.length}/{room.capacity}
            </span>
          </div>
          {isUserInRoom && (
            <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-primary-100 text-primary-800 mt-1">
              Your Room
            </span>
          )}
        </div>
      </div>

      <div className="space-y-3">
        {roommates.length > 0 ? (
          roommates.map((attendee) => (
            <div
              key={attendee.id}
              className={`flex items-center space-x-3 p-3 rounded-lg ${
                attendee.id === currentUserId
                  ? 'bg-primary-100 border border-primary-200'
                  : 'bg-gray-50'
              }`}
            >
              <div className="flex items-center justify-center w-10 h-10 bg-gray-300 rounded-full">
                <span className="text-sm font-medium text-gray-700">
                  {attendee.name.split(' ').map(n => n[0]).join('')}
                </span>
              </div>
              <div className="flex-1">
                <h4 className="font-medium text-gray-900">{attendee.name}</h4>
                {attendee.phone && (
                  <p className="text-sm text-gray-600">{attendee.phone}</p>
                )}
              </div>
              {attendee.id === currentUserId && (
                <span className="text-primary-600">You</span>
              )}
            </div>
          ))
        ) : (
          <div className="text-center py-4 text-gray-500">
            <span className="text-4xl">🏨</span>
            <p className="mt-2">No one assigned yet</p>
          </div>
        )}

        {/* Show empty slots */}
        {Array.from({ length: room.capacity - roommates.length }).map((_, index) => (
          <div key={`empty-${index}`} className="flex items-center space-x-3 p-3 rounded-lg bg-gray-50 border-2 border-dashed border-gray-200">
            <div className="flex items-center justify-center w-10 h-10 bg-gray-200 rounded-full">
              <span className="text-gray-400">?</span>
            </div>
            <div className="flex-1 text-gray-400">
              <p className="font-medium">Available</p>
            </div>
          </div>
        ))}
      </div>

      {room.notes && (
        <div className="mt-4 pt-4 border-t border-gray-100">
          <p className="text-sm text-gray-600">{room.notes}</p>
        </div>
      )}

      {hasAvailableSpace && (
        <div className="mt-4 p-3 bg-blue-50 border border-blue-200 rounded-lg">
          <p className="text-sm text-blue-800">
            💡 This room has space for {room.capacity - roommates.length} more guest{room.capacity - roommates.length !== 1 ? 's' : ''}
          </p>
        </div>
      )}
    </div>
  )
}