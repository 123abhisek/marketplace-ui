
import { useEffect, useMemo, useState } from "react";
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
  Divider,
  Grid,
  InputAdornment,
  Stack,
  TextField,
  Typography,
  Alert,
} from "@mui/material";
import HomeWorkRoundedIcon from "@mui/icons-material/HomeWorkRounded";
import DirectionsCarRoundedIcon from "@mui/icons-material/DirectionsCarRounded";
import EditRoundedIcon from "@mui/icons-material/EditRounded";
import DeleteRoundedIcon from "@mui/icons-material/DeleteRounded";
import SearchRoundedIcon from "@mui/icons-material/SearchRounded";
import LocationOnRoundedIcon from "@mui/icons-material/LocationOnRounded";
import CurrencyRupeeRoundedIcon from "@mui/icons-material/CurrencyRupeeRounded";
import WarningAmberRoundedIcon from "@mui/icons-material/WarningAmberRounded";
import FilterListRoundedIcon from "@mui/icons-material/FilterListRounded";
import CloseRoundedIcon from "@mui/icons-material/CloseRounded";
import SaveRoundedIcon from "@mui/icons-material/SaveRounded";
import AddHomeRoundedIcon from "@mui/icons-material/AddHomeRounded";
import { useLocation } from "react-router-dom";
import { useAppState } from "../../hooks/useAppState";

const PROPERTY_TYPES = [
  "Residential",
  "Commercial",
  "Agricultural",
  "Site",
  "Flat",
  "Apartment",
  "Villa",
  "Land",
];

const UI = {
  bg: "#F5F7FB",
  surface: "#FFFFFF",
  surfaceSoft: "#F8FAFC",
  border: "rgba(15,23,42,0.08)",
  borderStrong: "rgba(15,23,42,0.12)",
  text: "#111827",
  muted: "#667085",
  faint: "#98A2B3",
  primary: "#0F766E",
  primarySoft: "rgba(15,118,110,0.10)",
  blue: "#2563EB",
  blueSoft: "rgba(37,99,235,0.10)",
  success: "#16A34A",
  successSoft: "rgba(22,163,74,0.10)",
  danger: "#DC2626",
  dangerSoft: "rgba(220,38,38,0.10)",
  shadowSm: "0 2px 10px rgba(15,23,42,0.04)",
  shadowMd: "0 10px 32px rgba(15,23,42,0.06)",
};

const cardSx = {
  borderRadius: "22px",
  border: `1px solid ${UI.border}`,
  background: UI.surface,
  boxShadow: UI.shadowSm,
  transition: "box-shadow 0.2s ease, transform 0.2s ease",
  "&:hover": { boxShadow: UI.shadowMd, transform: "translateY(-2px)" },
};

const inputSx = {
  "& .MuiOutlinedInput-root": {
    borderRadius: "14px",
    background: UI.surfaceSoft,
    fontSize: "0.88rem",
    fontWeight: 600,
    "& fieldset": { borderColor: UI.border },
    "&:hover fieldset": { borderColor: UI.borderStrong },
    "&.Mui-focused fieldset": { borderColor: UI.primary },
  },
  "& .MuiInputLabel-root": {
    fontSize: "0.85rem",
    fontWeight: 600,
    color: UI.muted,
    "&.Mui-focused": { color: UI.primary },
  },
};

const btnPrimary = {
  minHeight: 44,
  px: 2.5,
  borderRadius: "14px",
  textTransform: "none",
  fontWeight: 800,
  fontSize: "0.88rem",
  color: "#fff",
  background: UI.primary,
  boxShadow: "none",
  "&:hover": { background: "#0c615b", boxShadow: "none" },
};

const btnOutlined = {
  minHeight: 44,
  px: 2.5,
  borderRadius: "14px",
  textTransform: "none",
  fontWeight: 800,
  fontSize: "0.88rem",
  color: UI.text,
  background: UI.surface,
  border: `1px solid ${UI.border}`,
  boxShadow: "none",
  "&:hover": { background: UI.surfaceSoft, boxShadow: "none" },
};

