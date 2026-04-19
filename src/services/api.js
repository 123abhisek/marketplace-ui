
// src/services/api.js
// ─────────────────────────────────────────────────────────────────────────────
// Central API layer. All HTTP calls go through here.
// Base URL is read from the Vite env variable VITE_API_URL.
// ─────────────────────────────────────────────────────────────────────────────

const BASE_URL = (import.meta.env?.VITE_API_URL ?? 'http://localhost:8000').replace(/\/$/, '')
const API      = `${BASE_URL}/v1/api`


// ── Token store ───────────────────────────────────────────────────────────────
export const tokenStore = (() => {
  let _token = null
  return {
    get:   ()  => _token,
    set:   (t) => { _token = t },
    clear: ()  => { _token = null },
  }
})()


// ── Core fetch wrapper ────────────────────────────────────────────────────────
async function apiFetch(method, path, body = undefined, isFormEncoded = false) {
  const headers = {}

  if (body !== undefined) {
    headers['Content-Type'] = isFormEncoded
      ? 'application/x-www-form-urlencoded'
      : 'application/json'
  }

  const token = tokenStore.get()
  if (token) headers['Authorization'] = `Bearer ${token}`

  const res = await fetch(`${API}/${path}`, {
    method,
    headers,
    body: body === undefined
      ? undefined
      : isFormEncoded
        ? new URLSearchParams(body).toString()
        : JSON.stringify(body),
  })

  let data
  const ct = res.headers.get('content-type') ?? ''
  if (ct.includes('application/json')) {
    data = await res.json()
  } else {
    data = await res.text()
  }

  if (!res.ok) {
    const err = new Error(`HTTP ${res.status}`)
    err.status   = res.status
    err.response = { data }
    throw err
  }

  return data
}

// Convenience helpers
const get  = (path)                            => apiFetch('GET',    path)
const post = (path, body, isForm = false)      => apiFetch('POST',   path, body, isForm)
const del  = (path)                            => apiFetch('DELETE', path)
const put  = (path, body)                      => apiFetch('PUT',    path, body)


// ── Auth service ──────────────────────────────────────────────────────────────
export const authService = {
  /**
   * Login
   * Sends JSON { identifier, password } to FastAPI custom login endpoint.
   */
  login: async ({ email, password }) => {
    const data = await post('auth/login', { identifier: email, password })
    if (data?.access_token) tokenStore.set(data.access_token)
    return data  // { access_token, token_type, user: {...} }
  },

  /**
   * Register
   * REQUIRED by API: name, email, password
   * OPTIONAL: phone, gender, dob, occupation, avatar_b64,
   *           location, state, city, pincode
   *
   * FIX: name is explicitly trimmed before sending so an accidental
   * trailing-space or empty string never reaches FastAPI as "" which
   * Pydantic rejects for min_length=1 fields.
   */
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

    // Build payload — required fields always present, optional only when truthy
    const payload = {
      name:     trimmedName,  // ← required, trimmed
      email:    email.trim(), // ← required
      password,               // ← required
    }

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
    // Returns: { message, user: {...} }
  },

  /** Fetch the currently-authenticated user's profile */
  me: () => get('auth/me'),

  /** Logout — clears server session + local token */
  logout: async () => {
    try {
      await post('auth/logout')
    } catch (_) {
      // Ignore 401/404 — we clear locally regardless
    } finally {
      tokenStore.clear()
    }
  },

  /** Update user profile */
  updateProfile: (payload) => put('auth/profile', payload),
}


// ── Property service ──────────────────────────────────────────────────────────
export const propertyService = {
  /** GET all public property listings */
  getAll: () => get('property/all'),

  /** GET a single property by ID */
  getOne: (id) => get(`property/${id}`),

  /**
   * POST a new property listing.
   * Maps camelCase fields → snake_case as the backend expects.
   */
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
    images = [],
  }) => {
    const price = parseFloat(String(expectedPrice ?? '').trim())
    if (!String(expectedPrice ?? '').trim() || isNaN(price) || price <= 0) {
      const err = new Error('Expected price is required and must be a number greater than 0.')
      err.isFrontendError = true
      throw err
    }

    const payload = {
      title,
      property_type:  propertyType,
      location:       location       || undefined,
      apartment_name: apartmentName  || undefined,
      floor:          floor          ? Number(floor)    : undefined,
      rooms:          rooms          ? Number(rooms)    : undefined,
      bedrooms:       bedrooms       ? Number(bedrooms) : undefined,
      area:           area           ? Number(area)     : undefined,
      land_area:      landArea       || undefined,
      crops_grown:    cropsGrown     || undefined,
      price,
      rent_lease:     rentLease      || undefined,
      contact_number: contactNumber,
      images,
    }

    // Strip undefined keys so FastAPI doesn't receive null for Optional fields
    Object.keys(payload).forEach(k => payload[k] === undefined && delete payload[k])

    return post('property/add', payload)
  },

  /** GET my listings (authenticated) */
  myListings: () => get('property/my/listings'),

  /** DELETE a property listing by ID */
  deleteOne: (id) => del(`property/${id}`),

  /** PUT — update a property listing */
  update: (id, payload) => put(`property/${id}`, payload),
}


// ── Vehicle service ───────────────────────────────────────────────────────────
export const vehicleService = {
  /** GET all public vehicle listings */
  getAll: () => get('vehicle/all'),

  /** GET a single vehicle by ID */
  getOne: (id) => get(`vehicle/${id}`),

  /**
   * POST a new vehicle listing.
   * Maps camelCase → snake_case and coerces numeric fields.
   */
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
    images = [],
  }) => {
    const price = parseFloat(String(expectedPrice ?? '').trim())
    if (!String(expectedPrice ?? '').trim() || isNaN(price) || price <= 0) {
      const err = new Error('Price is required and must be a number greater than 0.')
      err.isFrontendError = true
      throw err
    }

    const payload = {
      title,
      vehicle_number: vehicleNumber  || undefined,
      brand,
      model,
      year:           year           ? Number(year)     : undefined,
      rto_code:       rtoCode        || undefined,
      km_driven:      kmDriven       ? Number(kmDriven) : undefined,
      state:          state          || undefined,
      location:       location       || undefined,
      price,
      contact_number: contactNumber,
      images,
    }

    Object.keys(payload).forEach(k => payload[k] === undefined && delete payload[k])

    return post('vehicle/add', payload)
  },

  /** GET my listings (authenticated) */
  myListings: () => get('vehicle/my/listings'),

  /** DELETE a vehicle listing by ID */
  deleteOne: (id) => del(`vehicle/${id}`),

  /** PUT — update a vehicle listing */
  update: (id, payload) => put(`vehicle/${id}`, payload),
}