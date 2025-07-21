import { Room, Attendee } from '@/lib/types'
import { Card, CardContent, Typography, Box, Chip, Avatar, Alert } from '@mui/material'
import { Hotel, Person, HelpOutline } from '@mui/icons-material'

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
    <Card
      sx={{
        height: '100%',
        ...(isUserInRoom && {
          border: 2,
          borderColor: 'primary.main',
          bgcolor: 'primary.50'
        })
      }}
    >
      <CardContent sx={{ p: 3 }}>
        <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 3 }}>
          <Box>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 1 }}>
              <Hotel sx={{ color: 'primary.main' }} />
              <Typography variant="h6" sx={{ fontWeight: 700 }}>
                Room {room.room_number}
              </Typography>
            </Box>
            {room.check_in_name && (
              <Typography variant="body2" color="text.secondary">
                Check-in: {room.check_in_name}
              </Typography>
            )}
          </Box>
          <Box sx={{ textAlign: 'right' }}>
            <Chip
              icon={<Person />}
              label={`${roommates.length}/${room.capacity}`}
              sx={{
                fontSize: '1rem',
                fontWeight: 600,
                height: 32
              }}
            />
            {isUserInRoom && (
              <Chip
                label="Your Room"
                size="small"
                sx={{
                  mt: 0.5,
                  display: 'block',
                  bgcolor: 'primary.main',
                  color: 'primary.contrastText'
                }}
              />
            )}
          </Box>
        </Box>

        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1.5 }}>
          {roommates.length > 0 ? (
            roommates.map((attendee) => (
              <Card
                key={attendee.id}
                variant="outlined"
                sx={{
                  p: 2,
                  ...(attendee.id === currentUserId && {
                    bgcolor: 'primary.50',
                    borderColor: 'primary.main'
                  })
                }}
              >
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                  <Avatar
                    sx={{
                      bgcolor: 'primary.light',
                      color: 'primary.contrastText',
                      width: 40,
                      height: 40
                    }}
                  >
                    {attendee.name.split(' ').map(n => n[0]).join('')}
                  </Avatar>
                  <Box sx={{ flexGrow: 1 }}>
                    <Typography variant="subtitle2" sx={{ fontWeight: 600 }}>
                      {attendee.name}
                    </Typography>
                    {attendee.phone && (
                      <Typography variant="body2" color="text.secondary">
                        {attendee.phone}
                      </Typography>
                    )}
                  </Box>
                  {attendee.id === currentUserId && (
                    <Chip
                      label="You"
                      size="small"
                      color="primary"
                    />
                  )}
                </Box>
              </Card>
            ))
          ) : (
            <Box sx={{ textAlign: 'center', py: 4 }}>
              <Hotel sx={{ fontSize: 64, color: 'text.secondary', mb: 1 }} />
              <Typography color="text.secondary">
                No one assigned yet
              </Typography>
            </Box>
          )}

          {/* Show empty slots */}
          {Array.from({ length: room.capacity - roommates.length }).map((_, index) => (
            <Card
              key={`empty-${index}`}
              variant="outlined"
              sx={{
                p: 2,
                borderStyle: 'dashed',
                borderColor: 'grey.300',
                bgcolor: 'grey.50'
              }}
            >
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                <Avatar sx={{ bgcolor: 'grey.300', color: 'grey.600' }}>
                  <HelpOutline />
                </Avatar>
                <Typography color="text.secondary" sx={{ fontWeight: 500 }}>
                  Available
                </Typography>
              </Box>
            </Card>
          ))}
        </Box>

        {room.notes && (
          <Box sx={{ mt: 3, pt: 3, borderTop: 1, borderColor: 'divider' }}>
            <Typography variant="body2" color="text.secondary">
              {room.notes}
            </Typography>
          </Box>
        )}

        {hasAvailableSpace && (
          <Alert
            severity="info"
            sx={{ mt: 2 }}
          >
            This room has space for {room.capacity - roommates.length} more guest{room.capacity - roommates.length !== 1 ? 's' : ''}
          </Alert>
        )}
      </CardContent>
    </Card>
  )
}