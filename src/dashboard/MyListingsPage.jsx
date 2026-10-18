// src/dashboard/MyListingsPage.jsx
import { useCallback, useEffect, useRef, useState } from "react";
import { useNavigate, Link as RouterLink } from "react-router-dom";
import {
  Alert,
  Box,
  Button,
  Chip,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Grid,
  Skeleton,
  Stack,
  Typography,
  Card,
  CardContent,
} from "@mui/material";
import ApartmentRoundedIcon from "@mui/icons-material/ApartmentRounded";
import DirectionsCarRoundedIcon from "@mui/icons-material/DirectionsCarRounded";
import DeleteOutlineRoundedIcon from "@mui/icons-material/DeleteOutlineRounded";
import EditRoundedIcon from "@mui/icons-material/EditRounded";
import RefreshRoundedIcon from "@mui/icons-material/RefreshRounded";
import AddCircleOutlineRoundedIcon from "@mui/icons-material/AddCircleOutlineRounded";
import InboxRoundedIcon from "@mui/icons-material/InboxRounded";
import PropertyCard from "../components/PropertyCard";
import VehicleCard from "../components/VehicleCard";
import Loader from "../components/Loader";
import EmptyState from "../components/EmptyState";
import { propertyService, vehicleService } from "../services/api";
import { mapProperty, mapVehicle, extractError } from "../utils/mappers";
import { useAppState } from "../hooks/useAppState";

