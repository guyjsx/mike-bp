'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { AuthSession } from '@/lib/auth'

interface NavigationProps {
  session: AuthSession
}

export default function Navigation({ session }: NavigationProps) {
  const pathname = usePathname()
  
  const navItems = [
    { href: '/dashboard', label: 'Dashboard', icon: '🏠' },
    { href: '/schedule', label: 'Schedule', icon: '📅' },
    { href: '/golf', label: 'Golf', icon: '⛳' },
    { href: '/accommodations', label: 'Rooms', icon: '🛏️' },
    { href: '/expenses', label: 'Expenses', icon: '💰' },
    { href: '/people', label: 'People', icon: '👥' },
  ]

  if (session.role === 'admin') {
    navItems.push({ href: '/admin', label: 'Admin', icon: '⚙️' })
  }

  return (
    <>
      {/* Desktop Navigation */}
      <nav className="hidden md:block bg-white shadow">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16">
            <div className="flex">
              <div className="flex-shrink-0 flex items-center">
                <h1 className="text-xl font-bold text-gray-900">
                  {process.env.NEXT_PUBLIC_EVENT_TITLE || 'Bachelor Party'}
                </h1>
              </div>
              <div className="ml-10 flex items-baseline space-x-4">
                {navItems.map((item) => {
                  const isActive = pathname === item.href
                  return (
                    <Link
                      key={item.href}
                      href={item.href}
                      className={`px-3 py-2 rounded-md text-sm font-medium ${
                        isActive
                          ? 'bg-primary-100 text-primary-700'
                          : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
                      }`}
                    >
                      <span className="mr-1">{item.icon}</span>
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
      <nav className="md:hidden fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200">
        <div className="grid grid-cols-5 gap-1">
          {navItems.slice(0, 5).map((item) => {
            const isActive = pathname === item.href
            return (
              <Link
                key={item.href}
                href={item.href}
                className={`flex flex-col items-center py-2 px-1 text-xs ${
                  isActive
                    ? 'text-primary-600'
                    : 'text-gray-600'
                }`}
              >
                <span className="text-2xl mb-1">{item.icon}</span>
                <span>{item.label}</span>
              </Link>
            )
          })}
        </div>
      </nav>
    </>
  )
}