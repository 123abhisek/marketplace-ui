import { useCallback, useEffect, useRef, useState } from "react";
import { useForm } from "react-hook-form";
import { useNavigate, useSearchParams } from "react-router-dom";
import {
  Alert,
  Box,
  Button,
  Card,
  CardContent,
  Chip,
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
import { FormSkeleton } from "../components/skeletons/AppSkeletons";
import FormInput from "../components/FormInput";
import SelectInput from "../components/SelectInput";
import ImageUploader from "../components/ImageUploader";
import LgdLocationSelector from "../components/LgdLocationSelector";
import DynamicPropertyFields from "../components/DynamicPropertyFields";
import {
  PROPERTY_TYPES as CANONICAL_PROPERTY_TYPES,
  getDefaultDetails,
  normalizePropertyType,
} from "../config/propertyFields";
import { useAppState } from "../hooks/useAppState";
import { propertyService } from "../services/api";
import { isUserPremium } from "../utils/permissions";
import { extractError } from "../utils/mappers";
import { filesToBase64, revokePreviewUrls } from "../utils/imageUtils";
import {
  LAND_AREA_UNITS,
  BUILTUP_AREA_UNITS,
  parseAreaAndUnit,
  getLandConversionsPreview,
} from "../utils/landUnits";

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

const PROPERTY_TYPES = CANONICAL_PROPERTY_TYPES.map((t) => ({ label: t, value: t }));

const RENT_LEASE_OPTIONS = [
  { label: "For Sale", value: "Sale" },
  { label: "For Rent", value: "Rent" },
  { label: "For Lease", value: "Lease" },
];

const FURNISHING_OPTIONS = [
  { label: "Fully Furnished", value: "Fully Furnished" },
  { label: "Semi-Furnished", value: "Semi-Furnished" },
  { label: "Unfurnished", value: "Unfurnished" },
];

const FACING_OPTIONS = [
  { label: "East", value: "East" },
  { label: "North", value: "North" },
  { label: "North-East", value: "North-East" },
  { label: "West", value: "West" },
  { label: "South", value: "South" },
  { label: "North-West", value: "North-West" },
  { label: "South-East", value: "South-East" },
  { label: "South-West", value: "South-West" },
];

const PARKING_OPTIONS = [
  { label: "Covered Car Parking", value: "Covered" },
  { label: "Open Parking", value: "Open" },
  { label: "Bike & Car Parking", value: "Bike & Car" },
  { label: "Bike Only", value: "Bike Only" },
  { label: "None", value: "None" },
];

const WATER_SUPPLY_OPTIONS = [
  { label: "24/7 Corporation & Borewell", value: "24/7 Corporation & Borewell" },
  { label: "Corporation Water", value: "Corporation Water" },
  { label: "Borewell Water", value: "Borewell Water" },
  { label: "Water Tanker / Other", value: "Water Tanker / Other" },
];

const PROPERTY_AGE_OPTIONS = [
  { label: "Under Construction / New", value: "Under Construction" },
  { label: "0-1 Year", value: "0-1 Year" },
  { label: "1-3 Years", value: "1-3 Years" },
  { label: "3-5 Years", value: "3-5 Years" },
  { label: "5-10 Years", value: "5-10 Years" },
  { label: "10+ Years", value: "10+ Years" },
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

  const { control, handleSubmit, watch, reset, setValue } = useForm({
    mode: "onTouched",
    defaultValues: {
      title: "",
      propertyType: PROPERTY_TYPES[0].value,
      state: "Karnataka",
      district: "",
      city: "",
      localAddress: "",
      apartmentName: "",
      floor: "",
      rooms: "",
      bedrooms: "",
      bathrooms: "",
      furnishing: "",
      facing: "",
      parking: "",
      waterSupply: "",
      propertyAge: "",
      area: "",
      areaUnit: "Sq. Ft.",
      landArea: "",
      landAreaUnit: "Acres",
      cropsGrown: "",
      additionalDimensionsDetails: "",
      description: "",
      expectedPrice: "",
      rentLease: "Sale",
      rentAdvanceAmount: "",
      leaseDurationYears: "",
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
        const parsedArea = parseAreaAndUnit(p.area, "Sq. Ft.");
        const parsedLandArea = parseAreaAndUnit(p.land_area, "Acres");

        let editLocal = p.local_address || "";
        let editCity = p.city || "";
        let editDistrict = p.district || "";
        let editState = p.state || "Karnataka";

        if (p.location) {
          const parts = p.location.split(",").map((s) => s.trim()).filter(Boolean);
          if (parts.length >= 4) {
            editState = parts[parts.length - 1];
            editDistrict = parts[parts.length - 2];
            editCity = parts[parts.length - 3];
            if (!editLocal) editLocal = parts.slice(0, -3).join(", ");
          } else if (parts.length === 3) {
            editState = parts[2];
            editDistrict = parts[1];
            if (!editCity) editCity = parts[0];
          } else if (parts.length === 2) {
            if (!editDistrict) editDistrict = parts[0];
            editState = parts[1];
          }
        }

        reset({
          title: p.title || "",
          propertyType: p.property_type || PROPERTY_TYPES[0].value,
          state: editState,
          district: editDistrict,
          localAddress: editLocal,
          city: editCity,
          apartmentName: p.apartment_name || "",
          floor: String(p.floor || ""),
          rooms: p.rooms !== null && p.rooms !== undefined ? String(p.rooms) : "",
          bedrooms: p.bedrooms !== null && p.bedrooms !== undefined ? String(p.bedrooms) : "",
          bathrooms: p.bathrooms !== null && p.bathrooms !== undefined ? String(p.bathrooms) : "",
          furnishing: p.furnishing || "",
          facing: p.facing || "",
          parking: p.parking || "",
          waterSupply: p.water_supply || p.waterSupply || "",
          propertyAge: p.property_age || p.propertyAge || "",
          area: parsedArea.value,
          areaUnit: parsedArea.unit || "Sq. Ft.",
          landArea: parsedLandArea.value,
          landAreaUnit: parsedLandArea.unit || "Acres",
          cropsGrown: p.crops_grown || "",
          additionalDimensionsDetails: p.additional_dimensions_details || "",
          description: p.description || "",
          expectedPrice: p.price !== null && p.price !== undefined ? String(p.price) : "",
          rentLease: p.rent_lease || "Sale",
          rentAdvanceAmount: p.rent_advance_amount !== null && p.rent_advance_amount !== undefined ? String(p.rent_advance_amount) : "",
          leaseDurationYears: p.lease_duration_years !== null && p.lease_duration_years !== undefined ? String(p.lease_duration_years) : "",
          contactNumber: p.contact || user?.phone || "",
        });

        if (p.details && typeof p.details === "object" && Object.keys(p.details).length > 0) {
          const loadedDetails = { ...p.details };
          if (!loadedDetails.acres_guntas && p.land_area) {
            loadedDetails.acres_guntas = p.land_area;
          }
          setPropertyDetails(loadedDetails);
        } else {
          const defaultDet = getDefaultDetails(normalizePropertyType(p.property_type));
          if (p.land_area) {
            defaultDet.acres_guntas = p.land_area;
          }
          setPropertyDetails(defaultDet);
        }

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

  const propType = watch("propertyType") || PROPERTY_TYPES[0].value;
  const canonicalCategory = normalizePropertyType(propType);
  const [propertyDetails, setPropertyDetails] = useState(() => getDefaultDetails(canonicalCategory));
  const prevTypeRef = useRef(canonicalCategory);
  const isInitialMount = useRef(true);

  // Reset details when property type changes
  useEffect(() => {
    if (isInitialMount.current) {
      isInitialMount.current = false;
      return;
    }
    if (prevTypeRef.current && prevTypeRef.current !== canonicalCategory) {
      setPropertyDetails(getDefaultDetails(canonicalCategory));
    }
    prevTypeRef.current = canonicalCategory;
  }, [canonicalCategory]);

  const watchRentLease = watch("rentLease");
  const isRent = watchRentLease === "Rent";
  const isLease = watchRentLease === "Lease";

  const onSubmit = async (data) => {
    setImageError("");
    setApiError("");

    // Validate Loan Pending Amount if loan is Yes
    if (propertyDetails?.amenities?.loan_pending === "Yes") {
      const loanAmt = propertyDetails?.amenities?.loan_pending_amount;
      if (!loanAmt || isNaN(Number(String(loanAmt).replace(/,/g, ""))) || Number(String(loanAmt).replace(/,/g, "")) <= 0) {
        setApiError("Loan balance amount is required and must be greater than 0 when 'Loan pending' is Yes.");
        return;
      }
    }

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

      const rentAdv = isRent && data.rentAdvanceAmount ? toFloatOrNull(data.rentAdvanceAmount) : null;
      const leaseDur = isLease && data.leaseDurationYears ? toFloatOrNull(data.leaseDurationYears) : null;

      const stateVal = toStr(data.state || "Karnataka");
      const districtVal = toStr(data.district);
      const cityVal = toStr(data.city);
      const localAddr = toStr(data.localAddress);

      // Effective city: city name or fallback to district if city empty
      const effectiveCity = cityVal || districtVal;

      // Deduplicated combined location: [localAddr, cityVal, districtVal, stateVal]
      const locParts = [
        localAddr,
        cityVal,
        (districtVal && districtVal.toLowerCase() !== cityVal.toLowerCase() ? districtVal : null),
        stateVal,
      ].filter(Boolean).map((s) => s.trim()).filter(Boolean);
      const combinedLoc = Array.from(new Set(locParts)).join(", ");

      const payload = {
        title: toStr(data.title),
        property_type: toStr(data.propertyType),
        state: stateVal,
        district: districtVal,
        local_address: localAddr,
        city: effectiveCity,
        location: combinedLoc,
        contact: toStr(data.contactNumber),
        price: priceVal,
        apartment_name: toStr(data.apartmentName),
        description: toStr(data.description),
        rent_lease: toStr(data.rentLease),
        rent_advance_amount: rentAdv,
        lease_duration_years: leaseDur,
        details: propertyDetails,
        images: [...existingUrls, ...base64Images],
      };

      // Sync legacy database columns for maximum backward compatibility
      if (propertyDetails?.bhk) payload.bedrooms = parseInt(propertyDetails.bhk, 10) || 0;
      if (propertyDetails?.furnishing) payload.furnishing = propertyDetails.furnishing;
      if (propertyDetails?.floor || propertyDetails?.floor_number) payload.floor = String(propertyDetails.floor || propertyDetails.floor_number);
      if (propertyDetails?.facing) payload.facing = propertyDetails.facing;
      if (propertyDetails?.dimensions) payload.additional_dimensions_details = propertyDetails.dimensions;
      if (propertyDetails?.plot_area) payload.area = `${propertyDetails.plot_area} Sq. Ft.`;
      if (propertyDetails?.acres_guntas) {
        payload.land_area = String(propertyDetails.acres_guntas).trim();
      }
      if (Array.isArray(propertyDetails?.suitable_crops) && propertyDetails.suitable_crops.length > 0) {
        payload.crops_grown = propertyDetails.suitable_crops.join(", ");
      }


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
    return <FormSkeleton title="Loading property details..." />;
  }

  return (
    <Box sx={{ background: UI.bg, minHeight: "100vh", pb: 6 }}>
      <Stack spacing={3}>
        {/* ── Page Header ── */}
        <Stack
          direction={{ xs: "column", sm: "row" }}
          alignItems={{ xs: "flex-start", sm: "center" }}
          justifyContent="space-between"
          spacing={2}
        >
          <Box>
            <Stack direction="row" alignItems="center" spacing={1.5} sx={{ mb: 0.5, flexWrap: "wrap", gap: 1 }}>
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
              <Chip
                label={isUserPremium(user) ? "👑 Premium Listing" : "Standard Listing"}
                size="small"
                sx={{
                  fontWeight: 800,
                  fontSize: "0.72rem",
                  background: isUserPremium(user) ? "#FEF3C7" : "#F1F5F9",
                  color: isUserPremium(user) ? "#B45309" : "#64748B",
                  border: isUserPremium(user) ? "1px solid #FDE68A" : "1px solid #E2E8F0",
                  borderRadius: "8px",
                }}
              />
            </Stack>
            <Typography sx={{ fontSize: "0.86rem", color: UI.muted }}>
              {isEditMode
                ? "Update your property details, pricing, and photos"
                : isUserPremium(user)
                  ? "⭐ Premium listing: priority verification, top search placement & instant buyer alerts."
                  : "List your property, apartment, plot, or farm land for sale or rent."}
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

                  {/* Searchable Location Selector (India LGD Official Directory API) */}
                  <Grid size={{ xs: 12 }}>
                    <LgdLocationSelector
                      control={control}
                      setValue={setValue}
                      watch={watch}
                      stateFieldName="state"
                      districtFieldName="district"
                      cityFieldName="city"
                      localAddressFieldName="localAddress"
                      UI={UI}
                      showState={true}
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

                  <Grid size={{ xs: 12 }}>
                    <FormInput
                      name="description"
                      label="Property Description"
                      placeholder="Describe the property condition, key features, facilities, amenities (e.g. Spacious 2BHK with modular kitchen, lift, security, nearby bus stop)..."
                      control={control}
                      multiline
                      rows={3}
                    />
                  </Grid>
                </Grid>
              </CardContent>
            </Card>

            {/* ── 2. Category Specifications, Amenities & Custom Fields ── */}
            <DynamicPropertyFields
              category={canonicalCategory}
              details={propertyDetails}
              onChange={setPropertyDetails}
              UI={UI}
            />

            {/* ── 3. Pricing & Listing Intent ── */}
            <Card sx={cardSx}>
              <CardContent sx={{ p: { xs: 2.5, sm: 3.5 } }}>
                <SectionHeader
                  icon={<CurrencyRupeeRoundedIcon sx={{ fontSize: 20 }} />}
                  title="Pricing & Terms"
                  description="Expected sale price, rent advance, or lease duration"
                />
                <Divider sx={{ mb: 3, borderColor: UI.border }} />

                <Grid container spacing={2.5}>
                  <Grid size={{ xs: 12, sm: 6 }}>
                    <FormInput
                      name="expectedPrice"
                      label={isRent ? "Monthly Rent (₹) *" : isLease ? "Lease Amount (₹) *" : "Expected Price (₹) *"}
                      placeholder={isRent ? "e.g. 25000" : "e.g. 7500000"}
                      type="number"
                      control={control}
                      rules={{
                        required: "Price is required",
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

                  {/* Conditional: Rent Advance Amount */}
                  {isRent && (
                    <Grid size={{ xs: 12, sm: 6 }}>
                      <FormInput
                        name="rentAdvanceAmount"
                        label="Rent Advance Amount (₹)"
                        placeholder="e.g. 50000"
                        type="number"
                        control={control}
                        rules={{
                          validate: (v) => {
                            if (!v) return true;
                            const n = parseFloat(v);
                            return (!isNaN(n) && n >= 0) || "Advance amount cannot be negative";
                          },
                        }}
                      />
                    </Grid>
                  )}

                  {/* Conditional: Lease Duration */}
                  {isLease && (
                    <Grid size={{ xs: 12, sm: 6 }}>
                      <FormInput
                        name="leaseDurationYears"
                        label="Lease Duration (Years)"
                        placeholder="e.g. 3 or 5"
                        type="number"
                        control={control}
                        rules={{
                          validate: (v) => {
                            if (!v) return true;
                            const n = parseFloat(v);
                            return (!isNaN(n) && n > 0) || "Lease duration must be greater than 0";
                          },
                        }}
                      />
                    </Grid>
                  )}
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

                <Stack
                  direction={{ xs: "column-reverse", sm: "row" }}
                  spacing={1.5}
                  sx={{ width: { xs: "100%", sm: "auto" } }}
                >
                  <Button
                    type="button"
                    variant="outlined"
                    fullWidth={{ xs: true, sm: false }}
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
                    fullWidth={{ xs: true, sm: false }}
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
