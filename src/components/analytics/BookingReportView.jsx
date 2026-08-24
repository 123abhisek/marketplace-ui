// src/components/analytics/BookingReportView.jsx
import React, { useMemo } from "react";
import {
  Box,
  Card,
  CardContent,
  Chip,
  Grid,
  Stack,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Typography,
} from "@mui/material";
import ConfirmationNumberRoundedIcon from "@mui/icons-material/ConfirmationNumberRounded";
import CheckCircleRoundedIcon from "@mui/icons-material/CheckCircleRounded";
import PendingRoundedIcon from "@mui/icons-material/PendingRounded";
import CancelRoundedIcon from "@mui/icons-material/CancelRounded";
import DoneAllRoundedIcon from "@mui/icons-material/DoneAllRounded";
import {
  ResponsiveContainer,
  LineChart,
  Line,
  BarChart,
  Bar,
  PieChart,
  Pie,
  Cell,
  XAxis,
  YAxis,
  Tooltip as RechartsTooltip,
  Legend,
  CartesianGrid,
} from "recharts";
import KPICard from "./KPICard";
import {
  BI_COLORS,
  BOOKING_TREND_DATA,
  BOOKING_STATUS_DATA,
  BOOKING_CATEGORY_DATA,
  TOP_SELLERS_BY_BOOKINGS,
  RECENT_BOOKINGS_TABLE,
  formatINR,
} from "./analyticsData";

