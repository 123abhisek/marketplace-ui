// src/services/api.js

const configuredBaseUrl = import.meta.env.VITE_API_URL?.trim();

const BASE_URL =
  configuredBaseUrl ||
  (import.meta.env.DEV ? "http://localhost:8000" : "");

const API = `${BASE_URL.replace(/\/$/, "")}/v1/api/`;

const LS_TOKEN_KEY = "access_token";

export const tokenStore = (() => {
  let token = localStorage.getItem(LS_TOKEN_KEY) || null;

  return {
    get: () => token,
    set: (t) => {
      token = t;
      try {
        localStorage.setItem(LS_TOKEN_KEY, t);
      } catch {}
    },
    clear: () => {
      token = null;
      try {
        localStorage.removeItem(LS_TOKEN_KEY);
      } catch {}
    },
  };
})();


async function apiFetch(method, path, body = undefined, isFormEncoded = false, options = {}) {
  const headers = { ...(options?.headers || {}) };

  if (body !== undefined) {
    headers["Content-Type"] = isFormEncoded
      ? "application/x-www-form-urlencoded"
      : "application/json";
  }

  const token = tokenStore.get();

  if (token) {
    headers["Authorization"] = `Bearer ${token}`;
  }

  let cleanPath = String(path || "").replace(/^\/+/, "");

  if (options?.params && typeof options.params === "object") {
    const searchParams = new URLSearchParams();
    Object.entries(options.params).forEach(([k, v]) => {
      if (v !== undefined && v !== null && v !== "") {
        searchParams.append(k, String(v));
      }
    });
    const qs = searchParams.toString();
    if (qs) {
      cleanPath += (cleanPath.includes("?") ? "&" : "?") + qs;
    }
  }

  const res = await fetch(`${API}${cleanPath}`, {
    method,
    headers,
    body:
      body === undefined
        ? undefined
        : isFormEncoded
          ? new URLSearchParams(body).toString()
          : JSON.stringify(body),
  });

  // HANDLE 204 NO CONTENT
  if (res.status === 204) {
    return null;
  }

  const ct = (res.headers.get("content-type") || "").toLowerCase();
  const isBinary =
    options?.responseType === "blob" ||
    ct.includes("application/vnd.openxmlformats") ||
    ct.includes("spreadsheetml") ||
    ct.includes("application/octet-stream") ||
    ct.includes("application/pdf") ||
    ct.includes("application/zip") ||
    ct.includes("excel");

  let data = null;

  try {
    if (isBinary && res.ok) {
      data = await res.blob();
    } else if (ct.includes("application/json")) {
      data = await res.json();
    } else {
      data = await res.text();
    }
  } catch {
    data = null;
  }

  if (!res.ok) {
    let backendMessage = null;
    if (data instanceof Blob) {
      try {
        const text = await data.text();
        const json = JSON.parse(text);
        backendMessage = json.detail || json.message;
      } catch {}
    } else if (typeof data === "object" && data !== null) {
      backendMessage = data.detail || data.message;
    }

    const err = new Error(backendMessage || `HTTP ${res.status}`);

    err.status = res.status;
    err.response = data;

    // DO NOT CLEAR TOKEN FOR LOGOUT ENDPOINT
    if (res.status === 401 && cleanPath !== "auth/logout") {
      tokenStore.clear();
    }

    if (res.status === 422) {
      console.error("422 Validation Error:", JSON.stringify(data, null, 2));
    }

    throw err;
  }

  return data;
}

const get = (path, options) => apiFetch("GET", path, undefined, false, options);
const post = (path, body, isForm, options) => apiFetch("POST", path, body, isForm, options);
const del = (path, options) => apiFetch("DELETE", path, undefined, false, options);
const put = (path, body, isForm, options) => apiFetch("PUT", path, body, isForm, options);
const patch = (path, body, isForm, options) => apiFetch("PATCH", path, body, isForm, options);

export const api = {
  get,
  post,
  put,
  patch,
  delete: del,
};

export default api;


export const authService = {
  login: async ({ email, password }) => {
    const data = await post("auth/login", { identifier: email, password });
    if (data?.access_token) tokenStore.set(data.access_token);
    return data;
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
    const trimmedName = (name ?? "").trim();
    if (!trimmedName) throw new Error("Full name is required");

    const payload = {
      name: trimmedName,
      email: email.trim(),
      password,
    };

    if (phone) payload.phone = phone;
    if (gender) payload.gender = gender;
    if (dob) payload.dob = dob;
    if (occupation) payload.occupation = occupation;
    if (avatar_b64) payload.avatar_b64 = avatar_b64;
    if (location) payload.location = location;
    if (state) payload.state = state;
    if (city) payload.city = city;
    if (pincode) payload.pincode = pincode;

    return post("auth/register", payload);
  },

  me: () => get("auth/me"),

  logout: async () => {
    try {
      await post("auth/logout");
    } catch {
    } finally {
      tokenStore.clear();
    }
  },

  updateProfile: async (payload) => {
    try {
      return await patch("auth/me", payload);
    } catch (err) {
      if (err?.status === 405 || err?.status === 404) {
        return await put("auth/me", payload);
      }
      throw err;
    }
  },

  changePassword: ({ current_password, new_password }) =>
    post("auth/change-password", { current_password, new_password }),

  forgotPassword: ({ email }) =>
    post("auth/forgot-password", { email }),

  resetPassword: ({ email, new_password }) =>
    post("auth/reset-password", { email, new_password }),
};



