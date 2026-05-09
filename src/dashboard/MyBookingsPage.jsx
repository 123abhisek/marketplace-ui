
// // src/dashboard/MyBookingsPage.jsx
// import { useEffect, useMemo, useState } from 'react'
// import { useNavigate } from 'react-router-dom'
// import {
//   Alert,
//   Box,
//   Button,
//   Chip,
//   Collapse,
//   Grid,
//   IconButton,
//   InputAdornment,
//   Stack,
//   TextField,
//   Tooltip,
//   Typography,
// } from '@mui/material'

// import ArrowBackRoundedIcon from '@mui/icons-material/ArrowBackRounded'
// import DirectionsCarRoundedIcon from '@mui/icons-material/DirectionsCarRounded'
// import HomeWorkRoundedIcon from '@mui/icons-material/HomeWorkRounded'
// import CheckCircleRoundedIcon from '@mui/icons-material/CheckCircleRounded'
// import CancelRoundedIcon from '@mui/icons-material/CancelRounded'
// import HourglassTopRoundedIcon from '@mui/icons-material/HourglassTopRounded'
// import ReceiptLongRoundedIcon from '@mui/icons-material/ReceiptLongRounded'
// import SearchRoundedIcon from '@mui/icons-material/SearchRounded'
// import ContentCopyRoundedIcon from '@mui/icons-material/ContentCopyRounded'
// import KeyboardArrowDownRoundedIcon from '@mui/icons-material/KeyboardArrowDownRounded'
// import KeyboardArrowUpRoundedIcon from '@mui/icons-material/KeyboardArrowUpRounded'
// import RefreshRoundedIcon from '@mui/icons-material/RefreshRounded'

// import { getMyBookings } from '../services/bookingService'
// import InvoiceDialog from '../components/InvoiceDialog'

// const STATUS_CFG = {
//   pending: {
//     label: 'Pending',
//     bg: '#fffbeb',
//     color: '#92400e',
//     border: '#fde68a',
//     icon: <HourglassTopRoundedIcon sx={{ fontSize: 14 }} />,
//   },
//   confirmed: {
//     label: 'Confirmed',
//     bg: '#f0fdf4',
//     color: '#166534',
//     border: '#bbf7d0',
//     icon: <CheckCircleRoundedIcon sx={{ fontSize: 14 }} />,
//   },
//   cancelled: {
//     label: 'Cancelled',
//     bg: '#fef2f2',
//     color: '#991b1b',
//     border: '#fecaca',
//     icon: <CancelRoundedIcon sx={{ fontSize: 14 }} />,
//   },
//   completed: {
//     label: 'Completed',
//     bg: '#ecfeff',
//     color: '#155e75',
//     border: '#a5f3fc',
//     icon: <CheckCircleRoundedIcon sx={{ fontSize: 14 }} />,
//   },
// }

// const fmtDate = (value) =>
//   value
//     ? new Date(value).toLocaleDateString('en-IN', {
//         day: '2-digit',
//         month: 'short',
//         year: 'numeric',
//       })
//     : '—'

// const fmtMoney = (value) =>
//   `₹${Number(value || 0).toLocaleString('en-IN')}`

// const shortText = (value) => {
//   if (!value) return '—'
//   const s = String(value)
//   return s.length > 16 ? `${s.slice(0, 8)}...${s.slice(-4)}` : s
// }

// function CopyBtn({ value }) {
//   const [copied, setCopied] = useState(false)

//   const handleCopy = async (e) => {
//     e.stopPropagation()
//     try {
//       await navigator.clipboard.writeText(String(value ?? ''))
//       setCopied(true)
//       setTimeout(() => setCopied(false), 1200)
//     } catch (_) {}
//   }

//   return (
//     <Tooltip title={copied ? 'Copied' : 'Copy'}>
//       <IconButton
//         size="small"
//         onClick={handleCopy}
//         sx={{
//           p: 0.4,
//           color: copied ? '#0f766e' : '#94a3b8',
//           '&:hover': { color: '#0f766e', background: 'transparent' },
//         }}
//       >
//         <ContentCopyRoundedIcon sx={{ fontSize: 15 }} />
//       </IconButton>
//     </Tooltip>
//   )
// }

// function Row({ label, value, action }) {
//   if (value === null || value === undefined || value === '') return null

//   return (
//     <Stack
//       direction="row"
//       justifyContent="space-between"
//       alignItems="center"
//       sx={{
//         py: 1,
//         borderBottom: '1px solid #f1f5f9',
//       }}
//     >
//       <Typography sx={{ fontSize: '0.82rem', color: '#64748b', fontWeight: 600 }}>
//         {label}
//       </Typography>

//       <Stack direction="row" spacing={0.4} alignItems="center">
//         <Typography sx={{ fontSize: '0.82rem', color: '#0f172a', fontWeight: 800 }}>
//           {value}
//         </Typography>
//         {action}
//       </Stack>
//     </Stack>
//   )
// }

