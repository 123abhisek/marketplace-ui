// src/components/analytics/UserSellerReportView.jsx
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
import PeopleAltRoundedIcon from "@mui/icons-material/PeopleAltRounded";
import PersonAddRoundedIcon from "@mui/icons-material/PersonAddRounded";
import StorefrontRoundedIcon from "@mui/icons-material/StorefrontRounded";
import WorkspacePremiumRoundedIcon from "@mui/icons-material/WorkspacePremiumRounded";
import HowToRegRoundedIcon from "@mui/icons-material/HowToRegRounded";
import HourglassTopRoundedIcon from "@mui/icons-material/HourglassTopRounded";
import {
  ResponsiveContainer,
  LineChart,
  Line,
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
  USER_GROWTH_TREND,
  USER_TYPE_DONUT,
  SELLER_GROWTH_TREND,
  SELLER_REQUEST_STATUS_DONUT,
  TOP_SELLERS_TABLE,
} from "./analyticsData";

export default function UserSellerReportView({ searchQuery = "" }) {
  const filteredSellers = useMemo(() => {
    return TOP_SELLERS_TABLE.filter((item) => {
      const matchSearch =
        !searchQuery ||
        item.seller.toLowerCase().includes(searchQuery.toLowerCase());
      return matchSearch;
    });
  }, [searchQuery]);

  return (
    <Stack spacing={3}>
      {/* 6 Primary User & Seller KPIs */}
      <Grid container spacing={2}>
        <Grid item xs={12} sm={6} md={4} lg={2}>
          <KPICard
            title="Total Users"
            value="5,890"
            growth={21.3}
            comparison="+880 this month"
            sparkColor="#2563EB"
            sparkline={[{ v: 2100 }, { v: 3010 }, { v: 4240 }, { v: 5010 }, { v: 5890 }]}
            icon={<PeopleAltRoundedIcon />}
            color="#2563EB"
          />
        </Grid>
        <Grid item xs={12} sm={6} md={4} lg={2}>
          <KPICard
            title="New Signups"
            value="880"
            growth={14.2}
            comparison="New monthly joins"
            sparkColor="#10B981"
            sparkline={[{ v: 320 }, { v: 490 }, { v: 660 }, { v: 770 }, { v: 880 }]}
            icon={<PersonAddRoundedIcon />}
            color="#10B981"
          />
        </Grid>
        <Grid item xs={12} sm={6} md={4} lg={2}>
          <KPICard
            title="Active Accounts"
            value="4,180"
            growth={17.4}
            comparison="70.9% DAU/MAU"
            sparkColor="#0F766E"
            sparkline={[{ v: 1450 }, { v: 2100 }, { v: 2980 }, { v: 3560 }, { v: 4180 }]}
            icon={<HowToRegRoundedIcon />}
            color="#0F766E"
          />
        </Grid>
        <Grid item xs={12} sm={6} md={4} lg={2}>
          <KPICard
            title="Premium Members"
            value="1,298"
            growth={22.0}
            comparison="₹299 plan conversion"
            sparkColor="#8B5CF6"
            sparkline={[{ v: 480 }, { v: 690 }, { v: 920 }, { v: 1110 }, { v: 1298 }]}
            icon={<WorkspacePremiumRoundedIcon />}
            color="#8B5CF6"
          />
        </Grid>
        <Grid item xs={12} sm={6} md={4} lg={2}>
          <KPICard
            title="Verified Sellers"
            value="342"
            growth={9.8}
            comparison="Active merchant base"
            sparkColor="#F59E0B"
            sparkline={[{ v: 190 }, { v: 250 }, { v: 305 }, { v: 325 }, { v: 342 }]}
            icon={<StorefrontRoundedIcon />}
            color="#F59E0B"
          />
        </Grid>
        <Grid item xs={12} sm={6} md={4} lg={2}>
          <KPICard
            title="Pending Requests"
            value="28"
            growth={-12.5}
            comparison="Awaiting approval"
            sparkColor="#EF4444"
            sparkline={[{ v: 45 }, { v: 38 }, { v: 34 }, { v: 30 }, { v: 28 }]}
            icon={<HourglassTopRoundedIcon />}
            color="#EF4444"
          />
        </Grid>
      </Grid>

      {/* Row 1: User Growth Line & User Type Donut */}
      <Grid container spacing={2.5}>
        <Grid item xs={12} lg={8}>
          <Card sx={{ borderRadius: "20px", border: `1px solid ${BI_COLORS.border}`, boxShadow: "0 4px 20px rgba(15, 23, 42, 0.04)" }}>
            <CardContent sx={{ p: 3 }}>
              <Typography sx={{ fontSize: "1.1rem", fontWeight: 900, color: BI_COLORS.navy }}>
                User Growth & Engagement Velocity
              </Typography>
              <Typography sx={{ fontSize: "0.8rem", color: BI_COLORS.neutral, mb: 2.5 }}>
                Monthly trajectory of total registered users, new monthly additions, and active users
              </Typography>

              <Box sx={{ width: "100%", height: 300 }}>
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={USER_GROWTH_TREND} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                    <CartesianGrid strokeDasharray="3 3" stroke="rgba(27,42,67,0.06)" />
                    <XAxis dataKey="month" tick={{ fontSize: 11, fill: BI_COLORS.neutral, fontWeight: 700 }} axisLine={false} tickLine={false} />
                    <YAxis tick={{ fontSize: 11, fill: BI_COLORS.neutral, fontWeight: 600 }} axisLine={false} tickLine={false} />
                    <RechartsTooltip contentStyle={{ borderRadius: 12, border: `1px solid ${BI_COLORS.border}` }} />
                    <Legend />
                    <Line type="monotone" dataKey="totalUsers" name="Total User Base" stroke="#2563EB" strokeWidth={3} dot={{ r: 4 }} />
                    <Line type="monotone" dataKey="activeUsers" name="Monthly Active" stroke="#0F766E" strokeWidth={2} />
                    <Line type="monotone" dataKey="newUsers" name="New Registrations" stroke="#10B981" strokeWidth={2} strokeDasharray="3 3" />
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
                User Base Composition
              </Typography>
              <Typography sx={{ fontSize: "0.8rem", color: BI_COLORS.neutral, mb: 2 }}>
                Segment distribution across user roles
              </Typography>

              <Box sx={{ width: "100%", height: 200 }}>
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie data={USER_TYPE_DONUT} innerRadius={55} outerRadius={80} paddingAngle={4} dataKey="value">
                      {USER_TYPE_DONUT.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.color} />
                      ))}
                    </Pie>
                    <RechartsTooltip contentStyle={{ borderRadius: 12 }} />
                  </PieChart>
                </ResponsiveContainer>
              </Box>

              <Stack spacing={1} sx={{ mt: 1 }}>
                {USER_TYPE_DONUT.map((item) => (
                  <Stack key={item.name} direction="row" justifyContent="space-between" alignItems="center">
                    <Stack direction="row" spacing={1} alignItems="center">
                      <Box sx={{ width: 10, height: 10, borderRadius: "50%", bgcolor: item.color }} />
                      <Typography sx={{ fontSize: 12, fontWeight: 700, color: BI_COLORS.navy }}>{item.name}</Typography>
                    </Stack>
                    <Typography sx={{ fontSize: 12.5, fontWeight: 900, color: BI_COLORS.navy }}>{item.value.toLocaleString()}</Typography>
                  </Stack>
                ))}
              </Stack>
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      {/* Row 2: Seller Growth & Request Status Donut */}
      <Grid container spacing={2.5}>
        <Grid item xs={12} lg={8}>
          <Card sx={{ borderRadius: "20px", border: `1px solid ${BI_COLORS.border}`, boxShadow: "0 4px 20px rgba(15, 23, 42, 0.04)" }}>
            <CardContent sx={{ p: 3 }}>
              <Typography sx={{ fontSize: "1.1rem", fontWeight: 900, color: BI_COLORS.navy }}>
                Seller Onboarding & Approval Trajectory
              </Typography>
              <Typography sx={{ fontSize: "0.8rem", color: BI_COLORS.neutral, mb: 2 }}>
                Track applications received vs approved active sellers
              </Typography>

              <Box sx={{ width: "100%", height: 260 }}>
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={SELLER_GROWTH_TREND} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                    <CartesianGrid strokeDasharray="3 3" stroke="rgba(27,42,67,0.06)" />
                    <XAxis dataKey="month" tick={{ fontSize: 11, fill: BI_COLORS.neutral, fontWeight: 700 }} axisLine={false} tickLine={false} />
                    <YAxis tick={{ fontSize: 11, fill: BI_COLORS.neutral, fontWeight: 600 }} axisLine={false} tickLine={false} />
                    <RechartsTooltip contentStyle={{ borderRadius: 12 }} />
                    <Legend />
                    <Line type="monotone" dataKey="registered" name="Total Applied" stroke="#F59E0B" strokeWidth={3} dot={{ r: 4 }} />
                    <Line type="monotone" dataKey="approved" name="Approved & Active" stroke="#10B981" strokeWidth={3} dot={{ r: 4 }} />
                    <Line type="monotone" dataKey="pending" name="Pending Review" stroke="#EF4444" strokeWidth={2} strokeDasharray="3 3" />
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
                Seller Application Status
              </Typography>
              <Typography sx={{ fontSize: "0.8rem", color: BI_COLORS.neutral, mb: 2 }}>
                Review approval rate
              </Typography>

              <Box sx={{ width: "100%", height: 180 }}>
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie data={SELLER_REQUEST_STATUS_DONUT} innerRadius={50} outerRadius={75} paddingAngle={4} dataKey="value">
                      {SELLER_REQUEST_STATUS_DONUT.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.color} />
                      ))}
                    </Pie>
                    <RechartsTooltip contentStyle={{ borderRadius: 12 }} />
                  </PieChart>
                </ResponsiveContainer>
              </Box>

              <Stack spacing={1} sx={{ mt: 1 }}>
                {SELLER_REQUEST_STATUS_DONUT.map((item) => (
                  <Stack key={item.name} direction="row" justifyContent="space-between" alignItems="center">
                    <Stack direction="row" spacing={1} alignItems="center">
                      <Box sx={{ width: 10, height: 10, borderRadius: "50%", bgcolor: item.color }} />
                      <Typography sx={{ fontSize: 12, fontWeight: 700, color: BI_COLORS.navy }}>{item.name}</Typography>
                    </Stack>
                    <Typography sx={{ fontSize: 12.5, fontWeight: 900, color: BI_COLORS.navy }}>{item.value}</Typography>
                  </Stack>
                ))}
              </Stack>
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      {/* Row 3: Top Sellers League Table */}
      <Card sx={{ borderRadius: "20px", border: `1px solid ${BI_COLORS.border}`, boxShadow: "0 4px 20px rgba(15, 23, 42, 0.04)" }}>
        <CardContent sx={{ p: 3 }}>
          <Typography sx={{ fontSize: "1.1rem", fontWeight: 900, color: BI_COLORS.navy, mb: 0.5 }}>
            Top Merchant Partners League Table
          </Typography>
          <Typography sx={{ fontSize: "0.8rem", color: BI_COLORS.neutral, mb: 2 }}>
            Ranked performance of top sellers across inventory size, buyer engagement, revenue generated, and deal conversion
          </Typography>

          <TableContainer>
            <Table size="small">
              <TableHead>
                <TableRow sx={{ "& th": { fontWeight: 850, fontSize: "0.8rem", color: BI_COLORS.neutral, bgcolor: "#F8FAFC" } }}>
                  <TableCell>Rank</TableCell>
                  <TableCell>Seller Partner</TableCell>
                  <TableCell align="right">Listings</TableCell>
                  <TableCell align="right">Listing Views</TableCell>
                  <TableCell align="right">Enquiries</TableCell>
                  <TableCell align="right">Bookings</TableCell>
                  <TableCell align="right">Revenue</TableCell>
                  <TableCell align="right">Conversion Rate</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {filteredSellers.map((row) => (
                  <TableRow key={row.rank} hover sx={{ "& td": { fontSize: "0.83rem", fontWeight: 650, py: 1.4 } }}>
                    <TableCell sx={{ fontWeight: 950, color: BI_COLORS.navy }}>#{row.rank}</TableCell>
                    <TableCell sx={{ fontWeight: 800, color: BI_COLORS.navy }}>{row.seller}</TableCell>
                    <TableCell align="right">{row.listings}</TableCell>
                    <TableCell align="right">{row.views.toLocaleString()}</TableCell>
                    <TableCell align="right">{row.enquiries}</TableCell>
                    <TableCell align="right">{row.bookings}</TableCell>
                    <TableCell align="right" sx={{ fontWeight: 900, color: "#10B981" }}>{row.revenue}</TableCell>
                    <TableCell align="right">
                      <Chip
                        size="small"
                        label={row.rate}
                        sx={{ height: 22, fontWeight: 800, fontSize: "0.74rem", bgcolor: "#DCFCE7", color: "#166534" }}
                      />
                    </TableCell>
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
