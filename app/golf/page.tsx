'use client'

import { useState, useEffect, useCallback } from 'react'
import { createClient } from '@/lib/supabase/client'
import { GolfRound, GolfPairing, Attendee } from '@/lib/types'
import TeeTimeCard from '@/components/golf/TeeTimeCard'
import PairingsDisplay from '@/components/golf/PairingsDisplay'
import HandicapList from '@/components/golf/HandicapList'
import GolfGamesRules from '@/components/golf/GolfGamesRules'

export default function GolfPage() {
  const [rounds, setRounds] = useState<GolfRound[]>([])
  const [pairings, setPairings] = useState<GolfPairing[]>([])
  const [attendees, setAttendees] = useState<Attendee[]>([])
  const [loading, setLoading] = useState(true)
  const [selectedRound, setSelectedRound] = useState<string>('')
  const [attendeeId, setAttendeeId] = useState<string | undefined>()

  const supabase = createClient()

  const fetchData = useCallback(async () => {
    try {
      const [roundsResult, pairingsResult, attendeesResult] = await Promise.all([
        supabase.from('golf_rounds').select('*').order('day').order('tee_time'),
        supabase.from('golf_pairings').select('*').order('group_number'),
        supabase.from('attendees').select('*').order('name')
      ])

      if (roundsResult.data) {
        setRounds(roundsResult.data)
        if (roundsResult.data.length > 0 && !selectedRound) {
          setSelectedRound(roundsResult.data[0].id)
        }
      }
      if (pairingsResult.data) setPairings(pairingsResult.data)
      if (attendeesResult.data) setAttendees(attendeesResult.data)
    } catch (error) {
      console.error('Error fetching golf data:', error)
    } finally {
      setLoading(false)
    }
  }, [supabase, selectedRound])

  useEffect(() => {
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
  }, [fetchData])

  const selectedRoundData = rounds.find(r => r.id === selectedRound)
  const selectedRoundPairings = pairings.filter(p => p.round_id === selectedRound)

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-64">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading golf information...</p>
        </div>
      </div>
    )
  }

  if (rounds.length === 0) {
    return (
      <div className="text-center py-12">
        <span className="text-8xl">⛳</span>
        <h1 className="text-3xl font-bold text-gray-900 mt-4">No Golf Rounds Scheduled</h1>
        <p className="text-gray-600 mt-2">Golf information will be added soon!</p>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-gray-900">Golf Information</h1>
        <p className="mt-2 text-gray-600">
          Tee times, pairings, and game information for the weekend
        </p>
      </div>

      {rounds.length > 1 && (
        <div className="bg-white rounded-lg shadow p-4">
          <label htmlFor="round-select" className="block text-sm font-medium text-gray-700 mb-2">
            Select Round:
          </label>
          <select
            id="round-select"
            value={selectedRound}
            onChange={(e) => setSelectedRound(e.target.value)}
            className="block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-primary-500 focus:border-primary-500 sm:text-sm rounded-md"
          >
            {rounds.map((round) => (
              <option key={round.id} value={round.id}>
                {round.course_name} - {new Date(round.day).toLocaleDateString('en-US', { 
                  weekday: 'long', month: 'short', day: 'numeric' 
                })}
              </option>
            ))}
          </select>
        </div>
      )}

      {selectedRoundData && (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2 space-y-6">
            <TeeTimeCard round={selectedRoundData} />
            
            <div>
              <h2 className="text-xl font-semibold text-gray-900 mb-4">Pairings</h2>
              <PairingsDisplay
                pairings={selectedRoundPairings}
                attendees={attendees}
                currentUserId={attendeeId}
              />
            </div>
          </div>

          <div className="space-y-6">
            <HandicapList attendees={attendees} />
            <GolfGamesRules />
          </div>
        </div>
      )}
    </div>
  )
}