
// src/services/api.js
// Central API layer. All HTTP calls go through here.
// Base URL is read from the Vite env variable VITE_API_URL.

const BASE_URL = (import.meta.env?.VITE_API_URL ?? 'http://localhost:8000').replace(/\/$/, '')
const API      = `${BASE_URL}/v1/api/`

/* ─── Token store ─────────────────────────────────────────── */
export const tokenStore = (() => {
  let token = null
  return {
    get:   ()  => token,
    set:   (t) => { token = t },
    clear: ()  => { token = null },
  }
})()

/* ─── Core fetch wrapper ──────────────────────────────────── */
async function apiFetch(method, path, body = undefined, isFormEncoded = false) {
  const headers = {}
  if (body !== undefined) {
    headers['Content-Type'] = isFormEncoded
      ? 'application/x-www-form-urlencoded'
      : 'application/json'
  }
  const token = tokenStore.get()
  if (token) headers['Authorization'] = `Bearer ${token}`

  const res = await fetch(`${API}${path}`, {
    method,
    headers,
    body: body === undefined
      ? undefined
      : isFormEncoded
        ? new URLSearchParams(body).toString()
        : JSON.stringify(body),
  })

  const ct   = res.headers.get('content-type') ?? ''
  const data = ct.includes('application/json')
    ? await res.json()
    : await res.text()

  if (!res.ok) {
    const err    = new Error(`HTTP ${res.status}`)
    err.status   = res.status
    err.response = data
    throw err
  }
  return data
}

const get  = (path)               => apiFetch('GET',    path)
const post = (path, body, isForm) => apiFetch('POST',   path, body, isForm)
const del  = (path)               => apiFetch('DELETE', path)
const put  = (path, body)         => apiFetch('PUT',    path, body)

/* ─── Auth service ────────────────────────────────────────── */
export const authService = {
  /**
   * Login — sends JSON { identifier, password } to FastAPI.
   * Returns { access_token, token_type, user }
   */
  login: async ({ email, password }) => {
    const data = await post('auth/login', { identifier: email, password })
    if (data?.access_token) tokenStore.set(data.access_token)
    return data   // { access_token, token_type, user }
  },

  /**
   * Register — all optional fields omitted when falsy so FastAPI
   * doesn't receive null for Optional[str] fields (Pydantic min_length=1).
   */
  register: async ({
    name, email, password,
    phone, gender, dob, occupation,
    avatar_b64, location, state, city, pincode,
  }) => {
    const trimmedName = (name ?? '').trim()
    if (!trimmedName) throw new Error('Full name is required')

    const payload = { name: trimmedName, email: email.trim(), password }
    if (phone)      payload.phone      = phone
    if (gender)     payload.gender     = gender
    if (dob)        payload.dob        = dob
    if (occupation) payload.occupation = occupation
    if (avatar_b64) payload.avatar_b64 = avatar_b64
    if (location)   payload.location   = location
    if (state)      payload.state      = state
    if (city)       payload.city       = city
    if (pincode)    payload.pincode    = pincode

    return post('auth/register', payload)
    // Returns { message, user }
  },

  /** Fetch current authenticated user's profile */
  me: () => get('auth/me'),

  /** Logout — clears server session + local token */
  logout: async () => {
    try { await post('auth/logout') } catch { /* ignore 401/404 */ }
    finally { tokenStore.clear() }
  },

  /** Update user profile */
  updateProfile: (payload) => put('auth/profile', payload),
}