const btnDanger = {
  minHeight: 44,
  px: 2.5,
  borderRadius: "14px",
  textTransform: "none",
  fontWeight: 800,
  fontSize: "0.88rem",
  color: "#fff",
  background: UI.danger,
  boxShadow: "none",
  "&:hover": { background: "#b91c1c", boxShadow: "none" },
};

function SectionHeader({ icon, title, description }) {
  return (
    <Box sx={{ mb: 2 }}>
      <Stack direction="row" spacing={1.5} alignItems="center" mb={0.5}>
        <Box
          sx={{
            width: 34,
            height: 34,
            borderRadius: "10px",
            background: "#EEF2FF",
            display: "grid",
            placeItems: "center",
            color: "#4361EE",
            flexShrink: 0,
          }}
        >
          {icon}
        </Box>
        <Typography fontWeight={800} sx={{ color: "#1E293B", fontSize: "0.95rem" }}>
          {title}
        </Typography>
      </Stack>
      {description ? (
        <Typography sx={{ fontSize: "0.8rem", color: "#94A3B8", ml: "46px" }}>
          {description}
        </Typography>
      ) : null}
    </Box>
  );
}

function mapItemToForm(item) {
  return {
    title: item?.title || "",
    location: item?.location || "",
    price: item?.price || "",
    propertyType: item?.propertyType || item?.property_type || "",
    contactNumber: item?.contactNumber || item?.contact || "",
    apartmentName: item?.apartmentName || item?.apartment_name || "",
    floor: item?.floor || "",
    rooms: item?.rooms ?? "",
    bedrooms: item?.bedrooms ?? "",
    area: item?.area ?? "",
    landArea: item?.landArea || item?.land_area || "",
    cropsGrown: item?.cropsGrown || item?.crops_grown || "",
    rentLease: item?.rentLease || item?.rent_lease || "",
    vehicleNumber: item?.vehicleNumber || item?.vehicle_number || "",
    brand: item?.brand || "",
    model: item?.model || "",
    year: item?.year || "",
    state: item?.state || "",
    rtoCode: item?.rtoCode || item?.rto_code || "",
    kmDriven: item?.kmDriven || item?.km_driven || "",
  };
}

