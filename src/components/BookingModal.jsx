
// src/components/BookingModal.jsx
import { useState }                  from 'react'
import {
  Box, Button, CircularProgress, Dialog,
  Divider, IconButton, Stack, Typography,
} from '@mui/material'
import CloseRoundedIcon           from '@mui/icons-material/CloseRounded'
import ContentCopyRoundedIcon     from '@mui/icons-material/ContentCopyRounded'
import CheckCircleRoundedIcon     from '@mui/icons-material/CheckCircleRounded'
import QrCode2RoundedIcon         from '@mui/icons-material/QrCode2Rounded'
import PhoneAndroidRoundedIcon    from '@mui/icons-material/PhoneAndroidRounded'
import CreditCardRoundedIcon      from '@mui/icons-material/CreditCardRounded'
import { createOrder, verifyPayment } from '../services/paymentService'
import { formatCurrency }             from '../utils/formatters'
import { useRazorpay }                from '../hooks/useRazorpay'

// ─── Config ───────────────────────────────────────────────────────────────────
const UPI_ID     = 'yourapp@upi'
const PAYEE_NAME = 'YourApp Bookings'
const APP_NAME   = import.meta.env.VITE_APP_NAME ?? 'EasyDeal'

const TABS = [
  { key: 'razorpay', label: 'Pay Online', Icon: CreditCardRoundedIcon },
  { key: 'qr',       label: 'Scan QR',   Icon: QrCode2RoundedIcon },
  { key: 'upi',      label: 'UPI ID',    Icon: PhoneAndroidRoundedIcon },
]

// ─── Sub-components ───────────────────────────────────────────────────────────
function QRImage({ upiString, size = 200 }) {
  const src = `https://chart.googleapis.com/chart?chs=${size}x${size}&cht=qr&chl=${encodeURIComponent(upiString)}&choe=UTF-8`
  return (
    <Box
      component="img" src={src} alt="UPI QR Code"
      width={size} height={size}
      sx={{ borderRadius: '12px', border: '1.5px solid rgba(226,232,240,0.9)', display: 'block' }}
    />
  )
}

function copyText(text, setCopied) {
  navigator.clipboard.writeText(text).then(() => {
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  })
}

function MethodPill({ label }) {
  return (
    <Box sx={{
      px: 1.4, py: 0.5, borderRadius: '8px',
      background: 'rgba(15,23,42,0.05)',
      border: '1px solid rgba(15,23,42,0.08)',
      fontSize: '0.72rem', fontWeight: 700, color: '#475569', whiteSpace: 'nowrap',
    }}>
      {label}
    </Box>
  )
}

// ─── UPI validation ───────────────────────────────────────────────────────────
const UPI_REGEX = /^[a-zA-Z0-9.\-_]{2,256}@[a-zA-Z]{2,64}$/

// ─── Main Component ───────────────────────────────────────────────────────────
/**
 * BookingModal
 * Props:
 *   open      {boolean}
 *   onClose   {() => void}
 *   listing   {{ id: string, title: string, type: 'property' | 'vehicle' }}
 *   amount    {number}   Booking fee in INR — e.g. 499 (NOT paise)
 *   prefill   {{ name?: string, email?: string, contact?: string }}
 */
