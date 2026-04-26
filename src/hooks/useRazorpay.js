

import { useEffect, useState } from 'react'

const RAZORPAY_SCRIPT_URL = 'https://checkout.razorpay.com/v1/checkout.js'

/**
 * Dynamically injects the Razorpay checkout script into the DOM.
 * Returns { loaded, error } so the component knows when it's safe to open checkout.
 */
export function useRazorpay() {
  const [loaded, setLoaded] = useState(false)
  const [error,  setError]  = useState(null)

  useEffect(() => {
    // Script already injected by a previous render — skip
    if (document.querySelector(`script[src="${RAZORPAY_SCRIPT_URL}"]`)) {
      setLoaded(true)
      return
    }

    const script    = document.createElement('script')
    script.src      = RAZORPAY_SCRIPT_URL
    script.async    = true
    script.onload   = () => setLoaded(true)
    script.onerror  = () => setError(new Error('Failed to load Razorpay SDK. Check your internet connection.'))

    document.body.appendChild(script)

    return () => {
      // Do NOT remove the script on cleanup —
      // Razorpay needs it alive for the modal to work after re-renders.
    }
  }, [])

  return { loaded, error }
}