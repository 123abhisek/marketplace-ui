import { useState } from 'react'
import { useRazorpay } from '../hooks/useRazorpay'
import { createOrder, verifyPayment } from '../services/paymentService'

// ─── Config — only the PUBLIC test/live key goes here ────────────────────────
// Never put rzp_live_SECRET or your key_secret in frontend code.
const RAZORPAY_KEY = import.meta.env.VITE_RAZORPAY_KEY ?? 'rzp_test_XXXXXXXXXX'

/**
 * PayButton
 *
 * Props:
 *   amount       {number}   Amount in INR (e.g. 499)
 *   receipt      {string}   Your internal receipt/order reference
 *   prefill      {{ name?, email?, contact? }}  Pre-fill checkout form
 *   onSuccess    {(data: PaymentSuccessData) => void}
 *   onFailure    {(error: Error) => void}
 *   label        {string}   Button label (default: "Pay Now")
 *   disabled     {boolean}
 */
export default function PayButton({
  amount,
  receipt      = `receipt_${Date.now()}`,
  prefill      = {},
  onSuccess,
  onFailure,
  label        = 'Pay Now',
  disabled     = false,
}) {
  const { loaded: sdkLoaded, error: sdkError } = useRazorpay()
  const [status, setStatus] = useState('idle')   // idle | creating | opening | verifying

  const isLoading = status !== 'idle'
  const canPay    = sdkLoaded && !sdkError && !disabled && !isLoading

  async function handlePayment() {
    if (!canPay) return

    // ── Step 1: Create order on your backend ─────────────────────────────────
    setStatus('creating')
    let orderData
    try {
      orderData = await createOrder({ amount, receipt })
    } catch (err) {
      setStatus('idle')
      onFailure?.(err)
      return
    }

    const { order_id, amount: orderAmount, currency = 'INR' } = orderData

    // ── Step 2: Open Razorpay Checkout ────────────────────────────────────────
    setStatus('opening')

    const options = {
      key:         RAZORPAY_KEY,
      amount:      orderAmount,       // in paise — backend should return paise
      currency,
      name:        'Your App Name',
      description: 'Payment for Order',
      order_id,

      prefill: {
        name:    prefill.name    ?? '',
        email:   prefill.email   ?? '',
        contact: prefill.contact ?? '',
      },

      theme: { color: '#0f766e' },

      // ── Step 3: Verify signature on success ──────────────────────────────────
      handler: async function (response) {
        setStatus('verifying')
        const { razorpay_payment_id, razorpay_order_id, razorpay_signature } = response
        try {
          const result = await verifyPayment({
            razorpay_payment_id,
            razorpay_order_id,
            razorpay_signature,
          })
          setStatus('idle')
          onSuccess?.({ razorpay_payment_id, razorpay_order_id, razorpay_signature, ...result })
        } catch (err) {
          setStatus('idle')
          onFailure?.(err)
        }
      },

      // Fires when user closes the modal without paying
      modal: {
        ondismiss: () => {
          setStatus('idle')
          onFailure?.(new Error('Payment cancelled by user.'))
        },
      },
    }

    const rzp = new window.Razorpay(options)

    // Fires when Razorpay itself reports a payment failure
    rzp.on('payment.failed', (response) => {
      setStatus('idle')
      const msg = response?.error?.description ?? 'Payment failed. Please try again.'
      onFailure?.(new Error(msg))
    })

    rzp.open()
  }

  const buttonLabel = {
    idle:       label,
    creating:   'Creating order…',
    opening:    'Opening checkout…',
    verifying:  'Verifying payment…',
  }[status]

  return (
    <button
      onClick={handlePayment}
      disabled={!canPay}
      aria-busy={isLoading}
      style={{
        display:         'inline-flex',
        alignItems:      'center',
        justifyContent:  'center',
        gap:             '8px',
        padding:         '13px 28px',
        borderRadius:    '12px',
        border:          'none',
        cursor:          canPay ? 'pointer' : 'not-allowed',
        background:      canPay ? 'linear-gradient(135deg, #0f766e, #0d9488)' : '#94a3b8',
        color:           '#fff',
        fontSize:        '0.95rem',
        fontWeight:      700,
        letterSpacing:   '-0.01em',
        boxShadow:       canPay ? '0 8px 24px rgba(15,118,110,0.28)' : 'none',
        transition:      'all 0.18s ease',
        minWidth:        '180px',
        opacity:         disabled ? 0.6 : 1,
      }}
      onMouseEnter={(e) => { if (canPay) e.currentTarget.style.transform = 'translateY(-2px)' }}
      onMouseLeave={(e) => { e.currentTarget.style.transform = 'translateY(0)' }}
    >
      {isLoading && (
        <span style={{
          width: '15px', height: '15px',
          border: '2.5px solid rgba(255,255,255,0.35)',
          borderTopColor: '#fff',
          borderRadius: '50%',
          display: 'inline-block',
          animation: 'rzp-spin 0.7s linear infinite',
        }} />
      )}
      {buttonLabel}

      {/* Inline keyframe — avoids needing a CSS file */}
      <style>{`@keyframes rzp-spin { to { transform: rotate(360deg); } }`}</style>
    </button>
  )
}