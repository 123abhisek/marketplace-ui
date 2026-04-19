
// src/components/BookingModal.jsx
import { useState } from 'react'
import {
  Box, Button, CircularProgress, Dialog,
  Divider, IconButton, Stack, Typography,
} from '@mui/material'
import CloseRoundedIcon        from '@mui/icons-material/CloseRounded'
import ContentCopyRoundedIcon  from '@mui/icons-material/ContentCopyRounded'
import CheckCircleRoundedIcon  from '@mui/icons-material/CheckCircleRounded'
import QrCode2RoundedIcon      from '@mui/icons-material/QrCode2Rounded'
import PhoneAndroidRoundedIcon from '@mui/icons-material/PhoneAndroidRounded'
import { bookingService }      from '../services/api'
import { formatCurrency }      from '../utils/formatters'

// ─── Config ───────────────────────────────────────────────────────────────────
const UPI_ID      = 'yourapp@upi'          // ← replace with your real UPI ID
const PAYEE_NAME  = 'YourApp Bookings'     // ← replace with your payee name

// ─── QR generator via Google Charts API (no npm package needed) ───────────────
function QRImage({ upiString, size = 200 }) {
  const encoded = encodeURIComponent(upiString)
  const src     = `https://chart.googleapis.com/chart?chs=${size}x${size}&cht=qr&chl=${encoded}&choe=UTF-8`
  return (
    <Box
      component="img"
      src={src}
      alt="UPI QR Code"
      width={size}
      height={size}
      sx={{ borderRadius: '12px', border: '1.5px solid rgba(226,232,240,0.9)', display: 'block' }}
    />
  )
}

// ─── Utility ──────────────────────────────────────────────────────────────────
function copyText(text, setCopied) {
  navigator.clipboard.writeText(text).then(() => {
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  })
}

// ─── Main ─────────────────────────────────────────────────────────────────────
/**
 * BookingModal
 *
 * Props:
 *   open       {boolean}
 *   onClose    {() => void}
 *   listing    {{ id: string, title: string, type: 'property' | 'vehicle' }}
 *   amount     {number}  — booking fee in INR (e.g. 499)
 */
