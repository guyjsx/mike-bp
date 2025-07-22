'use client'

import { useState, useEffect, useCallback } from 'react'
import { createClient } from '@/lib/supabase/client'
import { GolfRound, GolfPairing, Attendee } from '@/lib/types'
import TeeTimeCard from '@/components/golf/TeeTimeCard'
import PairingsDisplay from '@/components/golf/PairingsDisplay'
import HandicapList from '@/components/golf/HandicapList'
import GolfGamesRules from '@/components/golf/GolfGamesRules'
import InteractiveScorecard from '@/components/golf/InteractiveScorecard'
import LiveLeaderboard from '@/components/golf/LiveLeaderboard'

export default function GolfPage() {
  const [rounds, setRounds] = useState<GolfRound[]>([])
  const [pairings, setPairings] = useState<GolfPairing[]>([])
  const [attendees, setAttendees] = useState<Attendee[]>([])
  const [loading, setLoading] = useState(true)
  const [selectedRound, setSelectedRound] = useState<string>('')
  const [attendeeId, setAttendeeId] = useState<string | undefined>()
  const [attendeeName, setAttendeeName] = useState<string>('')
  const [activeTab, setActiveTab] = useState<'info' | 'scorecard' | 'leaderboard'>('info')
  const [selectedAttendeeForScorecard, setSelectedAttendeeForScorecard] = useState<string>('')
  const [isAdmin, setIsAdmin] = useState(false)

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
    // Get current user from server-side session
    fetchSessionData()
  }, [fetchData])

  const fetchSessionData = async () => {
    try {
      const response = await fetch('/api/auth/session')
      if (response.ok) {
        const sessionData = await response.json()
        setAttendeeId(sessionData.attendeeId)
        setAttendeeName(sessionData.attendeeName || '')
        setIsAdmin(sessionData.role === 'admin')
      }
    } catch (error) {
      // Session fetch failed - user likely not logged in
    }
  }

  // If we have attendeeId but no attendeeName, look it up from the attendees list
  useEffect(() => {
    if (attendeeId && !attendeeName && attendees.length > 0) {
      const attendee = attendees.find(a => a.id === attendeeId)
      if (attendee) {
        setAttendeeName(attendee.name)
      }
    }
  }, [attendeeId, attendeeName, attendees])

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
          Tee times, pairings, scorecards, and live leaderboard
        </p>
        
      </div>

      {/* Tab Navigation */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200">
        <div className="border-b border-gray-200">
          <nav className="-mb-px flex space-x-8 px-6">
            {[
              { id: 'info', label: 'Course Info', icon: '🏌️' },
              { id: 'scorecard', label: 'My Scorecard', icon: '📊' },
              { id: 'leaderboard', label: 'Leaderboard', icon: '🏆' }
            ].map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id as any)}
                className={`py-4 px-1 border-b-2 font-medium text-sm whitespace-nowrap ${
                  activeTab === tab.id
                    ? 'border-green-500 text-green-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }`}
              >
                <span className="mr-2">{tab.icon}</span>
                {tab.label}
              </button>
            ))}
          </nav>
        </div>
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
        <div className="space-y-6">
          {/* Course Info Tab */}
          {activeTab === 'info' && (
            <div className="space-y-6">
              {/* Golf Pairings - Featured First */}
              <div className="bg-white rounded-lg shadow-lg border border-green-100">
                <div className="bg-gradient-to-r from-green-600 to-green-700 text-white p-6 rounded-t-lg">
                  <h2 className="text-2xl font-bold flex items-center gap-3">
                    <span className="text-3xl">⛳</span>
                    Golf Pairings
                  </h2>
                  <p className="text-green-100 mt-1">Your groups for {selectedRoundData?.course_name}</p>
                </div>
                <div className="p-6">
                  <PairingsDisplay
                    pairings={selectedRoundPairings}
                    attendees={attendees}
                    currentUserId={attendeeId}
                  />
                </div>
              </div>

              {/* Secondary Information */}
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                <div className="lg:col-span-2">
                  <TeeTimeCard round={selectedRoundData} />
                </div>

                <div className="space-y-6">
                  <HandicapList attendees={attendees} />
                  <GolfGamesRules />
                </div>
              </div>
            </div>
          )}

          {/* Scorecard Tab */}
          {activeTab === 'scorecard' && (
            <div className="max-w-6xl mx-auto">
              {/* Admin Attendee Selector */}
              {isAdmin && (
                <div className="bg-white rounded-lg shadow p-4 mb-6">
                  <label htmlFor="attendee-select" className="block text-sm font-medium text-gray-700 mb-2">
                    Select Attendee for Scorecard:
                  </label>
                  <select
                    id="attendee-select"
                    value={selectedAttendeeForScorecard}
                    onChange={(e) => setSelectedAttendeeForScorecard(e.target.value)}
                    className="block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-green-500 focus:border-green-500 sm:text-sm rounded-md"
                  >
                    <option value="">Choose an attendee...</option>
                    {attendees.map((attendee) => (
                      <option key={attendee.id} value={attendee.id}>
                        {attendee.name}
                      </option>
                    ))}
                  </select>
                </div>
              )}

              {/* Show Scorecard */}
              {((attendeeId && attendeeName) || (isAdmin && selectedAttendeeForScorecard)) && (
                <InteractiveScorecard
                  roundId={selectedRound}
                  attendeeId={isAdmin ? selectedAttendeeForScorecard : attendeeId!}
                  attendeeName={isAdmin ? attendees.find(a => a.id === selectedAttendeeForScorecard)?.name || 'Selected Attendee' : attendeeName}
                  onScoreUpdate={(score) => {
                    console.log('Score updated:', score)
                  }}
                />
              )}

              {/* No Access Message */}
              {!attendeeId && !isAdmin && (
                <div className="text-center py-12 bg-white rounded-lg shadow">
                  <span className="text-8xl">📊</span>
                  <h2 className="text-2xl font-bold text-gray-900 mt-4">Scorecard Access Required</h2>
                  <p className="text-gray-600 mt-2">Please log in as an attendee to access your scorecard.</p>
                </div>
              )}

              {/* Admin but no attendee selected */}
              {isAdmin && !selectedAttendeeForScorecard && !attendeeId && (
                <div className="text-center py-12 bg-white rounded-lg shadow">
                  <span className="text-8xl">⛳</span>
                  <h2 className="text-2xl font-bold text-gray-900 mt-4">Select an Attendee</h2>
                  <p className="text-gray-600 mt-2">Choose an attendee from the dropdown above to view their scorecard.</p>
                </div>
              )}
            </div>
          )}

          {/* Leaderboard Tab */}
          {activeTab === 'leaderboard' && (
            <div className="max-w-4xl mx-auto">
              <LiveLeaderboard roundId={selectedRound} />
            </div>
          )}
        </div>
      )}
    </div>
  )
}