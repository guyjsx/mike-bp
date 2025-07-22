'use client'

import Link from 'next/link'
import { Room, GolfPairing, ExpensePayment } from '@/lib/types'
import { Card, CardContent, Typography, Box } from '@mui/material'
import Grid from '@mui/material/Grid'
import { Hotel, GolfCourse, AttachMoney, Schedule } from '@mui/icons-material'

interface QuickStatsProps {
  room?: Room
  golfGroups?: GolfPairing[]
  amountOwed?: number
  nextEvent?: {
    title: string
    time: string
  }
}

export default function QuickStats({ room, golfGroups, amountOwed = 0, nextEvent }: QuickStatsProps) {
  const stats = [
    {
      title: 'Your Room',
      value: room ? `Room ${room.room_number}` : 'Not assigned',
      subtext: room ? `${room.attendee_ids.length} people` : '',
      href: '/accommodations',
      icon: Hotel,
      color: 'primary.main',
      bgColor: 'primary.50'
    },
    {
      title: 'Golf Groups',
      value: golfGroups && golfGroups.length > 0 ? `${golfGroups.length} rounds` : 'Not assigned',
      subtext: golfGroups && golfGroups.length > 0 ? 'View pairings' : '',
      href: '/golf',
      icon: GolfCourse,
      color: 'success.main',
      bgColor: 'success.light'
    },
    {
      title: 'Amount Owed',
      value: `$${amountOwed.toFixed(2)}`,
      subtext: 'View breakdown',
      href: '/expenses',
      icon: AttachMoney,
      color: amountOwed > 0 ? 'error.main' : 'text.secondary',
      bgColor: amountOwed > 0 ? 'error.light' : 'grey.100'
    },
    {
      title: 'Next Event',
      value: nextEvent ? nextEvent.title : 'No upcoming events',
      subtext: nextEvent ? nextEvent.time : '',
      href: '/schedule',
      icon: Schedule,
      color: 'secondary.main',
      bgColor: 'secondary.light'
    }
  ]

  return (
    <Grid container spacing={3}>
      {stats.map((stat, index) => {
        const IconComponent = stat.icon
        const getCardTheme = () => {
          switch (stat.title) {
            case 'Golf Groups':
              return {
                bg: 'linear-gradient(135deg, #ffffff 0%, #f8fffe 100%)',
                border: '1px solid rgba(27, 94, 32, 0.2)',
                iconBg: 'rgba(27, 94, 32, 0.1)',
                iconColor: '#1b5e20'
              }
            case 'Your Room':
              return {
                bg: 'linear-gradient(135deg, #ffffff 0%, #fefefe 100%)',
                border: '1px solid rgba(212, 175, 55, 0.3)',
                iconBg: 'rgba(212, 175, 55, 0.1)',
                iconColor: '#9c7a1a'
              }
            case 'Amount Owed':
              return {
                bg: 'linear-gradient(135deg, #ffffff 0%, #fafffe 100%)',
                border: stat.value === '$0.00' 
                  ? '1px solid rgba(46, 125, 50, 0.3)' 
                  : '1px solid rgba(255, 152, 0, 0.3)',
                iconBg: stat.value === '$0.00' 
                  ? 'rgba(46, 125, 50, 0.1)' 
                  : 'rgba(255, 152, 0, 0.1)',
                iconColor: stat.value === '$0.00' ? '#2e7d32' : '#f57c00'
              }
            case 'Next Event':
              return {
                bg: 'linear-gradient(135deg, #ffffff 0%, #fdfffe 100%)',
                border: '1px solid rgba(27, 94, 32, 0.25)',
                iconBg: 'rgba(27, 94, 32, 0.08)',
                iconColor: '#1b5e20'
              }
            default:
              return {
                bg: 'linear-gradient(135deg, #ffffff 0%, #f8f8f8 100%)',
                border: '1px solid rgba(27, 94, 32, 0.12)',
                iconBg: 'rgba(27, 94, 32, 0.08)',
                iconColor: '#1b5e20'
              }
          }
        }

        const theme = getCardTheme()

        return (
          <Grid size={{ xs: 12, sm: 6, lg: 3 }} key={stat.title}>
            <Box
              component={Link}
              href={stat.href}
              sx={{
                display: 'block',
                textDecoration: 'none',
                height: '100%',
                position: 'relative',
                background: theme.bg,
                border: theme.border,
                borderRadius: 2,
                overflow: 'hidden',
                transition: 'all 0.2s cubic-bezier(0.4, 0, 0.2, 1)',
                boxShadow: '0 2px 8px rgba(27, 94, 32, 0.08)',
                '&:hover': {
                  transform: 'translateY(-2px)',
                  boxShadow: '0 8px 24px rgba(27, 94, 32, 0.12)',
                  borderColor: theme.iconColor,
                },
                '&:active': {
                  transform: 'translateY(0px)',
                }
              }}
            >
              {/* Content */}
              <Box sx={{ p: 3 }}>
                <Box sx={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', mb: 2 }}>
                  <Box sx={{ flex: 1 }}>
                    <Typography 
                      variant="body2"
                      sx={{ 
                        fontWeight: 600,
                        fontSize: '0.75rem',
                        textTransform: 'uppercase',
                        letterSpacing: '0.5px',
                        color: 'text.secondary',
                        mb: 1
                      }}
                    >
                      {stat.title}
                    </Typography>
                    
                    <Typography 
                      variant="h6" 
                      sx={{ 
                        fontWeight: 700,
                        color: theme.iconColor,
                        fontSize: { xs: '1.125rem', md: '1.25rem' },
                        lineHeight: 1.2,
                        mb: 0.5
                      }}
                    >
                      {stat.value}
                    </Typography>
                    
                    {stat.subtext && (
                      <Typography 
                        variant="body2" 
                        sx={{ 
                          color: 'text.secondary',
                          fontSize: '0.875rem',
                          fontWeight: 400
                        }}
                      >
                        {stat.subtext}
                      </Typography>
                    )}
                  </Box>

                  {/* Icon */}
                  <Box
                    sx={{
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      width: 48,
                      height: 48,
                      borderRadius: 2,
                      background: theme.iconBg,
                      ml: 2
                    }}
                  >
                    <IconComponent sx={{ 
                      fontSize: 24, 
                      color: theme.iconColor
                    }} />
                  </Box>
                </Box>
              </Box>

              {/* Subtle bottom accent */}
              <Box
                sx={{
                  position: 'absolute',
                  bottom: 0,
                  left: 0,
                  right: 0,
                  height: 2,
                  background: `linear-gradient(90deg, ${theme.iconColor}20 0%, transparent 100%)`
                }}
              />
            </Box>
          </Grid>
        )
      })}
    </Grid>
  )
}