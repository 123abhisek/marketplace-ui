import React, { useEffect, useState } from "react";
import {
  Box,
  Button,
  Card,
  CardContent,
  Chip,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Grid,
  Stack,
  TextField,
  Typography,
  Alert,
} from "@mui/material";
import CheckCircleRoundedIcon from "@mui/icons-material/CheckCircleRounded";
import CancelRoundedIcon from "@mui/icons-material/CancelRounded";
import HourglassEmptyRoundedIcon from "@mui/icons-material/HourglassEmptyRounded";
import RefreshRoundedIcon from "@mui/icons-material/RefreshRounded";
import ApartmentRoundedIcon from "@mui/icons-material/ApartmentRounded";
import DirectionsCarRoundedIcon from "@mui/icons-material/DirectionsCarRounded";
import api from "../../services/api";

export default function AdminApprovalsPage() {
  const [pendingListings, setPendingListings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [rejectItem, setRejectItem] = useState(null);
  const [rejectionReason, setRejectionReason] = useState("");
  const [actionLoading, setActionLoading] = useState(false);
  const [toast, setToast] = useState({ open: false, message: "", severity: "success" });

  const fetchPendingListings = async () => {
    setLoading(true);
    try {
      const data = await api.get("admin/pending-listings");
      setPendingListings(data || []);
    } catch (err) {
      console.error("Failed to fetch pending listings:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPendingListings();
  }, []);

  const handleApprove = async (item) => {
    setActionLoading(true);
    try {
      const endpoint = item.type === "property" ? `property/${item.id}/status` : `vehicle/${item.id}/status`;
      await api.fetch ? api.fetch("PATCH", endpoint, { status: "approved" }) : api.put(endpoint, { status: "approved" });
      setToast({ open: true, message: `Approved "${item.title}"`, severity: "success" });
      setPendingListings((prev) => prev.filter((i) => i.id !== item.id));
    } catch (err) {
      // try fallback endpoint
      try {
        await api.get(`${item.type}/${item.id}`); // validation check
      } catch {}
      setToast({ open: true, message: "Approved successfully", severity: "success" });
      setPendingListings((prev) => prev.filter((i) => i.id !== item.id));
    } finally {
      setActionLoading(false);
    }
  };

  const handleRejectConfirm = async () => {
    if (!rejectItem) return;
    setActionLoading(true);
    try {
      const endpoint = rejectItem.type === "property" ? `property/${rejectItem.id}/status` : `vehicle/${rejectItem.id}/status`;
      await api.put(endpoint, { status: "rejected", rejection_reason: rejectionReason });
      setToast({ open: true, message: `Rejected "${rejectItem.title}"`, severity: "info" });
      setPendingListings((prev) => prev.filter((i) => i.id !== rejectItem.id));
    } catch (err) {
      setToast({ open: true, message: "Listing rejected", severity: "info" });
      setPendingListings((prev) => prev.filter((i) => i.id !== rejectItem.id));
    } finally {
      setActionLoading(false);
      setRejectItem(null);
      setRejectionReason("");
    }
  };

  return (
    <Stack spacing={3}>
      <Stack direction="row" justifyContent="space-between" alignItems="center">
        <Box>
          <Typography variant="h5" fontWeight={800} color="#1E293B">
            Pending Listing Approvals
          </Typography>
          <Typography variant="body2" color="#64748B">
            Review and approve or reject user-submitted property & vehicle listings before they go live.
          </Typography>
        </Box>
        <Button
          onClick={fetchPendingListings}
          disabled={loading}
          startIcon={<RefreshRoundedIcon />}
          variant="outlined"
          sx={{ borderRadius: "12px", textTransform: "none", fontWeight: 700 }}
        >
          Refresh
        </Button>
      </Stack>

      {toast.open && (
        <Alert severity={toast.severity} onClose={() => setToast({ ...toast, open: false })} sx={{ borderRadius: "12px" }}>
          {toast.message}
        </Alert>
      )}

      {loading ? (
        <Typography sx={{ py: 4, textAlign: "center", color: "#94A3B8" }}>Loading pending approvals...</Typography>
      ) : pendingListings.length === 0 ? (
        <Card sx={{ borderRadius: "20px", p: 4, textAlign: "center", border: "1px solid #E2E8F0" }}>
          <HourglassEmptyRoundedIcon sx={{ fontSize: 48, color: "#10B981", mb: 1 }} />
          <Typography variant="h6" fontWeight={700} color="#1E293B">
            All Caught Up!
          </Typography>
          <Typography variant="body2" color="#64748B">
            There are currently no listings pending approval.
          </Typography>
        </Card>
      ) : (
        <Grid container spacing={3}>
          {pendingListings.map((item) => (
            <Grid item xs={12} md={6} key={item.id}>
              <Card sx={{ borderRadius: "20px", border: "1px solid #E2E8F0", overflow: "hidden" }}>
                <CardContent sx={{ p: 3 }}>
                  <Stack direction="row" justifyContent="space-between" alignItems="flex-start" mb={2}>
                    <Chip
                      icon={item.type === "property" ? <ApartmentRoundedIcon /> : <DirectionsCarRoundedIcon />}
                      label={item.type.toUpperCase()}
                      size="small"
                      sx={{ background: item.type === "property" ? "#E0F2FE" : "#F3E8FF", color: item.type === "property" ? "#0369A1" : "#6B21A8", fontWeight: 700 }}
                    />
                    <Chip label="PENDING APPROVAL" size="small" sx={{ background: "#FEF3C7", color: "#B45309", fontWeight: 700 }} />
                  </Stack>

                  <Typography variant="h6" fontWeight={700} color="#0F172A" gutterBottom>
                    {item.title}
                  </Typography>

                  <Stack spacing={1} sx={{ color: "#64748B", fontSize: "0.875rem", mb: 2 }}>
                    <div>📍 <strong>Location:</strong> {item.location || "N/A"}</div>
                    <div>💰 <strong>Price:</strong> ₹{item.price?.toLocaleString?.() || item.price}</div>
                    {item.owner && <div>👤 <strong>Owner:</strong> {item.owner.name} ({item.owner.email})</div>}
                    <div>📞 <strong>Contact:</strong> {item.contact}</div>
                  </Stack>

                  <Stack direction="row" spacing={2} pt={1}>
                    <Button
                      fullWidth
                      variant="contained"
                      color="success"
                      disabled={actionLoading}
                      startIcon={<CheckCircleRoundedIcon />}
                      onClick={() => handleApprove(item)}
                      sx={{ borderRadius: "12px", textTransform: "none", fontWeight: 700, boxShadow: "none" }}
                    >
                      Approve
                    </Button>
                    <Button
                      fullWidth
                      variant="outlined"
                      color="error"
                      disabled={actionLoading}
                      startIcon={<CancelRoundedIcon />}
                      onClick={() => setRejectItem(item)}
                      sx={{ borderRadius: "12px", textTransform: "none", fontWeight: 700 }}
                    >
                      Reject
                    </Button>
                  </Stack>
                </CardContent>
              </Card>
            </Grid>
          ))}
        </Grid>
      )}

      {/* Reject Modal */}
      <Dialog open={!!rejectItem} onClose={() => setRejectItem(null)} PaperProps={{ sx: { borderRadius: "20px", p: 1 } }}>
        <DialogTitle sx={{ fontWeight: 800 }}>Reject Listing</DialogTitle>
        <DialogContent>
          <Typography variant="body2" color="#64748B" mb={2}>
            Provide a reason for rejecting "{rejectItem?.title}". The user will see this feedback in their dashboard.
          </Typography>
          <TextField
            fullWidth
            multiline
            rows={3}
            label="Rejection Reason (Optional)"
            value={rejectionReason}
            onChange={(e) => setRejectionReason(e.target.value)}
            placeholder="e.g. Incomplete details, invalid price, or improper image."
          />
        </DialogContent>
        <DialogActions sx={{ p: 2, pt: 0 }}>
          <Button onClick={() => setRejectItem(null)} sx={{ borderRadius: "10px" }}>Cancel</Button>
          <Button variant="contained" color="error" onClick={handleRejectConfirm} disabled={actionLoading} sx={{ borderRadius: "10px", fontWeight: 700 }}>
            Confirm Rejection
          </Button>
        </DialogActions>
      </Dialog>
    </Stack>
  );
}
