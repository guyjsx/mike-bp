'use client'

import Link from 'next/link'
import { Room, GolfPairing, ExpensePayment } from '@/lib/types'

interface QuickStatsProps {
  room?: Room
  golfGroups?: GolfPairing[]
  amountOwed?: number
  nextEvent?: {
    title: string
    time: string
  }
}

export default function QuickStats({ room, golfGroups, amountOwed = 0, nextEvent }: QuickStatsProps) {
  const stats = [
    {
      title: 'Your Room',
      value: room ? `Room ${room.room_number}` : 'Not assigned',
      subtext: room ? `${room.attendee_ids.length} people` : '',
      href: '/accommodations',
      icon: '🛏️',
      color: 'bg-blue-50 text-blue-700'
    },
    {
      title: 'Golf Groups',
      value: golfGroups && golfGroups.length > 0 ? `${golfGroups.length} rounds` : 'Not assigned',
      subtext: golfGroups && golfGroups.length > 0 ? 'View pairings' : '',
      href: '/golf',
      icon: '⛳',
      color: 'bg-green-50 text-green-700'
    },
    {
      title: 'Amount Owed',
      value: `$${amountOwed.toFixed(2)}`,
      subtext: 'View breakdown',
      href: '/expenses',
      icon: '💰',
      color: amountOwed > 0 ? 'bg-red-50 text-red-700' : 'bg-gray-50 text-gray-700'
    },
    {
      title: 'Next Event',
      value: nextEvent ? nextEvent.title : 'No upcoming events',
      subtext: nextEvent ? nextEvent.time : '',
      href: '/schedule',
      icon: '📅',
      color: 'bg-purple-50 text-purple-700'
    }
  ]

  return (
    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
      {stats.map((stat) => (
        <Link
          key={stat.title}
          href={stat.href}
          className={`${stat.color} rounded-lg p-6 hover:shadow-md transition-shadow`}
        >
          <div className="flex items-start justify-between">
            <div className="flex-1">
              <p className="text-sm font-medium opacity-80">{stat.title}</p>
              <p className="mt-2 text-xl font-bold">{stat.value}</p>
              {stat.subtext && (
                <p className="mt-1 text-sm opacity-70">{stat.subtext}</p>
              )}
            </div>
            <span className="text-3xl">{stat.icon}</span>
          </div>
        </Link>
      ))}
    </div>
  )
}