import { Attendee } from '@/lib/types'
import { Card, CardContent, Typography, Box, Avatar, Chip, IconButton, Divider } from '@mui/material'
import { Phone, GolfCourse, AttachMoney, Restaurant, Emergency, FlightTakeoff, FlightLand, ContentCopy } from '@mui/icons-material'

interface AttendeeCardProps {
  attendee: Attendee
  isCurrentUser?: boolean
}

export default function AttendeeCard({ attendee, isCurrentUser = false }: AttendeeCardProps) {
  return (
    <Card
      sx={{
        height: '100%',
        ...(isCurrentUser && {
          border: 2,
          borderColor: 'primary.main',
          bgcolor: 'primary.50'
        })
      }}
    >
      <CardContent sx={{ p: 3, textAlign: 'center' }}>
        <Avatar
          sx={{
            width: 80,
            height: 80,
            mx: 'auto',
            mb: 2,
            bgcolor: 'primary.light',
            color: 'primary.contrastText',
            fontSize: '2rem',
            fontWeight: 600
          }}
        >
          {attendee.name.split(' ').map(n => n[0]).join('')}
        </Avatar>
        
        <Box sx={{ mb: 3 }}>
          <Typography variant="h6" sx={{ fontWeight: 600, mb: 0.5 }}>
            {attendee.name}
          </Typography>
          {isCurrentUser && (
            <Chip
              label="You"
              size="small"
              color="primary"
              sx={{ fontWeight: 600 }}
            />
          )}
        </Box>
        
        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1.5, alignItems: 'center' }}>
          {attendee.phone && (
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
              <Phone sx={{ fontSize: 18, color: 'text.secondary' }} />
              <Typography
                component="a"
                href={`tel:${attendee.phone}`}
                variant="body2"
                sx={{
                  color: 'primary.main',
                  textDecoration: 'none',
                  '&:hover': { textDecoration: 'underline' }
                }}
              >
                {attendee.phone}
              </Typography>
            </Box>
          )}
          
          {attendee.golf_handicap !== null && attendee.golf_handicap !== undefined && (
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
              <GolfCourse sx={{ fontSize: 18, color: 'text.secondary' }} />
              <Typography variant="body2" color="text.secondary">
                Handicap: {attendee.golf_handicap}
              </Typography>
            </Box>
          )}
          
          {attendee.venmo_handle && (
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
              <AttachMoney sx={{ fontSize: 18, color: 'text.secondary' }} />
              <Typography variant="body2" color="primary.main">
                {attendee.venmo_handle}
              </Typography>
              <IconButton
                size="small"
                onClick={() => navigator.clipboard.writeText(attendee.venmo_handle!)}
                title="Click to copy Venmo handle"
                sx={{ p: 0.5 }}
              >
                <ContentCopy sx={{ fontSize: 14 }} />
              </IconButton>
            </Box>
          )}
          
          {attendee.dietary_restrictions && (
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
              <Restaurant sx={{ fontSize: 18, color: 'text.secondary' }} />
              <Typography variant="body2" color="text.secondary">
                {attendee.dietary_restrictions}
              </Typography>
            </Box>
          )}
          
          {attendee.emergency_contact && (
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
              <Emergency sx={{ fontSize: 18, color: 'text.secondary' }} />
              <Typography variant="body2" color="text.secondary">
                {attendee.emergency_contact}
              </Typography>
            </Box>
          )}
        </Box>
        
        {(attendee.arrival_time || attendee.departure_time) && (
          <Box sx={{ mt: 3, pt: 3 }}>
            <Divider sx={{ mb: 2 }} />
            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
              {attendee.arrival_time && (
                <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 1 }}>
                  <FlightTakeoff sx={{ fontSize: 16, color: 'text.secondary' }} />
                  <Typography variant="caption" color="text.secondary">
                    <strong>Arriving:</strong> {new Date(attendee.arrival_time).toLocaleString('en-US', {
                      weekday: 'short',
                      month: 'short', 
                      day: 'numeric',
                      hour: 'numeric',
                      minute: '2-digit'
                    })}
                  </Typography>
                </Box>
              )}
              {attendee.departure_time && (
                <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 1 }}>
                  <FlightLand sx={{ fontSize: 16, color: 'text.secondary' }} />
                  <Typography variant="caption" color="text.secondary">
                    <strong>Departing:</strong> {new Date(attendee.departure_time).toLocaleString('en-US', {
                      weekday: 'short',
                      month: 'short',
                      day: 'numeric', 
                      hour: 'numeric',
                      minute: '2-digit'
                    })}
                  </Typography>
                </Box>
              )}
            </Box>
          </Box>
        )}
      </CardContent>
    </Card>
  )
}