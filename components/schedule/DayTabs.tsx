'use client'

import { useState } from 'react'
import { Tabs, Tab, Chip, Box } from '@mui/material'

interface DayTabsProps {
  selectedDay: string
  onDayChange: (day: string) => void
  eventCounts: { [key: string]: number }
}

export default function DayTabs({ selectedDay, onDayChange, eventCounts }: DayTabsProps) {
  const days = [
    { value: '2024-05-10', label: 'Friday', shortLabel: 'Fri' },
    { value: '2024-05-11', label: 'Saturday', shortLabel: 'Sat' },
    { value: '2024-05-12', label: 'Sunday', shortLabel: 'Sun' },
  ]

  const selectedIndex = days.findIndex(day => day.value === selectedDay)

  const handleChange = (event: React.SyntheticEvent, newValue: number) => {
    onDayChange(days[newValue].value)
  }

  return (
    <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
      <Tabs
        value={selectedIndex >= 0 ? selectedIndex : 0}
        onChange={handleChange}
        variant="fullWidth"
        sx={{
          '& .MuiTabs-indicator': {
            backgroundColor: 'primary.main',
            height: 3
          }
        }}
      >
        {days.map((day, index) => {
          const count = eventCounts[day.value] || 0
          
          return (
            <Tab
              key={day.value}
              label={
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                  <Box>
                    <Box sx={{ display: { xs: 'none', sm: 'block' } }}>
                      {day.label}
                    </Box>
                    <Box sx={{ display: { xs: 'block', sm: 'none' } }}>
                      {day.shortLabel}
                    </Box>
                  </Box>
                  {count > 0 && (
                    <Chip
                      label={count}
                      size="small"
                      sx={{
                        height: 20,
                        fontSize: '0.75rem',
                        bgcolor: selectedIndex === index ? 'primary.light' : 'grey.200',
                        color: selectedIndex === index ? 'primary.contrastText' : 'text.secondary'
                      }}
                    />
                  )}
                </Box>
              }
              sx={{
                textTransform: 'none',
                fontWeight: 600,
                minHeight: 48
              }}
            />
          )
        })}
      </Tabs>
    </Box>
  )
}