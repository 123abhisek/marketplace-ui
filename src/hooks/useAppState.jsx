
// src/hooks/useAppState.jsx
import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from "react";
import { Alert, Snackbar } from "@mui/material";
import {
  authService,
  propertyService,
  vehicleService,
  tokenStore,
} from "../services/api";
import { useNavigate } from "react-router-dom";

const AppContext = createContext(null);

const DEFAULT_USER = {
  id: null,
  name: "",
  email: "",
  mobile: "",
  gender: "",
  dob: "",
  location: "",
  state: "",
  city: "",
  pincode: "",
  occupation: "",
  photo: null,
  role: "free",
  isPremium: false,
  subscription: "inactive",
  loggedIn: false,
};

const LS_USER_KEY = "userData";
const LS_TOKEN_KEY = "access_token";

const getStoredToken = () => {
  try {
    return tokenStore?.get?.() || localStorage.getItem(LS_TOKEN_KEY) || "";
  } catch {
    return "";
  }
};

const saveUserToStorage = (user) => {
  try {
    console.log("user :",user);
    localStorage.setItem(LS_USER_KEY, JSON.stringify(user));
  } catch {}
};

const clearUserFromStorage = () => {
  try {
    localStorage.removeItem(LS_USER_KEY);
  } catch {}
};

const loadUserFromStorage = () => {
  try {
    const raw = localStorage.getItem(LS_USER_KEY);
    if (!raw) return null;
    const parsed = JSON.parse(raw);
    return parsed || null;
  } catch {
    return null;
  }
};

const normalizeUser = (u = {}, hasToken = true) => {
  const isPremium =
    u?.is_premium === true ||
    u?.ispremium === true ||
    u?.isPremium === true;

  const role = String(u?.role || "").toLowerCase();

  return {
    id: u?.id || null,
    name: u?.name || "",
    email: u?.email || "",
    mobile: u?.phone || u?.mobile || "",
    gender: u?.gender || "",
    dob: u?.dob || "",
    location: u?.location || "",
    state: u?.state || "",
    city: u?.city || "",
    pincode: u?.pincode || "",
    occupation: u?.occupation || "",
    photo: u?.avatar_b64 || u?.avatarb64 || u?.photo || null,
    loggedIn: hasToken,
    isPremium,
    role: role || (isPremium ? "premium" : "free"),
    subscription: u?.subscription || (isPremium ? "active" : "inactive"),
  };
};

const normalizeProperty = (item, i = 0) => ({
  id: item?.id || item?._id || `p-${i}`,
  user_id: item?.user_id || item?.userId || "",
  title: item?.title || "Untitled property",
  property_type: item?.property_type || item?.propertyType || "",
  location: item?.location || "Unknown location",
  price: item?.price ?? "",
  contact: item?.contact || "",
  apartment_name: item?.apartment_name || item?.apartmentName || "",
  floor: item?.floor || "",
  rooms: item?.rooms ?? "",
  bedrooms: item?.bedrooms ?? "",
  area: item?.area ?? "",
  land_area: item?.land_area ?? item?.landArea ?? "",
  crops_grown: item?.crops_grown || item?.cropsGrown || "",
  rent_lease: item?.rent_lease || item?.rentLease || "",
  images: item?.images || [],
  created_at: item?.created_at || null,
  updated_at: item?.updated_at || null,
  owner: item?.owner || null,
  raw: item,
});

const normalizeVehicle = (item, i = 0) => ({
  id: item?.id || item?._id || `v-${i}`,
  user_id: item?.user_id || item?.userId || "",
  title: item?.title || "Untitled vehicle",
  vehicle_number: item?.vehicle_number || item?.vehicleNumber || "",
  brand: item?.brand || "",
  model: item?.model || "",
  year: item?.year || "",
  rto_code: item?.rto_code || item?.rtoCode || "",
  km_driven: item?.km_driven || item?.kmDriven || "",
  state: item?.state || "",
  location: item?.location || "Unknown location",
  price: item?.price ?? "",
  contact: item?.contact || "",
  images: item?.images || [],
  created_at: item?.created_at || null,
  updated_at: item?.updated_at || null,
  owner: item?.owner || null,
  raw: item,
});

