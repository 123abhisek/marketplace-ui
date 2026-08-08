
import { useEffect, useMemo, useState } from "react";
import {
  Alert,
  Avatar,
  Box,
  Button,
  Card,
  CardActions,
  CardContent,
  CardMedia,
  Chip,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Divider,
  Grid,
  IconButton,
  InputAdornment,
  Stack,
  TextField,
  Typography,
} from "@mui/material";
import HomeWorkRoundedIcon from "@mui/icons-material/HomeWorkRounded";
import DirectionsCarRoundedIcon from "@mui/icons-material/DirectionsCarRounded";
import EditRoundedIcon from "@mui/icons-material/EditRounded";
import DeleteRoundedIcon from "@mui/icons-material/DeleteRounded";
import SearchRoundedIcon from "@mui/icons-material/SearchRounded";
import LocationOnRoundedIcon from "@mui/icons-material/LocationOnRounded";
import CurrencyRupeeRoundedIcon from "@mui/icons-material/CurrencyRupeeRounded";
import WarningAmberRoundedIcon from "@mui/icons-material/WarningAmberRounded";
import CloseRoundedIcon from "@mui/icons-material/CloseRounded";
import SaveRoundedIcon from "@mui/icons-material/SaveRounded";
import TuneRoundedIcon from "@mui/icons-material/TuneRounded";
import CheckCircleRoundedIcon from "@mui/icons-material/CheckCircleRounded";
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
  bg: "#F6F7FB",
  surface: "#FFFFFF",
  surfaceSoft: "#F9FAFC",
  border: "rgba(15,23,42,0.08)",
  borderStrong: "rgba(15,23,42,0.14)",
  text: "#0F172A",
  muted: "#64748B",
  faint: "#94A3B8",
  primary: "#0F766E",
  primarySoft: "rgba(15,118,110,0.10)",
  blue: "#2563EB",
  blueSoft: "rgba(37,99,235,0.10)",
  success: "#16A34A",
  successSoft: "rgba(22,163,74,0.10)",
  danger: "#DC2626",
  dangerSoft: "rgba(220,38,38,0.10)",
  warning: "#F59E0B",
  warningSoft: "rgba(245,158,11,0.12)",
  shadowSm: "0 4px 18px rgba(15,23,42,0.05)",
  shadowMd: "0 12px 34px rgba(15,23,42,0.08)",
};

const cardSx = {
  width: "30rem",
  borderRadius: "24px",
  border: `1px solid ${UI.border}`,
  background: UI.surface,
  boxShadow: UI.shadowSm,
  overflow: "hidden",
  transition: "transform 0.2s ease, box-shadow 0.2s ease",
  "&:hover": {
    transform: "translateY(-3px)",
    boxShadow: UI.shadowMd,
  },
};

const inputSx = {
  "& .MuiOutlinedInput-root": {
    borderRadius: "16px",
    background: UI.surface,
    fontSize: "0.92rem",
    fontWeight: 600,
    "& fieldset": { borderColor: UI.border },
    "&:hover fieldset": { borderColor: UI.borderStrong },
    "&.Mui-focused fieldset": { borderColor: UI.primary },
  },
  "& .MuiInputLabel-root": {
    fontSize: "0.88rem",
    fontWeight: 600,
    color: UI.muted,
    "&.Mui-focused": { color: UI.primary },
  },
};

const btnPrimary = {
  minHeight: 44,
  px: 2.25,
  borderRadius: "14px",
  textTransform: "none",
  fontWeight: 800,
  fontSize: "0.88rem",
  color: "#fff",
  background: "linear-gradient(135deg, #0F766E 0%, #2563EB 100%)",
  boxShadow: "none",
  "&:hover": { boxShadow: "none", opacity: 0.95 },
};

const btnOutlined = {
  minHeight: 44,
  px: 2.25,
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
  px: 2.25,
  borderRadius: "14px",
  textTransform: "none",
  fontWeight: 800,
  fontSize: "0.88rem",
  color: "#fff",
  background: UI.danger,
  boxShadow: "none",
  "&:hover": { background: "#b91c1c", boxShadow: "none" },
};

