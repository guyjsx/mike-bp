'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { useState } from 'react'
import { AuthSession } from '@/lib/auth'
import { Drawer, Box, IconButton, useMediaQuery, useTheme } from '@mui/material'
import {
  Dashboard,
  Schedule,
  GolfCourse,
  Hotel,
  AttachMoney,
  People,
  Settings,
  Menu,
  Close
} from '@mui/icons-material'

interface NavigationProps {
  session: AuthSession
}

export default function Navigation({ session }: NavigationProps) {
  const pathname = usePathname()
  const theme = useTheme()
  const isMobile = useMediaQuery(theme.breakpoints.down('lg'))
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  
  const navItems = [
    { href: '/dashboard', label: 'Dashboard', icon: Dashboard },
    { href: '/schedule', label: 'Schedule', icon: Schedule },
    { href: '/golf', label: 'Golf', icon: GolfCourse },
    { href: '/accommodations', label: 'Rooms', icon: Hotel },
    { href: '/expenses', label: 'Expenses', icon: AttachMoney },
    { href: '/people', label: 'People', icon: People },
  ]

  if (session.role === 'admin') {
    navItems.push({ href: '/admin', label: 'Admin', icon: Settings })
  }

  const handleMenuToggle = () => {
    setMobileMenuOpen(!mobileMenuOpen)
  }

  const handleMenuClose = () => {
    setMobileMenuOpen(false)
  }

  return (
    <>
      {/* Desktop Navigation */}
      <nav className="hidden lg:block bg-white/95 backdrop-blur-xl shadow-lg border-b border-green-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center space-x-4">
              <div className="relative">
                <GolfCourse 
                  sx={{ 
                    fontSize: 32, 
                    color: '#1b5e20',
                    filter: 'drop-shadow(0 2px 4px rgba(27, 94, 32, 0.3))'
                  }} 
                />
              </div>
              <div>
                <h1 className="text-lg xl:text-xl font-bold text-green-800 leading-tight">
                  {process.env.NEXT_PUBLIC_EVENT_TITLE || "Mike's Bachelor Party"}
                </h1>
                <p className="text-xs text-green-600 font-medium -mt-0.5">Golf & Casino Weekend</p>
              </div>
            </div>
            <div className="flex items-center space-x-1">
              {navItems.map((item) => {
                const isActive = pathname === item.href
                const IconComponent = item.icon
                return (
                  <Link
                    key={item.href}
                    href={item.href}
                    className={`group inline-flex items-center px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200 ${
                      isActive
                        ? 'bg-green-100 text-green-800 shadow-sm'
                        : 'text-green-600 hover:bg-green-50 hover:text-green-700'
                    }`}
                  >
                    <IconComponent 
                      className="mr-2" 
                      fontSize="small" 
                    />
                    {item.label}
                  </Link>
                )
              })}
            </div>
          </div>
        </div>
      </nav>

      {/* Mobile/Tablet Header with Hamburger */}
      <nav className="lg:hidden bg-white/95 backdrop-blur-xl shadow-lg border-b border-green-100 relative z-50">
        <div className="px-4 py-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <GolfCourse 
                sx={{ 
                  fontSize: 28, 
                  color: '#1b5e20',
                  filter: 'drop-shadow(0 2px 4px rgba(27, 94, 32, 0.3))'
                }} 
              />
              <div>
                <h1 className="text-lg font-bold text-green-800 leading-tight">
                  {process.env.NEXT_PUBLIC_EVENT_TITLE || "Mike's Bachelor Party"}
                </h1>
                <p className="text-xs text-green-600 font-medium -mt-0.5">Golf & Casino Weekend</p>
              </div>
            </div>
            
            {/* Hamburger Menu Button */}
            <IconButton
              onClick={handleMenuToggle}
              sx={{
                p: 1.5,
                borderRadius: 2,
                backgroundColor: mobileMenuOpen ? '#1b5e20' : 'transparent',
                color: mobileMenuOpen ? 'white' : '#1b5e20',
                transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
                '&:hover': {
                  backgroundColor: mobileMenuOpen ? '#0f3d13' : 'rgba(27, 94, 32, 0.1)',
                  transform: 'scale(1.05)',
                },
                '&:active': {
                  transform: 'scale(0.95)',
                }
              }}
            >
              <Box
                sx={{
                  position: 'relative',
                  width: 24,
                  height: 24,
                  '& > div': {
                    position: 'absolute',
                    height: 3,
                    backgroundColor: 'currentColor',
                    borderRadius: 2,
                    transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
                    transformOrigin: 'center',
                  }
                }}
              >
                {/* Hamburger Lines */}
                <Box
                  sx={{
                    top: 4,
                    left: 0,
                    right: 0,
                    transform: mobileMenuOpen ? 'rotate(45deg) translate(6px, 6px)' : 'rotate(0)',
                  }}
                />
                <Box
                  sx={{
                    top: 10.5,
                    left: 0,
                    right: 0,
                    opacity: mobileMenuOpen ? 0 : 1,
                    transform: mobileMenuOpen ? 'scale(0)' : 'scale(1)',
                  }}
                />
                <Box
                  sx={{
                    top: 17,
                    left: 0,
                    right: 0,
                    transform: mobileMenuOpen ? 'rotate(-45deg) translate(6px, -6px)' : 'rotate(0)',
                  }}
                />
              </Box>
            </IconButton>
          </div>
        </div>
      </nav>

      {/* Mobile Drawer Menu */}
      <Drawer
        anchor="right"
        open={mobileMenuOpen}
        onClose={handleMenuClose}
        sx={{
          '& .MuiDrawer-paper': {
            width: 280,
            background: 'linear-gradient(135deg, #1b5e20 0%, #2e7d32 100%)',
            color: 'white',
            borderTopLeftRadius: 24,
            borderBottomLeftRadius: 24,
            border: 'none',
          },
          '& .MuiBackdrop-root': {
            backgroundColor: 'rgba(27, 94, 32, 0.3)',
            backdropFilter: 'blur(4px)',
          }
        }}
      >
        <Box sx={{ pt: 4, pb: 2 }}>
          {/* Header */}
          <Box sx={{ px: 3, mb: 4, textAlign: 'center' }}>
            <GolfCourse sx={{ fontSize: 48, mb: 2, opacity: 0.9 }} />
            <h2 className="text-xl font-bold mb-1">Navigation</h2>
            <p className="text-sm opacity-75">Golf & Casino Weekend</p>
          </Box>

          {/* Navigation Items */}
          <Box sx={{ px: 2 }}>
            {navItems.map((item, index) => {
              const isActive = pathname === item.href
              const IconComponent = item.icon
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  onClick={handleMenuClose}
                  style={{ textDecoration: 'none' }}
                >
                  <Box
                    sx={{
                      display: 'flex',
                      alignItems: 'center',
                      p: 2,
                      mb: 1,
                      borderRadius: 3,
                      backgroundColor: isActive ? 'rgba(255, 255, 255, 0.2)' : 'transparent',
                      backdropFilter: isActive ? 'blur(10px)' : 'none',
                      border: isActive ? '1px solid rgba(255, 255, 255, 0.3)' : '1px solid transparent',
                      transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
                      transform: `translateX(${mobileMenuOpen ? 0 : 50}px)`,
                      opacity: mobileMenuOpen ? 1 : 0,
                      transitionDelay: `${index * 50}ms`,
                      '&:hover': {
                        backgroundColor: 'rgba(255, 255, 255, 0.15)',
                        transform: 'translateX(-4px)',
                      },
                      '&:active': {
                        transform: 'scale(0.98)',
                      }
                    }}
                  >
                    <IconComponent sx={{ mr: 3, fontSize: 24 }} />
                    <Box sx={{ color: 'white' }}>
                      <div className="font-semibold text-base">{item.label}</div>
                      {isActive && <div className="text-xs opacity-75">Current page</div>}
                    </Box>
                    {isActive && (
                      <Box
                        sx={{
                          ml: 'auto',
                          width: 8,
                          height: 8,
                          borderRadius: '50%',
                          backgroundColor: '#d4af37',
                          boxShadow: '0 0 8px rgba(212, 175, 55, 0.6)',
                        }}
                      />
                    )}
                  </Box>
                </Link>
              )
            })}
          </Box>
        </Box>
      </Drawer>

      {/* Mobile Bottom Navigation - Only for main pages */}
      <nav className="lg:hidden fixed bottom-0 left-0 right-0 bg-white/95 backdrop-blur-xl border-t border-green-100 z-40 shadow-2xl">
        <div className="safe-area-pb">
          <div className="grid grid-cols-4 gap-0">
            {navItems.slice(0, 4).map((item) => {
              const isActive = pathname === item.href
              const IconComponent = item.icon
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={`relative flex flex-col items-center py-3 px-2 text-xs transition-all duration-200 active:scale-95 ${
                    isActive
                      ? 'text-green-700'
                      : 'text-green-600'
                  }`}
                >
                  {isActive && (
                    <div className="absolute top-0 left-1/2 transform -translate-x-1/2 w-8 h-1 bg-gradient-to-r from-green-500 to-green-600 rounded-b-full"></div>
                  )}
                  <div className={`p-2 rounded-xl transition-all duration-200 ${
                    isActive 
                      ? 'bg-gradient-to-br from-green-50 to-green-100 shadow-md scale-110' 
                      : 'hover:bg-green-50'
                  }`}>
                    <IconComponent 
                      sx={{ 
                        fontSize: 20,
                        color: isActive ? '#1b5e20' : '#164e1b'
                      }} 
                    />
                  </div>
                  <span className={`text-xs font-medium mt-1 ${
                    isActive ? 'text-green-800' : 'text-green-600'
                  }`}>
                    {item.label}
                  </span>
                </Link>
              )
            })}
          </div>
        </div>
      </nav>
    </>
  )
}