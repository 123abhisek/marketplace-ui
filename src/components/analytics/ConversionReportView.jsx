// src/components/analytics/ConversionReportView.jsx
import React, { useMemo } from "react";
import {
  Box,
  Card,
  CardContent,
  Chip,
  Grid,
  LinearProgress,
  Paper,
  Stack,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Typography,
} from "@mui/material";
import FilterAltRoundedIcon from "@mui/icons-material/FilterAltRounded";
import TrendingUpRoundedIcon from "@mui/icons-material/TrendingUpRounded";
import FunctionsRoundedIcon from "@mui/icons-material/FunctionsRounded";
import CheckCircleOutlineRoundedIcon from "@mui/icons-material/CheckCircleOutlineRounded";
import {
  ResponsiveContainer,
  LineChart,
  Line,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip as RechartsTooltip,
  Legend,
  CartesianGrid,
} from "recharts";
import KPICard from "./KPICard";
import {
  BI_COLORS,
  CONVERSION_FUNNEL_STAGES,
  CONVERSION_TREND_DATA,
  PROPERTY_VS_VEHICLE_CONVERSION,
  SELLER_CONVERSION_TABLE,
  BEST_PERFORMING_LISTINGS,
} from "./analyticsData";

export default function ConversionReportView({ searchQuery = "" }) {
  const filteredListings = useMemo(() => {
    return BEST_PERFORMING_LISTINGS.filter((item) => {
      const matchSearch =
        !searchQuery ||
        item.listing.toLowerCase().includes(searchQuery.toLowerCase()) ||
        item.type.toLowerCase().includes(searchQuery.toLowerCase());
      return matchSearch;
    });
  }, [searchQuery]);

  return (
    <Stack spacing={3}>
      {/* 5 Primary Conversion KPIs */}
      <Grid container spacing={2}>
        <Grid item xs={12} sm={6} lg={2.4}>
          <KPICard
            title="Overall Conversion"
            value="7.8%"
            growth={1.4}
            comparison="Visitors to closed deals"
            sparkColor="#10B981"
            sparkline={[{ v: 6.2 }, { v: 6.8 }, { v: 7.1 }, { v: 7.5 }, { v: 7.8 }]}
            icon={<TrendingUpRoundedIcon />}
            color="#10B981"
          />
        </Grid>
        <Grid item xs={12} sm={6} lg={2.4}>
          <KPICard
            title="Enquiry Conversion"
            value="16.0%"
            growth={1.8}
            comparison="Views to Enquiry"
            sparkColor="#0F766E"
            sparkline={[{ v: 14.2 }, { v: 14.8 }, { v: 15.2 }, { v: 15.6 }, { v: 16.0 }]}
            icon={<FilterAltRoundedIcon />}
            color="#0F766E"
          />
        </Grid>
        <Grid item xs={12} sm={6} lg={2.4}>
          <KPICard
            title="Contact / Call Rate"
            value="62.5%"
            growth={3.2}
            comparison="Enquiries to Call"
            sparkColor="#2563EB"
            sparkline={[{ v: 54 }, { v: 57 }, { v: 59 }, { v: 61 }, { v: 62.5 }]}
            icon={<CheckCircleOutlineRoundedIcon />}
            color="#2563EB"
          />
        </Grid>
        <Grid item xs={12} sm={6} lg={2.4}>
          <KPICard
            title="Booking Conversion"
            value="25.0%"
            growth={2.1}
            comparison="Calls to Confirmed Visit"
            sparkColor="#6366F1"
            sparkline={[{ v: 21 }, { v: 22.5 }, { v: 23.5 }, { v: 24.2 }, { v: 25.0 }]}
            icon={<CheckCircleOutlineRoundedIcon />}
            color="#6366F1"
          />
        </Grid>
        <Grid item xs={12} sm={6} lg={2.4}>
          <KPICard
            title="Deal Closure Rate"
            value="70.0%"
            growth={4.5}
            comparison="Bookings to Closed Sale"
            sparkColor="#8B5CF6"
            sparkline={[{ v: 61 }, { v: 64 }, { v: 66 }, { v: 68 }, { v: 70 }]}
            icon={<CheckCircleOutlineRoundedIcon />}
            color="#8B5CF6"
          />
        </Grid>
      </Grid>

      {/* Row 1: Full Conversion Funnel Visualization */}
      <Card sx={{ borderRadius: "20px", border: `1px solid ${BI_COLORS.border}`, boxShadow: "0 4px 20px rgba(15, 23, 42, 0.04)" }}>
        <CardContent sx={{ p: 3 }}>
          <Typography sx={{ fontSize: "1.15rem", fontWeight: 900, color: BI_COLORS.navy }}>
            Marketplace Acquisition & Conversion Funnel
          </Typography>
          <Typography sx={{ fontSize: "0.8rem", color: BI_COLORS.neutral, mb: 3 }}>
            End-to-end customer journey from initial discovery to successful property & vehicle deal closure
          </Typography>

          <Stack spacing={1.8}>
            {CONVERSION_FUNNEL_STAGES.map((stage, index) => {
              const widthPct = (stage.count / 10000) * 100;
              return (
                <Box key={stage.stage}>
                  <Stack direction="row" justifyContent="space-between" alignItems="center" mb={0.6}>
                    <Stack direction="row" spacing={1} alignItems="center">
                      <Chip
                        size="small"
                        label={`Step ${index + 1}`}
                        sx={{ height: 20, fontSize: "0.68rem", fontWeight: 800, bgcolor: "#F1F5F9", color: BI_COLORS.navy }}
                      />
                      <Typography sx={{ fontSize: "0.9rem", fontWeight: 800, color: BI_COLORS.navy }}>
                        {stage.stage}
                      </Typography>
                    </Stack>
                    <Stack direction="row" spacing={2} alignItems="center">
                      <Typography sx={{ fontSize: "0.82rem", color: BI_COLORS.neutral, fontWeight: 700 }}>
                        {stage.stepPct}
                      </Typography>
                      <Typography sx={{ fontSize: "0.95rem", fontWeight: 900, color: BI_COLORS.navy, minWidth: 60, textAlign: "right" }}>
                        {stage.count.toLocaleString()}
                      </Typography>
                    </Stack>
                  </Stack>

                  <Box sx={{ width: "100%", height: 24, bgcolor: "#F1F5F9", borderRadius: "8px", overflow: "hidden", p: 0.3 }}>
                    <Box
                      sx={{
                        width: `${Math.max(4, widthPct)}%`,
                        height: "100%",
                        borderRadius: "6px",
                        background: `linear-gradient(90deg, ${stage.fill}, ${stage.fill}DD)`,
                        transition: "width 0.8s ease",
                      }}
                    />
                  </Box>
                </Box>
              );
            })}
          </Stack>
        </CardContent>
      </Card>

      {/* Row 2: Conversion Trend Line & Property vs Vehicle Grouped Bar */}
      <Grid container spacing={2.5}>
        <Grid item xs={12} lg={7}>
          <Card sx={{ borderRadius: "20px", border: `1px solid ${BI_COLORS.border}`, boxShadow: "0 4px 20px rgba(15, 23, 42, 0.04)" }}>
            <CardContent sx={{ p: 3 }}>
              <Typography sx={{ fontSize: "1.1rem", fontWeight: 900, color: BI_COLORS.navy }}>
                Conversion Rate Trajectory
              </Typography>
              <Typography sx={{ fontSize: "0.8rem", color: BI_COLORS.neutral, mb: 2 }}>
                Weekly tracking of enquiry, booking, and overall conversion velocity
              </Typography>

              <Box sx={{ width: "100%", height: 280 }}>
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={CONVERSION_TREND_DATA} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                    <CartesianGrid strokeDasharray="3 3" stroke="rgba(27,42,67,0.06)" />
                    <XAxis dataKey="week" tick={{ fontSize: 11, fill: BI_COLORS.neutral, fontWeight: 700 }} axisLine={false} tickLine={false} />
                    <YAxis tick={{ fontSize: 11, fill: BI_COLORS.neutral, fontWeight: 600 }} tickFormatter={(v) => `${v}%`} axisLine={false} tickLine={false} />
                    <RechartsTooltip formatter={(v) => `${v}%`} contentStyle={{ borderRadius: 12 }} />
                    <Legend />
                    <Line type="monotone" dataKey="bookingRate" name="Booking Rate %" stroke="#6366F1" strokeWidth={3} dot={{ r: 4 }} />
                    <Line type="monotone" dataKey="enquiryRate" name="Enquiry Rate %" stroke="#0F766E" strokeWidth={2} />
                    <Line type="monotone" dataKey="overallRate" name="Overall Funnel %" stroke="#10B981" strokeWidth={2} strokeDasharray="4 4" />
                  </LineChart>
                </ResponsiveContainer>
              </Box>
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12} lg={5}>
          <Card sx={{ borderRadius: "20px", border: `1px solid ${BI_COLORS.border}`, boxShadow: "0 4px 20px rgba(15, 23, 42, 0.04)" }}>
            <CardContent sx={{ p: 3 }}>
              <Typography sx={{ fontSize: "1.1rem", fontWeight: 900, color: BI_COLORS.navy }}>
                Property vs Vehicle Conversion
              </Typography>
              <Typography sx={{ fontSize: "0.8rem", color: BI_COLORS.neutral, mb: 2 }}>
                Stage-by-stage comparison by marketplace sector
              </Typography>

              <Box sx={{ width: "100%", height: 280 }}>
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={PROPERTY_VS_VEHICLE_CONVERSION} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                    <CartesianGrid strokeDasharray="3 3" stroke="rgba(27,42,67,0.06)" />
                    <XAxis dataKey="stage" tick={{ fontSize: 10.5, fill: BI_COLORS.neutral, fontWeight: 700 }} axisLine={false} tickLine={false} />
                    <YAxis tick={{ fontSize: 11, fill: BI_COLORS.neutral, fontWeight: 600 }} tickFormatter={(v) => `${v}%`} axisLine={false} tickLine={false} />
                    <RechartsTooltip formatter={(v) => `${v}%`} contentStyle={{ borderRadius: 12 }} />
                    <Legend />
                    <Bar dataKey="Property" name="Property %" fill={BI_COLORS.property} radius={[6, 6, 0, 0]} />
                    <Bar dataKey="Vehicle" name="Vehicle %" fill={BI_COLORS.vehicle} radius={[6, 6, 0, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              </Box>
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      {/* Row 3: Seller Conversion & Best Performing Listings Tables */}
      <Grid container spacing={2.5}>
        <Grid item xs={12} lg={6}>
          <Card sx={{ borderRadius: "20px", border: `1px solid ${BI_COLORS.border}`, boxShadow: "0 4px 20px rgba(15, 23, 42, 0.04)" }}>
            <CardContent sx={{ p: 3 }}>
              <Typography sx={{ fontSize: "1.1rem", fontWeight: 900, color: BI_COLORS.navy, mb: 0.5 }}>
                Seller Conversion Performance
              </Typography>
              <Typography sx={{ fontSize: "0.8rem", color: BI_COLORS.neutral, mb: 2 }}>
                Conversion efficiency of top partner seller accounts
              </Typography>

              <TableContainer>
                <Table size="small">
                  <TableHead>
                    <TableRow sx={{ "& th": { fontWeight: 850, fontSize: "0.78rem", color: BI_COLORS.neutral, bgcolor: "#F8FAFC" } }}>
                      <TableCell>Seller</TableCell>
                      <TableCell align="right">Views</TableCell>
                      <TableCell align="right">Enquiries</TableCell>
                      <TableCell align="right">Completed</TableCell>
                      <TableCell align="right">Closure Rate</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {SELLER_CONVERSION_TABLE.map((row) => (
                      <TableRow key={row.seller} hover sx={{ "& td": { fontSize: "0.82rem", fontWeight: 650, py: 1.2 } }}>
                        <TableCell sx={{ fontWeight: 800, color: BI_COLORS.navy }}>{row.seller}</TableCell>
                        <TableCell align="right">{row.views}</TableCell>
                        <TableCell align="right">{row.enquiries}</TableCell>
                        <TableCell align="right">{row.completed}</TableCell>
                        <TableCell align="right">
                          <Chip size="small" label={row.rate} sx={{ height: 20, fontWeight: 800, fontSize: "0.72rem", bgcolor: "#DCFCE7", color: "#166534" }} />
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </TableContainer>
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12} lg={6}>
          <Card sx={{ borderRadius: "20px", border: `1px solid ${BI_COLORS.border}`, boxShadow: "0 4px 20px rgba(15, 23, 42, 0.04)" }}>
            <CardContent sx={{ p: 3 }}>
              <Typography sx={{ fontSize: "1.1rem", fontWeight: 900, color: BI_COLORS.navy, mb: 0.5 }}>
                Top Converting Listings
              </Typography>
              <Typography sx={{ fontSize: "0.8rem", color: BI_COLORS.neutral, mb: 2 }}>
                Marketplace listings generating highest visitor conversion
              </Typography>

              <TableContainer>
                <Table size="small">
                  <TableHead>
                    <TableRow sx={{ "& th": { fontWeight: 850, fontSize: "0.78rem", color: BI_COLORS.neutral, bgcolor: "#F8FAFC" } }}>
                      <TableCell>Listing</TableCell>
                      <TableCell>Type</TableCell>
                      <TableCell align="right">Views</TableCell>
                      <TableCell align="right">Bookings</TableCell>
                      <TableCell align="right">Conv %</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {filteredListings.map((row) => (
                      <TableRow key={row.listing} hover sx={{ "& td": { fontSize: "0.82rem", fontWeight: 650, py: 1.2 } }}>
                        <TableCell sx={{ fontWeight: 800, color: BI_COLORS.navy }} noWrap>{row.listing}</TableCell>
                        <TableCell>
                          <Chip
                            size="small"
                            label={row.type}
                            sx={{
                              height: 20,
                              fontSize: "0.7rem",
                              fontWeight: 800,
                              bgcolor: row.type === "Property" ? `${BI_COLORS.property}15` : `${BI_COLORS.vehicle}15`,
                              color: row.type === "Property" ? BI_COLORS.property : BI_COLORS.vehicle,
                            }}
                          />
                        </TableCell>
                        <TableCell align="right">{row.views}</TableCell>
                        <TableCell align="right">{row.bookings}</TableCell>
                        <TableCell align="right">
                          <Chip size="small" label={row.rate} sx={{ height: 20, fontWeight: 800, fontSize: "0.72rem", bgcolor: "#CCFBF1", color: "#0F766E" }} />
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </TableContainer>
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      {/* Row 4: Power BI Metric Formulation Box */}
      <Card sx={{ borderRadius: "20px", border: `1px solid ${BI_COLORS.border}`, background: "#F8FAFC" }}>
        <CardContent sx={{ p: 2.5 }}>
          <Stack direction="row" spacing={1.5} alignItems="center" mb={1.5}>
            <FunctionsRoundedIcon sx={{ color: BI_COLORS.navy }} />
            <Typography sx={{ fontWeight: 900, fontSize: "0.95rem", color: BI_COLORS.navy }}>
              Standard Analytics Formulation Reference
            </Typography>
          </Stack>
          <Grid container spacing={2}>
            <Grid item xs={12} md={4}>
              <Paper sx={{ p: 1.5, borderRadius: "12px", border: `1px solid ${BI_COLORS.border}` }}>
                <Typography sx={{ fontSize: "0.75rem", fontWeight: 800, color: BI_COLORS.neutral }}>
                  Enquiry Conversion Rate
                </Typography>
                <Typography sx={{ fontSize: "0.85rem", fontWeight: 900, color: BI_COLORS.navy, mt: 0.5 }}>
                  (Enquiries / Listing Views) × 100
                </Typography>
              </Paper>
            </Grid>
            <Grid item xs={12} md={4}>
              <Paper sx={{ p: 1.5, borderRadius: "12px", border: `1px solid ${BI_COLORS.border}` }}>
                <Typography sx={{ fontSize: "0.75rem", fontWeight: 800, color: BI_COLORS.neutral }}>
                  Booking Conversion Rate
                </Typography>
                <Typography sx={{ fontSize: "0.85rem", fontWeight: 900, color: BI_COLORS.navy, mt: 0.5 }}>
                  (Bookings / Enquiries) × 100
                </Typography>
              </Paper>
            </Grid>
            <Grid item xs={12} md={4}>
              <Paper sx={{ p: 1.5, borderRadius: "12px", border: `1px solid ${BI_COLORS.border}` }}>
                <Typography sx={{ fontSize: "0.75rem", fontWeight: 800, color: BI_COLORS.neutral }}>
                  Overall Funnel Efficiency
                </Typography>
                <Typography sx={{ fontSize: "0.85rem", fontWeight: 900, color: BI_COLORS.navy, mt: 0.5 }}>
                  (Completed Transactions / Visitors) × 100
                </Typography>
              </Paper>
            </Grid>
          </Grid>
        </CardContent>
      </Card>
    </Stack>
  );
}
