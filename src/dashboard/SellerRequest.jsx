// import React, { useEffect, useState } from "react";
// import axios from "axios";

// const API_BASE = "http://localhost:8000/v1/api/seller-request";

// const initialForm = {
//   business_name: "",
//   business_type: "",
//   description: "",
//   location: "",
//   state: "",
//   city: "",
//   pincode: "",
//   document_url: "",
// };

// const getAuthHeaders = () => {
//   const token = localStorage.getItem("access_token");
//   return token ? { Authorization: `Bearer ${token}` } : {};
// };

// export default function SellerRequest() {
//   const [form, setForm] = useState(initialForm);
//   const [latestRequest, setLatestRequest] = useState(null);
//   const [loading, setLoading] = useState(false);
//   const [fetching, setFetching] = useState(true);
//   const [error, setError] = useState("");
//   const [success, setSuccess] = useState("");

//   const fetchLatestRequest = async () => {
//     setFetching(true);
//     try {
//       const res = await axios.get(`${API_BASE}/my-request`, {
//         headers: getAuthHeaders(),
//       });
//       setLatestRequest(res.data);
//     } catch (err) {
//       if (err.response?.status !== 404) {
//         console.error("Failed to fetch latest seller request", err);
//       }
//       setLatestRequest(null);
//     } finally {
//       setFetching(false);
//     }
//   };

//   useEffect(() => {
//     fetchLatestRequest();
//   }, []);

//   const handleChange = (e) => {
//     const { name, value } = e.target;
//     setForm((prev) => ({ ...prev, [name]: value }));
//   };

//   const validate = () => {
//     const requiredFields = [
//       "business_name",
//       "business_type",
//       "location",
//       "state",
//       "city",
//       "pincode",
//     ];
//     for (const field of requiredFields) {
//       if (!form[field]?.trim()) {
//         return `${field.replace("_", " ")} is required`;
//       }
//     }
//     if (!/^\d{4,10}$/.test(form.pincode)) {
//       return "Please enter a valid pincode";
//     }
//     return "";
//   };

//   const handleSubmit = async (e) => {
//     e.preventDefault();
//     setError("");
//     setSuccess("");

//     const validationError = validate();
//     if (validationError) {
//       setError(validationError);
//       return;
//     }

//     setLoading(true);
//     try {
//       const res = await axios.post(`${API_BASE}/request`, form, {
//         headers: {
//           "Content-Type": "application/json",
//           ...getAuthHeaders(),
//         },
//       });
//       setSuccess("Your seller request has been submitted successfully.");
//       setLatestRequest(res.data);
//       setForm(initialForm);
//     } catch (err) {
//       const detail = err.response?.data?.detail;
//       if (Array.isArray(detail)) {
//         setError(detail.map((d) => d.msg).join(", "));
//       } else {
//         setError(detail || "Failed to submit seller request. Please try again.");
//       }
//     } finally {
//       setLoading(false);
//     }
//   };

//   const statusBadge = (status) => {
//     const map = {
//       pending: "bg-yellow-100 text-yellow-800 border-yellow-300",
//       approved: "bg-green-100 text-green-800 border-green-300",
//       rejected: "bg-red-100 text-red-800 border-red-300",
//     };
//     const cls = map[status?.toLowerCase()] || "bg-gray-100 text-gray-800 border-gray-300";
//     return (
//       <span className={`px-3 py-1 rounded-full text-xs font-semibold border ${cls}`}>
//         {status?.toUpperCase() || "UNKNOWN"}
//       </span>
//     );
//   };

//   const canApplyAgain =
//     !latestRequest || latestRequest.status?.toLowerCase() === "rejected";

//   return (
//     <div className="max-w-2xl mx-auto p-6">
//       <h1 className="text-2xl font-bold text-gray-800 mb-1">Become a Seller</h1>
//       <p className="text-gray-500 mb-6">
//         Fill in your business details to apply for a seller account.
//       </p>

