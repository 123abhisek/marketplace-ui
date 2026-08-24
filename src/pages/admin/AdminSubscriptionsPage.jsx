// src/pages/admin/AdminSubscriptionsPage.jsx
import React, { useCallback, useEffect, useMemo, useState } from "react";
import {
  Alert,
  Avatar,
  Box,
  Button,
  Card,
  CardContent,
  Chip,
  CircularProgress,
  Divider,
  Grid,
  IconButton,
  InputAdornment,
  LinearProgress,
  MenuItem,
  Paper,
  Select,
  Snackbar,
  Stack,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  TextField,
  Tooltip,
  Typography,
} from "@mui/material";
import WorkspacePremiumRoundedIcon from "@mui/icons-material/WorkspacePremiumRounded";
import CurrencyRupeeRoundedIcon from "@mui/icons-material/CurrencyRupeeRounded";
import PeopleAltRoundedIcon from "@mui/icons-material/PeopleAltRounded";
import CalendarMonthRoundedIcon from "@mui/icons-material/CalendarMonthRounded";
import SearchRoundedIcon from "@mui/icons-material/SearchRounded";
import DownloadRoundedIcon from "@mui/icons-material/DownloadRounded";
import RefreshRoundedIcon from "@mui/icons-material/RefreshRounded";
import ContentCopyRoundedIcon from "@mui/icons-material/ContentCopyRounded";
import CheckCircleRoundedIcon from "@mui/icons-material/CheckCircleRounded";
import AccessTimeRoundedIcon from "@mui/icons-material/AccessTimeRounded";
import adminOrdersService from "../../services/adminOrdersApi";

const cardSx = {
  borderRadius: "20px",
  border: "1px solid rgba(15,23,42,0.08)",
  boxShadow: "0 10px 30px rgba(15,23,42,0.04)",
  background: "#fff",
};

