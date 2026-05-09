
// src/components/BookNowButton.jsx
import { useMemo, useState } from 'react'
import { Alert, Button, CircularProgress, Snackbar } from '@mui/material'
import CheckCircleRoundedIcon from '@mui/icons-material/CheckCircleRounded'
import { initiateBooking } from '../services/bookingService'

export default function BookNowButton({
  propertyId,
  vehicleId,
  amount = 100,
  label = 'Book & Pay',
  disabled = false,
  onSuccess,
  onError,
}) {
  const [loading, setLoading] = useState(false)
  const [toast, setToast] = useState({
    open: false,
    message: '',
    severity: 'success',
  })

  const isInvalidProps = useMemo(() => {
    if (!propertyId && !vehicleId) return true
    if (propertyId && vehicleId) return true
    return false
  }, [propertyId, vehicleId])

  const showToast = (message, severity = 'success') => {
    setToast({
      open: true,
      message,
      severity,
    })
  }

  const handleCloseToast = (_, reason) => {
    if (reason === 'clickaway') return
    setToast((prev) => ({ ...prev, open: false }))
  }

  const handleBookNow = async () => {
    if (isInvalidProps) {
      showToast('Pass either propertyId or vehicleId', 'error')
      return
    }

    try {
      setLoading(true)

      const result = await initiateBooking({
        property_id: propertyId || null,
        vehicle_id: vehicleId || null,
        amount,
      })

      showToast(result?.message || 'Booking confirmed', 'success')
      onSuccess?.(result)
    } catch (error) {
      const message = error?.message || 'Booking failed. Please try again.'

      showToast(
        message === 'Payment cancelled by user' ? 'Payment cancelled' : message,
        message === 'Payment cancelled by user' ? 'warning' : 'error'
      )

      onError?.(error)
    } finally {
      setLoading(false)
    }
  }

  return (
    <>
      <Button
        fullWidth
        variant="contained"
        onClick={handleBookNow}
        disabled={disabled || loading || isInvalidProps}
        startIcon={
          loading ? (
            <CircularProgress size={16} color="inherit" />
          ) : (
            <CheckCircleRoundedIcon sx={{ fontSize: 18 }} />
          )
        }
        sx={{
          borderRadius: '12px',
          py: 1.45,
          fontWeight: 800,
          fontSize: '0.95rem',
          textTransform: 'none',
          background: 'linear-gradient(135deg, #0f766e, #0d9488)',
          color: '#fff',
          boxShadow: '0 8px 24px rgba(15,118,110,0.28)',
          transition: 'all .18s ease',
          '&:hover': {
            background: 'linear-gradient(135deg, #0a5c55, #0f766e)',
            transform: 'translateY(-1px)',
            boxShadow: '0 10px 28px rgba(15,118,110,0.34)',
          },
          '&.Mui-disabled': {
            background: '#cbd5e1',
            color: '#64748b',
            boxShadow: 'none',
          },
        }}
      >
        {loading ? 'Processing...' : label}
      </Button>

      <Snackbar
        open={toast.open}
        autoHideDuration={4000}
        onClose={handleCloseToast}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
      >
        <Alert
          onClose={handleCloseToast}
          severity={toast.severity}
          variant="filled"
          sx={{
            borderRadius: '12px',
            fontWeight: 700,
            alignItems: 'center',
          }}
        >
          {toast.message}
        </Alert>
      </Snackbar>
    </>
  )
}