'use client'

import { useRouter } from 'next/navigation'
import { AuthSession } from '@/lib/auth'
import { Logout, AdminPanelSettings, Person } from '@mui/icons-material'

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
    <header className="bg-white shadow-sm border-b border-neutral-100">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-12">
          <div className="flex items-center">
            {session.role === 'admin' ? (
              <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-semibold bg-accent-100 text-accent-800">
                <AdminPanelSettings className="mr-1" fontSize="small" />
                Admin Mode
              </span>
            ) : (
              <span className="text-sm text-neutral-600 flex items-center">
                <Person className="mr-1" fontSize="small" />
                Viewing as: <span className="font-semibold ml-1 text-neutral-800">{session.attendeeName}</span>
              </span>
            )}
          </div>
          
          <button
            onClick={handleLogout}
            className="inline-flex items-center text-sm text-neutral-500 hover:text-neutral-700 transition-colors"
          >
            <Logout className="mr-1" fontSize="small" />
            Logout
          </button>
        </div>
      </div>
    </header>
  )
}