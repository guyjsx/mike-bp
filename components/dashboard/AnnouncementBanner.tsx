import { Announcement } from '@/lib/types'

interface AnnouncementBannerProps {
  announcements: Announcement[]
}

export default function AnnouncementBanner({ announcements }: AnnouncementBannerProps) {
  const activeAnnouncements = announcements.filter(a => a.is_active)

  if (activeAnnouncements.length === 0) {
    return null
  }

  return (
    <div className="space-y-2">
      {activeAnnouncements.map((announcement) => (
        <div
          key={announcement.id}
          className="bg-yellow-50 border border-yellow-200 rounded-lg p-4"
        >
          <div className="flex">
            <div className="flex-shrink-0">
              <span className="text-2xl">📢</span>
            </div>
            <div className="ml-3">
              <p className="text-sm text-yellow-800">{announcement.message}</p>
            </div>
          </div>
        </div>
      ))}
    </div>
  )
}