'use client'

import { useState, useEffect } from 'react'
import { createClient } from '@/lib/supabase/client'
import { Attendee } from '@/lib/types'
import AttendeeGrid from '@/components/people/AttendeeGrid'

export default function PeoplePage() {
  const [attendees, setAttendees] = useState<Attendee[]>([])
  const [loading, setLoading] = useState(true)
  const [attendeeId, setAttendeeId] = useState<string | undefined>()

  const supabase = createClient()

  useEffect(() => {
    fetchAttendees()
    // Get current user from session
    const sessionData = document.cookie
      .split('; ')
      .find(row => row.startsWith('auth-session='))
    if (sessionData) {
      try {
        const session = JSON.parse(decodeURIComponent(sessionData.split('=')[1]))
        setAttendeeId(session.attendeeId)
      } catch (e) {
        // Handle parsing error
      }
    }
  }, [])

  const fetchAttendees = async () => {
    try {
      const { data, error } = await supabase
        .from('attendees')
        .select('*')
        .order('name')

      if (error) throw error
      setAttendees(data || [])
    } catch (error) {
      console.error('Error fetching attendees:', error)
    } finally {
      setLoading(false)
    }
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-64">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading attendees...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-gray-900">People</h1>
        <p className="mt-2 text-gray-600">
          Directory of all bachelor party attendees
        </p>
      </div>

      <AttendeeGrid attendees={attendees} currentUserId={attendeeId} />
    </div>
  )
}