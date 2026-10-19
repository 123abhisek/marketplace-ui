// src/components/DynamicPropertyFields.jsx
import React, { useState } from "react";
import {
  Accordion,
  AccordionDetails,
  AccordionSummary,
  Alert,
  Box,
  Button,
  Card,
  CardContent,
  Chip,
  Divider,
  Grid,
  IconButton,
  InputAdornment,
  MenuItem,
  Select,
  Stack,
  TextField,
  Tooltip,
  Typography,
} from "@mui/material";

// Icons
import ExpandMoreRoundedIcon from "@mui/icons-material/ExpandMoreRounded";
import CheckRoundedIcon from "@mui/icons-material/CheckRounded";
import CloseRoundedIcon from "@mui/icons-material/CloseRounded";
import AddRoundedIcon from "@mui/icons-material/AddRounded";
import DeleteOutlineRoundedIcon from "@mui/icons-material/DeleteOutlineRounded";
import TuneRoundedIcon from "@mui/icons-material/TuneRounded";
import ElectricBoltRoundedIcon from "@mui/icons-material/ElectricBoltRounded";
import AddRoadRoundedIcon from "@mui/icons-material/AddRoadRounded";
import LocationCityRoundedIcon from "@mui/icons-material/LocationCityRounded";
import PoolRoundedIcon from "@mui/icons-material/PoolRounded";
import VerifiedUserRoundedIcon from "@mui/icons-material/VerifiedUserRounded";
import CurrencyRupeeRoundedIcon from "@mui/icons-material/CurrencyRupeeRounded";
import InfoOutlinedIcon from "@mui/icons-material/InfoOutlined";

import {
  CATEGORY_CONFIG,
  AMENITY_GROUPS,
  AMENITIES_DICTIONARY,
  normalizePropertyType,
} from "../config/propertyFields";

const GROUP_ICONS = {
  U: <ElectricBoltRoundedIcon sx={{ fontSize: 18, color: "#0284C7" }} />,
  A: <AddRoadRoundedIcon sx={{ fontSize: 18, color: "#0F766E" }} />,
  N: <LocationCityRoundedIcon sx={{ fontSize: 18, color: "#7C3AED" }} />,
  F: <PoolRoundedIcon sx={{ fontSize: 18, color: "#D97706" }} />,
  L: <VerifiedUserRoundedIcon sx={{ fontSize: 18, color: "#059669" }} />,
};

/**
 * Reusable Yes/No Pill Toggle Button
 */
export function YesNoToggle({ value, onChange, size = "small" }) {
  const isYes = value === "Yes";
  const isNo = value === "No";

  return (
    <Stack direction="row" spacing={0.75} alignItems="center">
      <Button
        type="button"
        size={size}
        onClick={() => onChange(isYes ? null : "Yes")}
        startIcon={<CheckRoundedIcon sx={{ fontSize: "14px !important" }} />}
        sx={{
          minWidth: 64,
          height: 32,
          borderRadius: "999px",
          textTransform: "none",
          fontWeight: 700,
          fontSize: "0.78rem",
          transition: "all 0.15s ease",
          border: isYes ? "1.5px solid #059669" : "1px solid #CBD5E1",
          background: isYes ? "#ECFDF5" : "#FFFFFF",
          color: isYes ? "#059669" : "#64748B",
          boxShadow: isYes ? "0 2px 6px rgba(5, 150, 105, 0.2)" : "none",
          "&:hover": {
            background: isYes ? "#D1FAE5" : "#F8FAFC",
            borderColor: isYes ? "#059669" : "#94A3B8",
          },
        }}
      >
        Yes
      </Button>

      <Button
        type="button"
        size={size}
        onClick={() => onChange(isNo ? null : "No")}
        startIcon={<CloseRoundedIcon sx={{ fontSize: "14px !important" }} />}
        sx={{
          minWidth: 64,
          height: 32,
          borderRadius: "999px",
          textTransform: "none",
          fontWeight: 700,
          fontSize: "0.78rem",
          transition: "all 0.15s ease",
          border: isNo ? "1.5px solid #64748B" : "1px solid #CBD5E1",
          background: isNo ? "#F1F5F9" : "#FFFFFF",
          color: isNo ? "#334155" : "#94A3B8",
          boxShadow: isNo ? "0 2px 6px rgba(100, 116, 139, 0.15)" : "none",
          "&:hover": {
            background: isNo ? "#E2E8F0" : "#F8FAFC",
            borderColor: isNo ? "#64748B" : "#94A3B8",
          },
        }}
      >
        No
      </Button>

      {value && (
        <Tooltip title="Clear selection (optional)">
          <IconButton
            size="small"
            onClick={() => onChange(null)}
            sx={{ p: 0.5, color: "#94A3B8", "&:hover": { color: "#EF4444" } }}
          >
            <CloseRoundedIcon sx={{ fontSize: 13 }} />
          </IconButton>
        </Tooltip>
      )}
    </Stack>
  );
}

