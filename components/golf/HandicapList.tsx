import { Attendee } from '@/lib/types'

interface HandicapListProps {
  attendees: Attendee[]
}

export default function HandicapList({ attendees }: HandicapListProps) {
  const golfers = attendees
    .filter(a => a.golf_handicap !== null && a.golf_handicap !== undefined)
    .sort((a, b) => (a.golf_handicap || 0) - (b.golf_handicap || 0))

  if (golfers.length === 0) {
    return null
  }

  const getSkillLevel = (handicap: number) => {
    if (handicap <= 5) return { label: 'Expert', color: 'text-red-600 bg-red-50' }
    if (handicap <= 10) return { label: 'Advanced', color: 'text-orange-600 bg-orange-50' }
    if (handicap <= 18) return { label: 'Intermediate', color: 'text-yellow-600 bg-yellow-50' }
    return { label: 'Beginner', color: 'text-green-600 bg-green-50' }
  }

  return (
    <div className="bg-white rounded-lg shadow border p-6">
      <h3 className="text-lg font-semibold text-gray-900 mb-4">
        Player Handicaps
      </h3>
      
      <div className="space-y-3">
        {golfers.map((golfer) => {
          const skillLevel = getSkillLevel(golfer.golf_handicap!)
          
          return (
            <div key={golfer.id} className="flex items-center justify-between py-2">
              <div className="flex items-center space-x-3">
                <div className="flex items-center justify-center w-8 h-8 bg-gray-300 rounded-full">
                  <span className="text-sm font-medium text-gray-700">
                    {golfer.name.split(' ').map(n => n[0]).join('')}
                  </span>
                </div>
                <span className="font-medium text-gray-900">{golfer.name}</span>
              </div>
              
              <div className="flex items-center space-x-3">
                <span className={`px-2 py-1 rounded-full text-xs font-medium ${skillLevel.color}`}>
                  {skillLevel.label}
                </span>
                <span className="text-lg font-bold text-gray-700">
                  {golfer.golf_handicap}
                </span>
              </div>
            </div>
          )
        })}
      </div>

      <div className="mt-6 pt-4 border-t border-gray-100">
        <div className="text-sm text-gray-600">
          <p><strong>Average:</strong> {Math.round(golfers.reduce((sum, g) => sum + (g.golf_handicap || 0), 0) / golfers.length)}</p>
          <p><strong>Range:</strong> {Math.min(...golfers.map(g => g.golf_handicap || 0))} - {Math.max(...golfers.map(g => g.golf_handicap || 0))}</p>
        </div>
      </div>
    </div>
  )
}