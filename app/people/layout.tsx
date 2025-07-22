import { getAuthSession } from '@/lib/auth'
import Navigation from '@/components/layout/Navigation'
import Header from '@/components/layout/Header'
import { redirect } from 'next/navigation'

export default async function PeopleLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const session = await getAuthSession()
  
  if (!session || !session.role) {
    redirect('/login')
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 via-white to-green-50 golf-texture">
      <Navigation session={session} />
      <Header session={session} />
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 pb-24 md:pb-8 md:pt-8">
        <div className="space-y-6">
          {children}
        </div>
      </main>
    </div>
  )
}