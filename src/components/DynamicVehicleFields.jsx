// src/components/DynamicVehicleFields.jsx
import React, { useState } from "react";
import {
  Alert,
  Box,
  Button,
  Card,
  CardContent,
  Chip,
  Collapse,
  Divider,
  Grid,
  IconButton,
  InputAdornment,
  MenuItem,
  Stack,
  TextField,
  Tooltip,
  Typography,
} from "@mui/material";
import TuneRoundedIcon from "@mui/icons-material/TuneRounded";
import VerifiedUserRoundedIcon from "@mui/icons-material/VerifiedUserRounded";
import AddRoundedIcon from "@mui/icons-material/AddRounded";
import DeleteOutlineRoundedIcon from "@mui/icons-material/DeleteOutlineRounded";
import CurrencyRupeeRoundedIcon from "@mui/icons-material/CurrencyRupeeRounded";
import CheckRoundedIcon from "@mui/icons-material/CheckRounded";
import CloseRoundedIcon from "@mui/icons-material/CloseRounded";

import {
  normalizeVehicleCategory,
  VEHICLE_CATEGORY_CONFIG,
  VEHICLE_CHECKLIST,
} from "../config/vehicleFields";
import { YesNoToggle } from "./DynamicPropertyFields";

export default function DynamicVehicleFields({
  category,
  details = {},
  onChange,
  UI = {
    surface: "#FFFFFF",
    border: "rgba(226, 232, 240, 0.9)",
    text: "#0F172A",
    muted: "#64748B",
    primary: "#7C3AED",
    primarySoft: "rgba(124, 58, 237, 0.08)",
  },
}) {
  const [customInput, setCustomInput] = useState("");
  const [customError, setCustomError] = useState("");

  const canonicalCategory = normalizeVehicleCategory(category);
  const catConfig = VEHICLE_CATEGORY_CONFIG[canonicalCategory] || { specificFields: [] };

  const amenities = details?.amenities || {};
  const customFields = Array.isArray(details?.custom_fields) ? details.custom_fields : [];

  // Helper to update category-specific field
  const handleSpecificChange = (fieldName, value) => {
    onChange({
      ...details,
      [fieldName]: value === "" || value === undefined ? null : value,
    });
  };

  // Helper for multiselect chips toggle
  const handleMultiSelectToggle = (fieldName, option) => {
    const current = Array.isArray(details[fieldName]) ? details[fieldName] : [];
    let updated;
    if (current.includes(option)) {
      updated = current.filter((item) => item !== option);
    } else {
      updated = [...current, option];
    }
    handleSpecificChange(fieldName, updated.length > 0 ? updated : null);
  };

  // Helper to update checklist item
  const handleAmenityChange = (key, value) => {
    const newAmenities = { ...amenities, [key]: value };
    if (value !== "Yes" && key === "loan_pending") {
      delete newAmenities.loan_pending_amount;
    }
    onChange({
      ...details,
      amenities: newAmenities,
    });
  };

  // Helper to update loan balance amount
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
      {/* ── 1. Category Specific Fields Card ── */}
      {catConfig.specificFields && catConfig.specificFields.length > 0 && (
        <Card
          sx={{
            borderRadius: "20px",
            border: `1px solid ${UI.border}`,
            background: UI.surface,
            boxShadow: "0 4px 20px rgba(15, 23, 42, 0.04)",
          }}
        >
          <CardContent sx={{ p: { xs: 2.5, sm: 3.5 } }}>
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
                  <TuneRoundedIcon sx={{ fontSize: 20 }} />
                </Box>
                <Box>
                  <Typography
                    sx={{
                      fontWeight: 800,
                      fontSize: "1.05rem",
                      color: UI.text,
                      lineHeight: 1.25,
                    }}
                  >
                    {canonicalCategory} Specifications (Optional)
                  </Typography>
                  <Typography sx={{ fontSize: "0.82rem", color: UI.muted, mt: 0.35 }}>
                    Specifications specific to this vehicle category. All fields are optional.
                  </Typography>
                </Box>
              </Stack>
            </Box>

            <Divider sx={{ mb: 3, borderColor: UI.border }} />

            <Grid container spacing={2.5}>
              {catConfig.specificFields.map((field) => {
                const curVal = details[field.name];

                // Case A: Yes / No Pill Toggle
                if (field.type === "yesno") {
                  return (
                    <Grid size={{ xs: 12, sm: 6 }} key={field.name}>
                      <Box
                        sx={{
                          p: 1.6,
                          borderRadius: "14px",
                          border: "1px solid",
                          borderColor:
                            curVal === "Yes"
                              ? "#A7F3D0"
                              : curVal === "No"
                              ? "#CBD5E1"
                              : "rgba(226, 232, 240, 0.8)",
                          background:
                            curVal === "Yes"
                              ? "rgba(240, 253, 244, 0.6)"
                              : curVal === "No"
                              ? "#F8FAFC"
                              : "#FFFFFF",
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "space-between",
                          gap: 1.5,
                          transition: "all 0.2s ease",
                        }}
                      >
                        <Typography sx={{ fontSize: "0.88rem", fontWeight: 600, color: UI.text }}>
                          {field.label}
                        </Typography>
                        <YesNoToggle
                          value={curVal ?? null}
                          onChange={(val) => handleSpecificChange(field.name, val)}
                        />
                      </Box>
                    </Grid>
                  );
                }

                // Case B: Multiselect Chips
                if (field.type === "multiselect") {
                  const selectedArr = Array.isArray(curVal) ? curVal : [];
                  return (
                    <Grid size={{ xs: 12 }} key={field.name}>
                      <Typography sx={{ fontSize: "0.88rem", fontWeight: 700, color: UI.text, mb: 0.5 }}>
                        {field.label} (Optional)
                      </Typography>
                      {field.helperText && (
                        <Typography sx={{ fontSize: "0.78rem", color: UI.muted, mb: 1.2 }}>
                          {field.helperText}
                        </Typography>
                      )}
                      <Stack direction="row" spacing={1} flexWrap="wrap" sx={{ gap: 1 }}>
                        {field.options.map((opt) => {
                          const isSel = selectedArr.includes(opt);
                          return (
                            <Chip
                              key={opt}
                              label={opt}
                              clickable
                              onClick={() => handleMultiSelectToggle(field.name, opt)}
                              icon={
                                isSel ? (
                                  <CheckRoundedIcon sx={{ fontSize: "16px !important", color: `${UI.primary} !important` }} />
                                ) : undefined
                              }
                              sx={{
                                borderRadius: "10px",
                                fontWeight: 700,
                                fontSize: "0.82rem",
                                py: 1.8,
                                px: 0.5,
                                border: isSel ? `1.5px solid ${UI.primary}` : "1px solid #CBD5E1",
                                background: isSel ? UI.primarySoft : "#FFFFFF",
                                color: isSel ? UI.primary : UI.text,
                                "&:hover": {
                                  background: isSel ? UI.primarySoft : "#F8FAFC",
                                },
                              }}
                            />
                          );
                        })}
                      </Stack>
                    </Grid>
                  );
                }

                // Case C: Select Dropdown
                if (field.type === "select") {
                  return (
                    <Grid size={{ xs: 12, sm: 6 }} key={field.name}>
                      <TextField
                        select
                        fullWidth
                        size="small"
                        label={`${field.label} (Optional)`}
                        value={curVal || ""}
                        onChange={(e) => handleSpecificChange(field.name, e.target.value)}
                        helperText={field.helperText}
                        sx={{
                          "& .MuiOutlinedInput-root": {
                            borderRadius: "12px",
                            backgroundColor: "#FFFFFF",
                          },
                        }}
                      >
                        <MenuItem value="">
                          <em>None / Not specified</em>
                        </MenuItem>
                        {field.options.map((opt) => (
                          <MenuItem key={opt} value={opt}>
                            {opt}
                          </MenuItem>
                        ))}
                      </TextField>
                    </Grid>
                  );
                }

                // Case D: Number or Text Input
                return (
                  <Grid size={{ xs: 12, sm: 6 }} key={field.name}>
                    <TextField
                      fullWidth
                      size="small"
                      type={field.type === "number" ? "number" : "text"}
                      label={`${field.label} (Optional)`}
                      placeholder={field.placeholder || ""}
                      value={curVal ?? ""}
                      onChange={(e) => handleSpecificChange(field.name, e.target.value)}
                      helperText={field.helperText}
                      sx={{
                        "& .MuiOutlinedInput-root": {
                          borderRadius: "12px",
                          backgroundColor: "#FFFFFF",
                        },
                      }}
                    />
                  </Grid>
                );
              })}
            </Grid>
          </CardContent>
        </Card>
      )}

      {/* ── 2. Standard Legal Documents & Verification Checklist ── */}
      <Card
        sx={{
          borderRadius: "20px",
          border: `1px solid ${UI.border}`,
          background: UI.surface,
          boxShadow: "0 4px 20px rgba(15, 23, 42, 0.04)",
        }}
      >
        <CardContent sx={{ p: { xs: 2.5, sm: 3.5 } }}>
          <Box sx={{ mb: 2.5 }}>
            <Stack direction="row" spacing={1.5} alignItems="center">
              <Box
                sx={{
                  width: 40,
                  height: 40,
                  borderRadius: "12px",
                  background: "rgba(5, 150, 105, 0.1)",
                  color: "#059669",
                  display: "grid",
                  placeItems: "center",
                  flexShrink: 0,
                }}
              >
                <VerifiedUserRoundedIcon sx={{ fontSize: 20 }} />
              </Box>
              <Box>
                <Typography
                  sx={{
                    fontWeight: 800,
                    fontSize: "1.05rem",
                    color: UI.text,
                    lineHeight: 1.25,
                  }}
                >
                  Legal Documents & Verification Checklist (Optional)
                </Typography>
                <Typography sx={{ fontSize: "0.82rem", color: UI.muted, mt: 0.35 }}>
                  Select availability for buyer trust. Optional; omit or clear if unsure.
                </Typography>
              </Box>
            </Stack>
          </Box>

          <Divider sx={{ mb: 3, borderColor: UI.border }} />

          <Grid container spacing={2}>
            {VEHICLE_CHECKLIST.map((item) => {
              const currentVal = amenities[item.key];

              if (item.type === "yesno_amount") {
                return (
                  <Grid size={{ xs: 12 }} key={item.key}>
                    <Box
                      sx={{
                        p: 2,
                        borderRadius: "14px",
                        border: "1.5px solid",
                        borderColor: currentVal === "Yes" ? "#F59E0B" : "rgba(226, 232, 240, 0.9)",
                        background: currentVal === "Yes" ? "rgba(254, 243, 199, 0.25)" : "#FFFFFF",
                        transition: "all 0.2s ease",
                      }}
                    >
                      <Stack
                        direction={{ xs: "column", sm: "row" }}
                        alignItems={{ xs: "flex-start", sm: "center" }}
                        justifyContent="space-between"
                        spacing={2}
                      >
                        <Box>
                          <Typography sx={{ fontSize: "0.92rem", fontWeight: 700, color: UI.text }}>
                            {item.label}
                          </Typography>
                          <Typography sx={{ fontSize: "0.78rem", color: UI.muted, mt: 0.25 }}>
                            Specify if there is an active finance / bank loan on this vehicle
                          </Typography>
                        </Box>
                        <YesNoToggle
                          value={currentVal ?? null}
                          onChange={(val) => handleAmenityChange(item.key, val)}
                        />
                      </Stack>

                      {currentVal === "Yes" && (
                        <Box sx={{ mt: 2.5, pt: 2, borderTop: "1px dashed rgba(245, 158, 11, 0.4)" }}>
                          <TextField
                            size="small"
                            fullWidth
                            type="number"
                            label="Loan balance amount (₹) *"
                            placeholder="e.g. 150000"
                            value={amenities.loan_pending_amount ?? ""}
                            onChange={(e) => handleLoanAmountChange(e.target.value)}
                            slotProps={{
                              input: {
                                startAdornment: (
                                  <InputAdornment position="start">
                                    <CurrencyRupeeRoundedIcon sx={{ fontSize: 16, color: "#D97706" }} />
                                  </InputAdornment>
                                ),
                              },
                            }}
                            helperText="Buyer will see this to calculate loan transfer and NOC processing"
                          />
                        </Box>
                      )}
                    </Box>
                  </Grid>
                );
              }

              return (
                <Grid size={{ xs: 12, sm: 6 }} key={item.key}>
                  <Box
                    sx={{
                      p: 1.6,
                      borderRadius: "14px",
                      border: "1px solid",
                      borderColor:
                        currentVal === "Yes"
                          ? "#A7F3D0"
                          : currentVal === "No"
                          ? "#CBD5E1"
                          : "rgba(226, 232, 240, 0.9)",
                      background:
                        currentVal === "Yes"
                          ? "rgba(240, 253, 244, 0.6)"
                          : currentVal === "No"
                          ? "#F8FAFC"
                          : "#FFFFFF",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "space-between",
                      gap: 1.5,
                      transition: "all 0.2s ease",
                    }}
                  >
                    <Typography sx={{ fontSize: "0.86rem", fontWeight: 600, color: UI.text }}>
                      {item.label}
                    </Typography>
                    <YesNoToggle
                      value={currentVal ?? null}
                      onChange={(val) => handleAmenityChange(item.key, val)}
                    />
                  </Box>
                </Grid>
              );
            })}
          </Grid>
        </CardContent>
      </Card>

      {/* ── 3. Custom Yes/No Options Box ── */}
      <Card
        sx={{
          borderRadius: "20px",
          border: `1px solid ${UI.border}`,
          background: UI.surface,
          boxShadow: "0 4px 20px rgba(15, 23, 42, 0.04)",
        }}
      >
        <CardContent sx={{ p: { xs: 2.5, sm: 3.5 } }}>
          <Typography sx={{ fontSize: "0.98rem", fontWeight: 800, color: UI.text, mb: 0.5 }}>
            Add your own Yes/No option
          </Typography>
          <Typography sx={{ fontSize: "0.82rem", color: UI.muted, mb: 2 }}>
            Add custom features (e.g. "Sunroof installed", "New tyres (90%)", "Android touch screen", "CNG fitted in RC"). Max 10 items, ≤ 60 chars each.
          </Typography>

          <Stack direction={{ xs: "column", sm: "row" }} spacing={1.5} alignItems="flex-start" sx={{ mb: 2 }}>
            <TextField
              size="small"
              fullWidth
              value={customInput}
              onChange={(e) => {
                setCustomInput(e.target.value);
                if (customError) setCustomError("");
              }}
              placeholder="Type an option (e.g. Reverse camera with display)"
              error={Boolean(customError)}
              helperText={customError}
              inputProps={{ maxLength: 60 }}
              sx={{
                "& .MuiOutlinedInput-root": {
                  borderRadius: "12px",
                  backgroundColor: "#FFFFFF",
                },
              }}
            />
            <Button
              variant="contained"
              onClick={handleAddCustom}
              startIcon={<AddRoundedIcon />}
              sx={{
                minWidth: 100,
                height: 40,
                borderRadius: "12px",
                textTransform: "none",
                fontWeight: 800,
                background: UI.primary,
                boxShadow: "none",
                "&:hover": { background: "#6D28D9" },
              }}
            >
              Add
            </Button>
          </Stack>

          {customFields && customFields.length > 0 && (
            <Stack spacing={1.5} sx={{ mt: 2 }}>
              {customFields.map((item, idx) => (
                <Box
                  key={idx}
                  sx={{
                    p: 1.4,
                    px: 2,
                    borderRadius: "12px",
                    background: "#FFFFFF",
                    border: "1px solid",
                    borderColor: item.value === "Yes" ? "#A7F3D0" : "#CBD5E1",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "space-between",
                    gap: 2,
                  }}
                >
                  <Typography sx={{ fontSize: "0.86rem", fontWeight: 600, color: UI.text }}>
                    {item.label}
                  </Typography>
                  <Stack direction="row" spacing={1} alignItems="center">
                    <YesNoToggle
                      value={item.value}
                      onChange={(val) => handleCustomValueChange(idx, val || "No")}
                    />
                    <IconButton
                      size="small"
                      onClick={() => handleRemoveCustom(idx)}
                      sx={{ color: "#94A3B8", "&:hover": { color: "#EF4444" } }}
                    >
                      <DeleteOutlineRoundedIcon sx={{ fontSize: 18 }} />
                    </IconButton>
                  </Stack>
                </Box>
              ))}
            </Stack>
          )}
        </CardContent>
      </Card>
    </Stack>
  );
}