export default function AdminSubscriptionsPage() {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [exporting, setExporting] = useState(false);
  const [error, setError] = useState("");
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [toast, setToast] = useState({ open: false, message: "", severity: "success" });

  const fetchSubscriptions = useCallback(async () => {
    setLoading(true);
    setError("");
    try {
      const res = await adminOrdersService.getPremiumSubscriptions();
      const responseData = res?.data ?? res;
      setData(responseData);
    } catch (err) {
      console.error("Error fetching premium subscriptions:", err);
      setError("Failed to load premium subscriptions. Please check backend connection.");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchSubscriptions();
  }, [fetchSubscriptions]);

  const summary = data?.summary || {
    total_revenue: 0,
    total_subscribers: 0,
    total_subscriptions: 0,
    avg_plan_months: 12,
  };

  const subscriptionsList = data?.subscriptions || [];

  const filteredSubscriptions = useMemo(() => {
    return subscriptionsList.filter((item) => {
      const u = item.user || {};
      const matchSearch =
        !searchQuery ||
        (u.name && u.name.toLowerCase().includes(searchQuery.toLowerCase())) ||
        (u.email && u.email.toLowerCase().includes(searchQuery.toLowerCase())) ||
        (u.phone && u.phone.includes(searchQuery)) ||
        (item.razorpay_payment_id && item.razorpay_payment_id.toLowerCase().includes(searchQuery.toLowerCase())) ||
        (item.id && item.id.toLowerCase().includes(searchQuery.toLowerCase()));

      const matchStatus =
        statusFilter === "all" ||
        (statusFilter === "active" && item.is_active) ||
        (statusFilter === "expired" && !item.is_active);

      return matchSearch && matchStatus;
    });
  }, [subscriptionsList, searchQuery, statusFilter]);

  const handleExportExcel = async () => {
    try {
      setExporting(true);
      const res = await adminOrdersService.exportPremiumSubscriptions();
      const blob =
        res instanceof Blob
          ? res
          : new Blob([res?.data ?? res], {
              type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
            });
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.href = url;
      link.download = `EasyDeal_Premium_Subscriptions_${new Date().toISOString().slice(0, 10)}.xlsx`;
      document.body.appendChild(link);
      link.click();
      link.remove();
      window.URL.revokeObjectURL(url);
      setToast({ open: true, message: "Premium subscriptions Excel file exported successfully!", severity: "success" });
    } catch (err) {
      console.error("Export premium subscriptions error:", err);
      setToast({ open: true, message: "Failed to export subscriptions data.", severity: "error" });
    } finally {
      setExporting(false);
    }
  };


  const copyToClipboard = (text) => {
    if (!text || text === "—") return;
    navigator.clipboard.writeText(text);
    setToast({ open: true, message: `Copied "${text}" to clipboard`, severity: "info" });
  };

  return (
    <Box sx={{ p: { xs: 2, md: 3.5 }, background: "#f8fafc", minHeight: "100vh" }}>
      <Box sx={{ maxWidth: 1600, mx: "auto" }}>
        <Stack spacing={3}>
          {/* Header */}
          <Stack
            direction={{ xs: "column", sm: "row" }}
            justifyContent="space-between"
            alignItems={{ sm: "center" }}
            gap={2}
          >
            <Box>
              <Stack direction="row" alignItems="center" spacing={1.5}>
                <Box
                  sx={{
                    width: 44,
                    height: 44,
                    borderRadius: "14px",
                    background: "linear-gradient(135deg, #0F766E 0%, #14B8A6 100%)",
                    display: "grid",
                    placeItems: "center",
                    color: "#FFFFFF",
                    boxShadow: "0 4px 14px rgba(15, 118, 110, 0.25)",
                  }}
                >
                  <WorkspacePremiumRoundedIcon fontSize="medium" />
                </Box>
                <Box>
                  <Typography sx={{ fontSize: "1.7rem", fontWeight: 900, color: "#0f172a" }}>
                    Premium Subscriptions
                  </Typography>
                  <Typography sx={{ fontSize: "0.88rem", color: "#64748b", mt: 0.2 }}>
                    Manage paid premium memberships, subscription durations, and revenue tracking
                  </Typography>
                </Box>
              </Stack>
            </Box>

            <Stack direction="row" spacing={1.5} alignItems="center">
              <Button
                variant="outlined"
                startIcon={<RefreshRoundedIcon />}
                onClick={fetchSubscriptions}
                disabled={loading}
                sx={{
                  borderRadius: "12px",
                  textTransform: "none",
                  fontWeight: 700,
                  borderColor: "rgba(15,23,42,0.15)",
                  color: "#0f172a",
                }}
              >
                Refresh
              </Button>
              <Button
                variant="contained"
                startIcon={exporting ? <CircularProgress size={16} color="inherit" /> : <DownloadRoundedIcon />}
                onClick={handleExportExcel}
                disabled={exporting}
                sx={{
                  borderRadius: "12px",
                  textTransform: "none",
                  fontWeight: 800,
                  bgcolor: "#0f766e",
                  "&:hover": { bgcolor: "#0b5f59" },
                }}
              >
                {exporting ? "Exporting..." : "Export Excel"}
              </Button>
            </Stack>
          </Stack>

          {error && <Alert severity="error" sx={{ borderRadius: "14px" }}>{error}</Alert>}
          {loading && <LinearProgress sx={{ borderRadius: 4 }} />}

          {/* 4 Summary Revenue & Subscriber Cards */}
          <Grid container spacing={2.5}>
            {/* Card 1: Overall Revenue */}
            <Grid item xs={12} sm={6} lg={3}>
              <Card
                sx={{
                  ...cardSx,
                  background: "linear-gradient(135deg, #064E3B 0%, #0F766E 100%)",
                  color: "#FFFFFF",
                }}
              >
                <CardContent sx={{ p: 2.8 }}>
                  <Stack direction="row" justifyContent="space-between" alignItems="flex-start">
                    <Box>
                      <Typography sx={{ fontSize: "0.82rem", color: "rgba(255,255,255,0.8)", fontWeight: 700 }}>
                        Overall Premium Revenue
                      </Typography>
                      <Typography sx={{ fontSize: "1.85rem", fontWeight: 900, mt: 0.8, color: "#FFFFFF" }}>
                        ₹{Number(summary.total_revenue).toLocaleString("en-IN")}
                      </Typography>
                      <Typography sx={{ fontSize: "0.75rem", color: "#A7F3D0", mt: 0.5, fontWeight: 700 }}>
                        All-time subscription payments
                      </Typography>
                    </Box>
                    <Box
                      sx={{
                        width: 44,
                        height: 44,
                        borderRadius: "12px",
                        background: "rgba(255, 255, 255, 0.15)",
                        display: "grid",
                        placeItems: "center",
                        color: "#FFFFFF",
                      }}
                    >
                      <CurrencyRupeeRoundedIcon />
                    </Box>
                  </Stack>
                </CardContent>
              </Card>
            </Grid>

            {/* Card 2: Active Subscribers */}
            <Grid item xs={12} sm={6} lg={3}>
              <Card sx={cardSx}>
                <CardContent sx={{ p: 2.8 }}>
                  <Stack direction="row" justifyContent="space-between" alignItems="flex-start">
                    <Box>
                      <Typography sx={{ fontSize: "0.82rem", color: "#64748b", fontWeight: 700 }}>
                        Active Premium Users
                      </Typography>
                      <Typography sx={{ fontSize: "1.85rem", fontWeight: 900, mt: 0.8, color: "#0f172a" }}>
                        {summary.total_subscribers}
                      </Typography>
                      <Typography sx={{ fontSize: "0.75rem", color: "#10B981", mt: 0.5, fontWeight: 700 }}>
                        Currently active & live access
                      </Typography>
                    </Box>
                    <Box
                      sx={{
                        width: 44,
                        height: 44,
                        borderRadius: "12px",
                        background: "rgba(16, 185, 129, 0.1)",
                        display: "grid",
                        placeItems: "center",
                        color: "#10B981",
                      }}
                    >
                      <WorkspacePremiumRoundedIcon />
                    </Box>
                  </Stack>
                </CardContent>
              </Card>
            </Grid>

            {/* Card 3: Total Subscriptions */}
            <Grid item xs={12} sm={6} lg={3}>
              <Card sx={cardSx}>
                <CardContent sx={{ p: 2.8 }}>
                  <Stack direction="row" justifyContent="space-between" alignItems="flex-start">
                    <Box>
                      <Typography sx={{ fontSize: "0.82rem", color: "#64748b", fontWeight: 700 }}>
                        Total Upgrade Orders
                      </Typography>
                      <Typography sx={{ fontSize: "1.85rem", fontWeight: 900, mt: 0.8, color: "#0f172a" }}>
                        {summary.total_subscriptions}
                      </Typography>
                      <Typography sx={{ fontSize: "0.75rem", color: "#6366F1", mt: 0.5, fontWeight: 700 }}>
                        Completed upgrades
                      </Typography>
                    </Box>
                    <Box
                      sx={{
                        width: 44,
                        height: 44,
                        borderRadius: "12px",
                        background: "rgba(99, 102, 241, 0.1)",
                        display: "grid",
                        placeItems: "center",
                        color: "#6366F1",
                      }}
                    >
                      <PeopleAltRoundedIcon />
                    </Box>
                  </Stack>
                </CardContent>
              </Card>
            </Grid>

            {/* Card 4: Standard Plan Months */}
            <Grid item xs={12} sm={6} lg={3}>
              <Card sx={cardSx}>
                <CardContent sx={{ p: 2.8 }}>
                  <Stack direction="row" justifyContent="space-between" alignItems="flex-start">
                    <Box>
                      <Typography sx={{ fontSize: "0.82rem", color: "#64748b", fontWeight: 700 }}>
                        Plan Duration
                      </Typography>
                      <Typography sx={{ fontSize: "1.85rem", fontWeight: 900, mt: 0.8, color: "#0f172a" }}>
                        12 Months
                      </Typography>
                      <Typography sx={{ fontSize: "0.75rem", color: "#F59E0B", mt: 0.5, fontWeight: 700 }}>
                        Annual VIP membership
                      </Typography>
                    </Box>
                    <Box
                      sx={{
                        width: 44,
                        height: 44,
                        borderRadius: "12px",
                        background: "rgba(245, 158, 11, 0.1)",
                        display: "grid",
                        placeItems: "center",
                        color: "#F59E0B",
                      }}
                    >
                      <CalendarMonthRoundedIcon />
                    </Box>
                  </Stack>
                </CardContent>
              </Card>
            </Grid>
          </Grid>

          {/* Search and Filters */}
          <Card sx={cardSx}>
            <CardContent sx={{ p: 2.5 }}>
              <Grid container spacing={2} alignItems="center">
                <Grid item xs={12} md={7} lg={8}>
                  <TextField
                    fullWidth
                    size="small"
                    placeholder="Search by user name, email, phone, or payment ID..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    InputProps={{
                      startAdornment: (
                        <InputAdornment position="start">
                          <SearchRoundedIcon sx={{ color: "#64748b" }} />
                        </InputAdornment>
                      ),
                      sx: { borderRadius: "12px", background: "#f8fafc" },
                    }}
                  />
                </Grid>
                <Grid item xs={12} sm={6} md={3} lg={2.5}>
                  <Select
                    fullWidth
                    size="small"
                    value={statusFilter}
                    onChange={(e) => setStatusFilter(e.target.value)}
                    sx={{ borderRadius: "12px", background: "#f8fafc" }}
                  >
                    <MenuItem value="all">All Statuses</MenuItem>
                    <MenuItem value="active">Active Only</MenuItem>
                    <MenuItem value="expired">Expired Only</MenuItem>
                  </Select>
                </Grid>
                <Grid item xs={12} sm={6} md={2} lg={1.5}>
                  <Typography sx={{ fontSize: "0.82rem", color: "#64748b", fontWeight: 700, textAlign: { md: "right" } }}>
                    {filteredSubscriptions.length} record{filteredSubscriptions.length === 1 ? "" : "s"}
                  </Typography>
                </Grid>
              </Grid>
            </CardContent>
          </Card>

          {/* Subscriptions Table */}
          <Card sx={cardSx}>
            <CardContent sx={{ p: 0 }}>
              <TableContainer>
                <Table>
                  <TableHead>
                    <TableRow sx={{ "& th": { fontWeight: 850, fontSize: "0.82rem", color: "#475569", bgcolor: "#F8FAFC", py: 1.8 } }}>
                      <TableCell>Premium User</TableCell>
                      <TableCell align="right">Amount Subscribed</TableCell>
                      <TableCell align="center">Duration</TableCell>
                      <TableCell>Upgrade Date</TableCell>
                      <TableCell>Expiry Date</TableCell>
                      <TableCell>Payment Reference</TableCell>
                      <TableCell align="center">Status</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {filteredSubscriptions.length === 0 ? (
                      <TableRow>
                        <TableCell colSpan={7} align="center" sx={{ py: 6 }}>
                          <Box sx={{ maxWidth: 360, mx: "auto", textAlign: "center" }}>
                            <WorkspacePremiumRoundedIcon sx={{ fontSize: 48, color: "#94a3b8", mb: 1 }} />
                            <Typography sx={{ fontWeight: 800, color: "#0f172a", fontSize: "1rem" }}>
                              No premium users found
                            </Typography>
                            <Typography sx={{ color: "#64748b", fontSize: "0.82rem", mt: 0.5 }}>
                              {searchQuery || statusFilter !== "all"
                                ? "Try adjusting your search query or filter."
                                : "No paid premium subscription upgrades recorded yet."}
                            </Typography>
                          </Box>
                        </TableCell>
                      </TableRow>
                    ) : (
                      filteredSubscriptions.map((row) => {
                        const u = row.user || {};
                        const startsDate = row.starts_at ? new Date(row.starts_at).toLocaleDateString("en-IN", { day: "2-digit", month: "short", year: "numeric" }) : "—";
                        const expiresDate = row.expires_at ? new Date(row.expires_at).toLocaleDateString("en-IN", { day: "2-digit", month: "short", year: "numeric" }) : "Never / Active";

                        return (
                          <TableRow key={row.id} hover sx={{ "& td": { fontSize: "0.85rem", py: 1.8 } }}>
                            {/* Premium User */}
                            <TableCell>
                              <Stack direction="row" spacing={1.5} alignItems="center">
                                <Avatar
                                  sx={{
                                    bgcolor: "#0f766e",
                                    width: 38,
                                    height: 38,
                                    fontSize: "0.9rem",
                                    fontWeight: 800,
                                  }}
                                >
                                  {u.name ? u.name.charAt(0).toUpperCase() : "U"}
                                </Avatar>
                                <Box>
                                  <Stack direction="row" spacing={0.8} alignItems="center">
                                    <Typography sx={{ fontWeight: 800, color: "#0f172a" }}>
                                      {u.name || "Unknown Member"}
                                    </Typography>
                                    <Chip
                                      size="small"
                                      label="PRO"
                                      sx={{
                                        height: 18,
                                        fontSize: "0.65rem",
                                        fontWeight: 900,
                                        bgcolor: "#FEF3C7",
                                        color: "#B45309",
                                      }}
                                    />
                                  </Stack>
                                  <Typography sx={{ fontSize: "0.78rem", color: "#64748b" }}>
                                    {u.email || u.phone || "—"}
                                  </Typography>
                                  {u.phone && u.email && (
                                    <Typography sx={{ fontSize: "0.74rem", color: "#94a3b8" }}>
                                      {u.phone}
                                    </Typography>
                                  )}
                                </Box>
                              </Stack>
                            </TableCell>

                            {/* Amount Subscribed */}
                            <TableCell align="right">
                              <Typography sx={{ fontWeight: 900, color: "#0f766e", fontSize: "0.95rem" }}>
                                ₹{Number(row.amount).toLocaleString("en-IN")}
                              </Typography>
                              <Typography sx={{ fontSize: "0.72rem", color: "#64748b" }}>
                                {row.plan_months === 12 ? "₹299 + ₹18 GST" : "Incl. all taxes"}
                              </Typography>
                            </TableCell>

                            {/* Duration in Months */}
                            <TableCell align="center">
                              <Chip
                                icon={<CalendarMonthRoundedIcon style={{ fontSize: 14 }} />}
                                label={`${row.plan_months || 12} Months`}
                                size="small"
                                sx={{
                                  fontWeight: 800,
                                  fontSize: "0.78rem",
                                  bgcolor: "#EEF2FF",
                                  color: "#4338CA",
                                  borderRadius: "8px",
                                }}
                              />
                            </TableCell>

                            {/* Upgrade Date */}
                            <TableCell>
                              <Typography sx={{ fontWeight: 700, color: "#334155" }}>
                                {startsDate}
                              </Typography>
                              <Typography sx={{ fontSize: "0.72rem", color: "#94a3b8" }}>
                                Activated
                              </Typography>
                            </TableCell>

                            {/* Expiry Date */}
                            <TableCell>
                              <Typography sx={{ fontWeight: 700, color: "#334155" }}>
                                {expiresDate}
                              </Typography>
                              <Typography sx={{ fontSize: "0.72rem", color: "#94a3b8" }}>
                                {row.is_active ? "Live VIP Access" : "Expired"}
                              </Typography>
                            </TableCell>

                            {/* Payment Reference */}
                            <TableCell>
                              <Stack spacing={0.4}>
                                <Stack direction="row" spacing={0.5} alignItems="center">
                                  <Typography
                                    sx={{
                                      fontFamily: "monospace",
                                      fontSize: "0.75rem",
                                      fontWeight: 700,
                                      color: "#0f172a",
                                    }}
                                  >
                                    {row.razorpay_payment_id}
                                  </Typography>
                                  {row.razorpay_payment_id && row.razorpay_payment_id !== "—" && (
                                    <Tooltip title="Copy Payment ID">
                                      <IconButton
                                        size="small"
                                        onClick={() => copyToClipboard(row.razorpay_payment_id)}
                                        sx={{ p: 0.3 }}
                                      >
                                        <ContentCopyRoundedIcon sx={{ fontSize: 13, color: "#64748b" }} />
                                      </IconButton>
                                    </Tooltip>
                                  )}
                                </Stack>
                                {row.razorpay_order_id && row.razorpay_order_id !== "—" && (
                                  <Typography sx={{ fontFamily: "monospace", fontSize: "0.7rem", color: "#94a3b8" }}>
                                    {row.razorpay_order_id}
                                  </Typography>
                                )}
                              </Stack>
                            </TableCell>

                            {/* Status */}
                            <TableCell align="center">
                              <Chip
                                size="small"
                                icon={row.is_active ? <CheckCircleRoundedIcon style={{ fontSize: 14 }} /> : <AccessTimeRoundedIcon style={{ fontSize: 14 }} />}
                                label={row.is_active ? "Active" : "Expired"}
                                sx={{
                                  fontWeight: 900,
                                  fontSize: "0.74rem",
                                  bgcolor: row.is_active ? "#DCFCE7" : "#F1F5F9",
                                  color: row.is_active ? "#166534" : "#64748B",
                                  borderRadius: "8px",
                                }}
                              />
                            </TableCell>
                          </TableRow>
                        );
                      })
                    )}
                  </TableBody>
                </Table>
              </TableContainer>
            </CardContent>
          </Card>
        </Stack>
      </Box>

      <Snackbar
        open={toast.open}
        autoHideDuration={4000}
        onClose={() => setToast({ ...toast, open: false })}
        anchorOrigin={{ vertical: "bottom", horizontal: "right" }}
      >
        <Alert severity={toast.severity} onClose={() => setToast({ ...toast, open: false })}>
          {toast.message}
        </Alert>
      </Snackbar>
    </Box>
  );
}
