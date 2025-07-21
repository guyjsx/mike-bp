import { GolfRound } from '@/lib/types'
import { Card, CardContent, Typography, Box, Chip } from '@mui/material'
import { LocationOn, Phone, Checkroom, AccessTime, GolfCourse } from '@mui/icons-material'

interface TeeTimeCardProps {
  round: GolfRound
}

export default function TeeTimeCard({ round }: TeeTimeCardProps) {
  const formatDate = (dateString: string) => {
    const date = new Date(dateString)
    return date.toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric' })
  }

  const formatTime = (timeString: string) => {
    const [hours, minutes] = timeString.split(':')
    const hour = parseInt(hours)
    const ampm = hour >= 12 ? 'PM' : 'AM'
    const displayHour = hour % 12 || 12
    return `${displayHour}:${minutes} ${ampm}`
  }

  return (
    <Card sx={{ height: '100%' }}>
      <CardContent sx={{ p: 3 }}>
        <Box sx={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', mb: 3 }}>
          <Box>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 1 }}>
              <GolfCourse sx={{ color: 'primary.main' }} />
              <Typography variant="h5" sx={{ fontWeight: 700, color: 'text.primary' }}>
                {round.course_name}
              </Typography>
            </Box>
            <Typography color="text.secondary">
              {formatDate(round.day)}
            </Typography>
          </Box>
          <Box sx={{ textAlign: 'right' }}>
            <Chip
              icon={<AccessTime />}
              label={formatTime(round.tee_time)}
              sx={{
                fontSize: '1.125rem',
                fontWeight: 700,
                height: 40,
                bgcolor: 'primary.main',
                color: 'primary.contrastText',
                '& .MuiChip-icon': {
                  color: 'inherit'
                }
              }}
            />
            <Typography variant="caption" color="text.secondary" sx={{ display: 'block', mt: 0.5 }}>
              Tee Time
            </Typography>
          </Box>
        </Box>

        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
          {round.course_address && (
            <Box sx={{ display: 'flex', alignItems: 'flex-start', gap: 1 }}>
              <LocationOn sx={{ fontSize: 20, color: 'text.secondary', mt: 0.25 }} />
              <Typography color="text.secondary">
                {round.course_address}
              </Typography>
            </Box>
          )}

          {round.course_phone && (
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
              <Phone sx={{ fontSize: 20, color: 'text.secondary' }} />
              <Typography
                component="a"
                href={`tel:${round.course_phone}`}
                sx={{
                  color: 'primary.main',
                  textDecoration: 'none',
                  fontWeight: 500,
                  '&:hover': {
                    textDecoration: 'underline'
                  }
                }}
              >
                {round.course_phone}
              </Typography>
            </Box>
          )}

          {round.dress_code && (
            <Box sx={{ display: 'flex', alignItems: 'flex-start', gap: 1 }}>
              <Checkroom sx={{ fontSize: 20, color: 'text.secondary', mt: 0.25 }} />
              <Typography color="text.secondary">
                {round.dress_code}
              </Typography>
            </Box>
          )}
        </Box>

        {round.notes && (
          <Box sx={{ mt: 3, pt: 3, borderTop: 1, borderColor: 'divider' }}>
            <Typography color="text.secondary">
              {round.notes}
            </Typography>
          </Box>
        )}
      </CardContent>
    </Card>
  )
}