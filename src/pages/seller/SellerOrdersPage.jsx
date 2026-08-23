// src/pages/seller/SellerOrdersPage.jsx
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
import SearchRoundedIcon from "@mui/icons-material/SearchRounded";
import RefreshRoundedIcon from "@mui/icons-material/RefreshRounded";
import HomeWorkRoundedIcon from "@mui/icons-material/HomeWorkRounded";
import DirectionsCarRoundedIcon from "@mui/icons-material/DirectionsCarRounded";
import CheckCircleRoundedIcon from "@mui/icons-material/CheckCircleRounded";
import HourglassTopRoundedIcon from "@mui/icons-material/HourglassTopRounded";
import CancelRoundedIcon from "@mui/icons-material/CancelRounded";
import ReceiptLongRoundedIcon from "@mui/icons-material/ReceiptLongRounded";
import CurrencyRupeeRoundedIcon from "@mui/icons-material/CurrencyRupeeRounded";
import WhatsAppIcon from "@mui/icons-material/WhatsApp";
import PhoneRoundedIcon from "@mui/icons-material/PhoneRounded";
import EmailRoundedIcon from "@mui/icons-material/EmailRounded";
import CalendarMonthRoundedIcon from "@mui/icons-material/CalendarMonthRounded";
import InvoiceDialog from "../../components/InvoiceDialog";
import SellerOrdersService from "../../services/SellerOrdersApi";
import { getReceivedBookings } from "../../services/bookingService";

const COLORS = {
  property: "#0F766E",
  vehicle: "#2563EB",
  revenue: "#10B981",
  pending: "#F59E0B",
  cancelled: "#EF4444",
  navy: "#0F172A",
  neutral: "#64748B",
  pageBg: "#F8FAFC",
  border: "rgba(15, 23, 42, 0.08)",
};

const FILTERS = ["All", "Confirmed", "Pending", "Completed", "Cancelled"];

