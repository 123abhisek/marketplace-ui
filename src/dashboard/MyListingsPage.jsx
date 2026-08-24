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
    <Stack spacing={3}>
      {/* ── Header ── */}
      <Stack
        direction={{ xs: "column", sm: "row" }}
        justifyContent="space-between"
        alignItems={{ sm: "center" }}
        spacing={2}
      >
        <Box>
          <Typography
            variant="h5"
            fontWeight={900}
            sx={{ color: "#1E293B", letterSpacing: "-0.03em" }}
          >
            My Listings
          </Typography>
          <Typography sx={{ fontSize: "0.82rem", color: "#94A3B8", mt: 0.25 }}>
            {loading ? "Loading…" : `${totalListings} listings posted under your account`}
          </Typography>
        </Box>
        <Stack direction="row" spacing={1.5}>
          <Button
            onClick={fetchMyListings}
            disabled={loading}
            startIcon={<RefreshRoundedIcon />}
            sx={{
              borderRadius: "12px",
              fontWeight: 700,
              color: "#64748B",
              "&:hover": { background: "#F1F5F9" },
            }}
          >
            Refresh
          </Button>
          <Button
            component={RouterLink}
            to="/dashboard/add-property"
            variant="contained"
            startIcon={<AddCircleOutlineRoundedIcon />}
            sx={{
              borderRadius: "12px",
              fontWeight: 800,
              background: "#0F766E",
              "&:hover": { background: "#0D6B63" },
              boxShadow: "none",
            }}
          >
            + Add Property
          </Button>
          <Button
            component={RouterLink}
            to="/dashboard/add-vehicle"
            variant="outlined"
            startIcon={<AddCircleOutlineRoundedIcon />}
            sx={{
              borderRadius: "12px",
              fontWeight: 800,
              borderColor: "#0F766E",
              color: "#0F766E",
              "&:hover": { background: "#F0FDFA", borderColor: "#0D6B63" },
            }}
          >
            + Add Vehicle
          </Button>
        </Stack>
      </Stack>

      {/* ── Unified Account Info ── */}
      <Card sx={{ borderRadius: "16px", background: "linear-gradient(135deg, #F8FAFC 0%, #EFF6FF 100%)", border: "1px solid #E2E8F0", p: 2 }}>
        <Typography variant="body2" color="#334155" fontWeight={600}>
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
        <EmptyState
          title="No listings yet"
          description="You haven't posted any property or vehicle listings yet. Click '+ Add Property' or '+ Add Vehicle' to list your item."
        />
      ) : (
        <Stack spacing={4}>
          {/* Properties Section */}
          {properties.length > 0 && (
            <Box>
              <Typography variant="h6" fontWeight={800} sx={{ color: "#1E293B", mb: 2 }}>
                🏢 My Properties ({properties.length})
              </Typography>
              <Grid container spacing={{ xs: 2.5, sm: 3, md: 3.5 }}>
                {properties.map((item) => (
                  <Grid size={{ xs: 12, sm: 6, md: 4 }} key={item.id}>
                    <Box sx={{ position: "relative", width: "100%" }}>
                      <Box sx={{ position: "absolute", top: 12, right: 12, zIndex: 3 }}>
                        {renderStatusBadge(item.status, item.rejection_reason)}
                      </Box>
                      <PropertyCard item={item} />
                      {/* Action Buttons */}
                      <Stack
                        direction="row"
                        spacing={1}
                        sx={{
                          position: "absolute",
                          bottom: 14,
                          right: 14,
                          zIndex: 2,
                        }}
                      >
                        <Button
                          size="small"
                          component={RouterLink}
                          to={`/dashboard/add-property?edit=${item.id}`}
                          startIcon={<EditRoundedIcon sx={{ fontSize: "15px !important" }} />}
                          sx={{
                            borderRadius: "10px",
                            fontWeight: 700,
                            fontSize: "0.72rem",
                            background: "#EFF6FF",
                            color: "#3B82F6",
                            border: "1px solid #BFDBFE",
                            "&:hover": { background: "#DBEAFE" },
                          }}
                        >
                          Edit
                        </Button>
                        <Button
                          size="small"
                          onClick={() => setDeleteTarget({ id: item.id, type: "property" })}
                          startIcon={<DeleteOutlineRoundedIcon sx={{ fontSize: "15px !important" }} />}
                          sx={{
                            borderRadius: "10px",
                            fontWeight: 700,
                            fontSize: "0.72rem",
                            background: "#FEF2F2",
                            color: "#EF4444",
                            border: "1px solid #FCA5A5",
                            "&:hover": { background: "#FEE2E2" },
                          }}
                        >
                          Delete
                        </Button>
                      </Stack>
                    </Box>
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
              <Grid container spacing={{ xs: 2.5, sm: 3, md: 3.5 }}>
                {vehicles.map((item) => (
                  <Grid size={{ xs: 12, sm: 6, md: 4 }} key={item.id}>
                    <Box sx={{ position: "relative", width: "100%" }}>
                      <Box sx={{ position: "absolute", top: 12, right: 12, zIndex: 3 }}>
                        {renderStatusBadge(item.status, item.rejection_reason)}
                      </Box>
                      <VehicleCard item={item} />
                      {/* Action Buttons */}
                      <Stack
                        direction="row"
                        spacing={1}
                        sx={{
                          position: "absolute",
                          bottom: 14,
                          right: 14,
                          zIndex: 2,
                        }}
                      >
                        <Button
                          size="small"
                          component={RouterLink}
                          to={`/dashboard/add-vehicle?edit=${item.id}`}
                          startIcon={<EditRoundedIcon sx={{ fontSize: "15px !important" }} />}
                          sx={{
                            borderRadius: "10px",
                            fontWeight: 700,
                            fontSize: "0.72rem",
                            background: "#EFF6FF",
                            color: "#3B82F6",
                            border: "1px solid #BFDBFE",
                            "&:hover": { background: "#DBEAFE" },
                          }}
                        >
                          Edit
                        </Button>
                        <Button
                          size="small"
                          onClick={() => setDeleteTarget({ id: item.id, type: "vehicle" })}
                          startIcon={<DeleteOutlineRoundedIcon sx={{ fontSize: "15px !important" }} />}
                          sx={{
                            borderRadius: "10px",
                            fontWeight: 700,
                            fontSize: "0.72rem",
                            background: "#FEF2F2",
                            color: "#EF4444",
                            border: "1px solid #FCA5A5",
                            "&:hover": { background: "#FEE2E2" },
                          }}
                        >
                          Delete
                        </Button>
                      </Stack>
                    </Box>
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
