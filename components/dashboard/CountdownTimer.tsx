'use client'

import { useEffect, useState } from 'react'

export default function CountdownTimer() {
  const [timeLeft, setTimeLeft] = useState({
    days: 0,
    hours: 0,
    minutes: 0,
    seconds: 0
  })

  useEffect(() => {
    const eventStart = new Date(process.env.NEXT_PUBLIC_EVENT_START || '2024-05-10')
    
    const calculateTimeLeft = () => {
      const difference = eventStart.getTime() - new Date().getTime()
      
      if (difference > 0) {
        setTimeLeft({
          days: Math.floor(difference / (1000 * 60 * 60 * 24)),
          hours: Math.floor((difference / (1000 * 60 * 60)) % 24),
          minutes: Math.floor((difference / 1000 / 60) % 60),
          seconds: Math.floor((difference / 1000) % 60)
        })
      } else {
        setTimeLeft({ days: 0, hours: 0, minutes: 0, seconds: 0 })
      }
    }

    calculateTimeLeft()
    const timer = setInterval(calculateTimeLeft, 1000)

    return () => clearInterval(timer)
  }, [])

  const eventStarted = timeLeft.days === 0 && timeLeft.hours === 0 && timeLeft.minutes === 0 && timeLeft.seconds === 0

  if (eventStarted) {
    return (
      <div className="bg-gradient-to-r from-primary-500 to-primary-600 rounded-lg shadow-lg p-8 text-white">
        <h2 className="text-2xl font-bold text-center mb-2">The Party Has Started! 🎉</h2>
        <p className="text-center text-lg">Hope you&apos;re having an amazing time!</p>
      </div>
    )
  }

  return (
    <div className="bg-gradient-to-r from-primary-500 to-primary-600 rounded-lg shadow-lg p-8 text-white">
      <h2 className="text-2xl font-bold text-center mb-6">Countdown to the Big Weekend</h2>
      <div className="grid grid-cols-4 gap-4">
        <div className="text-center">
          <div className="text-3xl font-bold">{timeLeft.days}</div>
          <div className="text-sm uppercase">Days</div>
        </div>
        <div className="text-center">
          <div className="text-3xl font-bold">{timeLeft.hours}</div>
          <div className="text-sm uppercase">Hours</div>
        </div>
        <div className="text-center">
          <div className="text-3xl font-bold">{timeLeft.minutes}</div>
          <div className="text-sm uppercase">Minutes</div>
        </div>
        <div className="text-center">
          <div className="text-3xl font-bold">{timeLeft.seconds}</div>
          <div className="text-sm uppercase">Seconds</div>
        </div>
      </div>
    </div>
  )
}