/**
 * Parses and computes regional land area equivalents for Acres and Guntas
 */
function getAcresGuntasHint(str) {
  if (!str) return null;
  const s = String(str).toLowerCase().trim();
  const acreMatch = s.match(/([\d.]+)\s*(?:ac|acre|acres)\b/);
  const guntaMatch = s.match(/([\d.]+)\s*(?:gun|gunta|guntas)\b/);

  let totalAcres = 0;
  let hasMatch = false;

  if (acreMatch) {
    totalAcres += parseFloat(acreMatch[1]) || 0;
    hasMatch = true;
  }
  if (guntaMatch) {
    totalAcres += (parseFloat(guntaMatch[1]) || 0) / 40;
    hasMatch = true;
  }

  if (!hasMatch) {
    const rawNum = parseFloat(s);
    if (!isNaN(rawNum) && rawNum > 0) {
      totalAcres = rawNum;
      hasMatch = true;
    }
  }

  if (hasMatch && totalAcres > 0) {
    const totalGuntas = totalAcres * 40;
    const sqft = totalAcres * 43560;
    return `≈ ${Number(totalAcres.toFixed(2))} Acres (${Number(totalGuntas.toFixed(1))} Guntas) • ${Math.round(sqft).toLocaleString("en-IN")} sq. ft.`;
  }
  return null;
}