//       {fetching ? (
//         <div className="text-gray-500 mb-4">Checking existing requests...</div>
//       ) : (
//         latestRequest && (
//           <div className="mb-6 p-4 rounded-lg border bg-gray-50">
//             <div className="flex items-center justify-between mb-2">
//               <h2 className="font-semibold text-gray-700">Your Latest Request</h2>
//               {statusBadge(latestRequest.status)}
//             </div>
//             <p className="text-sm text-gray-600">
//               <span className="font-medium">Business:</span> {latestRequest.business_name}
//             </p>
//             <p className="text-sm text-gray-600">
//               <span className="font-medium">Submitted:</span>{" "}
//               {latestRequest.created_at
//                 ? new Date(latestRequest.created_at).toLocaleString()
//                 : "-"}
//             </p>
//             {latestRequest.admin_remarks && (
//               <p className="text-sm text-gray-600 mt-1">
//                 <span className="font-medium">Admin remarks:</span>{" "}
//                 {latestRequest.admin_remarks}
//               </p>
//             )}
//           </div>
//         )
//       )}

//       {!canApplyAgain ? (
//         <div className="p-4 rounded-lg bg-blue-50 border border-blue-200 text-blue-800 text-sm">
//           You already have a request that is {latestRequest.status}. You can't submit
//           a new request right now.
//         </div>
//       ) : (
//         <form onSubmit={handleSubmit} className="space-y-4 bg-white shadow-sm border rounded-xl p-6">
//           {error && (
//             <div className="p-3 rounded-md bg-red-50 border border-red-200 text-red-700 text-sm">
//               {error}
//             </div>
//           )}
//           {success && (
//             <div className="p-3 rounded-md bg-green-50 border border-green-200 text-green-700 text-sm">
//               {success}
//             </div>
//           )}

//           <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
//             <div>
//               <label className="block text-sm font-medium text-gray-700 mb-1">
//                 Business Name *
//               </label>
//               <input
//                 type="text"
//                 name="business_name"
//                 value={form.business_name}
//                 onChange={handleChange}
//                 className="w-full border rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-blue-500 outline-none"
//                 placeholder="Acme Traders"
//               />
//             </div>

//             <div>
//               <label className="block text-sm font-medium text-gray-700 mb-1">
//                 Business Type *
//               </label>
//               <input
//                 type="text"
//                 name="business_type"
//                 value={form.business_type}
//                 onChange={handleChange}
//                 className="w-full border rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-blue-500 outline-none"
//                 placeholder="Retail / Wholesale / Manufacturer"
//               />
//             </div>
//           </div>

//           <div>
//             <label className="block text-sm font-medium text-gray-700 mb-1">
//               Description
//             </label>
//             <textarea
//               name="description"
//               value={form.description}
//               onChange={handleChange}
//               rows={3}
//               className="w-full border rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-blue-500 outline-none"
//               placeholder="Briefly describe your business"
//             />
//           </div>

//           <div>
//             <label className="block text-sm font-medium text-gray-700 mb-1">
//               Address / Location *
//             </label>
//             <input
//               type="text"
//               name="location"
//               value={form.location}
//               onChange={handleChange}
//               className="w-full border rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-blue-500 outline-none"
//               placeholder="Street, Area"
//             />
//           </div>

//           <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
//             <div>
//               <label className="block text-sm font-medium text-gray-700 mb-1">
//                 State *
//               </label>
//               <input
//                 type="text"
//                 name="state"
//                 value={form.state}
//                 onChange={handleChange}
//                 className="w-full border rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-blue-500 outline-none"
//               />
//             </div>
//             <div>
//               <label className="block text-sm font-medium text-gray-700 mb-1">
//                 City *
//               </label>
//               <input
//                 type="text"
//                 name="city"
//                 value={form.city}
//                 onChange={handleChange}
//                 className="w-full border rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-blue-500 outline-none"
//               />
//             </div>
//             <div>
//               <label className="block text-sm font-medium text-gray-700 mb-1">
//                 Pincode *
//               </label>
//               <input
//                 type="text"
//                 name="pincode"
//                 value={form.pincode}
//                 onChange={handleChange}
//                 className="w-full border rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-blue-500 outline-none"
//               />
//             </div>
//           </div>

//           <div>
//             <label className="block text-sm font-medium text-gray-700 mb-1">
//               Document URL
//             </label>
//             <input
//               type="text"
//               name="document_url"
//               value={form.document_url}
//               onChange={handleChange}
//               className="w-full border rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-blue-500 outline-none"
//               placeholder="Link to GST certificate / ID proof (upload elsewhere and paste URL)"
//             />
//           </div>

