import { getAuthSession } from '@/lib/auth'
import Navigation from '@/components/layout/Navigation'
import Header from '@/components/layout/Header'
import { redirect } from 'next/navigation'

export default async function AccommodationsLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const session = await getAuthSession()
  
  if (!session || !session.role) {
    redirect('/login')
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Navigation session={session} />
      <Header session={session} />
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 pb-20 md:pb-8">
        {children}
      </main>
    </div>
  )
}