// function BookingCard({ booking, onOpenInvoice }) {
//   const [expanded, setExpanded] = useState(false)

//   const listing = booking?.listing || {}
//   const payment = booking?.payment || {}

//   const isProperty = String(listing?.type || '').toLowerCase() === 'property'
//   const status = STATUS_CFG[String(booking?.status || 'pending').toLowerCase()] || STATUS_CFG.pending

//   return (
//     <Box
//       sx={{
//         background: '#fff',
//         borderRadius: '22px',
//         border: '1px solid #e2e8f0',
//         overflow: 'hidden',
//         boxShadow: '0 10px 30px rgba(15,23,42,0.06)',
//       }}
//     >
//       <Box sx={{ height: 5, background: 'linear-gradient(90deg,#0f766e,#14b8a6,#22d3ee)' }} />

//       <Box sx={{ p: 2.5 }}>
//         <Stack direction="row" justifyContent="space-between" alignItems="flex-start" spacing={1.5}>
//           <Stack direction="row" spacing={1.5} alignItems="center" sx={{ minWidth: 0 }}>
//             <Box
//               sx={{
//                 width: 56,
//                 height: 56,
//                 borderRadius: '16px',
//                 background: 'rgba(15,118,110,0.08)',
//                 display: 'grid',
//                 placeItems: 'center',
//                 color: '#0f766e',
//                 flexShrink: 0,
//               }}
//             >
//               {isProperty ? <HomeWorkRoundedIcon /> : <DirectionsCarRoundedIcon />}
//             </Box>

//             <Box sx={{ minWidth: 0 }}>
//               <Typography
//                 noWrap
//                 sx={{ fontWeight: 900, fontSize: '1rem', color: '#0f172a' }}
//               >
//                 {listing?.title || booking?.title || 'Booking'}
//               </Typography>

//               <Typography
//                 noWrap
//                 sx={{ mt: 0.4, fontSize: '0.82rem', color: '#64748b', fontWeight: 600 }}
//               >
//                 {listing?.location || 'Location not available'}
//               </Typography>
//             </Box>
//           </Stack>

//           <Chip
//             icon={status.icon}
//             label={status.label}
//             sx={{
//               bgcolor: status.bg,
//               color: status.color,
//               border: `1px solid ${status.border}`,
//               fontWeight: 800,
//               '& .MuiChip-icon': { color: status.color },
//             }}
//           />
//         </Stack>

//         <Box sx={{ mt: 2 }}>
//           <Row
//             label="Booking ID"
//             value={shortText(booking?.id || booking?.booking_id)}
//             action={<CopyBtn value={booking?.id || booking?.booking_id} />}
//           />
//           <Row label="Amount Paid" value={fmtMoney(payment?.amount || booking?.amount)} />
//           <Row label="Payment Method" value={payment?.payment_method || 'Razorpay'} />
//           <Row label="Booked On" value={fmtDate(booking?.created_at)} />
//         </Box>

//         <Stack direction="row" spacing={1.2} flexWrap="wrap" sx={{ mt: 2.5 }}>
//           <Button
//             startIcon={<ReceiptLongRoundedIcon />}
//             variant="contained"
//             onClick={() => onOpenInvoice?.(booking)}
//             sx={{
//               borderRadius: '12px',
//               textTransform: 'none',
//               fontWeight: 800,
//               background: 'linear-gradient(135deg, #0f766e, #0d9488)',
//               boxShadow: '0 8px 18px rgba(15,118,110,0.25)',
//               '&:hover': {
//                 background: 'linear-gradient(135deg, #0a5c55, #0f766e)',
//               },
//             }}
//           >
//             Invoice
//           </Button>

//           <Button
//             variant="outlined"
//             onClick={() => setExpanded((prev) => !prev)}
//             endIcon={expanded ? <KeyboardArrowUpRoundedIcon /> : <KeyboardArrowDownRoundedIcon />}
//             sx={{
//               borderRadius: '12px',
//               textTransform: 'none',
//               fontWeight: 700,
//               color: '#475569',
//               borderColor: '#cbd5e1',
//             }}
//           >
//             {expanded ? 'Less' : 'More'}
//           </Button>
//         </Stack>

//         <Collapse in={expanded}>
//           <Box sx={{ pt: 2 }}>
//             <Row label="Item Name" value={listing?.title || '—'} />
//             <Row label="Listing ID" value={listing?.id || '—'} />
//             <Row label="Type" value={listing?.type || '—'} />
//             <Row label="Payment ID" value={payment?.payment_id || payment?.razorpay_payment_id || '—'} />
//             <Row label="Payment Status" value={payment?.payment_status || booking?.status || '—'} />
//             <Row label="Updated On" value={fmtDate(booking?.updated_at)} />
//           </Box>
//         </Collapse>
//       </Box>
//     </Box>
//   )
// }

// export default function MyBookingsPage() {
//   const navigate = useNavigate()

//   const [bookings, setBookings] = useState([])
//   const [loading, setLoading] = useState(true)
//   const [error, setError] = useState('')
//   const [search, setSearch] = useState('')

