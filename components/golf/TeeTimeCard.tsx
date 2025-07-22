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
    <Card className="tee-time" sx={{ height: '100%' }}>
      <CardContent sx={{ p: { xs: 2, md: 3 } }}>
        <Box sx={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', mb: 2 }}>
          <Box sx={{ flex: 1 }}>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 0.5 }}>
              <GolfCourse sx={{ color: 'primary.main', fontSize: 20 }} />
              <Typography variant="h6" sx={{ fontWeight: 700, color: 'text.primary', fontSize: { xs: '1rem', md: '1.25rem' } }}>
                {round.course_name}
              </Typography>
            </Box>
            <Typography variant="body2" color="text.secondary" sx={{ fontSize: '0.875rem' }}>
              {formatDate(round.day)}
            </Typography>
          </Box>
          <Box sx={{ textAlign: 'right', ml: 2 }}>
            <Chip
              icon={<AccessTime sx={{ fontSize: 16 }} />}
              label={formatTime(round.tee_time)}
              size="small"
              sx={{
                fontSize: '0.875rem',
                fontWeight: 600,
                height: 32,
                bgcolor: 'primary.main',
                color: 'primary.contrastText',
                '& .MuiChip-icon': {
                  color: 'inherit'
                }
              }}
            />
            <Typography variant="caption" color="text.secondary" sx={{ display: 'block', mt: 0.25, fontSize: '0.75rem' }}>
              Tee Time
            </Typography>
          </Box>
        </Box>

        <Box sx={{ display: 'grid', gap: 1.5 }}>
          {round.course_address && (
            <Box sx={{ display: 'flex', alignItems: 'flex-start', gap: 1 }}>
              <LocationOn sx={{ fontSize: 16, color: 'text.secondary', mt: 0.25 }} />
              <Typography variant="body2" color="text.secondary" sx={{ fontSize: '0.875rem' }}>
                {round.course_address}
              </Typography>
            </Box>
          )}

          {round.course_phone && (
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
              <Phone sx={{ fontSize: 16, color: 'text.secondary' }} />
              <Typography
                component="a"
                href={`tel:${round.course_phone}`}
                variant="body2"
                sx={{
                  color: 'primary.main',
                  textDecoration: 'none',
                  fontWeight: 500,
                  fontSize: '0.875rem',
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
              <Checkroom sx={{ fontSize: 16, color: 'text.secondary', mt: 0.25 }} />
              <Typography variant="body2" color="text.secondary" sx={{ fontSize: '0.875rem' }}>
                {round.dress_code}
              </Typography>
            </Box>
          )}
        </Box>

        {round.notes && (
          <Box sx={{ mt: 2, pt: 2, borderTop: 1, borderColor: 'divider' }}>
            <Typography variant="body2" color="text.secondary" sx={{ fontSize: '0.875rem' }}>
              {round.notes}
            </Typography>
          </Box>
        )}
      </CardContent>
    </Card>
  )
}