export default function BookingModal({ open, onClose, listing, amount = 499 }) {
  const [tab,        setTab]        = useState('qr')      // 'qr' | 'upi'
  const [upiInput,   setUpiInput]   = useState('')
  const [upiError,   setUpiError]   = useState('')
  const [loading,    setLoading]    = useState(false)
  const [success,    setSuccess]    = useState(false)
  const [refId,      setRefId]      = useState('')
  const [copied,     setCopied]     = useState(false)

  const title   = listing?.title  ?? 'Listing'
  const type    = listing?.type   ?? 'property'
  const itemId  = listing?.id     ?? ''

  // UPI deep-link string used for QR
  const upiString = `upi://pay?pa=${UPI_ID}&pn=${encodeURIComponent(PAYEE_NAME)}&am=${amount}&cu=INR&tn=${encodeURIComponent(`Booking: ${title}`)}`

  // ── Reset on close ──────────────────────────────────────────────────────────
  function handleClose() {
    setTab('qr')
    setUpiInput('')
    setUpiError('')
    setLoading(false)
    setSuccess(false)
    setRefId('')
    onClose()
  }

  // ── UPI ID validation ───────────────────────────────────────────────────────
  const UPI_REGEX = /^[a-zA-Z0-9.\-_]{2,256}@[a-zA-Z]{2,64}$/
  function validateUpi(value) {
    if (!value.trim()) return 'Please enter your UPI ID.'
    if (!UPI_REGEX.test(value.trim())) return 'Invalid UPI ID format (e.g. name@upi).'
    return ''
  }

  // ── Submit booking ──────────────────────────────────────────────────────────
  async function handleConfirm() {
    if (tab === 'upi') {
      const err = validateUpi(upiInput)
      if (err) { setUpiError(err); return }
    }

    setLoading(true)
    try {
      const res = await bookingService.create({
        item_id:    itemId,
        item_type:  type,
        amount,
        payment_method: tab === 'qr' ? 'upi_qr' : 'upi_id',
        upi_id:     tab === 'upi' ? upiInput.trim() : undefined,
      })
      setRefId(res?.booking_id ?? res?.id ?? `BK${Date.now()}`)
      setSuccess(true)
    } catch (e) {
      setUpiError(e?.response?.data?.detail ?? 'Booking failed. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  // ────────────────────────────────────────────────────────────────────────────
  return (
    <Dialog
      open={open}
      onClose={handleClose}
      maxWidth="xs"
      fullWidth
      PaperProps={{
        sx: {
          borderRadius: '20px',
          overflow: 'hidden',
          boxShadow: '0 24px 80px rgba(15,23,42,0.2)',
          m: 2,
        },
      }}
    >
      {/* ── Dark header ── */}
      <Box sx={{
        background: '#0f172a',
        px: 2.5, py: 2,
        display: 'flex', alignItems: 'center', justifyContent: 'space-between',
      }}>
        <Box sx={{ minWidth: 0 }}>
          <Typography sx={{ color: 'rgba(255,255,255,0.5)', fontSize: '0.65rem', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.08em' }}>
            Secure Payment
          </Typography>
          <Typography sx={{
            color: '#fff', fontWeight: 800, fontSize: '0.95rem',
            whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis',
            maxWidth: 240,
          }}>
            {title}
          </Typography>
        </Box>
        <IconButton
          onClick={handleClose} size="small"
          sx={{ color: 'rgba(255,255,255,0.6)', '&:hover': { color: '#fff', background: 'rgba(255,255,255,0.08)' } }}
        >
          <CloseRoundedIcon sx={{ fontSize: 20 }} />
        </IconButton>
      </Box>

      {/* ── Amount badge ── */}
      <Box sx={{ px: 2.5, pt: 2.5, pb: 0 }}>
        <Box sx={{
          display: 'inline-flex', alignItems: 'center', gap: 1,
          px: 2, py: 0.9, borderRadius: '12px',
          background: 'rgba(15,118,110,0.07)',
          border: '1.5px solid rgba(15,118,110,0.18)',
        }}>
          <Typography sx={{ fontSize: '0.72rem', color: '#0f766e', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.07em' }}>
            Booking Fee
          </Typography>
          <Typography sx={{ fontSize: '1.1rem', fontWeight: 900, color: '#0f766e' }}>
            {formatCurrency(amount)}
          </Typography>
        </Box>
      </Box>

      {/* ──────────────────── SUCCESS SCREEN ──────────────────── */}
      {success ? (
        <Box sx={{ px: 3, py: 4, textAlign: 'center' }}>
          <Box sx={{
            width: 64, height: 64, borderRadius: '50%',
            background: 'rgba(34,197,94,0.1)',
            border: '2.5px solid rgba(34,197,94,0.35)',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            mx: 'auto', mb: 2,
          }}>
            <CheckCircleRoundedIcon sx={{ fontSize: 32, color: '#16a34a' }} />
          </Box>
          <Typography sx={{ fontWeight: 900, fontSize: '1.2rem', color: '#0f172a', mb: 0.7 }}>
            Booking Confirmed!
          </Typography>
          <Typography sx={{ fontSize: '0.85rem', color: '#64748b', mb: 2.5, maxWidth: '28ch', mx: 'auto' }}>
            Your booking has been received. We'll notify you shortly.
          </Typography>

          {refId && (
            <Box sx={{
              px: 2.5, py: 2, borderRadius: '14px',
              background: '#f8fafc', border: '1.5px solid rgba(226,232,240,0.9)',
              mb: 3,
            }}>
              <Typography sx={{ fontSize: '0.68rem', color: '#94a3b8', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.07em', mb: 0.5 }}>
                Reference ID
              </Typography>
              <Stack direction="row" spacing={1} alignItems="center" justifyContent="center">
                <Typography sx={{ fontFamily: 'monospace', fontWeight: 800, fontSize: '1rem', color: '#0f172a', letterSpacing: '0.06em' }}>
                  {refId}
                </Typography>
                <IconButton
                  size="small"
                  onClick={() => copyText(refId, setCopied)}
                  sx={{ color: copied ? '#0f766e' : '#94a3b8', p: 0.4 }}
                >
                  {copied
                    ? <CheckCircleRoundedIcon sx={{ fontSize: 16 }} />
                    : <ContentCopyRoundedIcon sx={{ fontSize: 16 }} />
                  }
                </IconButton>
              </Stack>
            </Box>
          )}

          <Button
            fullWidth
            onClick={handleClose}
            sx={{
              borderRadius: '12px', py: 1.4,
              fontWeight: 800, fontSize: '0.95rem', textTransform: 'none',
              background: 'linear-gradient(135deg,#0f766e,#0d9488)',
              color: '#fff', boxShadow: '0 8px 24px rgba(15,118,110,0.22)',
              '&:hover': { background: 'linear-gradient(135deg,#0a5c55,#0f766e)' },
            }}
          >
            Done
          </Button>
        </Box>
      ) : (

      /* ──────────────────── PAYMENT SCREEN ──────────────────── */
      <Box>
        {/* Tab switcher */}
        <Box sx={{ px: 2.5, pt: 2.5, pb: 0 }}>
          <Box sx={{
            display: 'inline-flex',
            background: '#f1f5f9',
            borderRadius: '12px',
            p: '4px',
            width: '100%',
          }}>
            {[
              { key: 'qr',  label: 'Scan QR',  Icon: QrCode2RoundedIcon },
              { key: 'upi', label: 'UPI ID',   Icon: PhoneAndroidRoundedIcon },
            ].map(({ key, label, Icon }) => (
              <Box
                key={key}
                onClick={() => { setTab(key); setUpiError('') }}
                sx={{
                  flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center',
                  gap: 0.7, py: 0.9, borderRadius: '9px', cursor: 'pointer',
                  transition: 'all .18s ease',
                  background: tab === key ? '#0f172a' : 'transparent',
                  color: tab === key ? '#fff' : '#64748b',
                  fontWeight: 700,
                  fontSize: '0.82rem',
                  userSelect: 'none',
                  '&:hover': tab !== key ? { background: 'rgba(15,23,42,0.05)' } : {},
                }}
              >
                <Icon sx={{ fontSize: 16 }} />
                {label}
              </Box>
            ))}
          </Box>
        </Box>

        {/* ── QR Tab ── */}
        {tab === 'qr' && (
          <Box sx={{ px: 3, pt: 2.5, pb: 1 }}>
            <Box sx={{ display: 'flex', justifyContent: 'center', mb: 2 }}>
              <QRImage upiString={upiString} size={190} />
            </Box>

            {/* UPI ID copy row */}
            <Box sx={{
              display: 'flex', alignItems: 'center', justifyContent: 'space-between',
              px: 2, py: 1.2, borderRadius: '12px',
              background: '#f8fafc', border: '1.5px solid rgba(226,232,240,0.9)',
              mb: 2,
            }}>
              <Box>
                <Typography sx={{ fontSize: '0.66rem', color: '#94a3b8', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.07em' }}>
                  UPI ID
                </Typography>
                <Typography sx={{ fontSize: '0.88rem', fontWeight: 800, color: '#0f172a', fontFamily: 'monospace' }}>
                  {UPI_ID}
                </Typography>
              </Box>
              <IconButton
                size="small"
                onClick={() => copyText(UPI_ID, setCopied)}
                sx={{
                  color: copied ? '#0f766e' : '#94a3b8',
                  border: '1px solid rgba(226,232,240,0.9)',
                  borderRadius: '8px', p: 0.7,
                  background: copied ? 'rgba(15,118,110,0.06)' : '#fff',
                  transition: 'all .18s ease',
                }}
              >
                {copied
                  ? <CheckCircleRoundedIcon sx={{ fontSize: 16 }} />
                  : <ContentCopyRoundedIcon sx={{ fontSize: 16 }} />
                }
              </IconButton>
            </Box>

            <Typography sx={{ fontSize: '0.77rem', color: '#94a3b8', textAlign: 'center', mb: 2, lineHeight: 1.5 }}>
              Open any UPI app · Scan QR or enter UPI ID · Pay ₹{amount} · Tap "I've Paid" below
            </Typography>
          </Box>
        )}

        {/* ── UPI ID Tab ── */}
        {tab === 'upi' && (
          <Box sx={{ px: 3, pt: 2.5, pb: 1 }}>
            {/* Amount card */}
            <Box sx={{
              px: 2.5, py: 2, borderRadius: '14px',
              background: 'linear-gradient(135deg,rgba(15,118,110,0.06),rgba(15,118,110,0.02))',
              border: '1.5px solid rgba(15,118,110,0.14)',
              mb: 2.5,
            }}>
              <Stack direction="row" justifyContent="space-between" alignItems="center">
                <Box>
                  <Typography sx={{ fontSize: '0.68rem', color: '#0f766e', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.07em' }}>
                    Amount to Pay
                  </Typography>
                  <Typography sx={{ fontSize: '1.6rem', fontWeight: 900, color: '#0f766e', letterSpacing: '-0.04em', lineHeight: 1.1, mt: 0.3 }}>
                    ₹{amount}
                  </Typography>
                </Box>
                <Typography sx={{ fontSize: '0.72rem', color: '#64748b', fontWeight: 500, maxWidth: '14ch', textAlign: 'right', lineHeight: 1.5 }}>
                  Pay to:<br />
                  <Box component="span" sx={{ fontWeight: 800, color: '#0f172a', fontFamily: 'monospace' }}>{UPI_ID}</Box>
                </Typography>
              </Stack>
            </Box>

            {/* Input */}
            <Box sx={{ mb: 0.5 }}>
              <Typography sx={{ fontSize: '0.72rem', fontWeight: 700, color: '#334155', textTransform: 'uppercase', letterSpacing: '0.06em', mb: 0.7 }}>
                Your UPI ID
              </Typography>
              <Box
                component="input"
                value={upiInput}
                onChange={(e) => { setUpiInput(e.target.value); if (upiError) setUpiError('') }}
                placeholder="yourname@upi"
                sx={{
                  width: '100%',
                  px: 1.8, py: 1.3,
                  borderRadius: '12px',
                  border: `1.5px solid ${upiError ? '#ef4444' : 'rgba(226,232,240,0.9)'}`,
                  outline: 'none',
                  fontSize: '0.9rem',
                  fontWeight: 600,
                  color: '#0f172a',
                  background: '#fff',
                  fontFamily: 'monospace',
                  boxSizing: 'border-box',
                  transition: 'border-color .15s ease',
                  '&:focus': {
                    borderColor: upiError ? '#ef4444' : '#0f766e',
                    boxShadow: `0 0 0 3px ${upiError ? 'rgba(239,68,68,0.12)' : 'rgba(15,118,110,0.12)'}`,
                  },
                }}
              />
              {upiError && (
                <Typography sx={{ fontSize: '0.75rem', color: '#ef4444', fontWeight: 600, mt: 0.6, ml: 0.5 }}>
                  {upiError}
                </Typography>
              )}
            </Box>

            <Typography sx={{ fontSize: '0.76rem', color: '#94a3b8', mt: 1.5, mb: 2, lineHeight: 1.5 }}>
              Enter your UPI ID, complete the payment on your UPI app, then tap "Confirm Booking".
            </Typography>
          </Box>
        )}

        <Divider sx={{ borderColor: 'rgba(226,232,240,0.7)' }} />

        {/* CTA */}
        <Box sx={{ px: 3, py: 2.5 }}>
          <Button
            fullWidth
            onClick={handleConfirm}
            disabled={loading}
            startIcon={loading ? <CircularProgress size={16} sx={{ color: '#fff' }} /> : <CheckCircleRoundedIcon sx={{ fontSize: 17 }} />}
            sx={{
              borderRadius: '12px', py: 1.5,
              fontWeight: 800, fontSize: '0.95rem', textTransform: 'none',
              background: loading ? '#94a3b8' : 'linear-gradient(135deg,#0f766e,#0d9488)',
              color: '#fff',
              boxShadow: loading ? 'none' : '0 8px 24px rgba(15,118,110,0.28)',
              '&:hover': { background: loading ? '#94a3b8' : 'linear-gradient(135deg,#0a5c55,#0f766e)', transform: loading ? 'none' : 'translateY(-1px)' },
              transition: 'all .18s ease',
            }}
          >
            {loading ? 'Processing…' : tab === 'qr' ? "I've Paid — Confirm Booking" : 'Confirm Booking'}
          </Button>
          <Typography sx={{ fontSize: '0.72rem', color: '#94a3b8', textAlign: 'center', mt: 1.5, lineHeight: 1.5 }}>
            🔒 Secured by UPI · Booking fee is non-refundable
          </Typography>
        </Box>
      </Box>
      )}
    </Dialog>
  )
}