export default function DynamicPropertyFields({
  category,
  details = {},
  onChange,
  UI = {
    surface: "#FFFFFF",
    border: "rgba(226, 232, 240, 0.9)",
    text: "#0F172A",
    muted: "#64748B",
    primary: "#0F766E",
    primarySoft: "rgba(15, 118, 110, 0.08)",
  },
}) {
  const [customInput, setCustomInput] = useState("");
  const [customError, setCustomError] = useState("");

  const canonicalCat = normalizePropertyType(category);
  const catConfig = CATEGORY_CONFIG[canonicalCat] || CATEGORY_CONFIG["Residential"];

  const specificValues = details || {};
  const amenities = details?.amenities || {};
  const customFields = details?.custom_fields || [];

  // Helper to update specific field
  const handleSpecificChange = (fieldName, value) => {
    onChange({
      ...details,
      [fieldName]: value,
    });
  };

  // Helper to toggle multiselect choice
  const handleMultiselectToggle = (fieldName, option) => {
    const currentList = Array.isArray(details[fieldName]) ? details[fieldName] : [];
    let updated;
    if (currentList.includes(option)) {
      updated = currentList.filter((item) => item !== option);
    } else {
      updated = [...currentList, option];
    }
    handleSpecificChange(fieldName, updated);
  };

  // Helper to update amenity
  const handleAmenityChange = (amenityKey, value) => {
    const newAmenities = { ...amenities, [amenityKey]: value };
    if (value !== "Yes" && amenityKey === "loan_pending") {
      delete newAmenities.loan_pending_amount;
    }
    onChange({
      ...details,
      amenities: newAmenities,
    });
  };

  // Helper to update loan amount
  const handleLoanAmountChange = (amount) => {
    onChange({
      ...details,
      amenities: {
        ...amenities,
        loan_pending_amount: amount,
      },
    });
  };

  // Add custom option
  const handleAddCustom = () => {
    const trimmed = customInput.trim();
    if (!trimmed) return;
    if (trimmed.length > 60) {
      setCustomError("Label must be 60 characters or less");
      return;
    }
    if (customFields.length >= 10) {
      setCustomError("Maximum 10 custom options allowed");
      return;
    }
    if (customFields.some((f) => f.label.toLowerCase() === trimmed.toLowerCase())) {
      setCustomError("Option already exists");
      return;
    }

    setCustomError("");
    const updatedCustom = [...customFields, { label: trimmed, value: "Yes" }];
    onChange({
      ...details,
      custom_fields: updatedCustom,
    });
    setCustomInput("");
  };

  // Remove custom option
  const handleRemoveCustom = (index) => {
    const updatedCustom = customFields.filter((_, idx) => idx !== index);
    onChange({
      ...details,
      custom_fields: updatedCustom,
    });
  };

  // Toggle custom option value
  const handleCustomValueChange = (index, value) => {
    const updatedCustom = customFields.map((item, idx) =>
      idx === index ? { ...item, value } : item
    );
    onChange({
      ...details,
      custom_fields: updatedCustom,
    });
  };

  return (
    <Stack spacing={3}>
      {/* ── 1. Category Specific Details Card ── */}
      {catConfig.specificFields && catConfig.specificFields.length > 0 && (
        <Card
          sx={{
            borderRadius: "20px",
            border: `1px solid ${UI.border}`,
            background: UI.surface,
            boxShadow: "0 4px 20px rgba(15, 23, 42, 0.04)",
            overflow: "hidden",
          }}
        >
          <CardContent sx={{ p: { xs: 2.5, sm: 3.5 } }}>
            <Stack direction="row" spacing={1.5} alignItems="center" sx={{ mb: 1 }}>
              <Box
                sx={{
                  width: 38,
                  height: 38,
                  borderRadius: "11px",
                  background: UI.primarySoft,
                  color: UI.primary,
                  display: "grid",
                  placeItems: "center",
                  flexShrink: 0,
                }}
              >
                <TuneRoundedIcon sx={{ fontSize: 20 }} />
              </Box>
              <Box>
                <Typography sx={{ fontWeight: 800, fontSize: "1.05rem", color: UI.text }}>
                  {canonicalCat} Specific Details
                </Typography>
                <Typography sx={{ fontSize: "0.8rem", color: UI.muted }}>
                  Customized specifications for {canonicalCat} (all optional)
                </Typography>
              </Box>
            </Stack>
            <Divider sx={{ my: 2.5, borderColor: UI.border }} />

            <Grid container spacing={2.5}>
              {catConfig.specificFields.map((field) => {
                const val = specificValues[field.name];

                // Multiselect Chips
                if (field.type === "multiselect") {
                  const selectedList = Array.isArray(val) ? val : [];
                  return (
                    <Grid size={{ xs: 12 }} key={field.name}>
                      <Typography sx={{ fontWeight: 700, fontSize: "0.88rem", color: UI.text, mb: 0.5 }}>
                        {field.label}
                      </Typography>
                      {field.helperText && (
                        <Typography sx={{ fontSize: "0.78rem", color: UI.muted, mb: 1 }}>
                          {field.helperText}
                        </Typography>
                      )}
                      <Box sx={{ display: "flex", flexWrap: "wrap", gap: 1 }}>
                        {field.options.map((opt) => {
                          const isSelected = selectedList.includes(opt);
                          return (
                            <Chip
                              key={opt}
                              label={opt}
                              clickable
                              onClick={() => handleMultiselectToggle(field.name, opt)}
                              icon={
                                isSelected ? (
                                  <CheckRoundedIcon sx={{ fontSize: "14px !important" }} />
                                ) : undefined
                              }
                              sx={{
                                fontWeight: 700,
                                fontSize: "0.82rem",
                                borderRadius: "10px",
                                px: 0.8,
                                py: 0.6,
                                transition: "all 0.15s ease",
                                border: isSelected ? "1.5px solid #0F766E" : "1px solid #CBD5E1",
                                background: isSelected ? "#F0FDFA" : "#FFFFFF",
                                color: isSelected ? "#0F766E" : "#475569",
                                boxShadow: isSelected ? "0 2px 8px rgba(15, 118, 110, 0.15)" : "none",
                                "&:hover": {
                                  background: isSelected ? "#CCFBF1" : "#F8FAFC",
                                  borderColor: isSelected ? "#0F766E" : "#94A3B8",
                                },
                              }}
                            />
                          );
                        })}
                      </Box>
                    </Grid>
                  );
                }

                // Yes/No pill button
                if (field.type === "yesno") {
                  return (
                    <Grid size={{ xs: 12, sm: 6 }} key={field.name}>
                      <Box
                        sx={{
                          p: 1.8,
                          borderRadius: "14px",
                          border: "1px solid #E2E8F0",
                          background: "#F8FAFC",
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "space-between",
                          gap: 1.5,
                        }}
                      >
                        <Typography sx={{ fontWeight: 700, fontSize: "0.86rem", color: UI.text }}>
                          {field.label}
                        </Typography>
                        <YesNoToggle
                          value={val}
                          onChange={(newVal) => handleSpecificChange(field.name, newVal)}
                        />
                      </Box>
                    </Grid>
                  );
                }

                // Single Select Dropdown
                if (field.type === "select") {
                  return (
                    <Grid size={{ xs: 12, sm: 6 }} key={field.name}>
                      <Typography sx={{ fontWeight: 700, fontSize: "0.86rem", color: UI.text, mb: 0.75 }}>
                        {field.label}
                      </Typography>
                      <Select
                        size="small"
                        fullWidth
                        displayEmpty
                        value={val || ""}
                        onChange={(e) => handleSpecificChange(field.name, e.target.value || null)}
                        sx={{
                          borderRadius: "12px",
                          background: "#F8FAFC",
                          fontSize: "0.875rem",
                          "& .MuiOutlinedInput-notchedOutline": { borderColor: "#E2E8F0" },
                        }}
                      >
                        <MenuItem value="">
                          <em style={{ color: "#94A3B8" }}>{field.placeholder || "Select option"}</em>
                        </MenuItem>
                        {field.options.map((opt) => (
                          <MenuItem key={opt} value={opt}>
                            {opt}
                          </MenuItem>
                        ))}
                      </Select>
                    </Grid>
                  );
                }

                // Number field
                if (field.type === "number") {
                  return (
                    <Grid size={{ xs: 12, sm: 6 }} key={field.name}>
                      <Typography sx={{ fontWeight: 700, fontSize: "0.86rem", color: UI.text, mb: 0.75 }}>
                        {field.label}
                      </Typography>
                      <TextField
                        size="small"
                        fullWidth
                        type="number"
                        placeholder={field.placeholder || "Enter number"}
                        value={val ?? ""}
                        onChange={(e) => handleSpecificChange(field.name, e.target.value === "" ? null : Number(e.target.value))}
                        inputProps={{ min: 0 }}
                        sx={{
                          "& .MuiOutlinedInput-root": {
                            borderRadius: "12px",
                            background: "#F8FAFC",
                            fontSize: "0.875rem",
                          },
                        }}
                      />
                    </Grid>
                  );
                }

                // Text field
                const isAcresGuntas = field.name === "acres_guntas";
                const hint = isAcresGuntas ? getAcresGuntasHint(val) : null;

                return (
                  <Grid size={{ xs: 12, sm: 6 }} key={field.name}>
                    <Typography sx={{ fontWeight: 700, fontSize: "0.86rem", color: UI.text, mb: 0.75 }}>
                      {field.label}
                    </Typography>
                    <TextField
                      size="small"
                      fullWidth
                      placeholder={field.placeholder || "Enter details"}
                      value={val || ""}
                      onChange={(e) => handleSpecificChange(field.name, e.target.value)}
                      sx={{
                        "& .MuiOutlinedInput-root": {
                          borderRadius: "12px",
                          background: "#F8FAFC",
                          fontSize: "0.875rem",
                        },
                      }}
                    />
                    {hint ? (
                      <Typography sx={{ fontSize: "0.75rem", color: "#0F766E", fontWeight: 700, mt: 0.5 }}>
                        💡 {hint}
                      </Typography>
                    ) : field.helperText ? (
                      <Typography sx={{ fontSize: "0.76rem", color: UI.muted, mt: 0.5 }}>
                        {field.helperText}
                      </Typography>
                    ) : null}
                  </Grid>
                );
              })}
            </Grid>
          </CardContent>
        </Card>
      )}

      {/* ── 2. Collapsible Amenity Groups (U, A, N, F, L) ── */}
      <Card
        sx={{
          borderRadius: "20px",
          border: `1px solid ${UI.border}`,
          background: UI.surface,
          boxShadow: "0 4px 20px rgba(15, 23, 42, 0.04)",
          overflow: "hidden",
        }}
      >
        <CardContent sx={{ p: { xs: 2.5, sm: 3.5 } }}>
          <Stack direction="row" spacing={1.5} alignItems="center" sx={{ mb: 1 }}>
            <Box
              sx={{
                width: 38,
                height: 38,
                borderRadius: "11px",
                background: "rgba(2, 132, 199, 0.08)",
                color: "#0284C7",
                display: "grid",
                placeItems: "center",
                flexShrink: 0,
              }}
            >
              <ElectricBoltRoundedIcon sx={{ fontSize: 20 }} />
            </Box>
            <Box>
              <Typography sx={{ fontWeight: 800, fontSize: "1.05rem", color: UI.text }}>
                Amenities & Verified Features
              </Typography>
              <Typography sx={{ fontSize: "0.8rem", color: UI.muted }}>
                Applicable features grouped by category (all optional)
              </Typography>
            </Box>
          </Stack>
          <Divider sx={{ my: 2.5, borderColor: UI.border }} />

          <Stack spacing={1.75}>
            {Object.keys(AMENITY_GROUPS).map((groupId) => {
              const groupDef = AMENITY_GROUPS[groupId];
              const groupAmenities = catConfig.amenities?.[groupId];

              if (!groupAmenities || groupAmenities.length === 0) return null;

              // Count active "Yes" options
              const yesCount = groupAmenities.filter(
                (item) => amenities[item.key] === "Yes"
              ).length;

              return (
                <Accordion
                  key={groupId}
                  defaultExpanded={groupId === "U" || groupId === "L"}
                  disableGutters
                  sx={{
                    borderRadius: "16px !important",
                    border: "1px solid #E2E8F0",
                    boxShadow: "none",
                    "&:before": { display: "none" },
                    overflow: "hidden",
                  }}
                >
                  <AccordionSummary
                    expandIcon={<ExpandMoreRoundedIcon />}
                    sx={{
                      background: "#F8FAFC",
                      px: 2.5,
                      py: 1,
                      "&.Mui-expanded": { background: "#F1F5F9" },
                    }}
                  >
                    <Stack direction="row" spacing={1.5} alignItems="center" sx={{ flexGrow: 1, pr: 1 }}>
                      {GROUP_ICONS[groupId]}
                      <Box sx={{ flexGrow: 1 }}>
                        <Typography sx={{ fontWeight: 800, fontSize: "0.92rem", color: UI.text }}>
                          {groupDef.title}
                        </Typography>
                        <Typography sx={{ fontSize: "0.75rem", color: UI.muted }}>
                          {groupDef.description}
                        </Typography>
                      </Box>
                      {yesCount > 0 && (
                        <Chip
                          label={`${yesCount} selected`}
                          size="small"
                          sx={{
                            fontWeight: 800,
                            fontSize: "0.72rem",
                            background: "#ECFDF5",
                            color: "#059669",
                            border: "1px solid #A7F3D0",
                          }}
                        />
                      )}
                    </Stack>
                  </AccordionSummary>

                  <AccordionDetails sx={{ p: 2.5, background: "#FFFFFF" }}>
                    <Grid container spacing={2}>
                      {groupAmenities.map((item) => {
                        const def = AMENITIES_DICTIONARY[item.key] || {
                          defaultLabel: item.key,
                          type: "yesno",
                        };
                        const label = item.labelOverride || def.defaultLabel;
                        const isLoanPending = item.key === "loan_pending";
                        const currentValue = amenities[item.key];
                        const loanAmount = amenities.loan_pending_amount;

                        return (
                          <Grid size={{ xs: 12, sm: 6 }} key={item.key}>
                            <Box
                              sx={{
                                p: 1.8,
                                borderRadius: "14px",
                                border: "1px solid #E2E8F0",
                                background: currentValue === "Yes" ? "#F0FDFA" : "#F8FAFC",
                                transition: "all 0.15s ease",
                              }}
                            >
                              <Stack
                                direction="row"
                                justifyContent="space-between"
                                alignItems="center"
                                spacing={1}
                              >
                                <Typography
                                  sx={{
                                    fontWeight: 700,
                                    fontSize: "0.85rem",
                                    color: currentValue === "Yes" ? "#0F766E" : UI.text,
                                  }}
                                >
                                  {label}
                                </Typography>
                                <YesNoToggle
                                  value={currentValue}
                                  onChange={(val) => handleAmenityChange(item.key, val)}
                                />
                              </Stack>

                              {/* Conditional Loan Balance Amount input when loan is Yes */}
                              {isLoanPending && currentValue === "Yes" && (
                                <Box sx={{ mt: 1.75, pt: 1.5, borderTop: "1px dashed #CBD5E1" }}>
                                  <Typography
                                    sx={{
                                      fontWeight: 700,
                                      fontSize: "0.78rem",
                                      color: "#92400E",
                                      mb: 0.5,
                                    }}
                                  >
                                    Loan balance amount (₹) *
                                  </Typography>
                                  <TextField
                                    size="small"
                                    fullWidth
                                    type="number"
                                    placeholder="e.g. 250000"
                                    value={loanAmount || ""}
                                    onChange={(e) => handleLoanAmountChange(e.target.value)}
                                    InputProps={{
                                      startAdornment: (
                                        <InputAdornment position="start">
                                          <CurrencyRupeeRoundedIcon sx={{ fontSize: 16, color: "#64748B" }} />
                                        </InputAdornment>
                                      ),
                                    }}
                                    sx={{
                                      "& .MuiOutlinedInput-root": {
                                        borderRadius: "10px",
                                        background: "#FFFFFF",
                                        fontSize: "0.84rem",
                                      },
                                    }}
                                  />
                                </Box>
                              )}
                            </Box>
                          </Grid>
                        );
                      })}
                    </Grid>
                  </AccordionDetails>
                </Accordion>
              );
            })}
          </Stack>
        </CardContent>
      </Card>

      {/* ── 3. Custom Fields Box ("Add your own Yes/No option") ── */}
      <Card
        sx={{
          borderRadius: "20px",
          border: `1px solid ${UI.border}`,
          background: UI.surface,
          boxShadow: "0 4px 20px rgba(15, 23, 42, 0.04)",
          overflow: "hidden",
        }}
      >
        <CardContent sx={{ p: { xs: 2.5, sm: 3.5 } }}>
          <Stack direction="row" spacing={1.5} alignItems="center" sx={{ mb: 1 }}>
            <Box
              sx={{
                width: 38,
                height: 38,
                borderRadius: "11px",
                background: "rgba(124, 58, 237, 0.08)",
                color: "#7C3AED",
                display: "grid",
                placeItems: "center",
                flexShrink: 0,
              }}
            >
              <AddRoundedIcon sx={{ fontSize: 20 }} />
            </Box>
            <Box sx={{ flexGrow: 1 }}>
              <Stack direction="row" alignItems="center" spacing={1}>
                <Typography sx={{ fontWeight: 800, fontSize: "1.05rem", color: UI.text }}>
                  Custom Options
                </Typography>
                <Chip
                  label={`${customFields.length}/10`}
                  size="small"
                  sx={{
                    fontWeight: 800,
                    fontSize: "0.72rem",
                    background: "#F1F5F9",
                    color: "#64748B",
                  }}
                />
              </Stack>
              <Typography sx={{ fontSize: "0.8rem", color: UI.muted }}>
                Add your own Yes / No options (e.g. "Cattle shed", "Servant quarters", "Storage room")
              </Typography>
            </Box>
          </Stack>
          <Divider sx={{ my: 2.5, borderColor: UI.border }} />

          {/* Add Option Input Row */}
          <Stack
            direction={{ xs: "column", sm: "row" }}
            spacing={1.5}
            alignItems={{ xs: "stretch", sm: "center" }}
            sx={{ mb: 2 }}
          >
            <TextField
              size="small"
              fullWidth
              placeholder="e.g. Cattle shed, Servant quarters, EV charger..."
              value={customInput}
              onChange={(e) => {
                setCustomInput(e.target.value);
                if (customError) setCustomError("");
              }}
              onKeyDown={(e) => {
                if (e.key === "Enter") {
                  e.preventDefault();
                  handleAddCustom();
                }
              }}
              inputProps={{ maxLength: 60 }}
              helperText={`${customInput.length}/60 characters`}
              sx={{
                "& .MuiOutlinedInput-root": {
                  borderRadius: "12px",
                  background: "#F8FAFC",
                  fontSize: "0.875rem",
                },
              }}
            />
            <Button
              variant="contained"
              onClick={handleAddCustom}
              disabled={!customInput.trim() || customFields.length >= 10}
              startIcon={<AddRoundedIcon />}
              sx={{
                borderRadius: "12px",
                fontWeight: 700,
                textTransform: "none",
                background: UI.primary,
                color: "#FFFFFF",
                px: 2.5,
                py: 1,
                flexShrink: 0,
                "&:hover": { background: "#0D655E" },
              }}
            >
              Add Option
            </Button>
          </Stack>

          {customError && (
            <Alert severity="warning" sx={{ mb: 2, borderRadius: "12px", fontSize: "0.84rem" }}>
              {customError}
            </Alert>
          )}

          {/* List of Custom Added Options */}
          {customFields.length > 0 ? (
            <Grid container spacing={1.5}>
              {customFields.map((field, idx) => (
                <Grid size={{ xs: 12, sm: 6 }} key={idx}>
                  <Box
                    sx={{
                      p: 1.8,
                      borderRadius: "14px",
                      border: "1px solid #E2E8F0",
                      background: field.value === "Yes" ? "#F0FDFA" : "#F8FAFC",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "space-between",
                      gap: 1.5,
                    }}
                  >
                    <Typography
                      sx={{
                        fontWeight: 700,
                        fontSize: "0.86rem",
                        color: UI.text,
                        overflow: "hidden",
                        textOverflow: "ellipsis",
                        whiteSpace: "nowrap",
                        flex: 1,
                      }}
                      title={field.label}
                    >
                      {field.label}
                    </Typography>

                    <Stack direction="row" spacing={1} alignItems="center">
                      <YesNoToggle
                        value={field.value}
                        onChange={(val) => handleCustomValueChange(idx, val)}
                      />
                      <IconButton
                        size="small"
                        onClick={() => handleRemoveCustom(idx)}
                        sx={{
                          color: "#94A3B8",
                          "&:hover": { color: "#EF4444", background: "rgba(239, 68, 68, 0.08)" },
                        }}
                      >
                        <DeleteOutlineRoundedIcon sx={{ fontSize: 18 }} />
                      </IconButton>
                    </Stack>
                  </Box>
                </Grid>
              ))}
            </Grid>
          ) : (
            <Box
              sx={{
                p: 2.5,
                borderRadius: "14px",
                border: "1px dashed #CBD5E1",
                background: "#F8FAFC",
                textAlign: "center",
              }}
            >
              <Typography sx={{ fontSize: "0.84rem", color: UI.muted }}>
                No custom Yes/No options added yet. Type an option above and click "Add Option".
              </Typography>
            </Box>
          )}
        </CardContent>
      </Card>
    </Stack>
  );
}