/* ─── Property service ────────────────────────────────────── */
export const propertyService = {
  /** GET all public property listings */
  getAll: () => get('property/all'),

  /** GET a single property by ID */
  getOne: (id) => get(`property/${id}`),

  /**
   * POST a new property listing.
   * Maps camelCase → snake_case as the backend expects.
   * `price` (not expected_price) is the correct backend field name.
   */
  add: async ({
    title, propertyType, location, apartmentName, floor,
    rooms, bedrooms, area, landArea, cropsGrown,
    expectedPrice, rentLease, contactNumber, images,
  }) => {
    const price = parseFloat(String(expectedPrice ?? '').trim())
    if (!String(expectedPrice ?? '').trim() || isNaN(price) || price <= 0) {
      const err = new Error('Expected price is required and must be a number greater than 0.')
      err.isFrontendError = true
      throw err
    }

    const payload = {
      title,
      propertytype:  propertyType,
      location:      location      || undefined,
      apartmentname: apartmentName || undefined,
      floor:         floor         ? Number(floor)    : undefined,
      rooms:         rooms         ? Number(rooms)    : undefined,
      bedrooms:      bedrooms      ? Number(bedrooms) : undefined,
      area:          area          ? Number(area)     : undefined,
      landarea:      landArea      || undefined,
      cropsgrown:    cropsGrown    || undefined,
      price,                           // ← correct field name (not expected_price)
      rentlease:     rentLease     || undefined,
      contactnumber: contactNumber,
      images,
    }

    // Strip undefined keys so FastAPI doesn't receive null for Optional fields
    Object.keys(payload).forEach((k) => payload[k] === undefined && delete payload[k])
    return post('property/add', payload)
  },

  /** GET my listings (authenticated) */
  myListings: () => get('property/mylistings'),

  /** DELETE a property listing by ID */
  deleteOne: (id) => del(`property/${id}`),

  /** PUT update a property listing */
  update: (id, payload) => put(`property/${id}`, payload),
}

/* ─── Vehicle service ─────────────────────────────────────── */
export const vehicleService = {
  /** GET all public vehicle listings */
  getAll: () => get('vehicle/all'),

  /** GET a single vehicle by ID */
  getOne: (id) => get(`vehicle/${id}`),

  /**
   * POST a new vehicle listing.
   * Maps camelCase → snake_case and coerces numeric fields.
   * `price` (not expected_price) is the correct backend field name.
   */
  add: async ({
    title, vehicleNumber, brand, model, year,
    rtoCode, kmDriven, state, location,
    expectedPrice, contactNumber, images,
  }) => {
    const price = parseFloat(String(expectedPrice ?? '').trim())
    if (!String(expectedPrice ?? '').trim() || isNaN(price) || price <= 0) {
      const err = new Error('Price is required and must be a number greater than 0.')
      err.isFrontendError = true
      throw err
    }

    const payload = {
      title,
      vehiclenumber: vehicleNumber || undefined,
      brand,
      model,
      year:          year          ? Number(year)     : undefined,
      rtocode:       rtoCode       || undefined,
      kmdriven:      kmDriven      ? Number(kmDriven) : undefined,
      state:         state         || undefined,
      location:      location      || undefined,
      price,                           // ← correct field name (not expected_price)
      contactnumber: contactNumber,
      images,
    }

    Object.keys(payload).forEach((k) => payload[k] === undefined && delete payload[k])
    return post('vehicle/add', payload)
  },

  /** GET my listings (authenticated) */
  myListings: () => get('vehicle/mylistings'),

  /** DELETE a vehicle listing by ID */
  deleteOne: (id) => del(`vehicle/${id}`),

  /** PUT update a vehicle listing */
  update: (id, payload) => put(`vehicle/${id}`, payload),
}

/* ─── Booking service ─────────────────────────────────────── */
export const bookingService = {
  /**
   * POST — record a new booking / payment initiation.
   * Body:
   *   listingId      string
   *   listingType    'property' | 'vehicle'
   *   amount         number
   *   paymentMethod  'upi_qr' | 'upi_id'
   *   payerUpiId?    string   (only for upi_id method)
   *
   * Returns { txn_id?, reference_id?, message, status }
   */
  create: ({
    listingId, listingType, amount,
    paymentMethod, payerUpiId,
  }) => {
    const payload = {
      listing_id:     listingId,
      listing_type:   listingType,
      amount,
      payment_method: paymentMethod,
    }
    if (payerUpiId) payload.payer_upi_id = payerUpiId
    return post('booking/create', payload)
  },

  /** GET all bookings for the current user */
  myBookings: () => get('booking/mybookings'),

  /** GET a single booking by ID */
  getOne: (id) => get(`booking/${id}`),
}