async function blobUrlToBase64(blobUrl) {
  if (!blobUrl) return undefined;
  if (blobUrl.startsWith("data:")) return blobUrl;

  try {
    const response = await fetch(blobUrl);
    const blob = await response.blob();

    return await new Promise((resolve) => {
      const reader = new FileReader();
      reader.onloadend = () => resolve(reader.result);
      reader.readAsDataURL(blob);
    });
  } catch {
    return undefined;
  }
}

export function AppProvider({ children }) {
  const navigate = useNavigate();

  const [user, setUser] = useState(DEFAULT_USER);
  const [hydrated, setHydrated] = useState(false);

  const [properties, setProperties] = useState([]);
  const [vehicles, setVehicles] = useState([]);
  const [loading, setLoading] = useState(false);
  const [listingsLoading, setListingsLoading] = useState(true);
  const [toast, setToast] = useState({
    open: false,
    message: "",
    severity: "success",
  });

  const notify = useCallback((message, severity = "success") => {
    setToast({ open: true, message, severity });
  }, []);

  const closeToast = useCallback(() => {
    setToast((prev) => ({ ...prev, open: false }));
  }, []);

  const refreshListings = useCallback(async () => {
    setListingsLoading(true);
    try {
      const [vRes, pRes] = await Promise.allSettled([
        vehicleService.getAll(),
        propertyService.getAll(),
      ]);

      if (vRes.status === "fulfilled") {
        const vPayload = vRes.value?.data ?? vRes.value ?? [];
        const vList = Array.isArray(vPayload)
          ? vPayload
          : Array.isArray(vPayload?.items)
            ? vPayload.items
            : Array.isArray(vPayload?.data)
              ? vPayload.data
              : [];
        setVehicles(vList.map((v, i) => normalizeVehicle(v, i)));
      }

      if (pRes.status === "fulfilled") {
        const pPayload = pRes.value?.data ?? pRes.value ?? [];
        const pList = Array.isArray(pPayload)
          ? pPayload
          : Array.isArray(pPayload?.items)
            ? pPayload.items
            : Array.isArray(pPayload?.data)
              ? pPayload.data
              : [];
        setProperties(pList.map((p, i) => normalizeProperty(p, i)));
      }
    } finally {
      setListingsLoading(false);
    }
  }, []);

  useEffect(() => {
    const storedToken = getStoredToken();
    const storedUser = loadUserFromStorage();

    if (storedToken && tokenStore?.get?.() !== storedToken) {
      tokenStore?.set?.(storedToken);
    }

    if (storedToken && storedUser?.loggedIn) {
      setUser(normalizeUser(storedUser, true));
    } else {
      setUser(DEFAULT_USER);
      clearUserFromStorage();
      if (!storedToken) {
        tokenStore?.clear?.();
      }
    }

    setHydrated(true);
  }, []);

  useEffect(() => {
    refreshListings();
  }, [refreshListings]);

  const login = useCallback(
    async ({ email, password }) => {
      setLoading(true);
      try {
        const response = await authService.login({ email, password });
        const payload = response?.data ?? response;

        const accessToken = payload?.access_token || payload?.token || getStoredToken();

        if (payload?.access_token && tokenStore?.get?.() !== payload.access_token) {
          tokenStore?.set?.(payload.access_token);
        }

        if (!accessToken) {
          throw new Error("No access token returned from login API");
        }

        const normalizedUser = normalizeUser(payload?.user ?? {}, true);
        setUser(normalizedUser);
        saveUserToStorage(normalizedUser);

        notify(`Welcome back, ${normalizedUser.name || email}!`);
        await refreshListings();
        return normalizedUser;
      } finally {
        setLoading(false);
      }
    },
    [notify, refreshListings],
  );

  const register = useCallback(
    async ({
      name,
      email,
      password,
      mobile,
      gender,
      dob,
      occupation,
      location,
      state,
      city,
      pincode,
      photo,
    }) => {
      setLoading(true);
      try {
        const avatar_b64 = await blobUrlToBase64(photo);

        await authService.register({
          name,
          email,
          password,
          phone: mobile || undefined,
          gender: gender || undefined,
          dob: dob || undefined,
          occupation: occupation || undefined,
          avatar_b64: avatar_b64 || undefined,
          location: location || undefined,
          state: state || undefined,
          city: city || undefined,
          pincode: pincode || undefined,
        });

        const response = await authService.login({ email, password });
        const payload = response?.data ?? response;

        if (payload?.access_token && tokenStore?.get?.() !== payload.access_token) {
          tokenStore?.set?.(payload.access_token);
        }

        const normalizedUser = normalizeUser(payload?.user ?? {}, true);
        setUser(normalizedUser);
        saveUserToStorage(normalizedUser);

        notify("Account created successfully!");
        await refreshListings();
        return normalizedUser;
      } finally {
        setLoading(false);
      }
    },
    [notify, refreshListings],
  );

  const logout = useCallback(async () => {
    try {
      await authService.logout();
    } catch {}

    tokenStore?.clear?.();
    clearUserFromStorage();
    setUser(DEFAULT_USER);

    notify("Logged out", "info");
  }, [notify]);

  const addVehicle = useCallback(
    async (payload) => {
      if (!user.role || user.role !== "admin") {
        notify("Only admins are allowed to post vehicle listings", "warning");
        return false;
      }

      const newVehicle = await vehicleService.add(payload);
      const normalized = normalizeVehicle(newVehicle?.data ?? newVehicle, 0);
      setVehicles((prev) => [normalized, ...prev]);
      notify("Vehicle listing posted!");
      return true;
    },
    [user.role, notify],
  );

  const addProperty = useCallback(
    async (payload) => {
      if (!user.role || user.role !== "admin") {
        notify("Only admins are allowed to post property listings", "warning");
        return false;
      }

      const newProperty = await propertyService.add(payload);
      const normalized = normalizeProperty(newProperty?.data ?? newProperty, 0);
      setProperties((prev) => [normalized, ...prev]);
      notify("Property listing posted!");
      return true;
    },
    [user.role, notify],
  );

  const deleteVehicle = useCallback(
    async (id) => {
      await vehicleService.deleteOne(id);
      setVehicles((prev) => prev.filter((v) => v.id !== id));
      notify("Vehicle listing deleted", "info");
    },
    [notify],
  );

  const deleteProperty = useCallback(
    async (id) => {
      await propertyService.deleteOne(id);
      setProperties((prev) => prev.filter((p) => p.id !== id));
      notify("Property listing deleted", "info");
    },
    [notify],
  );

  const upgradePremium = useCallback(() => {
    navigate("/dashboard/subscription");
  }, [navigate]);

  const updateProfile = useCallback(
    (data) => {
      setUser((prev) => {
        const updated = normalizeUser({ ...prev, ...data }, true);
        saveUserToStorage(updated);
        return updated;
      });
      notify("Profile updated");
    },
    [notify],
  );

  const isLoggedIn = hydrated && !!getStoredToken() && !!user?.loggedIn;
  const isPremium = !!user?.isPremium;

  const value = useMemo(
    () => ({
      user,
      properties,
      vehicles,
      loading,
      listingsLoading,
      hydrated,
      isLoggedIn,
      isPremium,
      login,
      logout,
      register,
      upgradePremium,
      updateProfile,
      addVehicle,
      addProperty,
      deleteVehicle,
      deleteProperty,
      refreshListings,
      notify,
    }),
    [
      user,
      properties,
      vehicles,
      loading,
      listingsLoading,
      hydrated,
      isLoggedIn,
      isPremium,
      login,
      logout,
      register,
      upgradePremium,
      updateProfile,
      addVehicle,
      addProperty,
      deleteVehicle,
      deleteProperty,
      refreshListings,
      notify,
    ],
  );

  return (
    <AppContext.Provider value={value}>
      {children}

      <Snackbar open={toast.open} autoHideDuration={3500} onClose={closeToast}>
        <Alert
          onClose={closeToast}
          severity={toast.severity}
          variant="filled"
          sx={{ borderRadius: "14px" }}
        >
          {toast.message}
        </Alert>
      </Snackbar>
    </AppContext.Provider>
  );
}

export const useAppState = () => {
  const ctx = useContext(AppContext);
  if (!ctx) {
    throw new Error("useAppState must be used inside <AppProvider>");
  }
  return ctx;
};
