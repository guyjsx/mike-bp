'use client'

import { useState } from 'react'

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
    <div className="bg-white rounded-lg shadow border p-6">
      <h3 className="text-lg font-semibold text-gray-900 mb-4">
        Golf Games & Rules
      </h3>
      
      <div className="space-y-4">
        {games.map((game) => {
          const isExpanded = expandedGame === game.name
          
          return (
            <div key={game.name} className="border border-gray-200 rounded-lg">
              <button
                onClick={() => toggleGame(game.name)}
                className="w-full px-4 py-3 text-left hover:bg-gray-50 rounded-lg transition-colors"
              >
                <div className="flex items-center justify-between">
                  <div>
                    <h4 className="font-medium text-gray-900">{game.name}</h4>
                    <p className="text-sm text-gray-600 mt-1">{game.description}</p>
                  </div>
                  <span className="text-gray-400">
                    {isExpanded ? '−' : '+'}
                  </span>
                </div>
              </button>
              
              {isExpanded && (
                <div className="px-4 pb-4 border-t border-gray-100">
                  <div className="mt-3">
                    <h5 className="font-medium text-gray-900 mb-2">Rules:</h5>
                    <ul className="space-y-1 text-sm text-gray-600">
                      {game.rules.map((rule, index) => (
                        <li key={index} className="flex items-start">
                          <span className="mr-2">•</span>
                          <span>{rule}</span>
                        </li>
                      ))}
                    </ul>
                    
                    <div className="mt-3 p-2 bg-green-50 rounded border">
                      <p className="text-sm">
                        <strong className="text-green-800">Suggested bet:</strong> 
                        <span className="text-green-700 ml-1">{game.suggestedBet}</span>
                      </p>
                    </div>
                  </div>
                </div>
              )}
            </div>
          )
        })}
      </div>

      <div className="mt-6 p-4 bg-blue-50 rounded-lg border border-blue-200">
        <h4 className="font-medium text-blue-900 mb-2">💡 Pro Tips</h4>
        <ul className="text-sm text-blue-800 space-y-1">
          <li>• Keep games simple and fun - don&apos;t let money ruin friendships!</li>
          <li>• Agree on rules and handicap strokes before teeing off</li>
          <li>• Consider playing multiple games simultaneously</li>
          <li>• Have someone designated to track scores and bets</li>
        </ul>
      </div>
    </div>
  )
}