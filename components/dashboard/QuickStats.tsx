'use client'

import Link from 'next/link'
import { Room, GolfPairing, ExpensePayment } from '@/lib/types'
import { Card, CardContent, Typography, Box, Grid } from '@mui/material'
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
      {stats.map((stat) => {
        const IconComponent = stat.icon
        return (
          <Grid item xs={12} sm={6} lg={3} key={stat.title}>
            <Card 
              component={Link}
              href={stat.href}
              sx={{ 
                height: '100%',
                textDecoration: 'none',
                transition: 'all 0.2s ease-in-out',
                '&:hover': {
                  transform: 'translateY(-2px)',
                  boxShadow: 3
                }
              }}
            >
              <CardContent sx={{ p: 3 }}>
                <Box sx={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between' }}>
                  <Box sx={{ flexGrow: 1 }}>
                    <Typography 
                      variant="body2" 
                      color="text.secondary" 
                      sx={{ fontWeight: 600, mb: 1 }}
                    >
                      {stat.title}
                    </Typography>
                    <Typography 
                      variant="h6" 
                      sx={{ 
                        fontWeight: 700,
                        mb: 0.5,
                        color: stat.color
                      }}
                    >
                      {stat.value}
                    </Typography>
                    {stat.subtext && (
                      <Typography variant="caption" color="text.secondary">
                        {stat.subtext}
                      </Typography>
                    )}
                  </Box>
                  <Box
                    sx={{
                      p: 1.5,
                      borderRadius: 2,
                      backgroundColor: 'rgba(45, 143, 45, 0.1)'
                    }}
                  >
                    <IconComponent sx={{ fontSize: 28, color: stat.color }} />
                  </Box>
                </Box>
              </CardContent>
            </Card>
          </Grid>
        )
      })}
    </Grid>
  )
}