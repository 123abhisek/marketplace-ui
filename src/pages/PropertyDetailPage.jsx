// src/pages/PropertyDetailPage.jsx
import { useEffect, useState, useCallback } from "react";
import { useParams, useNavigate, Link as RouterLink } from "react-router-dom";
import { Helmet } from "react-helmet-async";
import {
  Alert, Box, Button, Card, CardContent, Chip, CircularProgress,
  Container, Grid, IconButton, Paper, Stack, Table, TableBody,
  TableCell, TableContainer, TableRow, Tooltip, Typography,
} from "@mui/material";
import ArrowBackRoundedIcon from "@mui/icons-material/ArrowBackRounded";
import PlaceRoundedIcon from "@mui/icons-material/PlaceRounded";
import BedRoundedIcon from "@mui/icons-material/BedRounded";
import SquareFootRoundedIcon from "@mui/icons-material/SquareFootRounded";
import LayersRoundedIcon from "@mui/icons-material/LayersRounded";
import MeetingRoomRoundedIcon from "@mui/icons-material/MeetingRoomRounded";
import PhoneRoundedIcon from "@mui/icons-material/PhoneRounded";
import HomeWorkRoundedIcon from "@mui/icons-material/HomeWorkRounded";
import CheckCircleRoundedIcon from "@mui/icons-material/CheckCircleRounded";
import WorkspacePremiumRoundedIcon from "@mui/icons-material/WorkspacePremiumRounded";
import TrendingUpRoundedIcon from "@mui/icons-material/TrendingUpRounded";
import AgricultureRoundedIcon from "@mui/icons-material/AgricultureRounded";
import LockRoundedIcon from "@mui/icons-material/LockRounded";
import ChevronLeftRoundedIcon from "@mui/icons-material/ChevronLeftRounded";
import ChevronRightRoundedIcon from "@mui/icons-material/ChevronRightRounded";
import ShareRoundedIcon from "@mui/icons-material/ShareRounded";
import VerifiedUserRoundedIcon from "@mui/icons-material/VerifiedUserRounded";
import ShieldRoundedIcon from "@mui/icons-material/ShieldRounded";
import WhatsAppIcon from "@mui/icons-material/WhatsApp";
import SupportAgentRoundedIcon from "@mui/icons-material/SupportAgentRounded";
import { propertyService } from "../services/api";
import { useAppState } from "../hooks/useAppState";
import { formatCurrency } from "../utils/formatters";
import BookNowButton from "../components/BookNowButton";

const TEAL = "#0F766E";
const TEAL_LIGHT = "#F0FDFA";
const TEAL_DARK = "#0D6B63";
const PLACEHOLDER = "https://placehold.co/800x500/e2e8f0/94a3b8?text=No+Image";

const SpecChip = ({ icon, label, value }) =>
  value ? (
    <Box sx={{ display: "flex", alignItems: "center", gap: 1, background: TEAL_LIGHT, borderRadius: "12px", px: 2, py: 1, border: "1px solid rgba(15,118,110,0.12)" }}>
      <Box sx={{ color: TEAL, fontSize: 20, display: "flex" }}>{icon}</Box>
      <Box>
        <Typography sx={{ fontSize: "0.68rem", color: "#64748B", lineHeight: 1 }}>{label}</Typography>
        <Typography sx={{ fontSize: "0.82rem", fontWeight: 700, color: "#1E293B", lineHeight: 1.3 }}>{value}</Typography>
      </Box>
    </Box>
  ) : null;

const FeatureCard = ({ icon, title, desc }) => (
  <Card elevation={0} sx={{ borderRadius: "16px", border: "1px solid #E2E8F0", background: "#FAFBFF", height: "100%" }}>
    <CardContent sx={{ p: 3 }}>
      <Box sx={{ width: 44, height: 44, borderRadius: "12px", background: TEAL_LIGHT, color: TEAL, display: "flex", alignItems: "center", justifyContent: "center", mb: 1.5, fontSize: 24 }}>{icon}</Box>
      <Typography fontWeight={800} sx={{ color: "#1E293B", mb: 0.5 }}>{title}</Typography>
      <Typography sx={{ fontSize: "0.82rem", color: "#64748B", lineHeight: 1.6 }}>{desc}</Typography>
    </CardContent>
  </Card>
);

