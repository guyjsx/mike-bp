'use client'

import { useEffect, useState } from 'react'
import { Card, Typography, Box, Grid } from '@mui/material'
import { GolfCourse, Celebration } from '@mui/icons-material'

export default function CountdownTimer() {
  const [timeLeft, setTimeLeft] = useState({
    days: 0,
    hours: 0,
    minutes: 0,
    seconds: 0
  })

  useEffect(() => {
    const eventStart = new Date(process.env.NEXT_PUBLIC_EVENT_START || '2024-05-10')
    
    const calculateTimeLeft = () => {
      const difference = eventStart.getTime() - new Date().getTime()
      
      if (difference > 0) {
        setTimeLeft({
          days: Math.floor(difference / (1000 * 60 * 60 * 24)),
          hours: Math.floor((difference / (1000 * 60 * 60)) % 24),
          minutes: Math.floor((difference / 1000 / 60) % 60),
          seconds: Math.floor((difference / 1000) % 60)
        })
      } else {
        setTimeLeft({ days: 0, hours: 0, minutes: 0, seconds: 0 })
      }
    }

    calculateTimeLeft()
    const timer = setInterval(calculateTimeLeft, 1000)

    return () => clearInterval(timer)
  }, [])

  const eventStarted = timeLeft.days === 0 && timeLeft.hours === 0 && timeLeft.minutes === 0 && timeLeft.seconds === 0

  if (eventStarted) {
    return (
      <Card
        sx={{
          background: 'linear-gradient(135deg, #2d8f2d 0%, #1f6b1f 100%)',
          color: 'white',
          p: 4,
          textAlign: 'center'
        }}
      >
        <Celebration sx={{ fontSize: 60, mb: 2 }} />
        <Typography variant="h4" component="h2" sx={{ fontWeight: 700, mb: 2 }}>
          The Golf Weekend Has Started!
        </Typography>
        <Typography variant="h6">
          Hope you&apos;re having an amazing time on the course!
        </Typography>
      </Card>
    )
  }

  return (
    <Card
      sx={{
        background: 'linear-gradient(135deg, #2d8f2d 0%, #1f6b1f 100%)',
        color: 'white',
        p: 4
      }}
    >
      <Box sx={{ textAlign: 'center', mb: 4 }}>
        <GolfCourse sx={{ fontSize: 48, mb: 2 }} />
        <Typography variant="h4" component="h2" sx={{ fontWeight: 700 }}>
          Countdown to Tee Time
        </Typography>
      </Box>
      
      <Grid container spacing={2}>
        <Grid item xs={3}>
          <Box sx={{ textAlign: 'center' }}>
            <Typography variant="h2" sx={{ fontWeight: 700 }}>
              {timeLeft.days}
            </Typography>
            <Typography variant="caption" sx={{ textTransform: 'uppercase', fontSize: '0.8rem' }}>
              Days
            </Typography>
          </Box>
        </Grid>
        <Grid item xs={3}>
          <Box sx={{ textAlign: 'center' }}>
            <Typography variant="h2" sx={{ fontWeight: 700 }}>
              {timeLeft.hours}
            </Typography>
            <Typography variant="caption" sx={{ textTransform: 'uppercase', fontSize: '0.8rem' }}>
              Hours
            </Typography>
          </Box>
        </Grid>
        <Grid item xs={3}>
          <Box sx={{ textAlign: 'center' }}>
            <Typography variant="h2" sx={{ fontWeight: 700 }}>
              {timeLeft.minutes}
            </Typography>
            <Typography variant="caption" sx={{ textTransform: 'uppercase', fontSize: '0.8rem' }}>
              Minutes
            </Typography>
          </Box>
        </Grid>
        <Grid item xs={3}>
          <Box sx={{ textAlign: 'center' }}>
            <Typography variant="h2" sx={{ fontWeight: 700 }}>
              {timeLeft.seconds}
            </Typography>
            <Typography variant="caption" sx={{ textTransform: 'uppercase', fontSize: '0.8rem' }}>
              Seconds
            </Typography>
          </Box>
        </Grid>
      </Grid>
    </Card>
  )
}