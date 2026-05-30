
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { useNavigate } from "react-router-dom";
import {
  Alert,
  Box,
  Button,
  Card,
  CardContent,
  CircularProgress,
  Divider,
  Grid,
  Stack,
  Typography,
} from "@mui/material";
import AddHomeRoundedIcon from "@mui/icons-material/AddHomeRounded";
import SaveRoundedIcon from "@mui/icons-material/SaveRounded";
import FormInput from "../components/FormInput";
import SelectInput from "../components/SelectInput";
import ImageUploader from "../components/ImageUploader";
import { useAppState } from "../hooks/useAppState";
import { propertyService } from "../services/api";
import { extractError } from "../utils/mappers";
import { filesToBase64, revokePreviewUrls } from "../utils/imageUtils";

const PROPERTY_TYPES = [
  { label: "Residential", value: "Residential" },
  { label: "Commercial", value: "Commercial" },
  { label: "Agricultural", value: "Agricultural" },
  { label: "Site", value: "Site" },
  { label: "Flat", value: "Flat" },
  { label: "Apartment", value: "Apartment" },
  { label: "Villa", value: "Villa" },
  { label: "Land", value: "Land" },
];

// ── Converts to float for fields the backend expects as number ────────────────
function toFloatOrNull(value) {
  const raw = String(value ?? "").trim();
  if (!raw) return null;
  const n = parseFloat(raw);
  return isNaN(n) ? null : n;
}

// ── Trims string fields, returns "" for empty ─────────────────────────────────
function toStr(value) {
  return String(value ?? "").trim();
}

// ── Shared validator for number-only fields ───────────────────────────────────
function validateNumericField(label, required = false) {
  return (v) => {
    const raw = String(v ?? "").trim();
    if (!raw) return required ? `${label} is required` : true;
    const n = parseFloat(raw);
    if (isNaN(n)) return `${label} must be a valid number (e.g. 1800)`;
    if (n <= 0) return `${label} must be greater than 0`;
    return true;
  };
}

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
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
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
      {description && (
        <Typography sx={{ fontSize: "0.8rem", color: "#94A3B8", ml: "46px" }}>
          {description}
        </Typography>
      )}
    </Box>
  );
}

