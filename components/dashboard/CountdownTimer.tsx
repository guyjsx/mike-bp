'use client'

import { useEffect, useState } from 'react'
import { Card, Typography, Box } from '@mui/material'
import Grid from '@mui/material/Grid'
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
        className="golf-card"
        sx={{
          background: 'linear-gradient(135deg, #0f3d13 0%, #1b5e20 100%)',
          color: 'white',
          p: { xs: 3, md: 4 },
          textAlign: 'center',
          position: 'relative',
          overflow: 'hidden',
          border: '2px solid rgba(212, 175, 55, 0.3)'
        }}
      >
        <Celebration sx={{ 
          fontSize: { xs: 48, md: 60 }, 
          mb: 2, 
          color: '#d4af37',
          filter: 'drop-shadow(0 2px 8px rgba(0,0,0,0.5))' 
        }} />
        <Typography 
          variant="h3" 
          component="h2" 
          sx={{ 
            fontWeight: 700, 
            mb: 2, 
            color: 'white',
            textShadow: '0 2px 4px rgba(0,0,0,0.5)',
            fontSize: { xs: '1.75rem', md: '2.5rem' }
          }}
        >
          The Bachelor Party Has Begun!
        </Typography>
        <Typography variant="h6" sx={{ 
          color: 'white', 
          textShadow: '0 2px 4px rgba(0,0,0,0.7)',
          fontWeight: 500,
          fontSize: { xs: '1rem', md: '1.125rem' }
        }}>
          Hope you&apos;re having an amazing time on the course!
        </Typography>
      </Card>
    )
  }

  return (
    <Card
      className="golf-card scorecard"
      sx={{
        background: 'linear-gradient(135deg, #1b5e20 0%, #2e7d32 100%)',
        color: 'white',
        p: { xs: 3, md: 4 },
        position: 'relative',
        overflow: 'hidden'
      }}
    >
      <Box
        sx={{
          position: 'absolute',
          top: 0,
          left: 0,
          right: 0,
          height: 4,
          background: 'linear-gradient(90deg, #d4af37 0%, #f7e199 50%, #d4af37 100%)',
          borderRadius: '16px 16px 0 0'
        }}
      />
      
      <Box sx={{ textAlign: 'center', mb: { xs: 3, md: 4 }, position: 'relative', zIndex: 1 }}>
        <Box sx={{ position: 'relative', display: 'inline-block' }}>
          <GolfCourse sx={{ fontSize: { xs: 40, md: 48 }, mb: 2, filter: 'drop-shadow(0 2px 8px rgba(0,0,0,0.3))' }} />
          <div className="pin-flag" style={{ position: 'absolute', top: 8, right: -8 }}></div>
        </Box>
        <Typography variant="h4" component="h2" sx={{ fontWeight: 700, color: 'white', fontSize: { xs: '1.5rem', md: '2rem' }, textShadow: '0 2px 4px rgba(0,0,0,0.3)' }}>
          Countdown to Tee Time
        </Typography>
        <Typography variant="body2" sx={{ opacity: 0.9, fontSize: { xs: '0.75rem', md: '0.875rem' }, textShadow: '0 1px 2px rgba(0,0,0,0.3)' }}>
          Bachelor Party Golf Weekend
        </Typography>
      </Box>
      
      <Grid container spacing={2}>
        {[
          { value: timeLeft.days, label: 'Days' },
          { value: timeLeft.hours, label: 'Hours' },
          { value: timeLeft.minutes, label: 'Minutes' },
          { value: timeLeft.seconds, label: 'Seconds' }
        ].map((item, index) => (
          <Grid size={3} key={item.label}>
            <Box 
              sx={{ 
                textAlign: 'center',
                p: { xs: 1, md: 2 },
                borderRadius: 2,
                backgroundColor: 'rgba(255, 255, 255, 0.1)',
                backdropFilter: 'blur(10px)',
                border: '1px solid rgba(255, 255, 255, 0.2)',
                transition: 'all 0.3s ease',
                '&:hover': {
                  backgroundColor: 'rgba(255, 255, 255, 0.15)',
                  transform: 'translateY(-2px)'
                }
              }}
            >
              <Typography 
                variant="h2" 
                sx={{ 
                  fontWeight: 700,
                  fontSize: { xs: '1.75rem', sm: '2.5rem', md: '3rem' },
                  lineHeight: 1,
                  fontFamily: 'monospace',
                  textShadow: '0 2px 4px rgba(0,0,0,0.3)',
                  animation: item.label === 'Seconds' ? 'scoreboardFlip 1s ease-in-out' : 'none'
                }}
              >
                {item.value.toString().padStart(2, '0')}
              </Typography>
              <Typography 
                variant="caption" 
                sx={{ 
                  textTransform: 'uppercase', 
                  fontSize: { xs: '0.6rem', md: '0.75rem' },
                  fontWeight: 600,
                  opacity: 0.9,
                  letterSpacing: '0.5px'
                }}
              >
                {item.label}
              </Typography>
            </Box>
          </Grid>
        ))}
      </Grid>

    </Card>
  )
}