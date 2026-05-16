import {
  Box,
  Card,
  CardContent,
  Chip,
  Grid,
  Stack,
  Typography,
} from "@mui/material";
import HomeWorkRoundedIcon from "@mui/icons-material/HomeWorkRounded";
import DirectionsCarRoundedIcon from "@mui/icons-material/DirectionsCarRounded";
import { useAppState } from "../../hooks/useAppState";

const cardSx = {
  borderRadius: "20px",
  border: "1px solid rgba(15,23,42,0.08)",
  boxShadow: "0 10px 30px rgba(15,23,42,0.05)",
  background: "#fff",
};

export default function AdminListingsPage() {
  const { properties = [], vehicles = [] } = useAppState();

  const items = [
    ...properties.map((item, index) => ({
      id: item.id || `p-${index}`,
      type: "Property",
      title: item.title || "Untitled property",
      location: item.location || "Unknown location",
      price: item.price || item.expectedprice || "N/A",
    })),
    ...vehicles.map((item, index) => ({
      id: item.id || `v-${index}`,
      type: "Vehicle",
      title: item.title || "Untitled vehicle",
      location: item.location || "Unknown location",
      price: item.price || item.expectedprice || "N/A",
    })),
  ];

  return (
    <Box sx={{ p: { xs: 2, md: 3 }, background: "#f8fafc", minHeight: "100vh" }}>
      <Stack spacing={3}>
        <Box>
          <Typography sx={{ fontSize: "1.7rem", fontWeight: 900, color: "#0f172a" }}>
            Manage Listings
          </Typography>
          <Typography sx={{ mt: 0.7, fontSize: "0.9rem", color: "#64748b" }}>
            Review and manage all property and vehicle listings from one admin panel.
          </Typography>
        </Box>

        <Grid container spacing={2}>
          {items.map((item) => (
            <Grid item xs={12} md={6} lg={4} key={item.id}>
              <Card sx={cardSx}>
                <CardContent sx={{ p: 2.3 }}>
                  <Stack spacing={1.2}>
                    <Stack direction="row" justifyContent="space-between" alignItems="center">
                      <Chip
                        icon={item.type === "Property" ? <HomeWorkRoundedIcon /> : <DirectionsCarRoundedIcon />}
                        label={item.type}
                        sx={{
                          fontWeight: 700,
                          background: item.type === "Property" ? "rgba(15,118,110,0.10)" : "rgba(37,99,235,0.10)",
                          color: item.type === "Property" ? "#0f766e" : "#2563eb",
                        }}
                      />
                      <Chip label="Active" size="small" sx={{ fontWeight: 700 }} />
                    </Stack>

                    <Typography sx={{ fontWeight: 800, color: "#0f172a", fontSize: "1rem" }}>
                      {item.title}
                    </Typography>
                    <Typography sx={{ fontSize: "0.82rem", color: "#64748b" }}>
                      {item.location}
                    </Typography>
                    <Typography sx={{ fontSize: "0.9rem", fontWeight: 900, color: "#0f172a" }}>
                      ₹{item.price}
                    </Typography>
                  </Stack>
                </CardContent>
              </Card>
            </Grid>
          ))}
        </Grid>
      </Stack>
    </Box>
  );
}