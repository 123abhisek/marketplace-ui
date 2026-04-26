// // const API_BASE = import.meta.env.VITE_API_URL ?? ''

// // /**
// //  * Step 1 — Ask your backend to create a Razorpay order.
// //  * Backend returns: { order_id, amount, currency, receipt }
// //  *
// //  * @param {{ amount: number, receipt?: string }} payload
// //  */
// // export async function createOrder(payload) {
// //   const res = await fetch(`${API_BASE}/api/payment/create-order`, {
// //     method:  'POST',
// //     headers: { 'Content-Type': 'application/json' },
// //     body:    JSON.stringify(payload),
// //   })

// //   if (!res.ok) {
// //     const err = await res.json().catch(() => ({}))
// //     throw new Error(err?.detail ?? err?.message ?? `Order creation failed (${res.status})`)
// //   }

// //   return res.json()   // { order_id, amount, currency }
// // }

// // /**
// //  * Step 2 — Send Razorpay's payment signature to your backend to verify.
// //  * Backend returns: { success: true, message: string }
// //  *
// //  * @param {{
// //  *   razorpay_payment_id: string,
// //  *   razorpay_order_id:   string,
// //  *   razorpay_signature:  string,
// //  * }} payload
// //  */
// // export async function verifyPayment(payload) {
// //   const res = await fetch(`${API_BASE}/api/verify-payment`, {
// //     method:  'POST',
// //     headers: { 'Content-Type': 'application/json' },
// //     body:    JSON.stringify(payload),
// //   })

// //   if (!res.ok) {
// //     const err = await res.json().catch(() => ({}))
// //     throw new Error(err?.detail ?? err?.message ?? `Payment verification failed (${res.status})`)
// //   }

// //   return res.json()   // { success: true, message: '...' }
// // }



// // src/services/paymentService.js
// // Matches backend: /v1/api/payment/* endpoints

// const BASE  = (import.meta.env.VITE_API_URL ?? 'http://localhost:8000').replace(/\/$/, '')
// const ROOT  = `${BASE}/v1/api/payment`

// // ── Read JWT from localStorage (same key tokenStore uses in api.js) ───────────
// function getToken() {
//   try { return localStorage.getItem('accesstoken') } catch { return null }
// }

// function authHeaders() {
//   const token = getToken()
//   return {
//     'Content-Type': 'application/json',
//     ...(token && { Authorization: `Bearer ${token}` }),
//   }
// }

// async function handleResponse(res) {
//   const data = await res.json().catch(() => ({}))
//   if (!res.ok) {
//     // FastAPI 422 sends { detail: [...] }; other errors send { detail: "string" }
//     const msg = Array.isArray(data?.detail)
//       ? data.detail.map(e => e.msg).join(', ')
//       : (data?.detail ?? `Request failed (${res.status})`)
//     const err     = new Error(msg)
//     err.status    = res.status
//     err.response  = data
//     throw err
//   }
//   return data
// }


// // ── 1. Create Razorpay order ──────────────────────────────────────────────────
// /**
//  * POST /v1/api/payment/create-order
//  *
//  * ⚠️  Amount must be in PAISE — this function converts INR → paise for you.
//  *
//  * @param {{ amountInr: number, currency?: string, notes?: object }} payload
//  * @returns {{ order_id, amount, currency, key_id }}
//  *   key_id is the Razorpay public key — use it directly in checkout options.
//  */
// export async function createOrder({ amountInr, currency = 'INR', notes = {} }) {
//   const res = await fetch(`${ROOT}/create-order`, {
//     method:  'POST',
//     headers: authHeaders(),
//     body: JSON.stringify({
//       amount:   Math.round(amountInr * 100),  // INR → paise (₹499 → 49900)
//       currency,
//       notes,
//     }),
//   })
//   return handleResponse(res)
//   // Returns: { order_id, amount (paise), currency, key_id }
// }


