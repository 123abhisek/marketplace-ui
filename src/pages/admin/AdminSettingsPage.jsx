import {
  Box,
  Button,
  Card,
  CardContent,
  Divider,
  Stack,
  Switch,
  Typography,
} from "@mui/material";

const cardSx = {
  borderRadius: "20px",
  border: "1px solid rgba(15,23,42,0.08)",
  boxShadow: "0 10px 30px rgba(15,23,42,0.05)",
  background: "#fff",
};

function SettingRow({ title, desc, action }) {
  return (
    <Stack direction="row" justifyContent="space-between" alignItems="center" spacing={2}>
      <Box>
        <Typography sx={{ fontWeight: 800, color: "#0f172a" }}>{title}</Typography>
        <Typography sx={{ fontSize: "0.82rem", color: "#64748b", mt: 0.4 }}>{desc}</Typography>
      </Box>
      {action}
    </Stack>
  );
}

export default function AdminSettingsPage() {
  return (
    <Box sx={{ p: { xs: 2, md: 3 }, background: "#f8fafc", minHeight: "100vh" }}>
      <Stack spacing={3}>
        <Box>
          <Typography sx={{ fontSize: "1.7rem", fontWeight: 900, color: "#0f172a" }}>
            Admin Settings
          </Typography>
          <Typography sx={{ mt: 0.7, fontSize: "0.9rem", color: "#64748b" }}>
            Configure platform behavior, moderation defaults, and admin preferences.
          </Typography>
        </Box>

        <Card sx={cardSx}>
          <CardContent sx={{ p: 2.8 }}>
            <Stack spacing={2.2}>
              <SettingRow
                title="Enable listing moderation"
                desc="Review all new listings before they become publicly visible."
                action={<Switch defaultChecked />}
              />
              <Divider />
              <SettingRow
                title="Email report alerts"
                desc="Send admin alerts whenever a new abuse report is created."
                action={<Switch defaultChecked />}
              />
              <Divider />
              <SettingRow
                title="Allow premium auto-activation"
                desc="Automatically activate premium after successful payment."
                action={<Switch defaultChecked />}
              />
              <Divider />
              <SettingRow
                title="Export admin data"
                desc="Download user, listing, and moderation summaries for review."
                action={
                  <Button
                    variant="contained"
                    sx={{
                      borderRadius: "12px",
                      textTransform: "none",
                      fontWeight: 700,
                      bgcolor: "#0f766e",
                    }}
                  >
                    Export
                  </Button>
                }
              />
            </Stack>
          </CardContent>
        </Card>
      </Stack>
    </Box>
  );
}