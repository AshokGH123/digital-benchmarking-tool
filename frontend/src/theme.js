import { createTheme } from '@mui/material/styles';

export const lightTheme = createTheme({
  palette: {
    mode: 'light',
    primary: {
      main: '#007AFF',
      light: '#5AC8FA',
      dark: '#0051D5',
      contrastText: '#ffffff',
    },
    secondary: {
      main: '#FF2D55',
      light: '#FF375F',
      dark: '#E0245E',
    },
    success: {
      main: '#34C759',
      light: '#30D158',
    },
    warning: {
      main: '#FF9500',
      light: '#FFCC00',
    },
    info: {
      main: '#5AC8FA',
      light: '#64D2FF',
    },
    error: {
      main: '#FF3B30',
      light: '#FF453A',
    },
    background: {
      default: '#F2F2F7',
      paper: 'rgba(255, 255, 255, 0.85)',
    },
    text: {
      primary: '#000000',
      secondary: '#8E8E93',
    },
    divider: 'rgba(60, 60, 67, 0.12)',
  },
  typography: {
    fontFamily: '-apple-system, BlinkMacSystemFont, "SF Pro Display", "Segoe UI", "Roboto", sans-serif',
    h4: {
      fontWeight: 700,
      fontSize: '2rem',
      letterSpacing: '-0.02em',
    },
    h5: {
      fontWeight: 600,
      fontSize: '1.5rem',
      letterSpacing: '-0.01em',
    },
    h6: {
      fontWeight: 600,
      fontSize: '1.25rem',
      letterSpacing: '-0.01em',
    },
  },
  shape: {
    borderRadius: 20,
  },
  shadows: [
    'none',
    '0 1px 3px rgba(0, 0, 0, 0.04), 0 1px 2px rgba(0, 0, 0, 0.02)',
    '0 4px 12px rgba(0, 0, 0, 0.08), 0 2px 4px rgba(0, 0, 0, 0.04)',
    '0 8px 24px rgba(0, 0, 0, 0.12), 0 4px 8px rgba(0, 0, 0, 0.06)',
    '0 16px 32px rgba(0, 0, 0, 0.16), 0 8px 16px rgba(0, 0, 0, 0.08)',
    '0 24px 48px rgba(0, 0, 0, 0.20), 0 12px 24px rgba(0, 0, 0, 0.10)',
  ],
  components: {
    MuiCard: {
      styleOverrides: {
        root: {
          borderRadius: 20,
          backdropFilter: 'blur(40px) saturate(180%)',
          backgroundColor: 'rgba(255, 255, 255, 0.85)',
          border: '1px solid rgba(255, 255, 255, 0.5)',
          boxShadow: '0 8px 32px rgba(0, 0, 0, 0.08)',
          transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
          '&:hover': {
            transform: 'translateY(-4px)',
            boxShadow: '0 12px 48px rgba(0, 0, 0, 0.12)',
          },
        },
      },
    },
    MuiButton: {
      styleOverrides: {
        root: {
          borderRadius: 14,
          textTransform: 'none',
          fontWeight: 600,
          padding: '10px 24px',
          boxShadow: 'none',
        },
      },
    },
    MuiPaper: {
      styleOverrides: {
        root: {
          borderRadius: 20,
          backdropFilter: 'blur(40px) saturate(180%)',
          backgroundColor: 'rgba(255, 255, 255, 0.85)',
          border: '1px solid rgba(255, 255, 255, 0.5)',
        },
      },
    },
  },
});

export const darkTheme = createTheme({
  palette: {
    mode: 'dark',
    primary: {
      main: '#0A84FF',
      light: '#409CFF',
      dark: '#0066CC',
      contrastText: '#ffffff',
    },
    secondary: {
      main: '#FF375F',
      light: '#FF6482',
      dark: '#E0245E',
    },
    success: {
      main: '#30D158',
      light: '#32D74B',
    },
    warning: {
      main: '#FF9F0A',
      light: '#FFB340',
    },
    info: {
      main: '#64D2FF',
      light: '#70D7FF',
    },
    error: {
      main: '#FF453A',
      light: '#FF6961',
    },
    background: {
      default: '#000000',
      paper: 'rgba(28, 28, 30, 0.85)',
    },
    text: {
      primary: '#FFFFFF',
      secondary: '#98989D',
    },
    divider: 'rgba(84, 84, 88, 0.48)',
  },
  typography: {
    fontFamily: '-apple-system, BlinkMacSystemFont, "SF Pro Display", "Segoe UI", "Roboto", sans-serif',
    h4: {
      fontWeight: 700,
      fontSize: '2rem',
      letterSpacing: '-0.02em',
    },
    h5: {
      fontWeight: 600,
      fontSize: '1.5rem',
      letterSpacing: '-0.01em',
    },
    h6: {
      fontWeight: 600,
      fontSize: '1.25rem',
      letterSpacing: '-0.01em',
    },
  },
  shape: {
    borderRadius: 20,
  },
  shadows: [
    'none',
    '0 1px 3px rgba(0, 0, 0, 0.3), 0 1px 2px rgba(0, 0, 0, 0.2)',
    '0 4px 12px rgba(0, 0, 0, 0.4), 0 2px 4px rgba(0, 0, 0, 0.3)',
    '0 8px 24px rgba(0, 0, 0, 0.5), 0 4px 8px rgba(0, 0, 0, 0.4)',
    '0 16px 32px rgba(0, 0, 0, 0.6), 0 8px 16px rgba(0, 0, 0, 0.5)',
    '0 24px 48px rgba(0, 0, 0, 0.7), 0 12px 24px rgba(0, 0, 0, 0.6)',
  ],
  components: {
    MuiCard: {
      styleOverrides: {
        root: {
          borderRadius: 20,
          backdropFilter: 'blur(40px) saturate(180%)',
          backgroundColor: 'rgba(28, 28, 30, 0.85)',
          border: '1px solid rgba(84, 84, 88, 0.48)',
          boxShadow: '0 8px 32px rgba(0, 0, 0, 0.6)',
          transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
          '&:hover': {
            transform: 'translateY(-4px)',
            boxShadow: '0 12px 48px rgba(0, 0, 0, 0.8)',
            border: '1px solid rgba(84, 84, 88, 0.65)',
          },
        },
      },
    },
    MuiButton: {
      styleOverrides: {
        root: {
          borderRadius: 14,
          textTransform: 'none',
          fontWeight: 600,
          padding: '10px 24px',
          boxShadow: 'none',
        },
      },
    },
    MuiPaper: {
      styleOverrides: {
        root: {
          borderRadius: 20,
          backdropFilter: 'blur(40px) saturate(180%)',
          backgroundColor: 'rgba(28, 28, 30, 0.85)',
          border: '1px solid rgba(84, 84, 88, 0.48)',
        },
      },
    },
  },
});