// // ── 2. Verify payment signature ───────────────────────────────────────────────
// /**
//  * POST /v1/api/payment/verify-payment
//  *
//  * Send all 3 Razorpay identifiers — backend verifies HMAC-SHA256.
//  * Never skip this step; frontend responses can be tampered with.
//  *
//  * @param {{ razorpay_payment_id, razorpay_order_id, razorpay_signature }} payload
//  * @returns {{ success: boolean, message: string, payment_id: string }}
//  */
// export async function verifyPayment({ razorpay_payment_id, razorpay_order_id, razorpay_signature }) {
//   const res = await fetch(`${ROOT}/verify-payment`, {
//     method:  'POST',
//     headers: authHeaders(),
//     body: JSON.stringify({ razorpay_payment_id, razorpay_order_id, razorpay_signature }),
//   })
//   return handleResponse(res)
//   // Returns: { success: true, message: '...', payment_id: '...' }
// }


// // ── 3. Payment history for logged-in user ─────────────────────────────────────
// /**
//  * GET /v1/api/payment/my/payments
//  * @returns {Array<PaymentRecord>}
//  */
// export async function getMyPayments() {
//   const res = await fetch(`${ROOT}/my/payments`, {
//     method:  'GET',
//     headers: authHeaders(),
//   })
//   return handleResponse(res)
// }


// // ── 4. Get a specific payment record ─────────────────────────────────────────
// /**
//  * GET /v1/api/payment/{payment_id}
//  * @param {string} paymentId
//  * @returns {PaymentRecord}
//  */
// export async function getPayment(paymentId) {
//   const res = await fetch(`${ROOT}/${paymentId}`, {
//     method:  'GET',
//     headers: authHeaders(),
//   })
//   return handleResponse(res)
// }

// /**
//  * @typedef {{ 
//  *   id, user_id, order_id, payment_id,
//  *   amount, currency, status, method,
//  *   email, contact, created_at, updated_at 
//  * }} PaymentRecord
//  */




// src/services/paymentService.js
import { tokenStore } from './api'   // ✅ use the same in-memory token source

const BASE = (import.meta.env.VITE_API_URL ?? 'http://localhost:8000').replace(/\/$/, '')
const ROOT = `${BASE}/v1/api/payment`

// ✅ Was: localStorage.getItem('accesstoken') — can be stale / null
// ✅ Now: tokenStore.get() — always in sync with what apiFetch uses
function authHeaders() {
  const token = tokenStore.get()
  return {
    'Content-Type': 'application/json',
    ...(token && { Authorization: `Bearer ${token}` }),
  }
}

async function handleResponse(res) {
  const data = await res.json().catch(() => ({}))
  if (!res.ok) {
    const msg = Array.isArray(data?.detail)
      ? data.detail.map(e => e.msg).join(', ')
      : (data?.detail ?? `Request failed (${res.status})`)
    const err    = new Error(msg)
    err.status   = res.status
    err.response = data
    throw err
  }
  return data
}

// POST /v1/api/payment/create-order
export async function createOrder({ amountInr, currency = 'INR', notes = {} }) {
  const res = await fetch(`${ROOT}/create-order`, {
    method:  'POST',
    headers: authHeaders(),
    body: JSON.stringify({
      amount:   Math.round(amountInr * 100),  // INR → paise
      currency,
      notes,
    }),
  })
  return handleResponse(res)
}

// POST /v1/api/payment/verify-payment
export async function verifyPayment({ razorpay_payment_id, razorpay_order_id, razorpay_signature }) {
  const res = await fetch(`${ROOT}/verify-payment`, {
    method:  'POST',
    headers: authHeaders(),
    body: JSON.stringify({ razorpay_payment_id, razorpay_order_id, razorpay_signature }),
  })
  return handleResponse(res)
}

// GET /v1/api/payment/my/payments
export async function getMyPayments() {
  const res = await fetch(`${ROOT}/my/payments`, {
    method:  'GET',
    headers: authHeaders(),
  })
  return handleResponse(res)
}

// GET /v1/api/payment/{payment_id}
export async function getPayment(paymentId) {
  const res = await fetch(`${ROOT}/${paymentId}`, {
    method:  'GET',
    headers: authHeaders(),
  })
  return handleResponse(res)
}