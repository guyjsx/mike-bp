'use client'

import { useState, useEffect } from 'react'
import {
  Card,
  CardContent,
  Typography,
  Box,
  Avatar,
  Chip,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  LinearProgress,
  Divider
} from '@mui/material'
import {
  EmojiEvents,
  GolfCourse,
  TrendingUp,
  TrendingDown,
  Remove
} from '@mui/icons-material'
import { createClient } from '@/lib/supabase/client'
import { GolfScorecard, Attendee, GolfCourse as GolfCourseType } from '@/lib/types'

interface LiveLeaderboardProps {
  roundId: string
  refreshInterval?: number
}

interface LeaderboardEntry {
  attendee: Attendee
  scorecard: GolfScorecard
  totalScore: number
  scoreVsPar: number
  holesCompleted: number
  position: number
  isCurrentUser?: boolean
}

export default function LiveLeaderboard({ roundId, refreshInterval = 30000 }: LiveLeaderboardProps) {
  const [leaderboard, setLeaderboard] = useState<LeaderboardEntry[]>([])
  const [course, setCourse] = useState<GolfCourseType | null>(null)
  const [loading, setLoading] = useState(true)
  const [lastUpdate, setLastUpdate] = useState<Date>(new Date())

  const supabase = createClient()

  useEffect(() => {
    loadLeaderboardData()
    
    // Set up interval for live updates
    const interval = setInterval(() => {
      loadLeaderboardData()
    }, refreshInterval)

    return () => clearInterval(interval)
  }, [roundId, refreshInterval]) // eslint-disable-line react-hooks/exhaustive-deps

  const loadLeaderboardData = async () => {
    try {
      // Load course data
      const { data: courseData } = await supabase
        .from('golf_courses')
        .select('*')
        .eq('name', 'Champions Pointe Golf Club')
        .single()

      if (courseData) {
        setCourse(courseData)
      }

      // Load scorecards with attendee data
      const { data: scorecardsData } = await supabase
        .from('golf_scorecards')
        .select(`
          *,
          attendees (*)
        `)
        .eq('round_id', roundId)
        .order('total_score', { ascending: true, nullsFirst: false })

      if (scorecardsData) {
        // Count completed holes for each scorecard
        const leaderboardPromises = scorecardsData.map(async (scorecard) => {
          const { data: holeScores } = await supabase
            .from('golf_hole_scores')
            .select('strokes')
            .eq('scorecard_id', scorecard.id)
            .not('strokes', 'is', null)

          const holesCompleted = holeScores?.length || 0
          const totalScore = scorecard.total_score || 0
          const scoreVsPar = totalScore > 0 ? totalScore - (courseData?.par_total || 72) : 0

          return {
            attendee: scorecard.attendees,
            scorecard,
            totalScore,
            scoreVsPar,
            holesCompleted,
            position: 0 // Will be set below
          }
        })

        const leaderboardData = await Promise.all(leaderboardPromises)
        
        // Sort by total score (ascending) and assign positions
        const sortedLeaderboard = leaderboardData
          .filter(entry => entry.totalScore > 0) // Only show players who have started
          .sort((a, b) => a.totalScore - b.totalScore)
          .map((entry, index) => ({
            ...entry,
            position: index + 1
          }))

        // Add players who haven't started at the end
        const notStarted = leaderboardData
          .filter(entry => entry.totalScore === 0)
          .map(entry => ({
            ...entry,
            position: sortedLeaderboard.length + 1
          }))

        setLeaderboard([...sortedLeaderboard, ...notStarted])
        setLastUpdate(new Date())
      }
    } catch (error) {
      console.error('Error loading leaderboard data:', error)
    } finally {
      setLoading(false)
    }
  }

  const getPositionIcon = (position: number) => {
    switch (position) {
      case 1:
        return <EmojiEvents sx={{ color: '#FFD700' }} />
      case 2:
        return <EmojiEvents sx={{ color: '#C0C0C0' }} />
      case 3:
        return <EmojiEvents sx={{ color: '#CD7F32' }} />
      default:
        return null
    }
  }

  const getScoreColor = (scoreVsPar: number) => {
    if (scoreVsPar < 0) return '#2e7d32' // Green for under par
    if (scoreVsPar === 0) return '#1976d2' // Blue for even par
    return '#d32f2f' // Red for over par
  }

  const getScoreDisplay = (scoreVsPar: number) => {
    if (scoreVsPar === 0) return 'E'
    return scoreVsPar > 0 ? `+${scoreVsPar}` : `${scoreVsPar}`
  }

  const getTrendIcon = (scoreVsPar: number) => {
    if (scoreVsPar < 0) return <TrendingDown sx={{ color: '#2e7d32', fontSize: 16 }} />
    if (scoreVsPar > 0) return <TrendingUp sx={{ color: '#d32f2f', fontSize: 16 }} />
    return <Remove sx={{ color: '#1976d2', fontSize: 16 }} />
  }

  if (loading) {
    return (
      <Card>
        <CardContent>
          <Box display="flex" alignItems="center" gap={1} mb={2}>
            <EmojiEvents sx={{ color: '#1b5e20' }} />
            <Typography variant="h6" fontWeight={700}>
              Live Leaderboard
            </Typography>
          </Box>
          <LinearProgress />
        </CardContent>
      </Card>
    )
  }

  return (
    <Card>
      <CardContent>
        <Box display="flex" alignItems="center" justifyContent="space-between" mb={2}>
          <Box display="flex" alignItems="center" gap={1}>
            <EmojiEvents sx={{ color: '#1b5e20' }} />
            <Typography variant="h6" fontWeight={700}>
              Live Leaderboard
            </Typography>
          </Box>
          <Chip 
            size="small" 
            label={`Updated ${lastUpdate.toLocaleTimeString()}`}
            variant="outlined"
          />
        </Box>

        {leaderboard.length === 0 ? (
          <Box textAlign="center" py={4}>
            <GolfCourse sx={{ fontSize: 48, color: '#ccc', mb: 2 }} />
            <Typography color="text.secondary">
              No scores yet. Start playing to see the leaderboard!
            </Typography>
          </Box>
        ) : (
          <TableContainer>
            <Table size="small">
              <TableHead>
                <TableRow>
                  <TableCell sx={{ fontWeight: 700 }}>Pos</TableCell>
                  <TableCell sx={{ fontWeight: 700 }}>Player</TableCell>
                  <TableCell align="center" sx={{ fontWeight: 700 }}>Score</TableCell>
                  <TableCell align="center" sx={{ fontWeight: 700 }}>Holes</TableCell>
                  <TableCell align="center" sx={{ fontWeight: 700 }}>Total</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {leaderboard.map((entry, index) => (
                  <TableRow 
                    key={entry.attendee.id}
                    sx={{
                      backgroundColor: entry.isCurrentUser ? 'rgba(27, 94, 32, 0.1)' : 'transparent',
                      '&:hover': { backgroundColor: 'rgba(0, 0, 0, 0.04)' }
                    }}
                  >
                    <TableCell>
                      <Box display="flex" alignItems="center" gap={1}>
                        {getPositionIcon(entry.position)}
                        <Typography 
                          variant="body2" 
                          fontWeight={entry.position <= 3 ? 700 : 400}
                        >
                          {entry.totalScore > 0 ? entry.position : '-'}
                        </Typography>
                      </Box>
                    </TableCell>
                    
                    <TableCell>
                      <Box display="flex" alignItems="center" gap={2}>
                        <Avatar sx={{ width: 32, height: 32, bgcolor: '#1b5e20' }}>
                          {entry.attendee.name.charAt(0).toUpperCase()}
                        </Avatar>
                        <Box>
                          <Typography variant="body2" fontWeight={600}>
                            {entry.attendee.name}
                          </Typography>
                          {entry.attendee.golf_handicap && (
                            <Typography variant="caption" color="text.secondary">
                              HCP: {entry.attendee.golf_handicap}
                            </Typography>
                          )}
                        </Box>
                      </Box>
                    </TableCell>
                    
                    <TableCell align="center">
                      {entry.totalScore > 0 ? (
                        <Box display="flex" alignItems="center" justifyContent="center" gap={0.5}>
                          {getTrendIcon(entry.scoreVsPar)}
                          <Typography 
                            variant="body2" 
                            fontWeight={700}
                            sx={{ color: getScoreColor(entry.scoreVsPar) }}
                          >
                            {getScoreDisplay(entry.scoreVsPar)}
                          </Typography>
                        </Box>
                      ) : (
                        <Typography variant="body2" color="text.secondary">
                          -
                        </Typography>
                      )}
                    </TableCell>
                    
                    <TableCell align="center">
                      <Box display="flex" alignItems="center" justifyContent="center" gap={1}>
                        <Typography variant="body2">
                          {entry.holesCompleted}/18
                        </Typography>
                        <LinearProgress 
                          variant="determinate" 
                          value={(entry.holesCompleted / 18) * 100}
                          sx={{ 
                            width: 30, 
                            height: 4,
                            borderRadius: 2,
                            '& .MuiLinearProgress-bar': {
                              backgroundColor: entry.holesCompleted === 18 ? '#2e7d32' : '#1976d2'
                            }
                          }}
                        />
                      </Box>
                    </TableCell>
                    
                    <TableCell align="center">
                      <Typography 
                        variant="body2" 
                        fontWeight={entry.totalScore > 0 ? 600 : 400}
                      >
                        {entry.totalScore > 0 ? entry.totalScore : '-'}
                      </Typography>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        )}

        {course && leaderboard.some(e => e.totalScore > 0) && (
          <>
            <Divider sx={{ my: 2 }} />
            <Box textAlign="center">
              <Typography variant="caption" color="text.secondary">
                Course Par: {course.par_total} • {course.yardage_total} yards
              </Typography>
            </Box>
          </>
        )}
      </CardContent>
    </Card>
  )
}