'use client'

import { useState } from 'react'
import { Card, CardContent, Typography, Box, Accordion, AccordionSummary, AccordionDetails, List, ListItem, ListItemText, Alert } from '@mui/material'
import { ExpandMore, LightbulbOutlined, Casino } from '@mui/icons-material'

export default function GolfGamesRules() {
  const [expandedGame, setExpandedGame] = useState<string | null>(null)

  const games = [
    {
      name: 'Nassau',
      description: 'Classic three-way bet: front 9, back 9, and overall 18',
      rules: [
        'Each player pays $5 for front 9, back 9, and total 18',
        'Winner of each segment takes the pot for that segment',
        'If someone wins all three, they get a bonus',
        'Press bets available when down by 2 holes'
      ],
      suggestedBet: '$5 per segment'
    },
    {
      name: 'Wolf',
      description: 'Rotating team game where each hole has a designated "Wolf"',
      rules: [
        'Players tee off in predetermined order',
        'Wolf watches others tee off and chooses partner OR goes alone',
        'If Wolf goes alone and wins, gets 3 points; if loses, others get 1 each',
        'If Wolf picks partner and team wins, they get 2 points each',
        'Order rotates each hole'
      ],
      suggestedBet: '$1 per point'
    },
    {
      name: 'Skins',
      description: 'Win the hole outright to win the "skin" and the money',
      rules: [
        'Lowest score on hole wins the skin',
        'If multiple players tie for low, skin carries over',
        'Carried skins accumulate until someone wins outright',
        'Big potential payouts on holes with multiple carryovers'
      ],
      suggestedBet: '$2 per hole'
    },
    {
      name: 'Best Ball',
      description: 'Team format using the best score from each team on every hole',
      rules: [
        'Form two teams of equal skill level',
        'Each player plays their own ball',
        'Team score = lowest score between partners on each hole',
        'Compare team scores hole by hole'
      ],
      suggestedBet: '$10 per team'
    }
  ]

  const toggleGame = (gameName: string) => {
    setExpandedGame(expandedGame === gameName ? null : gameName)
  }

  return (
    <Card>
      <CardContent sx={{ p: 3 }}>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 3 }}>
          <Casino sx={{ color: 'primary.main' }} />
          <Typography variant="h6" sx={{ fontWeight: 600, color: 'text.primary' }}>
            Golf Games & Rules
          </Typography>
        </Box>
        
        <Box sx={{ mb: 3 }}>
          {games.map((game) => {
            const isExpanded = expandedGame === game.name
            
            return (
              <Accordion
                key={game.name}
                expanded={isExpanded}
                onChange={() => toggleGame(game.name)}
                sx={{ mb: 1, '&:before': { display: 'none' } }}
              >
                <AccordionSummary
                  expandIcon={<ExpandMore />}
                  sx={{
                    '& .MuiAccordionSummary-content': {
                      flexDirection: 'column',
                      alignItems: 'flex-start'
                    }
                  }}
                >
                  <Typography variant="subtitle1" sx={{ fontWeight: 600 }}>
                    {game.name}
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    {game.description}
                  </Typography>
                </AccordionSummary>
                
                <AccordionDetails>
                  <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                    <Box>
                      <Typography variant="subtitle2" sx={{ fontWeight: 600, mb: 1 }}>
                        Rules:
                      </Typography>
                      <List dense sx={{ py: 0 }}>
                        {game.rules.map((rule, index) => (
                          <ListItem key={index} sx={{ py: 0.25, px: 0 }}>
                            <ListItemText
                              primary={rule}
                              sx={{
                                '& .MuiListItemText-primary': {
                                  fontSize: '0.875rem',
                                  color: 'text.secondary'
                                }
                              }}
                            />
                          </ListItem>
                        ))}
                      </List>
                    </Box>
                    
                    <Alert
                      severity="success"
                      variant="outlined"
                      sx={{
                        '& .MuiAlert-message': {
                          display: 'flex',
                          alignItems: 'center',
                          gap: 1
                        }
                      }}
                    >
                      <Typography variant="body2">
                        <strong>Suggested bet:</strong> {game.suggestedBet}
                      </Typography>
                    </Alert>
                  </Box>
                </AccordionDetails>
              </Accordion>
            )
          })}
        </Box>

        <Alert
          severity="info"
          icon={<LightbulbOutlined />}
          sx={{ mt: 2 }}
        >
          <Typography variant="subtitle2" sx={{ fontWeight: 600, mb: 1 }}>
            Pro Tips
          </Typography>
          <List dense sx={{ py: 0 }}>
            <ListItem sx={{ py: 0.25, px: 0 }}>
              <ListItemText primary="Keep games simple and fun - don't let money ruin friendships!" />
            </ListItem>
            <ListItem sx={{ py: 0.25, px: 0 }}>
              <ListItemText primary="Agree on rules and handicap strokes before teeing off" />
            </ListItem>
            <ListItem sx={{ py: 0.25, px: 0 }}>
              <ListItemText primary="Consider playing multiple games simultaneously" />
            </ListItem>
            <ListItem sx={{ py: 0.25, px: 0 }}>
              <ListItemText primary="Have someone designated to track scores and bets" />
            </ListItem>
          </List>
        </Alert>
      </CardContent>
    </Card>
  )
}