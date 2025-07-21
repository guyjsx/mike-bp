import { Announcement } from '@/lib/types'
import { Alert, Box } from '@mui/material'
import { Campaign } from '@mui/icons-material'

interface AnnouncementBannerProps {
  announcements: Announcement[]
}

export default function AnnouncementBanner({ announcements }: AnnouncementBannerProps) {
  const activeAnnouncements = announcements.filter(a => a.is_active)

  if (activeAnnouncements.length === 0) {
    return null
  }

  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
      {activeAnnouncements.map((announcement) => (
        <Alert
          key={announcement.id}
          severity="info"
          icon={<Campaign />}
          sx={{
            backgroundColor: 'warning.light',
            color: 'warning.contrastText',
            '& .MuiAlert-icon': {
              color: 'warning.main'
            }
          }}
        >
          {announcement.message}
        </Alert>
      ))}
    </Box>
  )
}