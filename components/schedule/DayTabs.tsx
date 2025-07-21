'use client'

import { useState } from 'react'

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

  return (
    <div className="border-b border-gray-200">
      <nav className="-mb-px flex space-x-8" aria-label="Days">
        {days.map((day) => {
          const isSelected = selectedDay === day.value
          const count = eventCounts[day.value] || 0
          
          return (
            <button
              key={day.value}
              onClick={() => onDayChange(day.value)}
              className={`
                whitespace-nowrap py-2 px-1 border-b-2 font-medium text-sm
                ${isSelected
                  ? 'border-primary-500 text-primary-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }
              `}
            >
              <span className="hidden sm:inline">{day.label}</span>
              <span className="sm:hidden">{day.shortLabel}</span>
              {count > 0 && (
                <span className={`ml-2 py-0.5 px-2 rounded-full text-xs ${
                  isSelected 
                    ? 'bg-primary-100 text-primary-600' 
                    : 'bg-gray-100 text-gray-600'
                }`}>
                  {count}
                </span>
              )}
            </button>
          )
        })}
      </nav>
    </div>
  )
}