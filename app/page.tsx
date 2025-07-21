import { redirect } from 'next/navigation'
import { getAuthSession } from '@/lib/auth'

export default async function HomePage() {
  const session = await getAuthSession()
  
  if (!session || !session.role) {
    redirect('/login')
  }
  
  if (session.role === 'attendee' && !session.attendeeId) {
    redirect('/select-attendee')
  }
  
  redirect('/dashboard')
}