export const propertyService = {
  getAll: (params = {}) => {
    const query = new URLSearchParams(params).toString();
    return get(`property/all${query ? `?${query}` : ""}`);
  },

  getOne: (id) => get(`property/${id}`),
  myListings: () => get("property/my/listings"),
  deleteOne: (id) => del(`property/${id}`),
  update: (id, payload) => {
    const finalPayload = { ...payload };
    if (payload.price !== undefined) {
      finalPayload.price = parseFloat(String(payload.price ?? "0")) || 0;
    }
    if (payload.rooms !== undefined) {
      finalPayload.rooms = parseInt(String(payload.rooms ?? "0"), 10) || 0;
    }
    if (payload.bedrooms !== undefined) {
      finalPayload.bedrooms = parseInt(String(payload.bedrooms ?? "0"), 10) || 0;
    }
    if (payload.area !== undefined) {
      finalPayload.area = String(payload.area ?? "").trim();
    }
    if (payload.land_area !== undefined) {
      finalPayload.land_area = String(payload.land_area ?? "").trim();
    }
    if (payload.apartment_name !== undefined) {
      finalPayload.apartment_name = String(payload.apartment_name ?? "").trim();
    }
    if (payload.floor !== undefined) {
      finalPayload.floor = String(payload.floor ?? "").trim();
    }
    if (payload.crops_grown !== undefined) {
      finalPayload.crops_grown = String(payload.crops_grown ?? "").trim();
    }
    if (payload.rent_lease !== undefined) {
      finalPayload.rent_lease = String(payload.rent_lease ?? "").trim();
    }
    return put(`property/${id}`, finalPayload);
  },

  add: async (payload) => {
    const price = parseFloat(String(payload.price ?? "").trim());

    if (Number.isNaN(price) || price <= 0) {
      const err = new Error(
        "Expected price is required and must be greater than 0.",
      );
      err.isFrontendError = true;
      throw err;
    }

    const finalPayload = {
      title: String(payload.title ?? "").trim(),
      property_type: String(payload.property_type ?? "").trim(),
      location: String(payload.location ?? "").trim(),
      contact: String(payload.contact ?? "").trim(),
      price: price || 0,
      rooms: parseInt(String(payload.rooms ?? "0"), 10) || 0,
      bedrooms: parseInt(String(payload.bedrooms ?? "0"), 10) || 0,
      area: String(payload.area ?? "").trim(),
      land_area: String(payload.land_area ?? "").trim(),
      apartment_name: String(payload.apartment_name ?? "").trim(),
      floor: String(payload.floor ?? "").trim(),
      crops_grown: String(payload.crops_grown ?? "").trim(),
      rent_lease: String(payload.rent_lease ?? "").trim(),
      images: Array.isArray(payload.images) ? payload.images : [],
    };
    if (payload.details !== undefined) {
      finalPayload.details = payload.details;
    }

    return post("property/add", finalPayload);
  },
};

