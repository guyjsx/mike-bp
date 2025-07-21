import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

export function middleware(request: NextRequest) {
  const pathname = request.nextUrl.pathname
  
  // Public routes that don't require authentication
  const publicRoutes = ['/login', '/api/auth/login']
  
  // Admin-only routes
  const adminRoutes = ['/admin']
  
  // Check if it's a public route
  if (publicRoutes.some(route => pathname.startsWith(route))) {
    return NextResponse.next()
  }
  
  // Get auth session from cookie
  const sessionCookie = request.cookies.get('auth-session')
  
  if (!sessionCookie) {
    // Redirect to login if no session
    return NextResponse.redirect(new URL('/login', request.url))
  }
  
  try {
    const session = JSON.parse(sessionCookie.value)
    
    // Check if route requires admin access
    if (adminRoutes.some(route => pathname.startsWith(route))) {
      if (session.role !== 'admin') {
        return NextResponse.redirect(new URL('/dashboard', request.url))
      }
    }
    
    // Check if attendee needs to select their name
    if (session.role === 'attendee' && !session.attendeeId && pathname !== '/select-attendee' && !pathname.startsWith('/api/auth')) {
      return NextResponse.redirect(new URL('/select-attendee', request.url))
    }
    
    return NextResponse.next()
  } catch {
    // Invalid session, redirect to login
    return NextResponse.redirect(new URL('/login', request.url))
  }
}

export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     * - public folder
     */
    '/((?!_next/static|_next/image|favicon.ico|public).*)',
  ],
}