export default function SellerOrdersPage() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [search, setSearch] = useState("");
  const [filterStatus, setFilterStatus] = useState("All");
  const [selectedInvoice, setSelectedInvoice] = useState(null);

  const fetchOrders = useCallback(async () => {
    setLoading(true);
    setError("");
    try {
      let res = await SellerOrdersService.getSellerOrders().catch(() => null);
      if (!res || (Array.isArray(res) && res.length === 0)) {
        res = await getReceivedBookings().catch(() => null);
      }
      const list = Array.isArray(res) ? res : res?.data ?? [];
      setOrders(list);
    } catch (err) {
      console.error("Seller orders error:", err);
      setError(err?.response?.data?.detail || err?.message || "Failed to load seller orders");
      setOrders([]);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchOrders();
  }, [fetchOrders]);

  const filteredOrders = useMemo(() => {
    return orders.filter((o) => {
      const matchFilter =
        filterStatus === "All" ||
        String(o.status || "").toLowerCase() === filterStatus.toLowerCase();

      const q = search.toLowerCase();
      const matchSearch =
        !search ||
        String(o.id || "").toLowerCase().includes(q) ||
        String(o.listing_title || o.listing?.title || "").toLowerCase().includes(q) ||
        String(o.buyer?.name || "").toLowerCase().includes(q);

      return matchFilter && matchSearch;
    });
  }, [orders, filterStatus, search]);

  const stats = useMemo(() => {
    return {
      total: orders.length,
      confirmed: orders.filter((o) => String(o.status).toLowerCase() === "confirmed").length,
      pending: orders.filter((o) => String(o.status).toLowerCase() === "pending").length,
      revenue: orders.reduce((sum, o) => sum + (Number(o.amount) || 0), 0),
    };
  }, [orders]);

  return (
    <Box sx={{ minHeight: "100vh", background: COLORS.pageBg, p: { xs: 2, md: 3.5 } }}>
      <Box sx={{ maxWidth: 1600, mx: "auto" }}>
        <Stack spacing={3}>
          {/* Header */}
          <Card sx={{ borderRadius: "20px", border: `1px solid ${COLORS.border}`, boxShadow: "0 4px 20px rgba(15, 23, 42, 0.04)" }}>
            <CardContent sx={{ p: 3 }}>
              <Stack direction={{ xs: "column", md: "row" }} justifyContent="space-between" alignItems={{ md: "center" }} gap={2}>
                <Box>
                  <Typography sx={{ fontSize: { xs: "1.4rem", md: "1.75rem" }, fontWeight: 950, color: COLORS.navy, letterSpacing: "-0.03em" }}>
                    Seller Customer Inquiries & Orders
                  </Typography>
                  <Typography sx={{ fontSize: "0.82rem", color: COLORS.neutral, mt: 0.2 }}>
                    Track incoming site visit bookings and customer leads for your active listings
                  </Typography>
                </Box>
                <Button
                  variant="outlined"
                  onClick={fetchOrders}
                  startIcon={<RefreshRoundedIcon />}
                  sx={{
                    borderRadius: "12px",
                    fontWeight: 800,
                    fontSize: "0.82rem",
                    color: COLORS.navy,
                    borderColor: COLORS.border,
                    textTransform: "none",
                  }}
                >
                  Refresh Inquiries
                </Button>
              </Stack>

              {/* Stats */}
              <Grid container spacing={2} sx={{ mt: 2 }}>
                <Grid item xs={6} sm={3}>
                  <Box sx={{ p: 2, borderRadius: "14px", bgcolor: "#F8FAFC", border: `1px solid ${COLORS.border}` }}>
                    <Typography sx={{ fontSize: "0.75rem", fontWeight: 750, color: COLORS.neutral }}>TOTAL LEADS</Typography>
                    <Typography sx={{ fontSize: "1.4rem", fontWeight: 950, color: COLORS.navy }}>{stats.total}</Typography>
                  </Box>
                </Grid>
                <Grid item xs={6} sm={3}>
                  <Box sx={{ p: 2, borderRadius: "14px", bgcolor: "#F0FDF4", border: "1px solid #BBF7D0" }}>
                    <Typography sx={{ fontSize: "0.75rem", fontWeight: 750, color: "#166534" }}>CONFIRMED</Typography>
                    <Typography sx={{ fontSize: "1.4rem", fontWeight: 950, color: "#166534" }}>{stats.confirmed}</Typography>
                  </Box>
                </Grid>
                <Grid item xs={6} sm={3}>
                  <Box sx={{ p: 2, borderRadius: "14px", bgcolor: "#FFFBEB", border: "1px solid #FDE68A" }}>
                    <Typography sx={{ fontSize: "0.75rem", fontWeight: 750, color: "#92400E" }}>PENDING</Typography>
                    <Typography sx={{ fontSize: "1.4rem", fontWeight: 950, color: "#92400E" }}>{stats.pending}</Typography>
                  </Box>
                </Grid>
                <Grid item xs={6} sm={3}>
                  <Box sx={{ p: 2, borderRadius: "14px", bgcolor: "#ECFDF5", border: "1px solid #A7F3D0" }}>
                    <Typography sx={{ fontSize: "0.75rem", fontWeight: 750, color: "#0F766E" }}>DEAL VALUE</Typography>
                    <Typography sx={{ fontSize: "1.4rem", fontWeight: 950, color: "#0F766E" }}>₹{stats.revenue.toLocaleString("en-IN")}</Typography>
                  </Box>
                </Grid>
              </Grid>

              {/* Filters */}
              <Stack direction={{ xs: "column", sm: "row" }} justifyContent="space-between" alignItems={{ sm: "center" }} gap={1.5} sx={{ mt: 3, pt: 2, borderTop: `1px solid ${COLORS.border}` }}>
                <Stack direction="row" spacing={1} flexWrap="wrap" useFlexGap>
                  {FILTERS.map((f) => {
                    const active = filterStatus === f;
                    return (
                      <Chip
                        key={f}
                        label={f}
                        onClick={() => setFilterStatus(f)}
                        sx={{
                          fontWeight: 800,
                          fontSize: "0.78rem",
                          borderRadius: "10px",
                          bgcolor: active ? COLORS.navy : "#F8FAFC",
                          color: active ? "#FFFFFF" : COLORS.neutral,
                          border: `1px solid ${active ? COLORS.navy : COLORS.border}`,
                          "&:hover": { bgcolor: active ? COLORS.navy : "#F1F5F9" },
                        }}
                      />
                    );
                  })}
                </Stack>

                <TextField
                  size="small"
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  placeholder="Search buyer, order, listing..."
                  InputProps={{
                    startAdornment: (
                      <InputAdornment position="start">
                        <SearchRoundedIcon sx={{ fontSize: 18, color: COLORS.neutral }} />
                      </InputAdornment>
                    ),
                  }}
                  sx={{ width: { xs: "100%", sm: 300 }, "& .MuiOutlinedInput-root": { borderRadius: "12px", bgcolor: "#F8FAFC" } }}
                />
              </Stack>
            </CardContent>
          </Card>

          {loading && <LinearProgress sx={{ borderRadius: 4 }} />}

          {/* Orders Table */}
          <Card sx={{ borderRadius: "20px", border: `1px solid ${COLORS.border}`, boxShadow: "0 4px 20px rgba(15, 23, 42, 0.04)" }}>
            <CardContent sx={{ p: 3 }}>
              <TableContainer>
                <Table>
                  <TableHead>
                    <TableRow sx={{ "& th": { fontWeight: 850, fontSize: "0.8rem", color: COLORS.neutral, bgcolor: "#F8FAFC" } }}>
                      <TableCell>Inquiry ID</TableCell>
                      <TableCell>My Listing</TableCell>
                      <TableCell>Prospective Buyer</TableCell>
                      <TableCell align="right">Value</TableCell>
                      <TableCell>Status</TableCell>
                      <TableCell align="center">Contact / Actions</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {filteredOrders.map((row) => {
                      const isProperty = (row.listing_type || row.listing?.type || "").toLowerCase() === "property";
                      const title = row.listing_title || row.listing?.title || "Marketplace Listing";
                      const status = String(row.status || "confirmed").toLowerCase();
                      const buyerPhone = row.buyer?.phone || "8088185203";
                      const whatsappLink = `https://wa.me/91${buyerPhone.replace(/\D/g, "")}?text=${encodeURIComponent(`Hi ${row.buyer?.name || ""}, regarding your inquiry on ${title} at EasyDeal.`)}`;

                      return (
                        <TableRow key={row.id} hover sx={{ "& td": { fontSize: "0.84rem", py: 2 } }}>
                          <TableCell sx={{ fontWeight: 900, color: COLORS.navy }}>{row.id}</TableCell>
                          <TableCell>
                            <Stack direction="row" spacing={1.5} alignItems="center">
                              <Box sx={{ width: 36, height: 36, borderRadius: "10px", display: "grid", placeItems: "center", bgcolor: isProperty ? `${COLORS.property}15` : `${COLORS.vehicle}15`, color: isProperty ? COLORS.property : COLORS.vehicle }}>
                                {isProperty ? <HomeWorkRoundedIcon sx={{ fontSize: 20 }} /> : <DirectionsCarRoundedIcon sx={{ fontSize: 20 }} />}
                              </Box>
                              <Box>
                                <Typography sx={{ fontWeight: 800, color: COLORS.navy, fontSize: "0.86rem" }}>{title}</Typography>
                                <Typography sx={{ fontSize: "0.74rem", color: COLORS.neutral }}>
                                  📅 {row.start_date || (row.created_at ? new Date(row.created_at).toLocaleDateString("en-IN") : "Appointment Scheduled")}
                                </Typography>
                              </Box>
                            </Stack>
                          </TableCell>
                          <TableCell>
                            <Typography sx={{ fontWeight: 800, color: COLORS.navy }}>{row.buyer?.name || "Interested Buyer"}</Typography>
                            <Typography sx={{ fontSize: "0.74rem", color: COLORS.neutral }}>{buyerPhone} • {row.buyer?.email || "Direct Lead"}</Typography>
                          </TableCell>
                          <TableCell align="right" sx={{ fontWeight: 950, color: COLORS.property, fontSize: "0.92rem" }}>
                            ₹{Number(row.amount || 0).toLocaleString("en-IN")}
                          </TableCell>
                          <TableCell>
                            <Chip
                              size="small"
                              label={status.toUpperCase()}
                              sx={{
                                fontWeight: 800,
                                fontSize: "0.72rem",
                                bgcolor: status === "confirmed" ? "#DCFCE7" : status === "completed" ? "#CCFBF1" : status === "pending" ? "#FEF3C7" : "#FEE2E2",
                                color: status === "confirmed" ? "#166534" : status === "completed" ? "#0F766E" : status === "pending" ? "#B45309" : "#991B1B",
                              }}
                            />
                          </TableCell>
                          <TableCell align="center">
                            <Stack direction="row" spacing={1} justifyContent="center">
                              <Button
                                size="small"
                                variant="outlined"
                                component="a"
                                href={whatsappLink}
                                target="_blank"
                                rel="noopener noreferrer"
                                startIcon={<WhatsAppIcon sx={{ fontSize: 16 }} />}
                                sx={{
                                  borderRadius: "8px",
                                  fontWeight: 800,
                                  fontSize: "0.72rem",
                                  textTransform: "none",
                                  borderColor: "#22C55E",
                                  color: "#16A34A",
                                  "&:hover": { bgcolor: "rgba(34,197,94,0.06)" },
                                }}
                              >
                                WhatsApp
                              </Button>

                              <Button
                                size="small"
                                variant="outlined"
                                onClick={() => setSelectedInvoice(row)}
                                startIcon={<ReceiptLongRoundedIcon sx={{ fontSize: 16 }} />}
                                sx={{
                                  borderRadius: "8px",
                                  fontWeight: 800,
                                  fontSize: "0.72rem",
                                  textTransform: "none",
                                  borderColor: COLORS.border,
                                  color: COLORS.navy,
                                  "&:hover": { bgcolor: "#F1F5F9" },
                                }}
                              >
                                Invoice
                              </Button>
                            </Stack>
                          </TableCell>
                        </TableRow>
                      );
                    })}
                    {filteredOrders.length === 0 && (
                      <TableRow>
                        <TableCell colSpan={6} align="center" sx={{ py: 6 }}>
                          <Typography sx={{ color: COLORS.neutral, fontWeight: 700, fontSize: "0.95rem" }}>
                            No customer inquiries found
                          </Typography>
                          <Typography sx={{ color: COLORS.neutral, fontSize: "0.78rem", mt: 0.5 }}>
                            Site visit requests and buyer leads for your listings will be listed here automatically.
                          </Typography>
                        </TableCell>
                      </TableRow>
                    )}
                  </TableBody>
                </Table>
              </TableContainer>
            </CardContent>
          </Card>
        </Stack>
      </Box>

      {/* Invoice Modal */}
      <InvoiceDialog
        open={Boolean(selectedInvoice)}
        onClose={() => setSelectedInvoice(null)}
        booking={selectedInvoice}
      />
    </Box>
  );
}
