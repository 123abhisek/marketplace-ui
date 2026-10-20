// src/components/LgdLocationSelector.jsx
import React, { useState, useEffect, useCallback, useMemo } from "react";
import { Controller } from "react-hook-form";
import {
  Autocomplete,
  Box,
  Chip,
  CircularProgress,
  Grid,
  IconButton,
  InputAdornment,
  Paper,
  Stack,
  TextField,
  Typography,
} from "@mui/material";
import SearchRoundedIcon from "@mui/icons-material/SearchRounded";
import PlaceRoundedIcon from "@mui/icons-material/PlaceRounded";
import LocationCityRoundedIcon from "@mui/icons-material/LocationCityRounded";
import MapRoundedIcon from "@mui/icons-material/MapRounded";
import CheckCircleRoundedIcon from "@mui/icons-material/CheckCircleRounded";
import ClearRoundedIcon from "@mui/icons-material/ClearRounded";
import { locationService } from "../services/api";

const DEFAULT_UI = {
  border: "rgba(226, 232, 240, 0.9)",
  text: "#0F172A",
  muted: "#64748B",
  primary: "#0F766E",
  primarySoft: "rgba(15, 118, 110, 0.08)",
};

export default function LgdLocationSelector({
  control,
  setValue,
  watch,
  stateFieldName = "state",
  districtFieldName = "district",
  cityFieldName = "city",
  localAddressFieldName = "localAddress",
  UI = DEFAULT_UI,
  showState = true,
  districtRequired = true,
  cityRequired = true,
  localAddressRequired = true,
}) {
  const currentState = watch ? watch(stateFieldName) : "Karnataka";
  const currentDistrict = watch ? watch(districtFieldName) : "";
  const currentCity = watch ? watch(cityFieldName) : "";

  // Data states
  const [states, setStates] = useState([]);
  const [loadingStates, setLoadingStates] = useState(false);

  const [districts, setDistricts] = useState([]);
  const [loadingDistricts, setLoadingDistricts] = useState(false);

  const [subdistricts, setSubdistricts] = useState([]);
  const [loadingSubdistricts, setLoadingSubdistricts] = useState(false);

  // Universal search states
  const [searchQuery, setSearchQuery] = useState("");
  const [searchResults, setSearchResults] = useState([]);
  const [searching, setSearching] = useState(false);

  // 1. Fetch States on Mount
  useEffect(() => {
    let mounted = true;
    setLoadingStates(true);
    locationService
      .getStates()
      .then((data) => {
        if (!mounted) return;
        const list = Array.isArray(data) ? data : data?.data || [];
        setStates(list);
      })
      .catch((err) => {
        console.warn("Failed to load states:", err);
      })
      .finally(() => {
        if (mounted) setLoadingStates(false);
      });

    return () => {
      mounted = false;
    };
  }, []);

  // Find state code for current selected state
  const selectedStateObj = useMemo(() => {
    if (!currentState) return null;
    return (
      states.find(
        (s) =>
          s.name?.toLowerCase() === String(currentState).toLowerCase() ||
          String(s.code) === String(currentState)
      ) || null
    );
  }, [states, currentState]);

  // 2. Fetch Districts whenever State changes
  const fetchDistrictsForState = useCallback(async (stateCodeOrName) => {
    if (!stateCodeOrName) {
      setDistricts([]);
      return;
    }
    setLoadingDistricts(true);
    try {
      const data = await locationService.getDistricts(stateCodeOrName);
      const list = Array.isArray(data) ? data : data?.data || [];
      setDistricts(list);
    } catch (err) {
      console.warn("Failed to load districts:", err);
      setDistricts([]);
    } finally {
      setLoadingDistricts(false);
    }
  }, []);

  useEffect(() => {
    const code = selectedStateObj?.code || currentState || "29";
    fetchDistrictsForState(code);
  }, [selectedStateObj, currentState, fetchDistrictsForState]);

  // Find district code for current selected district
  const selectedDistrictObj = useMemo(() => {
    if (!currentDistrict || !districts.length) return null;
    return (
      districts.find(
        (d) => d.name?.toLowerCase() === String(currentDistrict).toLowerCase()
      ) || null
    );
  }, [districts, currentDistrict]);

  // 3. Fetch Subdistricts / Taluks whenever District changes
  useEffect(() => {
    if (!selectedDistrictObj?.code) {
      setSubdistricts([]);
      return;
    }
    let active = true;
    setLoadingSubdistricts(true);
    locationService
      .getSubdistricts(selectedDistrictObj.code)
      .then((data) => {
        if (!active) return;
        const list = Array.isArray(data) ? data : data?.data || [];
        setSubdistricts(list);
      })
      .catch(() => {
        if (active) setSubdistricts([]);
      })
      .finally(() => {
        if (active) setLoadingSubdistricts(false);
      });

    return () => {
      active = false;
    };
  }, [selectedDistrictObj]);

  // 4. Debounced Global Search (e.g. for "kumta", "ramgarh", "indiranagar")
  useEffect(() => {
    const q = searchQuery.trim();
    if (q.length < 2) {
      setSearchResults([]);
      setSearching(false);
      return;
    }

    const timer = setTimeout(async () => {
      setSearching(true);
      try {
        const res = await locationService.search(q);
        const data = res?.data || res;
        const resObj = data?.results || {};

        const items = [];
        // Extract districts
        (resObj.districts || []).forEach((d) => {
          items.push({
            id: `district-${d.code}`,
            type: "District",
            name: d.name,
            stateCode: d.state_code,
            districtCode: d.code,
            displayName: `${d.name} (District)`,
          });
        });
        // Extract subdistricts
        (resObj.subdistricts || []).forEach((s) => {
          items.push({
            id: `subdistrict-${s.code}`,
            type: "Taluk / City",
            name: s.name,
            stateCode: s.state_code,
            districtCode: s.district_code,
            displayName: `${s.name} (Taluk / City)`,
          });
        });
        // Extract blocks
        (resObj.blocks || []).forEach((b) => {
          items.push({
            id: `block-${b.code}`,
            type: "Block",
            name: b.name,
            stateCode: b.state_code,
            districtCode: b.district_code,
            displayName: `${b.name} (Block)`,
          });
        });

        setSearchResults(items.slice(0, 15));
      } catch (err) {
        console.warn("Search error:", err);
      } finally {
        setSearching(false);
      }
    }, 350);

    return () => clearTimeout(timer);
  }, [searchQuery]);

  // Handler for universal search selection
  const handleSelectSearchResult = (item) => {
    if (!item) return;

    // Find state name from state code
    if (item.stateCode) {
      const matchState = states.find((s) => String(s.code) === String(item.stateCode));
      if (matchState && setValue) {
        setValue(stateFieldName, matchState.name, { shouldValidate: true, shouldDirty: true });
      }
    }

    if (item.type === "District") {
      if (setValue) {
        setValue(districtFieldName, item.name, { shouldValidate: true, shouldDirty: true });
        setValue(cityFieldName, "", { shouldValidate: true, shouldDirty: true });
      }
    } else {
      // Sub-district or city: set city and find district
      if (setValue) {
        setValue(cityFieldName, item.name, { shouldValidate: true, shouldDirty: true });
      }
      // If district code is provided, fetch district name
      if (item.districtCode) {
        const matchDistrict = districts.find((d) => String(d.code) === String(item.districtCode));
        if (matchDistrict && setValue) {
          setValue(districtFieldName, matchDistrict.name, { shouldValidate: true, shouldDirty: true });
        }
      }
    }

    setSearchQuery("");
    setSearchResults([]);
  };

  const handleCityChipClick = (cityName) => {
    if (!setValue) return;
    setValue(cityFieldName, cityName, {
      shouldValidate: true,
      shouldDirty: true,
    });
  };

  return (
    <Stack spacing={2.5}>
      {/* ── Quick Universal Location Search ── */}
      <Box
        sx={{
          p: 2,
          borderRadius: "14px",
          bgcolor: "#F8FAFC",
          border: `1px dashed ${UI.border}`,
        }}
      >
        <Stack direction="row" spacing={1} alignItems="center" sx={{ mb: 1 }}>
          <SearchRoundedIcon sx={{ fontSize: 18, color: UI.primary }} />
          <Typography sx={{ fontSize: "0.82rem", fontWeight: 700, color: UI.text }}>
            Search Instant Location (Autofills State, District & City)
          </Typography>
        </Stack>

        <Autocomplete
          freeSolo
          options={searchResults}
          getOptionLabel={(opt) => (typeof opt === "string" ? opt : opt.displayName || opt.name || "")}
          inputValue={searchQuery}
          onInputChange={(_, value) => setSearchQuery(value)}
          onChange={(_, selected) => {
            if (selected && typeof selected === "object") {
              handleSelectSearchResult(selected);
            }
          }}
          loading={searching}
          renderInput={(params) => (
            <TextField
              {...params}
              size="small"
              placeholder="Type to search any city, town, taluk or district across India (e.g. Kumta, Indiranagar, Udupi)..."
              InputProps={{
                ...params.InputProps,
                startAdornment: (
                  <InputAdornment position="start">
                    <PlaceRoundedIcon sx={{ fontSize: 18, color: UI.muted }} />
                  </InputAdornment>
                ),
                endAdornment: (
                  <>
                    {searching ? <CircularProgress color="inherit" size={18} /> : null}
                    {params.InputProps.endAdornment}
                  </>
                ),
              }}
              sx={{
                bgcolor: "#fff",
                "& .MuiOutlinedInput-root": {
                  borderRadius: "10px",
                  fontSize: "0.86rem",
                },
              }}
            />
          )}
          renderOption={(props, option) => (
            <Box
              component="li"
              {...props}
              key={option.id || option.name}
              sx={{
                fontSize: "0.86rem",
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                py: 1,
              }}
            >
              <Stack direction="row" spacing={1.2} alignItems="center">
                <LocationCityRoundedIcon sx={{ fontSize: 18, color: UI.primary }} />
                <Typography sx={{ fontWeight: 600, fontSize: "0.86rem" }}>
                  {option.name}
                </Typography>
              </Stack>
              <Chip
                label={option.type}
                size="small"
                sx={{
                  height: 20,
                  fontSize: "0.7rem",
                  fontWeight: 700,
                  bgcolor: UI.primarySoft,
                  color: UI.primary,
                }}
              />
            </Box>
          )}
        />
      </Box>

      {/* ── Dropdowns Grid (State, District, City / Taluk) ── */}
      <Grid container spacing={2}>
        {/* State Dropdown */}
        {showState && (
          <Grid size={{ xs: 12, sm: 6, md: 4 }}>
            <Controller
              name={stateFieldName}
              control={control}
              rules={{ required: "State is required" }}
              render={({ field, fieldState }) => (
                <Autocomplete
                  freeSolo
                  options={states.map((s) => s.name)}
                  value={field.value || "Karnataka"}
                  loading={loadingStates}
                  onChange={(_, newValue) => {
                    field.onChange(newValue || "");
                    // Clear district and city when state changes
                    if (setValue && newValue !== field.value) {
                      setValue(districtFieldName, "", { shouldValidate: true });
                      setValue(cityFieldName, "", { shouldValidate: true });
                    }
                  }}
                  onInputChange={(_, newInputValue) => {
                    field.onChange(newInputValue);
                  }}
                  renderInput={(params) => (
                    <TextField
                      {...params}
                      label="State *"
                      placeholder="Select or type State"
                      error={!!fieldState.error}
                      helperText={fieldState.error?.message || " "}
                      InputProps={{
                        ...params.InputProps,
                        startAdornment: (
                          <InputAdornment position="start">
                            <MapRoundedIcon sx={{ fontSize: 20, color: UI.muted }} />
                          </InputAdornment>
                        ),
                        endAdornment: (
                          <>
                            {loadingStates ? <CircularProgress color="inherit" size={18} /> : null}
                            {params.InputProps.endAdornment}
                          </>
                        ),
                      }}
                      sx={{
                        "& .MuiOutlinedInput-root": {
                          borderRadius: "12px",
                          minHeight: "54px",
                        },
                      }}
                    />
                  )}
                />
              )}
            />
          </Grid>
        )}

        {/* District Dropdown */}
        <Grid size={{ xs: 12, sm: showState ? 6 : 6, md: 4 }}>
          <Controller
            name={districtFieldName}
            control={control}
            rules={districtRequired ? { required: "District is required" } : undefined}
            render={({ field, fieldState }) => (
              <Autocomplete
                freeSolo
                options={districts.map((d) => d.name)}
                value={field.value || ""}
                loading={loadingDistricts}
                onChange={(_, newValue) => {
                  field.onChange(newValue || "");
                  // Clear city when district changes
                  if (setValue && newValue !== field.value) {
                    setValue(cityFieldName, "", { shouldValidate: true });
                  }
                }}
                onInputChange={(_, newInputValue) => {
                  field.onChange(newInputValue);
                }}
                renderInput={(params) => (
                  <TextField
                    {...params}
                    label="District *"
                    placeholder="Search or pick District"
                    error={!!fieldState.error}
                    helperText={
                      fieldState.error?.message ||
                      (districts.length > 0
                        ? `${districts.length} official districts in ${currentState}`
                        : " ")
                    }
                    InputProps={{
                      ...params.InputProps,
                      startAdornment: (
                        <InputAdornment position="start">
                          <LocationCityRoundedIcon sx={{ fontSize: 20, color: UI.primary }} />
                        </InputAdornment>
                      ),
                      endAdornment: (
                        <>
                          {loadingDistricts ? <CircularProgress color="inherit" size={18} /> : null}
                          {params.InputProps.endAdornment}
                        </>
                      ),
                    }}
                    sx={{
                      "& .MuiOutlinedInput-root": {
                        borderRadius: "12px",
                        minHeight: "54px",
                      },
                    }}
                  />
                )}
              />
            )}
          />
        </Grid>

        {/* City / Town / Taluk Dropdown */}
        <Grid size={{ xs: 12, sm: 12, md: 4 }}>
          <Controller
            name={cityFieldName}
            control={control}
            rules={cityRequired ? { required: "City / Taluk is required" } : undefined}
            render={({ field, fieldState }) => (
              <Autocomplete
                freeSolo
                options={subdistricts.map((s) => s.name)}
                value={field.value || ""}
                loading={loadingSubdistricts}
                onChange={(_, newValue) => {
                  field.onChange(newValue || "");
                }}
                onInputChange={(_, newInputValue) => {
                  field.onChange(newInputValue);
                }}
                renderInput={(params) => (
                  <TextField
                    {...params}
                    label="City / Town / Taluk *"
                    placeholder={
                      currentDistrict
                        ? "Pick from list or enter City"
                        : "Select District first or type city"
                    }
                    error={!!fieldState.error}
                    helperText={
                      fieldState.error?.message ||
                      (subdistricts.length > 0
                        ? `${subdistricts.length} cities/taluks in ${currentDistrict}`
                        : currentDistrict
                        ? "Pick from list or type city name"
                        : "Select district to see cities")
                    }
                    InputProps={{
                      ...params.InputProps,
                      startAdornment: (
                        <InputAdornment position="start">
                          <PlaceRoundedIcon sx={{ fontSize: 20, color: UI.primary }} />
                        </InputAdornment>
                      ),
                      endAdornment: (
                        <>
                          {loadingSubdistricts ? <CircularProgress color="inherit" size={18} /> : null}
                          {params.InputProps.endAdornment}
                        </>
                      ),
                    }}
                    sx={{
                      "& .MuiOutlinedInput-root": {
                        borderRadius: "12px",
                        minHeight: "54px",
                      },
                    }}
                  />
                )}
              />
            )}
          />
        </Grid>

        {/* Subdistricts / Taluks quick chips (If available for selected district) */}
        {subdistricts.length > 0 && (
          <Grid size={{ xs: 12 }}>
            <Box
              sx={{
                p: 1.5,
                bgcolor: "#F8FAFC",
                borderRadius: "10px",
                border: `1px solid ${UI.border}`,
              }}
            >
              <Typography sx={{ fontSize: "0.75rem", fontWeight: 700, color: UI.muted, mb: 1 }}>
                Popular Cities / Taluks in {currentDistrict || "Selected District"} (Click to select City):
              </Typography>
              <Stack direction="row" spacing={1} flexWrap="wrap" sx={{ gap: 0.8 }}>
                {subdistricts.map((sub) => {
                  const isSelected =
                    String(currentCity || "").trim().toLowerCase() === sub.name.toLowerCase();
                  return (
                    <Chip
                      key={sub.code}
                      label={sub.name}
                      size="small"
                      onClick={() => handleCityChipClick(sub.name)}
                      clickable
                      sx={{
                        fontSize: "0.76rem",
                        fontWeight: 600,
                        bgcolor: isSelected ? UI.primary : "#fff",
                        color: isSelected ? "#fff" : UI.text,
                        border: `1px solid ${isSelected ? UI.primary : UI.border}`,
                        "&:hover": {
                          bgcolor: isSelected ? UI.primary : UI.primarySoft,
                          borderColor: UI.primary,
                          color: isSelected ? "#fff" : UI.primary,
                        },
                      }}
                    />
                  );
                })}
              </Stack>
            </Box>
          </Grid>
        )}

        {/* Local Address Input */}
        <Grid size={{ xs: 12 }}>
          <Controller
            name={localAddressFieldName}
            control={control}
            rules={localAddressRequired ? { required: "Local address / area is required" } : undefined}
            render={({ field, fieldState }) => (
              <TextField
                {...field}
                fullWidth
                label="Local Address / Area / Street / Landmark *"
                placeholder="e.g. 100ft Road, Near Bus Stand, Landmark"
                error={!!fieldState.error}
                helperText={fieldState.error?.message || "Enter street name, building, floor, or nearby landmark"}
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <PlaceRoundedIcon sx={{ fontSize: 20, color: UI.muted }} />
                    </InputAdornment>
                  ),
                }}
                sx={{
                  "& .MuiOutlinedInput-root": {
                    borderRadius: "12px",
                    minHeight: "54px",
                  },
                }}
              />
            )}
          />
        </Grid>
      </Grid>
    </Stack>
  );
}
