import { NextRequest, NextResponse } from 'next/server'
import { verifyPassword, setAuthSession } from '@/lib/auth'

export async function POST(request: NextRequest) {
  try {
    const { password, role } = await request.json()

    const verifiedRole = await verifyPassword(password)

    if (!verifiedRole || verifiedRole !== role) {
      return NextResponse.json(
        { error: 'Invalid password' },
        { status: 401 }
      )
    }

    await setAuthSession({ role: verifiedRole })

    return NextResponse.json({ success: true, role: verifiedRole })
  } catch (error) {
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}