export const vehicleService = {
  getAll: (params = {}) => {
    const query = new URLSearchParams(params).toString();
    return get(`vehicle/all${query ? `?${query}` : ""}`);
  },

  getOne: (id) => get(`vehicle/${id}`),
  myListings: () => get("vehicle/my/listings"),
  deleteOne: (id) => del(`vehicle/${id}`),
  update: (id, payload) => {
    const finalPayload = { ...payload };
    if (payload.price !== undefined) {
      finalPayload.price = parseFloat(String(payload.price ?? "0")) || 0;
    }
    return put(`vehicle/${id}`, finalPayload);
  },

  add: async (payload) => {
    const price = parseFloat(
      String(payload.price ?? payload.expectedPrice ?? "").trim()
    );

    if (Number.isNaN(price) || price <= 0) {
      const err = new Error(
        "Price is required and must be a number greater than 0."
      );
      err.isFrontendError = true;
      throw err;
    }

    const finalPayload = {
      title: String(payload.title ?? "").trim(),
      category: String(payload.category ?? payload.vehicleType ?? "").trim(),
      price: price || 0,
      contact: String(payload.contact ?? payload.contactNumber ?? "").trim(),
      vehicle_number: String(payload.vehicle_number ?? payload.vehicleNumber ?? "").trim(),
      brand: String(payload.brand ?? "").trim(),
      model: String(payload.model ?? "").trim(),
      year: String(payload.year ?? "").trim(),
      rto_code: String(payload.rto_code ?? payload.rtoCode ?? "").trim(),
      km_driven: String(payload.km_driven ?? payload.kmDriven ?? "0").trim(),
      state: String(payload.state ?? "").trim(),
      local_address: String(payload.local_address ?? payload.localAddress ?? "").trim(),
      city: String(payload.city ?? "").trim(),
      location: String(payload.location ?? "").trim(),
      fuel_type: String(payload.fuel_type ?? payload.fuelType ?? "").trim(),
      transmission: String(payload.transmission ?? "").trim(),
      ownership: String(payload.ownership ?? "").trim(),
      insurance_validity: String(payload.insurance_validity ?? payload.insuranceValidity ?? "").trim(),
      color: String(payload.color ?? "").trim(),
      description: String(payload.description ?? "").trim(),
      images: Array.isArray(payload.images) ? payload.images : [],
    };
    if (payload.details !== undefined) {
      finalPayload.details = payload.details;
    }

    return post("vehicle/add", finalPayload);
  },
};




export const bookingService = {
  create: ({ listingId, listingType, amount, paymentMethod, payerUpiId }) => {
    const payload = {
      listing_id: listingId,
      listing_type: listingType,
      amount,
      payment_method: paymentMethod,
    }

    if (payerUpiId) payload.payer_upi_id = payerUpiId

    return post("booking/create", payload)
  },

  myBookings: (status = null) => {
    const query = new URLSearchParams()

    if (status) {
      query.set("status", status)
    }

    return get(
      `booking/my${query.toString() ? `?${query}` : ""}`,
    )
  },

  getOne: (id) => get(`booking/${id}`),
};

export const locationService = {
  getStates: async () => {
    try {
      const res = await get("location/states");
      return res?.data ?? res;
    } catch {
      const fallback = await fetch("https://india-lgd-index-api.vercel.app/v1/states");
      const json = await fallback.json();
      return json?.data ?? [];
    }
  },

  getDistricts: async (state) => {
    try {
      const res = await get(`location/districts?state=${encodeURIComponent(state)}`);
      return res?.data ?? res;
    } catch {
      const fallback = await fetch(`https://india-lgd-index-api.vercel.app/v1/districts?state=${encodeURIComponent(state)}`);
      const json = await fallback.json();
      return json?.data ?? [];
    }
  },

  getSubdistricts: async (district) => {
    try {
      const res = await get(`location/subdistricts?district=${encodeURIComponent(district)}`);
      return res?.data ?? res;
    } catch {
      const fallback = await fetch(`https://india-lgd-index-api.vercel.app/v1/subdistricts?district=${encodeURIComponent(district)}`);
      const json = await fallback.json();
      return json?.data ?? [];
    }
  },

  getBlocks: async (district) => {
    try {
      const res = await get(`location/blocks?district=${encodeURIComponent(district)}`);
      return res?.data ?? res;
    } catch {
      const fallback = await fetch(`https://india-lgd-index-api.vercel.app/v1/blocks?district=${encodeURIComponent(district)}`);
      const json = await fallback.json();
      return json?.data ?? [];
    }
  },

  search: async (q) => {
    try {
      const res = await get(`location/search?q=${encodeURIComponent(q)}`);
      return res?.data ?? res;
    } catch {
      const fallback = await fetch(`https://india-lgd-index-api.vercel.app/v1/search?q=${encodeURIComponent(q)}`);
      const json = await fallback.json();
      return json?.data ?? {};
    }
  },

  lookupPincode: async (pincode) => {
    const cleanPin = String(pincode || "").replace(/\D/g, "").slice(0, 6);
    if (cleanPin.length !== 6) return null;
    try {
      const res = await get(`location/pincode/${cleanPin}`);
      if (res?.success) return res;
    } catch {}

    try {
      const resp = await fetch(`https://api.postalpincode.in/pincode/${cleanPin}`);
      const data = await resp.json();
      if (Array.isArray(data) && data[0]?.Status === "Success") {
        const poList = data[0]?.PostOffice || [];
        const primary = poList[0] || {};
        return {
          success: true,
          pincode: cleanPin,
          state: primary.State || "",
          city: primary.District || "",
          district: primary.District || "",
          division: primary.Division || "",
          block: primary.Block || "",
          post_offices: poList.map((p) => p.Name).filter(Boolean),
        };
      }
    } catch (e) {
      console.warn("Direct pincode fetch error:", e);
    }
    return null;
  },
};