export default function AddPropertyPage() {
  const { user, notify } = useAppState();
  const navigate = useNavigate();

  const [files, setFiles] = useState([]);
  const [submitting, setSubmitting] = useState(false);
  const [apiError, setApiError] = useState("");

  useEffect(() => {
    return () => revokePreviewUrls(files.map((f) => f.preview));
  }, [files]);

  const { control, handleSubmit, watch } = useForm({
    mode: "onTouched",
    defaultValues: {
      title: "",
      propertyType: PROPERTY_TYPES[0].value,
      location: "",
      apartmentName: "",
      floor: "",
      rooms: "",
      bedrooms: "",
      area: "",
      landArea: "",
      cropsGrown: "",
      expectedPrice: "",
      rentLease: "",
      contactNumber: "",
    },
  });

  const propType = watch("propertyType");
  const isResidential = ["Flat", "Residential", "Apartment", "Villa"].includes(propType);
  const isAgri = propType === "Agricultural";

  const onSubmit = async (data) => {
    if (user.role !== "admin") {
      notify("Only admins are allowed to post listings", "warning");
      return;
    }

    setSubmitting(true);
    setApiError("");

    try {
      const base64Images = await filesToBase64(files.map((f) => f.file ?? f));

      const payload = {
        // ── strings ───────────────────────────────────────────────────────────
        title:          toStr(data.title),
        property_type:  toStr(data.propertyType),
        location:       toStr(data.location),
        apartment_name: toStr(data.apartmentName),
        contact:        toStr(data.contactNumber),
        floor:          toStr(data.floor),       // backend expects string
        rooms:          toStr(data.rooms),       // backend expects string
        bedrooms:       toStr(data.bedrooms),    // backend expects string
        crops_grown:    toStr(data.cropsGrown),
        rent_lease:     toStr(data.rentLease),

        // ── numbers ───────────────────────────────────────────────────────────
        area:           toFloatOrNull(data.area),
        land_area:      toFloatOrNull(data.landArea),
        price:          toFloatOrNull(data.expectedPrice),

        // ── images ───────────────────────────────────────────────────────────
        images: base64Images,
      };

      await propertyService.add(payload);
      notify("Property listing posted!");
      navigate("/admin/listings");
    } catch (err) {
      setApiError(extractError(err));
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <Stack spacing={3}>
      {/* ── Page header ── */}
      <Stack direction="row" alignItems="center" spacing={2}>
        <Box>
          <Typography
            variant="h5"
            fontWeight={900}
            sx={{ color: "#1E293B", letterSpacing: "-0.03em" }}
          >
            Add Property
          </Typography>
          <Typography sx={{ fontSize: "0.8rem", color: "#94A3B8" }}>
            Fill in the details to create a new listing
          </Typography>
        </Box>
      </Stack>

      {apiError && (
        <Alert severity="error" sx={{ borderRadius: "14px" }} onClose={() => setApiError("")}>
          {apiError}
        </Alert>
      )}

      <form onSubmit={handleSubmit(onSubmit)} noValidate>
        <Stack spacing={2.5}>

          {/* ── Section 1: Basic Information ── */}
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
                  <FormInput
                    name="title"
                    label="Listing Title *"
                    control={control}
                    rules={{ required: "Title is required" }}
                  />
                </Grid>
                <Grid item xs={12} sm={6} md={4}>
                  <SelectInput
                    name="propertyType"
                    label="Property Type *"
                    control={control}
                    rules={{ required: "Property type is required" }}
                    defaultValue={PROPERTY_TYPES[0].value}
                    options={PROPERTY_TYPES}
                  />
                </Grid>
                <Grid item xs={12} sm={6} md={4}>
                  <FormInput
                    name="location"
                    label="Location / Address"
                    control={control}
                  />
                </Grid>
                <Grid item xs={12} sm={6} md={4}>
                  <FormInput
                    name="apartmentName"
                    label="Apartment / Society Name"
                    control={control}
                  />
                </Grid>
                <Grid item xs={12} sm={6} md={4}>
                  <FormInput
                    name="contactNumber"
                    label="Contact Number *"
                    control={control}
                    rules={{
                      required: "Contact number is required",
                      pattern: {
                        value: /^[6-9]\d{9}$/,
                        message: "Enter a valid 10-digit mobile number",
                      },
                    }}
                  />
                </Grid>
              </Grid>
            </CardContent>
          </Card>

          {/* ── Section 2: Property Details ── */}
          <Card sx={{ borderRadius: "20px", boxShadow: "0 2px 20px rgba(15,23,42,0.07)" }}>
            <CardContent sx={{ p: 3 }}>
              <SectionHeader
                icon={<span style={{ fontSize: 15 }}>📐</span>}
                title="Property Details"
                description="Dimensions, rooms, and structural information"
              />
              <Divider sx={{ mb: 3, opacity: 0.6 }} />
              <Grid container spacing={2.5}>
                {isResidential && (
                  <>
                    <Grid item xs={6} sm={4}>
                      {/* floor → string on backend, free text like "G", "1st", "2" */}
                      <FormInput
                        name="floor"
                        label="Floor (e.g. G, 1, 2nd)"
                        control={control}
                      />
                    </Grid>
                    <Grid item xs={6} sm={4}>
                      {/* rooms → string on backend */}
                      <FormInput
                        name="rooms"
                        label="Rooms"
                        control={control}
                      />
                    </Grid>
                    <Grid item xs={6} sm={4}>
                      {/* bedrooms → string on backend */}
                      <FormInput
                        name="bedrooms"
                        label="Bedrooms"
                        control={control}
                      />
                    </Grid>
                  </>
                )}
                <Grid item xs={12} sm={6} md={4}>
                  <FormInput
                    name="area"
                    label="Built-up Area (sqft) *"
                    control={control}
                    rules={{
                      required: "Built-up area is required",
                      validate: validateNumericField("Built-up area", true),
                    }}
                  />
                </Grid>
                <Grid item xs={12} sm={6} md={4}>
                  <FormInput
                    name="landArea"
                    label="Land Area (acres) *"
                    control={control}
                    rules={{
                      required: "Land area is required",
                      validate: validateNumericField("Land area", true),
                    }}
                  />
                </Grid>
                {isAgri && (
                  <Grid item xs={12}>
                    <FormInput
                      name="cropsGrown"
                      label="Crops Grown"
                      control={control}
                    />
                  </Grid>
                )}
              </Grid>
            </CardContent>
          </Card>

          {/* ── Section 3: Pricing & Terms ── */}
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
                  <FormInput
                    name="expectedPrice"
                    label="Expected Price (₹) *"
                    control={control}
                    rules={{
                      required: "Expected price is required",
                      validate: validateNumericField("Expected price", true),
                    }}
                  />
                </Grid>
                <Grid item xs={12} sm={6} md={4}>
                  <FormInput
                    name="rentLease"
                    label="Rent / Lease Details (optional)"
                    control={control}
                  />
                </Grid>
              </Grid>
            </CardContent>
          </Card>

          {/* ── Section 4: Images ── */}
          <Card sx={{ borderRadius: "20px", boxShadow: "0 2px 20px rgba(15,23,42,0.07)" }}>
            <CardContent sx={{ p: 3 }}>
              <SectionHeader
                icon={<span style={{ fontSize: 15 }}>🖼️</span>}
                title="Property Images"
                description="Upload multiple photos to attract buyers (drag & drop supported)"
              />
              <Divider sx={{ mb: 3, opacity: 0.6 }} />
              <ImageUploader
                value={files}
                onChange={setFiles}
                label="Upload Property Photos"
              />
            </CardContent>
          </Card>

          {/* ── Action row ── */}
          <Box sx={{ display: "flex", justifyContent: "flex-end", gap: 2 }}>
            <Button
              onClick={() => navigate(-1)}
              sx={{
                borderRadius: "12px",
                fontWeight: 700,
                color: "#64748B",
                "&:hover": { background: "#F1F5F9" },
              }}
            >
              Cancel
            </Button>
            <Button
              type="submit"
              variant="contained"
              disabled={submitting}
              startIcon={
                submitting ? (
                  <CircularProgress size={16} color="inherit" />
                ) : (
                  <SaveRoundedIcon />
                )
              }
              sx={{
                borderRadius: "12px",
                fontWeight: 800,
                px: 4,
                background: "linear-gradient(135deg, #4361EE 0%, #7C3AED 100%)",
                boxShadow: "0 4px 16px rgba(67,97,238,0.30)",
                "&:hover": { boxShadow: "0 6px 24px rgba(67,97,238,0.40)" },
                "&.Mui-disabled": { opacity: 0.55, background: "#CBD5E1" },
              }}
            >
              {submitting ? "Posting…" : "Post Property Listing"}
            </Button>
          </Box>
        </Stack>
      </form>
    </Stack>
  );
}