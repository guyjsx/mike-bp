import { getAuthSession } from '@/lib/auth'
import { createClient } from '@/lib/supabase/server'
import { Typography, Box, Grid, Card, CardContent, List, ListItem, ListItemIcon, ListItemText } from '@mui/material'
import { Phone, Directions } from '@mui/icons-material'
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
    <Box sx={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
      <Typography variant="h3" component="h1" sx={{ fontWeight: 700, color: 'text.primary' }}>
        Welcome{session?.attendeeName ? `, ${session.attendeeName}` : ''}!
      </Typography>

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

      <Grid container spacing={3}>
        <Grid item xs={12} lg={6}>
          <UpcomingEvents 
            events={events || []} 
            attendeeId={session?.attendeeId}
          />
        </Grid>
        
        <Grid item xs={12} lg={6}>
          <Card>
            <CardContent sx={{ p: 3 }}>
              <Typography variant="h6" sx={{ fontWeight: 600, mb: 2 }}>
                Quick Links
              </Typography>
              <List sx={{ p: 0 }}>
                <ListItem
                  component="a"
                  href={`tel:${process.env.NEXT_PUBLIC_HOTEL_PHONE || '(812) 969-5000'}`}
                  sx={{
                    bgcolor: 'grey.50',
                    borderRadius: 2,
                    mb: 1,
                    textDecoration: 'none',
                    color: 'inherit',
                    '&:hover': {
                      bgcolor: 'grey.100'
                    }
                  }}
                >
                  <ListItemIcon>
                    <Phone color="primary" />
                  </ListItemIcon>
                  <ListItemText 
                    primary="Call Hotel" 
                    primaryTypographyProps={{ fontWeight: 600 }}
                  />
                </ListItem>
                
                <ListItem
                  component="a"
                  href={process.env.NEXT_PUBLIC_HOTEL_MAP_LINK || 'https://maps.google.com'}
                  target="_blank"
                  rel="noopener noreferrer"
                  sx={{
                    bgcolor: 'grey.50',
                    borderRadius: 2,
                    textDecoration: 'none',
                    color: 'inherit',
                    '&:hover': {
                      bgcolor: 'grey.100'
                    }
                  }}
                >
                  <ListItemIcon>
                    <Directions color="primary" />
                  </ListItemIcon>
                  <ListItemText 
                    primary="Hotel Directions" 
                    primaryTypographyProps={{ fontWeight: 600 }}
                  />
                </ListItem>
              </List>
            </CardContent>
          </Card>
        </Grid>
      </Grid>
    </Box>
  )
}