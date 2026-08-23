// src/components/analytics/ReportFilters.jsx
import React from "react";
import {
  Box,
  Button,
  ButtonGroup,
  Card,
  CardContent,
  FormControl,
  IconButton,
  InputAdornment,
  MenuItem,
  Select,
  Stack,
  TextField,
  Tooltip,
  Typography,
} from "@mui/material";
import SearchRoundedIcon from "@mui/icons-material/SearchRounded";
import RefreshRoundedIcon from "@mui/icons-material/RefreshRounded";
import DownloadRoundedIcon from "@mui/icons-material/DownloadRounded";
import PrintRoundedIcon from "@mui/icons-material/PrintRounded";
import DateRangeRoundedIcon from "@mui/icons-material/DateRangeRounded";
import FilterAltRoundedIcon from "@mui/icons-material/FilterAltRounded";
import { BI_COLORS } from "./analyticsData";

export const DATE_RANGES = [
  "Today",
  "Yesterday",
  "Last 7 Days",
  "Last 30 Days",
  "This Month",
  "Last Month",
  "This Year",
  "Custom Range",
];

export const TIME_AGGREGATIONS = [
  "Daily",
  "Weekly",
  "Monthly",
  "Quarterly",
  "Yearly",
];

export default function ReportFilters({
  title = "Analytics & Reports",
  subtitle = "Power BI Enterprise Marketplace Intelligence",
  dateRange,
  setDateRange,
  category,
  setCategory,
  aggregation,
  setAggregation,
  searchQuery,
  setSearchQuery,
  onRefresh,
  onExport,
  loading = false,
}) {
  return (
    <Card
      sx={{
        borderRadius: "20px",
        border: `1px solid ${BI_COLORS.border}`,
        boxShadow: "0 4px 20px rgba(15, 23, 42, 0.04)",
        background: "#FFFFFF",
      }}
    >
      <CardContent sx={{ p: { xs: 2, md: 2.5 } }}>
        <Stack spacing={2}>
          {/* Top Bar: Title & Primary Actions */}
          <Stack
            direction={{ xs: "column", md: "row" }}
            justifyContent="space-between"
            alignItems={{ md: "center" }}
            gap={2}
          >
            <Box>
              <Typography sx={{ color: BI_COLORS.navy, fontSize: { xs: "1.4rem", md: "1.75rem" }, fontWeight: 950, letterSpacing: "-0.03em" }}>
                {title}
              </Typography>
              <Typography sx={{ color: BI_COLORS.neutral, fontSize: "0.82rem", mt: 0.2 }}>
                {subtitle}
              </Typography>
            </Box>

            <Stack direction="row" spacing={1} flexWrap="wrap">
              <Tooltip title="Refresh Data">
                <Button
                  variant="outlined"
                  onClick={onRefresh}
                  disabled={loading}
                  startIcon={<RefreshRoundedIcon />}
                  sx={{
                    borderRadius: "12px",
                    borderColor: BI_COLORS.border,
                    color: BI_COLORS.navy,
                    fontWeight: 800,
                    fontSize: "0.82rem",
                    textTransform: "none",
                    "&:hover": { background: "#F1F5F9" },
                  }}
                >
                  Refresh
                </Button>
              </Tooltip>

              <Button
                variant="outlined"
                onClick={() => window.print()}
                startIcon={<PrintRoundedIcon />}
                sx={{
                  borderRadius: "12px",
                  borderColor: BI_COLORS.border,
                  color: BI_COLORS.navy,
                  fontWeight: 800,
                  fontSize: "0.82rem",
                  textTransform: "none",
                  display: { xs: "none", sm: "inline-flex" },
                  "&:hover": { background: "#F1F5F9" },
                }}
              >
                Print
              </Button>

              <Button
                variant="contained"
                onClick={onExport}
                startIcon={<DownloadRoundedIcon />}
                sx={{
                  borderRadius: "12px",
                  background: "#0F766E",
                  fontWeight: 800,
                  fontSize: "0.82rem",
                  textTransform: "none",
                  boxShadow: "0 4px 14px rgba(15,118,110,0.25)",
                  "&:hover": { background: "#0D6B63" },
                }}
              >
                Export Report
              </Button>
            </Stack>
          </Stack>

          {/* Filter Toolbar */}
          <Stack
            direction={{ xs: "column", lg: "row" }}
            justifyContent="space-between"
            alignItems={{ lg: "center" }}
            spacing={1.5}
            sx={{
              pt: 1.5,
              borderTop: `1px solid ${BI_COLORS.border}`,
            }}
          >
            <Stack direction="row" spacing={1.5} flexWrap="wrap" useFlexGap alignItems="center">
              {/* Date Range Selector */}
              <FormControl size="small" sx={{ minWidth: 150 }}>
                <Select
                  value={dateRange}
                  onChange={(e) => setDateRange(e.target.value)}
                  startAdornment={
                    <InputAdornment position="start">
                      <DateRangeRoundedIcon sx={{ fontSize: 18, color: BI_COLORS.neutral }} />
                    </InputAdornment>
                  }
                  sx={{ borderRadius: "12px", fontSize: "0.84rem", fontWeight: 700, bgcolor: "#F8FAFC" }}
                >
                  {DATE_RANGES.map((r) => (
                    <MenuItem key={r} value={r} sx={{ fontSize: "0.84rem", fontWeight: 600 }}>
                      {r}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>

              {/* Category Filter */}
              <FormControl size="small" sx={{ minWidth: 140 }}>
                <Select
                  value={category}
                  onChange={(e) => setCategory(e.target.value)}
                  startAdornment={
                    <InputAdornment position="start">
                      <FilterAltRoundedIcon sx={{ fontSize: 18, color: BI_COLORS.neutral }} />
                    </InputAdornment>
                  }
                  sx={{ borderRadius: "12px", fontSize: "0.84rem", fontWeight: 700, bgcolor: "#F8FAFC" }}
                >
                  <MenuItem value="all" sx={{ fontSize: "0.84rem", fontWeight: 600 }}>All Categories</MenuItem>
                  <MenuItem value="property" sx={{ fontSize: "0.84rem", fontWeight: 600 }}>Properties Only</MenuItem>
                  <MenuItem value="vehicle" sx={{ fontSize: "0.84rem", fontWeight: 600 }}>Vehicles Only</MenuItem>
                </Select>
              </FormControl>

              {/* Aggregation Pills */}
              <ButtonGroup size="small" sx={{ borderRadius: "12px", bgcolor: "#F8FAFC", p: 0.4, border: `1px solid ${BI_COLORS.border}` }}>
                {TIME_AGGREGATIONS.map((agg) => {
                  const active = aggregation === agg;
                  return (
                    <Button
                      key={agg}
                      onClick={() => setAggregation(agg)}
                      sx={{
                        borderRadius: "8px !important",
                        border: "none !important",
                        px: 1.5,
                        py: 0.4,
                        fontSize: "0.76rem",
                        fontWeight: 800,
                        textTransform: "none",
                        color: active ? "#FFFFFF" : BI_COLORS.neutral,
                        background: active ? "#0F766E" : "transparent",
                        "&:hover": {
                          background: active ? "#0D6B63" : "rgba(0,0,0,0.04)",
                        },
                      }}
                    >
                      {agg}
                    </Button>
                  );
                })}
              </ButtonGroup>
            </Stack>

            {/* Search Box */}
            {setSearchQuery && (
              <TextField
                size="small"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search report records..."
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <SearchRoundedIcon sx={{ fontSize: 18, color: BI_COLORS.neutral }} />
                    </InputAdornment>
                  ),
                }}
                sx={{
                  width: { xs: "100%", lg: 260 },
                  "& .MuiOutlinedInput-root": { borderRadius: "12px", bgcolor: "#F8FAFC", fontSize: "0.84rem" },
                }}
              />
            )}
          </Stack>
        </Stack>
      </CardContent>
    </Card>
  );
}
