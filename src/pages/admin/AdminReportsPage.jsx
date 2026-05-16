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

const cardSx = {
  borderRadius: "20px",
  border: "1px solid rgba(15,23,42,0.08)",
  boxShadow: "0 10px 30px rgba(15,23,42,0.05)",
  background: "#fff",
};

export default function AdminReportsPage() {
  const metrics = [
    { label: "Open reports", value: 12, color: "#dc2626", bg: "rgba(220,38,38,0.10)", icon: <ReportProblemRoundedIcon /> },
    { label: "Resolved today", value: 8, color: "#0f766e", bg: "rgba(15,118,110,0.10)", icon: <FactCheckRoundedIcon /> },
    { label: "Weekly trend", value: "+14%", color: "#2563eb", bg: "rgba(37,99,235,0.10)", icon: <TrendingUpRoundedIcon /> },
  ];

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
            <Grid item xs={12} md={4} key={item.label}>
              <Card sx={cardSx}>
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
              {[
                { issue: "Spam vehicle listing", status: "Open" },
                { issue: "Duplicate property post", status: "Resolved" },
                { issue: "Suspicious user behavior", status: "Investigating" },
              ].map((item) => (
                <Stack key={item.issue} direction="row" justifyContent="space-between" alignItems="center">
                  <Typography sx={{ fontSize: "0.9rem", color: "#334155", fontWeight: 600 }}>
                    {item.issue}
                  </Typography>
                  <Chip label={item.status} sx={{ fontWeight: 700 }} />
                </Stack>
              ))}
            </Stack>
          </CardContent>
        </Card>
      </Stack>
    </Box>
  );
}