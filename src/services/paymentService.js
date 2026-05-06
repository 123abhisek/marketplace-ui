

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