//   const [invoiceOpen, setInvoiceOpen] = useState(false)
//   const [selectedInvoiceBooking, setSelectedInvoiceBooking] = useState(null)

//   const handleOpenInvoice = (booking) => {
//     setSelectedInvoiceBooking(booking)
//     setInvoiceOpen(true)
//   }

//   const handleCloseInvoice = () => {
//     setInvoiceOpen(false)
//     setSelectedInvoiceBooking(null)
//   }

//   const fetchBookings = async () => {
//     try {
//       setLoading(true)
//       setError('')
//       const data = await getMyBookings()
//       setBookings(Array.isArray(data) ? data : data?.bookings || [])
//     } catch (err) {
//       setError('Failed to load bookings.')
//     } finally {
//       setLoading(false)
//     }
//   }

//   useEffect(() => {
//     fetchBookings()
//   }, [])

//   const filtered = useMemo(() => {
//     const q = search.trim().toLowerCase()

//     return bookings.filter((b) => {
//       if (!q) return true

//       const listing = b?.listing || {}
//       const payment = b?.payment || {}

//       return (
//         String(b?.id || b?.booking_id || '').toLowerCase().includes(q) ||
//         String(listing?.title || '').toLowerCase().includes(q) ||
//         String(listing?.location || '').toLowerCase().includes(q) ||
//         String(payment?.payment_id || payment?.razorpay_payment_id || '').toLowerCase().includes(q)
//       )
//     })
//   }, [bookings, search])

//   return (
//     <Box sx={{ minHeight: '100vh', background: '#f8fafc', pb: 10 }}>
//       <Box
//         sx={{
//           background: 'rgba(255,255,255,0.92)',
//           backdropFilter: 'blur(12px)',
//           borderBottom: '1px solid #e2e8f0',
//           px: { xs: 2, sm: 3 },
//           py: 2,
//           position: 'sticky',
//           top: 0,
//           zIndex: 10,
//         }}
//       >
//         <Stack direction="row" justifyContent="space-between" alignItems="center">
//           <Stack direction="row" spacing={1.5} alignItems="center">
//             <IconButton
//               onClick={() => navigate(-1)}
//               sx={{ border: '1px solid #e2e8f0', borderRadius: '12px', background: '#fff' }}
//             >
//               <ArrowBackRoundedIcon />
//             </IconButton>

//             <Box>
//               <Typography sx={{ fontWeight: 900, fontSize: '1rem', color: '#0f172a' }}>
//                 My Bookings
//               </Typography>
//               <Typography sx={{ fontSize: '0.8rem', color: '#64748b' }}>
//                 Track all your bookings
//               </Typography>
//             </Box>
//           </Stack>

//           <Stack direction="row" spacing={1} alignItems="center">
//             <Chip
//               label={`${filtered.length} bookings`}
//               sx={{
//                 display: { xs: 'none', sm: 'inline-flex' },
//                 borderRadius: '10px',
//                 fontWeight: 800,
//                 bgcolor: 'rgba(15,118,110,0.08)',
//                 color: '#0f766e',
//               }}
//             />
//             <IconButton
//               onClick={fetchBookings}
//               sx={{ border: '1px solid #e2e8f0', borderRadius: '12px', background: '#fff' }}
//             >
//               <RefreshRoundedIcon />
//             </IconButton>
//           </Stack>
//         </Stack>
//       </Box>

//       <Box sx={{ maxWidth: 1100, mx: 'auto', px: { xs: 2, sm: 3 }, pt: 3.5 }}>
//         {error && (
//           <Alert severity="error" sx={{ mb: 3, borderRadius: '14px' }}>
//             {error}
//           </Alert>
//         )}

//         <TextField
//           fullWidth
//           placeholder="Search by Booking ID, item name, location or payment ID"
//           value={search}
//           onChange={(e) => setSearch(e.target.value)}
//           InputProps={{
//             startAdornment: (
//               <InputAdornment position="start">
//                 <SearchRoundedIcon sx={{ color: '#94a3b8' }} />
//               </InputAdornment>
//             ),
//           }}
//           sx={{
//             mb: 3,
//             '& .MuiOutlinedInput-root': {
//               borderRadius: '16px',
//               background: '#fff',
//             },
//           }}
//         />

//         {loading ? (
//           <Typography sx={{ color: '#64748b', fontWeight: 700 }}>Loading bookings...</Typography>
//         ) : filtered.length === 0 ? (
//           <Box
//             sx={{
//               background: '#fff',
//               border: '1px solid #e2e8f0',
//               borderRadius: '24px',
//               py: 8,
//               textAlign: 'center',
//             }}
//           >
//             <Typography sx={{ fontWeight: 900, color: '#0f172a', fontSize: '1.05rem' }}>
//               No bookings found
//             </Typography>
//             <Typography sx={{ mt: 1, color: '#64748b' }}>
//               Try another search term or refresh the page.
//             </Typography>
//           </Box>
//         ) : (
//           <Grid container spacing={3}>
//             {filtered.map((booking) => (
//               <Grid item xs={12} md={6} key={booking?.id || booking?.booking_id}>
//                 <BookingCard booking={booking} onOpenInvoice={handleOpenInvoice} />
//               </Grid>
//             ))}
//           </Grid>
//         )}
//       </Box>