function ListingCard({ item, onEdit, onDelete }) {
  const isProperty = item.type === "Property";
  const tone = isProperty ? UI.primary : UI.blue;
  const soft = isProperty ? UI.primarySoft : UI.blueSoft;
  const borderAccent = isProperty ? "rgba(15,118,110,0.18)" : "rgba(37,99,235,0.18)";
  const Icon = isProperty ? HomeWorkRoundedIcon : DirectionsCarRoundedIcon;

  return (
    <Card sx={cardSx}>
      <CardContent sx={{ p: 0, "&:last-child": { pb: 0 } }}>
        <Box
          sx={{
            height: 80,
            background: isProperty
              ? "linear-gradient(135deg, rgba(15,118,110,0.08) 0%, rgba(37,99,235,0.06) 100%)"
              : "linear-gradient(135deg, rgba(37,99,235,0.08) 0%, rgba(124,58,237,0.06) 100%)",
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            px: 2.2,
            borderBottom: `1px solid ${UI.border}`,
          }}
        >
          <Box
            sx={{
              width: 48,
              height: 48,
              borderRadius: "16px",
              background: soft,
              border: `1px solid ${borderAccent}`,
              display: "grid",
              placeItems: "center",
              color: tone,
            }}
          >
            <Icon sx={{ fontSize: 26 }} />
          </Box>

          <Stack direction="row" spacing={1}>
            <Chip
              label={item.type}
              size="small"
              sx={{
                height: 26,
                borderRadius: "999px",
                fontWeight: 800,
                fontSize: "0.7rem",
                color: tone,
                background: soft,
              }}
            />
            <Chip
              label="Active"
              size="small"
              sx={{
                height: 26,
                borderRadius: "999px",
                fontWeight: 800,
                fontSize: "0.7rem",
                color: UI.success,
                background: UI.successSoft,
              }}
            />
          </Stack>
        </Box>

        <Box sx={{ p: 2.2 }}>
          <Typography
            sx={{
              fontSize: "0.97rem",
              fontWeight: 900,
              color: UI.text,
              lineHeight: 1.35,
              mb: 0.6,
              display: "-webkit-box",
              WebkitLineClamp: 2,
              WebkitBoxOrient: "vertical",
              overflow: "hidden",
            }}
          >
            {item.title}
          </Typography>

          <Stack direction="row" spacing={0.6} alignItems="center" sx={{ mb: 0.5 }}>
            <LocationOnRoundedIcon sx={{ fontSize: 14, color: UI.faint }} />
            <Typography sx={{ fontSize: "0.78rem", color: UI.muted, fontWeight: 600 }}>
              {item.location}
            </Typography>
          </Stack>

          <Stack direction="row" spacing={0.5} alignItems="center" sx={{ mb: 2 }}>
            <CurrencyRupeeRoundedIcon sx={{ fontSize: 14, color: tone }} />
            <Typography sx={{ fontSize: "0.97rem", fontWeight: 900, color: UI.text }}>
              {item.price}
            </Typography>
          </Stack>

          <Divider sx={{ mb: 1.8, borderColor: UI.border }} />

          <Stack direction="row" spacing={1}>
            <Button
              fullWidth
              startIcon={<EditRoundedIcon sx={{ fontSize: 17 }} />}
              onClick={() => onEdit(item)}
              sx={{
                minHeight: 40,
                borderRadius: "12px",
                textTransform: "none",
                fontWeight: 800,
                fontSize: "0.82rem",
                color: tone,
                background: soft,
                border: `1px solid ${borderAccent}`,
                boxShadow: "none",
                "&:hover": { opacity: 0.85, boxShadow: "none" },
              }}
            >
              Edit
            </Button>
            <Button
              fullWidth
              startIcon={<DeleteRoundedIcon sx={{ fontSize: 17 }} />}
              onClick={() => onDelete(item)}
              sx={{
                minHeight: 40,
                borderRadius: "12px",
                textTransform: "none",
                fontWeight: 800,
                fontSize: "0.82rem",
                color: UI.danger,
                background: UI.dangerSoft,
                border: "1px solid rgba(220,38,38,0.18)",
                boxShadow: "none",
                "&:hover": { opacity: 0.85, boxShadow: "none" },
              }}
            >
              Delete
            </Button>
          </Stack>
        </Box>
      </CardContent>
    </Card>
  );
}

