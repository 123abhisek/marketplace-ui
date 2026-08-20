import React, { useEffect, useState } from "react";
import axios from "axios";

const API_BASE = "http://localhost:8000/v1/api/seller-request";

const STATUS_TABS = [
  { label: "All", value: "" },
  { label: "Pending", value: "pending" },
  { label: "Approved", value: "approved" },
  { label: "Rejected", value: "rejected" },
];

const getAuthHeaders = () => {
  const token = localStorage.getItem("access_token");
  return token ? { Authorization: `Bearer ${token}` } : {};
};

export default function AdminSellerRequests() {
  const [requests, setRequests] = useState([]);
  const [statusFilter, setStatusFilter] = useState("pending");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const [activeRequest, setActiveRequest] = useState(null);
  const [actionType, setActionType] = useState(null);
  const [remarks, setRemarks] = useState("");
  const [submitting, setSubmitting] = useState(false);

  const fetchRequests = async (status) => {
    setLoading(true);
    setError("");
    try {
      const res = await axios.get(`${API_BASE}/admin/all`, {
        headers: getAuthHeaders(),
        params: status ? { status } : {},
      });
      setRequests(res.data);
    } catch (err) {
      console.error(err);
      setError("Failed to load seller requests.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchRequests(statusFilter);
  }, [statusFilter]);

  const openActionModal = (request, type) => {
    setActiveRequest(request);
    setActionType(type);
    setRemarks("");
  };

  const closeModal = () => {
    setActiveRequest(null);
    setActionType(null);
    setRemarks("");
  };

  const submitAction = async () => {
    if (!activeRequest || !actionType) return;
    setSubmitting(true);
    try {
      await axios.post(
        `${API_BASE}/admin/${activeRequest.id}/${actionType}`,
        { admin_remarks: remarks },
        { headers: { "Content-Type": "application/json", ...getAuthHeaders() } }
      );
      closeModal();
      fetchRequests(statusFilter);
    } catch (err) {
      console.error(err);
      alert(
        err.response?.data?.detail
          ? JSON.stringify(err.response.data.detail)
          : `Failed to ${actionType} request.`
      );
    } finally {
      setSubmitting(false);
    }
  };

  const statusBadge = (status) => {
    const map = {
      pending: "bg-yellow-100 text-yellow-800 border-yellow-300",
      approved: "bg-green-100 text-green-800 border-green-300",
      rejected: "bg-red-100 text-red-800 border-red-300",
    };
    const cls = map[status?.toLowerCase()] || "bg-gray-100 text-gray-800 border-gray-300";
    return (
      <span className={`px-2.5 py-1 rounded-full text-xs font-semibold border ${cls}`}>
        {status?.toUpperCase() || "UNKNOWN"}
      </span>
    );
  };

  return (
    <div className="max-w-6xl mx-auto p-6">
      <h1 className="text-2xl font-bold text-gray-800 mb-1">Seller Requests</h1>
      <p className="text-gray-500 mb-6">Review, approve, or reject seller applications.</p>

      <div className="flex gap-2 mb-5">
        {STATUS_TABS.map((tab) => (
          <button
            key={tab.value}
            onClick={() => setStatusFilter(tab.value)}
            className={`px-4 py-1.5 rounded-full text-sm font-medium border transition ${
              statusFilter === tab.value
                ? "bg-blue-600 text-white border-blue-600"
                : "bg-white text-gray-600 border-gray-300 hover:bg-gray-50"
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {error && (
        <div className="p-3 mb-4 rounded-md bg-red-50 border border-red-200 text-red-700 text-sm">
          {error}
        </div>
      )}

      {loading ? (
        <div className="text-gray-500">Loading requests...</div>
      ) : requests.length === 0 ? (
        <div className="text-gray-500 border rounded-lg p-8 text-center bg-gray-50">
          No seller requests found for this filter.
        </div>
      ) : (
        <div className="overflow-x-auto border rounded-xl">
          <table className="w-full text-sm">
            <thead className="bg-gray-50 text-gray-600 text-left">
              <tr>
                <th className="px-4 py-3">Business</th>
                <th className="px-4 py-3">Applicant</th>
                <th className="px-4 py-3">Location</th>
                <th className="px-4 py-3">Status</th>
                <th className="px-4 py-3">Submitted</th>
                <th className="px-4 py-3 text-right">Actions</th>
              </tr>
            </thead>
            <tbody>
              {requests.map((req) => (
                <tr key={req.id} className="border-t hover:bg-gray-50">
                  <td className="px-4 py-3">
                    <div className="font-medium text-gray-800">{req.business_name}</div>
                    <div className="text-xs text-gray-500">{req.business_type}</div>
                  </td>
                  <td className="px-4 py-3">
                    <div className="text-gray-800">{req.user_name || "-"}</div>
                    <div className="text-xs text-gray-500">{req.user_email}</div>
                    <div className="text-xs text-gray-500">{req.user_phone}</div>
                  </td>
                  <td className="px-4 py-3 text-gray-600">
                    {req.city}, {req.state} - {req.pincode}
                  </td>
                  <td className="px-4 py-3">{statusBadge(req.status)}</td>
                  <td className="px-4 py-3 text-gray-500">
                    {req.created_at ? new Date(req.created_at).toLocaleDateString() : "-"}
                  </td>
                  <td className="px-4 py-3 text-right space-x-2 whitespace-nowrap">
                    {req.status?.toLowerCase() === "pending" ? (
                      <>
                        <button
                          onClick={() => openActionModal(req, "approve")}
                          className="px-3 py-1.5 rounded-md bg-green-600 text-white text-xs font-medium hover:bg-green-700"
                        >
                          Approve
                        </button>
                        <button
                          onClick={() => openActionModal(req, "reject")}
                          className="px-3 py-1.5 rounded-md bg-red-600 text-white text-xs font-medium hover:bg-red-700"
                        >
                          Reject
                        </button>
                      </>
                    ) : (
                      <span className="text-xs text-gray-400">No action needed</span>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {activeRequest && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl shadow-lg max-w-md w-full p-6">
            <h2 className="text-lg font-semibold text-gray-800 mb-1">
              {actionType === "approve" ? "Approve" : "Reject"} Seller Request
            </h2>
            <p className="text-sm text-gray-500 mb-4">
              {activeRequest.business_name} — {activeRequest.user_name}
            </p>

            <label className="block text-sm font-medium text-gray-700 mb-1">
              Admin Remarks {actionType === "reject" && "(recommended)"}
            </label>
            <textarea
              value={remarks}
              onChange={(e) => setRemarks(e.target.value)}
              rows={3}
              className="w-full border rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-blue-500 outline-none mb-4"
              placeholder={
                actionType === "approve"
                  ? "e.g. Documents verified, approved."
                  : "e.g. Incomplete documents provided."
              }
            />

            <div className="flex justify-end gap-2">
              <button
                onClick={closeModal}
                disabled={submitting}
                className="px-4 py-2 rounded-lg border text-gray-600 text-sm hover:bg-gray-50"
              >
                Cancel
              </button>
              <button
                onClick={submitAction}
                disabled={submitting}
                className={`px-4 py-2 rounded-lg text-white text-sm font-medium ${
                  actionType === "approve"
                    ? "bg-green-600 hover:bg-green-700"
                    : "bg-red-600 hover:bg-red-700"
                } disabled:opacity-50`}
              >
                {submitting
                  ? "Processing..."
                  : actionType === "approve"
                  ? "Confirm Approve"
                  : "Confirm Reject"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}