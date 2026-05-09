
// src/services/bookingService.js
import api from './api'

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

export async function initiateBooking({
  property_id = null,
  vehicle_id = null,
  amount,
  currency = 'INR',
}) {
  if (!property_id && !vehicle_id) {
    throw new Error('Either property_id or vehicle_id is required')
  }

  if (property_id && vehicle_id) {
    throw new Error('Pass only one of property_id or vehicle_id')
  }

  if (!amount || Number(amount) <= 0) {
    throw new Error('Valid booking amount is required')
  }

  const init = await api.post('booking/initiate', {
    ...(property_id ? { property_id } : {}),
    ...(vehicle_id ? { vehicle_id } : {}),
    amount: Number(amount),
    currency,
  })

  await loadRazorpaySDK()

  return new Promise((resolve, reject) => {
    const rzp = new window.Razorpay({
      key: init.key_id,
      amount: init.amount,
      currency: init.currency,
      order_id: init.order_id,
      name: 'EasyDeal',
      description: 'Booking Fee',

      handler: async function (response) {
        try {
          const result = await api.post('booking/verify', {
            booking_id: init.booking_id,
            razorpay_payment_id: response.razorpay_payment_id,
            razorpay_order_id: response.razorpay_order_id,
            razorpay_signature: response.razorpay_signature,
          })

          resolve(result)
        } catch (err) {
          reject(err)
        }
      },

      modal: {
        ondismiss: () => reject(new Error('Payment cancelled by user')),
      },

      theme: {
        color: '#0f766e',
      },
    })

    rzp.on('payment.failed', (response) => {
      reject(
        new Error(
          response?.error?.description ||
            response?.error?.reason ||
            'Payment failed'
        )
      )
    })

    rzp.open()
  })
}

export async function getMyBookings(status = null) {
  const query = new URLSearchParams()
  if (status) query.set('status', status)

  return api.get(`booking/my${query.toString() ? `?${query.toString()}` : ''}`)
}

export async function getReceivedBookings(status = null) {
  const query = new URLSearchParams()
  if (status) query.set('status', status)

  return api.get(`booking/received${query.toString() ? `?${query.toString()}` : ''}`)
}

export async function getBooking(bookingId) {
  return api.get(`booking/${bookingId}`)
}

export async function cancelBooking(bookingId) {
  return api.delete(`booking/${bookingId}`)
}