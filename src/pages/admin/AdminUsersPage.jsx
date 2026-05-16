import {
  Avatar,
  Box,
  Button,
  Card,
  CardContent,
  Chip,
  Stack,
  Typography,
} from "@mui/material";

const cardSx = {
  borderRadius: "20px",
  border: "1px solid rgba(15,23,42,0.08)",
  boxShadow: "0 10px 30px rgba(15,23,42,0.05)",
  background: "#fff",
};

const users = [
  { id: 1, name: "Abhishek Juvatkar", email: "abhishek@example.com", role: "User", status: "Active", premium: true },
  { id: 2, name: "Neha Sharma", email: "neha@example.com", role: "User", status: "Active", premium: false },
  { id: 3, name: "Rahul Patil", email: "rahul@example.com", role: "Moderator", status: "Suspended", premium: true },
];

export default function AdminUsersPage() {
  return (
    <Box sx={{ p: { xs: 2, md: 3 }, background: "#f8fafc", minHeight: "100vh" }}>
      <Stack spacing={3}>
        <Box>
          <Typography sx={{ fontSize: "1.7rem", fontWeight: 900, color: "#0f172a" }}>
            Manage Users
          </Typography>
          <Typography sx={{ mt: 0.7, fontSize: "0.9rem", color: "#64748b" }}>
            Review user accounts, roles, premium status, and activity states.
          </Typography>
        </Box>

        <Stack spacing={2}>
          {users.map((user) => (
            <Card key={user.id} sx={cardSx}>
              <CardContent sx={{ p: 2.4 }}>
                <Stack
                  direction={{ xs: "column", md: "row" }}
                  spacing={2}
                  alignItems={{ md: "center" }}
                  justifyContent="space-between"
                >
                  <Stack direction="row" spacing={1.5} alignItems="center">
                    <Avatar sx={{ width: 46, height: 46, bgcolor: "#0f766e", fontWeight: 800 }}>
                      {user.name[0]}
                    </Avatar>
                    <Box>
                      <Typography sx={{ fontWeight: 800, color: "#0f172a" }}>{user.name}</Typography>
                      <Typography sx={{ fontSize: "0.82rem", color: "#64748b" }}>{user.email}</Typography>
                    </Box>
                  </Stack>

                  <Stack direction="row" spacing={1} flexWrap="wrap" useFlexGap>
                    <Chip label={user.role} sx={{ fontWeight: 700 }} />
                    <Chip
                      label={user.status}
                      sx={{
                        fontWeight: 700,
                        background: user.status === "Active" ? "rgba(15,118,110,0.10)" : "rgba(239,68,68,0.10)",
                        color: user.status === "Active" ? "#0f766e" : "#dc2626",
                      }}
                    />
                    <Chip
                      label={user.premium ? "Premium" : "Free"}
                      sx={{
                        fontWeight: 700,
                        background: user.premium ? "rgba(124,58,237,0.10)" : "rgba(100,116,139,0.10)",
                        color: user.premium ? "#7c3aed" : "#64748b",
                      }}
                    />
                  </Stack>

                  <Stack direction="row" spacing={1}>
                    <Button variant="outlined" sx={{ borderRadius: "12px", textTransform: "none", fontWeight: 700 }}>
                      View
                    </Button>
                    <Button variant="contained" sx={{ borderRadius: "12px", textTransform: "none", fontWeight: 700, bgcolor: "#0f766e" }}>
                      Edit
                    </Button>
                  </Stack>
                </Stack>
              </CardContent>
            </Card>
          ))}
        </Stack>
      </Stack>
    </Box>
  );
}