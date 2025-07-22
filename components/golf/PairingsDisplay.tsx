import { GolfPairing, Attendee } from '@/lib/types'
import { Card, CardContent, Typography, Box, Chip, Avatar, Alert } from '@mui/material'
import Grid from '@mui/material/Grid'
import { GolfCourse, Phone, Warning } from '@mui/icons-material'

interface PairingsDisplayProps {
  pairings: GolfPairing[]
  attendees: Attendee[]
  currentUserId?: string
}

export default function PairingsDisplay({ pairings, attendees, currentUserId }: PairingsDisplayProps) {
  const sortedPairings = pairings.sort((a, b) => a.group_number - b.group_number)

  if (sortedPairings.length === 0) {
    return (
      <Box sx={{ textAlign: 'center', py: 8 }}>
        <GolfCourse sx={{ fontSize: 80, color: 'primary.light', mb: 2 }} />
        <Typography variant="h6" sx={{ fontWeight: 600, color: 'text.primary', mb: 1 }}>
          No pairings yet
        </Typography>
        <Typography color="text.secondary">
          Pairings will be announced closer to tee time
        </Typography>
      </Box>
    )
  }

  const getAttendeeDetails = (attendeeId: string) => {
    return attendees.find(a => a.id === attendeeId)
  }

  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
      {sortedPairings.map((pairing) => {
        const groupAttendees = pairing.attendee_ids.map(id => getAttendeeDetails(id)).filter(Boolean) as Attendee[]
        const isUserInGroup = currentUserId && pairing.attendee_ids.includes(currentUserId)

        return (
          <Card
            key={pairing.id}
            sx={{
              ...(isUserInGroup && {
                border: 2,
                borderColor: 'primary.main',
                bgcolor: 'primary.50'
              })
            }}
          >
            <CardContent sx={{ p: 3 }}>
              <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 3 }}>
                <Typography variant="h6" sx={{ fontWeight: 600, color: 'text.primary' }}>
                  Group {pairing.group_number}
                </Typography>
                {isUserInGroup && (
                  <Chip
                    label="Your Group"
                    size="small"
                    sx={{
                      bgcolor: 'primary.main',
                      color: 'primary.contrastText',
                      fontWeight: 600
                    }}
                  />
                )}
              </Box>

              <Grid container spacing={2}>
                {groupAttendees.map((attendee) => (
                  <Grid size={{ xs: 12, sm: 6, lg: 3 }} key={attendee.id}>
                    <Card
                      variant="outlined"
                      sx={{
                        p: 2,
                        textAlign: 'center',
                        ...(attendee.id === currentUserId && {
                          bgcolor: 'primary.50',
                          borderColor: 'primary.main'
                        })
                      }}
                    >
                      <Avatar
                        sx={{
                          width: 48,
                          height: 48,
                          mx: 'auto',
                          mb: 1,
                          bgcolor: 'primary.light',
                          color: 'primary.contrastText',
                          fontSize: '1.125rem',
                          fontWeight: 600
                        }}
                      >
                        {attendee.name.split(' ').map(n => n[0]).join('')}
                      </Avatar>
                      <Typography variant="subtitle2" sx={{ fontWeight: 600, mb: 0.5 }}>
                        {attendee.name}
                      </Typography>
                      {attendee.golf_handicap !== null && attendee.golf_handicap !== undefined && (
                        <Typography variant="body2" color="text.secondary" sx={{ mb: 0.5 }}>
                          Handicap: {attendee.golf_handicap}
                        </Typography>
                      )}
                      {attendee.phone && (
                        <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 0.5 }}>
                          <Phone sx={{ fontSize: 14, color: 'text.secondary' }} />
                          <Typography variant="caption" color="text.secondary">
                            {attendee.phone}
                          </Typography>
                        </Box>
                      )}
                    </Card>
                  </Grid>
                ))}
              </Grid>

              {groupAttendees.length < 4 && (
                <Alert
                  severity="warning"
                  icon={<Warning />}
                  sx={{ mt: 2 }}
                >
                  This group has {groupAttendees.length} player{groupAttendees.length !== 1 ? 's' : ''}. 
                  Pairings may be adjusted before tee time.
                </Alert>
              )}
            </CardContent>
          </Card>
        )
      })}
    </Box>
  )
}