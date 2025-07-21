import { cookies } from 'next/headers'
import { NextRequest } from 'next/server'

const ATTENDEE_PASSWORD = process.env.ATTENDEE_PASSWORD || 'bach2024'
const ADMIN_PASSWORD = process.env.ADMIN_PASSWORD || 'adminbach2024'

export type AuthRole = 'attendee' | 'admin' | null

export interface AuthSession {
  role: AuthRole
  attendeeId?: string
  attendeeName?: string
}

export async function verifyPassword(password: string): Promise<AuthRole> {
  if (password === ADMIN_PASSWORD) {
    return 'admin'
  } else if (password === ATTENDEE_PASSWORD) {
    return 'attendee'
  }
  return null
}

export async function setAuthSession(session: AuthSession) {
  const cookieStore = await cookies()
  cookieStore.set('auth-session', JSON.stringify(session), {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax',
    maxAge: 60 * 60 * 24 * 7, // 7 days
  })
}

export async function getAuthSession(): Promise<AuthSession | null> {
  const cookieStore = await cookies()
  const sessionCookie = cookieStore.get('auth-session')
  
  if (!sessionCookie) {
    return null
  }
  
  try {
    return JSON.parse(sessionCookie.value)
  } catch {
    return null
  }
}

export async function clearAuthSession() {
  const cookieStore = await cookies()
  cookieStore.delete('auth-session')
}

export function isAuthenticated(session: AuthSession | null): boolean {
  return session !== null && session.role !== null
}

export function isAdmin(session: AuthSession | null): boolean {
  return session?.role === 'admin'
}

export function requireAuth(session: AuthSession | null): void {
  if (!isAuthenticated(session)) {
    throw new Error('Authentication required')
  }
}

export function requireAdmin(session: AuthSession | null): void {
  if (!isAdmin(session)) {
    throw new Error('Admin access required')
  }
}