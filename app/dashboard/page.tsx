import { getAuthSession } from '@/lib/auth'
import { createClient } from '@/lib/supabase/server'
import CountdownTimer from '@/components/dashboard/CountdownTimer'
import QuickStats from '@/components/dashboard/QuickStats'
import AnnouncementBanner from '@/components/dashboard/AnnouncementBanner'
import UpcomingEvents from '@/components/dashboard/UpcomingEvents'

export default async function DashboardPage() {
  const session = await getAuthSession()
  const supabase = await createClient()

  // Fetch data for dashboard
  const [
    { data: announcements },
    { data: events },
    { data: rooms },
    { data: expenses },
    { data: payments }
  ] = await Promise.all([
    supabase.from('announcements').select('*').eq('is_active', true),
    supabase.from('events').select('*'),
    supabase.from('rooms').select('*'),
    supabase.from('expenses').select('*'),
    supabase.from('expense_payments').select('*')
  ])

  // Calculate amount owed for attendee
  let amountOwed = 0
  if (session?.attendeeId && payments) {
    amountOwed = payments
      .filter(p => p.from_attendee_id === session.attendeeId && !p.is_paid)
      .reduce((sum, p) => sum + Number(p.amount), 0)
  }

  // Find user's room
  const userRoom = session?.attendeeId && rooms
    ? rooms.find(r => r.attendee_ids.includes(session.attendeeId))
    : null

  // Get next event
  const nextEvent = events && events.length > 0
    ? events
        .filter(e => {
          const eventTime = new Date(`${e.day}T${e.start_time}`)
          return eventTime > new Date()
        })
        .sort((a, b) => {
          const dateA = new Date(`${a.day}T${a.start_time}`)
          const dateB = new Date(`${b.day}T${b.start_time}`)
          return dateA.getTime() - dateB.getTime()
        })[0]
    : null

  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold text-gray-900">
        Welcome{session?.attendeeName ? `, ${session.attendeeName}` : ''}!
      </h1>

      {announcements && announcements.length > 0 && (
        <AnnouncementBanner announcements={announcements} />
      )}

      <CountdownTimer />

      <QuickStats
        room={userRoom}
        amountOwed={amountOwed}
        nextEvent={nextEvent ? {
          title: nextEvent.title,
          time: new Date(`${nextEvent.day}T${nextEvent.start_time}`).toLocaleString()
        } : undefined}
      />

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <UpcomingEvents 
          events={events || []} 
          attendeeId={session?.attendeeId}
        />
        
        <div className="bg-white rounded-lg shadow p-6">
          <h3 className="text-lg font-semibold mb-4">Quick Links</h3>
          <div className="space-y-2">
            <a
              href={`tel:${process.env.NEXT_PUBLIC_HOTEL_PHONE || '(812) 969-5000'}`}
              className="block p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors"
            >
              <span className="text-lg mr-2">📞</span>
              <span className="font-medium">Call Hotel</span>
            </a>
            <a
              href={process.env.NEXT_PUBLIC_HOTEL_MAP_LINK || 'https://maps.google.com'}
              target="_blank"
              rel="noopener noreferrer"
              className="block p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors"
            >
              <span className="text-lg mr-2">🗺️</span>
              <span className="font-medium">Hotel Directions</span>
            </a>
          </div>
        </div>
      </div>
    </div>
  )
}