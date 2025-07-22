'use client'

import type { Metadata } from 'next'
import { Inter, Playfair_Display } from 'next/font/google'
import { ThemeProvider } from '@mui/material/styles'
import CssBaseline from '@mui/material/CssBaseline'
import golfTheme from '@/lib/theme'
import '@/styles/globals.css'
import '@/styles/golf-theme.css'

const inter = Inter({ 
  subsets: ['latin'],
  variable: '--font-inter',
})

const playfair = Playfair_Display({ 
  subsets: ['latin'],
  variable: '--font-playfair',
})

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={`${inter.variable} ${playfair.variable} ${inter.className}`}>
        <ThemeProvider theme={golfTheme}>
          <CssBaseline />
          <div className="min-h-screen bg-gradient-to-br from-green-50 via-white to-green-50">
            {children}
          </div>
        </ThemeProvider>
      </body>
    </html>
  )
}