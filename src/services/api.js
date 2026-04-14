// // src/services/api.js
// import axios from "axios";

// const BASE_PATH = import.meta.env.VITE_API_URL || "http://127.0.0.1:8000";
// const API_VERSION = "v1";
// const BASE_URL = `${BASE_PATH}/${API_VERSION}/api`;

// // ── In-memory token store (sandbox-safe — no localStorage) ────────────────────
// let _token = null;

// export const tokenStore = {
//   get: () => _token,
//   set: (t) => {
//     _token = t;
//   },
//   clear: () => {
//     _token = null;
//   },
// };

// // ── Axios instance ─────────────────────────────────────────────────────────────
// const api = axios.create({
//   baseURL: BASE_URL,
//   timeout: 15000,
// });

// // Attach Bearer token automatically to every outgoing request
// api.interceptors.request.use((config) => {
//   const token = tokenStore.get();
//   if (token) {
//     config.headers.Authorization = `Bearer ${token}`;
//   }
//   return config;
// });

// // ── Auth service ───────────────────────────────────────────────────────────────
// export const authService = {
//   /**
//    * POST /auth/register
//    * Content-Type: application/json
//    * Body: all profile fields in one shot
//    * Returns: full user object (no token — auto-login separately)
//    */
//   register: async ({
//     email,
//     password,
//     name,
//     gender,
//     dob,
//     occupation,
//     avatar_url,
//     location,
//     state,
//     city,
//     pincode,
//     phone,
//   }) => {
//     const { data } = await api.post("/auth/register", {
//       email,
//       password,
//       name,
//       gender: gender || "",
//       dob: dob || null,
//       occupation: occupation || "",
//       avatar_url: avatar_url || "",
//       location: location || "",
//       state: state || "",
//       city: city || "",
//       pincode: pincode || "",
//       phone: phone || "",
//     });
//     return data;
//     // Returns: { id, name, email, phone, gender, dob, occupation,
//     //            avatar_url, location, state, city, pincode, is_premium }
//   },

//   /**
//    * POST /auth/login
//    * Content-Type: application/x-www-form-urlencoded
//    * Fields: username (= email), password
//    * Returns: { access_token, token_type, user: { ...all fields } }
//    *
//    * NOTE: "username" field name is required by OAuth2 — backend maps it to email.
//    * NOTE: login response now includes the full user object.
//    */
//   login: async ({ email, password }) => {
//     const form = new URLSearchParams();
//     form.append("username", email); // ← OAuth2 spec: field must be "username"
//     form.append("password", password);
//     const { data } = await api.post("/auth/login", form, {
//       headers: { "Content-Type": "application/x-www-form-urlencoded" },
//     });
//     return data;
//     // Returns: { access_token, token_type, user: { id, name, email, phone,
//     //            gender, dob, occupation, avatar_url, location, state,
//     //            city, pincode, is_premium } }
//   },

//   /**
//    * GET /auth/me
//    * Authorization: Bearer <token>  (interceptor adds it automatically)
//    * Returns: full user object
//    */
//   me: async () => {
//     const { data } = await api.get("/auth/me");
//     return data;
//   },
// };

// export default api;










// src/services/api.js
import axios from 'axios'

const BASE_PATH    = import.meta.env.VITE_API_URL || 'http://127.0.0.1:8000'
const API_VERSION  = 'v1'
const BASE_URL     = `${BASE_PATH}/${API_VERSION}/api`

// ── In-memory token store (sandbox-safe — no localStorage) ───────────────────
let _token = null

export const tokenStore = {
  get:   ()  => _token,
  set:   (t) => { _token = t },
  clear: ()  => { _token = null },
}

// ── Axios instance ────────────────────────────────────────────────────────────
const api = axios.create({
  baseURL: BASE_URL,
  timeout: 15000,
})

// Attach Bearer token automatically to every outgoing request
api.interceptors.request.use((config) => {
  const token = tokenStore.get()
  if (token) config.headers.Authorization = `Bearer ${token}`
  return config
})

// Global response interceptor — 401 clears token
api.interceptors.response.use(
  (res) => res,
  (err) => {
    if (err?.response?.status === 401) {
      tokenStore.clear()
    }
    return Promise.reject(err)
  },
)

// ── Auth service ──────────────────────────────────────────────────────────────
export const authService = {
  /**
   * POST /auth/register
   * Returns full user object (no token — auto-login separately)
   */
  register: async ({
    email, password, name, gender, dob, occupation,
    avatar_url, location, state, city, pincode, phone,
  }) => {
    const { data } = await api.post('/auth/register', {
      email,
      password,
      name,
      gender:      gender      || '',
      dob:         dob         || null,
      occupation:  occupation  || '',
      avatar_url:  avatar_url  || '',
      location:    location    || '',
      state:       state       || '',
      city:        city        || '',
      pincode:     pincode     || '',
      phone:       phone       || '',
    })
    return data
  },

  /**
   * POST /auth/login
   * Content-Type: application/x-www-form-urlencoded
   * Returns { access_token, token_type, user }
   */
  login: async ({ email, password }) => {
    const form = new URLSearchParams()
    form.append('username', email) // OAuth2 spec: field must be "username"
    form.append('password', password)
    const { data } = await api.post('/auth/login', form, {
      headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
    })
    return data // { access_token, token_type, user: { ...all fields } }
  },

  /**
   * GET /auth/me
   * Returns full user object
   */
  me: async () => {
    const { data } = await api.get('/auth/me')
    return data
  },
}

// ── Property service ──────────────────────────────────────────────────────────
export const propertyService = {
  /**
   * GET /property/all
   * Public. Returns teaser cards: id, title, property_type, location, price, images, message.
   * Optional query params: skip, limit, property_type
   */
  getAll: async ({ skip = 0, limit = 50, propertyType = '' } = {}) => {
    const params = { skip, limit }
    if (propertyType && propertyType !== 'All') params.property_type = propertyType
    const { data } = await api.get('/property/all', { params })
    return data // array of teaser objects
  },

  /**
   * POST /property/add
   * Premium only. Body is camelCase (as per API spec).
   * Returns full PropertyFull object.
   */
  add: async ({
    title, propertyType, location, apartmentName,
    contactNumber, floor, rooms, bedrooms, area,
    landArea, cropsGrown, expectedPrice, rentLease, images,
  }) => {
    const { data } = await api.post('/property/add', {
      title,
      propertyType,
      location,
      apartmentName,
      contactNumber,
      floor,
      rooms,
      bedrooms,
      area,
      landArea,
      cropsGrown,
      expectedPrice: Number(expectedPrice) || 0,
      rentLease,
      images: images || [],
    })
    return data
  },

  /**
   * GET /property/my/listings
   * Auth required. Returns full objects for the logged-in user.
   */
  myListings: async () => {
    const { data } = await api.get('/property/my/listings')
    return data
  },

  /**
   * GET /property/{prop_id}
   * Free → PropertyPublic (no contact)
   * Premium → PropertyFull (all fields including contact)
   */
  getOne: async (id) => {
    const { data } = await api.get(`/property/${id}`)
    return data
  },

  /**
   * DELETE /property/{prop_id}
   * Owner only. Returns 204.
   */
  deleteOne: async (id) => {
    await api.delete(`/property/${id}`)
  },
}

export default api