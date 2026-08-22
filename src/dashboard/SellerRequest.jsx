
import React, { useCallback, useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";

// const API_ROOT = (import.meta.env.VITE_API_BASE_URL || "http://localhost:8000").replace(/\/$/, "");
// const SELLER_REQUEST_API = `${API_ROOT}/v1/api/seller-request`;


const configuredBaseUrl = import.meta.env.VITE_API_URL?.trim();

const API_ROOT =
  configuredBaseUrl ||
  (import.meta.env.DEV ? "http://localhost:8000" : "");

const SELLER_REQUEST_API =
  `${API_ROOT.replace(/\/$/, "")}/v1/api/seller-request`;


const initialForm = {
  business_name: "",
  business_type: "",
  description: "",
  location: "",
  state: "",
  city: "",
  pincode: "",
  document_url: "",
};

const STATUS_CONFIG = {
  scanning: {
    label: "Scanning",
    description: "Your submitted information is being scanned.",
    badgeClass: "bg-blue-100 text-blue-800 border-blue-300",
    containerClass: "bg-blue-50 text-blue-800 border-blue-200",
    progressClass: "bg-blue-500",
  },
  verifying: {
    label: "Verifying",
    description: "Your business details are being verified.",
    badgeClass: "bg-purple-100 text-purple-800 border-purple-300",
    containerClass: "bg-purple-50 text-purple-800 border-purple-200",
    progressClass: "bg-purple-500",
  },
  pending: {
    label: "Pending",
    description: "Your request is waiting for approval.",
    badgeClass: "bg-yellow-100 text-yellow-800 border-yellow-300",
    containerClass: "bg-yellow-50 text-yellow-800 border-yellow-200",
    progressClass: "bg-yellow-500",
  },
  approved: {
    label: "Approved",
    description: "Your seller request has been approved.",
    badgeClass: "bg-green-100 text-green-800 border-green-300",
    containerClass: "bg-green-50 text-green-800 border-green-200",
    progressClass: "bg-green-500",
  },
  rejected: {
    label: "Rejected",
    description: "Your seller request has been rejected.",
    badgeClass: "bg-red-100 text-red-800 border-red-300",
    containerClass: "bg-red-50 text-red-800 border-red-200",
    progressClass: "bg-red-500",
  },
};

function getToken() {
  return localStorage.getItem("access_token") || localStorage.getItem("token");
}

function getAuthHeaders() {
  const token = getToken();
  return token ? { Authorization: `Bearer ${token}` } : {};
}

function readStoredUser() {
  const keys = ["userData", "user", "currentUser"];

  for (const key of keys) {
    try {
      const value = localStorage.getItem(key);
      if (!value) continue;

      const parsed = JSON.parse(value);
      if (parsed && typeof parsed === "object") return parsed;
    } catch {
      // Ignore invalid local-storage JSON.
    }
  }

  return null;
}

function normalizeRole(user) {
  const role = user?.role ?? user?.Role ?? user?.user_role;
  return typeof role === "string" ? role.trim().toLowerCase() : null;
}

function isValidRequest(request) {
  return Boolean(
    request &&
      typeof request === "object" &&
      request.id &&
      request.status &&
      request.business_name
  );
}

function getErrorMessage(error, fallback) {
  const detail = error?.response?.data?.detail;

  if (Array.isArray(detail)) {
    return detail.map((item) => item.msg || "Invalid value").join(", ");
  }

  if (typeof detail === "string") return detail;
  return fallback;
}

export default function SellerRequest() {
  const navigate = useNavigate();

  const [form, setForm] = useState(initialForm);
  const [currentUser, setCurrentUser] = useState(() => readStoredUser());
  const [latestRequest, setLatestRequest] = useState(null);
  const [loading, setLoading] = useState(false);
  const [pageLoading, setPageLoading] = useState(true);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [sellerSuccess, setSellerSuccess] = useState(false);
  const [redirectCountdown, setRedirectCountdown] = useState(5);

  const wasApproved = useRef(false);
  const userRole = normalizeRole(currentUser);
  const isFreeUser = userRole === "free";

  const fetchCurrentUser = useCallback(async () => {
    const storedUser = readStoredUser();
    if (storedUser) setCurrentUser(storedUser);
  }, []);

  const fetchLatestRequest = useCallback(async (showLoader = false) => {
    if (showLoader) setPageLoading(true);

    try {
      const response = await axios.get(`${SELLER_REQUEST_API}/my-request`, {
        headers: getAuthHeaders(),
      });

      const request = response.data;

      // Backend should return null when no request exists.
      if (!isValidRequest(request)) {
        setLatestRequest(null);
        return;
      }

      const normalizedRequest = {
        ...request,
        status: String(request.status).trim().toLowerCase(),
      };

      setLatestRequest(normalizedRequest);

      if (normalizedRequest.status === "approved" && !wasApproved.current) {
        wasApproved.current = true;
        setSellerSuccess(true);
        setSuccess("Congratulations! You are now a seller user.");
        await fetchCurrentUser();
      }
    } catch (requestError) {
      if (requestError.response?.status !== 404) {
        console.error("Failed to fetch seller request:", requestError);
      }
      setLatestRequest(null);
    } finally {
      if (showLoader) setPageLoading(false);
    }
  }, [fetchCurrentUser]);

  useEffect(() => {
    const loadPage = async () => {
      setPageLoading(true);
      await fetchCurrentUser();
      await fetchLatestRequest(false);
      setPageLoading(false);
    };

    loadPage();
  }, [fetchCurrentUser, fetchLatestRequest]);

  useEffect(() => {
    const status = latestRequest?.status;
    if (!["scanning", "verifying", "pending"].includes(status)) {
      return undefined;
    }

    const intervalId = window.setInterval(() => {
      fetchLatestRequest(false);
    }, 5000);

    return () => window.clearInterval(intervalId);
  }, [latestRequest?.status, fetchLatestRequest]);

  useEffect(() => {
    if (!sellerSuccess) return undefined;

    setRedirectCountdown(5);

    const countdownId = window.setInterval(() => {
      setRedirectCountdown((value) => Math.max(value - 1, 0));
    }, 1000);

    const redirectId = window.setTimeout(() => {
      navigate("/seller");
    }, 5000);

    return () => {
      window.clearInterval(countdownId);
      window.clearTimeout(redirectId);
    };
  }, [sellerSuccess, navigate]);

  const handleChange = (event) => {
    const { name, value } = event.target;
    setForm((previous) => ({ ...previous, [name]: value }));
  };

  const validate = () => {
    const requiredFields = [
      "business_name",
      "business_type",
      "location",
      "state",
      "city",
      "pincode",
    ];

    for (const field of requiredFields) {
      if (!form[field].trim()) {
        return `${field.replace("_", " ")} is required`;
      }
    }

    if (!/^\d{4,10}$/.test(form.pincode.trim())) {
      return "Please enter a valid pincode";
    }

    return "";
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    setError("");
    setSuccess("");

    if (!getToken()) {
      setError("Your login session has expired. Please log in again.");
      return;
    }

    if (userRole !== "free") {
      setError("Only free users can submit a seller request.");
      return;
    }

    const validationError = validate();
    if (validationError) {
      setError(validationError);
      return;
    }

    setLoading(true);

    try {
      const response = await axios.post(
        `${SELLER_REQUEST_API}/request`,
        form,
        {
          headers: {
            "Content-Type": "application/json",
            ...getAuthHeaders(),
          },
        }
      );

      const createdRequest = response.data;

      if (!isValidRequest(createdRequest)) {
        throw new Error("The server returned an invalid seller request.");
      }

      setLatestRequest({
        ...createdRequest,
        status: String(createdRequest.status).trim().toLowerCase(),
      });
      setForm(initialForm);
      wasApproved.current = false;
      setSuccess("Your seller request has been submitted. Verification has started.");
    } catch (requestError) {
      console.error("Failed to submit seller request:", requestError);
      setError(
        requestError.message === "The server returned an invalid seller request."
          ? requestError.message
          : getErrorMessage(
              requestError,
              "Failed to submit seller request. Please try again."
            )
      );
    } finally {
      setLoading(false);
    }
  };

  const status = latestRequest?.status;
  const statusInfo = status ? STATUS_CONFIG[status] : null;
  const isProcessing = ["scanning", "verifying", "pending"].includes(status);
  const canApplyAgain = !latestRequest || status === "rejected";

  if (pageLoading) {
    return (
      <div className="mx-auto max-w-2xl p-6">
        <h1 className="mb-1 text-2xl font-bold text-gray-800">Become a Seller</h1>
        <p className="mb-6 text-gray-500">Checking your account and seller request...</p>
        <div className="flex items-center justify-center rounded-xl border bg-gray-50 p-10 text-gray-500">
          Loading...
        </div>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-2xl p-6">
      <h1 className="mb-1 text-2xl font-bold text-gray-800">Become a Seller</h1>
      <p className="mb-6 text-gray-500">Fill in your business details to apply for a seller account.</p>

      {sellerSuccess && (
        <div className="mb-6 rounded-xl border border-green-300 bg-green-50 p-5 text-green-800 shadow-sm">
          <div className="flex items-start gap-3">
            <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-green-600 font-bold text-white">✓</div>
            <div>
              <h2 className="font-bold text-green-900">Congratulations!</h2>
              <p className="mt-1 text-sm">You are successfully registered as a seller user.</p>
              <p className="mt-2 text-xs text-green-700">
                Redirecting to your seller dashboard in <strong>{redirectCountdown}</strong> seconds...
              </p>
              <button
                type="button"
                onClick={() => navigate("/seller")}
                className="mt-3 rounded-lg bg-green-600 px-4 py-2 text-sm font-semibold text-white hover:bg-green-700"
              >
                Go to Seller Dashboard
              </button>
            </div>
          </div>
        </div>
      )}

      {error && (
        <div className="mb-4 rounded-md border border-red-200 bg-red-50 p-3 text-sm text-red-700">
          {error}
        </div>
      )}

      {success && !sellerSuccess && (
        <div className="mb-4 rounded-md border border-green-200 bg-green-50 p-3 text-sm text-green-700">
          {success}
        </div>
      )}

      {latestRequest?.id && statusInfo && (
        <div className={`mb-6 rounded-lg border p-4 ${statusInfo.containerClass}`}>
          <div className="mb-2 flex items-center justify-between gap-3">
            <h2 className="font-semibold">Your Latest Request</h2>
            <span className={`rounded-full border px-3 py-1 text-xs font-semibold ${statusInfo.badgeClass}`}>
              {statusInfo.label.toUpperCase()}
            </span>
          </div>

          <p className="text-sm"><span className="font-medium">Business:</span> {latestRequest.business_name}</p>
          <p className="mt-1 text-sm"><span className="font-medium">Request ID:</span> {latestRequest.id}</p>
          <p className="mt-1 text-sm">
            <span className="font-medium">Submitted:</span>{" "}
            {latestRequest.created_at ? new Date(latestRequest.created_at).toLocaleString() : "-"}
          </p>
          <p className="mt-2 text-sm">{statusInfo.description}</p>

          {isProcessing && (
            <div className="mt-4">
              <div className="h-2 w-full overflow-hidden rounded-full bg-white/70">
                <div className={`h-full w-1/2 animate-pulse rounded-full ${statusInfo.progressClass}`} />
              </div>
              <p className="mt-2 text-xs opacity-75">This page automatically checks for status updates.</p>
            </div>
          )}

          {latestRequest.admin_remarks && (
            <p className="mt-3 text-sm"><span className="font-medium">Admin remarks:</span> {latestRequest.admin_remarks}</p>
          )}
        </div>
      )}

      {!currentUser ? (
        <div className="rounded-lg border border-red-200 bg-red-50 p-4 text-sm text-red-700">
          Unable to read your account details. Please log in again.
        </div>
      ) : !isFreeUser ? (
        <div className="rounded-lg border border-blue-200 bg-blue-50 p-4 text-sm text-blue-800">
          Only free users can submit a seller request.
        </div>
      ) : !canApplyAgain ? (
        <div className="rounded-lg border border-blue-200 bg-blue-50 p-4 text-sm text-blue-800">
          {status === "approved"
            ? "You are already registered as a seller."
            : `Your seller request is currently ${status}. Please wait while it is processed.`}
        </div>
      ) : (
        <form onSubmit={handleSubmit} className="space-y-4 rounded-xl border bg-white p-6 shadow-sm">
          <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
            <div>
              <label className="mb-1 block text-sm font-medium text-gray-700">Business Name *</label>
              <input type="text" name="business_name" value={form.business_name} onChange={handleChange} className="w-full rounded-lg border px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-blue-500" placeholder="Acme Traders" />
            </div>
            <div>
              <label className="mb-1 block text-sm font-medium text-gray-700">Business Type *</label>
              <input type="text" name="business_type" value={form.business_type} onChange={handleChange} className="w-full rounded-lg border px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-blue-500" placeholder="Retail / Wholesale / Manufacturer" />
            </div>
          </div>

          <div>
            <label className="mb-1 block text-sm font-medium text-gray-700">Description</label>
            <textarea name="description" value={form.description} onChange={handleChange} rows={3} className="w-full rounded-lg border px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-blue-500" placeholder="Briefly describe your business" />
          </div>

          <div>
            <label className="mb-1 block text-sm font-medium text-gray-700">Address / Location *</label>
            <input type="text" name="location" value={form.location} onChange={handleChange} className="w-full rounded-lg border px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-blue-500" placeholder="Street, Area" />
          </div>

          <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
            <div>
              <label className="mb-1 block text-sm font-medium text-gray-700">State *</label>
              <input type="text" name="state" value={form.state} onChange={handleChange} className="w-full rounded-lg border px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-blue-500" />
            </div>
            <div>
              <label className="mb-1 block text-sm font-medium text-gray-700">City *</label>
              <input type="text" name="city" value={form.city} onChange={handleChange} className="w-full rounded-lg border px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-blue-500" />
            </div>
            <div>
              <label className="mb-1 block text-sm font-medium text-gray-700">Pincode *</label>
              <input type="text" name="pincode" value={form.pincode} onChange={handleChange} className="w-full rounded-lg border px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-blue-500" />
            </div>
          </div>

          <div>
            <label className="mb-1 block text-sm font-medium text-gray-700">Document URL</label>
            <input type="url" name="document_url" value={form.document_url} onChange={handleChange} className="w-full rounded-lg border px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-blue-500" placeholder="Link to GST certificate / ID proof" />
          </div>

          <button type="submit" disabled={loading} className="w-full rounded-lg bg-blue-600 py-2.5 font-medium text-white transition hover:bg-blue-700 disabled:bg-blue-300">
            {loading ? "Submitting..." : "Submit Seller Request"}
          </button>
        </form>
      )}
    </div>
  );
}