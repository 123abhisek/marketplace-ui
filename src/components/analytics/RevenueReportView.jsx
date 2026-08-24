// src/components/analytics/RevenueReportView.jsx
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
import CurrencyRupeeRoundedIcon from "@mui/icons-material/CurrencyRupeeRounded";
import LocalOfferRoundedIcon from "@mui/icons-material/LocalOfferRounded";
import AccountBalanceRoundedIcon from "@mui/icons-material/AccountBalanceRounded";
import TrendingUpRoundedIcon from "@mui/icons-material/TrendingUpRounded";
import ReceiptLongRoundedIcon from "@mui/icons-material/ReceiptLongRounded";
import {
  ResponsiveContainer,
  AreaChart,
  Area,
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
  REVENUE_TREND_DATA,
  REVENUE_BY_CATEGORY,
  REVENUE_BREAKDOWN_DONUT,
  TOP_10_SELLERS_REVENUE,
  MONTHLY_REVENUE_COMPARISON,
  REVENUE_TABLE_DATA,
  formatINR,
  formatCompactINR,
} from "./analyticsData";

export default function RevenueReportView({ data, category = "all", searchQuery = "" }) {
  const kpis = data?.kpis;
  const recentList = data?.recent_bookings || [];
  const topSellers = data?.top_sellers || [];
  const categoryDist = data?.category_distribution || [];

  const grossRevenue = kpis?.total_revenue || 0;
  const gstAmount = kpis?.gst_collected || Math.round(grossRevenue * 0.18);
  const netRevenue = Math.max(0, grossRevenue - gstAmount);
  const aov = kpis?.confirmed_bookings ? Math.round(grossRevenue / kpis.confirmed_bookings) : 0;

  const filteredRevenueTable = useMemo(() => {
    return recentList.map(b => {
      const gross = b.amount || 0;
      const gst = Math.round(gross * 0.18);
      const net = gross - gst;
      return {
        id: b.id,
        date: b.date,
        customer: b.customer,
        seller: b.seller,
        category: b.category,
        gross,
        discount: 0,
        gst,
        net,
        status: b.status === "Confirmed" || b.status === "Completed" ? "Paid" : b.status,
      };
    }).filter((item) => {
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
      {/* 5 Primary Revenue KPIs */}
      <Grid container spacing={2}>
        <Grid item xs={12} sm={6} lg={2.4}>
          <KPICard
            title="Gross Revenue"
            value={`₹${Number(grossRevenue).toLocaleString('en-IN')}`}
            growth={18.4}
            comparison="Confirmed transaction volume"
            sparkColor="#10B981"
            sparkline={[{ v: 0 }, { v: grossRevenue }]}
            icon={<CurrencyRupeeRoundedIcon />}
            color="#10B981"
          />
        </Grid>
        <Grid item xs={12} sm={6} lg={2.4}>
          <KPICard
            title="Avg Order Value"
            value={`₹${Number(aov).toLocaleString('en-IN')}`}
            growth={4.2}
            comparison="Per confirmed booking"
            sparkColor="#6366F1"
            sparkline={[{ v: 0 }, { v: aov }]}
            icon={<LocalOfferRoundedIcon />}
            color="#6366F1"
          />
        </Grid>
        <Grid item xs={12} sm={6} lg={2.4}>
          <KPICard
            title="GST (18%)"
            value={`₹${Number(gstAmount).toLocaleString('en-IN')}`}
            growth={15.2}
            comparison="Statutory tax computation"
            sparkColor="#F59E0B"
            sparkline={[{ v: 0 }, { v: gstAmount }]}
            icon={<AccountBalanceRoundedIcon />}
            color="#F59E0B"
          />
        </Grid>
        <Grid item xs={12} sm={6} lg={2.4}>
          <KPICard
            title="Net Revenue"
            value={`₹${Number(netRevenue).toLocaleString('en-IN')}`}
            growth={19.5}
            comparison="Net after GST"
            sparkColor="#0F766E"
            sparkline={[{ v: 0 }, { v: netRevenue }]}
            icon={<TrendingUpRoundedIcon />}
            color="#0F766E"
          />
        </Grid>
        <Grid item xs={12} sm={6} lg={2.4}>
          <KPICard
            title="Confirmed Invoices"
            value={`${kpis?.confirmed_bookings || 0}`}
            growth={11.0}
            comparison="Total paid invoices"
            sparkColor="#2563EB"
            sparkline={[{ v: 0 }, { v: kpis?.confirmed_bookings || 0 }]}
            icon={<ReceiptLongRoundedIcon />}
            color="#2563EB"
          />
        </Grid>
      </Grid>

      {/* Row 1: Large Area Chart (Revenue Trajectory) & Donut Breakdown */}
      <Grid container spacing={2.5}>
        <Grid item xs={12} lg={8}>
          <Card sx={{ borderRadius: "20px", border: `1px solid ${BI_COLORS.border}`, boxShadow: "0 4px 20px rgba(15, 23, 42, 0.04)" }}>
            <CardContent sx={{ p: 3 }}>
              <Typography sx={{ fontSize: "1.1rem", fontWeight: 900, color: BI_COLORS.navy }}>
                Gross vs Net Revenue Velocity
              </Typography>
              <Typography sx={{ fontSize: "0.8rem", color: BI_COLORS.neutral, mb: 2.5 }}>
                Monthly trajectory tracking gross receipts, discount deductions, GST deductions, and net yield
              </Typography>

              <Box sx={{ width: "100%", height: 320 }}>
                <ResponsiveContainer width="100%" height="100%">
                  <AreaChart data={REVENUE_TREND_DATA} margin={{ top: 10, right: 10, left: -10, bottom: 0 }}>
                    <defs>
                      <linearGradient id="grossRevGrad" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="#10B981" stopOpacity={0.4} />
                        <stop offset="95%" stopColor="#10B981" stopOpacity={0.0} />
                      </linearGradient>
                      <linearGradient id="netRevGrad" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="#0F766E" stopOpacity={0.4} />
                        <stop offset="95%" stopColor="#0F766E" stopOpacity={0.0} />
                      </linearGradient>
                    </defs>
                    <CartesianGrid strokeDasharray="3 3" stroke="rgba(27,42,67,0.06)" />
                    <XAxis dataKey="month" tick={{ fontSize: 11, fill: BI_COLORS.neutral, fontWeight: 700 }} axisLine={false} tickLine={false} />
                    <YAxis tick={{ fontSize: 11, fill: BI_COLORS.neutral, fontWeight: 600 }} tickFormatter={(v) => formatCompactINR(v)} axisLine={false} tickLine={false} />
                    <RechartsTooltip formatter={(v) => formatINR(v)} contentStyle={{ borderRadius: 12, border: `1px solid ${BI_COLORS.border}` }} />
                    <Legend />
                    <Area type="monotone" dataKey="gross" name="Gross Revenue" stroke="#10B981" strokeWidth={3} fill="url(#grossRevGrad)" />
                    <Area type="monotone" dataKey="net" name="Net Revenue" stroke="#0F766E" strokeWidth={3} fill="url(#netRevGrad)" />
                  </AreaChart>
                </ResponsiveContainer>
              </Box>
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12} lg={4}>
          <Card sx={{ borderRadius: "20px", border: `1px solid ${BI_COLORS.border}`, boxShadow: "0 4px 20px rgba(15, 23, 42, 0.04)", height: "100%" }}>
            <CardContent sx={{ p: 3 }}>
              <Typography sx={{ fontSize: "1.1rem", fontWeight: 900, color: BI_COLORS.navy }}>
                Revenue Stream Mix
              </Typography>
              <Typography sx={{ fontSize: "0.8rem", color: BI_COLORS.neutral, mb: 2 }}>
                Contribution by monetization stream
              </Typography>

              <Box sx={{ width: "100%", height: 220 }}>
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie data={REVENUE_BREAKDOWN_DONUT} innerRadius={58} outerRadius={85} paddingAngle={4} dataKey="value">
                      {REVENUE_BREAKDOWN_DONUT.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.color} />
                      ))}
                    </Pie>
                    <RechartsTooltip formatter={(v) => formatINR(v)} contentStyle={{ borderRadius: 12 }} />
                  </PieChart>
                </ResponsiveContainer>
              </Box>

              <Stack spacing={1} sx={{ mt: 1 }}>
                {REVENUE_BREAKDOWN_DONUT.map((item) => (
                  <Stack key={item.name} direction="row" justifyContent="space-between" alignItems="center">
                    <Stack direction="row" spacing={1} alignItems="center">
                      <Box sx={{ width: 10, height: 10, borderRadius: "50%", bgcolor: item.color }} />
                      <Typography sx={{ fontSize: 12, fontWeight: 700, color: BI_COLORS.navy }}>{item.name}</Typography>
                    </Stack>
                    <Typography sx={{ fontSize: 12.5, fontWeight: 900, color: BI_COLORS.navy }}>{formatINR(item.value)}</Typography>
                  </Stack>
                ))}
              </Stack>
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      {/* Row 2: Top 10 Sellers Horizontal Bar & Monthly Comparison */}
      <Grid container spacing={2.5}>
        <Grid item xs={12} lg={7}>
          <Card sx={{ borderRadius: "20px", border: `1px solid ${BI_COLORS.border}`, boxShadow: "0 4px 20px rgba(15, 23, 42, 0.04)" }}>
            <CardContent sx={{ p: 3 }}>
              <Typography sx={{ fontSize: "1.1rem", fontWeight: 900, color: BI_COLORS.navy }}>
                Top 10 Sellers by Revenue
              </Typography>
              <Typography sx={{ fontSize: "0.8rem", color: BI_COLORS.neutral, mb: 2 }}>
                Highest grossing verified seller partners
              </Typography>

              <Box sx={{ width: "100%", height: 300 }}>
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart layout="vertical" data={TOP_10_SELLERS_REVENUE} margin={{ top: 5, right: 20, left: 70, bottom: 0 }}>
                    <CartesianGrid strokeDasharray="3 3" stroke="rgba(27,42,67,0.06)" />
                    <XAxis type="number" tick={{ fontSize: 11, fill: BI_COLORS.neutral }} tickFormatter={(v) => formatCompactINR(v)} axisLine={false} tickLine={false} />
                    <YAxis type="category" dataKey="name" tick={{ fontSize: 10.5, fill: BI_COLORS.navy, fontWeight: 700 }} axisLine={false} tickLine={false} />
                    <RechartsTooltip formatter={(v) => formatINR(v)} contentStyle={{ borderRadius: 12 }} />
                    <Bar dataKey="revenue" name="Revenue" fill={BI_COLORS.property} radius={[0, 6, 6, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              </Box>
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12} lg={5}>
          <Card sx={{ borderRadius: "20px", border: `1px solid ${BI_COLORS.border}`, boxShadow: "0 4px 20px rgba(15, 23, 42, 0.04)" }}>
            <CardContent sx={{ p: 3 }}>
              <Typography sx={{ fontSize: "1.1rem", fontWeight: 900, color: BI_COLORS.navy }}>
                Weekly Run-Rate Comparison
              </Typography>
              <Typography sx={{ fontSize: "0.8rem", color: BI_COLORS.neutral, mb: 2 }}>
                Current month pacing vs previous month
              </Typography>

              <Box sx={{ width: "100%", height: 300 }}>
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={MONTHLY_REVENUE_COMPARISON} margin={{ top: 10, right: 10, left: -10, bottom: 0 }}>
                    <CartesianGrid strokeDasharray="3 3" stroke="rgba(27,42,67,0.06)" />
                    <XAxis dataKey="metric" tick={{ fontSize: 11, fill: BI_COLORS.neutral, fontWeight: 700 }} axisLine={false} tickLine={false} />
                    <YAxis tick={{ fontSize: 11, fill: BI_COLORS.neutral, fontWeight: 600 }} tickFormatter={(v) => formatCompactINR(v)} axisLine={false} tickLine={false} />
                    <RechartsTooltip formatter={(v) => formatINR(v)} contentStyle={{ borderRadius: 12 }} />
                    <Legend />
                    <Bar dataKey="current" name="Current Month" fill="#10B981" radius={[6, 6, 0, 0]} />
                    <Bar dataKey="previous" name="Previous Month" fill="#94A3B8" radius={[6, 6, 0, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              </Box>
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      {/* Row 3: Revenue Audit Table */}
      <Card sx={{ borderRadius: "20px", border: `1px solid ${BI_COLORS.border}`, boxShadow: "0 4px 20px rgba(15, 23, 42, 0.04)" }}>
        <CardContent sx={{ p: 3 }}>
          <Typography sx={{ fontSize: "1.1rem", fontWeight: 900, color: BI_COLORS.navy, mb: 0.5 }}>
            Detailed Financial Ledger
          </Typography>
          <Typography sx={{ fontSize: "0.8rem", color: BI_COLORS.neutral, mb: 2 }}>
            Complete audit trail with gross receipts, discounts, GST, and net settlement
          </Typography>

          <TableContainer>
            <Table size="small">
              <TableHead>
                <TableRow sx={{ "& th": { fontWeight: 850, fontSize: "0.8rem", color: BI_COLORS.neutral, bgcolor: "#F8FAFC" } }}>
                  <TableCell>Date</TableCell>
                  <TableCell>Transaction ID</TableCell>
                  <TableCell>Customer</TableCell>
                  <TableCell>Seller Partner</TableCell>
                  <TableCell>Category</TableCell>
                  <TableCell align="right">Gross</TableCell>
                  <TableCell align="right">Discount</TableCell>
                  <TableCell align="right">GST (18%)</TableCell>
                  <TableCell align="right">Net Yield</TableCell>
                  <TableCell>Payment Status</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {filteredRevenueTable.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={10} align="center" sx={{ py: 4, color: BI_COLORS.neutral }}>
                      No revenue transactions found in the database.
                    </TableCell>
                  </TableRow>
                ) : (
                  filteredRevenueTable.map((row) => (
                    <TableRow key={row.id} hover sx={{ "& td": { fontSize: "0.83rem", fontWeight: 650, py: 1.4 } }}>
                      <TableCell sx={{ color: BI_COLORS.neutral }}>{row.date || "—"}</TableCell>
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
                      <TableCell align="right" sx={{ fontWeight: 800 }}>{formatINR(row.gross)}</TableCell>
                      <TableCell align="right" sx={{ color: "#EF4444" }}>-{formatINR(row.discount)}</TableCell>
                      <TableCell align="right" sx={{ color: "#F59E0B" }}>{formatINR(row.gst)}</TableCell>
                      <TableCell align="right" sx={{ fontWeight: 900, color: "#10B981" }}>{formatINR(row.net)}</TableCell>
                      <TableCell>
                        <Chip
                          size="small"
                          label={row.status}
                          sx={{
                            height: 22,
                            fontSize: "0.72rem",
                            fontWeight: 800,
                            bgcolor: row.status === "Paid" ? "#DCFCE7" : "#FEF3C7",
                            color: row.status === "Paid" ? "#166534" : "#B45309",
                          }}
                        />
                      </TableCell>
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
