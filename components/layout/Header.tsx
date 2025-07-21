'use client'

import { useRouter } from 'next/navigation'
import { AuthSession } from '@/lib/auth'

interface HeaderProps {
  session: AuthSession
}

export default function Header({ session }: HeaderProps) {
  const router = useRouter()

  const handleLogout = async () => {
    await fetch('/api/auth/logout', { method: 'POST' })
    router.push('/login')
  }

  return (
    <header className="bg-white shadow-sm border-b border-gray-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-12">
          <div className="flex items-center">
            {session.role === 'admin' ? (
              <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-gray-800 text-white">
                Admin Mode
              </span>
            ) : (
              <span className="text-sm text-gray-600">
                Viewing as: <span className="font-medium">{session.attendeeName}</span>
              </span>
            )}
          </div>
          
          <button
            onClick={handleLogout}
            className="text-sm text-gray-500 hover:text-gray-700"
          >
            Logout
          </button>
        </div>
      </div>
    </header>
  )
}