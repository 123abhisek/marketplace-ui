

// src/pages/SubscriptionPage.jsx
import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import {
  Alert,
  Box,
  Button,
  Card,
  CardContent,
  Chip,
  CircularProgress,
  Container,
  Divider,
  Snackbar,
  Stack,
  Typography,
} from '@mui/material'
import WorkspacePremiumRoundedIcon from '@mui/icons-material/WorkspacePremiumRounded'
import CheckRoundedIcon from '@mui/icons-material/CheckRounded'
import ArrowForwardRoundedIcon from '@mui/icons-material/ArrowForwardRounded'
import LockOpenRoundedIcon from '@mui/icons-material/LockOpenRounded'
import { useAppState } from '../hooks/useAppState'
import api from '../services/api'

const PLAN_AMOUNT = 299
const PLAN_MONTHS = 1

function loadRazorpaySDK() {
  return new Promise((resolve, reject) => {
    if (window.Razorpay) return resolve()

    const script = document.createElement('script')
    script.src = 'https://checkout.razorpay.com/v1/checkout.js'
    script.async = true
    script.onload = () => resolve()
    script.onerror = () => reject(new Error('Failed to load Razorpay SDK'))

    document.head.appendChild(script)
  })
}

function unwrapResponse(response) {
  if (response && typeof response === 'object' && 'data' in response) {
    return response.data
  }
  return response
}

