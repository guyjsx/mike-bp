'use client'

import { useState, useEffect } from 'react'
import {
  Card,
  CardContent,
  Typography,
  Box,
  TextField,
  Button,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
  Chip,
  IconButton,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Tabs,
  Tab,
  Alert
} from '@mui/material'
import Grid from '@mui/material/Grid'
import {
  GolfCourse,
  Add,
  Remove,
  Save,
  EmojiEvents,
  PhotoCamera,
  Notes
} from '@mui/icons-material'
import { createClient } from '@/lib/supabase/client'
import { GolfCourse as GolfCourseType, GolfHole, GolfScorecard, GolfHoleScore, Attendee } from '@/lib/types'

interface InteractiveScorecardProps {
  roundId: string
  attendeeId: string
  attendeeName: string
  onScoreUpdate?: (totalScore: number) => void
}

interface HoleData extends GolfHole {
  score?: number
  putts?: number
  notes?: string
}

const TEE_COLORS = {
  fuzzy: '#D4AF37', // Gold
  white: '#FFFFFF',
  gray: '#808080',
  red: '#DC2626'
}

const TEE_LABELS = {
  fuzzy: 'Fuzzy',
  white: 'White',
  gray: 'Gray', 
  red: 'Red'
}

export default function InteractiveScorecard({ 
  roundId, 
  attendeeId, 
  attendeeName,
  onScoreUpdate 
}: InteractiveScorecardProps) {
  const [course, setCourse] = useState<GolfCourseType | null>(null)
  const [holes, setHoles] = useState<HoleData[]>([])
  const [scorecard, setScorecard] = useState<GolfScorecard | null>(null)
  const [teeSelection, setTeeSelection] = useState<'fuzzy' | 'white' | 'gray' | 'red'>('white')
  const [currentHole, setCurrentHole] = useState(1)
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [notesDialog, setNotesDialog] = useState<{ open: boolean; holeNumber: number }>({ open: false, holeNumber: 1 })
  const [tabValue, setTabValue] = useState(0) // 0 = Front 9, 1 = Back 9
  const [scoreDialog, setScoreDialog] = useState<{ open: boolean; hole: HoleData | null }>({ open: false, hole: null })

  const supabase = createClient()

  useEffect(() => {
    loadScorecardData()
  }, [roundId, attendeeId]) // eslint-disable-line react-hooks/exhaustive-deps

  const loadScorecardData = async () => {
    try {
      // Load course and holes data
      const { data: courseData } = await supabase
        .from('golf_courses')
        .select('*')
        .eq('name', 'Champions Pointe Golf Club')
        .single()

      if (courseData) {
        setCourse(courseData)

        const { data: holesData } = await supabase
          .from('golf_holes')
          .select('*')
          .eq('course_id', courseData.id)
          .order('hole_number')

        if (holesData) {
          // Load existing scorecard if it exists
          const { data: existingScorecard } = await supabase
            .from('golf_scorecards')
            .select('*')
            .eq('round_id', roundId)
            .eq('attendee_id', attendeeId)
            .single()

          let scorecardId = existingScorecard?.id

          // Create scorecard if it doesn't exist
          if (!existingScorecard) {
            const { data: newScorecard } = await supabase
              .from('golf_scorecards')
              .insert({
                round_id: roundId,
                attendee_id: attendeeId,
                course_id: courseData.id,
                tee_selection: teeSelection,
                started_at: new Date().toISOString()
              })
              .select()
              .single()

            scorecardId = newScorecard?.id
            setScorecard(newScorecard)
          } else {
            setScorecard(existingScorecard)
            setTeeSelection(existingScorecard.tee_selection)
          }

          // Load hole scores
          if (scorecardId) {
            const { data: holeScores } = await supabase
              .from('golf_hole_scores')
              .select('*')
              .eq('scorecard_id', scorecardId)

            // Merge hole data with scores
            const holesWithScores = holesData.map(hole => {
              const holeScore = holeScores?.find(score => score.hole_id === hole.id)
              return {
                ...hole,
                score: holeScore?.strokes,
                putts: holeScore?.putts,
                notes: holeScore?.notes
              }
            })

            setHoles(holesWithScores)
          }
        }
      }
    } catch (error) {
      console.error('Error loading scorecard data:', error)
    } finally {
      setLoading(false)
    }
  }

  const updateHoleScore = async (holeNumber: number, field: 'score' | 'putts', value: number) => {
    if (!scorecard) return

    const hole = holes.find(h => h.hole_number === holeNumber)
    if (!hole) return

    setSaving(true)

    try {
      // Update local state immediately
      const updatedHoles = holes.map(h => 
        h.hole_number === holeNumber 
          ? { ...h, [field]: value }
          : h
      )
      setHoles(updatedHoles)

      // Update or insert hole score in database
      const { data: existingScore } = await supabase
        .from('golf_hole_scores')
        .select('*')
        .eq('scorecard_id', scorecard.id)
        .eq('hole_id', hole.id)
        .single()

      const updateData = existingScore 
        ? { [field === 'score' ? 'strokes' : 'putts']: value }
        : {
            scorecard_id: scorecard.id,
            hole_id: hole.id,
            [field === 'score' ? 'strokes' : 'putts']: value
          }

      if (existingScore) {
        await supabase
          .from('golf_hole_scores')
          .update(updateData)
          .eq('id', existingScore.id)
      } else {
        await supabase
          .from('golf_hole_scores')
          .insert(updateData)
      }

      // Calculate and update total score
      const totalScore = updatedHoles.reduce((sum, h) => sum + (h.score || 0), 0)
      if (totalScore > 0) {
        await supabase
          .from('golf_scorecards')
          .update({ total_score: totalScore })
          .eq('id', scorecard.id)

        onScoreUpdate?.(totalScore)
      }

    } catch (error) {
      console.error('Error updating hole score:', error)
    } finally {
      setSaving(false)
    }
  }

  const getYardageForTee = (hole: HoleData | null | undefined): number => {
    if (!hole) return 0
    
    switch (teeSelection) {
      case 'fuzzy': return hole.yardage_fuzzy || 0
      case 'white': return hole.yardage_white || 0
      case 'gray': return hole.yardage_gray || 0
      case 'red': return hole.yardage_red || 0
      default: return hole.yardage_white || 0
    }
  }

  const calculateScore = (holes: HoleData[], nine: 'front' | 'back') => {
    const startHole = nine === 'front' ? 1 : 10
    const endHole = nine === 'front' ? 9 : 18
    
    return holes
      .filter(h => h.hole_number >= startHole && h.hole_number <= endHole)
      .reduce((sum, h) => sum + (h.score || 0), 0)
  }

  const calculatePar = (holes: HoleData[], nine: 'front' | 'back') => {
    const startHole = nine === 'front' ? 1 : 10
    const endHole = nine === 'front' ? 9 : 18
    
    return holes
      .filter(h => h.hole_number >= startHole && h.hole_number <= endHole)
      .reduce((sum, h) => sum + h.par, 0)
  }

  const getScoreType = (score: number, par: number) => {
    const diff = score - par
    if (diff <= -3) return { type: 'albatross', symbol: '⚪', color: '#4CAF50', bgColor: '#E8F5E8' }
    if (diff === -2) return { type: 'eagle', symbol: '⚫', color: '#2E7D32', bgColor: '#E8F5E8' }
    if (diff === -1) return { type: 'birdie', symbol: '○', color: '#388E3C', bgColor: '#E8F5E8' }
    if (diff === 0) return { type: 'par', symbol: '■', color: '#1976D2', bgColor: '#E3F2FD' }
    if (diff === 1) return { type: 'bogey', symbol: '□', color: '#F57C00', bgColor: '#FFF3E0' }
    if (diff === 2) return { type: 'double bogey', symbol: '□□', color: '#D84315', bgColor: '#FFEBEE' }
    return { type: 'triple+', symbol: '□□□', color: '#C62828', bgColor: '#FFEBEE' }
  }

  const handleScoreClick = (hole: HoleData) => {
    setScoreDialog({ open: true, hole })
  }

  const handleScoreSelect = (score: number) => {
    if (scoreDialog.hole) {
      updateHoleScore(scoreDialog.hole.hole_number, 'score', score)
      setScoreDialog({ open: false, hole: null })
    }
  }

  const frontNineHoles = holes.filter(h => h.hole_number <= 9)
  const backNineHoles = holes.filter(h => h.hole_number >= 10)
  const displayHoles = tabValue === 0 ? frontNineHoles : backNineHoles

  const frontScore = calculateScore(holes, 'front')
  const backScore = calculateScore(holes, 'back')
  const totalScore = frontScore + backScore

  if (loading) {
    return (
      <Card>
        <CardContent>
          <Box display="flex" justifyContent="center" alignItems="center" minHeight={200}>
            <Typography>Loading scorecard...</Typography>
          </Box>
        </CardContent>
      </Card>
    )
  }

  return (
    <Card sx={{ maxWidth: '100%', mx: 'auto' }}>
      <CardContent>
        {/* Header */}
        <Box sx={{ mb: 3 }}>
          <Box display="flex" alignItems="center" justifyContent="space-between" mb={2}>
            <Box display="flex" alignItems="center" gap={1}>
              <GolfCourse sx={{ color: '#1b5e20', fontSize: 28 }} />
              <Typography variant="h5" component="h2" sx={{ fontWeight: 700, color: '#1b5e20' }}>
                Champions Pointe
              </Typography>
            </Box>
            <Chip 
              icon={<EmojiEvents />}
              label={totalScore > 0 ? `Score: ${totalScore}` : 'Start Round'}
              color={totalScore > 0 ? 'success' : 'default'}
              variant="outlined"
            />
          </Box>

          <Typography variant="body1" color="text.secondary" gutterBottom>
            {attendeeName} • {new Date().toLocaleDateString()}
          </Typography>

          {/* Tee Selection */}
          <FormControl size="small" sx={{ minWidth: 120, mb: 2 }}>
            <InputLabel>Tee</InputLabel>
            <Select
              value={teeSelection}
              label="Tee"
              onChange={(e) => setTeeSelection(e.target.value as any)}
            >
              {Object.entries(TEE_LABELS).map(([value, label]) => (
                <MenuItem key={value} value={value}>
                  <Box display="flex" alignItems="center" gap={1}>
                    <Box
                      sx={{
                        width: 12,
                        height: 12,
                        borderRadius: '50%',
                        backgroundColor: TEE_COLORS[value as keyof typeof TEE_COLORS],
                        border: value === 'white' ? '1px solid #ddd' : 'none'
                      }}
                    />
                    {label}
                  </Box>
                </MenuItem>
              ))}
            </Select>
          </FormControl>
        </Box>

        {/* Tabs for Front/Back Nine */}
        <Tabs value={tabValue} onChange={(e, newValue) => setTabValue(newValue)} sx={{ mb: 3 }}>
          <Tab 
            label={`Front 9 (${frontScore || 0})`} 
            sx={{ fontWeight: frontScore > 0 ? 700 : 400 }}
          />
          <Tab 
            label={`Back 9 (${backScore || 0})`}
            sx={{ fontWeight: backScore > 0 ? 700 : 400 }}
          />
        </Tabs>

        {/* Scorecard Grid */}
        <Box sx={{ overflowX: 'auto', mb: 3 }}>
          <Box sx={{ minWidth: 800 }}>
            {/* Header Row */}
            <Grid container spacing={0} sx={{ 
              backgroundColor: '#1b5e20', 
              color: 'white'
            }}>
              <Grid size={1} sx={{ 
                border: '1px solid rgba(255,255,255,0.3)',
                padding: 1.5,
                textAlign: 'center'
              }}>
                <Typography variant="body1" fontWeight={700} sx={{ color: 'white', fontSize: '1rem' }}>
                  Hole
                </Typography>
              </Grid>
              {displayHoles.map(hole => (
                <Grid size={1} key={hole.id} sx={{ 
                  border: '1px solid rgba(255,255,255,0.3)',
                  padding: 1.5,
                  textAlign: 'center'
                }}>
                  <Typography variant="body1" fontWeight={700} sx={{ color: 'white', fontSize: '1.1rem' }}>
                    {hole.hole_number}
                  </Typography>
                </Grid>
              ))}
              <Grid size={1} sx={{ 
                border: '1px solid rgba(255,255,255,0.3)',
                padding: 1.5,
                textAlign: 'center'
              }}>
                <Typography variant="body1" fontWeight={700} sx={{ color: 'white', fontSize: '1rem' }}>
                  {tabValue === 0 ? 'Out' : 'In'}
                </Typography>
              </Grid>
            </Grid>

            {/* Yardage Row */}
            <Grid container spacing={0} sx={{ backgroundColor: '#f5f5f5' }}>
              <Grid size={1} sx={{ border: '1px solid #ddd', padding: 1, textAlign: 'center' }}>
                <Typography variant="body2" fontWeight={600}>Yards</Typography>
              </Grid>
              {displayHoles.map(hole => (
                <Grid size={1} key={hole.id} sx={{ border: '1px solid #ddd', padding: 1, textAlign: 'center' }}>
                  <Typography variant="body2">
                    {getYardageForTee(hole)}
                  </Typography>
                </Grid>
              ))}
              <Grid size={1} sx={{ border: '1px solid #ddd', padding: 1, textAlign: 'center' }}>
                <Typography variant="body2" fontWeight={600}>
                  {displayHoles.reduce((sum, h) => sum + (getYardageForTee(h) || 0), 0)}
                </Typography>
              </Grid>
            </Grid>

            {/* Par Row */}
            <Grid container spacing={0} sx={{ backgroundColor: '#e8f5e8' }}>
              <Grid size={1} sx={{ border: '1px solid #ddd', padding: 1, textAlign: 'center' }}>
                <Typography variant="body2" fontWeight={600}>Par</Typography>
              </Grid>
              {displayHoles.map(hole => (
                <Grid size={1} key={hole.id} sx={{ border: '1px solid #ddd', padding: 1, textAlign: 'center' }}>
                  <Typography variant="body2" fontWeight={700}>
                    {hole.par}
                  </Typography>
                </Grid>
              ))}
              <Grid size={1} sx={{ border: '1px solid #ddd', padding: 1, textAlign: 'center' }}>
                <Typography variant="body2" fontWeight={700}>
                  {calculatePar(holes, tabValue === 0 ? 'front' : 'back')}
                </Typography>
              </Grid>
            </Grid>

            {/* Handicap Row */}
            <Grid container spacing={0} sx={{ backgroundColor: '#f9f9f9' }}>
              <Grid size={1} sx={{ border: '1px solid #ddd', padding: 1, textAlign: 'center' }}>
                <Typography variant="body2" fontWeight={600}>HCP</Typography>
              </Grid>
              {displayHoles.map(hole => (
                <Grid size={1} key={hole.id} sx={{ border: '1px solid #ddd', padding: 1, textAlign: 'center' }}>
                  <Typography variant="body2">
                    {hole.handicap}
                  </Typography>
                </Grid>
              ))}
              <Grid size={1} sx={{ border: '1px solid #ddd', padding: 1, textAlign: 'center' }}>
                <Typography variant="body2">-</Typography>
              </Grid>
            </Grid>

            {/* Score Row */}
            <Grid container spacing={0} sx={{ backgroundColor: 'white' }}>
              <Grid size={1} sx={{ border: '2px solid #1b5e20', padding: 2, textAlign: 'center' }}>
                <Typography variant="body1" fontWeight={700} color="#1b5e20" sx={{ fontSize: '1rem' }}>
                  Score
                </Typography>
              </Grid>
              {displayHoles.map(hole => {
                const scoreType = hole.score ? getScoreType(hole.score, hole.par) : null
                return (
                  <Grid size={1} key={hole.id} sx={{ border: '2px solid #1b5e20', padding: 1, textAlign: 'center' }}>
                    <Box 
                      onClick={() => handleScoreClick(hole)}
                      sx={{
                        minHeight: 60,
                        display: 'flex',
                        flexDirection: 'column',
                        alignItems: 'center',
                        justifyContent: 'center',
                        cursor: 'pointer',
                        borderRadius: 2,
                        backgroundColor: scoreType?.bgColor || '#f8f9fa',
                        border: `2px solid ${scoreType?.color || '#dee2e6'}`,
                        transition: 'all 0.2s ease',
                        '&:hover': {
                          backgroundColor: scoreType?.color || '#1b5e20',
                          color: 'white',
                          transform: 'scale(1.05)',
                          boxShadow: '0 4px 12px rgba(0,0,0,0.15)'
                        }
                      }}
                    >
                      {hole.score ? (
                        <>
                          <Typography variant="h6" fontWeight={700} sx={{ 
                            color: scoreType?.color,
                            fontSize: '1.5rem',
                            lineHeight: 1
                          }}>
                            {hole.score}
                          </Typography>
                          <Typography variant="caption" sx={{ 
                            color: scoreType?.color,
                            fontSize: '1.2rem',
                            lineHeight: 1,
                            mt: 0.5
                          }}>
                            {scoreType?.symbol}
                          </Typography>
                          <Typography variant="caption" sx={{ 
                            color: scoreType?.color,
                            fontSize: '0.7rem',
                            fontWeight: 600,
                            textTransform: 'uppercase'
                          }}>
                            {scoreType?.type}
                          </Typography>
                        </>
                      ) : (
                        <Typography variant="body2" color="text.secondary" sx={{ fontWeight: 500 }}>
                          Tap to<br/>Score
                        </Typography>
                      )}
                      
                      {hole.notes && (
                        <Notes sx={{ fontSize: 12, color: scoreType?.color || '#666', mt: 0.5 }} />
                      )}
                    </Box>
                  </Grid>
                )
              })}
              <Grid size={1} sx={{ border: '2px solid #1b5e20', padding: 2, textAlign: 'center' }}>
                <Typography variant="h6" fontWeight={700} color="#1b5e20" sx={{ fontSize: '1.3rem' }}>
                  {calculateScore(holes, tabValue === 0 ? 'front' : 'back') || 0}
                </Typography>
              </Grid>
            </Grid>
          </Box>
        </Box>

        {/* Score Summary */}
        {(frontScore > 0 || backScore > 0) && (
          <Alert severity="success" sx={{ mb: 2 }}>
            <Typography variant="body2">
              <strong>Current Score:</strong> Front 9: {frontScore || 0} • Back 9: {backScore || 0} • Total: {totalScore}
              {totalScore > 0 && course && (
                <> • {totalScore - course.par_total > 0 ? '+' : ''}{totalScore - course.par_total} (vs Par {course.par_total})</>
              )}
            </Typography>
          </Alert>
        )}

        {/* Action Buttons */}
        <Box display="flex" gap={2} justifyContent="center" flexWrap="wrap">
          <Button
            variant="outlined"
            startIcon={<Notes />}
            onClick={() => setNotesDialog({ open: true, holeNumber: currentHole })}
            size="small"
          >
            Add Notes
          </Button>
          
          {totalScore === (course?.par_total || 72) + 18 && (
            <Button
              variant="contained"
              color="success"
              startIcon={<EmojiEvents />}
              size="small"
            >
              Round Complete!
            </Button>
          )}
        </Box>

        {/* Score Selection Dialog */}
        <Dialog 
          open={scoreDialog.open} 
          onClose={() => setScoreDialog({ open: false, hole: null })}
          maxWidth="sm"
          fullWidth
        >
          <DialogTitle sx={{ textAlign: 'center', pb: 1 }}>
            <Box display="flex" alignItems="center" justifyContent="center" gap={2}>
              <GolfCourse sx={{ color: '#1b5e20' }} />
              <Box>
                <Typography variant="h6" fontWeight={700}>
                  Hole {scoreDialog.hole?.hole_number}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  Par {scoreDialog.hole?.par} • {scoreDialog.hole ? getYardageForTee(scoreDialog.hole) : 0} yards
                </Typography>
              </Box>
            </Box>
          </DialogTitle>
          
          <DialogContent sx={{ pt: 2 }}>
            <Box display="grid" gridTemplateColumns="repeat(auto-fit, minmax(100px, 1fr))" gap={2}>
              {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map(score => {
                if (!scoreDialog.hole) return null
                const scoreType = getScoreType(score, scoreDialog.hole.par)
                return (
                  <Box
                    key={score}
                    onClick={() => handleScoreSelect(score)}
                    sx={{
                      p: 2,
                      textAlign: 'center',
                      cursor: 'pointer',
                      borderRadius: 3,
                      border: `2px solid ${scoreType.color}`,
                      backgroundColor: scoreType.bgColor,
                      transition: 'all 0.2s ease',
                      '&:hover': {
                        backgroundColor: scoreType.color,
                        color: 'white',
                        transform: 'scale(1.05)',
                        boxShadow: '0 6px 20px rgba(0,0,0,0.15)'
                      }
                    }}
                  >
                    <Typography variant="h5" fontWeight={700} sx={{ 
                      color: scoreType.color,
                      lineHeight: 1
                    }}>
                      {score}
                    </Typography>
                    <Typography variant="body1" sx={{ 
                      color: scoreType.color,
                      fontSize: '1.5rem',
                      lineHeight: 1,
                      my: 0.5
                    }}>
                      {scoreType.symbol}
                    </Typography>
                    <Typography variant="caption" sx={{ 
                      color: scoreType.color,
                      fontSize: '0.8rem',
                      fontWeight: 600,
                      textTransform: 'uppercase'
                    }}>
                      {scoreType.type}
                    </Typography>
                  </Box>
                )
              })}
            </Box>
          </DialogContent>
          
          <DialogActions sx={{ justifyContent: 'center', pb: 3 }}>
            <Button 
              onClick={() => setScoreDialog({ open: false, hole: null })} 
              variant="outlined"
              sx={{ minWidth: 100 }}
            >
              Cancel
            </Button>
            {scoreDialog.hole?.score && (
              <Button 
                onClick={() => {
                  if (scoreDialog.hole) {
                    // Clear the score by setting to undefined
                    const updatedHoles = holes.map(h => 
                      h.hole_number === scoreDialog.hole!.hole_number 
                        ? { ...h, score: undefined }
                        : h
                    )
                    setHoles(updatedHoles)
                    setScoreDialog({ open: false, hole: null })
                  }
                }}
                variant="outlined" 
                color="error"
                sx={{ minWidth: 100 }}
              >
                Clear Score
              </Button>
            )}
          </DialogActions>
        </Dialog>
      </CardContent>
    </Card>
  )
}