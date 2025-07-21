import { Room, Attendee } from '@/lib/types'
import RoomCard from './RoomCard'

interface RoomGridProps {
  rooms: Room[]
  attendees: Attendee[]
  currentUserId?: string
}

export default function RoomGrid({ rooms, attendees, currentUserId }: RoomGridProps) {
  const sortedRooms = rooms.sort((a, b) => a.room_number.localeCompare(b.room_number))

  if (sortedRooms.length === 0) {
    return (
      <div className="text-center py-12">
        <span className="text-8xl">🏨</span>
        <h2 className="text-2xl font-bold text-gray-900 mt-4">No Room Assignments Yet</h2>
        <p className="text-gray-600 mt-2">Room assignments will be posted soon!</p>
      </div>
    )
  }

  // Calculate some stats
  const totalCapacity = rooms.reduce((sum, room) => sum + room.capacity, 0)
  const totalAssigned = rooms.reduce((sum, room) => sum + room.attendee_ids.length, 0)
  const availableSpots = totalCapacity - totalAssigned

  return (
    <div className="space-y-6">
      {/* Room stats */}
      <div className="bg-white rounded-lg shadow p-6">
        <h2 className="text-lg font-semibold text-gray-900 mb-4">Room Overview</h2>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div className="text-center p-4 bg-blue-50 rounded-lg">
            <div className="text-2xl font-bold text-blue-600">{rooms.length}</div>
            <div className="text-sm text-blue-600">Total Rooms</div>
          </div>
          <div className="text-center p-4 bg-green-50 rounded-lg">
            <div className="text-2xl font-bold text-green-600">{totalAssigned}</div>
            <div className="text-sm text-green-600">Guests Assigned</div>
          </div>
          <div className="text-center p-4 bg-yellow-50 rounded-lg">
            <div className="text-2xl font-bold text-yellow-600">{availableSpots}</div>
            <div className="text-sm text-yellow-600">Available Spots</div>
          </div>
        </div>
      </div>

      {/* Room cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {sortedRooms.map((room) => (
          <RoomCard
            key={room.id}
            room={room}
            attendees={attendees}
            currentUserId={currentUserId}
          />
        ))}
      </div>
    </div>
  )
}