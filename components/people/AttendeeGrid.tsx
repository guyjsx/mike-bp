import { Attendee } from '@/lib/types'
import AttendeeCard from './AttendeeCard'
import { Box, Typography, Card, CardContent } from '@mui/material'
import Grid from '@mui/material/Grid'
import { People, GolfCourse, Restaurant } from '@mui/icons-material'

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
      <Box sx={{ textAlign: 'center', py: 12 }}>
        <People sx={{ fontSize: 128, color: 'primary.light', mb: 2 }} />
        <Typography variant="h4" sx={{ fontWeight: 700, color: 'text.primary', mb: 1 }}>
          No Attendees
        </Typography>
        <Typography color="text.secondary">
          Attendee information will appear here
        </Typography>
      </Box>
    )
  }

  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
      {/* Stats */}
      <Card>
        <CardContent sx={{ p: 3 }}>
          <Typography variant="h6" sx={{ fontWeight: 600, color: 'text.primary', mb: 3 }}>
            Group Stats
          </Typography>
          <Grid container spacing={3}>
            <Grid size={{ xs: 12, sm: 4 }}>
              <Card sx={{ textAlign: 'center', p: 3, bgcolor: 'primary.50' }}>
                <People sx={{ fontSize: 32, color: 'primary.main', mb: 1 }} />
                <Typography variant="h4" sx={{ fontWeight: 700, color: 'primary.main' }}>
                  {attendees.length}
                </Typography>
                <Typography variant="body2" color="primary.main">
                  Total Attendees
                </Typography>
              </Card>
            </Grid>
            <Grid size={{ xs: 12, sm: 4 }}>
              <Card sx={{ textAlign: 'center', p: 3, bgcolor: 'success.50' }}>
                <GolfCourse sx={{ fontSize: 32, color: 'success.main', mb: 1 }} />
                <Typography variant="h4" sx={{ fontWeight: 700, color: 'success.main' }}>
                  {attendees.filter(a => a.golf_handicap !== null && a.golf_handicap !== undefined).length}
                </Typography>
                <Typography variant="body2" color="success.main">
                  Golfers
                </Typography>
              </Card>
            </Grid>
            <Grid size={{ xs: 12, sm: 4 }}>
              <Card sx={{ textAlign: 'center', p: 3, bgcolor: 'secondary.50' }}>
                <Restaurant sx={{ fontSize: 32, color: 'secondary.main', mb: 1 }} />
                <Typography variant="h4" sx={{ fontWeight: 700, color: 'secondary.main' }}>
                  {attendees.filter(a => a.dietary_restrictions && a.dietary_restrictions.toLowerCase() !== 'none').length}
                </Typography>
                <Typography variant="body2" color="secondary.main">
                  Dietary Restrictions
                </Typography>
              </Card>
            </Grid>
          </Grid>
        </CardContent>
      </Card>

      {/* Attendee cards */}
      <Grid container spacing={3}>
        {sortedAttendees.map((attendee) => (
          <Grid size={{ xs: 12, sm: 6, md: 4, lg: 3 }} key={attendee.id}>
            <AttendeeCard
              attendee={attendee}
              isCurrentUser={attendee.id === currentUserId}
            />
          </Grid>
        ))}
      </Grid>
    </Box>
  )
}