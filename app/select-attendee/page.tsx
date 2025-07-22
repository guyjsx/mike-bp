'use client'

import { useState, useEffect, useCallback } from 'react'
import { useRouter } from 'next/navigation'
import { createClient } from '@/lib/supabase/client'
import { Attendee } from '@/lib/types'
import { 
  Card, 
  CardContent, 
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Button, 
  Typography, 
  Box, 
  Alert,
  CircularProgress
} from '@mui/material'
import { GolfCourse, Person } from '@mui/icons-material'

// Force dynamic rendering
export const dynamic = 'force-dynamic'

export default function SelectAttendeePage() {
  const [attendees, setAttendees] = useState<Attendee[]>([])
  const [selectedAttendeeId, setSelectedAttendeeId] = useState('')
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [submitting, setSubmitting] = useState(false)
  const router = useRouter()
  const supabase = createClient()

  const fetchAttendees = useCallback(async () => {
    try {
      const { data, error } = await supabase
        .from('attendees')
        .select('*')
        .order('name')

      if (error) throw error
      
      console.log('Fetched attendees:', data) // Debug log
      console.log('Supabase response:', { data, error }) // More debug info
      setAttendees(data || [])
      
      if (!data || data.length === 0) {
        setError(`No attendees found. Please add attendees to your database. Response: ${JSON.stringify({ data, error })}`)
      }
    } catch (err) {
      console.error('Error fetching attendees:', err)
      setError('Failed to load attendees. Please try again.')
    } finally {
      setLoading(false)
    }
  }, [supabase])

  useEffect(() => {
    fetchAttendees()
  }, [fetchAttendees])

  const handleContinue = async () => {
    if (!selectedAttendeeId) return

    const selectedAttendee = attendees.find(a => a.id === selectedAttendeeId)
    if (!selectedAttendee) return

    setSubmitting(true)
    try {
      const response = await fetch('/api/auth/select-attendee', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          attendeeId: selectedAttendeeId,
          attendeeName: selectedAttendee.name
        }),
      })

      if (!response.ok) {
        throw new Error('Failed to set attendee')
      }

      router.push('/dashboard')
    } catch (err) {
      setError('Failed to select attendee. Please try again.')
      setSubmitting(false)
    }
  }

  if (loading) {
    return (
      <Box
        sx={{
          minHeight: '100vh',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          bgcolor: 'background.default',
        }}
      >
        <Box sx={{ textAlign: 'center' }}>
          <CircularProgress size={60} />
          <Typography sx={{ mt: 2 }} color="text.secondary">
            Loading attendees...
          </Typography>
        </Box>
      </Box>
    )
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
            <Person 
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
              Who are you?
            </Typography>
            <Typography 
              variant="body2" 
              color="text.secondary"
            >
              Select your name to continue
            </Typography>
          </Box>

          {error && (
            <Alert severity="error" sx={{ mb: 3 }}>
              {error}
            </Alert>
          )}

          <FormControl fullWidth sx={{ mb: 3 }}>
            <InputLabel id="attendee-select-label">Select your name</InputLabel>
            <Select
              labelId="attendee-select-label"
              value={selectedAttendeeId}
              label="Select your name"
              onChange={(e) => setSelectedAttendeeId(e.target.value)}
              disabled={submitting}
            >
              {attendees.map((attendee) => (
                <MenuItem key={attendee.id} value={attendee.id}>
                  {attendee.name}
                </MenuItem>
              ))}
            </Select>
          </FormControl>

          <Button
            fullWidth
            variant="contained"
            size="large"
            onClick={handleContinue}
            disabled={!selectedAttendeeId || submitting}
            startIcon={submitting ? <CircularProgress size={20} /> : <GolfCourse />}
            sx={{ py: 1.5 }}
          >
            {submitting ? 'Setting up...' : 'Continue'}
          </Button>
        </CardContent>
      </Card>
    </Box>
  )
}