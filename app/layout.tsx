'use client'

import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import { ThemeProvider } from '@mui/material/styles'
import CssBaseline from '@mui/material/CssBaseline'
import golfTheme from '@/lib/theme'
import '@/styles/globals.css'

const inter = Inter({ subsets: ['latin'] })

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={inter.className}>
        <ThemeProvider theme={golfTheme}>
          <CssBaseline />
          <div className="min-h-screen bg-neutral-50">
            {children}
          </div>
        </ThemeProvider>
      </body>
    </html>
  )
}