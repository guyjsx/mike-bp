import Link from 'next/link'
import { Event } from '@/lib/types'
import { Card, CardContent, Typography, Box, Chip, Button } from '@mui/material'
import { Schedule, LocationOn, ArrowForward } from '@mui/icons-material'

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

  const formatEventTime = (event: Event) => {
    const date = new Date(`${event.day}T${event.start_time}`)
    const day = date.toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric' })
    const time = date.toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit' })
    return `${day} at ${time}`
  }

  return (
    <Card>
      <CardContent sx={{ p: 3 }}>
        <Typography variant="h6" sx={{ fontWeight: 600, mb: 3 }}>
          Upcoming Events
        </Typography>
        
        {upcomingEvents.length === 0 ? (
          <Box sx={{ textAlign: 'center', py: 4 }}>
            <Schedule sx={{ fontSize: 48, color: 'text.secondary', mb: 2 }} />
            <Typography color="text.secondary">
              No upcoming events
            </Typography>
          </Box>
        ) : (
          <>
            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
              {upcomingEvents.map((event) => {
                const isAttending = attendeeId ? event.attendee_ids.includes(attendeeId) : true
                return (
                  <Box key={event.id} sx={{ display: 'flex', alignItems: 'flex-start', gap: 2 }}>
                    <Box
                      sx={{
                        width: 40,
                        height: 40,
                        backgroundColor: 'primary.light',
                        borderRadius: '50%',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        flexShrink: 0
                      }}
                    >
                      <Schedule sx={{ color: 'primary.main', fontSize: 20 }} />
                    </Box>
                    <Box sx={{ flexGrow: 1 }}>
                      <Typography variant="subtitle2" sx={{ fontWeight: 600 }}>
                        {event.title}
                      </Typography>
                      <Typography variant="body2" color="text.secondary">
                        {formatEventTime(event)}
                      </Typography>
                      {event.location && (
                        <Box sx={{ display: 'flex', alignItems: 'center', mt: 0.5 }}>
                          <LocationOn sx={{ fontSize: 14, mr: 0.5, color: 'text.secondary' }} />
                          <Typography variant="caption" color="text.secondary">
                            {event.location}
                          </Typography>
                        </Box>
                      )}
                      {!isAttending && attendeeId && (
                        <Chip 
                          label="Not attending" 
                          size="small" 
                          variant="outlined"
                          sx={{ mt: 1 }}
                        />
                      )}
                    </Box>
                  </Box>
                )
              })}
            </Box>
            
            <Button
              component={Link}
              href="/schedule"
              endIcon={<ArrowForward />}
              sx={{ mt: 3, width: '100%' }}
              variant="text"
            >
              View full schedule
            </Button>
          </>
        )}
      </CardContent>
    </Card>
  )
}