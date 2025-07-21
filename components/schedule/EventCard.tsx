import Link from 'next/link'
import { Event, Attendee } from '@/lib/types'
import { Card, CardContent, Typography, Box, Chip, IconButton, Avatar, AvatarGroup } from '@mui/material'
import { LocationOn, Map, Checkroom, AttachMoney, People, AccessTime } from '@mui/icons-material'

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
    <Card
      sx={{
        transition: 'all 0.2s ease-in-out',
        '&:hover': {
          boxShadow: 3
        },
        ...(isHighlighted && {
          border: 2,
          borderColor: 'primary.main',
          bgcolor: 'primary.50'
        }),
        ...((!isAttending) && {
          opacity: 0.6
        })
      }}
    >
      <CardContent sx={{ p: 3 }}>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 2 }}>
          <Box sx={{ flexGrow: 1 }}>
            <Typography variant="h6" sx={{ fontWeight: 600, color: 'text.primary', mb: 0.5 }}>
              {event.title}
            </Typography>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
              <AccessTime sx={{ fontSize: 16, color: 'text.secondary' }} />
              <Typography variant="body2" color="text.secondary">
                {getTimeRange()}
              </Typography>
            </Box>
          </Box>
          {!isAttending && (
            <Chip
              label="Not attending"
              size="small"
              variant="outlined"
              sx={{ color: 'text.secondary' }}
            />
          )}
        </Box>

        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1.5 }}>
          {event.location && (
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
              <LocationOn sx={{ fontSize: 16, color: 'text.secondary' }} />
              <Typography variant="body2" color="text.secondary">
                {event.location}
              </Typography>
              {event.map_link && (
                <IconButton
                  component={Link}
                  href={event.map_link}
                  target="_blank"
                  rel="noopener noreferrer"
                  size="small"
                  sx={{ color: 'primary.main' }}
                >
                  <Map sx={{ fontSize: 16 }} />
                </IconButton>
              )}
            </Box>
          )}

          {event.dress_code && (
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
              <Checkroom sx={{ fontSize: 16, color: 'text.secondary' }} />
              <Typography variant="body2" color="text.secondary">
                {event.dress_code}
              </Typography>
            </Box>
          )}

          {event.cost_per_person && (
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
              <AttachMoney sx={{ fontSize: 16, color: 'text.secondary' }} />
              <Typography variant="body2" color="text.secondary">
                ${event.cost_per_person} per person
              </Typography>
            </Box>
          )}

          {eventAttendees.length > 0 && (
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
              <People sx={{ fontSize: 16, color: 'text.secondary' }} />
              <Typography variant="body2" color="text.secondary">
                {eventAttendees.length} attending
              </Typography>
              <AvatarGroup
                max={4}
                sx={{
                  '& .MuiAvatar-root': {
                    width: 24,
                    height: 24,
                    fontSize: '0.75rem',
                    bgcolor: 'primary.light',
                    color: 'primary.contrastText'
                  }
                }}
              >
                {eventAttendees.map((attendee) => (
                  <Avatar
                    key={attendee.id}
                    title={attendee.name}
                  >
                    {attendee.name.split(' ').map(n => n[0]).join('').slice(0, 2)}
                  </Avatar>
                ))}
              </AvatarGroup>
            </Box>
          )}
        </Box>

        {event.notes && (
          <Box sx={{ mt: 2, pt: 2, borderTop: 1, borderColor: 'divider' }}>
            <Typography variant="body2" color="text.secondary">
              {event.notes}
            </Typography>
          </Box>
        )}
      </CardContent>
    </Card>
  )
}