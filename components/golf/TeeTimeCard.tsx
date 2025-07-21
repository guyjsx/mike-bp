import { GolfRound } from '@/lib/types'

interface TeeTimeCardProps {
  round: GolfRound
}

export default function TeeTimeCard({ round }: TeeTimeCardProps) {
  const formatDate = (dateString: string) => {
    const date = new Date(dateString)
    return date.toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric' })
  }

  const formatTime = (timeString: string) => {
    const [hours, minutes] = timeString.split(':')
    const hour = parseInt(hours)
    const ampm = hour >= 12 ? 'PM' : 'AM'
    const displayHour = hour % 12 || 12
    return `${displayHour}:${minutes} ${ampm}`
  }

  return (
    <div className="bg-white rounded-lg shadow border p-6">
      <div className="flex items-start justify-between mb-4">
        <div>
          <h3 className="text-xl font-bold text-gray-900">{round.course_name}</h3>
          <p className="text-gray-600">{formatDate(round.day)}</p>
        </div>
        <div className="text-right">
          <div className="text-2xl font-bold text-primary-600">
            {formatTime(round.tee_time)}
          </div>
          <p className="text-sm text-gray-500">Tee Time</p>
        </div>
      </div>

      {round.course_address && (
        <div className="flex items-start mb-3">
          <span className="text-lg mr-2 mt-0.5">📍</span>
          <div>
            <p className="text-gray-700">{round.course_address}</p>
          </div>
        </div>
      )}

      {round.course_phone && (
        <div className="flex items-center mb-3">
          <span className="text-lg mr-2">📞</span>
          <a 
            href={`tel:${round.course_phone}`}
            className="text-primary-600 hover:text-primary-700 font-medium"
          >
            {round.course_phone}
          </a>
        </div>
      )}

      {round.dress_code && (
        <div className="flex items-start mb-3">
          <span className="text-lg mr-2 mt-0.5">👔</span>
          <p className="text-gray-700">{round.dress_code}</p>
        </div>
      )}

      {round.notes && (
        <div className="mt-4 pt-4 border-t border-gray-100">
          <p className="text-gray-600">{round.notes}</p>
        </div>
      )}
    </div>
  )
}