//       <InvoiceDialog
//         open={invoiceOpen}
//         onClose={handleCloseInvoice}
//         booking={selectedInvoiceBooking}
//       />
//     </Box>
//   )
// }




// src/dashboard/MyBookingsPage.jsx
import { useEffect, useMemo, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import {
  Alert,
  Box,
  Button,
  Chip,
  Collapse,
  Grid,
  IconButton,
  InputAdornment,
  Stack,
  TextField,
  Tooltip,
  Typography,
} from '@mui/material'

import ArrowBackRoundedIcon from '@mui/icons-material/ArrowBackRounded'
import DirectionsCarRoundedIcon from '@mui/icons-material/DirectionsCarRounded'
import HomeWorkRoundedIcon from '@mui/icons-material/HomeWorkRounded'
import CheckCircleRoundedIcon from '@mui/icons-material/CheckCircleRounded'
import CancelRoundedIcon from '@mui/icons-material/CancelRounded'
import HourglassTopRoundedIcon from '@mui/icons-material/HourglassTopRounded'
import ReceiptLongRoundedIcon from '@mui/icons-material/ReceiptLongRounded'
import SearchRoundedIcon from '@mui/icons-material/SearchRounded'
import ContentCopyRoundedIcon from '@mui/icons-material/ContentCopyRounded'
import KeyboardArrowDownRoundedIcon from '@mui/icons-material/KeyboardArrowDownRounded'
import KeyboardArrowUpRoundedIcon from '@mui/icons-material/KeyboardArrowUpRounded'
import RefreshRoundedIcon from '@mui/icons-material/RefreshRounded'

import { getMyBookings } from '../services/bookingService'
import InvoiceDialog from '../components/InvoiceDialog'

const FILTERS = ['All', 'Confirmed', 'Pending', 'Completed', 'Cancelled']

const STATUS_CFG = {
  pending: {
    label: 'Pending',
    bg: '#fffbeb',
    color: '#92400e',
    border: '#fde68a',
    icon: <HourglassTopRoundedIcon sx={{ fontSize: 14 }} />,
  },
  confirmed: {
    label: 'Confirmed',
    bg: '#f0fdf4',
    color: '#166534',
    border: '#bbf7d0',
    icon: <CheckCircleRoundedIcon sx={{ fontSize: 14 }} />,
  },
  cancelled: {
    label: 'Cancelled',
    bg: '#fef2f2',
    color: '#991b1b',
    border: '#fecaca',
    icon: <CancelRoundedIcon sx={{ fontSize: 14 }} />,
  },
  completed: {
    label: 'Completed',
    bg: '#ecfeff',
    color: '#155e75',
    border: '#a5f3fc',
    icon: <CheckCircleRoundedIcon sx={{ fontSize: 14 }} />,
  },
}

const fmtDate = (value) =>
  value
    ? new Date(value).toLocaleDateString('en-IN', {
        day: '2-digit',
        month: 'short',
        year: 'numeric',
      })
    : '—'

const fmtMoney = (value) =>
  `₹${Number(value || 0).toLocaleString('en-IN')}`

const shortText = (value) => {
  if (!value) return '—'
  const s = String(value)
  return s.length > 16 ? `${s.slice(0, 8)}...${s.slice(-4)}` : s
}

function CopyBtn({ value }) {
  const [copied, setCopied] = useState(false)

  const handleCopy = async (e) => {
    e.stopPropagation()
    try {
      await navigator.clipboard.writeText(String(value ?? ''))
      setCopied(true)
      setTimeout(() => setCopied(false), 1200)
    } catch (_) {}
  }

  return (
    <Tooltip title={copied ? 'Copied' : 'Copy'}>
      <IconButton
        size="small"
        onClick={handleCopy}
        sx={{
          p: 0.4,
          color: copied ? '#0f766e' : '#94a3b8',
          '&:hover': {
            color: '#0f766e',
            background: 'rgba(15,118,110,0.06)',
          },
        }}
      >
        <ContentCopyRoundedIcon sx={{ fontSize: 15 }} />
      </IconButton>
    </Tooltip>
  )
}

function DetailRow({ label, value, action, accent = false }) {
  if (value === null || value === undefined || value === '') return null

  return (
    <Stack
      direction="row"
      alignItems="center"
      justifyContent="space-between"
      sx={{
        py: 1.1,
        borderBottom: '1px solid rgba(226,232,240,0.85)',
        '&:last-child': { borderBottom: 'none' },
        gap: 1,
      }}
    >
      <Typography
        sx={{
          fontSize: '0.79rem',
          color: '#64748b',
          fontWeight: 600,
          flexShrink: 0,
        }}
      >
        {label}
      </Typography>

      <Stack direction="row" spacing={0.5} alignItems="center" sx={{ minWidth: 0 }}>
        <Typography
          noWrap
          sx={{
            fontSize: '0.82rem',
            color: accent ? '#0f766e' : '#0f172a',
            fontWeight: accent ? 900 : 800,
            textAlign: 'right',
            maxWidth: 180,
          }}
        >
          {value}
        </Typography>
        {action}
      </Stack>
    </Stack>
  )
}

function MetricCard({ label, value, bg, color, border }) {
  return (
    <Box
      sx={{
        flex: 1,
        minWidth: { xs: 'calc(50% - 8px)', md: 160 },
        p: 2,
        borderRadius: '20px',
        background: bg,
        border: `1px solid ${border}`,
        boxShadow: '0 10px 24px rgba(15,23,42,0.04)',
      }}
    >
      <Typography
        sx={{
          fontSize: '0.74rem',
          color: '#64748b',
          fontWeight: 700,
          textTransform: 'uppercase',
          letterSpacing: '.07em',
          mb: 0.7,
        }}
      >
        {label}
      </Typography>

      <Typography
        sx={{
          fontSize: '1.45rem',
          fontWeight: 900,
          color,
          lineHeight: 1,
        }}
      >
        {value}
      </Typography>
    </Box>
  )
}

function EmptyState() {
  return (
    <Box
      sx={{
        background: '#fff',
        border: '1px solid #e2e8f0',
        borderRadius: '28px',
        py: 9,
        px: 3,
        textAlign: 'center',
        boxShadow: '0 12px 30px rgba(15,23,42,0.04)',
      }}
    >
      <Box
        sx={{
          width: 72,
          height: 72,
          mx: 'auto',
          mb: 2.5,
          borderRadius: '22px',
          background: 'linear-gradient(135deg, rgba(15,118,110,0.12), rgba(34,211,238,0.12))',
          display: 'grid',
          placeItems: 'center',
          color: '#0f766e',
        }}
      >
        <ReceiptLongRoundedIcon sx={{ fontSize: 34 }} />
      </Box>

      <Typography sx={{ fontSize: '1.08rem', fontWeight: 900, color: '#0f172a' }}>
        No bookings found
      </Typography>

      <Typography sx={{ mt: 1, color: '#64748b', maxWidth: 420, mx: 'auto' }}>
        Try another search term or refresh the page to load your latest bookings.
      </Typography>
    </Box>
  )
}

function BookingCard({ booking, onOpenInvoice }) {
  const [expanded, setExpanded] = useState(false)

  const listing = booking?.listing || {}
  const payment = booking?.payment || {}

  const isProperty = String(listing?.type || '').toLowerCase() === 'property'
  const statusKey = String(booking?.status || payment?.payment_status || 'pending').toLowerCase()
  const status = STATUS_CFG[statusKey] || STATUS_CFG.pending

  const title = listing?.title || booking?.title || (isProperty ? 'Property Booking' : 'Vehicle Booking')
  const location = listing?.location || 'Location not available'
  const bookingId = booking?.id || booking?.booking_id || '—'
  const amount = payment?.amount || booking?.amount || listing?.price || 0
  const paymentId = payment?.payment_id || payment?.razorpay_payment_id || '—'

  return (
    <Box
      sx={{
        width: '100%',
        display: 'flex',
      }}
    >
      <Box
        sx={{
          width: '100%',
          background: '#fff',
          borderRadius: '26px',
          border: '1px solid #e2e8f0',
          overflow: 'hidden',
          boxShadow: '0 18px 40px rgba(15,23,42,0.05)',
          display: 'flex',
          flexDirection: 'column',
          transition: 'transform .18s ease, box-shadow .18s ease',
          '&:hover': {
            transform: 'translateY(-2px)',
            boxShadow: '0 24px 46px rgba(15,23,42,0.08)',
          },
        }}
      >
        <Box
          sx={{
            height: 6,
            background: 'linear-gradient(90deg,#0f766e,#14b8a6,#22d3ee)',
          }}
        />

        <Box
          sx={{
            p: 2.5,
            background:
              'linear-gradient(180deg, rgba(240,253,250,0.95) 0%, rgba(255,255,255,1) 70%)',
          }}
        >
          <Stack direction="row" justifyContent="space-between" alignItems="flex-start" spacing={1.5}>
            <Stack direction="row" spacing={1.5} alignItems="center" sx={{ minWidth: 0 }}>
              <Box
                sx={{
                  width: 58,
                  height: 58,
                  borderRadius: '18px',
                  background: 'rgba(15,118,110,0.08)',
                  display: 'grid',
                  placeItems: 'center',
                  color: '#0f766e',
                  flexShrink: 0,
                  boxShadow: 'inset 0 0 0 1px rgba(15,118,110,0.08)',
                }}
              >
                {isProperty ? (
                  <HomeWorkRoundedIcon sx={{ fontSize: 26 }} />
                ) : (
                  <DirectionsCarRoundedIcon sx={{ fontSize: 26 }} />
                )}
              </Box>

              <Box sx={{ minWidth: 0 }}>
                <Typography
                  noWrap
                  sx={{
                    fontWeight: 900,
                    fontSize: '1.02rem',
                    color: '#0f172a',
                    lineHeight: 1.2,
                  }}
                >
                  {title}
                </Typography>

                <Typography
                  noWrap
                  sx={{
                    mt: 0.55,
                    fontSize: '0.82rem',
                    color: '#64748b',
                    fontWeight: 600,
                  }}
                >
                  {location}
                </Typography>

                <Stack direction="row" spacing={0.8} alignItems="center" sx={{ mt: 1 }}>
                  <Chip
                    size="small"
                    label={isProperty ? 'Property' : 'Vehicle'}
                    sx={{
                      height: 24,
                      borderRadius: '999px',
                      bgcolor: 'rgba(15,118,110,0.08)',
                      color: '#0f766e',
                      fontWeight: 800,
                    }}
                  />
                  <Typography sx={{ fontSize: '0.75rem', color: '#94a3b8', fontWeight: 700 }}>
                    {fmtDate(booking?.created_at)}
                  </Typography>
                </Stack>
              </Box>
            </Stack>

            <Stack alignItems="flex-end" spacing={1}>
              <Chip
                icon={status.icon}
                label={status.label}
                sx={{
                  bgcolor: status.bg,
                  color: status.color,
                  border: `1px solid ${status.border}`,
                  fontWeight: 800,
                  '& .MuiChip-icon': { color: status.color },
                }}
              />

              <Box
                sx={{
                  px: 1.4,
                  py: 0.9,
                  borderRadius: '16px',
                  background: '#fff',
                  border: '1px solid #e2e8f0',
                  boxShadow: '0 6px 14px rgba(15,23,42,0.04)',
                }}
              >
                <Typography
                  sx={{
                    fontSize: '0.68rem',
                    color: '#94a3b8',
                    fontWeight: 800,
                    textTransform: 'uppercase',
                    letterSpacing: '.08em',
                    textAlign: 'right',
                  }}
                >
                  Amount
                </Typography>
                <Typography
                  sx={{
                    fontSize: '1rem',
                    color: '#0f172a',
                    fontWeight: 900,
                    lineHeight: 1.1,
                    textAlign: 'right',
                  }}
                >
                  {fmtMoney(amount)}
                </Typography>
              </Box>
            </Stack>
          </Stack>
        </Box>

        <Box sx={{ px: 2.5, pb: 1.3 }}>
          <Box
            sx={{
              p: 1.5,
              borderRadius: '18px',
              background: 'rgba(248,250,252,0.95)',
              border: '1px solid #eef2f7',
            }}
          >
            <DetailRow
              label="Booking ID"
              value={shortText(bookingId)}
              action={<CopyBtn value={bookingId} />}
            />
            <DetailRow
              label="Amount Paid"
              value={fmtMoney(amount)}
              accent
            />
            <DetailRow
              label="Payment Method"
              value={payment?.payment_method || 'Razorpay'}
            />
            <DetailRow
              label="Booked On"
              value={fmtDate(booking?.created_at)}
            />
          </Box>
        </Box>

        <Box sx={{ px: 2.5, pb: 2 }}>
          <Box
            sx={{
              p: 1.35,
              mb: 1.8,
              borderRadius: '16px',
              background: 'linear-gradient(135deg, rgba(15,118,110,0.06), rgba(34,211,238,0.05))',
              border: '1px solid rgba(15,118,110,0.12)',
            }}
          >
            <Typography sx={{ fontSize: '0.76rem', fontWeight: 800, color: '#0f766e' }}>
              Payment verified and invoice-ready
            </Typography>
            <Typography sx={{ fontSize: '0.76rem', color: '#64748b', mt: 0.35 }}>
              Open the professional invoice view to print or download the report.
            </Typography>
          </Box>

          <Stack direction="row" spacing={1.1} flexWrap="wrap">
            <Button
              startIcon={<ReceiptLongRoundedIcon />}
              variant="contained"
              onClick={() => onOpenInvoice?.(booking)}
              sx={{
                borderRadius: '14px',
                textTransform: 'none',
                fontWeight: 800,
                px: 1.8,
                py: 1.05,
                background: 'linear-gradient(135deg, #0f766e, #0d9488)',
                boxShadow: '0 10px 18px rgba(15,118,110,0.24)',
                '&:hover': {
                  background: 'linear-gradient(135deg, #0a5c55, #0f766e)',
                },
              }}
            >
              Open Invoice
            </Button>

            <Button
              variant="outlined"
              onClick={() => setExpanded((prev) => !prev)}
              endIcon={expanded ? <KeyboardArrowUpRoundedIcon /> : <KeyboardArrowDownRoundedIcon />}
              sx={{
                borderRadius: '14px',
                textTransform: 'none',
                fontWeight: 800,
                color: '#475569',
                borderColor: '#cbd5e1',
                px: 1.8,
                py: 1.05,
                '&:hover': {
                  borderColor: '#94a3b8',
                  background: '#f8fafc',
                },
              }}
            >
              {expanded ? 'Hide details' : 'More details'}
            </Button>
          </Stack>

          <Collapse in={expanded}>
            <Box
              sx={{
                mt: 1.8,
                p: 1.5,
                borderRadius: '18px',
                background: '#fff',
                border: '1px solid #eef2f7',
              }}
            >
              <DetailRow label="Item Name" value={listing?.title || '—'} />
              <DetailRow label="Listing ID" value={listing?.id || '—'} />
              <DetailRow label="Type" value={listing?.type || '—'} />
              <DetailRow label="Payment ID" value={paymentId} />
              <DetailRow label="Payment Status" value={payment?.payment_status || booking?.status || '—'} />
              <DetailRow label="Updated On" value={fmtDate(booking?.updated_at)} />
            </Box>
          </Collapse>
        </Box>
      </Box>
    </Box>
  )
}

export default function MyBookingsPage() {
  const navigate = useNavigate()

  const [bookings, setBookings] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [search, setSearch] = useState('')
  const [activeFilter, setActiveFilter] = useState('All')

  const [invoiceOpen, setInvoiceOpen] = useState(false)
  const [selectedInvoiceBooking, setSelectedInvoiceBooking] = useState(null)

  const handleOpenInvoice = (booking) => {
    setSelectedInvoiceBooking(booking)
    setInvoiceOpen(true)
  }

  const handleCloseInvoice = () => {
    setInvoiceOpen(false)
    setSelectedInvoiceBooking(null)
  }

  const fetchBookings = async () => {
    try {
      setLoading(true)
      setError('')
      const data = await getMyBookings()
      setBookings(Array.isArray(data) ? data : data?.bookings || [])
    } catch (err) {
      setError('Failed to load bookings.')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchBookings()
  }, [])

  const stats = useMemo(() => {
    const total = bookings.length
    const confirmed = bookings.filter((b) => String(b?.status || '').toLowerCase() === 'confirmed').length
    const pending = bookings.filter((b) => String(b?.status || '').toLowerCase() === 'pending').length
    const completed = bookings.filter((b) => String(b?.status || '').toLowerCase() === 'completed').length
    const cancelled = bookings.filter((b) => String(b?.status || '').toLowerCase() === 'cancelled').length

    return { total, confirmed, pending, completed, cancelled }
  }, [bookings])

  const filtered = useMemo(() => {
    const q = search.trim().toLowerCase()

    return bookings.filter((b) => {
      const listing = b?.listing || {}
      const payment = b?.payment || {}
      const status = String(b?.status || '').toLowerCase()

      const matchesFilter =
        activeFilter === 'All' || status === activeFilter.toLowerCase()

      const matchesSearch =
        !q ||
        String(b?.id || b?.booking_id || '').toLowerCase().includes(q) ||
        String(listing?.title || '').toLowerCase().includes(q) ||
        String(listing?.location || '').toLowerCase().includes(q) ||
        String(payment?.payment_id || payment?.razorpay_payment_id || '')
          .toLowerCase()
          .includes(q)

      return matchesFilter && matchesSearch
    })
  }, [bookings, search, activeFilter])

  return (
    <Box
      sx={{
        minHeight: '100vh',
        background:
          'linear-gradient(180deg, #f8fafc 0%, #f8fafc 45%, #f0fdfa 100%)',
        pb: 10,
      }}
    >
      <Box
        sx={{
          background: 'rgba(255,255,255,0.82)',
          backdropFilter: 'blur(16px)',
          borderBottom: '1px solid rgba(226,232,240,0.9)',
          px: { xs: 2, sm: 3.5 },
          py: 2,
          position: 'sticky',
          top: 0,
          zIndex: 20,
        }}
      >
        <Stack direction="row" justifyContent="space-between" alignItems="center" spacing={2}>
          <Stack direction="row" spacing={1.5} alignItems="center">
            <IconButton
              onClick={() => navigate(-1)}
              sx={{
                border: '1px solid #e2e8f0',
                borderRadius: '14px',
                background: '#fff',
                boxShadow: '0 6px 14px rgba(15,23,42,0.04)',
              }}
            >
              <ArrowBackRoundedIcon />
            </IconButton>

            <Box>
              <Typography sx={{ fontWeight: 900, fontSize: '1.02rem', color: '#0f172a' }}>
                My Bookings
              </Typography>
              <Typography sx={{ fontSize: '0.8rem', color: '#64748b', mt: 0.2 }}>
                Track, search, and open professional invoices for your bookings
              </Typography>
            </Box>
          </Stack>

          <Stack direction="row" spacing={1} alignItems="center">
            <Chip
              label={`${filtered.length} bookings`}
              sx={{
                display: { xs: 'none', sm: 'inline-flex' },
                borderRadius: '12px',
                fontWeight: 800,
                bgcolor: 'rgba(15,118,110,0.08)',
                color: '#0f766e',
                border: '1px solid rgba(15,118,110,0.12)',
              }}
            />
            <IconButton
              onClick={fetchBookings}
              sx={{
                border: '1px solid #e2e8f0',
                borderRadius: '14px',
                background: '#fff',
                boxShadow: '0 6px 14px rgba(15,23,42,0.04)',
              }}
            >
              <RefreshRoundedIcon />
            </IconButton>
          </Stack>
        </Stack>
      </Box>

      <Box sx={{ maxWidth: 1180, mx: 'auto', px: { xs: 2, sm: 3.5 }, pt: 3.5 }}>
        {error && (
          <Alert severity="error" sx={{ mb: 3, borderRadius: '16px' }}>
            {error}
          </Alert>
        )}

        <Box
          sx={{
            mb: 3,
            p: { xs: 2, sm: 2.4 },
            borderRadius: '28px',
            background: 'linear-gradient(135deg, #ffffff 0%, #f8fafc 100%)',
            border: '1px solid #e2e8f0',
            boxShadow: '0 14px 30px rgba(15,23,42,0.04)',
          }}
        >
          <Stack spacing={2.2}>
            <Stack
              direction={{ xs: 'column', lg: 'row' }}
              spacing={2}
              justifyContent="space-between"
              alignItems={{ xs: 'stretch', lg: 'center' }}
            >
              <TextField
                fullWidth
                placeholder="Search by Booking ID, item name, location or payment ID"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <SearchRoundedIcon sx={{ color: '#94a3b8' }} />
                    </InputAdornment>
                  ),
                }}
                sx={{
                  '& .MuiOutlinedInput-root': {
                    height: 52,
                    borderRadius: '16px',
                    background: '#fff',
                    '& fieldset': { borderColor: '#e2e8f0' },
                    '&:hover fieldset': { borderColor: '#94a3b8' },
                    '&.Mui-focused fieldset': { borderColor: '#0f766e' },
                  },
                }}
              />

              <Stack direction="row" spacing={1} flexWrap="wrap" useFlexGap>
                {FILTERS.map((filter) => {
                  const active = activeFilter === filter
                  return (
                    <Button
                      key={filter}
                      size="small"
                      onClick={() => setActiveFilter(filter)}
                      sx={{
                        minWidth: 'fit-content',
                        px: 1.6,
                        py: 1,
                        borderRadius: '999px',
                        textTransform: 'none',
                        fontWeight: active ? 900 : 700,
                        color: active ? '#0f766e' : '#475569',
                        background: active ? 'rgba(15,118,110,0.10)' : '#fff',
                        border: `1px solid ${
                          active ? 'rgba(15,118,110,0.22)' : '#e2e8f0'
                        }`,
                        '&:hover': {
                          background: active ? 'rgba(15,118,110,0.12)' : '#f8fafc',
                        },
                      }}
                    >
                      {filter}
                    </Button>
                  )
                })}
              </Stack>
            </Stack>

            <Stack direction="row" spacing={1.4} flexWrap="wrap" useFlexGap>
              <MetricCard
                label="Total"
                value={stats.total}
                bg="#ffffff"
                color="#0f172a"
                border="#e2e8f0"
              />
              <MetricCard
                label="Confirmed"
                value={stats.confirmed}
                bg="#f0fdf4"
                color="#166534"
                border="#bbf7d0"
              />
              <MetricCard
                label="Pending"
                value={stats.pending}
                bg="#fffbeb"
                color="#92400e"
                border="#fde68a"
              />
              <MetricCard
                label="Completed"
                value={stats.completed}
                bg="#ecfeff"
                color="#155e75"
                border="#a5f3fc"
              />
              <MetricCard
                label="Cancelled"
                value={stats.cancelled}
                bg="#fef2f2"
                color="#991b1b"
                border="#fecaca"
              />
            </Stack>
          </Stack>
        </Box>

        {loading ? (
          <Box
            sx={{
              p: 4,
              borderRadius: '24px',
              background: '#fff',
              border: '1px solid #e2e8f0',
            }}
          >
            <Typography sx={{ color: '#64748b', fontWeight: 700 }}>
              Loading bookings...
            </Typography>
          </Box>
        ) : filtered.length === 0 ? (
          <EmptyState />
        ) : (
          <Grid container spacing={3} alignItems="stretch">
            {filtered.map((booking) => (
              <Grid item xs={12} md={6} key={booking?.id || booking?.booking_id} sx={{ display: 'flex' }}>
                <BookingCard booking={booking} onOpenInvoice={handleOpenInvoice} />
              </Grid>
            ))}
          </Grid>
        )}
      </Box>

      <InvoiceDialog
        open={invoiceOpen}
        onClose={handleCloseInvoice}
        booking={selectedInvoiceBooking}
      />
    </Box>
  )
}