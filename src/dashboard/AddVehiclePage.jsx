// src/dashboard/AddVehiclePage.jsx
import { useCallback, useEffect, useRef, useState } from "react";
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
import DirectionsCarRoundedIcon from "@mui/icons-material/DirectionsCarRounded";
import SaveRoundedIcon from "@mui/icons-material/SaveRounded";
import ArrowBackRoundedIcon from "@mui/icons-material/ArrowBackRounded";
import SpeedRoundedIcon from "@mui/icons-material/SpeedRounded";
import CurrencyRupeeRoundedIcon from "@mui/icons-material/CurrencyRupeeRounded";
import AddPhotoAlternateRoundedIcon from "@mui/icons-material/AddPhotoAlternateRounded";
import FormInput from "../components/FormInput";
import SelectInput from "../components/SelectInput";
import ImageUploader from "../components/ImageUploader";
import { useAppState } from "../hooks/useAppState";
import { vehicleService } from "../services/api";
import { extractError } from "../utils/mappers";
import { filesToBase64, revokePreviewUrls } from "../utils/imageUtils";

const UI = {
  bg: "#F8FAFC",
  surface: "#FFFFFF",
  border: "rgba(226, 232, 240, 0.9)",
  text: "#0F172A",
  muted: "#64748B",
  primary: "#7C3AED",
  primarySoft: "rgba(124, 58, 237, 0.08)",
  shadowSm: "0 4px 20px rgba(15, 23, 42, 0.04)",
  shadowMd: "0 10px 30px rgba(15, 23, 42, 0.07)",
};

const cardSx = {
  borderRadius: "24px",
  border: `1px solid ${UI.border}`,
  background: UI.surface,
  boxShadow: UI.shadowSm,
};

const VEHICLE_CATEGORIES = [
  { label: "Car / SUV / Sedan / Hatchback", value: "Car" },
  { label: "Bike / Motorcycle", value: "Bike" },
  { label: "Scooter / Scooty", value: "Scooter" },
  { label: "Commercial / Pickup / Truck", value: "Commercial" },
  { label: "Tractor / Farm Equipment", value: "Tractor" },
  { label: "Electric Vehicle (EV)", value: "Electric Vehicle" },
  { label: "Auto Rickshaw / 3-Wheeler", value: "Auto Rickshaw" },
  { label: "Other Vehicle", value: "Other" },
];

const POPULAR_BRANDS = [
  { label: "Maruti Suzuki", value: "Maruti Suzuki" },
  { label: "Hyundai", value: "Hyundai" },
  { label: "Tata Motors", value: "Tata" },
  { label: "Mahindra", value: "Mahindra" },
  { label: "Toyota", value: "Toyota" },
  { label: "Honda", value: "Honda" },
  { label: "Kia", value: "Kia" },
  { label: "Volkswagen", value: "Volkswagen" },
  { label: "Skoda", value: "Skoda" },
  { label: "MG", value: "MG" },
  { label: "Renault", value: "Renault" },
  { label: "Nissan", value: "Nissan" },
  { label: "Royal Enfield", value: "Royal Enfield" },
  { label: "Hero MotoCorp", value: "Hero" },
  { label: "Bajaj", value: "Bajaj" },
  { label: "TVS", value: "TVS" },
  { label: "Yamaha", value: "Yamaha" },
  { label: "Suzuki (2 Wheeler)", value: "Suzuki" },
  { label: "KTM", value: "KTM" },
  { label: "Jawa / Yezdi", value: "Jawa" },
  { label: "Ather Energy", value: "Ather" },
  { label: "Ola Electric", value: "Ola" },
  { label: "Other / Custom Brand", value: "Other" },
];

const FUEL_TYPES = [
  { label: "Petrol", value: "Petrol" },
  { label: "Diesel", value: "Diesel" },
  { label: "Electric (EV)", value: "Electric" },
  { label: "CNG", value: "CNG" },
  { label: "Hybrid", value: "Hybrid" },
  { label: "LPG", value: "LPG" },
];

