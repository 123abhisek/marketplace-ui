import { useState } from "react";
import {
  Alert,
  Box,
  Button,
  Card,
  CardContent,
  CircularProgress,
  Divider,
  Snackbar,
  Stack,
  Switch,
  Typography,
} from "@mui/material";
import DownloadRoundedIcon from "@mui/icons-material/DownloadRounded";
import adminOrdersService from "../../services/adminOrdersApi";

const cardSx = {
  borderRadius: "20px",
  border: "1px solid rgba(15,23,42,0.08)",
  boxShadow: "0 10px 30px rgba(15,23,42,0.05)",
  background: "#fff",
};

function SettingRow({ title, desc, action }) {
  return (
    <Stack direction={{ xs: "column", sm: "row" }} justifyContent="space-between" alignItems={{ sm: "center" }} spacing={2}>
      <Box>
        <Typography sx={{ fontWeight: 800, color: "#0f172a" }}>{title}</Typography>
        <Typography sx={{ fontSize: "0.82rem", color: "#64748b", mt: 0.4 }}>{desc}</Typography>
      </Box>
      {action}
    </Stack>
  );
}

export default function AdminSettingsPage() {
  const [exporting, setExporting] = useState(false);
  const [toast, setToast] = useState({ open: false, message: "", severity: "success" });

  const handleExportUsers = async () => {
    try {
      setExporting(true);
      const res = await adminOrdersService.exportUsers();
      const blob =
        res instanceof Blob
          ? res
          : new Blob([res?.data ?? res], {
              type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
            });
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.href = url;
      link.download = `EasyDeal_Users_Export_${new Date().toISOString().slice(0, 10)}.xlsx`;
      document.body.appendChild(link);
      link.click();
      link.remove();
      window.URL.revokeObjectURL(url);
      setToast({ open: true, message: "User data Excel file exported successfully!", severity: "success" });
    } catch (err) {
      console.error("Export user data error:", err);
      setToast({ open: true, message: "Failed to export user data. Please try again.", severity: "error" });
    } finally {
      setExporting(false);
    }
  };


  return (
    <Box sx={{ p: { xs: 2, md: 3 }, background: "#f8fafc", minHeight: "100vh" }}>
      <Stack spacing={3}>
        <Box>
          <Typography sx={{ fontSize: "1.7rem", fontWeight: 900, color: "#0f172a" }}>
            Admin Settings
          </Typography>
          <Typography sx={{ mt: 0.7, fontSize: "0.9rem", color: "#64748b" }}>
            Configure platform behavior, moderation defaults, and admin data exports.
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
                title="Export admin data (Users Excel)"
                desc="Download complete user database (Customers, Sellers, Admins, Premium status) in Excel format (.xlsx)."
                action={
                  <Button
                    variant="contained"
                    onClick={handleExportUsers}
                    disabled={exporting}
                    startIcon={exporting ? <CircularProgress size={16} color="inherit" /> : <DownloadRoundedIcon />}
                    sx={{
                      borderRadius: "12px",
                      textTransform: "none",
                      fontWeight: 700,
                      bgcolor: "#0f766e",
                      "&:hover": { bgcolor: "#0b5f59" },
                    }}
                  >
                    {exporting ? "Exporting..." : "Export Excel"}
                  </Button>
                }
              />
            </Stack>
          </CardContent>
        </Card>
      </Stack>

      <Snackbar
        open={toast.open}
        autoHideDuration={4000}
        onClose={() => setToast({ ...toast, open: false })}
        anchorOrigin={{ vertical: "bottom", horizontal: "right" }}
      >
        <Alert severity={toast.severity} onClose={() => setToast({ ...toast, open: false })}>
          {toast.message}
        </Alert>
      </Snackbar>
    </Box>
  );
}