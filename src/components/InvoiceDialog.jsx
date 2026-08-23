// src/components/InvoiceDialog.jsx
import { useMemo, useRef } from "react";
import {
  Avatar,
  Box,
  Button,
  Chip,
  Dialog,
  DialogContent,
  Fade,
  Grid,
  IconButton,
  Stack,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
  Typography,
} from "@mui/material";
import CloseRoundedIcon from "@mui/icons-material/CloseRounded";
import DownloadRoundedIcon from "@mui/icons-material/DownloadRounded";
import PrintRoundedIcon from "@mui/icons-material/PrintRounded";
import ReceiptLongRoundedIcon from "@mui/icons-material/ReceiptLongRounded";
import CheckCircleRoundedIcon from "@mui/icons-material/CheckCircleRounded";
import HourglassTopRoundedIcon from "@mui/icons-material/HourglassTopRounded";
import CancelRoundedIcon from "@mui/icons-material/CancelRounded";
import html2canvas from "html2canvas";
import jsPDF from "jspdf";

import { useAppState } from "../hooks/useAppState";

const fmtDate = (v) =>
  v
    ? new Date(v).toLocaleString("en-IN", {
        day: "2-digit",
        month: "short",
        year: "numeric",
        hour: "2-digit",
        minute: "2-digit",
      })
    : "—";