const getImage = (item) => {
  const img = item?.images?.[0];
  if (!img) return "";
  if (typeof img === "string") return img;
  return img?.url || img?.src || img?.preview || "";
};

const money = (value) => {
  if (value === null || value === undefined || value === "") return "—";
  const n = Number(value);
  if (Number.isNaN(n)) return String(value);
  return new Intl.NumberFormat("en-IN").format(n);
};

function SectionHeader({ icon, title, description, action }) {
  return (
    <Stack
      direction={{ xs: "column", sm: "row" }}
      justifyContent="space-between"
      alignItems={{ xs: "flex-start", sm: "center" }}
      spacing={1.5}
      sx={{ mb: 2 }}
    >
      <Box>
        <Stack
          direction="row"
          spacing={1.2}
          alignItems="center"
          sx={{ mb: 0.4 }}
        >
          <Box
            sx={{
              width: 36,
              height: 36,
              borderRadius: "12px",
              background: UI.primarySoft,
              display: "grid",
              placeItems: "center",
              color: UI.primary,
            }}
          >
            {icon}
          </Box>
          <Typography
            sx={{ color: UI.text, fontSize: "1rem", fontWeight: 900 }}
          >
            {title}
          </Typography>
        </Stack>
        {description ? (
          <Typography sx={{ color: UI.muted, fontSize: "0.82rem", ml: "48px" }}>
            {description}
          </Typography>
        ) : null}
      </Box>
      {action}
    </Stack>
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
  const Icon = isProperty ? HomeWorkRoundedIcon : DirectionsCarRoundedIcon;
  const image = getImage(item);

  return (
    <Card sx={cardSx}>
      <Box
        sx={{
          position: "relative",
          height: 200,
          background: "linear-gradient(135deg, #E2E8F0 0%, #F8FAFC 100%)",
        }}
      >
        {image ? (
          <CardMedia
            component="img"
            src={image}
            alt={item.title}
            sx={{ height: "100%", objectFit: "cover" }}
          />
        ) : (
          <Box
            sx={{
              height: "100%",
              display: "grid",
              placeItems: "center",
              color: UI.faint,
            }}
          >
            <Icon sx={{ fontSize: 54 }} />
          </Box>
        )}

        <Box
          sx={{
            position: "absolute",
            top: 12,
            left: 12,
            display: "flex",
            gap: 1,
            flexWrap: "wrap",
          }}
        >
          <Chip
            label={item.type}
            size="small"
            sx={{
              height: 28,
              borderRadius: "999px",
              fontWeight: 800,
              color: tone,
              background: "rgba(255,255,255,0.92)",
              backdropFilter: "blur(10px)",
            }}
          />
          <Chip
            icon={<CheckCircleRoundedIcon sx={{ fontSize: 14 }} />}
            label="Active"
            size="small"
            sx={{
              height: 28,
              borderRadius: "999px",
              fontWeight: 800,
              color: UI.success,
              background: "rgba(255,255,255,0.92)",
              backdropFilter: "blur(10px)",
            }}
          />
        </Box>

        <Box
          sx={{
            position: "absolute",
            top: 12,
            right: 12,
            width: 42,
            height: 42,
            borderRadius: "50%",
            background: "rgba(255,255,255,0.9)",
            display: "grid",
            placeItems: "center",
            boxShadow: "0 6px 18px rgba(15,23,42,0.12)",
          }}
        >
          <Icon sx={{ fontSize: 22, color: tone }} />
        </Box>
      </Box>

      <CardContent sx={{ p: 2.25 }}>
        <Stack spacing={1.25}>
          <Box>
            <Typography
              sx={{
                fontSize: "1rem",
                fontWeight: 900,
                color: UI.text,
                lineHeight: 1.35,
                mb: 0.4,
                display: "-webkit-box",
                WebkitLineClamp: 2,
                WebkitBoxOrient: "vertical",
                overflow: "hidden",
              }}
            >
              {item.title}
            </Typography>
            <Stack direction="row" spacing={0.75} alignItems="center">
              <LocationOnRoundedIcon sx={{ fontSize: 15, color: UI.faint }} />
              <Typography
                sx={{
                  fontSize: "0.8rem",
                  color: UI.muted,
                  fontWeight: 600,
                  overflow: "hidden",
                  textOverflow: "ellipsis",
                  whiteSpace: "nowrap",
                }}
              >
                {item.location}
              </Typography>
            </Stack>
          </Box>

          <Stack
            direction="row"
            alignItems="center"
            justifyContent="space-between"
          >
            <Stack direction="row" spacing={0.6} alignItems="center">
              <Box
                sx={{
                  width: 26,
                  height: 26,
                  borderRadius: "8px",
                  background: soft,
                  display: "grid",
                  placeItems: "center",
                  color: tone,
                }}
              >
                <CurrencyRupeeRoundedIcon sx={{ fontSize: 15 }} />
              </Box>
              <Typography
                sx={{ fontSize: "1.02rem", fontWeight: 900, color: UI.text }}
              >
                {money(item.price)}
              </Typography>
            </Stack>
            <Typography
              sx={{ fontSize: "0.75rem", fontWeight: 700, color: UI.muted }}
            >
              ID: {item.id}
            </Typography>
          </Stack>

          <Divider sx={{ borderColor: UI.border }} />

          <Grid container spacing={1}>
            {isProperty ? (
              <>
                <Grid item xs={6}>
                  <Meta label="Type" value={item.propertyType || "—"} />
                </Grid>
                <Grid item xs={6}>
                  <Meta
                    label="Area"
                    value={item.area ? `${item.area} sqft` : "—"}
                  />
                </Grid>
                <Grid item xs={6}>
                  <Meta
                    label="Land"
                    value={item.landArea ? `${item.landArea} acre` : "—"}
                  />
                </Grid>
                <Grid item xs={6}>
                  <Meta label="Contact" value={item.contact || "—"} />
                </Grid>
              </>
            ) : (
              <>
                <Grid item xs={6}>
                  <Meta label="Brand" value={item.brand || "—"} />
                </Grid>
                <Grid item xs={6}>
                  <Meta label="Model" value={item.model || "—"} />
                </Grid>
                <Grid item xs={6}>
                  <Meta label="Year" value={item.year || "—"} />
                </Grid>
                <Grid item xs={6}>
                  <Meta
                    label="KM"
                    value={item.kmDriven ? `${item.kmDriven} km` : "—"}
                  />
                </Grid>
              </>
            )}
          </Grid>
        </Stack>
      </CardContent>

      <CardActions sx={{ px: 2.25, pb: 2.25, pt: 0, gap: 1 }}>
        <Button
          fullWidth
          startIcon={<EditRoundedIcon sx={{ fontSize: 17 }} />}
          onClick={() => onEdit(item)}
          sx={{ ...btnOutlined, minHeight: 42, flex: 1 }}
        >
          Edit
        </Button>
        <Button
          fullWidth
          startIcon={<DeleteRoundedIcon sx={{ fontSize: 17 }} />}
          onClick={() => onDelete(item)}
          sx={{ ...btnDanger, minHeight: 42, flex: 1 }}
        >
          Delete
        </Button>
      </CardActions>
    </Card>
  );
}

function Meta({ label, value }) {
  return (
    <Box
      sx={{
        p: 1.1,
        borderRadius: "14px",
        background: UI.surfaceSoft,
        border: `1px solid ${UI.border}`,
      }}
    >
      <Typography
        sx={{
          fontSize: "0.7rem",
          color: UI.faint,
          fontWeight: 800,
          textTransform: "uppercase",
          letterSpacing: 0.4,
          mb: 0.2,
        }}
      >
        {label}
      </Typography>
      <Typography
        sx={{
          fontSize: "0.82rem",
          color: UI.text,
          fontWeight: 800,
          overflow: "hidden",
          textOverflow: "ellipsis",
          whiteSpace: "nowrap",
        }}
      >
        {value}
      </Typography>
    </Box>
  );
}

function EditDialogContent({
  editItem,
  editForm,
  setEditForm,
  editErrors,
  setEditErrors,
}) {
  if (!editItem) return null;
  const isProperty = editItem.type === "Property";
  const setField = (field, value) => {
    setEditForm((prev) => ({ ...prev, [field]: value }));
    if (editErrors[field]) setEditErrors((prev) => ({ ...prev, [field]: "" }));
  };

  return (
    <Stack spacing={2.2}>
      {isProperty ? (
        <>
          <Card sx={cardSx}>
            <CardContent sx={{ p: 2.5 }}>
              <SectionHeader
                icon={<HomeWorkRoundedIcon sx={{ fontSize: 18 }} />}
                title="Property Basics"
                description="Update title, type, and location"
              />
              <Grid container spacing={2}>
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

          <Card sx={cardSx}>
            <CardContent sx={{ p: 2.5 }}>
              <SectionHeader
                icon={<span style={{ fontSize: 15 }}>📐</span>}
                title="Property Details"
                description="Rooms, dimensions, and other info"
              />
              <Grid container spacing={2}>
                <Grid item xs={6} sm={4}>
                  <TextField
                    fullWidth
                    label="Floor"
                    value={editForm.floor}
                    onChange={(e) => setField("floor", e.target.value)}
                    sx={inputSx}
                  />
                </Grid>
                <Grid item xs={6} sm={4}>
                  <TextField
                    fullWidth
                    label="Rooms"
                    value={editForm.rooms}
                    onChange={(e) => setField("rooms", e.target.value)}
                    sx={inputSx}
                  />
                </Grid>
                <Grid item xs={6} sm={4}>
                  <TextField
                    fullWidth
                    label="Bedrooms"
                    value={editForm.bedrooms}
                    onChange={(e) => setField("bedrooms", e.target.value)}
                    sx={inputSx}
                  />
                </Grid>
                <Grid item xs={12} sm={6} md={4}>
                  <TextField
                    fullWidth
                    label="Built-up Area"
                    value={editForm.area}
                    onChange={(e) => setField("area", e.target.value)}
                    sx={inputSx}
                  />
                </Grid>
                <Grid item xs={12} sm={6} md={4}>
                  <TextField
                    fullWidth
                    label="Land Area"
                    value={editForm.landArea}
                    onChange={(e) => setField("landArea", e.target.value)}
                    sx={inputSx}
                  />
                </Grid>
                <Grid item xs={12}>
                  <TextField
                    fullWidth
                    label="Crops Grown"
                    value={editForm.cropsGrown}
                    onChange={(e) => setField("cropsGrown", e.target.value)}
                    sx={inputSx}
                  />
                </Grid>
              </Grid>
            </CardContent>
          </Card>

          <Card sx={cardSx}>
            <CardContent sx={{ p: 2.5 }}>
              <SectionHeader
                icon={<CurrencyRupeeRoundedIcon sx={{ fontSize: 18 }} />}
                title="Pricing"
                description="Update expected price and terms"
              />
              <Grid container spacing={2}>
                <Grid item xs={12} sm={6} md={4}>
                  <TextField
                    fullWidth
                    label="Expected Price"
                    value={editForm.price}
                    onChange={(e) => setField("price", e.target.value)}
                    error={!!editErrors.price}
                    helperText={editErrors.price}
                    sx={inputSx}
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
          <Card sx={cardSx}>
            <CardContent sx={{ p: 2.5 }}>
              <SectionHeader
                icon={<DirectionsCarRoundedIcon sx={{ fontSize: 18 }} />}
                title="Vehicle Identity"
                description="Update vehicle title and registration details"
              />
              <Grid container spacing={2}>
                <Grid item xs={12}>
                  <TextField
                    fullWidth
                    label="Listing Title"
                    value={editForm.title}
                    onChange={(e) => setField("title", e.target.value)}
                    sx={inputSx}
                  />
                </Grid>
                <Grid item xs={12} sm={6}>
                  <TextField
                    fullWidth
                    label="Vehicle Registration Number"
                    value={editForm.vehicleNumber}
                    onChange={(e) => setField("vehicleNumber", e.target.value)}
                    sx={inputSx}
                  />
                </Grid>
                <Grid item xs={12} sm={6}>
                  <TextField
                    fullWidth
                    label="Brand"
                    value={editForm.brand}
                    onChange={(e) => setField("brand", e.target.value)}
                    sx={inputSx}
                  />
                </Grid>
                <Grid item xs={12} sm={4}>
                  <TextField
                    fullWidth
                    label="Model"
                    value={editForm.model}
                    onChange={(e) => setField("model", e.target.value)}
                    sx={inputSx}
                  />
                </Grid>
                <Grid item xs={12} sm={4}>
                  <TextField
                    fullWidth
                    label="Year"
                    value={editForm.year}
                    onChange={(e) => setField("year", e.target.value)}
                    sx={inputSx}
                  />
                </Grid>
                <Grid item xs={12} sm={4}>
                  <TextField
                    fullWidth
                    label="RTO Code"
                    value={editForm.rtoCode}
                    onChange={(e) => setField("rtoCode", e.target.value)}
                    sx={inputSx}
                  />
                </Grid>
              </Grid>
            </CardContent>
          </Card>

          <Card sx={cardSx}>
            <CardContent sx={{ p: 2.5 }}>
              <SectionHeader
                icon={<span style={{ fontSize: 15 }}>🚦</span>}
                title="Usage & Location"
                description="Update odometer, state, and city"
              />
              <Grid container spacing={2}>
                <Grid item xs={12} sm={4}>
                  <TextField
                    fullWidth
                    label="KM Driven"
                    value={editForm.kmDriven}
                    onChange={(e) => setField("kmDriven", e.target.value)}
                    sx={inputSx}
                  />
                </Grid>
                <Grid item xs={12} sm={4}>
                  <TextField
                    fullWidth
                    label="State"
                    value={editForm.state}
                    onChange={(e) => setField("state", e.target.value)}
                    sx={inputSx}
                  />
                </Grid>
                <Grid item xs={12} sm={4}>
                  <TextField
                    fullWidth
                    label="City / Area"
                    value={editForm.location}
                    onChange={(e) => setField("location", e.target.value)}
                    sx={inputSx}
                  />
                </Grid>
              </Grid>
            </CardContent>
          </Card>

          <Card sx={cardSx}>
            <CardContent sx={{ p: 2.5 }}>
              <SectionHeader
                icon={<CurrencyRupeeRoundedIcon sx={{ fontSize: 18 }} />}
                title="Price & Contact"
                description="Update asking price and contact number"
              />
              <Grid container spacing={2}>
                <Grid item xs={12} sm={6}>
                  <TextField
                    fullWidth
                    label="Asking Price"
                    value={editForm.price}
                    onChange={(e) => setField("price", e.target.value)}
                    error={!!editErrors.price}
                    helperText={editErrors.price}
                    sx={inputSx}
                  />
                </Grid>
                <Grid item xs={12} sm={6}>
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
    [localItems],
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
    if (!String(editForm.price ?? "").trim())
      errors.price = "Price is required";
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
            : item,
        ),
      );
      setMessage(`${editItem.type} updated successfully.`);
      setEditSaving(false);
      closeEdit();
    }, 300);
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
      <Box sx={{ maxWidth: 1600, mx: "auto" }}>
        <Card
          sx={{
            borderRadius: "24px",
            border: `1px solid ${UI.border}`,
            background: UI.surface,
            boxShadow: UI.shadowSm,
            overflow: "hidden",
            transition: "transform 0.2s ease, box-shadow 0.2s ease",
            mb: 2.5,
            "&:hover": {
              transform: "translateY(-3px)",
              boxShadow: UI.shadowMd,
            },
          }}
        >
          <Box
            sx={{
              p: { xs: 2, md: 3 },
              background:
                "linear-gradient(135deg, rgba(15,118,110,0.08) 0%, rgba(37,99,235,0.06) 100%)",
              borderBottom: `1px solid ${UI.border}`,
            }}
          >
            <Stack
              direction={{ xs: "column", lg: "row" }}
              spacing={2.5}
              alignItems={{ xs: "stretch", lg: "center" }}
              justifyContent="space-between"
            >
              <Box>
                <Typography
                  sx={{
                    fontSize: { xs: "1.6rem", md: "2rem" },
                    fontWeight: 950,
                    color: UI.text,
                    letterSpacing: "-0.04em",
                  }}
                >
                  Admin Listings
                </Typography>
                <Typography
                  sx={{ color: UI.muted, fontSize: "0.92rem", mt: 0.5 }}
                >
                  Manage property and vehicle listings in a clean card-based
                  workspace.
                </Typography>
              </Box>

              <Stack direction="row" spacing={1} flexWrap="wrap" useFlexGap>
                {[
                  { key: "All", label: "All" },
                  { key: "Property", label: "Properties" },
                  { key: "Vehicle", label: "Vehicles" },
                ].map((item) => (
                  <Button
                    key={item.key}
                    onClick={() => setFilter(item.key)}
                    sx={{
                      ...btnOutlined,
                      background:
                        filter === item.key
                          ? "rgba(15,118,110,0.10)"
                          : UI.surface,
                      color: filter === item.key ? UI.primary : UI.text,
                      borderColor:
                        filter === item.key
                          ? "rgba(15,118,110,0.18)"
                          : UI.border,
                      minWidth: 118,
                    }}
                  >
                    {item.label} ({counts[item.key]})
                  </Button>
                ))}
              </Stack>
            </Stack>

            {message ? (
              <Alert
                sx={{ mt: 2.2, borderRadius: "16px" }}
                severity="success"
                onClose={() => setMessage("")}
              >
                {message}
              </Alert>
            ) : null}

            <Grid container spacing={2} sx={{ mt: 0.25 }}>
              <Grid item xs={12} md={8}>
                <TextField
                  fullWidth
                  placeholder="Search listings by title or location"
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  sx={{ ...inputSx, background: UI.surface }}
                  InputProps={{
                    startAdornment: (
                      <InputAdornment position="start">
                        <SearchRoundedIcon sx={{ color: UI.faint }} />
                      </InputAdornment>
                    ),
                  }}
                />
              </Grid>
              <Grid item xs={12} md={4}>
                <Button
                  fullWidth
                  startIcon={<TuneRoundedIcon />}
                  sx={btnPrimary}
                >
                  Filters
                </Button>
              </Grid>
            </Grid>
          </Box>
        </Card>

        <Grid container spacing={2.5}>
          {filtered.length === 0 ? (
            <Grid item xs={12}>
              <Box
                sx={{
                  py: 10,
                  textAlign: "center",
                  border: `1.5px dashed ${UI.border}`,
                  borderRadius: "24px",
                  background: UI.surface,
                }}
              >
                <FilterEmpty />
                <Typography sx={{ mt: 1, fontWeight: 900, color: UI.text }}>
                  No listings found
                </Typography>
                <Typography
                  sx={{ fontSize: "0.88rem", color: UI.muted, mt: 0.5 }}
                >
                  Try changing the search term or filter.
                </Typography>
              </Box>
            </Grid>
          ) : (
            filtered.map((item) => (
              <Grid item xs={12} sm={6} lg={4} xl={3} key={item.id}>
                <ListingCard
                  item={item}
                  onEdit={openEdit}
                  onDelete={openDelete}
                />
              </Grid>
            ))
          )}
        </Grid>

        <Dialog
          open={editOpen}
          onClose={closeEdit}
          maxWidth="md"
          fullWidth
          PaperProps={{ sx: { borderRadius: "28px", background: UI.bg } }}
        >
          <DialogTitle
            sx={{
              px: 3,
              pt: 2.5,
              pb: 1.5,
              display: "flex",
              justifyContent: "space-between",
              alignItems: "flex-start",
            }}
          >
            <Stack direction="row" spacing={1.5} alignItems="center">
              <Box
                sx={{
                  width: 48,
                  height: 48,
                  borderRadius: "16px",
                  background:
                    editItem?.type === "Property"
                      ? UI.primarySoft
                      : UI.blueSoft,
                  color: editItem?.type === "Property" ? UI.primary : UI.blue,
                  display: "grid",
                  placeItems: "center",
                }}
              >
                {editItem?.type === "Property" ? (
                  <HomeWorkRoundedIcon />
                ) : (
                  <DirectionsCarRoundedIcon />
                )}
              </Box>
              <Box>
                <Typography
                  sx={{ fontSize: "1.2rem", fontWeight: 950, color: UI.text }}
                >
                  Edit Listing
                </Typography>
                <Typography
                  sx={{ fontSize: "0.82rem", color: UI.muted, fontWeight: 600 }}
                >
                  {editItem?.type} · ID: {editItem?.id}
                </Typography>
              </Box>
            </Stack>
            <IconButton
              onClick={closeEdit}
              size="small"
              sx={{ color: UI.muted }}
            >
              <CloseRoundedIcon />
            </IconButton>
          </DialogTitle>

          <Divider sx={{ mx: 3, borderColor: UI.border }} />

          <DialogContent sx={{ px: 3, py: 2.5 }}>
            <EditDialogContent
              editItem={editItem}
              editForm={editForm}
              setEditForm={setEditForm}
              editErrors={editErrors}
              setEditErrors={setEditErrors}
            />
          </DialogContent>

          <DialogActions sx={{ px: 3, pb: 3, gap: 1 }}>
            <Button onClick={closeEdit} sx={btnOutlined}>
              Cancel
            </Button>
            <Button
              onClick={saveEdit}
              disabled={editSaving}
              startIcon={<SaveRoundedIcon />}
              sx={btnPrimary}
            >
              {editSaving ? "Saving..." : "Save changes"}
            </Button>
          </DialogActions>
        </Dialog>

        <Dialog
          open={deleteOpen}
          onClose={closeDelete}
          maxWidth="xs"
          fullWidth
          PaperProps={{ sx: { borderRadius: "28px" } }}
        >
          <DialogTitle sx={{ px: 3, pt: 2.5, pb: 1.5 }}>
            <Stack direction="row" spacing={1.5} alignItems="center">
              <Box
                sx={{
                  width: 48,
                  height: 48,
                  borderRadius: "16px",
                  background: UI.dangerSoft,
                  color: UI.danger,
                  display: "grid",
                  placeItems: "center",
                }}
              >
                <WarningAmberRoundedIcon />
              </Box>
              <Box>
                <Typography
                  sx={{ fontSize: "1.12rem", fontWeight: 950, color: UI.text }}
                >
                  Delete listing?
                </Typography>
                <Typography
                  sx={{ fontSize: "0.8rem", color: UI.muted, fontWeight: 600 }}
                >
                  This action cannot be undone.
                </Typography>
              </Box>
            </Stack>
          </DialogTitle>
          <Divider sx={{ mx: 3, borderColor: UI.border }} />
          <DialogContent sx={{ px: 3, py: 2.2 }}>
            <Box
              sx={{
                borderRadius: "18px",
                border: `1px solid ${UI.border}`,
                background: UI.surfaceSoft,
                p: 2,
              }}
            >
              <Typography
                sx={{
                  fontSize: "0.78rem",
                  color: UI.faint,
                  fontWeight: 800,
                  textTransform: "uppercase",
                }}
              >
                Listing to be deleted
              </Typography>
              <Typography
                sx={{
                  fontSize: "0.98rem",
                  fontWeight: 900,
                  color: UI.text,
                  mt: 0.4,
                }}
              >
                {deleteTarget?.title}
              </Typography>
              <Typography
                sx={{ fontSize: "0.82rem", color: UI.muted, mt: 0.3 }}
              >
                {deleteTarget?.location}
              </Typography>
            </Box>
          </DialogContent>
          <DialogActions sx={{ px: 3, pb: 3, gap: 1 }}>
            <Button onClick={closeDelete} sx={btnOutlined}>
              Cancel
            </Button>
            <Button onClick={confirmDelete} sx={btnDanger}>
              Yes, delete
            </Button>
          </DialogActions>
        </Dialog>
      </Box>
    </Box>
  );
}

function FilterEmpty() {
  return (
    <Box sx={{ display: "grid", placeItems: "center", mb: 1 }}>
      <Avatar
        sx={{
          width: 72,
          height: 72,
          bgcolor: UI.primarySoft,
          color: UI.primary,
        }}
      >
        <SearchRoundedIcon sx={{ fontSize: 34 }} />
      </Avatar>
    </Box>
  );
}
