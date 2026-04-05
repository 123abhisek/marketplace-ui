// // src/theme.js
// import { createTheme } from '@mui/material/styles'

// const theme = createTheme({
//   palette: {
//     mode: 'light',
//     primary: { main: '#6D5DF6' },
//     secondary: { main: '#14B8A6' },
//     background: {
//       default: '#f7f8fc',
//       paper: '#ffffff',
//     },
//     text: {
//       primary: '#111827',
//       secondary: '#6b7280',
//     },
//   },
//   shape: {
//     borderRadius: 20,
//   },
//   typography: {
//     fontFamily: ['Inter', 'Roboto', 'sans-serif'].join(','),
//     h1: { fontWeight: 900, letterSpacing: '-0.04em' },
//     h2: { fontWeight: 800, letterSpacing: '-0.03em' },
//     h3: { fontWeight: 800, letterSpacing: '-0.03em' },
//     h4: { fontWeight: 800 },
//     h5: { fontWeight: 700 },
//     h6: { fontWeight: 700 },
//     button: { textTransform: 'none', fontWeight: 700 },
//   },
//   components: {
//     MuiAppBar: {
//       styleOverrides: {
//         root: {
//           background: 'rgba(255,255,255,0.72)',
//           backdropFilter: 'blur(18px)',
//           border: '1px solid rgba(255,255,255,0.35)',
//           boxShadow: '0 12px 40px rgba(15, 23, 42, 0.06)',
//         },
//       },
//     },
//     MuiCard: {
//       styleOverrides: {
//         root: {
//           borderRadius: 28,
//           boxShadow: '0 14px 45px rgba(15, 23, 42, 0.08)',
//           border: '1px solid rgba(226, 232, 240, 0.9)',
//           overflow: 'hidden',
//         },
//       },
//     },
//     MuiButton: {
//       styleOverrides: {
//         root: {
//           borderRadius: 999,
//           paddingInline: 20,
//           paddingBlock: 10,
//         },
//       },
//     },
//   },
// })

// export default theme


// src/theme.js
import { createTheme } from '@mui/material/styles'

const theme = createTheme({
  palette: {
    mode: 'light',
    primary: { main: '#6C63FF' },
    secondary: { main: '#82E6D5' },
    background: {
      default: '#eef5ff',
      paper: '#ffffff',
    },
    text: {
      primary: '#111827',
      secondary: '#667085',
    },
  },
  shape: {
    borderRadius: 24,
  },
  typography: {
    fontFamily: ['Inter', 'Roboto', 'sans-serif'].join(','),
    h1: { fontWeight: 900, letterSpacing: '-0.05em' },
    h2: { fontWeight: 800, letterSpacing: '-0.04em' },
    h3: { fontWeight: 800, letterSpacing: '-0.03em' },
    h4: { fontWeight: 800 },
    h5: { fontWeight: 700 },
    h6: { fontWeight: 700 },
    button: { textTransform: 'none', fontWeight: 700 },
  },
  components: {
    MuiAppBar: {
      styleOverrides: {
        root: {
          background: 'rgba(255,255,255,0.72)',
          backdropFilter: 'blur(18px)',
          boxShadow: '0 10px 40px rgba(15,23,42,0.06)',
          border: '1px solid rgba(255,255,255,0.4)',
        },
      },
    },
    MuiCard: {
      styleOverrides: {
        root: {
          borderRadius: 28,
          border: '1px solid rgba(226,232,240,0.85)',
          boxShadow: '0 18px 45px rgba(15,23,42,0.07)',
        },
      },
    },
    MuiButton: {
      styleOverrides: {
        root: {
          borderRadius: 999,
          paddingInline: 20,
          paddingBlock: 10,
        },
      },
    },
    MuiOutlinedInput: {
      styleOverrides: {
        root: {
          borderRadius: 18,
          backgroundColor: 'rgba(255,255,255,0.85)',
        },
      },
    },
  },
})

export default theme