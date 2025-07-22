import { createTheme } from '@mui/material/styles';

// Masters-inspired Golf Theme - Augusta National Color Palette
export const golfTheme = createTheme({
  palette: {
    mode: 'light',
    primary: {
      50: '#f0f7f0',   // Light Augusta green
      100: '#e0f0e0',  
      200: '#b8d8b8',  // Fairway green
      300: '#8fc28f',  
      400: '#5fa55f',  
      500: '#1b5e20',  // Deep Augusta green (main)
      600: '#164e1b',  
      700: '#0f3d13',  
      800: '#0a2d0c',  
      900: '#051d06',
      main: '#1b5e20', // Deep Augusta green
      light: '#4caf50',
      dark: '#0f3d13',
      contrastText: '#ffffff',
    },
    secondary: {
      50: '#fefef9',   // Azalea white
      100: '#fefcf4',  
      200: '#fdf7e3',  
      300: '#fbf0c9',  
      400: '#f7e199',  
      500: '#d4af37',  // Masters gold
      600: '#b8941f',  
      700: '#9c7a1a',  
      800: '#806115',  
      900: '#644710',
      main: '#d4af37', // Masters gold
      light: '#f7e199',
      dark: '#9c7a1a',
      contrastText: '#051d06',
    },
    background: {
      default: '#fafaf9',
      paper: '#ffffff',
    },
    text: {
      primary: '#051d06', // Deep forest green
      secondary: '#164e1b',
    },
    success: {
      main: '#1b5e20',
      light: '#4caf50',
      dark: '#0f3d13',
    },
    warning: {
      main: '#f4cc42', // Sand bunker
      light: '#fff176',
      dark: '#f57f17',
    },
    error: {
      main: '#d32f2f', // Water hazard red
      light: '#ef5350',
      dark: '#c62828',
    },
    info: {
      main: '#1976d2', // Sky blue
      light: '#42a5f5',
      dark: '#1565c0',
    },
  },
  typography: {
    fontFamily: '"Inter", "Playfair Display", "Georgia", serif',
    h1: {
      fontFamily: '"Playfair Display", "Georgia", serif',
      fontSize: '2.75rem',
      fontWeight: 700,
      lineHeight: 1.1,
      letterSpacing: '-0.02em',
      color: '#051d06',
    },
    h2: {
      fontFamily: '"Playfair Display", "Georgia", serif',
      fontSize: '2.25rem',
      fontWeight: 600,
      lineHeight: 1.2,
      letterSpacing: '-0.01em',
      color: '#051d06',
    },
    h3: {
      fontFamily: '"Playfair Display", "Georgia", serif',
      fontSize: '1.875rem',
      fontWeight: 600,
      lineHeight: 1.3,
      color: '#051d06',
    },
    h4: {
      fontFamily: '"Inter", sans-serif',
      fontSize: '1.5rem',
      fontWeight: 600,
      lineHeight: 1.4,
      color: '#0f3d13',
    },
    h5: {
      fontFamily: '"Inter", sans-serif',
      fontSize: '1.25rem',
      fontWeight: 600,
      lineHeight: 1.5,
      color: '#0f3d13',
    },
    h6: {
      fontFamily: '"Inter", sans-serif',
      fontSize: '1rem',
      fontWeight: 600,
      lineHeight: 1.5,
      color: '#164e1b',
    },
    body1: {
      fontFamily: '"Inter", sans-serif',
      fontSize: '1rem',
      lineHeight: 1.6,
      color: '#164e1b',
    },
    body2: {
      fontFamily: '"Inter", sans-serif',
      fontSize: '0.875rem',
      lineHeight: 1.6,
      color: '#164e1b',
    },
    subtitle1: {
      fontFamily: '"Inter", sans-serif',
      fontSize: '1rem',
      fontWeight: 500,
      lineHeight: 1.5,
      color: '#1b5e20',
    },
    subtitle2: {
      fontFamily: '"Inter", sans-serif',
      fontSize: '0.875rem',
      fontWeight: 500,
      lineHeight: 1.4,
      color: '#1b5e20',
    },
    caption: {
      fontFamily: '"Inter", sans-serif',
      fontSize: '0.75rem',
      fontWeight: 400,
      lineHeight: 1.4,
      color: '#164e1b',
    },
  },
  shape: {
    borderRadius: 12, // More rounded for premium feel
  },
  spacing: 8,
  breakpoints: {
    values: {
      xs: 0,
      sm: 640,
      md: 768,
      lg: 1024,
      xl: 1280,
    },
  },
  components: {
    MuiButton: {
      styleOverrides: {
        root: {
          textTransform: 'none',
          fontWeight: 600,
          borderRadius: 12,
          fontSize: '0.875rem',
          padding: '10px 24px',
          fontFamily: '"Inter", sans-serif',
          transition: 'all 0.2s cubic-bezier(0.4, 0, 0.2, 1)',
        },
        contained: {
          boxShadow: '0 2px 8px 0 rgba(27, 94, 32, 0.2)',
          background: 'linear-gradient(135deg, #1b5e20 0%, #2e7d32 100%)',
          '&:hover': {
            boxShadow: '0 4px 16px 0 rgba(27, 94, 32, 0.3)',
            background: 'linear-gradient(135deg, #0f3d13 0%, #1b5e20 100%)',
            transform: 'translateY(-1px)',
          },
          '&:active': {
            transform: 'translateY(0px)',
          },
        },
        outlined: {
          borderColor: '#1b5e20',
          borderWidth: 2,
          color: '#1b5e20',
          '&:hover': {
            borderColor: '#0f3d13',
            backgroundColor: 'rgba(27, 94, 32, 0.04)',
          },
        },
      },
    },
    MuiCard: {
      styleOverrides: {
        root: {
          borderRadius: 12,
          boxShadow: '0 2px 8px 0 rgba(0, 0, 0, 0.06), 0 1px 4px 0 rgba(0, 0, 0, 0.04)',
          border: '1px solid rgba(27, 94, 32, 0.12)',
          backgroundColor: '#ffffff',
          transition: 'all 0.2s cubic-bezier(0.4, 0, 0.2, 1)',
          '&:hover': {
            boxShadow: '0 4px 12px 0 rgba(0, 0, 0, 0.1), 0 2px 6px 0 rgba(0, 0, 0, 0.06)',
            transform: 'translateY(-1px)',
            borderColor: 'rgba(27, 94, 32, 0.2)',
          },
        },
      },
    },
    MuiCardContent: {
      styleOverrides: {
        root: {
          padding: '24px',
          '&:last-child': {
            paddingBottom: '24px',
          },
        },
      },
    },
    MuiChip: {
      styleOverrides: {
        root: {
          fontWeight: 600,
          fontFamily: '"Inter", sans-serif',
          borderRadius: 16,
          fontSize: '0.75rem',
          height: 28,
          '& .MuiChip-label': {
            paddingLeft: 8,
            paddingRight: 8,
          },
        },
        filled: {
          backgroundColor: 'rgba(212, 175, 55, 0.15)',
          color: '#806115',
          border: '1px solid rgba(212, 175, 55, 0.3)',
          '&:hover': {
            backgroundColor: 'rgba(212, 175, 55, 0.2)',
          },
        },
        colorPrimary: {
          backgroundColor: '#1b5e20',
          color: 'white',
          '&:hover': {
            backgroundColor: '#0f3d13',
          },
        },
      },
    },
    MuiAppBar: {
      styleOverrides: {
        root: {
          backgroundColor: 'rgba(255, 255, 255, 0.95)',
          backdropFilter: 'blur(20px)',
          color: '#051d06',
          boxShadow: '0 1px 16px 0 rgba(27, 94, 32, 0.1)',
          borderBottom: '1px solid rgba(27, 94, 32, 0.08)',
        },
      },
    },
    MuiTypography: {
      styleOverrides: {
        h1: {
          background: 'linear-gradient(135deg, #051d06 0%, #1b5e20 100%)',
          WebkitBackgroundClip: 'text',
          WebkitTextFillColor: 'transparent',
          backgroundClip: 'text',
        },
        h2: {
          background: 'linear-gradient(135deg, #051d06 0%, #1b5e20 100%)',
          WebkitBackgroundClip: 'text',
          WebkitTextFillColor: 'transparent',
          backgroundClip: 'text',
        },
      },
    },
    MuiPaper: {
      styleOverrides: {
        root: {
          backgroundImage: 'none',
        },
        elevation1: {
          boxShadow: '0 2px 8px 0 rgba(27, 94, 32, 0.08)',
        },
        elevation4: {
          boxShadow: '0 8px 24px 0 rgba(27, 94, 32, 0.12), 0 4px 12px 0 rgba(27, 94, 32, 0.06)',
        },
      },
    },
    MuiBottomNavigation: {
      styleOverrides: {
        root: {
          backgroundColor: 'rgba(255, 255, 255, 0.95)',
          backdropFilter: 'blur(20px)',
          borderTop: '1px solid rgba(27, 94, 32, 0.08)',
          boxShadow: '0 -4px 16px 0 rgba(27, 94, 32, 0.1)',
        },
      },
    },
    MuiBottomNavigationAction: {
      styleOverrides: {
        root: {
          color: '#164e1b',
          '&.Mui-selected': {
            color: '#1b5e20',
          },
        },
      },
    },
  },
});

export default golfTheme;