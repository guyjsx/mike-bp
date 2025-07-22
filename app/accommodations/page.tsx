'use client'

import { useState, useEffect, useCallback } from 'react'
import { createClient } from '@/lib/supabase/client'
import { Room, Attendee } from '@/lib/types'
import RoomGrid from '@/components/accommodations/RoomGrid'
import HotelInfo from '@/components/accommodations/HotelInfo'

export default function AccommodationsPage() {
  const [rooms, setRooms] = useState<Room[]>([])
  const [attendees, setAttendees] = useState<Attendee[]>([])
  const [loading, setLoading] = useState(true)
  const [attendeeId, setAttendeeId] = useState<string | undefined>()

  const supabase = createClient()

  useEffect(() => {
    const fetchData = async () => {
    try {
      const [roomsResult, attendeesResult] = await Promise.all([
        supabase.from('rooms').select('*').order('room_number'),
        supabase.from('attendees').select('*').order('name')
      ])

      if (roomsResult.data) setRooms(roomsResult.data)
      if (attendeesResult.data) setAttendees(attendeesResult.data)
    } catch (error) {
      console.error('Error fetching accommodation data:', error)
    } finally {
      setLoading(false)
    }
    }
    
    fetchData()
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
  }, [supabase])

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-64">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading room assignments...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-gray-900">Accommodations</h1>
        <p className="mt-2 text-gray-600">
          Room assignments and hotel information for the weekend
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        <div className="lg:col-span-3">
          <RoomGrid 
            rooms={rooms} 
            attendees={attendees} 
            currentUserId={attendeeId}
          />
        </div>
        
        <div className="lg:col-span-1">
          <HotelInfo />
        </div>
      </div>
    </div>
  )
}