export default function PropertyDetailPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user } = useAppState();
  const [property, setProperty] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [activeImg, setActiveImg] = useState(0);

  const isPremium = Boolean(
    user?.isPremium || user?.is_premium || user?.role === "premium" ||
    user?.role === "admin" || user?.role === "seller"
  );

  const fetchProperty = useCallback(async () => {
    setLoading(true); setError("");
    try {
      const res = await propertyService.getOne(id);
      setProperty(res?.data ?? res);
    } catch (err) {
      setError(err?.response?.data?.detail || "Failed to load property.");
    } finally { setLoading(false); }
  }, [id]);

  useEffect(() => { fetchProperty(); }, [fetchProperty]);

  const images = (() => {
    const imgs = property?.images || [];
    const src = Array.isArray(imgs) && imgs.length > 0 ? imgs : [PLACEHOLDER];
    return src.map(img => (!img || typeof img !== "string") ? PLACEHOLDER : (img.startsWith("data:") || img.startsWith("http")) ? img : PLACEHOLDER);
  })();

  const handleShare = async () => {
    try { await navigator.share({ title: property?.title, url: window.location.href }); }
    catch { navigator.clipboard?.writeText(window.location.href); }
  };

  if (loading) return <Box sx={{ minHeight: "60vh", display: "grid", placeItems: "center" }}><CircularProgress sx={{ color: TEAL }} size={48} /></Box>;

  if (error || !property) return (
    <Container maxWidth="md" sx={{ py: 6 }}>
      <Alert severity="error" sx={{ borderRadius: "16px", mb: 2 }} action={<Button size="small" onClick={fetchProperty}>Retry</Button>}>{error || "Property not found"}</Alert>
      <Button startIcon={<ArrowBackRoundedIcon />} onClick={() => navigate(-1)} sx={{ borderRadius: "12px", color: TEAL, fontWeight: 700 }}>Go Back</Button>
    </Container>
  );

  const priceStr = property.price ? formatCurrency(property.price) : "Price on Request";
  const contactNumber = property.contact || property.owner?.phone || "8088185203";
  const whatsappLink = `https://wa.me/91${contactNumber.replace(/\D/g, "")}?text=${encodeURIComponent("Hi! I am interested in: " + property.title + " on EasyDeal.")}`;

  const detailRows = [
    { label: "Property Type", value: property.property_type },
    { label: "Apartment / Project", value: property.apartment_name },
    { label: "Location", value: property.location },
    { label: "Floor", value: property.floor },
    { label: "Total Rooms", value: property.rooms },
    { label: "Bedrooms", value: property.bedrooms },
    { label: "Built-up Area", value: property.area ? property.area + " sq.ft" : null },
    { label: "Land Area", value: property.land_area ? property.land_area + " sq.ft" : null },
    { label: "Crops Grown", value: property.crops_grown },
    { label: "Rent / Lease", value: property.rent_lease },
    { label: "Contact", value: isPremium ? contactNumber : "Premium Only" },
    { label: "Status", value: property.status || "Active" },
  ].filter(r => r.value);

  return (
    <>
      <Helmet>
        <title>{property.title || "Property"} | EasyDeal</title>
        <meta name="description" content={property.title + " in " + property.location + ". " + priceStr + ". Verified listing on EasyDeal."} />
        <meta name="keywords" content={property.title + ", " + property.location + ", property for sale, EasyDeal"} />
        <meta property="og:title" content={property.title + " | EasyDeal"} />
        <meta name="robots" content="index, follow" />
      </Helmet>
      <Box sx={{ background: "#F8FAFC", minHeight: "100vh", pb: 8 }}>
        {/* Back bar */}
        <Box sx={{ background: "#fff", borderBottom: "1px solid #E2E8F0", px: { xs: 2, md: 4 }, py: 1.5, position: "sticky", top: 0, zIndex: 10 }}>
          <Container maxWidth="xl" disableGutters>
            <Stack direction="row" alignItems="center" justifyContent="space-between">
              <Button startIcon={<ArrowBackRoundedIcon />} onClick={() => navigate(-1)} sx={{ borderRadius: "10px", color: "#475569", fontWeight: 700, fontSize: "0.82rem" }}>Back to Listings</Button>
              <Stack direction="row" spacing={1} alignItems="center">
                <Chip label="VERIFIED" size="small" sx={{ fontWeight: 700, fontSize: "0.68rem", background: "#ECFDF5", color: "#059669" }} />
                <Tooltip title="Share">
                  <IconButton onClick={handleShare} size="small" sx={{ border: "1px solid #E2E8F0", borderRadius: "10px" }}>
                    <ShareRoundedIcon sx={{ fontSize: 18 }} />
                  </IconButton>
                </Tooltip>
              </Stack>
            </Stack>
          </Container>
        </Box>

        <Container maxWidth="xl" sx={{ pt: { xs: 2, md: 4 }, px: { xs: 2, md: 4 } }}>
          <Grid container spacing={{ xs: 3, md: 4 }}>
            {/* LEFT: Gallery */}
            <Grid item xs={12} md={7}>
              <Box sx={{ borderRadius: "20px", overflow: "hidden", position: "relative", background: "#1E293B", boxShadow: "0 8px 32px rgba(15,23,42,0.12)", aspectRatio: "16/9" }}>
                <Box component="img" src={images[activeImg]} alt={property.title} onError={e => { e.target.src = PLACEHOLDER; }} sx={{ width: "100%", height: "100%", objectFit: "cover", display: "block" }} />
                {images.length > 1 && (
                  <>
                    <IconButton onClick={() => setActiveImg(p => (p - 1 + images.length) % images.length)} sx={{ position: "absolute", left: 12, top: "50%", transform: "translateY(-50%)", background: "rgba(255,255,255,0.9)", boxShadow: "0 2px 8px rgba(0,0,0,0.2)" }}><ChevronLeftRoundedIcon /></IconButton>
                    <IconButton onClick={() => setActiveImg(p => (p + 1) % images.length)} sx={{ position: "absolute", right: 12, top: "50%", transform: "translateY(-50%)", background: "rgba(255,255,255,0.9)", boxShadow: "0 2px 8px rgba(0,0,0,0.2)" }}><ChevronRightRoundedIcon /></IconButton>
                  </>
                )}
                <Box sx={{ position: "absolute", bottom: 12, left: 12, background: "rgba(15,23,42,0.65)", color: "#fff", borderRadius: "8px", px: 1.5, py: 0.5, fontSize: "0.75rem", fontWeight: 700 }}>{activeImg + 1} / {images.length}</Box>
              </Box>
              {images.length > 1 && (
                <Stack direction="row" spacing={1.5} sx={{ mt: 2, overflowX: "auto", pb: 0.5 }}>
                  {images.map((img, idx) => (
                    <Box key={idx} component="img" src={img} alt={"thumb-" + (idx + 1)} onError={e => { e.target.src = PLACEHOLDER; }} onClick={() => setActiveImg(idx)}
                      sx={{ width: 80, height: 60, minWidth: 80, borderRadius: "10px", objectFit: "cover", cursor: "pointer", border: activeImg === idx ? "3px solid " + TEAL : "3px solid transparent", opacity: activeImg === idx ? 1 : 0.65, transition: "all 0.15s ease" }} />
                  ))}
                </Stack>
              )}
              <Stack direction={{ xs: "column", sm: "row" }} spacing={1.5} sx={{ mt: 3 }}>
                {[
                  { icon: <VerifiedUserRoundedIcon sx={{ fontSize: 18 }} />, text: "EasyDeal Verified" },
                  { icon: <ShieldRoundedIcon sx={{ fontSize: 18 }} />, text: "Secure Platform" },
                  { icon: <SupportAgentRoundedIcon sx={{ fontSize: 18 }} />, text: "On-Ground Support" },
                ].map(b => (
                  <Box key={b.text} sx={{ display: "flex", alignItems: "center", gap: 0.75, background: TEAL_LIGHT, borderRadius: "10px", px: 2, py: 1, border: "1px solid rgba(15,118,110,0.15)", flex: 1 }}>
                    <Box sx={{ color: TEAL, display: "flex" }}>{b.icon}</Box>
                    <Typography sx={{ fontSize: "0.75rem", fontWeight: 700, color: "#0F4D48" }}>{b.text}</Typography>
                  </Box>
                ))}
              </Stack>
            </Grid>

            {/* RIGHT: Info */}
            <Grid item xs={12} md={5}>
              <Box sx={{ position: { md: "sticky" }, top: { md: 80 } }}>
                <Typography variant="h4" fontWeight={900} sx={{ color: "#0F172A", letterSpacing: "-0.03em", lineHeight: 1.2, mb: 1.5, fontSize: { xs: "1.5rem", md: "2rem" } }}>{property.title}</Typography>
                <Stack direction="row" alignItems="center" spacing={0.5} sx={{ mb: 2.5 }}>
                  <PlaceRoundedIcon sx={{ fontSize: 20, color: "#EF4444" }} />
                  <Typography sx={{ fontSize: "0.9rem", color: "#475569", fontWeight: 600 }}>{property.location || "Location not specified"}</Typography>
                </Stack>
                <Paper elevation={0} sx={{ borderRadius: "20px", border: "2px solid " + TEAL, p: 3, mb: 3, background: "linear-gradient(135deg, " + TEAL_LIGHT + " 0%, #ECFEFF 100%)" }}>
                  <Typography sx={{ fontSize: "0.72rem", color: "#64748B", fontWeight: 600, mb: 0.5, textTransform: "uppercase", letterSpacing: "0.06em" }}>Listing Price</Typography>
                  <Typography variant="h3" fontWeight={900} sx={{ color: TEAL, letterSpacing: "-0.04em", lineHeight: 1, mb: 0.75, fontSize: { xs: "2rem", md: "2.5rem" } }}>{isPremium ? priceStr : "Unlock to View"}</Typography>
                  <Typography sx={{ fontSize: "0.76rem", color: "#64748B" }}>{isPremium ? "Inclusive of all applicable charges" : "Upgrade to Premium to see price and contact"}</Typography>
                </Paper>
                <Box sx={{ display: "flex", flexWrap: "wrap", gap: 1.5, mb: 3 }}>
                  <SpecChip icon={<BedRoundedIcon />} label="Bedrooms" value={property.bedrooms} />
                  <SpecChip icon={<SquareFootRoundedIcon />} label="Area" value={property.area ? property.area + " sq.ft" : null} />
                  <SpecChip icon={<LayersRoundedIcon />} label="Floor" value={property.floor} />
                  <SpecChip icon={<MeetingRoomRoundedIcon />} label="Rooms" value={property.rooms} />
                  <SpecChip icon={<AgricultureRoundedIcon />} label="Land" value={property.land_area ? property.land_area + " sq.ft" : null} />
                  <SpecChip icon={<HomeWorkRoundedIcon />} label="Type" value={property.property_type} />
                </Box>
                {isPremium ? (
                  <Stack spacing={1.5} sx={{ mb: 3 }}>
                    <BookNowButton
                      propertyId={id}
                      property={property}
                      amount={Number(property.price) || 1}
                      label="Book a Site Visit"
                      onSuccess={() => navigate("/dashboard/my-bookings")}
                    />
                    <Button fullWidth variant="outlined" component="a" href={whatsappLink} target="_blank" rel="noopener noreferrer" startIcon={<WhatsAppIcon />} sx={{ borderRadius: "14px", py: 1.5, fontWeight: 800, borderColor: "#22C55E", color: "#16A34A" }}>WhatsApp Seller</Button>
                    <Button fullWidth variant="text" component="a" href={"tel:" + contactNumber} startIcon={<PhoneRoundedIcon />} sx={{ borderRadius: "14px", py: 1.2, fontWeight: 700, color: "#475569" }}>Call: {contactNumber}</Button>
                  </Stack>
                ) : (
                  <Stack spacing={1} sx={{ mb: 3 }}>
                    <Button fullWidth variant="contained" component={RouterLink} to="/subscription" startIcon={<LockRoundedIcon />} sx={{ borderRadius: "14px", py: 1.8, fontWeight: 900, background: "linear-gradient(135deg, " + TEAL + ", " + TEAL_DARK + ")", boxShadow: "0 8px 24px rgba(15,118,110,0.32)" }}>Unlock Full Details - Rs.299</Button>
                    <Typography sx={{ fontSize: "0.75rem", color: "#94A3B8", textAlign: "center" }}>Premium includes price, contact and full listing details</Typography>
                  </Stack>
                )}
                <Box sx={{ borderRadius: "16px", background: TEAL_LIGHT, border: "1px solid rgba(15,118,110,0.2)", p: 2.5 }}>
                  <Stack direction="row" spacing={1.5} alignItems="flex-start">
                    <CheckCircleRoundedIcon sx={{ color: TEAL, mt: 0.25, flexShrink: 0 }} />
                    <Box>
                      <Typography fontWeight={800} sx={{ color: "#0F4D48", fontSize: "0.88rem", mb: 0.5 }}>EasyDeal On-Ground Support Guarantee</Typography>
                      <Typography sx={{ fontSize: "0.75rem", color: "#0D6B63", lineHeight: 1.6 }}>Our team arranges site visits, document support, and direct buyer-seller coordination.</Typography>
                    </Box>
                  </Stack>
                </Box>
              </Box>
            </Grid>
          </Grid>

          {/* Details Table + Sidebar */}
          <Box sx={{ mt: 5 }}>
            <Grid container spacing={4}>
              <Grid item xs={12} md={8}>
                <Card elevation={0} sx={{ borderRadius: "20px", border: "1px solid #E2E8F0", overflow: "hidden", position: "relative" }}>
                  <Box sx={{ p: 3, borderBottom: "1px solid #F1F5F9" }}>
                    <Typography variant="h6" fontWeight={900} sx={{ color: "#1E293B" }}>Property Details</Typography>
                    <Typography sx={{ fontSize: "0.8rem", color: "#94A3B8" }}>Full specifications and listing information</Typography>
                  </Box>
                  {!isPremium && (
                    <Box sx={{ position: "absolute", bottom: 0, left: 0, right: 0, height: "60%", background: "linear-gradient(to bottom, rgba(255,255,255,0) 0%, rgba(255,255,255,0.97) 45%, #fff 100%)", zIndex: 2, display: "flex", alignItems: "flex-end", justifyContent: "center", pb: 4 }}>
                      <Stack alignItems="center" spacing={1.5}>
                        <Box sx={{ width: 52, height: 52, borderRadius: "16px", background: TEAL_LIGHT, color: TEAL, display: "flex", alignItems: "center", justifyContent: "center" }}><LockRoundedIcon sx={{ fontSize: 26 }} /></Box>
                        <Typography fontWeight={800} sx={{ color: "#1E293B" }}>Premium Members Only</Typography>
                        <Typography sx={{ fontSize: "0.8rem", color: "#64748B", textAlign: "center", maxWidth: 300 }}>Unlock complete property details, contact information, and direct seller communication.</Typography>
                        <Button variant="contained" component={RouterLink} to="/subscription" startIcon={<WorkspacePremiumRoundedIcon />} sx={{ borderRadius: "12px", px: 4, py: 1.25, fontWeight: 800, background: "linear-gradient(135deg, " + TEAL + ", " + TEAL_DARK + ")", boxShadow: "0 6px 20px rgba(15,118,110,0.3)" }}>Unlock for Rs.299</Button>
                      </Stack>
                    </Box>
                  )}
                  <TableContainer sx={{ filter: !isPremium ? "blur(3px)" : "none", userSelect: !isPremium ? "none" : "auto" }}>
                    <Table>
                      <TableBody>
                        {detailRows.map((row, i) => (
                          <TableRow key={row.label} sx={{ background: i % 2 === 0 ? "#FAFBFF" : "#fff", "&:last-child td": { border: 0 } }}>
                            <TableCell sx={{ fontWeight: 700, color: "#475569", fontSize: "0.82rem", width: "38%", py: 2, borderColor: "#F1F5F9" }}>{row.label}</TableCell>
                            <TableCell sx={{ fontWeight: 600, color: "#1E293B", fontSize: "0.88rem", py: 2, borderColor: "#F1F5F9" }}>{row.value}</TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  </TableContainer>
                </Card>
              </Grid>
              <Grid item xs={12} md={4}>
                <Stack spacing={2.5}>
                  <Typography variant="h6" fontWeight={900} sx={{ color: "#1E293B" }}>Why EasyDeal?</Typography>
                  <FeatureCard icon={<CheckCircleRoundedIcon />} title="Verified Listings" desc="Every property is reviewed for accuracy and authenticity before going live on EasyDeal." />
                  <FeatureCard icon={<SupportAgentRoundedIcon />} title="On-Ground Assistance" desc="We arrange physical site visits and documentation support, not just digital connections." />
                  <FeatureCard icon={<ShieldRoundedIcon />} title="Secure and Private" desc="Seller contacts are revealed only to premium verified members. Your data stays private." />
                  <FeatureCard icon={<TrendingUpRoundedIcon />} title="Best Prices" desc="Direct owner listings mean no broker fees or hidden charges. Real market pricing always." />
                </Stack>
              </Grid>
            </Grid>
          </Box>
        </Container>
      </Box>
    </>
  );
}