const STATES = [
  { label: "Karnataka", value: "Karnataka" },
  { label: "Tamil Nadu", value: "Tamil Nadu" },
  { label: "Maharashtra", value: "Maharashtra" },
  { label: "Kerala", value: "Kerala" },
  { label: "Andhra Pradesh", value: "Andhra Pradesh" },
  { label: "Telangana", value: "Telangana" },
  { label: "Goa", value: "Goa" },
  { label: "Delhi NCR", value: "Delhi" },
  { label: "Other State", value: "Other" },
];

const currentYear = new Date().getFullYear();
const YEAR_OPTIONS = Array.from({ length: currentYear - 1999 }, (_, i) => {
  const y = String(currentYear - i);
  return { label: y, value: y };
}).concat([{ label: "Before 2000", value: "1999" }]);

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

export default function AddVehiclePage() {
  const { user, notify, addVehicle } = useAppState();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const editId = searchParams.get("edit");
  const isEditMode = Boolean(editId);

  const [files, setFiles] = useState([]);
  const [submitting, setSubmitting] = useState(false);
  const [apiError, setApiError] = useState("");
  const [imageError, setImageError] = useState("");
  const [loadingEdit, setLoadingEdit] = useState(isEditMode);

  const filesRef = useRef(files);
  useEffect(() => {
    filesRef.current = files;
  }, [files]);

  useEffect(() => {
    return () => revokePreviewUrls(filesRef.current.map((f) => f.preview));
  }, []);

  const { control, handleSubmit, reset } = useForm({
    mode: "onTouched",
    defaultValues: {
      title: "",
      category: "Car",
      vehicleNumber: "",
      brand: "Maruti Suzuki",
      model: "",
      year: String(currentYear),
      fuelType: "Petrol",
      state: "Karnataka",
      rtoCode: "",
      kmDriven: "",
      location: "",
      expectedPrice: "",
      contactNumber: user?.phone || user?.mobile || "",
    },
  });

  const loadForEdit = useCallback(async () => {
    if (!editId) return;
    setLoadingEdit(true);
    try {
      const res = await vehicleService.getOne(editId);
      const v = res?.data ?? res;
      if (v) {
        reset({
          title: v.title || "",
          category: v.category || "Car",
          vehicleNumber: v.vehicle_number || "",
          brand: v.brand || "Maruti Suzuki",
          model: v.model || "",
          year: String(v.year || currentYear),
          fuelType: v.fuel_type || "Petrol",
          state: v.state || "Karnataka",
          rtoCode: v.rto_code || "",
          kmDriven: v.km_driven !== null && v.km_driven !== undefined ? String(v.km_driven) : "",
          location: v.location || "",
          expectedPrice: v.price !== null && v.price !== undefined ? String(v.price) : "",
          contactNumber: v.contact || user?.phone || "",
        });

        if (Array.isArray(v.images) && v.images.length > 0) {
          const existingImgItems = v.images
            .filter((img) => img && typeof img === "string")
            .map((img) => ({ file: null, preview: img, existing: true }));
          setFiles(existingImgItems);
        }
      }
    } catch (err) {
      setApiError("Failed to load vehicle for editing: " + (err?.message || ""));
    } finally {
      setLoadingEdit(false);
    }
  }, [editId, reset, user?.phone]);

  useEffect(() => {
    if (isEditMode) loadForEdit();
  }, [isEditMode, loadForEdit]);

  const onSubmit = async (data) => {
    setImageError("");
    setApiError("");

    const MAX_SIZE_BYTES = 40 * 1024 * 1024;
    const newFiles = files.filter((f) => f.file !== null && !f.existing);
    const rawFiles = newFiles
      .map((f) => (typeof f === "object" && f.file instanceof File ? f.file : f))
      .filter(Boolean);

    const oversized = rawFiles.find((f) => f.size > MAX_SIZE_BYTES);
    if (oversized) {
      setImageError("Please upload images below 40MB size.");
      return;
    }

    setSubmitting(true);

    try {
      const existingUrls = files.filter((f) => f.existing).map((f) => f.preview);
      const base64Images = await filesToBase64(rawFiles);
      const allImages = [...existingUrls, ...base64Images];

      const priceVal = parseFloat(String(data.expectedPrice ?? "").trim());
      if (isNaN(priceVal) || priceVal <= 0) {
        setApiError("Asking price is required and must be greater than 0");
        setSubmitting(false);
        return;
      }

      const payload = {
        title: String(data.title ?? "").trim(),
        brand: String(data.brand ?? "").trim(),
        model: String(data.model ?? "").trim(),
        year: String(data.year ?? "").trim(),
        price: priceVal,
        contact: String(data.contactNumber ?? "").trim(),
        location: String(data.location ?? "").trim(),
        vehicle_number: String(data.vehicleNumber ?? "").trim(),
        rto_code: String(data.rtoCode ?? "").trim(),
        km_driven: String(data.kmDriven ?? "0").trim(),
        state: String(data.state ?? "").trim(),
        images: allImages,
      };


      if (isEditMode) {
        await vehicleService.update(editId, payload);
        notify("Vehicle updated successfully! ✏️", "success");
      } else {
        await vehicleService.add({
          title: data.title,
          brand: data.brand,
          model: data.model,
          year: data.year,
          expectedPrice: data.expectedPrice,
          contactNumber: data.contactNumber,
          location: data.location,
          vehicleNumber: data.vehicleNumber,
          rtoCode: data.rtoCode,
          kmDriven: data.kmDriven,
          state: data.state,
          images: allImages,
        });
        notify("Vehicle listing submitted for approval!", "success");
      }

      if (user?.role === "admin") navigate("/admin/listings");
      else if (user?.role === "seller") navigate("/seller/listings");
      else navigate("/dashboard/my-listings");
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
              {isEditMode ? "✏️ Edit Vehicle" : "Add Vehicle Listing"}
            </Typography>
            <Typography sx={{ fontSize: "0.86rem", color: UI.muted, mt: 0.35 }}>
              {isEditMode
                ? "Update your vehicle details, specifications, and images"
                : "List your car, bike, scooter, or commercial vehicle for sale"}
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
            {/* ── 1. Vehicle Identity ── */}
            <Card sx={cardSx}>
              <CardContent sx={{ p: { xs: 2.5, sm: 3.5 } }}>
                <SectionHeader
                  icon={<DirectionsCarRoundedIcon sx={{ fontSize: 20 }} />}
                  title="Vehicle Identity & Category"
                  description="Vehicle title, category, make, model, and registration details"
                />
                <Divider sx={{ mb: 3, borderColor: UI.border }} />

                <Grid container spacing={2.5}>
                  <Grid size={{ xs: 12 }}>
                    <FormInput
                      name="title"
                      label="Listing Title *"
                      placeholder="e.g. 2021 Hyundai i20 Asta (O) Petrol 1st Owner"
                      control={control}
                      rules={{
                        required: "Vehicle title is required",
                        minLength: { value: 5, message: "Title should be at least 5 characters" },
                      }}
                    />
                  </Grid>

                  <Grid size={{ xs: 12, sm: 6 }}>
                    <SelectInput
                      name="category"
                      label="Vehicle Type / Category *"
                      control={control}
                      options={VEHICLE_CATEGORIES}
                    />
                  </Grid>

                  <Grid size={{ xs: 12, sm: 6 }}>
                    <SelectInput
                      name="brand"
                      label="Vehicle Brand / Manufacturer *"
                      control={control}
                      options={POPULAR_BRANDS}
                    />
                  </Grid>

                  <Grid size={{ xs: 12, sm: 6 }}>
                    <FormInput
                      name="model"
                      label="Model / Variant *"
                      placeholder="e.g. Swift VXI, Creta SX, Classic 350"
                      control={control}
                      rules={{ required: "Model name is required" }}
                    />
                  </Grid>

                  <Grid size={{ xs: 12, sm: 6 }}>
                    <SelectInput
                      name="year"
                      label="Year of Manufacture *"
                      control={control}
                      options={YEAR_OPTIONS}
                    />
                  </Grid>

                  <Grid size={{ xs: 12, sm: 6 }}>
                    <SelectInput
                      name="fuelType"
                      label="Fuel Type"
                      control={control}
                      options={FUEL_TYPES}
                    />
                  </Grid>

                  <Grid size={{ xs: 12, sm: 6 }}>
                    <FormInput
                      name="vehicleNumber"
                      label="Registration Number (Optional)"
                      placeholder="e.g. KA 01 AB 1234"
                      control={control}
                    />
                  </Grid>
                </Grid>
              </CardContent>
            </Card>

            {/* ── 2. Usage & Location ── */}
            <Card sx={cardSx}>
              <CardContent sx={{ p: { xs: 2.5, sm: 3.5 } }}>
                <SectionHeader
                  icon={<SpeedRoundedIcon sx={{ fontSize: 20 }} />}
                  title="Usage & Registration Location"
                  description="Odometer reading, RTO passing, and current location"
                />
                <Divider sx={{ mb: 3, borderColor: UI.border }} />

                <Grid container spacing={2.5}>
                  <Grid size={{ xs: 12, sm: 4 }}>
                    <FormInput
                      name="kmDriven"
                      label="KM Driven (Odometer)"
                      placeholder="e.g. 45000"
                      type="number"
                      control={control}
                      rules={{
                        validate: (v) => {
                          if (!v) return true;
                          const n = parseFloat(v);
                          return (!isNaN(n) && n >= 0) || "KM Driven must be a non-negative number";
                        },
                      }}
                    />
                  </Grid>

                  <Grid size={{ xs: 12, sm: 4 }}>
                    <SelectInput
                      name="state"
                      label="Registered State"
                      control={control}
                      options={STATES}
                    />
                  </Grid>

                  <Grid size={{ xs: 12, sm: 4 }}>
                    <FormInput
                      name="rtoCode"
                      label="RTO Code"
                      placeholder="e.g. KA03 / MH02"
                      control={control}
                    />
                  </Grid>

                  <Grid size={{ xs: 12 }}>
                    <FormInput
                      name="location"
                      label="Current Location / City / Area *"
                      placeholder="e.g. Indiranagar, Bengaluru"
                      control={control}
                      rules={{ required: "Location is required" }}
                    />
                  </Grid>
                </Grid>
              </CardContent>
            </Card>

            {/* ── 3. Pricing & Seller Contact ── */}
            <Card sx={cardSx}>
              <CardContent sx={{ p: { xs: 2.5, sm: 3.5 } }}>
                <SectionHeader
                  icon={<CurrencyRupeeRoundedIcon sx={{ fontSize: 20 }} />}
                  title="Price & Contact Details"
                  description="Set your expected price and verified contact phone number"
                />
                <Divider sx={{ mb: 3, borderColor: UI.border }} />

                <Grid container spacing={2.5}>
                  <Grid size={{ xs: 12, sm: 6 }}>
                    <FormInput
                      name="expectedPrice"
                      label="Asking Price (₹) *"
                      placeholder="e.g. 450000"
                      type="number"
                      control={control}
                      rules={{
                        required: "Asking price is required",
                        validate: (v) => {
                          const n = parseFloat(v);
                          return (!isNaN(n) && n > 0) || "Price must be a valid amount greater than 0";
                        },
                      }}
                    />
                  </Grid>

                  <Grid size={{ xs: 12, sm: 6 }}>
                    <FormInput
                      name="contactNumber"
                      label="Seller Contact Number *"
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

            {/* ── 4. Vehicle Photos (Optional) ── */}
            <Card sx={cardSx}>
              <CardContent sx={{ p: { xs: 2.5, sm: 3.5 } }}>
                <SectionHeader
                  icon={<AddPhotoAlternateRoundedIcon sx={{ fontSize: 20 }} />}
                  title="Vehicle Photos (Optional)"
                  description="Upload exterior, interior, and odometer pictures (up to 40MB per image, supports iPhone & DSLR formats)"
                />
                <Divider sx={{ mb: 3, borderColor: UI.border }} />

                <ImageUploader
                  value={files}
                  onChange={(newFiles) => {
                    setImageError("");
                    setFiles(newFiles);
                  }}
                  label="Upload Vehicle Photos"
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
                    ? "Review and save your vehicle listing updates."
                    : "Your vehicle listing will be reviewed and published to active buyers."}
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
                      background: "linear-gradient(135deg, #7C3AED 0%, #6D28D9 100%)",
                      boxShadow: "0 8px 20px rgba(124, 58, 237, 0.3)",
                      "&:hover": {
                        background: "linear-gradient(135deg, #6D28D9 0%, #5B21B6 100%)",
                      },
                    }}
                  >
                    {submitting ? "Saving Vehicle…" : isEditMode ? "Update Vehicle" : "Publish Vehicle"}
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