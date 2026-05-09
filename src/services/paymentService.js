
// src/services/paymentService.js
//
// Generic / standalone payment flow — NOT for listing bookings.
//
// Use this ONLY for payments that are NOT tied to a property or vehicle booking,
// e.g. subscription upgrades, platform fees, etc.
//
// For booking a listing, use bookingService.js → initiateBooking() instead.
//
//   /v1/api/payment/create-order   ← creates a standalone Razorpay order
//   /v1/api/payment/verify-payment ← verifies the payment signature
//
// These endpoints do NOT create a Booking row in the database.

import api from './api'

// ─── Load Razorpay SDK once into <head> ───────────────────────────────────────
function loadRazorpaySDK() {
  return new Promise((resolve, reject) => {
    if (window.Razorpay) return resolve()
    const script = document.createElement('script')
    script.src = 'https://checkout.razorpay.com/v1/checkout.js'
    script.onload  = resolve
    script.onerror = () => reject(new Error('Failed to load Razorpay SDK'))
    document.head.appendChild(script)
  })
}

// ─── initiatePayment ──────────────────────────────────────────────────────────
// Usage:
//   import { initiatePayment } from '../services/paymentService'
//
//   const result = await initiatePayment({
//     amount: 49900,                    // in paise (49900 = ₹499)
//     currency: 'INR',
//     notes: { purpose: 'Premium subscription' },
//   })
//
// Resolves: { success, message, payment_id }
// Rejects:  Error('Payment cancelled by user')  — on modal dismiss
//           Error(description)                  — on payment failure

export async function initiatePayment({ amount, currency = 'INR', notes = {} }) {
  // Step 1 — create a standalone Razorpay order (no Booking row created)
  const order = await api.post('/v1/api/payment/create-order', {
    amount,
    currency,
    notes,
  })
  // order = { order_id, amount, currency, key_id }

  // Step 2 — load Razorpay JS SDK if not already loaded
  await loadRazorpaySDK()

  // Step 3 — open popup, verify on backend inside handler
  return new Promise((resolve, reject) => {
    const options = {
      key:         order.key_id,
      amount:      order.amount,
      currency:    order.currency,
      order_id:    order.order_id,
      name:        'EasyDeal',
      description: 'Payment',

      // ── Payment success — MUST verify on backend ───────────────────────
      handler: async function (response) {
        try {
          const result = await api.post('/v1/api/payment/verify-payment', {
            razorpay_payment_id: response.razorpay_payment_id,
            razorpay_order_id:   response.razorpay_order_id,
            razorpay_signature:  response.razorpay_signature,
          })
          // result = { success, message, payment_id }
          resolve(result)
        } catch (err) {
          reject(err)
        }
      },

      // ── User closes modal without paying ──────────────────────────────
      modal: {
        ondismiss: () => reject(new Error('Payment cancelled by user')),
      },

      theme: { color: '#4361EE' },
    }

    const rzp = new window.Razorpay(options)

    rzp.on('payment.failed', (response) => {
      reject(new Error(response.error?.description || 'Payment failed'))
    })

    rzp.open()
  })
}

// ─── Payment history helpers ──────────────────────────────────────────────────

/** GET /v1/api/payment/my/payments
 *  Full payment history for the current logged-in user.
 */
export async function getMyPayments() {
  return api.get('/v1/api/payment/my/payments')
}

/** GET /v1/api/payment/:payment_id
 *  Single payment record by ID.
 */
export async function getPayment(paymentId) {
  return api.get(`/v1/api/payment/${paymentId}`)
}