//           <button
//             type="submit"
//             disabled={loading}
//             className="w-full bg-blue-600 hover:bg-blue-700 disabled:bg-blue-300 text-white font-medium py-2.5 rounded-lg transition"
//           >
//             {loading ? "Submitting..." : "Submit Seller Request"}
//           </button>
//         </form>
//       )}
//     </div>
//   );
// }








import React, {
  useEffect,
  useRef,
  useState,
} from "react";

import {
  useNavigate,
} from "react-router-dom";

import axios from "axios";

// const API_BASE =
//   "http://localhost:8000/v1/api/seller-request";


const API_BASE =
  `${import.meta.env.VITE_API_BASE_URL}/v1/api/seller-request`;

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
    description:
      "Your submitted information is being scanned.",
    badgeClass:
      "bg-blue-100 text-blue-800 border-blue-300",
    containerClass:
      "bg-blue-50 text-blue-800 border-blue-200",
    progressClass: "bg-blue-500",
  },

  verifying: {
    label: "Verifying",
    description:
      "Your business details are being verified.",
    badgeClass:
      "bg-purple-100 text-purple-800 border-purple-300",
    containerClass:
      "bg-purple-50 text-purple-800 border-purple-200",
    progressClass: "bg-purple-500",
  },

  pending: {
    label: "Pending",
    description:
      "Your request is waiting for approval.",
    badgeClass:
      "bg-yellow-100 text-yellow-800 border-yellow-300",
    containerClass:
      "bg-yellow-50 text-yellow-800 border-yellow-200",
    progressClass: "bg-yellow-500",
  },

  approved: {
    label: "Approved",
    description:
      "Your seller request has been approved.",
    badgeClass:
      "bg-green-100 text-green-800 border-green-300",
    containerClass:
      "bg-green-50 text-green-800 border-green-200",
    progressClass: "bg-green-500",
  },

  rejected: {
    label: "Rejected",
    description:
      "Your seller request has been rejected.",
    badgeClass:
      "bg-red-100 text-red-800 border-red-300",
    containerClass:
      "bg-red-50 text-red-800 border-red-200",
    progressClass: "bg-red-500",
  },
};


const getAuthHeaders = () => {
  const token = localStorage.getItem("access_token");

  return token
    ? {
        Authorization: `Bearer ${token}`,
      }
    : {};
};


