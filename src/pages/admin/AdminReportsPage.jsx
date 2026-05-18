
import React, { useMemo } from "react";
import {
  Box,
  Card,
  CardContent,
  Chip,
  Grid,
  Stack,
  Typography,
} from "@mui/material";
import ReportProblemRoundedIcon from "@mui/icons-material/ReportProblemRounded";
import TrendingUpRoundedIcon from "@mui/icons-material/TrendingUpRounded";
import FactCheckRoundedIcon from "@mui/icons-material/FactCheckRounded";
import HourglassTopRoundedIcon from "@mui/icons-material/HourglassTopRounded";

const cardSx = {
  borderRadius: "20px",
  border: "1px solid rgba(15,23,42,0.08)",
  boxShadow: "0 10px 30px rgba(15,23,42,0.05)",
  background: "#fff",
};

const reports = [
  {
    id: 1,
    issue: "Spam vehicle listing",
    status: "Open",
    details: "Repeated promotional content detected in vehicle post.",
  },
  {
    id: 2,
    issue: "Duplicate property post",
    status: "Resolved",
    details: "Duplicate apartment listing removed by moderator.",
  },
  {
    id: 3,
    issue: "Suspicious user behavior",
    status: "Investigating",
    details: "Multiple rapid actions flagged for manual review.",
  },
  {
    id: 4,
    issue: "Fake pricing complaint",
    status: "Open",
    details: "User reported misleading listing price information.",
  },
];

function getStatusTone(status = "") {
  const value = status.toLowerCase();

  if (value === "resolved") {
    return {
      color: "#0f766e",
      bg: "rgba(15,118,110,0.10)",
    };
  }

  if (value === "investigating") {
    return {
      color: "#2563eb",
      bg: "rgba(37,99,235,0.10)",
    };
  }

  return {
    color: "#dc2626",
    bg: "rgba(220,38,38,0.10)",
  };
}

export default function AdminReportsPage() {
  const metrics = useMemo(() => {
    const openReports = reports.filter((item) => item.status === "Open").length;
    const resolvedReports = reports.filter((item) => item.status === "Resolved").length;
    const investigatingReports = reports.filter(
      (item) => item.status === "Investigating"
    ).length;

    const weeklyTrend = reports.length
      ? `+${Math.round((resolvedReports / reports.length) * 100)}%`
      : "0%";

    return [
      {
        label: "Open reports",
        value: openReports,
        color: "#dc2626",
        bg: "rgba(220,38,38,0.10)",
        icon: <ReportProblemRoundedIcon />,
      },
      {
        label: "Resolved",
        value: resolvedReports,
        color: "#0f766e",
        bg: "rgba(15,118,110,0.10)",
        icon: <FactCheckRoundedIcon />,
      },
      {
        label: "Investigating",
        value: investigatingReports,
        color: "#d97706",
        bg: "rgba(217,119,6,0.10)",
        icon: <HourglassTopRoundedIcon />,
      },
      {
        label: "Weekly trend",
        value: weeklyTrend,
        color: "#2563eb",
        bg: "rgba(37,99,235,0.10)",
        icon: <TrendingUpRoundedIcon />,
      },
    ];
  }, []);

  return (
    <Box sx={{ p: { xs: 2, md: 3 }, background: "#f8fafc", minHeight: "100vh" }}>
      <Stack spacing={3}>
        <Box>
          <Typography sx={{ fontSize: "1.7rem", fontWeight: 900, color: "#0f172a" }}>
            Reports & Analytics
          </Typography>
          <Typography sx={{ mt: 0.7, fontSize: "0.9rem", color: "#64748b" }}>
            Track moderation workload, abuse reports, and platform performance trends.
          </Typography>
        </Box>

        <Grid container spacing={2}>
          {metrics.map((item) => (
            <Grid item xs={12} sm={6} lg={3} key={item.label}>
              <Card sx={{ ...cardSx, height: "100%" }}>
                <CardContent sx={{ p: 2.5 }}>
                  <Stack direction="row" spacing={1.5} alignItems="center">
                    <Box
                      sx={{
                        width: 46,
                        height: 46,
                        borderRadius: "14px",
                        background: item.bg,
                        color: item.color,
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                      }}
                    >
                      {item.icon}
                    </Box>
                    <Box>
                      <Typography sx={{ fontSize: "0.76rem", color: "#64748b", fontWeight: 700 }}>
                        {item.label}
                      </Typography>
                      <Typography sx={{ fontSize: "1.45rem", fontWeight: 900, color: "#0f172a" }}>
                        {item.value}
                      </Typography>
                    </Box>
                  </Stack>
                </CardContent>
              </Card>
            </Grid>
          ))}
        </Grid>

        <Card sx={cardSx}>
          <CardContent sx={{ p: 2.8 }}>
            <Typography sx={{ fontWeight: 900, fontSize: "1rem", color: "#0f172a", mb: 2 }}>
              Recent Reports
            </Typography>

            <Stack spacing={1.4}>
              {reports.map((item) => {
                const tone = getStatusTone(item.status);

                return (
                  <Stack
                    key={item.id}
                    direction={{ xs: "column", sm: "row" }}
                    justifyContent="space-between"
                    alignItems={{ xs: "flex-start", sm: "center" }}
                    spacing={1}
                    sx={{
                      p: 1.6,
                      borderRadius: "16px",
                      border: "1px solid rgba(15,23,42,0.08)",
                      background: "#fff",
                    }}
                  >
                    <Box>
                      <Typography sx={{ fontSize: "0.9rem", color: "#334155", fontWeight: 700 }}>
                        {item.issue}
                      </Typography>
                      <Typography sx={{ mt: 0.45, fontSize: "0.78rem", color: "#64748b" }}>
                        {item.details}
                      </Typography>
                    </Box>

                    <Chip
                      label={item.status}
                      sx={{
                        fontWeight: 700,
                        color: tone.color,
                        background: tone.bg,
                        borderRadius: "999px",
                      }}
                    />
                  </Stack>
                );
              })}
            </Stack>
          </CardContent>
        </Card>
      </Stack>
    </Box>
  );
}