const fmtMoney = (v) =>
  `₹${Number(v || 0).toLocaleString("en-IN", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;

function getStatusMeta(status) {
  const key = String(status || "").toUpperCase();

  if (
    key === "SUCCESS" ||
    key === "PAID" ||
    key === "CONFIRMED" ||
    key === "COMPLETED" ||
    key === "APPROVED"
  ) {
    return {
      label: "Confirmed / Paid",
      bg: "#ecfdf5",
      color: "#166534",
      border: "#bbf7d0",
      icon: <CheckCircleRoundedIcon sx={{ fontSize: 14 }} />,
    };
  }

  if (key === "PENDING" || key === "PROCESSING") {
    return {
      label: "Pending",
      bg: "#fffbeb",
      color: "#92400e",
      border: "#fde68a",
      icon: <HourglassTopRoundedIcon sx={{ fontSize: 14 }} />,
    };
  }

  if (key === "CANCELLED" || key === "REJECTED" || key === "FAILED") {
    return {
      label: "Cancelled",
      bg: "#fef2f2",
      color: "#991b1b",
      border: "#fecaca",
      icon: <CancelRoundedIcon sx={{ fontSize: 14 }} />,
    };
  }

  return {
    label: "Confirmed",
    bg: "#ecfdf5",
    color: "#166534",
    border: "#bbf7d0",
    icon: <CheckCircleRoundedIcon sx={{ fontSize: 14 }} />,
  };
}

export default function InvoiceDialog({ open, onClose, booking }) {
  const invoiceRef = useRef(null);
  const { user } = useAppState();

  const data = useMemo(() => {
    const listing = booking?.listing || {};
    const owner = booking?.owner || {};
    const payment = booking?.payment || {};
    const buyer = booking?.buyer || {};

    const subtotal = Number(booking?.amount || payment?.amount || listing?.price || 30000);
    const discount = 0;
    const taxRate = 0.18;
    const gst = +(subtotal * taxRate).toFixed(2);
    const finalTotal = subtotal;

    const rawStatus = payment?.payment_status || booking?.status || "CONFIRMED";

    return {
      invoiceId: `INV-${String(booking?.id || "NA").slice(0, 16)}`,
      generatedAt: new Date().toISOString(),
      bookingId: booking?.id || "—",
      bookingDate: booking?.created_at || new Date().toISOString(),
      
      // Buyer Details (from API or logged-in user)
      buyerName: buyer?.name || booking?.customer || user?.name || "Valued Buyer",
      buyerEmail: buyer?.email || booking?.email || user?.email || "—",
      buyerPhone: buyer?.phone || booking?.phone || user?.phone || "—",
      buyerAddress: buyer?.location || user?.location || "Karnataka, India",

      // Seller Details
      sellerName: owner?.name || "EasyDeal Verified Partner",
      sellerEmail: owner?.email || "Easydealhelpdesk03@gmail.com",
      sellerPhone: owner?.phone || "8088185203",
      sellerAddress: owner?.location || listing?.location || "Karnataka, India",

      paymentMethod: payment?.payment_method || "UPI / Direct Booking",
      paymentStatus: rawStatus,
      itemName: listing?.title || booking?.listing_title || "Marketplace Listing Booking",
      quantity: 1,
      unitPrice: subtotal,
      subtotal,
      gst,
      discount,
      total: finalTotal,
      listingType: listing?.type || booking?.listing_type || "property",
      companyName: "EasyDeal",
    };
  }, [booking]);

  const paymentMeta = getStatusMeta(data.paymentStatus);

  const handlePrint = async () => {
    if (!invoiceRef.current) return;
    try {
      const canvas = await html2canvas(invoiceRef.current, {
        scale: 2,
        useCORS: true,
        backgroundColor: "#ffffff",
      });

      const imgData = canvas.toDataURL("image/png");

      const win = window.open("", "_blank", "width=1000,height=800");
      if (!win) {
        window.print();
        return;
      }

      win.document.open();
      win.document.write(`
      <html>
        <head>
          <title>${data.invoiceId}</title>
          <meta name="viewport" content="width=device-width, initial-scale=1" />
          <style>
            * { box-sizing: border-box; }
            html, body {
              margin: 0;
              padding: 0;
              background: #ffffff;
              font-family: Inter, Arial, sans-serif;
            }
            .print-wrap {
              min-height: 100vh;
              display: flex;
              align-items: flex-start;
              justify-content: center;
              padding: 16px;
            }
            .sheet {
              width: 100%;
              max-width: 920px;
            }
            .sheet img {
              display: block;
              width: 100%;
              height: auto;
            }
            @page {
              size: A4;
              margin: 10mm;
            }
            @media print {
              html, body {
                background: #ffffff !important;
                -webkit-print-color-adjust: exact;
                print-color-adjust: exact;
              }
              .print-wrap {
                padding: 0;
              }
              .sheet {
                max-width: 100%;
              }
            }
          </style>
        </head>
        <body>
          <div class="print-wrap">
            <div class="sheet">
              <img src="${imgData}" alt="Invoice" />
            </div>
          </div>
          <script>
            window.onload = function () {
              setTimeout(function () {
                window.focus();
                window.print();
              }, 250);
            };
          </script>
        </body>
      </html>
    `);
      win.document.close();
    } catch (err) {
      console.error("Print generation failed:", err);
      window.print();
    }
  };

  const handleDownloadPdf = async () => {
    if (!invoiceRef.current) return;

    try {
      const canvas = await html2canvas(invoiceRef.current, {
        scale: 2,
        useCORS: true,
        backgroundColor: "#ffffff",
      });

      const imgData = canvas.toDataURL("image/png");
      const pdf = new jsPDF("p", "mm", "a4");
      const pageWidth = pdf.internal.pageSize.getWidth();
      const pageHeight = pdf.internal.pageSize.getHeight();

      const imgWidth = pageWidth - 16;
      const imgHeight = (canvas.height * imgWidth) / canvas.width;

      pdf.addImage(imgData, "PNG", 8, 8, imgWidth, Math.min(imgHeight, pageHeight - 16));
      pdf.save(`${data.invoiceId}.pdf`);
    } catch (err) {
      console.error("PDF generation failed:", err);
      window.print();
    }
  };

  if (!booking) return null;

  return (
    <Dialog
      open={open}
      onClose={onClose}
      maxWidth="md"
      fullWidth
      TransitionComponent={Fade}
      PaperProps={{
        sx: {
          borderRadius: "28px",
          overflow: "hidden",
          border: "1px solid #e2e8f0",
          boxShadow: "0 25px 80px rgba(15, 23, 42, 0.18)",
          bgcolor: "#f8fafc",
        },
      }}
    >
      <DialogContent sx={{ p: 0 }}>
        <Box
          ref={invoiceRef}
          sx={{
            p: { xs: 2.5, sm: 4 },
            bgcolor: "#f8fafc",
            color: "#0f172a",
          }}
        >
          <Box
            sx={{
              p: { xs: 2.5, sm: 4 },
              borderRadius: "24px",
              bgcolor: "#ffffff",
              border: "1px solid #e2e8f0",
              boxShadow: "0 10px 30px rgba(15, 23, 42, 0.04)",
            }}
          >
            {/* Header with Logo and Status */}
            <Stack
              direction={{ xs: "column", sm: "row" }}
              justifyContent="space-between"
              alignItems={{ sm: "center" }}
              spacing={2}
              sx={{ pb: 3, borderBottom: "1px solid #e2e8f0", mb: 3 }}
            >
              <Stack direction="row" spacing={1.5} alignItems="center">
                <Avatar
                  sx={{
                    width: 44,
                    height: 44,
                    bgcolor: "#0f766e",
                    color: "#fff",
                    fontWeight: 900,
                    fontSize: "1rem",
                    borderRadius: "14px",
                  }}
                >
                  ED
                </Avatar>
                <Box>
                  <Typography
                    sx={{ fontSize: "1.15rem", fontWeight: 900, color: "#0f172a" }}
                  >
                    EasyDeal
                  </Typography>
                  <Typography sx={{ fontSize: "0.78rem", color: "#64748b" }}>
                    Verified Marketplace Tax Invoice
                  </Typography>
                </Box>
              </Stack>

              <Stack direction="row" spacing={1} alignItems="center">
                <Chip
                  icon={paymentMeta.icon}
                  label={paymentMeta.label}
                  sx={{
                    fontWeight: 800,
                    fontSize: "0.78rem",
                    bgcolor: paymentMeta.bg,
                    color: paymentMeta.color,
                    border: `1px solid ${paymentMeta.border}`,
                    "& .MuiChip-icon": { color: paymentMeta.color },
                  }}
                />
                <IconButton
                  onClick={onClose}
                  sx={{ border: "1px solid #e2e8f0" }}
                >
                  <CloseRoundedIcon />
                </IconButton>
              </Stack>
            </Stack>

            {/* Invoice Meta */}
            <Stack
              direction={{ xs: "column", sm: "row" }}
              justifyContent="space-between"
              spacing={2}
              sx={{ mb: 3 }}
            >
              <Box>
                <Typography
                  sx={{ fontSize: "1.5rem", fontWeight: 900, color: "#0f172a" }}
                >
                  Invoice
                </Typography>
                <Typography sx={{ color: "#64748b", mt: 0.4 }}>
                  Invoice ID: {data.invoiceId}
                </Typography>
                <Typography sx={{ color: "#64748b" }}>
                  Booking ID: {data.bookingId}
                </Typography>
              </Box>

              <Box sx={{ textAlign: { xs: "left", sm: "right" } }}>
                <Typography sx={{ color: "#64748b" }}>
                  Booking Date: {fmtDate(data.bookingDate)}
                </Typography>
                <Typography sx={{ color: "#64748b" }}>
                  Generated: {fmtDate(data.generatedAt)}
                </Typography>
                <Typography sx={{ color: "#64748b" }}>
                  Payment: {data.paymentMethod}
                </Typography>
              </Box>
            </Stack>

            {/* 3 Columns: Buyer Details, Seller Details, Booking Summary */}
            <Grid container spacing={2} sx={{ mb: 3 }}>
              <Grid item xs={12} sm={4}>
                <Box
                  sx={{
                    p: 2,
                    borderRadius: "16px",
                    bgcolor: "#F8FAFC",
                    border: "1px solid #e2e8f0",
                    height: "100%",
                  }}
                >
                  <Typography
                    sx={{
                      fontSize: "0.74rem",
                      color: "#0F766E",
                      fontWeight: 850,
                      letterSpacing: ".06em",
                      textTransform: "uppercase",
                      mb: 1,
                    }}
                  >
                    👤 Buyer Details (Billed To)
                  </Typography>
                  <Typography sx={{ fontWeight: 800, color: "#0f172a", fontSize: "0.9rem" }}>
                    {data.buyerName}
                  </Typography>
                  <Typography sx={{ color: "#64748b", fontSize: "0.8rem", mt: 0.4 }}>
                    {data.buyerEmail}
                  </Typography>
                  <Typography sx={{ color: "#64748b", fontSize: "0.8rem" }}>
                    {data.buyerPhone}
                  </Typography>
                  <Typography sx={{ color: "#64748b", fontSize: "0.8rem" }}>
                    {data.buyerAddress}
                  </Typography>
                </Box>
              </Grid>

              <Grid item xs={12} sm={4}>
                <Box
                  sx={{
                    p: 2,
                    borderRadius: "16px",
                    bgcolor: "#F8FAFC",
                    border: "1px solid #e2e8f0",
                    height: "100%",
                  }}
                >
                  <Typography
                    sx={{
                      fontSize: "0.74rem",
                      color: "#2563EB",
                      fontWeight: 850,
                      letterSpacing: ".06em",
                      textTransform: "uppercase",
                      mb: 1,
                    }}
                  >
                    🏢 Seller Details (Billed By)
                  </Typography>
                  <Typography sx={{ fontWeight: 800, color: "#0f172a", fontSize: "0.9rem" }}>
                    {data.sellerName}
                  </Typography>
                  <Typography sx={{ color: "#64748b", fontSize: "0.8rem", mt: 0.4 }}>
                    {data.sellerEmail}
                  </Typography>
                  <Typography sx={{ color: "#64748b", fontSize: "0.8rem" }}>
                    {data.sellerPhone}
                  </Typography>
                  <Typography sx={{ color: "#64748b", fontSize: "0.8rem" }}>
                    {data.sellerAddress}
                  </Typography>
                </Box>
              </Grid>

              <Grid item xs={12} sm={4}>
                <Box
                  sx={{
                    p: 2,
                    borderRadius: "16px",
                    bgcolor: "#F8FAFC",
                    border: "1px solid #e2e8f0",
                    height: "100%",
                  }}
                >
                  <Typography
                    sx={{
                      fontSize: "0.74rem",
                      color: "#94a3b8",
                      fontWeight: 850,
                      letterSpacing: ".06em",
                      textTransform: "uppercase",
                      mb: 1,
                    }}
                  >
                    📋 Booking Summary
                  </Typography>
                  <Typography sx={{ color: "#64748b", fontSize: "0.8rem" }}>
                    Category: <strong>{String(data.listingType).toUpperCase()}</strong>
                  </Typography>
                  <Typography sx={{ color: "#64748b", fontSize: "0.8rem", mt: 0.4 }}>
                    Payment Mode: {data.paymentMethod}
                  </Typography>
                  <Typography sx={{ color: "#64748b", fontSize: "0.8rem" }}>
                    Invoice Date: {fmtDate(data.generatedAt)}
                  </Typography>
                  <Typography sx={{ color: "#64748b", fontSize: "0.8rem" }}>
                    Status: <strong>{paymentMeta.label}</strong>
                  </Typography>
                </Box>
              </Grid>
            </Grid>

            <Box
              sx={{
                borderRadius: "20px",
                overflow: "hidden",
                border: "1px solid #e2e8f0",
                bgcolor: "#fff",
              }}
            >
              <Table>
                <TableHead>
                  <TableRow sx={{ bgcolor: "#f8fafc" }}>
                    <TableCell sx={{ fontWeight: 800, color: "#64748b" }}>
                      Item Name
                    </TableCell>
                    <TableCell sx={{ fontWeight: 800, color: "#64748b" }}>
                      Quantity
                    </TableCell>
                    <TableCell sx={{ fontWeight: 800, color: "#64748b" }}>
                      Price
                    </TableCell>
                    {/* <TableCell sx={{ fontWeight: 800, color: "#64748b" }}>
                      Tax
                    </TableCell> */}
                    <TableCell
                      sx={{ fontWeight: 800, color: "#64748b" }}
                      align="right"
                    >
                      Total Amount
                    </TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  <TableRow>
                    <TableCell>
                      <Typography sx={{ fontWeight: 800, color: "#0f172a" }}>
                        {data.itemName}
                      </Typography>
                    </TableCell>
                    <TableCell>{data.quantity}</TableCell>
                    <TableCell>{fmtMoney(data.unitPrice)}</TableCell>
                    {/* <TableCell>{fmtMoney(data.gst)}</TableCell> */}
                    <TableCell align="right" sx={{ fontWeight: 800 }}>
                      {fmtMoney(data.total)}
                    </TableCell>
                  </TableRow>
                </TableBody>
              </Table>
            </Box>

            <Stack
              direction={{ xs: "column", md: "row" }}
              spacing={2}
              sx={{ mt: 3 }}
            >
              <Box sx={{ flex: 1 }}>
                <Box
                  sx={{
                    p: 2,
                    borderRadius: "18px",
                    bgcolor: "#fff",
                    border: "1px solid #e2e8f0",
                  }}
                >
                  <Stack
                    direction="row"
                    spacing={1}
                    alignItems="center"
                    sx={{ mb: 1 }}
                  >
                    <ReceiptLongRoundedIcon sx={{ color: "#0f766e" }} />
                    <Typography sx={{ fontWeight: 900, color: "#0f172a" }}>
                      Notes
                    </Typography>
                  </Stack>
                  <Typography sx={{ color: "#64748b", lineHeight: 1.7 }}>
                    This is a system-generated invoice for the selected booking.
                    Please keep this copy for payment and verification purposes.
                  </Typography>
                </Box>
              </Box>

              <Box
                sx={{
                  width: { xs: "100%", md: 320 },
                  p: 2,
                  borderRadius: "18px",
                  bgcolor: "#fff",
                  border: "1px solid #e2e8f0",
                }}
              >
                <Stack spacing={1.15}>
                  <Stack direction="row" justifyContent="space-between">
                    <Typography sx={{ color: "#64748b" }}>Subtotal</Typography>
                    <Typography sx={{ fontWeight: 700 }}>
                      {fmtMoney(data.subtotal)}
                    </Typography>
                  </Stack>
                  {/* <Stack direction="row" justifyContent="space-between">
                    <Typography sx={{ color: "#64748b" }}>GST / Tax</Typography>
                    <Typography sx={{ fontWeight: 700 }}>
                      {fmtMoney(data.gst)}
                    </Typography>
                  </Stack> */}
                  <Stack direction="row" justifyContent="space-between">
                    <Typography sx={{ color: "#64748b" }}>Discount</Typography>
                    <Typography sx={{ fontWeight: 700 }}>
                      - {fmtMoney(data.discount)}
                    </Typography>
                  </Stack>

                  <Box
                    sx={{ borderTop: "1px dashed #cbd5e1", pt: 1.2, mt: 0.3 }}
                  >
                    <Stack
                      direction="row"
                      justifyContent="space-between"
                      alignItems="center"
                    >
                      <Typography
                        sx={{
                          fontWeight: 900,
                          color: "#0f172a",
                          fontSize: "1rem",
                        }}
                      >
                        Final Total
                      </Typography>
                      <Typography
                        sx={{
                          fontWeight: 900,
                          color: "#0f766e",
                          fontSize: "1.12rem",
                        }}
                      >
                        {fmtMoney(data.total)}
                      </Typography>
                    </Stack>
                  </Box>
                </Stack>
              </Box>
            </Stack>
          </Box>
        </Box>

        <Box
          sx={{
            p: 2,
            borderTop: "1px solid #e2e8f0",
            bgcolor: "rgba(255,255,255,0.88)",
            backdropFilter: "blur(12px)",
          }}
        >
          <Stack
            direction={{ xs: "column", sm: "row" }}
            spacing={1.2}
            justifyContent="flex-end"
          >
            <Button
              variant="outlined"
              startIcon={<PrintRoundedIcon />}
              onClick={handlePrint}
              sx={{
                borderRadius: "12px",
                textTransform: "none",
                fontWeight: 800,
              }}
            >
              Print Invoice
            </Button>

            <Button
              variant="outlined"
              startIcon={<DownloadRoundedIcon />}
              onClick={handleDownloadPdf}
              sx={{
                borderRadius: "12px",
                textTransform: "none",
                fontWeight: 800,
              }}
            >
              Download PDF
            </Button>

            <Button
              variant="contained"
              onClick={onClose}
              sx={{
                borderRadius: "12px",
                textTransform: "none",
                fontWeight: 800,
                background: "linear-gradient(135deg, #0f766e, #0d9488)",
              }}
            >
              Close
            </Button>
          </Stack>
        </Box>
      </DialogContent>
    </Dialog>
  );
}
