import { Attendee } from '@/lib/types'

interface AttendeeCardProps {
  attendee: Attendee
  isCurrentUser?: boolean
}

export default function AttendeeCard({ attendee, isCurrentUser = false }: AttendeeCardProps) {
  return (
    <div className={`bg-white rounded-lg shadow border p-6 ${
      isCurrentUser ? 'ring-2 ring-primary-500 bg-primary-50' : ''
    }`}>
      <div className="text-center">
        <div className="mx-auto flex items-center justify-center h-20 w-20 rounded-full bg-gray-300 mb-4">
          <span className="text-2xl font-medium text-gray-700">
            {attendee.name.split(' ').map(n => n[0]).join('')}
          </span>
        </div>
        
        <h3 className="text-lg font-medium text-gray-900">
          {attendee.name}
          {isCurrentUser && (
            <span className="ml-2 inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-primary-100 text-primary-800">
              You
            </span>
          )}
        </h3>
        
        <div className="mt-4 space-y-2">
          {attendee.phone && (
            <div className="flex items-center justify-center space-x-2">
              <span className="text-lg">📞</span>
              <a 
                href={`tel:${attendee.phone}`}
                className="text-primary-600 hover:text-primary-700 text-sm"
              >
                {attendee.phone}
              </a>
            </div>
          )}
          
          {attendee.golf_handicap !== null && attendee.golf_handicap !== undefined && (
            <div className="flex items-center justify-center space-x-2">
              <span className="text-lg">⛳</span>
              <span className="text-sm text-gray-600">
                Handicap: {attendee.golf_handicap}
              </span>
            </div>
          )}
          
          {attendee.venmo_handle && (
            <div className="flex items-center justify-center space-x-2">
              <span className="text-lg">💰</span>
              <button
                onClick={() => navigator.clipboard.writeText(attendee.venmo_handle!)}
                className="text-primary-600 hover:text-primary-700 text-sm"
                title="Click to copy Venmo handle"
              >
                {attendee.venmo_handle}
              </button>
            </div>
          )}
          
          {attendee.dietary_restrictions && (
            <div className="flex items-center justify-center space-x-2">
              <span className="text-lg">🥗</span>
              <span className="text-sm text-gray-600">{attendee.dietary_restrictions}</span>
            </div>
          )}
          
          {attendee.emergency_contact && (
            <div className="flex items-center justify-center space-x-2">
              <span className="text-lg">🆘</span>
              <span className="text-sm text-gray-600">{attendee.emergency_contact}</span>
            </div>
          )}
        </div>
        
        {(attendee.arrival_time || attendee.departure_time) && (
          <div className="mt-4 pt-4 border-t border-gray-200">
            <div className="text-sm text-gray-600 space-y-1">
              {attendee.arrival_time && (
                <div>
                  <span className="font-medium">Arriving:</span> {' '}
                  {new Date(attendee.arrival_time).toLocaleString('en-US', {
                    weekday: 'short',
                    month: 'short', 
                    day: 'numeric',
                    hour: 'numeric',
                    minute: '2-digit'
                  })}
                </div>
              )}
              {attendee.departure_time && (
                <div>
                  <span className="font-medium">Departing:</span> {' '}
                  {new Date(attendee.departure_time).toLocaleString('en-US', {
                    weekday: 'short',
                    month: 'short',
                    day: 'numeric', 
                    hour: 'numeric',
                    minute: '2-digit'
                  })}
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  )
}