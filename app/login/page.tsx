'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { 
  Card, 
  CardContent, 
  TextField, 
  Button, 
  Typography, 
  Box, 
  Alert,
  CircularProgress
} from '@mui/material'
import { GolfCourse } from '@mui/icons-material'

export default function LoginPage() {
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  const router = useRouter()

  // Debug logging
  console.log('Current state:', { password, loading, passwordLength: password.length, buttonDisabled: loading || !password.trim() })

  const isButtonDisabled = loading || password.trim().length === 0

  const handleLogin = async () => {
    setError('')
    setLoading(true)

    try {
      console.log('Making login request with password:', password)
      const response = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ password }),
      })

      console.log('Response status:', response.status)
      console.log('Response ok:', response.ok)

      const data = await response.json()
      console.log('Response data:', data)

      if (!response.ok) {
        setError(data.error || 'Invalid password')
        return
      }

      if (data.role === 'attendee') {
        console.log('Redirecting to attendee selection')
        router.push('/select-attendee')
      } else {
        console.log('Redirecting to dashboard')
        router.push('/dashboard')
      }
    } catch (err) {
      console.error('Login error:', err)
      setError(`An error occurred: ${err.message}`)
    } finally {
      setLoading(false)
    }
  }

  return (
    <Box
      sx={{
        minHeight: '100vh',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        bgcolor: 'background.default',
        p: 3,
      }}
    >
      <Card sx={{ maxWidth: 400, width: '100%' }}>
        <CardContent sx={{ p: 4 }}>
          <Box sx={{ textAlign: 'center', mb: 4 }}>
            <GolfCourse 
              sx={{ 
                fontSize: 60, 
                color: 'primary.main', 
                mb: 2 
              }} 
            />
            <Typography 
              variant="h4" 
              component="h1" 
              sx={{ 
                fontWeight: 700, 
                color: 'text.primary',
                mb: 1
              }}
            >
              {process.env.NEXT_PUBLIC_EVENT_TITLE || 'Golf Weekend'}
            </Typography>
            <Typography 
              variant="body2" 
              color="text.secondary"
            >
              Enter your password to access the dashboard
            </Typography>
          </Box>
          
          <Box component="form" onSubmit={(e) => {
            e.preventDefault()
            if (!isButtonDisabled) {
              handleLogin()
            }
          }}>
            <TextField
              fullWidth
              type="password"
              label="Password"
              variant="outlined"
              value={password}
              onChange={(e) => {
                console.log('Password changed:', e.target.value)
                setPassword(e.target.value)
              }}
              sx={{ mb: 3 }}
              disabled={loading}
              autoFocus
              helperText=""
            />

            {error && (
              <Alert severity="error" sx={{ mb: 3 }}>
                {error}
              </Alert>
            )}

            <Button
              fullWidth
              type="submit"
              variant="contained"
              size="large"
              disabled={isButtonDisabled}
              startIcon={loading ? <CircularProgress size={20} color="inherit" /> : <GolfCourse />}
              sx={{ 
                py: 2,
                background: 'linear-gradient(135deg, #1b5e20 0%, #2e7d32 100%)',
                boxShadow: '0 4px 12px rgba(27, 94, 32, 0.3)',
                color: 'white',
                fontWeight: 600,
                fontSize: '1.1rem',
                '&:hover': {
                  background: 'linear-gradient(135deg, #0f3d13 0%, #1b5e20 100%)',
                  boxShadow: '0 6px 20px rgba(27, 94, 32, 0.4)',
                  transform: 'translateY(-2px)',
                },
                '&:disabled': {
                  background: 'rgba(27, 94, 32, 0.3)',
                  color: 'rgba(255, 255, 255, 0.7)',
                  boxShadow: 'none',
                },
                transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
              }}
            >
              {loading ? 'Verifying Password...' : 'Access Event Dashboard'}
            </Button>
          </Box>
        </CardContent>
      </Card>
    </Box>
  )
}