export default function BookingReportView({ data, category = "all", searchQuery = "" }) {
  const kpis = data?.kpis;
  const recentList = data?.recent_bookings || [];
  const statusDist = data?.status_distribution || [
    { name: "Confirmed", value: kpis?.confirmed_bookings || 0, color: "#10B981" },
    { name: "Pending", value: kpis?.pending_bookings || 0, color: "#F59E0B" },
    { name: "Cancelled", value: kpis?.cancelled_bookings || 0, color: "#EF4444" },
  ];
  const topSellers = data?.top_sellers || [];
  const categoryDist = data?.category_distribution || [];

  const filteredBookings = useMemo(() => {
    return recentList.filter((item) => {
      const matchCat = category === "all" || item.category?.toLowerCase() === category.toLowerCase();
      const matchSearch =
        !searchQuery ||
        item.customer?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        item.seller?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        item.id?.toLowerCase().includes(searchQuery.toLowerCase());
      return matchCat && matchSearch;
    });
  }, [recentList, category, searchQuery]);

  return (
    <Stack spacing={3}>
      {/* 5 Primary KPIs */}
      <Grid container spacing={2}>
        <Grid item xs={12} sm={6} lg={2.4}>
          <KPICard
            title="Total Bookings"
            value={kpis?.total_bookings != null ? `${kpis.total_bookings}` : "0"}
            growth={12.6}
            comparison="All recorded bookings"
            sparkColor={BI_COLORS.bookings}
            sparkline={[{ v: 0 }, { v: kpis?.total_bookings || 0 }]}
            icon={<ConfirmationNumberRoundedIcon />}
            color={BI_COLORS.bookings}
          />
        </Grid>
        <Grid item xs={12} sm={6} lg={2.4}>
          <KPICard
            title="Confirmed Bookings"
            value={kpis?.confirmed_bookings != null ? `${kpis.confirmed_bookings}` : "0"}
            growth={14.8}
            comparison={`${kpis?.total_bookings ? Math.round((kpis.confirmed_bookings / kpis.total_bookings) * 100) : 0}% confirmation rate`}
            sparkColor="#10B981"
            sparkline={[{ v: 0 }, { v: kpis?.confirmed_bookings || 0 }]}
            icon={<CheckCircleRoundedIcon />}
            color="#10B981"
          />
        </Grid>
        <Grid item xs={12} sm={6} lg={2.4}>
          <KPICard
            title="Gross Revenue"
            value={kpis?.total_revenue != null ? `₹${Number(kpis.total_revenue).toLocaleString('en-IN')}` : "₹0"}
            growth={18.2}
            comparison="Settled transaction value"
            sparkColor="#0F766E"
            sparkline={[{ v: 0 }, { v: kpis?.total_revenue || 0 }]}
            icon={<DoneAllRoundedIcon />}
            color="#0F766E"
          />
        </Grid>
        <Grid item xs={12} sm={6} lg={2.4}>
          <KPICard
            title="Pending Bookings"
            value={kpis?.pending_bookings != null ? `${kpis.pending_bookings}` : "0"}
            growth={-4.5}
            comparison="Awaiting confirmation"
            sparkColor="#F59E0B"
            sparkline={[{ v: 0 }, { v: kpis?.pending_bookings || 0 }]}
            icon={<PendingRoundedIcon />}
            color="#F59E0B"
          />
        </Grid>
        <Grid item xs={12} sm={6} lg={2.4}>
          <KPICard
            title="Cancelled"
            value={kpis?.cancelled_bookings != null ? `${kpis.cancelled_bookings}` : "0"}
            growth={-12.0}
            comparison="Cancelled or rejected"
            sparkColor="#EF4444"
            sparkline={[{ v: 0 }, { v: kpis?.cancelled_bookings || 0 }]}
            icon={<CancelRoundedIcon />}
            color="#EF4444"
          />
        </Grid>
      </Grid>

      {/* Row 1: Line Trend & Status Donut */}
      <Grid container spacing={2.5}>
        <Grid item xs={12} lg={8}>
          <Card sx={{ borderRadius: "20px", border: `1px solid ${BI_COLORS.border}`, boxShadow: "0 4px 20px rgba(15, 23, 42, 0.04)" }}>
            <CardContent sx={{ p: 3 }}>
              <Typography sx={{ fontSize: "1.1rem", fontWeight: 900, color: BI_COLORS.navy }}>
                Booking & Enquiry Trajectory
              </Typography>
              <Typography sx={{ fontSize: "0.8rem", color: BI_COLORS.neutral, mb: 2.5 }}>
                Multi-metric velocity tracking enquiries, confirmed bookings, completed deals, and cancellations
              </Typography>

              <Box sx={{ width: "100%", height: 320 }}>
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={BOOKING_TREND_DATA} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                    <CartesianGrid strokeDasharray="3 3" stroke="rgba(27,42,67,0.06)" />
                    <XAxis dataKey="date" tick={{ fontSize: 11, fill: BI_COLORS.neutral, fontWeight: 700 }} axisLine={false} tickLine={false} />
                    <YAxis tick={{ fontSize: 11, fill: BI_COLORS.neutral, fontWeight: 600 }} axisLine={false} tickLine={false} />
                    <RechartsTooltip contentStyle={{ borderRadius: 12, border: `1px solid ${BI_COLORS.border}` }} />
                    <Legend />
                    <Line type="monotone" dataKey="enquiries" name="Enquiries" stroke={BI_COLORS.bookings} strokeWidth={3} dot={{ r: 4 }} />
                    <Line type="monotone" dataKey="confirmed" name="Confirmed" stroke="#10B981" strokeWidth={3} dot={{ r: 4 }} />
                    <Line type="monotone" dataKey="completed" name="Completed" stroke="#0F766E" strokeWidth={2} strokeDasharray="4 4" />
                    <Line type="monotone" dataKey="cancelled" name="Cancelled" stroke="#EF4444" strokeWidth={2} />
                  </LineChart>
                </ResponsiveContainer>
              </Box>
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12} lg={4}>
          <Card sx={{ borderRadius: "20px", border: `1px solid ${BI_COLORS.border}`, boxShadow: "0 4px 20px rgba(15, 23, 42, 0.04)", height: "100%" }}>
            <CardContent sx={{ p: 3 }}>
              <Typography sx={{ fontSize: "1.1rem", fontWeight: 900, color: BI_COLORS.navy }}>
                Booking Status Breakdown
              </Typography>
              <Box sx={{ width: "100%", height: 220 }}>
                <ResponsiveContainer width="100%" height="100%">

                  <PieChart>
                    <Pie data={statusDist} innerRadius={60} outerRadius={85} paddingAngle={4} dataKey="value">
                      {statusDist.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.color || "#0F766E"} />
                      ))}
                    </Pie>
                    <RechartsTooltip contentStyle={{ borderRadius: 12 }} />
                  </PieChart>
                </ResponsiveContainer>
              </Box>

              <Stack spacing={1} sx={{ mt: 1 }}>
                {statusDist.map((item) => (
                  <Stack key={item.name} direction="row" justifyContent="space-between" alignItems="center">
                    <Stack direction="row" spacing={1} alignItems="center">
                      <Box sx={{ width: 10, height: 10, borderRadius: "50%", bgcolor: item.color }} />
                      <Typography sx={{ fontSize: 12.5, fontWeight: 700, color: BI_COLORS.navy }}>{item.name}</Typography>
                    </Stack>
                    <Typography sx={{ fontSize: 13, fontWeight: 900, color: BI_COLORS.navy }}>{item.value}</Typography>
                  </Stack>
                ))}
              </Stack>
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      {/* Row 2: Property vs Vehicle & Top Sellers */}
      <Grid container spacing={2.5}>
        <Grid item xs={12} lg={6}>
          <Card sx={{ borderRadius: "20px", border: `1px solid ${BI_COLORS.border}`, boxShadow: "0 4px 20px rgba(15, 23, 42, 0.04)" }}>
            <CardContent sx={{ p: 3 }}>
              <Typography sx={{ fontSize: "1.1rem", fontWeight: 900, color: BI_COLORS.navy }}>
                Property vs Vehicle Bookings
              </Typography>
              <Typography sx={{ fontSize: "0.8rem", color: BI_COLORS.neutral, mb: 2 }}>
                Category distribution across real estate and automotive transactions
              </Typography>

              <Box sx={{ width: "100%", height: 260 }}>
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={categoryDist.length > 0 ? categoryDist : [{ category: "Property", count: 0 }, { category: "Vehicle", count: 0 }]} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                    <CartesianGrid strokeDasharray="3 3" stroke="rgba(27,42,67,0.06)" />
                    <XAxis dataKey="category" tick={{ fontSize: 10.5, fill: BI_COLORS.neutral, fontWeight: 700 }} axisLine={false} tickLine={false} />
                    <YAxis tick={{ fontSize: 11, fill: BI_COLORS.neutral, fontWeight: 600 }} axisLine={false} tickLine={false} />
                    <RechartsTooltip contentStyle={{ borderRadius: 12 }} />
                    <Bar dataKey="count" name="Bookings" fill={BI_COLORS.property} radius={[6, 6, 0, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              </Box>
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12} lg={6}>
          <Card sx={{ borderRadius: "20px", border: `1px solid ${BI_COLORS.border}`, boxShadow: "0 4px 20px rgba(15, 23, 42, 0.04)" }}>
            <CardContent sx={{ p: 3 }}>
              <Typography sx={{ fontSize: "1.1rem", fontWeight: 900, color: BI_COLORS.navy }}>
                Top Sellers by Bookings
              </Typography>
              <Typography sx={{ fontSize: "0.8rem", color: BI_COLORS.neutral, mb: 2 }}>
                Highest volume booking partners on EasyDeal
              </Typography>

              <Box sx={{ width: "100%", height: 260 }}>
                {topSellers.length === 0 ? (
                  <Box sx={{ height: "100%", display: "flex", alignItems: "center", justifyContent: "center" }}>
                    <Typography sx={{ color: BI_COLORS.neutral, fontSize: "0.85rem" }}>No seller bookings recorded yet</Typography>
                  </Box>
                ) : (
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart layout="vertical" data={topSellers} margin={{ top: 5, right: 20, left: 40, bottom: 0 }}>
                      <CartesianGrid strokeDasharray="3 3" stroke="rgba(27,42,67,0.06)" />
                      <XAxis type="number" tick={{ fontSize: 11, fill: BI_COLORS.neutral }} axisLine={false} tickLine={false} />
                      <YAxis type="category" dataKey="name" tick={{ fontSize: 11, fill: BI_COLORS.navy, fontWeight: 700 }} axisLine={false} tickLine={false} />
                      <RechartsTooltip contentStyle={{ borderRadius: 12 }} />
                      <Bar dataKey="bookings" name="Bookings" fill={BI_COLORS.bookings} radius={[0, 6, 6, 0]} />
                    </BarChart>
                  </ResponsiveContainer>
                )}
              </Box>
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      {/* Row 3: Recent Bookings Detailed Table */}
      <Card sx={{ borderRadius: "20px", border: `1px solid ${BI_COLORS.border}`, boxShadow: "0 4px 20px rgba(15, 23, 42, 0.04)" }}>
        <CardContent sx={{ p: 3 }}>
          <Typography sx={{ fontSize: "1.1rem", fontWeight: 900, color: BI_COLORS.navy, mb: 0.5 }}>
            Recent Bookings Log ({filteredBookings.length})
          </Typography>
          <Typography sx={{ fontSize: "0.8rem", color: BI_COLORS.neutral, mb: 2 }}>
            Real-time audit log of customer inquiries and appointment schedules
          </Typography>

          <TableContainer>
            <Table size="small">
              <TableHead>
                <TableRow sx={{ "& th": { fontWeight: 850, fontSize: "0.8rem", color: BI_COLORS.neutral, bgcolor: "#F8FAFC" } }}>
                  <TableCell>Booking ID</TableCell>
                  <TableCell>Customer</TableCell>
                  <TableCell>Seller Partner</TableCell>
                  <TableCell>Category</TableCell>
                  <TableCell align="right">Amount</TableCell>
                  <TableCell>Status</TableCell>
                  <TableCell>Date</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {filteredBookings.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={7} align="center" sx={{ py: 4, color: BI_COLORS.neutral }}>
                      No booking records found in the database.
                    </TableCell>
                  </TableRow>
                ) : (
                  filteredBookings.map((row) => (
                    <TableRow key={row.id} hover sx={{ "& td": { fontSize: "0.84rem", fontWeight: 650, py: 1.5 } }}>
                      <TableCell sx={{ fontWeight: 800, color: BI_COLORS.navy }}>{row.id}</TableCell>
                      <TableCell>{row.customer}</TableCell>
                      <TableCell>{row.seller}</TableCell>
                      <TableCell>
                        <Chip
                          size="small"
                          label={row.category}
                          sx={{
                            height: 22,
                            fontSize: "0.72rem",
                            fontWeight: 800,
                            bgcolor: row.category === "Property" ? `${BI_COLORS.property}15` : `${BI_COLORS.vehicle}15`,
                            color: row.category === "Property" ? BI_COLORS.property : BI_COLORS.vehicle,
                          }}
                        />
                      </TableCell>
                      <TableCell align="right" sx={{ fontWeight: 900, color: BI_COLORS.navy }}>{formatINR(row.amount)}</TableCell>
                      <TableCell>
                        <Chip
                          size="small"
                          label={row.status}
                          sx={{
                            height: 22,
                            fontSize: "0.72rem",
                            fontWeight: 800,
                            bgcolor:
                              row.status === "Confirmed" || row.status === "Completed" ? "#DCFCE7" : row.status === "Pending" ? "#FEF3C7" : "#FEE2E2",
                            color:
                              row.status === "Confirmed" || row.status === "Completed" ? "#166534" : row.status === "Pending" ? "#B45309" : "#991B1B",
                          }}
                        />
                      </TableCell>
                      <TableCell sx={{ color: BI_COLORS.neutral }}>{row.date || "—"}</TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          </TableContainer>
        </CardContent>
      </Card>
    </Stack>
  );
}

