// src/components/analytics/GSTReportView.jsx
import React, { useMemo } from "react";
import {
  Box,
  Button,
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
import AccountBalanceRoundedIcon from "@mui/icons-material/AccountBalanceRounded";
import ReceiptLongRoundedIcon from "@mui/icons-material/ReceiptLongRounded";
import DownloadRoundedIcon from "@mui/icons-material/DownloadRounded";
import CurrencyRupeeRoundedIcon from "@mui/icons-material/CurrencyRupeeRounded";
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
  GST_COLLECTION_TREND,
  GST_BREAKDOWN_DONUT,
  GST_BY_CATEGORY_BAR,
  GST_REPORT_TABLE,
  formatINR,
  formatCompactINR,
} from "./analyticsData";

export default function GSTReportView({ searchQuery = "", onExportGST }) {
  const filteredInvoices = useMemo(() => {
    return GST_REPORT_TABLE.filter((item) => {
      const matchSearch =
        !searchQuery ||
        item.customer.toLowerCase().includes(searchQuery.toLowerCase()) ||
        item.invoice.toLowerCase().includes(searchQuery.toLowerCase());
      return matchSearch;
    });
  }, [searchQuery]);

  const handleExport = () => {
    if (onExportGST) {
      onExportGST();
      return;
    }
    // Client-side CSV generator for GST
    const headers = ["Invoice Number", "Date", "Customer", "Taxable Amount", "CGST", "SGST", "IGST", "Total GST", "Invoice Total"];
    const rows = GST_REPORT_TABLE.map((r) => [
      r.invoice,
      r.date,
      `"${r.customer}"`,
      r.taxable,
      r.cgst,
      r.sgst,
      r.igst,
      r.totalGst,
      r.total,
    ]);
    const csvContent = [headers.join(","), ...rows.map((e) => e.join(","))].join("\r\n");
    const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
    const url = window.URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = `GST_Report_${new Date().toISOString().slice(0, 10)}.csv`;
    document.body.appendChild(link);
    link.click();
    link.remove();
    window.URL.revokeObjectURL(url);
  };

  return (
    <Stack spacing={3}>
      {/* 5 Primary GST KPIs */}
      <Grid container spacing={2}>
        <Grid item xs={12} sm={6} lg={2.4}>
          <KPICard
            title="Total Taxable Amount"
            value="₹12,45,800"
            growth={18.4}
            comparison="Base taxable base"
            sparkColor="#2563EB"
            sparkline={[{ v: 640 }, { v: 780 }, { v: 850 }, { v: 1040 }, { v: 1245 }]}
            icon={<ReceiptLongRoundedIcon />}
            color="#2563EB"
          />
        </Grid>
        <Grid item xs={12} sm={6} lg={2.4}>
          <KPICard
            title="CGST (9%)"
            value="₹1,05,622"
            growth={15.2}
            comparison="Central GST portion"
            sparkColor="#0F766E"
            sparkline={[{ v: 57 }, { v: 70 }, { v: 76 }, { v: 89 }, { v: 105 }]}
            icon={<AccountBalanceRoundedIcon />}
            color="#0F766E"
          />
        </Grid>
        <Grid item xs={12} sm={6} lg={2.4}>
          <KPICard
            title="SGST (9%)"
            value="₹1,05,622"
            growth={15.2}
            comparison="Karnataka State GST"
            sparkColor="#6366F1"
            sparkline={[{ v: 57 }, { v: 70 }, { v: 76 }, { v: 89 }, { v: 105 }]}
            icon={<AccountBalanceRoundedIcon />}
            color="#6366F1"
          />
        </Grid>
        <Grid item xs={12} sm={6} lg={2.4}>
          <KPICard
            title="IGST (18%)"
            value="₹13,000"
            growth={18.0}
            comparison="Interstate transactions"
            sparkColor="#F59E0B"
            sparkline={[{ v: 0 }, { v: 0 }, { v: 7.6 }, { v: 9.2 }, { v: 13 }]}
            icon={<AccountBalanceRoundedIcon />}
            color="#F59E0B"
          />
        </Grid>
        <Grid item xs={12} sm={6} lg={2.4}>
          <KPICard
            title="Total GST Collected"
            value="₹2,24,244"
            growth={15.2}
            comparison="100% Tax Compliant"
            sparkColor="#10B981"
            sparkline={[{ v: 115 }, { v: 140 }, { v: 153 }, { v: 187 }, { v: 224 }]}
            icon={<CurrencyRupeeRoundedIcon />}
            color="#10B981"
          />
        </Grid>
      </Grid>

      {/* Row 1: GST Trend Line & Breakdown Donut */}
      <Grid container spacing={2.5}>
        <Grid item xs={12} lg={8}>
          <Card sx={{ borderRadius: "20px", border: `1px solid ${BI_COLORS.border}`, boxShadow: "0 4px 20px rgba(15, 23, 42, 0.04)" }}>
            <CardContent sx={{ p: 3 }}>
              <Typography sx={{ fontSize: "1.1rem", fontWeight: 900, color: BI_COLORS.navy }}>
                GST Collection Trajectory
              </Typography>
              <Typography sx={{ fontSize: "0.8rem", color: BI_COLORS.neutral, mb: 2.5 }}>
                Monthly statutory tax collections mapped against taxable volume
              </Typography>

              <Box sx={{ width: "100%", height: 320 }}>
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={GST_COLLECTION_TREND} margin={{ top: 10, right: 10, left: -10, bottom: 0 }}>
                    <CartesianGrid strokeDasharray="3 3" stroke="rgba(27,42,67,0.06)" />
                    <XAxis dataKey="month" tick={{ fontSize: 11, fill: BI_COLORS.neutral, fontWeight: 700 }} axisLine={false} tickLine={false} />
                    <YAxis tick={{ fontSize: 11, fill: BI_COLORS.neutral, fontWeight: 600 }} tickFormatter={(v) => formatCompactINR(v)} axisLine={false} tickLine={false} />
                    <RechartsTooltip formatter={(v) => formatINR(v)} contentStyle={{ borderRadius: 12, border: `1px solid ${BI_COLORS.border}` }} />
                    <Legend />
                    <Line type="monotone" dataKey="gst" name="Total GST (18%)" stroke="#F59E0B" strokeWidth={3} dot={{ r: 4 }} />
                    <Line type="monotone" dataKey="cgst" name="CGST (9%)" stroke="#0F766E" strokeWidth={2} />
                    <Line type="monotone" dataKey="sgst" name="SGST (9%)" stroke="#2563EB" strokeWidth={2} />
                    <Line type="monotone" dataKey="igst" name="IGST (18%)" stroke="#8B5CF6" strokeWidth={2} />
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
                GST Tax Distribution
              </Typography>
              <Typography sx={{ fontSize: "0.8rem", color: BI_COLORS.neutral, mb: 2 }}>
                Central vs State vs Interstate tax share
              </Typography>

              <Box sx={{ width: "100%", height: 220 }}>
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie data={GST_BREAKDOWN_DONUT} innerRadius={58} outerRadius={85} paddingAngle={4} dataKey="value">
                      {GST_BREAKDOWN_DONUT.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.color} />
                      ))}
                    </Pie>
                    <RechartsTooltip formatter={(v) => formatINR(v)} contentStyle={{ borderRadius: 12 }} />
                  </PieChart>
                </ResponsiveContainer>
              </Box>

              <Stack spacing={1} sx={{ mt: 1 }}>
                {GST_BREAKDOWN_DONUT.map((item) => (
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

      {/* Row 2: Monthly Taxable vs GST Column & Category Bar */}
      <Grid container spacing={2.5}>
        <Grid item xs={12} lg={6}>
          <Card sx={{ borderRadius: "20px", border: `1px solid ${BI_COLORS.border}`, boxShadow: "0 4px 20px rgba(15, 23, 42, 0.04)" }}>
            <CardContent sx={{ p: 3 }}>
              <Typography sx={{ fontSize: "1.1rem", fontWeight: 900, color: BI_COLORS.navy }}>
                Monthly Taxable vs GST Split
              </Typography>
              <Typography sx={{ fontSize: "0.8rem", color: BI_COLORS.neutral, mb: 2 }}>
                Side-by-side comparison of base transaction amount and tax liability
              </Typography>

              <Box sx={{ width: "100%", height: 260 }}>
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={GST_COLLECTION_TREND} margin={{ top: 10, right: 10, left: -10, bottom: 0 }}>
                    <CartesianGrid strokeDasharray="3 3" stroke="rgba(27,42,67,0.06)" />
                    <XAxis dataKey="month" tick={{ fontSize: 11, fill: BI_COLORS.neutral, fontWeight: 700 }} axisLine={false} tickLine={false} />
                    <YAxis tick={{ fontSize: 11, fill: BI_COLORS.neutral, fontWeight: 600 }} tickFormatter={(v) => formatCompactINR(v)} axisLine={false} tickLine={false} />
                    <RechartsTooltip formatter={(v) => formatINR(v)} contentStyle={{ borderRadius: 12 }} />
                    <Legend />
                    <Bar dataKey="taxable" name="Taxable Value" fill="#2563EB" radius={[6, 6, 0, 0]} />
                    <Bar dataKey="gst" name="GST Output" fill="#F59E0B" radius={[6, 6, 0, 0]} />
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
                GST Collections by Marketplace Category
              </Typography>
              <Typography sx={{ fontSize: "0.8rem", color: BI_COLORS.neutral, mb: 2 }}>
                GST contribution across Properties, Vehicles, and Subscriptions
              </Typography>

              <Box sx={{ width: "100%", height: 260 }}>
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={GST_BY_CATEGORY_BAR} margin={{ top: 10, right: 10, left: -10, bottom: 0 }}>
                    <CartesianGrid strokeDasharray="3 3" stroke="rgba(27,42,67,0.06)" />
                    <XAxis dataKey="category" tick={{ fontSize: 11, fill: BI_COLORS.neutral, fontWeight: 700 }} axisLine={false} tickLine={false} />
                    <YAxis tick={{ fontSize: 11, fill: BI_COLORS.neutral, fontWeight: 600 }} tickFormatter={(v) => formatCompactINR(v)} axisLine={false} tickLine={false} />
                    <RechartsTooltip formatter={(v) => formatINR(v)} contentStyle={{ borderRadius: 12 }} />
                    <Legend />
                    <Bar dataKey="taxable" name="Taxable" fill="#0F766E" radius={[6, 6, 0, 0]} />
                    <Bar dataKey="gst" name="GST (18%)" fill="#F59E0B" radius={[6, 6, 0, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              </Box>
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      {/* Row 3: GST Invoice Audit Table */}
      <Card sx={{ borderRadius: "20px", border: `1px solid ${BI_COLORS.border}`, boxShadow: "0 4px 20px rgba(15, 23, 42, 0.04)" }}>
        <CardContent sx={{ p: 3 }}>
          <Stack direction={{ xs: "column", sm: "row" }} justifyContent="space-between" alignItems={{ sm: "center" }} gap={1.5} mb={2}>
            <Box>
              <Typography sx={{ fontSize: "1.1rem", fontWeight: 900, color: BI_COLORS.navy }}>
                Statutory GST Invoice Ledger
              </Typography>
              <Typography sx={{ fontSize: "0.8rem", color: BI_COLORS.neutral, mt: 0.2 }}>
                GSTR-1 Ready Invoice records with state and central tax itemization
              </Typography>
            </Box>
            <Button
              variant="contained"
              onClick={handleExport}
              startIcon={<DownloadRoundedIcon />}
              sx={{
                borderRadius: "12px",
                background: "#0F766E",
                fontWeight: 800,
                fontSize: "0.82rem",
                textTransform: "none",
                "&:hover": { background: "#0B5F59" },
              }}
            >
              Export GST Report (CSV)
            </Button>
          </Stack>

          <TableContainer>
            <Table size="small">
              <TableHead>
                <TableRow sx={{ "& th": { fontWeight: 850, fontSize: "0.8rem", color: BI_COLORS.neutral, bgcolor: "#F8FAFC" } }}>
                  <TableCell>Invoice Number</TableCell>
                  <TableCell>Date</TableCell>
                  <TableCell>Customer</TableCell>
                  <TableCell align="right">Taxable Value</TableCell>
                  <TableCell align="right">CGST (9%)</TableCell>
                  <TableCell align="right">SGST (9%)</TableCell>
                  <TableCell align="right">IGST (18%)</TableCell>
                  <TableCell align="right">Total GST</TableCell>
                  <TableCell align="right">Invoice Total</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {filteredInvoices.map((row) => (
                  <TableRow key={row.invoice} hover sx={{ "& td": { fontSize: "0.83rem", fontWeight: 650, py: 1.4 } }}>
                    <TableCell sx={{ fontWeight: 800, color: BI_COLORS.navy }}>{row.invoice}</TableCell>
                    <TableCell sx={{ color: BI_COLORS.neutral }}>{row.date}</TableCell>
                    <TableCell>{row.customer}</TableCell>
                    <TableCell align="right" sx={{ fontWeight: 750 }}>{formatINR(row.taxable)}</TableCell>
                    <TableCell align="right" sx={{ color: "#0F766E" }}>{formatINR(row.cgst)}</TableCell>
                    <TableCell align="right" sx={{ color: "#2563EB" }}>{formatINR(row.sgst)}</TableCell>
                    <TableCell align="right" sx={{ color: "#8B5CF6" }}>{formatINR(row.igst)}</TableCell>
                    <TableCell align="right" sx={{ fontWeight: 800, color: "#F59E0B" }}>{formatINR(row.totalGst)}</TableCell>
                    <TableCell align="right" sx={{ fontWeight: 950, color: BI_COLORS.navy }}>{formatINR(row.total)}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        </CardContent>
      </Card>
    </Stack>
  );
}