export default function BookingModal({ open, onClose, listing, amount = 499, prefill = {} }) {
  const [tab,      setTab]      = useState('razorpay')
  const [upiInput, setUpiInput] = useState('')
  const [upiError, setUpiError] = useState('')
  const [rzpStep,  setRzpStep]  = useState('idle')  // idle | creating | opening | verifying
  const [success,  setSuccess]  = useState(false)
  const [refId,    setRefId]    = useState('')
  const [copied,   setCopied]   = useState(false)

  const { loaded: sdkLoaded, error: sdkError } = useRazorpay()

  const title     = listing?.title ?? 'Listing'
  const type      = listing?.type  ?? 'property'
  const itemId    = listing?.id    ?? ''
  const upiString = `upi://pay?pa=${UPI_ID}&pn=${encodeURIComponent(PAYEE_NAME)}&am=${amount}&cu=INR&tn=${encodeURIComponent(`Booking: ${title}`)}`

  const isProcessing = rzpStep !== 'idle'

  // ── Reset on close ──────────────────────────────────────────────────────────
  function handleClose() {
    if (isProcessing) return
    setTab('razorpay')
    setUpiInput('')
    setUpiError('')
    setRzpStep('idle')
    setSuccess(false)
    setRefId('')
    onClose()
  }

  // ── Core Razorpay flow — used by all 3 tabs ─────────────────────────────────
  // method: undefined = show all | 'upi' = open UPI directly
  // vpa:    undefined = user picks | 'name@upi' = pre-fill UPI ID
  async function openRazorpay({ method, vpa } = {}) {
    if (!sdkLoaded) {
      setUpiError(sdkError?.message ?? 'Payment SDK not ready. Please wait and try again.')
      return
    }

    // Step 1 — Create order
    setRzpStep('creating')
    let orderData
    try {
      orderData = await createOrder({
        amountInr: amount,
        currency:  'INR',
        notes:     { listing_id: itemId, listing_type: type, title },
      })
    } catch (err) {
      setRzpStep('idle')
      setUpiError(err?.message ?? 'Could not create payment order. Please try again.')
      return
    }

    const { order_id, amount: amountPaise, currency = 'INR', key_id } = orderData

    // Step 2 — Open Razorpay checkout
    setRzpStep('opening')

    const options = {
      key:         key_id,
      amount:      amountPaise,
      currency,
      name:        APP_NAME,
      description: `Booking: ${title}`,
      order_id,
      prefill: {
        name:    prefill?.name    ?? '',
        email:   prefill?.email   ?? '',
        contact: prefill?.contact ?? '',
        // ✅ vpa pre-fills the UPI ID field in Razorpay's checkout
        ...(vpa && { vpa }),
      },
      // ✅ method pre-selects a payment method in Razorpay's checkout
      // 'upi' opens UPI screen directly — skips card/netbanking selection
      ...(method && { method }),
      theme: { color: '#0f766e' },
      modal: {
        backdropclose: false,
        escape:        false,
        ondismiss: () => {
          setRzpStep('idle')
          setUpiError('Payment was cancelled. You can try again.')
        },
      },

      // Step 3 — Verify signature
      handler: async function (response) {
        setRzpStep('verifying')
        try {
          const result = await verifyPayment({
            razorpay_payment_id: response.razorpay_payment_id,
            razorpay_order_id:   response.razorpay_order_id,
            razorpay_signature:  response.razorpay_signature,
          })
          setRefId(result.payment_id ?? response.razorpay_payment_id)
          setSuccess(true)
          setRzpStep('idle')
        } catch (err) {
          setRzpStep('idle')
          setUpiError(err?.message ?? 'Payment verification failed. Please contact support.')
        }
      },
    }

    const rzp = new window.Razorpay(options)
    rzp.on('payment.failed', (response) => {
      setRzpStep('idle')
      setUpiError(
        response?.error?.description
          ?? response?.error?.reason
          ?? 'Payment failed. Please try a different method.'
      )
    })
    rzp.open()
  }

  // ── Unified confirm handler ─────────────────────────────────────────────────
  async function handleConfirm() {
    setUpiError('')

    if (tab === 'razorpay') {
      // All payment methods — no prefill
      await openRazorpay()

    } else if (tab === 'qr') {
      // ✅ Opens Razorpay with UPI method pre-selected
      // Razorpay shows a QR code inside its own checkout UI
      await openRazorpay({ method: 'upi' })

    } else if (tab === 'upi') {
      // ✅ Validate UPI ID first, then open Razorpay with it pre-filled
      if (!upiInput.trim()) {
        setUpiError('Please enter your UPI ID.')
        return
      }
      if (!UPI_REGEX.test(upiInput.trim())) {
        setUpiError('Invalid UPI ID format (e.g. name@upi).')
        return
      }
      // Razorpay sends a collect request to the entered UPI ID
      await openRazorpay({ method: 'upi', vpa: upiInput.trim() })
    }
  }

  // ── CTA label ──────────────────────────────────────────────────────────────
  const confirmLabel =
    rzpStep === 'creating'   ? 'Creating order…'
    : rzpStep === 'opening'  ? 'Opening Razorpay…'
    : rzpStep === 'verifying'? 'Verifying payment…'
    : tab === 'razorpay'     ? 'Pay with Razorpay'
    : tab === 'qr'           ? 'Pay via UPI QR'
    :                          'Send UPI Collect Request'

  // ── Render ─────────────────────────────────────────────────────────────────
  return (
    <Dialog
      open={open}
      onClose={handleClose}
      maxWidth="xs"
      fullWidth
      scroll="paper"
      PaperProps={{
        sx: {
          borderRadius: '20px',
          overflow: 'hidden',
          boxShadow: '0 24px 80px rgba(15,23,42,0.2)',
          m: 2,
          maxHeight: 'calc(100vh - 32px)',
          display: 'flex',
          flexDirection: 'column',
        },
      }}
    >

      {/* ── Sticky header ── */}
      <Box sx={{
        background: '#0f172a', px: 2.5, py: 2,
        display: 'flex', alignItems: 'center', justifyContent: 'space-between',
        flexShrink: 0,
      }}>
        <Box sx={{ minWidth: 0 }}>
          <Typography sx={{ color: 'rgba(255,255,255,0.5)', fontSize: '0.65rem', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.08em' }}>
            Secure Payment
          </Typography>
          <Typography sx={{ color: '#fff', fontWeight: 800, fontSize: '0.95rem', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis', maxWidth: 240 }}>
            {title}
          </Typography>
        </Box>
        <IconButton onClick={handleClose} disabled={isProcessing} size="small"
          sx={{ color: 'rgba(255,255,255,0.6)', '&:hover': { color: '#fff', background: 'rgba(255,255,255,0.08)' } }}
        >
          <CloseRoundedIcon sx={{ fontSize: 20 }} />
        </IconButton>
      </Box>

      {/* ── Scrollable body ── */}
      <Box sx={{
        overflowY: 'auto', flex: 1,
        '&::-webkit-scrollbar':             { width: '4px' },
        '&::-webkit-scrollbar-track':       { background: 'transparent' },
        '&::-webkit-scrollbar-thumb':       { background: 'rgba(148,163,184,0.4)', borderRadius: '4px' },
        '&::-webkit-scrollbar-thumb:hover': { background: 'rgba(148,163,184,0.7)' },
      }}>

        {/* Amount badge */}
        <Box sx={{ px: 2.5, pt: 2.5, pb: 0 }}>
          <Box sx={{
            display: 'inline-flex', alignItems: 'center', gap: 1,
            px: 2, py: 0.9, borderRadius: '12px',
            background: 'rgba(15,118,110,0.07)', border: '1.5px solid rgba(15,118,110,0.18)',
          }}>
            <Typography sx={{ fontSize: '0.72rem', color: '#0f766e', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.07em' }}>
              Booking Fee
            </Typography>
            <Typography sx={{ fontSize: '1.1rem', fontWeight: 900, color: '#0f766e' }}>
              {formatCurrency(amount)}
            </Typography>
          </Box>
        </Box>


        {/* ══════════════ SUCCESS SCREEN ══════════════ */}
        {success ? (
          <Box sx={{ px: 3, py: 4, textAlign: 'center' }}>
            <Box sx={{
              width: 64, height: 64, borderRadius: '50%',
              background: 'rgba(34,197,94,0.1)', border: '2.5px solid rgba(34,197,94,0.35)',
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
              <Box sx={{ px: 2.5, py: 2, borderRadius: '14px', background: '#f8fafc', border: '1.5px solid rgba(226,232,240,0.9)', mb: 3 }}>
                <Typography sx={{ fontSize: '0.68rem', color: '#94a3b8', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.07em', mb: 0.5 }}>
                  Payment ID
                </Typography>
                <Stack direction="row" spacing={1} alignItems="center" justifyContent="center">
                  <Typography sx={{ fontFamily: 'monospace', fontWeight: 800, fontSize: '0.92rem', color: '#0f172a', letterSpacing: '0.04em' }}>
                    {refId}
                  </Typography>
                  <IconButton size="small" onClick={() => copyText(refId, setCopied)} sx={{ color: copied ? '#0f766e' : '#94a3b8', p: 0.4 }}>
                    {copied ? <CheckCircleRoundedIcon sx={{ fontSize: 16 }} /> : <ContentCopyRoundedIcon sx={{ fontSize: 16 }} />}
                  </IconButton>
                </Stack>
              </Box>
            )}

            <Button fullWidth onClick={handleClose} sx={{
              borderRadius: '12px', py: 1.4, fontWeight: 800, fontSize: '0.95rem', textTransform: 'none',
              background: 'linear-gradient(135deg,#0f766e,#0d9488)', color: '#fff',
              boxShadow: '0 8px 24px rgba(15,118,110,0.22)',
              '&:hover': { background: 'linear-gradient(135deg,#0a5c55,#0f766e)' },
            }}>
              Done
            </Button>
          </Box>


        ) : (
          /* ══════════════ PAYMENT SCREEN ══════════════ */
          <Box>

            {/* Tab switcher */}
            <Box sx={{ px: 2.5, pt: 2.5, pb: 0 }}>
              <Box sx={{ display: 'inline-flex', background: '#f1f5f9', borderRadius: '12px', p: '4px', width: '100%' }}>
                {TABS.map(({ key, label, Icon }) => (
                  <Box key={key}
                    onClick={() => { if (!isProcessing) { setTab(key); setUpiError(''); setUpiInput('') } }}
                    sx={{
                      flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center',
                      gap: 0.6, py: 0.9, borderRadius: '9px',
                      cursor: isProcessing ? 'default' : 'pointer',
                      transition: 'all .18s ease',
                      background: tab === key ? '#0f172a' : 'transparent',
                      color:      tab === key ? '#fff'    : '#64748b',
                      fontWeight: 700, fontSize: '0.78rem', userSelect: 'none',
                      '&:hover': (!isProcessing && tab !== key) ? { background: 'rgba(15,23,42,0.05)' } : {},
                    }}
                  >
                    <Icon sx={{ fontSize: 14 }} />
                    {label}
                  </Box>
                ))}
              </Box>
            </Box>


            {/* ══ Razorpay Tab ══ */}
            {tab === 'razorpay' && (
              <Box sx={{ px: 3, pt: 2.5, pb: 1 }}>
                <Box sx={{
                  borderRadius: '16px', border: '1.5px solid rgba(15,118,110,0.14)',
                  background: 'linear-gradient(135deg,rgba(15,118,110,0.04),rgba(15,118,110,0.01))',
                  overflow: 'hidden', mb: 2,
                }}>
                  <Stack direction="row" alignItems="center" justifyContent="space-between"
                    sx={{ px: 2.5, py: 1.8, borderBottom: '1px solid rgba(226,232,240,0.7)' }}
                  >
                    <Box>
                      <Typography sx={{ fontSize: '0.68rem', color: '#94a3b8', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.07em', mb: 0.3 }}>
                        Powered by
                      </Typography>
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.8 }}>
                        <Box sx={{ width: 24, height: 24, borderRadius: '6px', background: 'linear-gradient(135deg,#072654,#3395FF)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                          <Typography sx={{ color: '#fff', fontSize: '0.65rem', fontWeight: 900, lineHeight: 1 }}>R</Typography>
                        </Box>
                        <Typography sx={{ fontWeight: 900, fontSize: '1rem', color: '#072654', letterSpacing: '-0.03em' }}>Razorpay</Typography>
                      </Box>
                    </Box>
                    <Box sx={{ px: 1.2, py: 0.5, borderRadius: '8px', background: 'rgba(34,197,94,0.08)', border: '1px solid rgba(34,197,94,0.22)' }}>
                      <Typography sx={{ fontSize: '0.67rem', fontWeight: 800, color: '#16a34a' }}>🔒 Secure</Typography>
                    </Box>
                  </Stack>

                  <Box sx={{ px: 2.5, py: 1.8 }}>
                    <Typography sx={{ fontSize: '0.68rem', color: '#94a3b8', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.07em', mb: 0.4 }}>
                      You'll pay
                    </Typography>
                    <Typography sx={{ fontSize: '2rem', fontWeight: 900, color: '#0f172a', letterSpacing: '-0.04em', lineHeight: 1 }}>
                      ₹{amount}
                    </Typography>
                  </Box>
                </Box>

                <Box sx={{ mb: 2 }}>
                  <Typography sx={{ fontSize: '0.68rem', color: '#94a3b8', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.07em', mb: 1 }}>
                    Accepted methods
                  </Typography>
                  <Stack direction="row" flexWrap="wrap" gap={0.8}>
                    {['💳 Credit / Debit', '📱 UPI', '🏦 Net Banking', '👛 Wallets'].map(m => (
                      <MethodPill key={m} label={m} />
                    ))}
                  </Stack>
                </Box>

                {sdkError && (
                  <Typography sx={{ fontSize: '0.75rem', color: '#ef4444', fontWeight: 600, mb: 1.5 }}>
                    ⚠️ {sdkError.message}
                  </Typography>
                )}
                {!sdkLoaded && !sdkError && (
                  <Stack direction="row" spacing={1} alignItems="center" sx={{ mb: 1.5 }}>
                    <CircularProgress size={12} sx={{ color: '#94a3b8' }} />
                    <Typography sx={{ fontSize: '0.75rem', color: '#94a3b8' }}>Loading payment SDK…</Typography>
                  </Stack>
                )}
              </Box>
            )}


            {/* ══ QR Tab ══ */}
            {tab === 'qr' && (
              <Box sx={{ px: 3, pt: 2.5, pb: 1 }}>

                {/* Info banner explaining what happens */}
                <Box sx={{
                  px: 2, py: 1.4, borderRadius: '12px', mb: 2.5,
                  background: 'rgba(15,118,110,0.06)', border: '1.5px solid rgba(15,118,110,0.16)',
                }}>
                  <Typography sx={{ fontSize: '0.78rem', color: '#0f766e', fontWeight: 700, mb: 0.3 }}>
                    📱 How this works
                  </Typography>
                  <Typography sx={{ fontSize: '0.75rem', color: '#475569', lineHeight: 1.6 }}>
                    Tap "Pay via UPI QR" below → Razorpay opens with a QR code → Scan with any UPI app to pay ₹{amount}.
                  </Typography>
                </Box>

                {/* Static reference QR — for users who want to scan before clicking */}
                <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', mb: 2.5 }}>
                  <Typography sx={{ fontSize: '0.68rem', color: '#94a3b8', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.07em', mb: 1.2 }}>
                    Quick Pay Reference
                  </Typography>
                  <QRImage upiString={upiString} size={180} />
                  <Typography sx={{ fontSize: '0.7rem', color: '#94a3b8', mt: 1, textAlign: 'center' }}>
                    Or click the button below for a verified payment QR
                  </Typography>
                </Box>

                {/* UPI ID row */}
                <Box sx={{
                  display: 'flex', alignItems: 'center', justifyContent: 'space-between',
                  px: 2, py: 1.2, borderRadius: '12px',
                  background: '#f8fafc', border: '1.5px solid rgba(226,232,240,0.9)',
                }}>
                  <Box>
                    <Typography sx={{ fontSize: '0.66rem', color: '#94a3b8', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.07em' }}>UPI ID</Typography>
                    <Typography sx={{ fontSize: '0.88rem', fontWeight: 800, color: '#0f172a', fontFamily: 'monospace' }}>{UPI_ID}</Typography>
                  </Box>
                  <IconButton size="small" onClick={() => copyText(UPI_ID, setCopied)}
                    sx={{ color: copied ? '#0f766e' : '#94a3b8', border: '1px solid rgba(226,232,240,0.9)', borderRadius: '8px', p: 0.7, background: copied ? 'rgba(15,118,110,0.06)' : '#fff', transition: 'all .18s ease' }}
                  >
                    {copied ? <CheckCircleRoundedIcon sx={{ fontSize: 16 }} /> : <ContentCopyRoundedIcon sx={{ fontSize: 16 }} />}
                  </IconButton>
                </Box>
              </Box>
            )}


            {/* ══ UPI ID Tab ══ */}
            {tab === 'upi' && (
              <Box sx={{ px: 3, pt: 2.5, pb: 1 }}>

                {/* Info banner */}
                <Box sx={{
                  px: 2, py: 1.4, borderRadius: '12px', mb: 2.5,
                  background: 'rgba(15,118,110,0.06)', border: '1.5px solid rgba(15,118,110,0.16)',
                }}>
                  <Typography sx={{ fontSize: '0.78rem', color: '#0f766e', fontWeight: 700, mb: 0.3 }}>
                    📲 How this works
                  </Typography>
                  <Typography sx={{ fontSize: '0.75rem', color: '#475569', lineHeight: 1.6 }}>
                    Enter your UPI ID → Razorpay sends a ₹{amount} collect request to your UPI app → Approve to complete payment.
                  </Typography>
                </Box>

                <Box sx={{
                  px: 2.5, py: 2, borderRadius: '14px',
                  background: 'linear-gradient(135deg,rgba(15,118,110,0.06),rgba(15,118,110,0.02))',
                  border: '1.5px solid rgba(15,118,110,0.14)', mb: 2.5,
                }}>
                  <Stack direction="row" justifyContent="space-between" alignItems="center">
                    <Box>
                      <Typography sx={{ fontSize: '0.68rem', color: '#0f766e', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.07em' }}>Amount</Typography>
                      <Typography sx={{ fontSize: '1.6rem', fontWeight: 900, color: '#0f766e', letterSpacing: '-0.04em', lineHeight: 1.1, mt: 0.3 }}>₹{amount}</Typography>
                    </Box>
                    <Typography sx={{ fontSize: '0.72rem', color: '#64748b', fontWeight: 500, maxWidth: '14ch', textAlign: 'right', lineHeight: 1.5 }}>
                      To:<br />
                      <Box component="span" sx={{ fontWeight: 800, color: '#0f172a', fontFamily: 'monospace' }}>{UPI_ID}</Box>
                    </Typography>
                  </Stack>
                </Box>

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
                      width: '100%', px: 1.8, py: 1.3, borderRadius: '12px',
                      border: `1.5px solid ${upiError ? '#ef4444' : 'rgba(226,232,240,0.9)'}`,
                      outline: 'none', fontSize: '0.9rem', fontWeight: 600,
                      color: '#0f172a', background: '#fff', fontFamily: 'monospace',
                      boxSizing: 'border-box', transition: 'border-color .15s ease',
                      '&:focus': {
                        borderColor: upiError ? '#ef4444' : '#0f766e',
                        boxShadow:   `0 0 0 3px ${upiError ? 'rgba(239,68,68,0.12)' : 'rgba(15,118,110,0.12)'}`,
                      },
                    }}
                  />
                </Box>
                <Typography sx={{ fontSize: '0.76rem', color: '#94a3b8', mt: 1.5, mb: 2, lineHeight: 1.5 }}>
                  Razorpay will send a collect request to this UPI ID. Approve it in your UPI app to complete the booking.
                </Typography>
              </Box>
            )}


            {/* Shared error banner */}
            {upiError && (
              <Box sx={{ mx: 3, mb: 1.5, px: 2, py: 1.2, borderRadius: '10px', background: 'rgba(239,68,68,0.06)', border: '1.5px solid rgba(239,68,68,0.18)' }}>
                <Typography sx={{ fontSize: '0.78rem', color: '#dc2626', fontWeight: 600 }}>
                  {upiError}
                </Typography>
              </Box>
            )}

            <Divider sx={{ borderColor: 'rgba(226,232,240,0.7)' }} />

            {/* CTA */}
            <Box sx={{ px: 3, py: 2.5 }}>
              <Button
                fullWidth
                onClick={handleConfirm}
                disabled={isProcessing || !sdkLoaded || !!sdkError}
                startIcon={isProcessing
                  ? <CircularProgress size={16} sx={{ color: '#fff' }} />
                  : tab === 'razorpay'
                    ? <CreditCardRoundedIcon sx={{ fontSize: 17 }} />
                    : <QrCode2RoundedIcon sx={{ fontSize: 17 }} />
                }
                sx={{
                  borderRadius: '12px', py: 1.5,
                  fontWeight: 800, fontSize: '0.95rem', textTransform: 'none',
                  background: isProcessing ? '#94a3b8' : 'linear-gradient(135deg,#0f766e,#0d9488)',
                  color: '#fff',
                  boxShadow: isProcessing ? 'none' : '0 8px 24px rgba(15,118,110,0.28)',
                  '&:hover': {
                    background:  isProcessing ? '#94a3b8' : 'linear-gradient(135deg,#0a5c55,#0f766e)',
                    transform:   isProcessing ? 'none'    : 'translateY(-1px)',
                  },
                  '&.Mui-disabled': { background: '#94a3b8', color: '#fff' },
                  transition: 'all .18s ease',
                }}
              >
                {confirmLabel}
              </Button>

              <Typography sx={{ fontSize: '0.72rem', color: '#94a3b8', textAlign: 'center', mt: 1.5, lineHeight: 1.5 }}>
                🔒 Secured by Razorpay · PCI-DSS compliant · Signature verified server-side
              </Typography>
            </Box>

          </Box>
        )}

      </Box>
    </Dialog>
  )
}