export default function SellerRequest() {
  const navigate = useNavigate();

  const [form, setForm] = useState(initialForm);

  const [latestRequest, setLatestRequest] =
    useState(null);

  const [loading, setLoading] = useState(false);

  const [fetching, setFetching] = useState(true);

  const [error, setError] = useState("");

  const [success, setSuccess] = useState("");

  const [sellerSuccess, setSellerSuccess] =
    useState(false);

  const [redirectCountdown, setRedirectCountdown] =
    useState(5);

  const wasApproved = useRef(false);


  const fetchLatestRequest = async (
    showLoader = false
  ) => {
    if (showLoader) {
      setFetching(true);
    }

    try {
      const response = await axios.get(
        `${API_BASE}/my-request`,
        {
          headers: getAuthHeaders(),
        }
      );

      const request = response.data;

      if (!request) {
        setLatestRequest(null);
        return;
      }

      const requestStatus =
        request.status?.toLowerCase();

      setLatestRequest(request);

      if (
        requestStatus === "approved" &&
        !wasApproved.current
      ) {
        wasApproved.current = true;

        setSellerSuccess(true);

        setSuccess(
          "Congratulations! You are now a seller user."
        );
      }
    } catch (requestError) {
      if (requestError.response?.status !== 404) {
        console.error(
          "Failed to fetch latest seller request:",
          requestError
        );
      }

      setLatestRequest(null);
    } finally {
      if (showLoader) {
        setFetching(false);
      }
    }
  };


  useEffect(() => {
    fetchLatestRequest(true);
  }, []);


  // Poll backend while request is processing
  useEffect(() => {
    const currentStatus =
      latestRequest?.status?.toLowerCase();

    const processingStatuses = [
      "scanning",
      "verifying",
      "pending",
    ];

    const shouldPoll =
      processingStatuses.includes(currentStatus);

    if (!shouldPoll) {
      return undefined;
    }

    const pollingInterval = setInterval(() => {
      fetchLatestRequest(false);
    }, 5000);

    return () => {
      clearInterval(pollingInterval);
    };
  }, [latestRequest?.status]);


  // Redirect after seller approval
  useEffect(() => {
    if (!sellerSuccess) {
      return undefined;
    }

    setRedirectCountdown(5);

    const countdownInterval = setInterval(() => {
      setRedirectCountdown((previousCount) => {
        if (previousCount <= 1) {
          clearInterval(countdownInterval);
          return 0;
        }

        return previousCount - 1;
      });
    }, 1000);

    const redirectTimeout = setTimeout(() => {
      navigate("/seller");
    }, 5000);

    return () => {
      clearInterval(countdownInterval);
      clearTimeout(redirectTimeout);
    };
  }, [sellerSuccess, navigate]);


  const handleChange = (event) => {
    const {
      name,
      value,
    } = event.target;

    setForm((previousForm) => ({
      ...previousForm,
      [name]: value,
    }));
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
      if (!form[field]?.trim()) {
        return `${field.replace(
          "_",
          " "
        )} is required`;
      }
    }

    if (!/^\d{4,10}$/.test(form.pincode)) {
      return "Please enter a valid pincode";
    }

    return "";
  };


  const handleSubmit = async (event) => {
    event.preventDefault();

    setError("");
    setSuccess("");

    const validationError = validate();

    if (validationError) {
      setError(validationError);
      return;
    }

    setLoading(true);

    try {
      const response = await axios.post(
        `${API_BASE}/request`,
        form,
        {
          headers: {
            "Content-Type": "application/json",
            ...getAuthHeaders(),
          },
        }
      );

      const createdRequest = response.data;

      setLatestRequest(createdRequest);

      setForm(initialForm);

      wasApproved.current = false;

      setSuccess(
        "Your seller request has been submitted. Verification has started."
      );
    } catch (requestError) {
      const detail =
        requestError.response?.data?.detail;

      if (Array.isArray(detail)) {
        setError(
          detail
            .map((item) => item.msg)
            .join(", ")
        );
      } else {
        setError(
          detail ||
            "Failed to submit seller request. Please try again."
        );
      }
    } finally {
      setLoading(false);
    }
  };


  const status =
    latestRequest?.status?.toLowerCase();

  const statusInfo =
    STATUS_CONFIG[status] || {
      label: "Unknown",
      description:
        "Your request status is unavailable.",
      badgeClass:
        "bg-gray-100 text-gray-800 border-gray-300",
      containerClass:
        "bg-gray-50 text-gray-800 border-gray-200",
      progressClass: "bg-gray-500",
    };

  const processingStatuses = [
    "scanning",
    "verifying",
    "pending",
  ];

  const isProcessing =
    processingStatuses.includes(status);

  const canApplyAgain =
    !latestRequest || status === "rejected";


  if (fetching) {
    return (
      <div className="max-w-2xl mx-auto p-6">
        <h1 className="text-2xl font-bold text-gray-800 mb-1">
          Become a Seller
        </h1>

        <p className="text-gray-500 mb-6">
          Checking your existing seller request...
        </p>

        <div className="flex items-center justify-center rounded-xl border bg-gray-50 p-10">
          <div className="text-gray-500">
            Loading request status...
          </div>
        </div>
      </div>
    );
  }


  return (
    <div className="max-w-2xl mx-auto p-6">
      <h1 className="text-2xl font-bold text-gray-800 mb-1">
        Become a Seller
      </h1>

      <p className="text-gray-500 mb-6">
        Fill in your business details to apply for a seller account.
      </p>


      {sellerSuccess && (
        <div
          className="mb-6 rounded-xl border border-green-300 bg-green-50 p-5 text-green-800 shadow-sm"
          role="alert"
        >
          <div className="flex items-start gap-3">
            <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-green-600 font-bold text-white">
              ✓
            </div>

            <div>
              <h2 className="font-bold text-green-900">
                Congratulations!
              </h2>

              <p className="mt-1 text-sm">
                You are successfully registered as a seller user.
              </p>

              <p className="mt-2 text-xs text-green-700">
                Redirecting to your seller dashboard in{" "}
                <strong>
                  {redirectCountdown}
                </strong>{" "}
                seconds...
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


      {latestRequest && (
        <div
          className={`mb-6 rounded-lg border p-4 ${statusInfo.containerClass}`}
        >
          <div className="mb-2 flex items-center justify-between gap-3">
            <h2 className="font-semibold">
              Your Latest Request
            </h2>

            <span
              className={`rounded-full border px-3 py-1 text-xs font-semibold ${statusInfo.badgeClass}`}
            >
              {statusInfo.label.toUpperCase()}
            </span>
          </div>

          <p className="text-sm">
            <span className="font-medium">
              Business:
            </span>{" "}
            {latestRequest.business_name}
          </p>

          <p className="mt-1 text-sm">
            <span className="font-medium">
              Request ID:
            </span>{" "}
            {latestRequest.id}
          </p>

          <p className="mt-1 text-sm">
            <span className="font-medium">
              Submitted:
            </span>{" "}
            {latestRequest.created_at
              ? new Date(
                  latestRequest.created_at
                ).toLocaleString()
              : "-"}
          </p>

          <p className="mt-2 text-sm">
            {statusInfo.description}
          </p>

          {isProcessing && (
            <div className="mt-4">
              <div className="h-2 w-full overflow-hidden rounded-full bg-white/70">
                <div
                  className={`h-full w-1/2 animate-pulse rounded-full ${statusInfo.progressClass}`}
                />
              </div>

              <p className="mt-2 text-xs opacity-75">
                This page automatically checks for status updates.
              </p>
            </div>
          )}

          {latestRequest.admin_remarks && (
            <p className="mt-3 text-sm">
              <span className="font-medium">
                Admin remarks:
              </span>{" "}
              {latestRequest.admin_remarks}
            </p>
          )}
        </div>
      )}


      {!canApplyAgain ? (
        <div className="rounded-lg border border-blue-200 bg-blue-50 p-4 text-sm text-blue-800">
          {status === "approved"
            ? "You are already registered as a seller."
            : `Your seller request is currently ${status}. Please wait while it is processed.`}
        </div>
      ) : (
        <form
          onSubmit={handleSubmit}
          className="space-y-4 rounded-xl border bg-white p-6 shadow-sm"
        >
          <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
            <div>
              <label className="mb-1 block text-sm font-medium text-gray-700">
                Business Name *
              </label>

              <input
                type="text"
                name="business_name"
                value={form.business_name}
                onChange={handleChange}
                className="w-full rounded-lg border px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="Acme Traders"
              />
            </div>

            <div>
              <label className="mb-1 block text-sm font-medium text-gray-700">
                Business Type *
              </label>

              <input
                type="text"
                name="business_type"
                value={form.business_type}
                onChange={handleChange}
                className="w-full rounded-lg border px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="Retail / Wholesale / Manufacturer"
              />
            </div>
          </div>


          <div>
            <label className="mb-1 block text-sm font-medium text-gray-700">
              Description
            </label>

            <textarea
              name="description"
              value={form.description}
              onChange={handleChange}
              rows={3}
              className="w-full rounded-lg border px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Briefly describe your business"
            />
          </div>


          <div>
            <label className="mb-1 block text-sm font-medium text-gray-700">
              Address / Location *
            </label>

            <input
              type="text"
              name="location"
              value={form.location}
              onChange={handleChange}
              className="w-full rounded-lg border px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Street, Area"
            />
          </div>


          <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
            <div>
              <label className="mb-1 block text-sm font-medium text-gray-700">
                State *
              </label>

              <input
                type="text"
                name="state"
                value={form.state}
                onChange={handleChange}
                className="w-full rounded-lg border px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>

            <div>
              <label className="mb-1 block text-sm font-medium text-gray-700">
                City *
              </label>

              <input
                type="text"
                name="city"
                value={form.city}
                onChange={handleChange}
                className="w-full rounded-lg border px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>

            <div>
              <label className="mb-1 block text-sm font-medium text-gray-700">
                Pincode *
              </label>

              <input
                type="text"
                name="pincode"
                value={form.pincode}
                onChange={handleChange}
                className="w-full rounded-lg border px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
          </div>


          <div>
            <label className="mb-1 block text-sm font-medium text-gray-700">
              Document URL
            </label>

            <input
              type="text"
              name="document_url"
              value={form.document_url}
              onChange={handleChange}
              className="w-full rounded-lg border px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Link to GST certificate / ID proof"
            />
          </div>


          <button
            type="submit"
            disabled={loading}
            className="w-full rounded-lg bg-blue-600 py-2.5 font-medium text-white transition hover:bg-blue-700 disabled:bg-blue-300"
          >
            {loading
              ? "Submitting..."
              : "Submit Seller Request"}
          </button>
        </form>
      )}
    </div>
  );
}