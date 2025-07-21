'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { createClient } from '@/lib/supabase/client'
import { Attendee } from '@/lib/types'

export default function SelectAttendeePage() {
  const [attendees, setAttendees] = useState<Attendee[]>([])
  const [selectedAttendeeId, setSelectedAttendeeId] = useState('')
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const router = useRouter()
  const supabase = createClient()

  useEffect(() => {
    fetchAttendees()
  }, [])

  const fetchAttendees = async () => {
    try {
      const { data, error } = await supabase
        .from('attendees')
        .select('*')
        .order('name')

      if (error) throw error
      setAttendees(data || [])
    } catch (err) {
      console.error('Error fetching attendees:', err)
      setError('Failed to load attendees')
    } finally {
      setLoading(false)
    }
  }

  const handleContinue = async () => {
    if (!selectedAttendeeId) return

    const selectedAttendee = attendees.find(a => a.id === selectedAttendeeId)
    if (!selectedAttendee) return

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
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading attendees...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8">
        <div>
          <h2 className="text-center text-3xl font-bold text-gray-900">
            Who are you?
          </h2>
          <p className="mt-2 text-center text-sm text-gray-600">
            Select your name to continue
          </p>
        </div>

        <div className="mt-8 space-y-6">
          {error && (
            <div className="rounded-md bg-red-50 p-4">
              <div className="text-sm text-red-800">{error}</div>
            </div>
          )}

          <div>
            <label htmlFor="attendee" className="block text-sm font-medium text-gray-700">
              Select your name
            </label>
            <select
              id="attendee"
              name="attendee"
              className="mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-primary-500 focus:border-primary-500 sm:text-sm rounded-md"
              value={selectedAttendeeId}
              onChange={(e) => setSelectedAttendeeId(e.target.value)}
            >
              <option value="">Choose...</option>
              {attendees.map((attendee) => (
                <option key={attendee.id} value={attendee.id}>
                  {attendee.name}
                </option>
              ))}
            </select>
          </div>

          <button
            type="button"
            onClick={handleContinue}
            disabled={!selectedAttendeeId}
            className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-primary-600 hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            Continue
          </button>
        </div>
      </div>
    </div>
  )
}