// src/dashboard/AddPropertyPage.jsx
import { useCallback, useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { useNavigate, useSearchParams } from "react-router-dom";
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
import ArrowBackRoundedIcon from "@mui/icons-material/ArrowBackRounded";
import HomeWorkRoundedIcon from "@mui/icons-material/HomeWorkRounded";
import FmdGoodRoundedIcon from "@mui/icons-material/FmdGoodRounded";
import CurrencyRupeeRoundedIcon from "@mui/icons-material/CurrencyRupeeRounded";
import AddPhotoAlternateRoundedIcon from "@mui/icons-material/AddPhotoAlternateRounded";
import FormInput from "../components/FormInput";
import SelectInput from "../components/SelectInput";
import ImageUploader from "../components/ImageUploader";
import { useAppState } from "../hooks/useAppState";
import { propertyService } from "../services/api";
import { extractError } from "../utils/mappers";
import { filesToBase64, revokePreviewUrls } from "../utils/imageUtils";

const UI = {
  bg: "#F8FAFC",
  surface: "#FFFFFF",
  border: "rgba(226, 232, 240, 0.9)",
  text: "#0F172A",
  muted: "#64748B",
  primary: "#0F766E",
  primarySoft: "rgba(15, 118, 110, 0.08)",
  shadowSm: "0 4px 20px rgba(15, 23, 42, 0.04)",
  shadowMd: "0 10px 30px rgba(15, 23, 42, 0.07)",
};

const cardSx = {
  borderRadius: "24px",
  border: `1px solid ${UI.border}`,
  background: UI.surface,
  boxShadow: UI.shadowSm,
};

const PROPERTY_TYPES = [
  { label: "Residential", value: "Residential" },
  { label: "Commercial", value: "Commercial" },
  { label: "Agricultural / Farm Land", value: "Agricultural" },
  { label: "Site / Plot", value: "Site" },
  { label: "Flat", value: "Flat" },
  { label: "Apartment", value: "Apartment" },
  { label: "Villa / Independent House", value: "Villa" },
  { label: "Land", value: "Land" },
];

const RENT_LEASE_OPTIONS = [
  { label: "For Sale", value: "Sale" },
  { label: "For Rent", value: "Rent" },
  { label: "For Lease", value: "Lease" },
];

function toIntOrNull(value) {
  const raw = String(value ?? "").trim();
  if (!raw) return null;
  const n = parseInt(raw, 10);
  return isNaN(n) ? null : n;
}

function toFloatOrNull(value) {
  const raw = String(value ?? "").trim();
  if (!raw) return null;
  const n = parseFloat(raw);
  return isNaN(n) ? null : n;
}

function toStr(value) {
  return String(value ?? "").trim();
}

function SectionHeader({ icon, title, description }) {
  return (
    <Box sx={{ mb: 2.5 }}>
      <Stack direction="row" spacing={1.5} alignItems="center">
        <Box
          sx={{
            width: 40,
            height: 40,
            borderRadius: "12px",
            background: UI.primarySoft,
            color: UI.primary,
            display: "grid",
            placeItems: "center",
            flexShrink: 0,
          }}
        >
          {icon}
        </Box>
        <Box sx={{ minWidth: 0 }}>
          <Typography
            sx={{
              fontWeight: 800,
              fontSize: "1.02rem",
              color: UI.text,
              lineHeight: 1.25,
            }}
          >
            {title}
          </Typography>
          {description && (
            <Typography sx={{ fontSize: "0.82rem", color: UI.muted, mt: 0.35 }}>
              {description}
            </Typography>
          )}
        </Box>
      </Stack>
    </Box>
  );
}

export default function AddPropertyPage() {
  const { user, notify } = useAppState();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const editId = searchParams.get("edit");
  const isEditMode = Boolean(editId);

  const [files, setFiles] = useState([]);
  const [submitting, setSubmitting] = useState(false);
  const [apiError, setApiError] = useState("");
  const [imageError, setImageError] = useState("");
  const [loadingEdit, setLoadingEdit] = useState(isEditMode);

  useEffect(() => {
    return () => revokePreviewUrls(files.map((f) => f.preview));
  }, [files]);

  const { control, handleSubmit, watch, reset } = useForm({
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
      rentLease: "Sale",
      contactNumber: user?.phone || user?.mobile || "",
    },
  });

  const loadForEdit = useCallback(async () => {
    if (!editId) return;
    setLoadingEdit(true);
    try {
      const res = await propertyService.getOne(editId);
      const p = res?.data ?? res;
      if (p) {
        reset({
          title: p.title || "",
          propertyType: p.property_type || PROPERTY_TYPES[0].value,
          location: p.location || "",
          apartmentName: p.apartment_name || "",
          floor: String(p.floor || ""),
          rooms: p.rooms !== null && p.rooms !== undefined ? String(p.rooms) : "",
          bedrooms: p.bedrooms !== null && p.bedrooms !== undefined ? String(p.bedrooms) : "",
          area: p.area !== null && p.area !== undefined ? String(p.area) : "",
          landArea: p.land_area !== null && p.land_area !== undefined ? String(p.land_area) : "",
          cropsGrown: p.crops_grown || "",
          expectedPrice: p.price !== null && p.price !== undefined ? String(p.price) : "",
          rentLease: p.rent_lease || "Sale",
          contactNumber: p.contact || user?.phone || "",
        });

        if (Array.isArray(p.images) && p.images.length > 0) {
          const existingImgItems = p.images
            .filter((img) => img && typeof img === "string")
            .map((img) => ({ file: null, preview: img, existing: true }));
          setFiles(existingImgItems);
        }
      }
    } catch (err) {
      setApiError("Failed to load property for editing: " + (err?.message || ""));
    } finally {
      setLoadingEdit(false);
    }
  }, [editId, reset, user?.phone]);

  useEffect(() => {
    if (isEditMode) loadForEdit();
  }, [isEditMode, loadForEdit]);

  const propType = watch("propertyType");
  const isResidential = ["Flat", "Residential", "Apartment", "Villa"].includes(propType);
  const isAgri = propType === "Agricultural";

  const onSubmit = async (data) => {
    setImageError("");
    setApiError("");

    const MAX_SIZE_BYTES = 40 * 1024 * 1024;
    const newFiles = files.filter((f) => f.file !== null && !f.existing);
    const rawNewFiles = newFiles
      .map((f) => (typeof f === "object" && f.file instanceof File ? f.file : f))
      .filter(Boolean);

    const oversized = rawNewFiles.find((f) => f.size > MAX_SIZE_BYTES);
    if (oversized) {
      setImageError("Please upload images below 40MB size.");
      return;
    }

    setSubmitting(true);

    try {
      const existingUrls = files.filter((f) => f.existing).map((f) => f.preview);
      const base64Images = await filesToBase64(rawNewFiles);

      const priceVal = toFloatOrNull(data.expectedPrice);
      if (priceVal === null || priceVal <= 0) {
        setApiError("Expected price is required and must be greater than 0");
        setSubmitting(false);
        return;
      }

      const payload = {
        title: toStr(data.title),
        property_type: toStr(data.propertyType),
        location: toStr(data.location),
        contact: toStr(data.contactNumber),
        price: priceVal,
        apartment_name: toStr(data.apartmentName) || null,
        floor: toStr(data.floor) || null,
        rooms: toIntOrNull(data.rooms),
        bedrooms: toIntOrNull(data.bedrooms),
        crops_grown: toStr(data.cropsGrown) || null,
        rent_lease: toStr(data.rentLease) || null,
        area: toFloatOrNull(data.area),
        land_area: toFloatOrNull(data.landArea),
        images: [...existingUrls, ...base64Images],
      };

      if (isEditMode) {
        await propertyService.update(editId, payload);
        notify("Property updated successfully! ✏️", "success");
      } else {
        await propertyService.add(payload);
        notify("Property listing submitted for approval!", "success");
      }

      if (user?.role === "admin") {
        navigate("/admin/listings");
      } else if (user?.role === "seller") {
        navigate("/seller/listings");
      } else {
        navigate("/dashboard/my-listings");
      }
    } catch (err) {
      setApiError(extractError(err));
    } finally {
      setSubmitting(false);
    }
  };

  if (loadingEdit) {
    return (
      <Box sx={{ display: "flex", alignItems: "center", justifyContent: "center", minHeight: 350 }}>
        <CircularProgress sx={{ color: UI.primary }} />
      </Box>
    );
  }

  return (
    <Box sx={{ background: UI.bg, minHeight: "100vh", pb: 6 }}>
      <Stack spacing={3}>
        {/* ── Page Header ── */}
        <Stack direction="row" alignItems="center" justifyContent="space-between">
          <Box>
            <Typography
              sx={{
                fontWeight: 900,
                fontSize: { xs: "1.45rem", sm: "1.85rem" },
                color: UI.text,
                letterSpacing: "-0.03em",
              }}
            >
              {isEditMode ? "✏️ Edit Property" : "Add Property Listing"}
            </Typography>
            <Typography sx={{ fontSize: "0.86rem", color: UI.muted, mt: 0.35 }}>
              {isEditMode
                ? "Update your property details, pricing, and photos"
                : "List your property, apartment, plot, or farm land for sale or rent"}
            </Typography>
          </Box>

          <Button
            variant="outlined"
            onClick={() => navigate(-1)}
            startIcon={<ArrowBackRoundedIcon />}
            sx={{
              borderRadius: "14px",
              textTransform: "none",
              fontWeight: 700,
              color: UI.muted,
              borderColor: UI.border,
              "&:hover": { background: "#F1F5F9" },
            }}
          >
            Back
          </Button>
        </Stack>

        {apiError && (
          <Alert
            severity="error"
            onClose={() => setApiError("")}
            sx={{ borderRadius: "16px", fontSize: "0.88rem" }}
          >
            {apiError}
          </Alert>
        )}

        {imageError && (
          <Alert
            severity="warning"
            onClose={() => setImageError("")}
            sx={{ borderRadius: "16px", fontSize: "0.88rem" }}
          >
            {imageError}
          </Alert>
        )}

        <form onSubmit={handleSubmit(onSubmit)} noValidate>
          <Stack spacing={3}>
            {/* ── 1. Basic Information ── */}
            <Card sx={cardSx}>
              <CardContent sx={{ p: { xs: 2.5, sm: 3.5 } }}>
                <SectionHeader
                  icon={<HomeWorkRoundedIcon sx={{ fontSize: 20 }} />}
                  title="Basic Information"
                  description="Property title, category type, locality, and seller contact"
                />
                <Divider sx={{ mb: 3, borderColor: UI.border }} />

                <Grid container spacing={2.5}>
                  <Grid size={{ xs: 12 }}>
                    <FormInput
                      name="title"
                      label="Listing Title *"
                      placeholder="e.g. Luxurious 3 BHK Apartment in Indiranagar"
                      control={control}
                      rules={{
                        required: "Property title is required",
                        minLength: { value: 5, message: "Title should be at least 5 characters" },
                      }}
                    />
                  </Grid>

                  <Grid size={{ xs: 12, sm: 6 }}>
                    <SelectInput
                      name="propertyType"
                      label="Property Type *"
                      control={control}
                      options={PROPERTY_TYPES}
                      rules={{ required: "Property type is required" }}
                    />
                  </Grid>

                  <Grid size={{ xs: 12, sm: 6 }}>
                    <FormInput
                      name="location"
                      label="Location / Area / City *"
                      placeholder="e.g. Whitefield, Bengaluru"
                      control={control}
                      rules={{ required: "Location is required" }}
                    />
                  </Grid>

                  <Grid size={{ xs: 12, sm: 6 }}>
                    <FormInput
                      name="apartmentName"
                      label="Apartment / Society / Project Name"
                      placeholder="e.g. Prestige Shantiniketan"
                      control={control}
                    />
                  </Grid>

                  <Grid size={{ xs: 12, sm: 6 }}>
                    <FormInput
                      name="contactNumber"
                      label="Contact Number *"
                      placeholder="+91 9876543210"
                      control={control}
                      rules={{
                        required: "Contact number is required",
                        pattern: {
                          value: /^[0-9+ -]{8,15}$/,
                          message: "Enter a valid contact number",
                        },
                      }}
                    />
                  </Grid>
                </Grid>
              </CardContent>
            </Card>

            {/* ── 2. Specifications & Dimensions ── */}
            <Card sx={cardSx}>
              <CardContent sx={{ p: { xs: 2.5, sm: 3.5 } }}>
                <SectionHeader
                  icon={<FmdGoodRoundedIcon sx={{ fontSize: 20 }} />}
                  title="Property Details & Dimensions"
                  description="Size, area, room counts, floor, and agricultural crops"
                />
                <Divider sx={{ mb: 3, borderColor: UI.border }} />

                <Grid container spacing={2.5}>
                  <Grid size={{ xs: 12, sm: 6 }}>
                    <FormInput
                      name="area"
                      label="Built-up Area (sq. ft.)"
                      placeholder="e.g. 1450"
                      type="number"
                      control={control}
                      rules={{
                        validate: (v) => {
                          if (!v) return true;
                          const n = parseFloat(v);
                          return (!isNaN(n) && n > 0) || "Built-up area must be greater than 0";
                        },
                      }}
                    />
                  </Grid>

                  <Grid size={{ xs: 12, sm: 6 }}>
                    <FormInput
                      name="landArea"
                      label="Land / Plot Area (acres / cents / sq. ft.)"
                      placeholder="e.g. 2.5"
                      type="number"
                      control={control}
                      rules={{
                        validate: (v) => {
                          if (!v) return true;
                          const n = parseFloat(v);
                          return (!isNaN(n) && n > 0) || "Land area must be greater than 0";
                        },
                      }}
                    />
                  </Grid>

                  {isResidential && (
                    <>
                      <Grid size={{ xs: 12, sm: 4 }}>
                        <FormInput
                          name="bedrooms"
                          label="Bedrooms (BHK)"
                          placeholder="e.g. 3"
                          type="number"
                          control={control}
                          rules={{
                            validate: (v) => {
                              if (!v) return true;
                              const n = parseInt(v, 10);
                              return (!isNaN(n) && n >= 0) || "Bedrooms must be a whole number (e.g. 2, 3)";
                            },
                          }}
                        />
                      </Grid>

                      <Grid size={{ xs: 12, sm: 4 }}>
                        <FormInput
                          name="rooms"
                          label="Total Rooms"
                          placeholder="e.g. 5"
                          type="number"
                          control={control}
                          rules={{
                            validate: (v) => {
                              if (!v) return true;
                              const n = parseInt(v, 10);
                              return (!isNaN(n) && n >= 0) || "Rooms must be a whole number";
                            },
                          }}
                        />
                      </Grid>

                      <Grid size={{ xs: 12, sm: 4 }}>
                        <FormInput
                          name="floor"
                          label="Floor Number"
                          placeholder="e.g. 4th Floor of 12"
                          control={control}
                        />
                      </Grid>
                    </>
                  )}

                  {isAgri && (
                    <Grid size={{ xs: 12 }}>
                      <FormInput
                        name="cropsGrown"
                        label="Crops Grown / Soil Details"
                        placeholder="e.g. Areca nut, Coconut, Red soil, Borewell with pump"
                        control={control}
                      />
                    </Grid>
                  )}
                </Grid>
              </CardContent>
            </Card>

            {/* ── 3. Pricing & Listing Intent ── */}
            <Card sx={cardSx}>
              <CardContent sx={{ p: { xs: 2.5, sm: 3.5 } }}>
                <SectionHeader
                  icon={<CurrencyRupeeRoundedIcon sx={{ fontSize: 20 }} />}
                  title="Pricing & Terms"
                  description="Expected sale price or rental terms"
                />
                <Divider sx={{ mb: 3, borderColor: UI.border }} />

                <Grid container spacing={2.5}>
                  <Grid size={{ xs: 12, sm: 6 }}>
                    <FormInput
                      name="expectedPrice"
                      label="Expected Price (₹) *"
                      placeholder="e.g. 7500000"
                      type="number"
                      control={control}
                      rules={{
                        required: "Expected price is required",
                        validate: (v) => {
                          const n = parseFloat(v);
                          return (!isNaN(n) && n > 0) || "Price must be a valid amount greater than 0";
                        },
                      }}
                    />
                  </Grid>

                  <Grid size={{ xs: 12, sm: 6 }}>
                    <SelectInput
                      name="rentLease"
                      label="Listing Purpose *"
                      control={control}
                      options={RENT_LEASE_OPTIONS}
                    />
                  </Grid>
                </Grid>
              </CardContent>
            </Card>

            {/* ── 4. Property Photos (Optional) ── */}
            <Card sx={cardSx}>
              <CardContent sx={{ p: { xs: 2.5, sm: 3.5 } }}>
                <SectionHeader
                  icon={<AddPhotoAlternateRoundedIcon sx={{ fontSize: 20 }} />}
                  title="Property Photos (Optional)"
                  description="Upload clear photos of the property, surroundings, and amenities (up to 40MB per image, supports iPhone & DSLR formats)"
                />
                <Divider sx={{ mb: 3, borderColor: UI.border }} />

                <ImageUploader
                  value={files}
                  onChange={(newFiles) => {
                    setImageError("");
                    setFiles(newFiles);
                  }}
                  label="Upload Property Photos"
                />
              </CardContent>
            </Card>

            {/* ── 5. Submit Button Bar ── */}
            <Card
              sx={{
                ...cardSx,
                p: { xs: 2, sm: 2.5 },
                background: "linear-gradient(135deg, #FFFFFF 0%, #F8FAFC 100%)",
              }}
            >
              <Stack
                direction={{ xs: "column", sm: "row" }}
                spacing={2}
                justifyContent="space-between"
                alignItems={{ xs: "stretch", sm: "center" }}
              >
                <Typography sx={{ fontSize: "0.86rem", color: UI.muted }}>
                  {isEditMode
                    ? "Review and save your property updates."
                    : "Your property will be verified and published to prospective buyers."}
                </Typography>

                <Stack direction="row" spacing={1.5}>
                  <Button
                    type="button"
                    variant="outlined"
                    onClick={() => navigate(-1)}
                    sx={{
                      minHeight: 46,
                      px: 3,
                      borderRadius: "14px",
                      textTransform: "none",
                      fontWeight: 700,
                      color: UI.muted,
                      borderColor: UI.border,
                    }}
                  >
                    Cancel
                  </Button>

                  <Button
                    type="submit"
                    variant="contained"
                    disabled={submitting}
                    startIcon={
                      submitting ? <CircularProgress size={18} color="inherit" /> : <SaveRoundedIcon />
                    }
                    sx={{
                      minHeight: 46,
                      px: 3.8,
                      borderRadius: "14px",
                      textTransform: "none",
                      fontWeight: 900,
                      fontSize: "0.92rem",
                      color: "#fff",
                      background: "linear-gradient(135deg, #0F766E 0%, #0D9488 100%)",
                      boxShadow: "0 8px 20px rgba(15,118,110,0.3)",
                      "&:hover": {
                        background: "linear-gradient(135deg, #0D9488 0%, #0F766E 100%)",
                      },
                    }}
                  >
                    {submitting ? "Saving Property…" : isEditMode ? "Update Property" : "Publish Property"}
                  </Button>
                </Stack>
              </Stack>
            </Card>
          </Stack>
        </form>
      </Stack>
    </Box>
  );
}
