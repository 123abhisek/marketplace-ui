import { Box, Stack, Typography } from "@mui/material";
import { Outlet } from "react-router-dom";

export default function AdminLayout() {
  return (
    <Box sx={{ minHeight: "100vh", background: "#f8fafc" }}>
      <Box
        sx={{
          px: { xs: 2, md: 3 },
          py: 2,
          borderBottom: "1px solid rgba(15,23,42,0.08)",
          background: "#fff",
          position: "sticky",
          top: 0,
          zIndex: 20,
        }}
      >
        <Stack direction="row" alignItems="center" justifyContent="space-between">
          <Typography sx={{ fontWeight: 900, fontSize: "1.1rem", color: "#0f172a" }}>
            EasyDeal Admin
          </Typography>
        </Stack>
      </Box>

      <Outlet />
    </Box>
  );
}