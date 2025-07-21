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
import { GolfCourse, Person, AdminPanelSettings } from '@mui/icons-material'

export default function LoginPage() {
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  const router = useRouter()

  const handleLogin = async (role: 'attendee' | 'admin') => {
    setError('')
    setLoading(true)

    try {
      const response = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ password, role }),
      })

      const data = await response.json()

      if (!response.ok) {
        setError(data.error || 'Invalid password')
        return
      }

      if (role === 'attendee') {
        router.push('/select-attendee')
      } else {
        router.push('/dashboard')
      }
    } catch (err) {
      setError('An error occurred. Please try again.')
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
              Enter the password to access the event
            </Typography>
          </Box>
          
          <Box component="form" onSubmit={(e) => e.preventDefault()}>
            <TextField
              fullWidth
              type="password"
              label="Password"
              variant="outlined"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              sx={{ mb: 3 }}
              disabled={loading}
            />

            {error && (
              <Alert severity="error" sx={{ mb: 3 }}>
                {error}
              </Alert>
            )}

            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
              <Button
                fullWidth
                variant="contained"
                size="large"
                onClick={() => handleLogin('attendee')}
                disabled={loading || !password}
                startIcon={loading ? <CircularProgress size={20} /> : <Person />}
                sx={{ py: 1.5 }}
              >
                {loading ? 'Verifying...' : 'Attendee Access'}
              </Button>
              
              <Button
                fullWidth
                variant="outlined"
                size="large"
                onClick={() => handleLogin('admin')}
                disabled={loading || !password}
                startIcon={loading ? <CircularProgress size={20} /> : <AdminPanelSettings />}
                sx={{ py: 1.5 }}
              >
                {loading ? 'Verifying...' : 'Admin Access'}
              </Button>
            </Box>
          </Box>
        </CardContent>
      </Card>
    </Box>
  )
}