import { NextRequest, NextResponse } from 'next/server'
import { getAuthSession, setAuthSession } from '@/lib/auth'

export async function POST(request: NextRequest) {
  try {
    const session = await getAuthSession()
    
    if (!session || session.role !== 'attendee') {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      )
    }

    const { attendeeId, attendeeName } = await request.json()

    if (!attendeeId || !attendeeName) {
      return NextResponse.json(
        { error: 'Attendee ID and name are required' },
        { status: 400 }
      )
    }

    await setAuthSession({
      ...session,
      attendeeId,
      attendeeName
    })

    return NextResponse.json({ success: true })
  } catch (error) {
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}