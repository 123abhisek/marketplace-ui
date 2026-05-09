
// src/services/api.js

const BASE_URL = (import.meta.env?.VITE_API_URL ?? 'http://localhost:8000').replace(/\/$/, '')
const API = `${BASE_URL}/v1/api/`

const LS_TOKEN_KEY = 'access_token'

export const tokenStore = (() => {
  let token = localStorage.getItem(LS_TOKEN_KEY) || null

  return {
    get: () => token,
    set: (t) => {
      token = t
      try {
        localStorage.setItem(LS_TOKEN_KEY, t)
      } catch {}
    },
    clear: () => {
      token = null
      try {
        localStorage.removeItem(LS_TOKEN_KEY)
      } catch {}
    },
  }
})()

async function apiFetch(method, path, body = undefined, isFormEncoded = false) {
  const headers = {}

  if (body !== undefined) {
    headers['Content-Type'] = isFormEncoded
      ? 'application/x-www-form-urlencoded'
      : 'application/json'
  }

  const token = tokenStore.get()
  if (token) headers['Authorization'] = `Bearer ${token}`

  const cleanPath = String(path || '').replace(/^\/+/, '')

  const res = await fetch(`${API}${cleanPath}`, {
    method,
    headers,
    body:
      body === undefined
        ? undefined
        : isFormEncoded
          ? new URLSearchParams(body).toString()
          : JSON.stringify(body),
  })

  const ct = res.headers.get('content-type') ?? ''
  const data = ct.includes('application/json')
    ? await res.json()
    : await res.text()

  if (!res.ok) {
    const err = new Error(`HTTP ${res.status}`)
    err.status = res.status
    err.response = data

    if (res.status === 401) tokenStore.clear()
    if (res.status === 422) {
      console.error('422 Validation Error:', JSON.stringify(data, null, 2))
    }

    throw err
  }

  return data
}

const get = (path) => apiFetch('GET', path)
const post = (path, body, isForm) => apiFetch('POST', path, body, isForm)
const del = (path) => apiFetch('DELETE', path)
const put = (path, body) => apiFetch('PUT', path, body)

export const api = {
  get,
  post,
  put,
  delete: del,
}

export default api

export const authService = {
  login: async ({ email, password }) => {
    const data = await post('auth/login', { identifier: email, password })
    if (data?.access_token) tokenStore.set(data.access_token)
    return data
  },

  register: async ({
    name,
    email,
    password,
    phone,
    gender,
    dob,
    occupation,
    avatar_b64,
    location,
    state,
    city,
    pincode,
  }) => {
    const trimmedName = (name ?? '').trim()
    if (!trimmedName) throw new Error('Full name is required')

    const payload = {
      name: trimmedName,
      email: email.trim(),
      password,
    }

    if (phone) payload.phone = phone
    if (gender) payload.gender = gender
    if (dob) payload.dob = dob
    if (occupation) payload.occupation = occupation
    if (avatar_b64) payload.avatar_b64 = avatar_b64
    if (location) payload.location = location
    if (state) payload.state = state
    if (city) payload.city = city
    if (pincode) payload.pincode = pincode

    return post('auth/register', payload)
  },

  me: () => get('auth/me'),

  logout: async () => {
    try {
      await post('auth/logout')
    } catch {}
    finally {
      tokenStore.clear()
    }
  },

  updateProfile: (payload) => put('auth/me', payload),
}

export const propertyService = {
  getAll: (params = {}) => {
    const query = new URLSearchParams(params).toString()
    return get(`property/all${query ? `?${query}` : ''}`)
  },

  getOne: (id) => get(`property/${id}`),
  myListings: () => get('property/my/listings'),
  deleteOne: (id) => del(`property/${id}`),
  update: (id, payload) => put(`property/${id}`, payload),

  add: async ({
    title,
    propertyType,
    location,
    apartmentName,
    floor,
    rooms,
    bedrooms,
    area,
    landArea,
    cropsGrown,
    expectedPrice,
    rentLease,
    contactNumber,
    images,
  }) => {
    const price = parseFloat(String(expectedPrice ?? '').trim())

    if (!String(expectedPrice ?? '').trim() || Number.isNaN(price) || price <= 0) {
      const err = new Error('Expected price is required and must be a number greater than 0.')
      err.isFrontendError = true
      throw err
    }

    const payload = {
      title,
      propertyType: propertyType || undefined,
      location: location || undefined,
      apartmentName: apartmentName || undefined,
      floor: floor ? Number(floor) : undefined,
      rooms: rooms ? Number(rooms) : undefined,
      bedrooms: bedrooms ? Number(bedrooms) : undefined,
      area: area ? String(area) : undefined,
      landArea: landArea || undefined,
      cropsGrown: cropsGrown || undefined,
      price,
      rentLease: rentLease || undefined,
      contactNumber,
      images: images || [],
    }

    Object.keys(payload).forEach((k) => payload[k] === undefined && delete payload[k])
    return post('property/add', payload)
  },
}

export const vehicleService = {
  getAll: (params = {}) => {
    const query = new URLSearchParams(params).toString()
    return get(`vehicle/all${query ? `?${query}` : ''}`)
  },

  getOne: (id) => get(`vehicle/${id}`),
  myListings: () => get('vehicle/my/listings'),
  deleteOne: (id) => del(`vehicle/${id}`),
  update: (id, payload) => put(`vehicle/${id}`, payload),

  add: async ({
    title,
    vehicleNumber,
    brand,
    model,
    year,
    rtoCode,
    kmDriven,
    state,
    location,
    expectedPrice,
    contactNumber,
    images,
  }) => {
    const price = parseFloat(String(expectedPrice ?? '').trim())

    if (!String(expectedPrice ?? '').trim() || Number.isNaN(price) || price <= 0) {
      const err = new Error('Price is required and must be a number greater than 0.')
      err.isFrontendError = true
      throw err
    }

    const payload = {
      title,
      vehicleNumber: vehicleNumber || undefined,
      brand,
      model,
      year: year ? Number(year) : undefined,
      rtoCode: rtoCode || undefined,
      kmDriven: kmDriven ? Number(kmDriven) : undefined,
      state: state || undefined,
      location: location || undefined,
      price,
      contactNumber,
      images: images || [],
    }

    Object.keys(payload).forEach((k) => payload[k] === undefined && delete payload[k])
    return post('vehicle/add', payload)
  },
}

export const bookingService = {
  create: ({ listingId, listingType, amount, paymentMethod, payerUpiId }) => {
    const payload = {
      listing_id: listingId,
      listing_type: listingType,
      amount,
      payment_method: paymentMethod,
    }

    if (payerUpiId) payload.payer_upi_id = payerUpiId
    return post('booking/create', payload)
  },

  myBookings: () => get('booking/mybookings'),
  getOne: (id) => get(`booking/${id}`),
}