function EditDialogContent({ editItem, editForm, setEditForm, editErrors, setEditErrors }) {
  if (!editItem) return null;
  const isProperty = editItem.type === "Property";

  const setField = (field, value) => {
    setEditForm((prev) => ({ ...prev, [field]: value }));
    if (editErrors[field]) setEditErrors((prev) => ({ ...prev, [field]: "" }));
  };

  return (
    <Stack spacing={2.5}>
      {isProperty ? (
        <>
          <Card sx={{ borderRadius: "20px", boxShadow: "0 2px 20px rgba(15,23,42,0.07)" }}>
            <CardContent sx={{ p: 3 }}>
              <SectionHeader
                icon={<AddHomeRoundedIcon sx={{ fontSize: 18 }} />}
                title="Basic Information"
                description="Property title, type, and location details"
              />
              <Divider sx={{ mb: 3, opacity: 0.6 }} />
              <Grid container spacing={2.5}>
                <Grid item xs={12}>
                  <TextField
                    fullWidth
                    label="Listing Title *"
                    value={editForm.title}
                    onChange={(e) => setField("title", e.target.value)}
                    error={!!editErrors.title}
                    helperText={editErrors.title}
                    sx={inputSx}
                  />
                </Grid>
                <Grid item xs={12} sm={6} md={4}>
                  <TextField
                    select
                    fullWidth
                    label="Property Type"
                    value={editForm.propertyType}
                    onChange={(e) => setField("propertyType", e.target.value)}
                    sx={inputSx}
                    SelectProps={{ native: true }}
                  >
                    <option value="" />
                    {PROPERTY_TYPES.map((opt) => (
                      <option key={opt} value={opt}>
                        {opt}
                      </option>
                    ))}
                  </TextField>
                </Grid>
                <Grid item xs={12} sm={6} md={4}>
                  <TextField
                    fullWidth
                    label="Location / Address"
                    value={editForm.location}
                    onChange={(e) => setField("location", e.target.value)}
                    sx={inputSx}
                  />
                </Grid>
                <Grid item xs={12} sm={6} md={4}>
                  <TextField
                    fullWidth
                    label="Apartment / Society Name"
                    value={editForm.apartmentName}
                    onChange={(e) => setField("apartmentName", e.target.value)}
                    sx={inputSx}
                  />
                </Grid>
                <Grid item xs={12} sm={6} md={4}>
                  <TextField
                    fullWidth
                    label="Contact Number"
                    value={editForm.contactNumber}
                    onChange={(e) => setField("contactNumber", e.target.value)}
                    sx={inputSx}
                  />
                </Grid>
              </Grid>
            </CardContent>
          </Card>

          <Card sx={{ borderRadius: "20px", boxShadow: "0 2px 20px rgba(15,23,42,0.07)" }}>
            <CardContent sx={{ p: 3 }}>
              <SectionHeader
                icon={<span style={{ fontSize: 15 }}>📐</span>}
                title="Property Details"
                description="Dimensions, rooms, and structural information"
              />
              <Divider sx={{ mb: 3, opacity: 0.6 }} />
              <Grid container spacing={2.5}>
                <Grid item xs={6} sm={4}>
                  <TextField fullWidth label="Floor" value={editForm.floor} onChange={(e) => setField("floor", e.target.value)} sx={inputSx} />
                </Grid>
                <Grid item xs={6} sm={4}>
                  <TextField fullWidth label="Rooms" value={editForm.rooms} onChange={(e) => setField("rooms", e.target.value)} sx={inputSx} />
                </Grid>
                <Grid item xs={6} sm={4}>
                  <TextField fullWidth label="Bedrooms" value={editForm.bedrooms} onChange={(e) => setField("bedrooms", e.target.value)} sx={inputSx} />
                </Grid>
                <Grid item xs={12} sm={6} md={4}>
                  <TextField fullWidth label="Built-up Area" value={editForm.area} onChange={(e) => setField("area", e.target.value)} sx={inputSx} />
                </Grid>
                <Grid item xs={12} sm={6} md={4}>
                  <TextField fullWidth label="Land Area" value={editForm.landArea} onChange={(e) => setField("landArea", e.target.value)} sx={inputSx} />
                </Grid>
                <Grid item xs={12}>
                  <TextField fullWidth label="Crops Grown" value={editForm.cropsGrown} onChange={(e) => setField("cropsGrown", e.target.value)} sx={inputSx} />
                </Grid>
              </Grid>
            </CardContent>
          </Card>

          <Card sx={{ borderRadius: "20px", boxShadow: "0 2px 20px rgba(15,23,42,0.07)" }}>
            <CardContent sx={{ p: 3 }}>
              <SectionHeader
                icon={<span style={{ fontSize: 15 }}>💰</span>}
                title="Pricing & Terms"
                description="Expected price and rental / lease information"
              />
              <Divider sx={{ mb: 3, opacity: 0.6 }} />
              <Grid container spacing={2.5}>
                <Grid item xs={12} sm={6} md={4}>
                  <TextField
                    fullWidth
                    label="Expected Price"
                    value={editForm.price}
                    onChange={(e) => setField("price", e.target.value)}
                    error={!!editErrors.price}
                    helperText={editErrors.price}
                    sx={inputSx}
                    InputProps={{
                      startAdornment: (
                        <InputAdornment position="start">
                          <CurrencyRupeeRoundedIcon sx={{ fontSize: 18, color: UI.faint }} />
                        </InputAdornment>
                      ),
                    }}
                  />
                </Grid>
                <Grid item xs={12} sm={6} md={4}>
                  <TextField
                    fullWidth
                    label="Rent / Lease Details"
                    value={editForm.rentLease}
                    onChange={(e) => setField("rentLease", e.target.value)}
                    sx={inputSx}
                  />
                </Grid>
              </Grid>
            </CardContent>
          </Card>
        </>
      ) : (
        <>
          <Card sx={{ borderRadius: "20px", boxShadow: "0 2px 20px rgba(15,23,42,0.07)" }}>
            <CardContent sx={{ p: 3 }}>
              <SectionHeader
                icon={<DirectionsCarRoundedIcon sx={{ fontSize: 18 }} />}
                title="Vehicle Identity"
                description="Registration number, brand, model, and year"
              />
              <Divider sx={{ mb: 3, opacity: 0.6 }} />
              <Grid container spacing={2.5}>
                <Grid item xs={12}>
                  <TextField fullWidth label="Listing Title" value={editForm.title} onChange={(e) => setField("title", e.target.value)} sx={inputSx} />
                </Grid>
                <Grid item xs={12} sm={6}>
                  <TextField fullWidth label="Vehicle Registration Number" value={editForm.vehicleNumber} onChange={(e) => setField("vehicleNumber", e.target.value)} sx={inputSx} />
                </Grid>
                <Grid item xs={12} sm={6}>
                  <TextField fullWidth label="Brand" value={editForm.brand} onChange={(e) => setField("brand", e.target.value)} sx={inputSx} />
                </Grid>
                <Grid item xs={12} sm={4}>
                  <TextField fullWidth label="Model" value={editForm.model} onChange={(e) => setField("model", e.target.value)} sx={inputSx} />
                </Grid>
                <Grid item xs={12} sm={4}>
                  <TextField fullWidth label="Year" value={editForm.year} onChange={(e) => setField("year", e.target.value)} sx={inputSx} />
                </Grid>
                <Grid item xs={12} sm={4}>
                  <TextField fullWidth label="RTO Code" value={editForm.rtoCode} onChange={(e) => setField("rtoCode", e.target.value)} sx={inputSx} />
                </Grid>
              </Grid>
            </CardContent>
          </Card>

          <Card sx={{ borderRadius: "20px", boxShadow: "0 2px 20px rgba(15,23,42,0.07)" }}>
            <CardContent sx={{ p: 3 }}>
              <SectionHeader
                icon={<span style={{ fontSize: 15 }}>🚦</span>}
                title="Usage & Location"
                description="Odometer reading, registered state, and current location"
              />
              <Divider sx={{ mb: 3, opacity: 0.6 }} />
              <Grid container spacing={2.5}>
                <Grid item xs={12} sm={4}>
                  <TextField fullWidth label="KM Driven" value={editForm.kmDriven} onChange={(e) => setField("kmDriven", e.target.value)} sx={inputSx} />
                </Grid>
                <Grid item xs={12} sm={4}>
                  <TextField fullWidth label="State" value={editForm.state} onChange={(e) => setField("state", e.target.value)} sx={inputSx} />
                </Grid>
                <Grid item xs={12} sm={4}>
                  <TextField fullWidth label="City / Area" value={editForm.location} onChange={(e) => setField("location", e.target.value)} sx={inputSx} />
                </Grid>
              </Grid>
            </CardContent>
          </Card>

          <Card sx={{ borderRadius: "20px", boxShadow: "0 2px 20px rgba(15,23,42,0.07)" }}>
            <CardContent sx={{ p: 3 }}>
              <SectionHeader
                icon={<span style={{ fontSize: 15 }}>💰</span>}
                title="Price & Contact"
                description="Asking price and seller contact number"
              />
              <Divider sx={{ mb: 3, opacity: 0.6 }} />
              <Grid container spacing={2.5}>
                <Grid item xs={12} sm={6}>
                  <TextField fullWidth label="Asking Price" value={editForm.price} onChange={(e) => setField("price", e.target.value)} error={!!editErrors.price} helperText={editErrors.price} sx={inputSx} />
                </Grid>
                <Grid item xs={12} sm={6}>
                  <TextField fullWidth label="Contact Number" value={editForm.contactNumber} onChange={(e) => setField("contactNumber", e.target.value)} sx={inputSx} />
                </Grid>
              </Grid>
            </CardContent>
          </Card>
        </>
      )}
    </Stack>
  );
}

