// src/theme.js
import { createTheme } from '@mui/material/styles'

const theme = createTheme({
  palette: {
    mode: 'light',
    primary:    { main: '#4361EE', light: '#EEF2FF', dark: '#2D44C4' },
    secondary:  { main: '#7C3AED', light: '#F5F3FF', dark: '#5B21B6' },
    success:    { main: '#10B981', light: '#ECFDF5', dark: '#059669' },
    warning:    { main: '#F59E0B', light: '#FFFBEB', dark: '#D97706' },
    error:      { main: '#EF4444', light: '#FEF2F2', dark: '#DC2626' },
    background: { default: '#F0F4F8', paper: '#ffffff' },
    text: {
      primary:   '#1E293B',
      secondary: '#64748B',
      disabled:  '#CBD5E1',
    },
  },
  shape: { borderRadius: 16 },
  typography: {
    fontFamily: ['Inter', 'Roboto', 'sans-serif'].join(','),
    h3: { fontWeight: 900, letterSpacing: '-0.03em' },
    h4: { fontWeight: 900, letterSpacing: '-0.03em' },
    h5: { fontWeight: 800, letterSpacing: '-0.02em' },
    h6: { fontWeight: 800, letterSpacing: '-0.02em' },
    button: { textTransform: 'none', fontWeight: 700, letterSpacing: '-0.01em' },
    body2: { color: '#64748B' },
  },
  components: {
    MuiCard: {
      defaultProps: { elevation: 0 },
      styleOverrides: {
        root: {
          borderRadius: 20,
          border: 'none',
          boxShadow: '0 2px 20px rgba(15, 23, 42, 0.06)',
        },
      },
    },
    MuiButton: {
      styleOverrides: {
        root: { borderRadius: 12, paddingInline: 20, fontWeight: 700 },
        containedPrimary: {
          background: '#4361EE',
          boxShadow: '0 4px 16px rgba(67, 97, 238, 0.3)',
          '&:hover': {
            background: '#2D44C4',
            boxShadow: '0 6px 24px rgba(67, 97, 238, 0.4)',
          },
        },
      },
    },
    MuiChip: {
      styleOverrides: {
        root: { borderRadius: 10, fontWeight: 700 },
      },
    },
    MuiOutlinedInput: {
      styleOverrides: {
        root: {
          borderRadius: 14,
          background: '#F8FAFC',
          '& fieldset': { borderColor: 'rgba(226,232,240,0.8)' },
          '&:hover fieldset': { borderColor: '#4361EE' },
        },
      },
    },
    MuiDrawer: {
      styleOverrides: {
        paper: { background: 'transparent', boxShadow: 'none' },
      },
    },
    MuiDivider: {
      styleOverrides: {
        root: { borderColor: 'rgba(226, 232, 240, 0.7)' },
      },
    },
  },
})

export default theme