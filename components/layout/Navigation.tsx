'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { AuthSession } from '@/lib/auth'
import {
  Dashboard,
  Schedule,
  GolfCourse,
  Hotel,
  AttachMoney,
  People,
  Settings
} from '@mui/icons-material'

interface NavigationProps {
  session: AuthSession
}

export default function Navigation({ session }: NavigationProps) {
  const pathname = usePathname()
  
  const navItems = [
    { href: '/dashboard', label: 'Dashboard', icon: Dashboard },
    { href: '/schedule', label: 'Schedule', icon: Schedule },
    { href: '/golf', label: 'Golf', icon: GolfCourse },
    { href: '/accommodations', label: 'Rooms', icon: Hotel },
    { href: '/expenses', label: 'Expenses', icon: AttachMoney },
    { href: '/people', label: 'People', icon: People },
  ]

  if (session.role === 'admin') {
    navItems.push({ href: '/admin', label: 'Admin', icon: Settings })
  }

  return (
    <>
      {/* Desktop Navigation */}
      <nav className="hidden md:block bg-white shadow-sm border-b border-neutral-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16">
            <div className="flex">
              <div className="flex-shrink-0 flex items-center">
                <div className="flex items-center space-x-2">
                  <GolfCourse className="text-primary-600" fontSize="large" />
                  <h1 className="text-xl font-bold text-neutral-900">
                    {process.env.NEXT_PUBLIC_EVENT_TITLE || 'Golf Weekend'}
                  </h1>
                </div>
              </div>
              <div className="ml-10 flex items-baseline space-x-1">
                {navItems.map((item) => {
                  const isActive = pathname === item.href
                  const IconComponent = item.icon
                  return (
                    <Link
                      key={item.href}
                      href={item.href}
                      className={`inline-flex items-center px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                        isActive
                          ? 'bg-primary-100 text-primary-700'
                          : 'text-neutral-600 hover:bg-neutral-100 hover:text-neutral-900'
                      }`}
                    >
                      <IconComponent className="mr-2" fontSize="small" />
                      {item.label}
                    </Link>
                  )
                })}
              </div>
            </div>
          </div>
        </div>
      </nav>

      {/* Mobile Bottom Navigation */}
      <nav className="md:hidden fixed bottom-0 left-0 right-0 bg-white border-t border-neutral-200 z-10">
        <div className="grid grid-cols-5 gap-1">
          {navItems.slice(0, 5).map((item) => {
            const isActive = pathname === item.href
            const IconComponent = item.icon
            return (
              <Link
                key={item.href}
                href={item.href}
                className={`flex flex-col items-center py-2 px-1 text-xs transition-colors ${
                  isActive
                    ? 'text-primary-600'
                    : 'text-neutral-600'
                }`}
              >
                <IconComponent className="mb-1" fontSize="small" />
                <span className="text-xs">{item.label}</span>
              </Link>
            )
          })}
        </div>
      </nav>
    </>
  )
}