export default function AdminListingsPage() {
  const location = useLocation();
  const { properties = [], vehicles = [], refreshListings } = useAppState();

  const [localItems, setLocalItems] = useState([]);
  const [search, setSearch] = useState("");
  const [filter, setFilter] = useState("All");
  const [editOpen, setEditOpen] = useState(false);
  const [editItem, setEditItem] = useState(null);
  const [editForm, setEditForm] = useState({});
  const [editErrors, setEditErrors] = useState({});
  const [editSaving, setEditSaving] = useState(false);
  const [deleteOpen, setDeleteOpen] = useState(false);
  const [deleteTarget, setDeleteTarget] = useState(null);
  const [message, setMessage] = useState("");

  useEffect(() => {
    refreshListings?.();
  }, [location.pathname, refreshListings]);

  useEffect(() => {
    const next = [
      ...properties.map((item, i) => ({
        id: item.id || item._id || `p-${i}`,
        type: "Property",
        title: item.title || "Untitled property",
        location: item.location || "Unknown location",
        price: String(item.price ?? ""),
        contact: item.contact || "",
        propertyType: item.property_type || "",
        apartmentName: item.apartment_name || "",
        floor: item.floor || "",
        rooms: item.rooms ?? "",
        bedrooms: item.bedrooms ?? "",
        area: item.area ?? "",
        landArea: item.land_area ?? "",
        cropsGrown: item.crops_grown || "",
        rentLease: item.rent_lease || "",
        images: item.images || [],
        createdAt: item.created_at || null,
        updatedAt: item.updated_at || null,
        owner: item.owner || null,
        raw: item,
      })),
      ...vehicles.map((item, i) => ({
        id: item.id || item._id || `v-${i}`,
        type: "Vehicle",
        title: item.title || "Untitled vehicle",
        location: item.location || "Unknown location",
        price: String(item.price ?? ""),
        contact: item.contact || "",
        vehicleNumber: item.vehicle_number || "",
        brand: item.brand || "",
        model: item.model || "",
        year: item.year || "",
        rtoCode: item.rto_code || "",
        kmDriven: item.km_driven || "",
        state: item.state || "",
        images: item.images || [],
        createdAt: item.created_at || null,
        updatedAt: item.updated_at || null,
        owner: item.owner || null,
        raw: item,
      })),
    ];
    setLocalItems(next);
  }, [properties, vehicles]);

  const filtered = useMemo(() => {
    const q = search.toLowerCase();
    return localItems.filter((item) => {
      const matchSearch =
        item.title.toLowerCase().includes(q) ||
        item.location.toLowerCase().includes(q);
      const matchFilter = filter === "All" || item.type === filter;
      return matchSearch && matchFilter;
    });
  }, [localItems, search, filter]);

  const counts = useMemo(
    () => ({
      All: localItems.length,
      Property: localItems.filter((i) => i.type === "Property").length,
      Vehicle: localItems.filter((i) => i.type === "Vehicle").length,
    }),
    [localItems]
  );

  function openEdit(item) {
    setEditItem(item);
    setEditForm(mapItemToForm(item.raw || item));
    setEditErrors({});
    setEditOpen(true);
  }

  function closeEdit() {
    setEditOpen(false);
    setEditItem(null);
    setEditForm({});
    setEditErrors({});
  }

  function validateEdit() {
    const errors = {};
    if (!editForm.title?.trim()) errors.title = "Title is required";
    if (!editForm.location?.trim()) errors.location = "Location is required";
    if (!editForm.price?.trim()) errors.price = "Price is required";
    setEditErrors(errors);
    return Object.keys(errors).length === 0;
  }

  function saveEdit() {
    if (!validateEdit()) return;
    setEditSaving(true);
    setTimeout(() => {
      setLocalItems((prev) =>
        prev.map((item) =>
          item.id === editItem.id
            ? {
                ...item,
                title: editForm.title.trim(),
                location: editForm.location.trim(),
                price: editForm.price.trim(),
                contact: editForm.contactNumber || item.contact,
                propertyType: editForm.propertyType || item.propertyType,
                apartmentName: editForm.apartmentName || item.apartmentName,
                floor: editForm.floor || item.floor,
                rooms: editForm.rooms ?? item.rooms,
                bedrooms: editForm.bedrooms ?? item.bedrooms,
                area: editForm.area ?? item.area,
                landArea: editForm.landArea ?? item.landArea,
                cropsGrown: editForm.cropsGrown || item.cropsGrown,
                rentLease: editForm.rentLease || item.rentLease,
                vehicleNumber: editForm.vehicleNumber || item.vehicleNumber,
                brand: editForm.brand || item.brand,
                model: editForm.model || item.model,
                year: editForm.year || item.year,
                state: editForm.state || item.state,
                rtoCode: editForm.rtoCode || item.rtoCode,
                kmDriven: editForm.kmDriven ?? item.kmDriven,
                raw: { ...(item.raw || {}), ...editForm },
              }
            : item
        )
      );
      setMessage(`${editItem.type} updated successfully.`);
      setEditSaving(false);
      closeEdit();
    }, 200);
  }

  function openDelete(item) {
    setDeleteTarget(item);
    setDeleteOpen(true);
  }

  function closeDelete() {
    setDeleteOpen(false);
    setDeleteTarget(null);
  }

  function confirmDelete() {
    if (!deleteTarget) return;
    setLocalItems((prev) => prev.filter((item) => item.id !== deleteTarget.id));
    setMessage(`${deleteTarget.type} deleted successfully.`);
    closeDelete();
  }

  return (
    <Box sx={{ minHeight: "100vh", background: UI.bg, p: { xs: 1.5, md: 3 } }}>
      <Card sx={{ ...cardSx, p: { xs: 1.5, md: 2.5 }, mb: 2 }}>
        <Stack
          direction={{ xs: "column", sm: "row" }}
          spacing={2}
          alignItems={{ xs: "stretch", sm: "center" }}
          justifyContent="space-between"
        >
          <Box>
            <Typography sx={{ fontSize: "1.5rem", fontWeight: 900, color: UI.text }}>
              Admin Listings
            </Typography>
            <Typography sx={{ color: UI.muted, fontSize: "0.85rem" }}>
              Edit or delete property and vehicle listings
            </Typography>
          </Box>

          <Stack direction="row" spacing={1} flexWrap="wrap">
            {["All", "Property", "Vehicle"].map((key) => (
              <Button
                key={key}
                onClick={() => setFilter(key)}
                sx={{
                  ...btnOutlined,
                  ...(filter === key
                    ? {
                        background: UI.primarySoft,
                        color: UI.primary,
                        border: `1px solid rgba(15,118,110,0.18)`,
                      }
                    : {}),
                }}
              >
                {key} ({counts[key]})
              </Button>
            ))}
          </Stack>
        </Stack>

        {message ? (
          <Alert sx={{ mt: 2, borderRadius: "14px" }} severity="success" onClose={() => setMessage("")}>
            {message}
          </Alert>
        ) : null}

        <TextField
          fullWidth
          placeholder="Search listings..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          sx={{ mt: 2, ...inputSx }}
          InputProps={{
            startAdornment: (
              <InputAdornment position="start">
                <SearchRoundedIcon sx={{ color: UI.faint }} />
              </InputAdornment>
            ),
          }}
        />
      </Card>

      {filtered.length === 0 ? (
        <Box
          sx={{
            py: 8,
            textAlign: "center",
            border: `1.5px dashed ${UI.border}`,
            borderRadius: "20px",
            background: UI.surface,
          }}
        >
          <FilterListRoundedIcon sx={{ fontSize: 40, color: UI.faint, mb: 1 }} />
          <Typography sx={{ fontWeight: 800, color: UI.muted }}>
            No listings found
          </Typography>
          <Typography sx={{ fontSize: "0.82rem", color: UI.faint, mt: 0.5 }}>
            Try adjusting your search or filter.
          </Typography>
        </Box>
      ) : (
        <Grid container spacing={2.2}>
          {filtered.map((item) => (
            <Grid item xs={12} sm={6} lg={4} key={item.id}>
              <ListingCard item={item} onEdit={openEdit} onDelete={openDelete} />
            </Grid>
          ))}
        </Grid>
      )}

      <Dialog open={editOpen} onClose={closeEdit} maxWidth="md" fullWidth PaperProps={{ sx: { borderRadius: "24px", p: 0.5 } }}>
        <DialogTitle sx={{ px: 3, pt: 2.8, pb: 0.5, display: "flex", justifyContent: "space-between", alignItems: "center" }}>
          <Stack direction="row" spacing={1.5} alignItems="center">
            <Box
              sx={{
                width: 44,
                height: 44,
                borderRadius: "14px",
                background: editItem?.type === "Property" ? UI.primarySoft : UI.blueSoft,
                color: editItem?.type === "Property" ? UI.primary : UI.blue,
                display: "grid",
                placeItems: "center",
              }}
            >
              {editItem?.type === "Property" ? (
                <HomeWorkRoundedIcon sx={{ fontSize: 22 }} />
              ) : (
                <DirectionsCarRoundedIcon sx={{ fontSize: 22 }} />
              )}
            </Box>
            <Box>
              <Typography sx={{ fontSize: "1.12rem", fontWeight: 900, color: UI.text }}>
                Edit Listing
              </Typography>
              <Typography sx={{ fontSize: "0.78rem", color: UI.muted, fontWeight: 600 }}>
                {editItem?.type} · ID: {editItem?.id}
              </Typography>
            </Box>
          </Stack>
          <Button onClick={closeEdit} sx={{ minWidth: 0, color: UI.muted }}>
            <CloseRoundedIcon />
          </Button>
        </DialogTitle>

        <Divider sx={{ mx: 3, mt: 2, borderColor: UI.border }} />

        <DialogContent sx={{ px: 3, py: 2.5, background: UI.bg }}>
          <EditDialogContent
            editItem={editItem}
            editForm={editForm}
            setEditForm={setEditForm}
            editErrors={editErrors}
            setEditErrors={setEditErrors}
          />
        </DialogContent>

        <DialogActions sx={{ px: 3, pb: 2.8, gap: 1 }}>
          <Button onClick={closeEdit} sx={btnOutlined}>
            Cancel
          </Button>
          <Button
            onClick={saveEdit}
            disabled={editSaving}
            startIcon={editSaving ? null : <SaveRoundedIcon />}
            sx={btnPrimary}
          >
            {editSaving ? "Saving..." : "Save changes"}
          </Button>
        </DialogActions>
      </Dialog>

      <Dialog open={deleteOpen} onClose={closeDelete} maxWidth="xs" fullWidth PaperProps={{ sx: { borderRadius: "24px", p: 0.5 } }}>
        <DialogTitle sx={{ px: 3, pt: 2.8, pb: 0.5 }}>
          <Stack direction="row" spacing={1.5} alignItems="center">
            <Box
              sx={{
                width: 44,
                height: 44,
                borderRadius: "14px",
                background: UI.dangerSoft,
                color: UI.danger,
                display: "grid",
                placeItems: "center",
              }}
            >
              <WarningAmberRoundedIcon sx={{ fontSize: 22 }} />
            </Box>
            <Box>
              <Typography sx={{ fontSize: "1.12rem", fontWeight: 900, color: UI.text }}>
                Delete listing?
              </Typography>
              <Typography sx={{ fontSize: "0.78rem", color: UI.muted, fontWeight: 600 }}>
                This action cannot be undone.
              </Typography>
            </Box>
          </Stack>
        </DialogTitle>

        <Divider sx={{ mx: 3, mt: 2, borderColor: UI.border }} />

        <DialogContent sx={{ px: 3, py: 2.2 }}>
          <Box
            sx={{
              borderRadius: "16px",
              border: `1px solid ${UI.border}`,
              background: UI.surfaceSoft,
              p: 2,
            }}
          >
            <Typography sx={{ fontSize: "0.78rem", color: UI.muted, fontWeight: 700, mb: 0.5 }}>
              Listing to be deleted
            </Typography>
            <Typography sx={{ fontSize: "0.95rem", fontWeight: 900, color: UI.text }}>
              {deleteTarget?.title}
            </Typography>
            <Stack direction="row" spacing={0.6} alignItems="center" sx={{ mt: 0.5 }}>
              <LocationOnRoundedIcon sx={{ fontSize: 13, color: UI.faint }} />
              <Typography sx={{ fontSize: "0.78rem", color: UI.muted }}>
                {deleteTarget?.location}
              </Typography>
            </Stack>
          </Box>
        </DialogContent>

        <DialogActions sx={{ px: 3, pb: 2.8, gap: 1 }}>
          <Button onClick={closeDelete} sx={btnOutlined}>
            Cancel
          </Button>
          <Button onClick={confirmDelete} sx={btnDanger}>
            Yes, delete
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
}