export default function SubscriptionPage() {
  const navigate = useNavigate()
  const { user, upgradePremium } = useAppState()

  const [loading, setLoading] = useState(false)
  const [toast, setToast] = useState({
    open: false,
    severity: 'success',
    message: '',
  })

  const isLoggedIn = Boolean(user?.loggedIn || user?.is_logged_in)
  const isPremium = Boolean(user?.is_premium || user?.isPremium)

  const showToast = (message, severity = 'success') => {
    setToast({ open: true, severity, message })
  }

  const closeToast = (_, reason) => {
    if (reason === 'clickaway') return
    setToast((prev) => ({ ...prev, open: false }))
  }

  const activate = async () => {
    if (!isLoggedIn) {
      navigate('/register')
      return
    }

    if (isPremium) {
      navigate('/dashboard/subscription')
      return
    }

    try {
      setLoading(true)

      await loadRazorpaySDK()

      const orderResponse = await api.post('/payment/create-order', {
        amount: PLAN_AMOUNT,
        currency: 'INR',
        purpose: 'subscription_upgrade',
        plan_months: PLAN_MONTHS,
      })

      const order = unwrapResponse(orderResponse)

      const rzp = new window.Razorpay({
        key: order?.key_id || order?.key,
        amount: order?.amount,
        currency: order?.currency || 'INR',
        order_id: order?.order_id,
        name: 'EasyDeal',
        description: 'Premium Subscription',
        prefill: {
          name: user?.name || '',
          email: user?.email || '',
          contact: user?.phone || '',
        },
        notes: {
          plan: 'premium',
          plan_months: String(PLAN_MONTHS),
        },
        theme: {
          color: '#0f766e',
        },
        modal: {
          confirm_close: true,
          ondismiss: () => {
            setLoading(false)
            showToast('Payment cancelled', 'warning')
          },
        },
        handler: async function (response) {
          try {
            const upgradeResponse = await api.post('/subscription/upgrade', {
              payment_id: response.razorpay_payment_id,
              razorpay_order_id: response.razorpay_order_id,
              plan_months: PLAN_MONTHS,
            })

            const data = unwrapResponse(upgradeResponse)

            if (data?.success === false) {
              throw new Error(data?.message || 'Activation failed')
            }

            upgradePremium?.(data)
            setLoading(false)
            showToast('Premium activated successfully 🎉', 'success')

            setTimeout(() => {
              navigate('/dashboard/subscription')
            }, 700)
          } catch (error) {
            setLoading(false)
            showToast(
              error?.response?.data?.detail ||
                error?.response?.data?.message ||
                error?.message ||
                'Payment succeeded but activation failed. Contact support.',
              'error'
            )
          }
        },
      })

      rzp.on('payment.failed', (response) => {
        setLoading(false)
        showToast(
          response?.error?.description ||
            response?.error?.reason ||
            'Payment failed. Please try again.',
          'error'
        )
      })

      rzp.open()
    } catch (error) {
      setLoading(false)
      showToast(
        error?.response?.data?.detail ||
          error?.response?.data?.message ||
          error?.message ||
          'Unable to start payment',
        'error'
      )
    }
  }

  return (
    <Box sx={{ py: { xs: 6, md: 10 }, bgcolor: '#f8fafc', minHeight: '100vh' }}>
      <Container maxWidth="sm">
        <Card
          sx={{
            borderRadius: '32px',
            border: '1px solid rgba(15,23,42,0.08)',
            boxShadow: '0 24px 60px rgba(15,23,42,0.08)',
            overflow: 'hidden',
          }}
        >
          <Box
            sx={{
              px: { xs: 3, md: 4 },
              pt: { xs: 3, md: 4 },
              pb: 2,
              background:
                'linear-gradient(135deg, rgba(15,118,110,0.08), rgba(186,230,253,0.28))',
            }}
          >
            <Stack
              direction="row"
              justifyContent="space-between"
              alignItems="flex-start"
              spacing={2}
            >
              <Stack spacing={1.2}>
                <Chip
                  icon={<WorkspacePremiumRoundedIcon />}
                  label={isPremium ? 'Premium Active' : 'Premium Plan'}
                  sx={{
                    width: 'fit-content',
                    borderRadius: '999px',
                    fontWeight: 800,
                    color: '#0f766e',
                    bgcolor: 'rgba(15,118,110,0.10)',
                    border: '1px solid rgba(15,118,110,0.15)',
                  }}
                />
                <Typography
                  variant="h4"
                  sx={{
                    fontWeight: 900,
                    lineHeight: 1.12,
                    letterSpacing: '-0.03em',
                    color: '#0f172a',
                    fontSize: { xs: '1.8rem', md: '2.2rem' },
                  }}
                >
                  Premium Access — ₹299
                </Typography>
                <Typography
                  sx={{
                    color: '#64748b',
                    lineHeight: 1.8,
                    fontSize: '0.95rem',
                    maxWidth: 520,
                  }}
                >
                  Unlock full listing details, seller contact numbers, and unlimited posting access
                  for property and vehicle listings.
                </Typography>
              </Stack>
            </Stack>
          </Box>

          <CardContent sx={{ p: { xs: 3, md: 4 } }}>
            <Stack spacing={3}>
              <Card
                sx={{
                  borderRadius: '24px',
                  border: '1px solid rgba(15,23,42,0.08)',
                  bgcolor: '#f8fafc',
                  boxShadow: 'none',
                }}
              >
                <CardContent sx={{ p: 3 }}>
                  <Typography sx={{ fontWeight: 800, color: '#0f172a', mb: 1.4 }}>
                    What you unlock
                  </Typography>

                  <Stack spacing={1.2}>
                    {[
                      'View full listing prices',
                      'Unlock seller contact numbers',
                      'Post unlimited property listings',
                      'Post unlimited vehicle listings',
                      'Get a premium badge on your listings',
                      'Enjoy priority listing visibility',
                    ].map((item) => (
                      <Stack key={item} direction="row" spacing={1.25} alignItems="center">
                        <Box
                          sx={{
                            width: 24,
                            height: 24,
                            borderRadius: '50%',
                            display: 'grid',
                            placeItems: 'center',
                            bgcolor: 'rgba(15,118,110,0.10)',
                            color: '#0f766e',
                            flexShrink: 0,
                          }}
                        >
                          <CheckRoundedIcon sx={{ fontSize: 14 }} />
                        </Box>
                        <Typography
                          sx={{ fontSize: '0.92rem', color: '#334155', fontWeight: 600 }}
                        >
                          {item}
                        </Typography>
                      </Stack>
                    ))}
                  </Stack>
                </CardContent>
              </Card>

              <Card
                sx={{
                  borderRadius: '24px',
                  border: '1px solid rgba(15,118,110,0.12)',
                  background:
                    'linear-gradient(135deg, rgba(240,253,249,1), rgba(239,246,255,1))',
                  boxShadow: 'none',
                }}
              >
                <CardContent sx={{ p: 3 }}>
                  <Stack spacing={1.2}>
                    <Typography sx={{ fontWeight: 800, color: '#0f172a' }}>
                      Razorpay Payment
                    </Typography>
                    <Typography sx={{ fontSize: '0.92rem', color: '#64748b', lineHeight: 1.8 }}>
                      Tap the button below to pay securely with UPI, cards, net banking, or wallet.
                    </Typography>
                    <Divider />
                    <Stack direction="row" justifyContent="space-between" alignItems="center">
                      <Typography
                        sx={{ color: '#64748b', fontSize: '0.92rem', fontWeight: 600 }}
                      >
                        One-time unlock
                      </Typography>
                      <Typography
                        sx={{
                          color: '#0f172a',
                          fontSize: '1.5rem',
                          fontWeight: 900,
                          letterSpacing: '-0.03em',
                        }}
                      >
                        ₹299
                      </Typography>
                    </Stack>
                  </Stack>
                </CardContent>
              </Card>

              <Button
                onClick={activate}
                size="large"
                disabled={loading}
                startIcon={
                  loading ? (
                    <CircularProgress size={18} color="inherit" />
                  ) : isPremium ? (
                    <LockOpenRoundedIcon />
                  ) : (
                    <WorkspacePremiumRoundedIcon />
                  )
                }
                endIcon={!loading ? <ArrowForwardRoundedIcon /> : null}
                sx={{
                  minHeight: 54,
                  borderRadius: '16px',
                  fontWeight: 800,
                  fontSize: '0.98rem',
                  textTransform: 'none',
                  color: '#fff',
                  background: isPremium
                    ? 'linear-gradient(135deg, #0f766e, #0d9488)'
                    : 'linear-gradient(135deg, #0f766e, #0369a1)',
                  boxShadow: '0 16px 34px rgba(15,118,110,0.26)',
                  '&:hover': {
                    background: isPremium
                      ? 'linear-gradient(135deg, #0d6b63, #0f766e)'
                      : 'linear-gradient(135deg, #0d6b63, #075985)',
                    boxShadow: '0 20px 40px rgba(15,118,110,0.32)',
                  },
                  '&.Mui-disabled': {
                    color: '#fff',
                    background: 'rgba(15,118,110,0.45)',
                  },
                }}
              >
                {loading
                  ? 'Opening Razorpay...'
                  : isPremium
                  ? 'Go to Premium Dashboard'
                  : 'Pay ₹299 & Activate Premium'}
              </Button>

              {!isLoggedIn && (
                <Typography
                  sx={{
                    textAlign: 'center',
                    fontSize: '0.84rem',
                    color: '#64748b',
                    lineHeight: 1.7,
                  }}
                >
                  Please create or sign in to your account before upgrading to Premium.
                </Typography>
              )}
            </Stack>
          </CardContent>
        </Card>
      </Container>

      <Snackbar
        open={toast.open}
        autoHideDuration={4500}
        onClose={closeToast}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
      >
        <Alert
          onClose={closeToast}
          severity={toast.severity}
          variant="filled"
          sx={{ borderRadius: '12px', fontWeight: 700 }}
        >
          {toast.message}
        </Alert>
      </Snackbar>
    </Box>
  )
}