import { NextRequest, NextResponse } from 'next/server'
import { verifyPassword, setAuthSession } from '@/lib/auth'

export async function POST(request: NextRequest) {
  try {
    const { password, role } = await request.json()

    const verifiedRole = await verifyPassword(password)

    if (!verifiedRole) {
      return NextResponse.json(
        { error: 'Invalid password' },
        { status: 401 }
      )
    }

    // If role is provided, verify it matches the password
    if (role && verifiedRole !== role) {
      return NextResponse.json(
        { error: 'Invalid password' },
        { status: 401 }
      )
    }

    await setAuthSession({ role: verifiedRole })

    return NextResponse.json({ success: true, role: verifiedRole })
  } catch (error) {
    console.error('Login API error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}