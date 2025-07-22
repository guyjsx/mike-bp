import { Room, Attendee } from '@/lib/types'
import RoomCard from './RoomCard'
import { Box, Typography, Card, CardContent } from '@mui/material'
import Grid from '@mui/material/Grid'
import { Hotel, PersonAdd, EventAvailable } from '@mui/icons-material'

interface RoomGridProps {
  rooms: Room[]
  attendees: Attendee[]
  currentUserId?: string
}

export default function RoomGrid({ rooms, attendees, currentUserId }: RoomGridProps) {
  const sortedRooms = rooms.sort((a, b) => a.room_number.localeCompare(b.room_number))

  if (sortedRooms.length === 0) {
    return (
      <Box sx={{ textAlign: 'center', py: 12 }}>
        <Hotel sx={{ fontSize: 128, color: 'primary.light', mb: 2 }} />
        <Typography variant="h4" sx={{ fontWeight: 700, color: 'text.primary', mb: 1 }}>
          No Room Assignments Yet
        </Typography>
        <Typography color="text.secondary">
          Room assignments will be posted soon!
        </Typography>
      </Box>
    )
  }

  // Calculate some stats
  const totalCapacity = rooms.reduce((sum, room) => sum + room.capacity, 0)
  const totalAssigned = rooms.reduce((sum, room) => sum + room.attendee_ids.length, 0)
  const availableSpots = totalCapacity - totalAssigned

  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
      {/* Room stats */}
      <Card>
        <CardContent sx={{ p: 3 }}>
          <Typography variant="h6" sx={{ fontWeight: 600, color: 'text.primary', mb: 3 }}>
            Room Overview
          </Typography>
          <Box sx={{ 
            display: 'grid', 
            gridTemplateColumns: { xs: '1fr', sm: '1fr 1fr 1fr' }, 
            gap: 3 
          }}>
            <Card sx={{ textAlign: 'center', p: 3, bgcolor: 'primary.50' }}>
              <Hotel sx={{ fontSize: 32, color: 'primary.main', mb: 1 }} />
              <Typography variant="h4" sx={{ fontWeight: 700, color: 'primary.main' }}>
                {rooms.length}
              </Typography>
              <Typography variant="body2" color="primary.main">
                Total Rooms
              </Typography>
            </Card>
            <Card sx={{ textAlign: 'center', p: 3, bgcolor: 'success.50' }}>
              <PersonAdd sx={{ fontSize: 32, color: 'success.main', mb: 1 }} />
              <Typography variant="h4" sx={{ fontWeight: 700, color: 'success.main' }}>
                {totalAssigned}
              </Typography>
              <Typography variant="body2" color="success.main">
                Guests Assigned
              </Typography>
            </Card>
            <Card sx={{ textAlign: 'center', p: 3, bgcolor: 'warning.50' }}>
              <EventAvailable sx={{ fontSize: 32, color: 'warning.main', mb: 1 }} />
              <Typography variant="h4" sx={{ fontWeight: 700, color: 'warning.main' }}>
                {availableSpots}
              </Typography>
              <Typography variant="body2" color="warning.main">
                Available Spots
              </Typography>
            </Card>
          </Box>
        </CardContent>
      </Card>

      {/* Room cards */}
      <Grid container spacing={3}>
        {sortedRooms.map((room) => (
          <Grid size={{ xs: 12, md: 6, lg: 4 }} key={room.id}>
            <RoomCard
              room={room}
              attendees={attendees}
              currentUserId={currentUserId}
            />
          </Grid>
        ))}
      </Grid>
    </Box>
  )
}