import { useState } from 'react'
import PayButton from '../components/PayButton'

export default function CheckoutPage() {
  const [paymentState, setPaymentState] = useState('idle')   // idle | success | error
  const [paymentData,  setPaymentData]  = useState(null)
  const [errorMsg,     setErrorMsg]     = useState('')

  function handleSuccess(data) {
    setPaymentData(data)
    setPaymentState('success')
  }

  function handleFailure(err) {
    // User cancelling is not a hard error — keep it low-key
    const isCancelled = err.message?.toLowerCase().includes('cancelled')
    if (!isCancelled) {
      setErrorMsg(err.message ?? 'Payment failed. Please try again.')
      setPaymentState('error')
    }
    console.error('[Payment]', err)
  }

  function handleRetry() {
    setPaymentState('idle')
    setErrorMsg('')
    setPaymentData(null)
  }

  return (
    <div style={styles.page}>
      <div style={styles.card}>

        {/* ── Order summary ── */}
        <div style={styles.header}>
          <p style={styles.eyebrow}>Secure Checkout</p>
          <h1 style={styles.title}>Complete your payment</h1>
        </div>

        {/* ── Order details ── */}
        <div style={styles.summaryBox}>
          <Row label="Item"    value="Premium Subscription" />
          <Row label="Period"  value="1 Month" />
          <div style={styles.divider} />
          <Row label="Total"   value="₹1" bold />
        </div>

        {/* ── Success state ── */}
        {paymentState === 'success' && (
          <div style={styles.successBox}>
            <span style={styles.successIcon}>✓</span>
            <p style={styles.successTitle}>Payment Successful!</p>
            <p style={styles.successSub}>Payment ID: <code>{paymentData?.razorpay_payment_id}</code></p>
          </div>
        )}

        {/* ── Error state ── */}
        {paymentState === 'error' && (
          <div style={styles.errorBox}>
            <p style={styles.errorText}>{errorMsg}</p>
            <button onClick={handleRetry} style={styles.retryBtn}>Try again</button>
          </div>
        )}

        {/* ── Pay button ── */}
        {paymentState !== 'success' && (
          <div style={{ marginTop: '24px' }}>
            <PayButton
              amount={1}
              receipt={`order_${Date.now()}`}
              prefill={{ name: 'John Doe', email: 'john@example.com' }}
              onSuccess={handleSuccess}
              onFailure={handleFailure}
              label="Pay ₹1"
            />
            <p style={styles.secureNote}>🔒 Powered by Razorpay · 256-bit SSL</p>
          </div>
        )}

      </div>
    </div>
  )
}

function Row({ label, value, bold }) {
  return (
    <div style={styles.row}>
      <span style={{ ...styles.rowLabel, fontWeight: bold ? 700 : 500 }}>{label}</span>
      <span style={{ ...styles.rowValue, fontWeight: bold ? 800 : 600, color: bold ? '#0f172a' : '#475569' }}>{value}</span>
    </div>
  )
}

const styles = {
  page:         { minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', background: '#f8fafc', fontFamily: 'system-ui, -apple-system, sans-serif', padding: '24px' },
  card:         { background: '#fff', borderRadius: '20px', padding: '36px', maxWidth: '420px', width: '100%', boxShadow: '0 8px 40px rgba(15,23,42,0.10)', border: '1px solid rgba(226,232,240,0.9)' },
  header:       { marginBottom: '28px' },
  eyebrow:      { fontSize: '0.72rem', fontWeight: 700, color: '#0f766e', textTransform: 'uppercase', letterSpacing: '0.08em', margin: '0 0 8px' },
  title:        { fontSize: '1.5rem', fontWeight: 900, color: '#0f172a', margin: 0, letterSpacing: '-0.03em' },
  summaryBox:   { background: '#f8fafc', borderRadius: '14px', padding: '16px 20px', border: '1px solid rgba(226,232,240,0.9)', marginBottom: '8px' },
  row:          { display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '6px 0' },
  rowLabel:     { fontSize: '0.87rem', color: '#64748b' },
  rowValue:     { fontSize: '0.87rem' },
  divider:      { height: '1px', background: 'rgba(226,232,240,0.9)', margin: '10px 0' },
  successBox:   { background: 'rgba(34,197,94,0.07)', border: '1.5px solid rgba(34,197,94,0.25)', borderRadius: '14px', padding: '20px', textAlign: 'center', marginTop: '20px' },
  successIcon:  { display: 'inline-flex', alignItems: 'center', justifyContent: 'center', width: '42px', height: '42px', borderRadius: '50%', background: 'rgba(34,197,94,0.15)', color: '#16a34a', fontSize: '1.3rem', fontWeight: 900 },
  successTitle: { fontWeight: 800, fontSize: '1rem', color: '#0f172a', margin: '10px 0 6px' },
  successSub:   { fontSize: '0.78rem', color: '#64748b', margin: 0 },
  errorBox:     { background: 'rgba(239,68,68,0.06)', border: '1.5px solid rgba(239,68,68,0.2)', borderRadius: '14px', padding: '16px 20px', marginTop: '16px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '12px' },
  errorText:    { fontSize: '0.84rem', color: '#dc2626', fontWeight: 600, margin: 0, flex: 1 },
  retryBtn:     { background: 'none', border: '1.5px solid rgba(239,68,68,0.4)', borderRadius: '8px', padding: '6px 14px', color: '#dc2626', fontWeight: 700, fontSize: '0.8rem', cursor: 'pointer', whiteSpace: 'nowrap' },
  secureNote:   { fontSize: '0.72rem', color: '#94a3b8', textAlign: 'center', marginTop: '12px', marginBottom: 0 },
}