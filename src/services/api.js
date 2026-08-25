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

export const api = {
  get,
  post,
  put,
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

  updateProfile: (payload) => put("auth/me", payload),

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
    if (payload.price !== undefined && payload.price !== "") {
      const p = parseFloat(String(payload.price));
      if (!Number.isNaN(p)) finalPayload.price = p;
    }
    if (payload.rooms !== undefined) {
      const r = parseInt(String(payload.rooms), 10);
      finalPayload.rooms = Number.isNaN(r) ? null : r;
    }
    if (payload.bedrooms !== undefined) {
      const b = parseInt(String(payload.bedrooms), 10);
      finalPayload.bedrooms = Number.isNaN(b) ? null : b;
    }
    if (payload.area !== undefined) {
      const a = parseFloat(String(payload.area));
      finalPayload.area = Number.isNaN(a) ? null : a;
    }
    if (payload.land_area !== undefined) {
      const la = parseFloat(String(payload.land_area));
      finalPayload.land_area = Number.isNaN(la) ? null : la;
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
      ...payload,
      price,
    };

    if (payload.rooms !== undefined && payload.rooms !== null && payload.rooms !== "") {
      const r = parseInt(String(payload.rooms), 10);
      if (!Number.isNaN(r)) finalPayload.rooms = r;
      else delete finalPayload.rooms;
    } else {
      delete finalPayload.rooms;
    }

    if (payload.bedrooms !== undefined && payload.bedrooms !== null && payload.bedrooms !== "") {
      const b = parseInt(String(payload.bedrooms), 10);
      if (!Number.isNaN(b)) finalPayload.bedrooms = b;
      else delete finalPayload.bedrooms;
    } else {
      delete finalPayload.bedrooms;
    }

    if (payload.area !== undefined && payload.area !== null && payload.area !== "") {
      const a = parseFloat(String(payload.area));
      if (!Number.isNaN(a)) finalPayload.area = a;
      else delete finalPayload.area;
    } else {
      delete finalPayload.area;
    }

    if (payload.land_area !== undefined && payload.land_area !== null && payload.land_area !== "") {
      const la = parseFloat(String(payload.land_area));
      if (!Number.isNaN(la)) finalPayload.land_area = la;
      else delete finalPayload.land_area;
    } else {
      delete finalPayload.land_area;
    }

    Object.keys(finalPayload).forEach((k) => {
      if (finalPayload[k] === undefined || finalPayload[k] === null || finalPayload[k] === "") {
        if (k !== "title" && k !== "property_type" && k !== "location" && k !== "contact") {
          delete finalPayload[k];
        }
      }
    });

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
    const price = parseFloat(String(expectedPrice ?? "").trim());

    if (
      !String(expectedPrice ?? "").trim() ||
      Number.isNaN(price) ||
      price <= 0
    ) {
      const err = new Error(
        "Price is required and must be a number greater than 0.",
      );
      err.isFrontendError = true;
      throw err;
    }

    const payload = {
      title: title?.trim(),
      expectedPrice: price,
      contactNumber: String(contactNumber ?? "").trim(),
      vehicleNumber: vehicleNumber ? String(vehicleNumber).trim() : null,
      brand: brand ? String(brand).trim() : null,
      model: model ? String(model).trim() : null,
      year: year ? String(year).trim() : null,
      rtoCode: rtoCode ? String(rtoCode).trim() : null,
      kmDriven: kmDriven ? String(kmDriven).trim() : null,
      state: state ? String(state).trim() : null,
      location: location ? String(location).trim() : null,
      images: Array.isArray(images) ? images : [],
    };

    return post("vehicle/add", payload);
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
}