export default function MyListingsPage() {
  const { notify } = useAppState();
  const navigate = useNavigate();
  const [properties, setProperties] = useState([]);
  const [vehicles, setVehicles] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [deleteTarget, setDeleteTarget] = useState(null); // { id, type }
  const [deleting, setDeleting] = useState(false);

  const fetchMyListings = useCallback(async () => {
    setLoading(true);
    setError("");
    try {
      const [propRes, vehRes] = await Promise.allSettled([
        propertyService.myListings(),
        vehicleService.myListings(),
      ]);

      if (propRes.status === "fulfilled") {
        setProperties((propRes.value || []).map(mapProperty));
      }
      if (vehRes.status === "fulfilled") {
        setVehicles((vehRes.value || []).map(mapVehicle));
      }
    } catch (err) {
      setError(extractError(err));
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchMyListings();
  }, [fetchMyListings]);

  const confirmDelete = async () => {
    if (!deleteTarget) return;
    setDeleting(true);
    try {
      if (deleteTarget.type === "property") {
        await propertyService.deleteOne(deleteTarget.id);
        setProperties((prev) => prev.filter((p) => p.id !== deleteTarget.id));
      } else {
        await vehicleService.deleteOne(deleteTarget.id);
        setVehicles((prev) => prev.filter((v) => v.id !== deleteTarget.id));
      }
      notify("Listing deleted");
    } catch (err) {
      notify(extractError(err), "error");
    } finally {
      setDeleting(false);
      setDeleteTarget(null);
    }
  };

  const renderStatusBadge = (status, reason) => {
    const s = String(status || "approved").toLowerCase();
    if (s === "pending") {
      return <Chip label="Pending Approval" size="small" sx={{ background: "#FEF3C7", color: "#B45309", fontWeight: 700, fontSize: "0.72rem" }} />;
    }
    if (s === "rejected") {
      return (
        <Stack spacing={0.5} alignItems="flex-end">
          <Chip label="Rejected" size="small" sx={{ background: "#FEE2E2", color: "#DC2626", fontWeight: 700, fontSize: "0.72rem" }} />
          {reason && (
            <Typography variant="caption" sx={{ color: "#EF4444", fontSize: "0.7rem", fontStyle: "italic", maxWidth: 180, textAlign: "right" }}>
              Reason: {reason}
            </Typography>
          )}
        </Stack>
      );
    }
    if (s === "suspended") {
      return <Chip label="Suspended" size="small" sx={{ background: "#F3F4F6", color: "#4B5563", fontWeight: 700, fontSize: "0.72rem" }} />;
    }
    return <Chip label="Approved & Live" size="small" sx={{ background: "#ECFDF5", color: "#059669", fontWeight: 700, fontSize: "0.72rem" }} />;
  };

  const totalListings = properties.length + vehicles.length;

  return (
    <Stack spacing={{ xs: 2.5, sm: 3 }} sx={{ pb: { xs: 12, sm: 6 } }}>
      {/* ── Header ── */}
      <Stack
        direction={{ xs: "column", sm: "row" }}
        justifyContent="space-between"
        alignItems={{ xs: "stretch", sm: "center" }}
        spacing={{ xs: 1.5, sm: 2 }}
      >
        {/* Listing Stats Chips (Desktop & Tablet) */}
        <Box sx={{ display: { xs: "none", sm: "block" } }}>
          <Stack direction="row" alignItems="center" spacing={1}>
            {loading ? (
              <Skeleton variant="rounded" width={110} height={32} sx={{ borderRadius: "8px", bgcolor: "#E2E8F0" }} />
            ) : (
              <Chip
                label={`${totalListings} Listings Total`}
                sx={{
                  fontWeight: 800,
                  fontSize: "0.8rem",
                  background: "rgba(15, 118, 110, 0.08)",
                  color: "#0F766E",
                  border: "1px solid rgba(15, 118, 110, 0.2)",
                  borderRadius: "8px",
                  height: 32,
                }}
              />
            )}
            {properties.length > 0 && (
              <Chip
                label={`${properties.length} Properties`}
                size="small"
                sx={{
                  fontWeight: 700,
                  fontSize: "0.75rem",
                  background: "#F1F5F9",
                  color: "#475569",
                  borderRadius: "8px",
                  height: 30,
                }}
              />
            )}
            {vehicles.length > 0 && (
              <Chip
                label={`${vehicles.length} Vehicles`}
                size="small"
                sx={{
                  fontWeight: 700,
                  fontSize: "0.75rem",
                  background: "#F1F5F9",
                  color: "#475569",
                  borderRadius: "8px",
                  height: 30,
                }}
              />
            )}
          </Stack>
        </Box>

        {/* Mobile Status Row (count + refresh) */}
        <Stack
          direction="row"
          alignItems="center"
          justifyContent="space-between"
          sx={{ display: { xs: "flex", sm: "none" } }}
        >
          {loading ? (
            <Skeleton variant="rounded" width={90} height={26} sx={{ borderRadius: "8px", bgcolor: "#E2E8F0" }} />
          ) : (
            <Chip
              label={`${totalListings} Listings Total`}
              size="small"
              sx={{
                fontWeight: 800,
                fontSize: "0.75rem",
                background: "rgba(15, 118, 110, 0.08)",
                color: "#0F766E",
                borderRadius: "8px",
              }}
            />
          )}
          <Button
            onClick={fetchMyListings}
            disabled={loading}
            size="small"
            startIcon={<RefreshRoundedIcon sx={{ fontSize: "16px !important" }} />}
            sx={{
              fontSize: "0.78rem",
              fontWeight: 700,
              color: "#64748B",
              textTransform: "none",
              px: 1.25,
              py: 0.5,
              borderRadius: "8px",
              border: "1px solid #E2E8F0",
              background: "#FFFFFF",
              "&:hover": { background: "#F1F5F9" },
            }}
          >
            Refresh
          </Button>
        </Stack>

        {/* Action Buttons */}
        <Stack
          direction="row"
          spacing={1.5}
          alignItems="center"
          sx={{ width: { xs: "100%", sm: "auto" } }}
        >
          <Button
            onClick={fetchMyListings}
            disabled={loading}
            variant="outlined"
            startIcon={<RefreshRoundedIcon sx={{ fontSize: "18px !important" }} />}
            sx={{
              display: { xs: "none", sm: "inline-flex" },
              borderRadius: "12px",
              fontWeight: 700,
              fontSize: "0.82rem",
              color: "#64748B",
              borderColor: "#E2E8F0",
              background: "#FFFFFF",
              minHeight: 42,
              px: 2,
              textTransform: "none",
              whiteSpace: "nowrap",
              "&:hover": { background: "#F8FAFC", borderColor: "#CBD5E1" },
            }}
          >
            Refresh
          </Button>
          <Button
            component={RouterLink}
            to="/dashboard/add-property"
            variant="contained"
            startIcon={<AddCircleOutlineRoundedIcon sx={{ fontSize: "18px !important" }} />}
            sx={{
              flex: { xs: 1, sm: "initial" },
              minHeight: 42,
              px: { xs: 1.5, sm: 2.5 },
              borderRadius: "12px",
              fontWeight: 800,
              fontSize: { xs: "0.8rem", sm: "0.85rem" },
              whiteSpace: "nowrap",
              textTransform: "none",
              background: "#0F766E",
              "&:hover": { background: "#0D6B63" },
              boxShadow: "none",
            }}
          >
            Add Property
          </Button>
          <Button
            component={RouterLink}
            to="/dashboard/add-vehicle"
            variant="outlined"
            startIcon={<AddCircleOutlineRoundedIcon sx={{ fontSize: "18px !important" }} />}
            sx={{
              flex: { xs: 1, sm: "initial" },
              minHeight: 42,
              px: { xs: 1.5, sm: 2.5 },
              borderRadius: "12px",
              fontWeight: 800,
              fontSize: { xs: "0.8rem", sm: "0.85rem" },
              whiteSpace: "nowrap",
              textTransform: "none",
              borderColor: "#0F766E",
              color: "#0F766E",
              background: "#FFFFFF",
              "&:hover": { background: "#F0FDFA", borderColor: "#0D6B63" },
            }}
          >
            Add Vehicle
          </Button>
        </Stack>
      </Stack>

      {/* ── Unified Account Info ── */}
      <Card
        sx={{
          borderRadius: "16px",
          background: "linear-gradient(135deg, #F8FAFC 0%, #EFF6FF 100%)",
          border: "1px solid #E2E8F0",
          p: { xs: 1.5, sm: 2 },
        }}
      >
        <Typography
          variant="body2"
          sx={{
            color: "#334155",
            fontWeight: 500,
            fontSize: { xs: "0.78rem", sm: "0.85rem" },
            lineHeight: 1.55,
          }}
        >
          💡 <strong>One Account Marketplace:</strong> You can create, edit, and manage both Property and Vehicle listings from the same user account. New listings enter <em>Pending Approval</em> before appearing publicly.
        </Typography>
      </Card>

      {/* ── API Error ── */}
      {error && (
        <Alert
          severity="error"
          sx={{ borderRadius: "14px" }}
          action={
            <Button color="inherit" size="small" onClick={fetchMyListings}>
              Retry
            </Button>
          }
        >
          {error}
        </Alert>
      )}

      {/* ── Content ── */}
      {loading ? (
        <Loader count={3} />
      ) : totalListings === 0 && !error ? (
        <Card
          sx={{
            borderRadius: "20px",
            border: "1px dashed #CBD5E1",
            background: "#F8FAFC",
            p: { xs: 3, sm: 5 },
            textAlign: "center",
          }}
        >
          <Stack alignItems="center" spacing={1.5} sx={{ maxWidth: 360, mx: "auto" }}>
            <Box
              sx={{
                width: 56,
                height: 56,
                borderRadius: "50%",
                background: "#E2E8F0",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                color: "#64748B",
                mb: 0.5,
              }}
            >
              <InboxRoundedIcon sx={{ fontSize: 28 }} />
            </Box>
            <Typography variant="h6" fontWeight={800} sx={{ color: "#1E293B", fontSize: { xs: "1.05rem", sm: "1.2rem" } }}>
              No listings yet
            </Typography>
            <Typography
              variant="body2"
              sx={{ color: "#64748B", fontSize: { xs: "0.82rem", sm: "0.875rem" }, lineHeight: 1.5 }}
            >
              You haven't posted any property or vehicle listings yet. Get started by adding your first listing below.
            </Typography>
            <Stack direction="row" spacing={1.5} sx={{ pt: 1, width: "100%", justifyContent: "center" }}>
              <Button
                component={RouterLink}
                to="/dashboard/add-property"
                variant="contained"
                size="small"
                startIcon={<AddCircleOutlineRoundedIcon sx={{ fontSize: "16px !important" }} />}
                sx={{
                  flex: { xs: 1, sm: "initial" },
                  borderRadius: "10px",
                  fontWeight: 700,
                  fontSize: "0.8rem",
                  background: "#0F766E",
                  "&:hover": { background: "#0D6B63" },
                  boxShadow: "none",
                  py: 1,
                  px: 2,
                }}
              >
                Add Property
              </Button>
              <Button
                component={RouterLink}
                to="/dashboard/add-vehicle"
                variant="outlined"
                size="small"
                startIcon={<AddCircleOutlineRoundedIcon sx={{ fontSize: "16px !important" }} />}
                sx={{
                  flex: { xs: 1, sm: "initial" },
                  borderRadius: "10px",
                  fontWeight: 700,
                  fontSize: "0.8rem",
                  borderColor: "#0F766E",
                  color: "#0F766E",
                  "&:hover": { background: "#F0FDFA", borderColor: "#0D6B63" },
                  py: 1,
                  px: 2,
                }}
              >
                Add Vehicle
              </Button>
            </Stack>
          </Stack>
        </Card>
      ) : (
        <Stack spacing={4}>
          {/* Properties Section */}
          {properties.length > 0 && (
            <Box>
              <Typography variant="h6" fontWeight={800} sx={{ color: "#1E293B", mb: 2 }}>
                🏢 My Properties ({properties.length})
              </Typography>
              <Grid container spacing={{ xs: 2.5, sm: 3, md: 3.5 }} alignItems="stretch">
                {properties.map((item) => (
                  <Grid size={{ xs: 12, sm: 6, md: 4 }} key={item.id} sx={{ display: "flex" }}>
                    <PropertyCard
                      item={item}
                      editUrl={`/dashboard/add-property?edit=${item.id}`}
                      onDelete={() => setDeleteTarget({ id: item.id, type: "property", title: item.title })}
                    />
                  </Grid>
                ))}
              </Grid>
            </Box>
          )}

          {/* Vehicles Section */}
          {vehicles.length > 0 && (
            <Box>
              <Typography variant="h6" fontWeight={800} sx={{ color: "#1E293B", mb: 2 }}>
                🚗 My Vehicles ({vehicles.length})
              </Typography>
              <Grid container spacing={{ xs: 2.5, sm: 3, md: 3.5 }} alignItems="stretch">
                {vehicles.map((item) => (
                  <Grid size={{ xs: 12, sm: 6, md: 4 }} key={item.id} sx={{ display: "flex" }}>
                    <VehicleCard
                      item={item}
                      editUrl={`/dashboard/add-vehicle?edit=${item.id}`}
                      onDelete={() => setDeleteTarget({ id: item.id, type: "vehicle", title: item.title || `${item.brand} ${item.model}` })}
                    />
                  </Grid>
                ))}
              </Grid>
            </Box>
          )}
        </Stack>
      )}

      {/* ── Confirm delete dialog ── */}
      <Dialog
        open={!!deleteTarget}
        onClose={() => !deleting && setDeleteTarget(null)}
        PaperProps={{ sx: { borderRadius: "20px", p: 1 } }}
      >
        <DialogTitle sx={{ fontWeight: 800 }}>Delete listing?</DialogTitle>
        <DialogContent>
          <Typography sx={{ color: "#64748B", fontSize: "0.88rem" }}>
            This will permanently remove your listing from the marketplace. This action cannot be undone.
          </Typography>
        </DialogContent>
        <DialogActions sx={{ p: 2, pt: 0, gap: 1 }}>
          <Button
            onClick={() => setDeleteTarget(null)}
            disabled={deleting}
            sx={{ borderRadius: "12px", fontWeight: 700, color: "#64748B" }}
          >
            Cancel
          </Button>
          <Button
            onClick={confirmDelete}
            disabled={deleting}
            variant="contained"
            sx={{
              borderRadius: "12px",
              fontWeight: 800,
              background: "#EF4444",
              "&:hover": { background: "#DC2626" },
              boxShadow: "none",
            }}
          >
            {deleting ? "Deleting…" : "Yes, delete"}
          </Button>
        </DialogActions>
      </Dialog>
    </Stack>
  );
}
