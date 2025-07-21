import { Attendee } from '@/lib/types'
import { Card, CardContent, Typography, Box, Chip, Avatar, Divider } from '@mui/material'
import { TrendingUp, TrendingDown, Remove } from '@mui/icons-material'

interface HandicapListProps {
  attendees: Attendee[]
}

export default function HandicapList({ attendees }: HandicapListProps) {
  const golfers = attendees
    .filter(a => a.golf_handicap !== null && a.golf_handicap !== undefined)
    .sort((a, b) => (a.golf_handicap || 0) - (b.golf_handicap || 0))

  if (golfers.length === 0) {
    return null
  }

  const getSkillLevel = (handicap: number) => {
    if (handicap <= 5) return { label: 'Expert', color: 'error', icon: <TrendingUp /> }
    if (handicap <= 10) return { label: 'Advanced', color: 'warning', icon: <TrendingUp /> }
    if (handicap <= 18) return { label: 'Intermediate', color: 'info', icon: <Remove /> }
    return { label: 'Beginner', color: 'success', icon: <TrendingDown /> }
  }

  return (
    <Card>
      <CardContent sx={{ p: 3 }}>
        <Typography variant="h6" sx={{ fontWeight: 600, color: 'text.primary', mb: 3 }}>
          Player Handicaps
        </Typography>
        
        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
          {golfers.map((golfer) => {
            const skillLevel = getSkillLevel(golfer.golf_handicap!)
            
            return (
              <Box key={golfer.id} sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', py: 1 }}>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                  <Avatar
                    sx={{
                      width: 32,
                      height: 32,
                      bgcolor: 'primary.light',
                      color: 'primary.contrastText',
                      fontSize: '0.875rem',
                      fontWeight: 600
                    }}
                  >
                    {golfer.name.split(' ').map(n => n[0]).join('')}
                  </Avatar>
                  <Typography sx={{ fontWeight: 500 }}>{golfer.name}</Typography>
                </Box>
                
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                  <Chip
                    icon={skillLevel.icon}
                    label={skillLevel.label}
                    color={skillLevel.color as any}
                    size="small"
                    variant="outlined"
                  />
                  <Typography variant="h6" sx={{ fontWeight: 700, minWidth: 24, textAlign: 'center' }}>
                    {golfer.golf_handicap}
                  </Typography>
                </Box>
              </Box>
            )
          })}
        </Box>

        <Divider sx={{ my: 3 }} />
        
        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
          <Typography variant="body2" color="text.secondary">
            <strong>Average:</strong> {Math.round(golfers.reduce((sum, g) => sum + (g.golf_handicap || 0), 0) / golfers.length)}
          </Typography>
          <Typography variant="body2" color="text.secondary">
            <strong>Range:</strong> {Math.min(...golfers.map(g => g.golf_handicap || 0))} - {Math.max(...golfers.map(g => g.golf_handicap || 0))}
          </Typography>
        </Box>
      </CardContent>
    </Card>
  )
}