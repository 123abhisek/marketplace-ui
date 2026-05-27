// import {
//   Box,
//   Card,
//   CardContent,
//   Chip,
//   Grid,
//   Stack,
//   Typography,
// } from "@mui/material";
// import HomeWorkRoundedIcon from "@mui/icons-material/HomeWorkRounded";
// import DirectionsCarRoundedIcon from "@mui/icons-material/DirectionsCarRounded";
// import { useAppState } from "../../hooks/useAppState";

// const cardSx = {
//   borderRadius: "20px",
//   border: "1px solid rgba(15,23,42,0.08)",
//   boxShadow: "0 10px 30px rgba(15,23,42,0.05)",
//   background: "#fff",
// };

// export default function AdminListingsPage() {
//   const { properties = [], vehicles = [] } = useAppState();

//   const items = [
//     ...properties.map((item, index) => ({
//       id: item.id || `p-${index}`,
//       type: "Property",
//       title: item.title || "Untitled property",
//       location: item.location || "Unknown location",
//       price: item.price || item.expectedprice || "N/A",
//     })),
//     ...vehicles.map((item, index) => ({
//       id: item.id || `v-${index}`,
//       type: "Vehicle",
//       title: item.title || "Untitled vehicle",
//       location: item.location || "Unknown location",
//       price: item.price || item.expectedprice || "N/A",
//     })),
//   ];

//   return (
//     <Box sx={{ p: { xs: 2, md: 3 }, background: "#f8fafc", minHeight: "100vh" }}>
//       <Stack spacing={3}>
//         <Box>
//           <Typography sx={{ fontSize: "1.7rem", fontWeight: 900, color: "#0f172a" }}>
//             Manage Listings
//           </Typography>
//           <Typography sx={{ mt: 0.7, fontSize: "0.9rem", color: "#64748b" }}>
//             Review and manage all property and vehicle listings from one admin panel.
//           </Typography>
//         </Box>

//         <Grid container spacing={2}>
//           {items.map((item) => (
//             <Grid item xs={12} md={6} lg={4} key={item.id}>
//               <Card sx={cardSx}>
//                 <CardContent sx={{ p: 2.3 }}>
//                   <Stack spacing={1.2}>
//                     <Stack direction="row" justifyContent="space-between" alignItems="center">
//                       <Chip
//                         icon={item.type === "Property" ? <HomeWorkRoundedIcon /> : <DirectionsCarRoundedIcon />}
//                         label={item.type}
//                         sx={{
//                           fontWeight: 700,
//                           background: item.type === "Property" ? "rgba(15,118,110,0.10)" : "rgba(37,99,235,0.10)",
//                           color: item.type === "Property" ? "#0f766e" : "#2563eb",
//                         }}
//                       />
//                       <Chip label="Active" size="small" sx={{ fontWeight: 700 }} />
//                     </Stack>

//                     <Typography sx={{ fontWeight: 800, color: "#0f172a", fontSize: "1rem" }}>
//                       {item.title}
//                     </Typography>
//                     <Typography sx={{ fontSize: "0.82rem", color: "#64748b" }}>
//                       {item.location}
//                     </Typography>
//                     <Typography sx={{ fontSize: "0.9rem", fontWeight: 900, color: "#0f172a" }}>
//                       ₹{item.price}
//                     </Typography>
//                   </Stack>
//                 </CardContent>
//               </Card>
//             </Grid>
//           ))}
//         </Grid>
//       </Stack>
//     </Box>
//   );
// }

// import { useState, useMemo } from "react";
// import {
//   Box,
//   Button,
//   Card,
//   CardContent,
//   Chip,
//   Dialog,
//   DialogActions,
//   DialogContent,
//   DialogTitle,
//   Divider,
//   Grid,
//   InputAdornment,
//   Stack,
//   TextField,
//   Typography,
// } from "@mui/material";
// import HomeWorkRoundedIcon from "@mui/icons-material/HomeWorkRounded";
// import DirectionsCarRoundedIcon from "@mui/icons-material/DirectionsCarRounded";
// import EditRoundedIcon from "@mui/icons-material/EditRounded";
// import DeleteRoundedIcon from "@mui/icons-material/DeleteRounded";
// import SearchRoundedIcon from "@mui/icons-material/SearchRounded";
// import LocationOnRoundedIcon from "@mui/icons-material/LocationOnRounded";
// import CurrencyRupeeRoundedIcon from "@mui/icons-material/CurrencyRupeeRounded";
// import WarningAmberRoundedIcon from "@mui/icons-material/WarningAmberRounded";
// import FilterListRoundedIcon from "@mui/icons-material/FilterListRounded";
// import { useAppState } from "../../hooks/useAppState";

// const UI = {
//   bg: "#F5F7FB",
//   surface: "#FFFFFF",
//   surfaceSoft: "#F8FAFC",
//   border: "rgba(15,23,42,0.08)",
//   borderStrong: "rgba(15,23,42,0.12)",
//   text: "#111827",
//   muted: "#667085",
//   faint: "#98A2B3",
//   primary: "#0F766E",
//   primarySoft: "rgba(15,118,110,0.10)",
//   blue: "#2563EB",
//   blueSoft: "rgba(37,99,235,0.10)",
//   success: "#16A34A",
//   successSoft: "rgba(22,163,74,0.10)",
//   danger: "#DC2626",
//   dangerSoft: "rgba(220,38,38,0.10)",
//   shadowSm: "0 2px 10px rgba(15,23,42,0.04)",
//   shadowMd: "0 10px 32px rgba(15,23,42,0.06)",
// };

// const cardSx = {
//   borderRadius: "22px",
//   border: `1px solid ${UI.border}`,
//   background: UI.surface,
//   boxShadow: UI.shadowSm,
//   transition: "box-shadow 0.2s ease, transform 0.2s ease",
//   "&:hover": { boxShadow: UI.shadowMd, transform: "translateY(-2px)" },
// };

// const inputSx = {
//   "& .MuiOutlinedInput-root": {
//     borderRadius: "14px",
//     background: UI.surfaceSoft,
//     fontSize: "0.88rem",
//     fontWeight: 600,
//     "& fieldset": { borderColor: UI.border },
//     "&:hover fieldset": { borderColor: UI.borderStrong },
//     "&.Mui-focused fieldset": { borderColor: UI.primary },
//   },
//   "& .MuiInputLabel-root": {
//     fontSize: "0.85rem",
//     fontWeight: 600,
//     color: UI.muted,
//     "&.Mui-focused": { color: UI.primary },
//   },
// };

// const btnPrimary = {
//   minHeight: 44,
//   px: 2.5,
//   borderRadius: "14px",
//   textTransform: "none",
//   fontWeight: 800,
//   fontSize: "0.88rem",
//   color: "#fff",
//   background: UI.primary,
//   boxShadow: "none",
//   "&:hover": { background: "#0c615b", boxShadow: "none" },
// };

// const btnOutlined = {
//   minHeight: 44,
//   px: 2.5,
//   borderRadius: "14px",
//   textTransform: "none",
//   fontWeight: 800,
//   fontSize: "0.88rem",
//   color: UI.text,
//   background: UI.surface,
//   border: `1px solid ${UI.border}`,
//   boxShadow: "none",
//   "&:hover": { background: UI.surfaceSoft, boxShadow: "none" },
// };

// const btnDanger = {
//   minHeight: 44,
//   px: 2.5,
//   borderRadius: "14px",
//   textTransform: "none",
//   fontWeight: 800,
//   fontSize: "0.88rem",
//   color: "#fff",
//   background: UI.danger,
//   boxShadow: "none",
//   "&:hover": { background: "#b91c1c", boxShadow: "none" },
// };

// function ListingCard({ item, onEdit, onDelete }) {
//   const isProperty = item.type === "Property";
//   const tone = isProperty ? UI.primary : UI.blue;
//   const soft = isProperty ? UI.primarySoft : UI.blueSoft;
//   const borderAccent = isProperty
//     ? "rgba(15,118,110,0.18)"
//     : "rgba(37,99,235,0.18)";
//   const Icon = isProperty ? HomeWorkRoundedIcon : DirectionsCarRoundedIcon;

//   return (
//     <Card sx={cardSx}>
//       <CardContent sx={{ p: 0, "&:last-child": { pb: 0 } }}>
//         <Box
//           sx={{
//             height: 80,
//             background: isProperty
//               ? "linear-gradient(135deg, rgba(15,118,110,0.08) 0%, rgba(37,99,235,0.06) 100%)"
//               : "linear-gradient(135deg, rgba(37,99,235,0.08) 0%, rgba(124,58,237,0.06) 100%)",
//             display: "flex",
//             alignItems: "center",
//             justifyContent: "space-between",
//             px: 2.2,
//             borderBottom: `1px solid ${UI.border}`,
//           }}
//         >
//           <Box
//             sx={{
//               width: 48,
//               height: 48,
//               borderRadius: "16px",
//               background: soft,
//               border: `1px solid ${borderAccent}`,
//               display: "grid",
//               placeItems: "center",
//               color: tone,
//             }}
//           >
//             <Icon sx={{ fontSize: 26 }} />
//           </Box>

//           <Stack direction="row" spacing={1}>
//             <Chip
//               label={item.type}
//               size="small"
//               sx={{
//                 height: 26,
//                 borderRadius: "999px",
//                 fontWeight: 800,
//                 fontSize: "0.7rem",
//                 color: tone,
//                 background: soft,
//               }}
//             />
//             <Chip
//               label="Active"
//               size="small"
//               sx={{
//                 height: 26,
//                 borderRadius: "999px",
//                 fontWeight: 800,
//                 fontSize: "0.7rem",
//                 color: UI.success,
//                 background: UI.successSoft,
//               }}
//             />
//           </Stack>
//         </Box>

//         <Box sx={{ p: 2.2 }}>
//           <Typography
//             sx={{
//               fontSize: "0.97rem",
//               fontWeight: 900,
//               color: UI.text,
//               lineHeight: 1.35,
//               mb: 0.6,
//               display: "-webkit-box",
//               WebkitLineClamp: 2,
//               WebkitBoxOrient: "vertical",
//               overflow: "hidden",
//             }}
//           >
//             {item.title}
//           </Typography>

//           <Stack
//             direction="row"
//             spacing={0.6}
//             alignItems="center"
//             sx={{ mb: 0.5 }}
//           >
//             <LocationOnRoundedIcon sx={{ fontSize: 14, color: UI.faint }} />
//             <Typography
//               sx={{ fontSize: "0.78rem", color: UI.muted, fontWeight: 600 }}
//             >
//               {item.location}
//             </Typography>
//           </Stack>

//           <Stack
//             direction="row"
//             spacing={0.5}
//             alignItems="center"
//             sx={{ mb: 2 }}
//           >
//             <CurrencyRupeeRoundedIcon sx={{ fontSize: 14, color: tone }} />
//             <Typography
//               sx={{ fontSize: "0.97rem", fontWeight: 900, color: UI.text }}
//             >
//               {item.price}
//             </Typography>
//           </Stack>

//           <Divider sx={{ mb: 1.8, borderColor: UI.border }} />

//           <Stack direction="row" spacing={1}>
//             <Button
//               fullWidth
//               startIcon={<EditRoundedIcon sx={{ fontSize: 17 }} />}
//               onClick={() => onEdit(item)}
//               sx={{
//                 minHeight: 40,
//                 borderRadius: "12px",
//                 textTransform: "none",
//                 fontWeight: 800,
//                 fontSize: "0.82rem",
//                 color: tone,
//                 background: soft,
//                 border: `1px solid ${borderAccent}`,
//                 boxShadow: "none",
//                 "&:hover": { opacity: 0.85, boxShadow: "none" },
//               }}
//             >
//               Edit
//             </Button>
//             <Button
//               fullWidth
//               startIcon={<DeleteRoundedIcon sx={{ fontSize: 17 }} />}
//               onClick={() => onDelete(item)}
//               sx={{
//                 minHeight: 40,
//                 borderRadius: "12px",
//                 textTransform: "none",
//                 fontWeight: 800,
//                 fontSize: "0.82rem",
//                 color: UI.danger,
//                 background: UI.dangerSoft,
//                 border: "1px solid rgba(220,38,38,0.18)",
//                 boxShadow: "none",
//                 "&:hover": { opacity: 0.85, boxShadow: "none" },
//               }}
//             >
//               Delete
//             </Button>
//           </Stack>
//         </Box>
//       </CardContent>
//     </Card>
//   );
// }

// export default function AdminListingsPage() {
//   const { properties = [], vehicles = [] } = useAppState();

//   const [localItems, setLocalItems] = useState(() => [
//     ...properties.map((item, i) => ({
//       id: item.id || `p-${i}`,
//       type: "Property",
//       title: item.title || "Untitled property",
//       location: item.location || "Unknown location",
//       price: String(item.price || item.expectedprice || "N/A"),
//     })),
//     ...vehicles.map((item, i) => ({
//       id: item.id || `v-${i}`,
//       type: "Vehicle",
//       title: item.title || "Untitled vehicle",
//       location: item.location || "Unknown location",
//       price: String(item.price || item.expectedprice || "N/A"),
//     })),
//   ]);

//   const [search, setSearch] = useState("");
//   const [filter, setFilter] = useState("All");

//   const [editOpen, setEditOpen] = useState(false);
//   const [editId, setEditId] = useState(null);
//   const [editForm, setEditForm] = useState({
//     title: "",
//     location: "",
//     price: "",
//   });
//   const [editErrors, setEditErrors] = useState({});

//   const [deleteOpen, setDeleteOpen] = useState(false);
//   const [deleteTarget, setDeleteTarget] = useState(null);

//   const filtered = useMemo(
//     () =>
//       localItems.filter((item) => {
//         const q = search.toLowerCase();
//         const matchSearch =
//           item.title.toLowerCase().includes(q) ||
//           item.location.toLowerCase().includes(q);
//         const matchFilter = filter === "All" || item.type === filter;
//         return matchSearch && matchFilter;
//       }),
//     [localItems, search, filter],
//   );

//   const counts = useMemo(
//     () => ({
//       All: localItems.length,
//       Property: localItems.filter((i) => i.type === "Property").length,
//       Vehicle: localItems.filter((i) => i.type === "Vehicle").length,
//     }),
//     [localItems],
//   );

//   function openEdit(item) {
//     setEditId(item.id);
//     setEditForm({
//       title: item.title,
//       location: item.location,
//       price: item.price,
//     });
//     setEditErrors({});
//     setEditOpen(true);
//   }

//   function closeEdit() {
//     setEditOpen(false);
//     setEditId(null);
//     setEditErrors({});
//   }

//   function handleFieldChange(field, value) {
//     setEditForm((prev) => ({ ...prev, [field]: value }));
//     if (editErrors[field]) {
//       setEditErrors((prev) => ({ ...prev, [field]: false }));
//     }
//   }

//   function validateEdit() {
//     const errors = {};
//     if (!editForm.title.trim()) errors.title = "Title is required";
//     if (!editForm.location.trim()) errors.location = "Location is required";
//     if (!editForm.price.trim()) errors.price = "Price is required";
//     setEditErrors(errors);
//     return Object.keys(errors).length === 0;
//   }

//   function saveEdit() {
//     if (!validateEdit()) return;

//     setLocalItems((prev) =>
//       prev.map((item) =>
//         item.id === editId
//           ? {
//               ...item,
//               title: editForm.title.trim(),
//               location: editForm.location.trim(),
//               price: editForm.price.trim(),
//             }
//           : item,
//       ),
//     );

//     closeEdit();
//   }

//   function openDelete(item) {
//     setDeleteTarget(item);
//     setDeleteOpen(true);
//   }

//   function closeDelete() {
//     setDeleteOpen(false);
//     setDeleteTarget(null);
//   }

//   function confirmDelete() {
//     setLocalItems((prev) => prev.filter((item) => item.id !== deleteTarget.id));
//     closeDelete();
//   }

//   const editItemMeta = localItems.find((i) => i.id === editId) ?? null;

//   return (
//     <Box sx={{ p: { xs: 2, md: 3 }, background: UI.bg, minHeight: "100vh" }}>
//       <Stack spacing={3}>
//         <Box>
//           <Typography
//             sx={{
//               fontSize: "1.7rem",
//               fontWeight: 900,
//               color: UI.text,
//               letterSpacing: "-0.03em",
//             }}
//           >
//             Manage Listings
//           </Typography>
//           <Typography sx={{ mt: 0.7, fontSize: "0.9rem", color: UI.muted }}>
//             Review, edit and remove all property and vehicle listings from one
//             admin panel.
//           </Typography>
//         </Box>

//         <Stack direction="row" spacing={1.2} flexWrap="wrap">
//           {["All", "Property", "Vehicle"].map((type) => (
//             <Chip
//               key={type}
//               label={`${type} (${counts[type]})`}
//               onClick={() => setFilter(type)}
//               sx={{
//                 height: 36,
//                 borderRadius: "12px",
//                 fontWeight: 800,
//                 fontSize: "0.8rem",
//                 cursor: "pointer",
//                 color:
//                   filter === type
//                     ? type === "Vehicle"
//                       ? UI.blue
//                       : UI.primary
//                     : UI.muted,
//                 background:
//                   filter === type
//                     ? type === "Vehicle"
//                       ? UI.blueSoft
//                       : UI.primarySoft
//                     : UI.surface,
//                 border: `1px solid ${UI.border}`,
//               }}
//             />
//           ))}
//         </Stack>

//         <TextField
//           placeholder="Search by title or location…"
//           value={search}
//           onChange={(e) => setSearch(e.target.value)}
//           fullWidth
//           size="small"
//           sx={inputSx}
//           InputProps={{
//             startAdornment: (
//               <InputAdornment position="start">
//                 <SearchRoundedIcon sx={{ fontSize: 18, color: UI.faint }} />
//               </InputAdornment>
//             ),
//           }}
//         />

//         {filtered.length === 0 ? (
//           <Box
//             sx={{
//               py: 8,
//               textAlign: "center",
//               border: `1.5px dashed ${UI.border}`,
//               borderRadius: "20px",
//               background: UI.surface,
//             }}
//           >
//             <FilterListRoundedIcon
//               sx={{ fontSize: 40, color: UI.faint, mb: 1 }}
//             />
//             <Typography sx={{ fontWeight: 800, color: UI.muted }}>
//               No listings found
//             </Typography>
//             <Typography sx={{ fontSize: "0.82rem", color: UI.faint, mt: 0.5 }}>
//               Try adjusting your search or filter.
//             </Typography>
//           </Box>
//         ) : (
//           <Grid container spacing={2.2}>
//             {filtered.map((item) => (
//               <Grid item xs={12} sm={6} lg={4} key={item.id}>
//                 <ListingCard
//                   item={item}
//                   onEdit={openEdit}
//                   onDelete={openDelete}
//                 />
//               </Grid>
//             ))}
//           </Grid>
//         )}
//       </Stack>

//       <Dialog
//         open={editOpen}
//         onClose={closeEdit}
//         maxWidth="sm"
//         fullWidth
//         PaperProps={{
//           sx: {
//             borderRadius: "24px",
//             boxShadow: "0 24px 64px rgba(15,23,42,0.12)",
//             p: 0.5,
//           },
//         }}
//       >
//         <DialogTitle sx={{ px: 3, pt: 2.8, pb: 0.5 }}>
//           <Stack direction="row" spacing={1.5} alignItems="center">
//             <Box
//               sx={{
//                 width: 44,
//                 height: 44,
//                 borderRadius: "14px",
//                 background:
//                   editItemMeta?.type === "Property"
//                     ? UI.primarySoft
//                     : UI.blueSoft,
//                 color: editItemMeta?.type === "Property" ? UI.primary : UI.blue,
//                 display: "grid",
//                 placeItems: "center",
//               }}
//             >
//               {editItemMeta?.type === "Property" ? (
//                 <HomeWorkRoundedIcon sx={{ fontSize: 22 }} />
//               ) : (
//                 <DirectionsCarRoundedIcon sx={{ fontSize: 22 }} />
//               )}
//             </Box>
//             <Box>
//               <Typography
//                 sx={{
//                   fontSize: "1.12rem",
//                   fontWeight: 900,
//                   color: UI.text,
//                   letterSpacing: "-0.02em",
//                 }}
//               >
//                 Edit Listing
//               </Typography>
//               <Typography
//                 sx={{ fontSize: "0.78rem", color: UI.muted, fontWeight: 600 }}
//               >
//                 {editItemMeta?.type} · ID: {editId}
//               </Typography>
//             </Box>
//           </Stack>
//         </DialogTitle>

//         <Divider sx={{ mx: 3, mt: 2, borderColor: UI.border }} />

//         <DialogContent sx={{ px: 3, py: 2.5 }}>
//           {/* <Stack spacing={2.4}>
//             <TextField
//               label="Title"
//               fullWidth
//               value={editForm.title}
//               onChange={(e) => handleFieldChange("title", e.target.value)}
//               error={!!editErrors.title}
//               helperText={editErrors.title}
//               sx={inputSx}
//               autoFocus
//             />
//             <TextField
//               label="Location"
//               fullWidth
//               value={editForm.location}
//               onChange={(e) => handleFieldChange("location", e.target.value)}
//               error={!!editErrors.location}
//               helperText={editErrors.location}
//               sx={inputSx}
//             />
//             <TextField
//               label="Price"
//               fullWidth
//               value={editForm.price}
//               onChange={(e) => handleFieldChange("price", e.target.value)}
//               error={!!editErrors.price}
//               helperText={editErrors.price}
//               sx={inputSx}
//               InputProps={{
//                 startAdornment: (
//                   <InputAdornment position="start">
//                     <CurrencyRupeeRoundedIcon sx={{ fontSize: 16, color: UI.faint }} />
//                   </InputAdornment>
//                 ),
//               }}
//             />
//           </Stack> */}

//           {editItemMeta?.type === "Property" ? (
//             <Stack spacing={2.5}>
//               {/* ── Section 1: Basic Information ── */}
//               <Card
//                 sx={{
//                   borderRadius: "20px",
//                   boxShadow: "0 2px 20px rgba(15,23,42,0.07)",
//                 }}
//               >
//                 <CardContent sx={{ p: 3 }}>
//                   <SectionHeader
//                     icon={<AddHomeRoundedIcon sx={{ fontSize: 18 }} />}
//                     title="Basic Information"
//                     description="Property title, type, and location details"
//                   />
//                   <Divider sx={{ mb: 3, opacity: 0.6 }} />
//                   <Grid container spacing={2.5}>
//                     <Grid item xs={12}>
//                       <FormInput
//                         name="title"
//                         label="Listing Title *"
//                         control={control}
//                         rules={{ required: "Title is required" }}
//                       />
//                     </Grid>
//                     <Grid item xs={12} sm={6} md={4}>
//                       <SelectInput
//                         name="propertyType"
//                         label="Property Type *"
//                         control={control}
//                         rules={{ required: "Property type is required" }}
//                         defaultValue={PROPERTY_TYPES[0].value}
//                         options={PROPERTY_TYPES}
//                       />
//                     </Grid>
//                     <Grid item xs={12} sm={6} md={4}>
//                       <FormInput
//                         name="location"
//                         label="Location / Address"
//                         control={control}
//                       />
//                     </Grid>
//                     <Grid item xs={12} sm={6} md={4}>
//                       <FormInput
//                         name="apartmentName"
//                         label="Apartment / Society Name"
//                         control={control}
//                       />
//                     </Grid>
//                     <Grid item xs={12} sm={6} md={4}>
//                       <FormInput
//                         name="contactNumber"
//                         label="Contact Number *"
//                         control={control}
//                         rules={{
//                           required: "Contact number is required",
//                           pattern: {
//                             value: /^[6-9]\d{9}$/,
//                             message: "Enter a valid 10-digit mobile number",
//                           },
//                         }}
//                       />
//                     </Grid>
//                   </Grid>
//                 </CardContent>
//               </Card>

//               {/* ── Section 2: Property Details ── */}
//               <Card
//                 sx={{
//                   borderRadius: "20px",
//                   boxShadow: "0 2px 20px rgba(15,23,42,0.07)",
//                 }}
//               >
//                 <CardContent sx={{ p: 3 }}>
//                   <SectionHeader
//                     icon={<span style={{ fontSize: 15 }}>📐</span>}
//                     title="Property Details"
//                     description="Dimensions, rooms, and structural information"
//                   />
//                   <Divider sx={{ mb: 3, opacity: 0.6 }} />
//                   <Grid container spacing={2.5}>
//                     {isResidential && (
//                       <>
//                         <Grid item xs={6} sm={4}>
//                           <FormInput
//                             name="floor"
//                             label="Floor"
//                             control={control}
//                           />
//                         </Grid>
//                         <Grid item xs={6} sm={4}>
//                           <FormInput
//                             name="rooms"
//                             label="Rooms"
//                             control={control}
//                           />
//                         </Grid>
//                         <Grid item xs={6} sm={4}>
//                           <FormInput
//                             name="bedrooms"
//                             label="Bedrooms"
//                             control={control}
//                           />
//                         </Grid>
//                       </>
//                     )}
//                     <Grid item xs={12} sm={6} md={4}>
//                       <FormInput
//                         name="area"
//                         label="Built-up Area (e.g. 1800 sqft)"
//                         control={control}
//                       />
//                     </Grid>
//                     <Grid item xs={12} sm={6} md={4}>
//                       <FormInput
//                         name="landArea"
//                         label="Land Area (e.g. 2 Acres)"
//                         control={control}
//                       />
//                     </Grid>
//                     {isAgri && (
//                       <Grid item xs={12}>
//                         <FormInput
//                           name="cropsGrown"
//                           label="Crops Grown"
//                           control={control}
//                         />
//                       </Grid>
//                     )}
//                   </Grid>
//                 </CardContent>
//               </Card>

//               {/* ── Section 3: Pricing & Terms ── */}
//               <Card
//                 sx={{
//                   borderRadius: "20px",
//                   boxShadow: "0 2px 20px rgba(15,23,42,0.07)",
//                 }}
//               >
//                 <CardContent sx={{ p: 3 }}>
//                   <SectionHeader
//                     icon={<span style={{ fontSize: 15 }}>💰</span>}
//                     title="Pricing & Terms"
//                     description="Expected price and rental / lease information"
//                   />
//                   <Divider sx={{ mb: 3, opacity: 0.6 }} />
//                   <Grid container spacing={2.5}>
//                     <Grid item xs={12} sm={6} md={4}>
//                       <FormInput
//                         name="expectedPrice"
//                         label="Expected Price (₹) *"
//                         control={control}
//                         rules={{
//                           required: "Expected price is required",
//                           validate: (v) => {
//                             const n = parseFloat(String(v ?? "").trim());
//                             if (!String(v ?? "").trim())
//                               return "Expected price is required";
//                             if (isNaN(n))
//                               return "Price must be a valid number (e.g. 5000000)";
//                             if (n <= 0) return "Price must be greater than ₹0";
//                             return true;
//                           },
//                         }}
//                       />
//                     </Grid>
//                     <Grid item xs={12} sm={6} md={4}>
//                       <FormInput
//                         name="rentLease"
//                         label="Rent / Lease Details (optional)"
//                         control={control}
//                       />
//                     </Grid>
//                   </Grid>
//                 </CardContent>
//               </Card>

//               {/* ── Section 4: Images ── */}
//               <Card
//                 sx={{
//                   borderRadius: "20px",
//                   boxShadow: "0 2px 20px rgba(15,23,42,0.07)",
//                 }}
//               >
//                 <CardContent sx={{ p: 3 }}>
//                   <SectionHeader
//                     icon={<span style={{ fontSize: 15 }}>🖼️</span>}
//                     title="Property Images"
//                     description="Upload multiple photos to attract buyers (drag & drop supported)"
//                   />
//                   <Divider sx={{ mb: 3, opacity: 0.6 }} />
//                   <ImageUploader
//                     value={files}
//                     onChange={setFiles}
//                     label="Upload Property Photos"
//                   />
//                 </CardContent>
//               </Card>

//               {/* ── Action row ── */}
//               <Box sx={{ display: "flex", justifyContent: "flex-end", gap: 2 }}>
//                 <Button
//                   onClick={() => navigate(-1)}
//                   sx={{
//                     borderRadius: "12px",
//                     fontWeight: 700,
//                     color: "#64748B",
//                     "&:hover": { background: "#F1F5F9" },
//                   }}
//                 >
//                   Cancel
//                 </Button>
//                 <Button
//                   type="submit"
//                   variant="contained"
//                   disabled={submitting}
//                   startIcon={
//                     submitting ? (
//                       <CircularProgress size={16} color="inherit" />
//                     ) : (
//                       <SaveRoundedIcon />
//                     )
//                   }
//                   sx={{
//                     borderRadius: "12px",
//                     fontWeight: 800,
//                     px: 4,
//                     background:
//                       "linear-gradient(135deg, #4361EE 0%, #7C3AED 100%)",
//                     boxShadow: "0 4px 16px rgba(67,97,238,0.30)",
//                     "&:hover": { boxShadow: "0 6px 24px rgba(67,97,238,0.40)" },
//                     "&.Mui-disabled": { opacity: 0.55, background: "#CBD5E1" },
//                   }}
//                 >
//                   {submitting ? "Posting…" : "Post Property Listing"}
//                 </Button>
//               </Box>
//             </Stack>
//           ) : (
//             <Stack spacing={2.5}>
//               {/* ── Section 1: Vehicle Identity ── */}
//               <Card
//                 sx={{
//                   borderRadius: "20px",
//                   boxShadow: "0 2px 20px rgba(15,23,42,0.07)",
//                 }}
//               >
//                 <CardContent sx={{ p: 3 }}>
//                   <SectionHeader
//                     icon={<DirectionsCarRoundedIcon sx={{ fontSize: 18 }} />}
//                     title="Vehicle Identity"
//                     description="Registration number, brand, model, and year"
//                   />
//                   <Divider sx={{ mb: 3, opacity: 0.6 }} />
//                   <Grid container spacing={2.5}>
//                     <Grid item xs={12}>
//                       <FormInput
//                         name="title"
//                         label="Listing Title"
//                         control={control}
//                         rules={{ required: "Title is required" }}
//                       />
//                     </Grid>

//                     <Grid item xs={12} sm={6}>
//                       <FormInput
//                         name="vehicleNumber"
//                         label="Vehicle Registration Number"
//                         control={control}
//                       />
//                     </Grid>

//                     <Grid item xs={12} sm={6}>
//                       <FormInput
//                         name="brand"
//                         label="Brand (e.g. Hyundai)"
//                         control={control}
//                       />
//                     </Grid>

//                     <Grid item xs={12} sm={4}>
//                       <FormInput
//                         name="model"
//                         label="Model (e.g. i20)"
//                         control={control}
//                       />
//                     </Grid>

//                     {/* Bug Fix 5 — year numeric + range validation */}
//                     <Grid item xs={12} sm={4}>
//                       <FormInput
//                         name="year"
//                         label="Year of Manufacture"
//                         control={control}
//                         rules={{
//                           validate: (v) => {
//                             if (!v) return true; // optional field
//                             const n = parseInt(String(v).trim(), 10);
//                             if (
//                               isNaN(n) ||
//                               n < 1900 ||
//                               n > new Date().getFullYear()
//                             )
//                               return `Enter a valid year between 1900 and ${new Date().getFullYear()}`;
//                             return true;
//                           },
//                         }}
//                       />
//                     </Grid>

//                     <Grid item xs={12} sm={4}>
//                       <FormInput
//                         name="rtoCode"
//                         label="RTO Code (e.g. KA03)"
//                         control={control}
//                       />
//                     </Grid>
//                   </Grid>
//                 </CardContent>
//               </Card>

//               {/* ── Section 2: Usage & Location ── */}
//               <Card
//                 sx={{
//                   borderRadius: "20px",
//                   boxShadow: "0 2px 20px rgba(15,23,42,0.07)",
//                 }}
//               >
//                 <CardContent sx={{ p: 3 }}>
//                   <SectionHeader
//                     icon={<span style={{ fontSize: 15 }}>🚦</span>}
//                     title="Usage & Location"
//                     description="Odometer reading, registered state, and current location"
//                   />
//                   <Divider sx={{ mb: 3, opacity: 0.6 }} />
//                   <Grid container spacing={2.5}>
//                     {/* Bug Fix 5 — kmDriven numeric validation */}
//                     <Grid item xs={12} sm={4}>
//                       <FormInput
//                         name="kmDriven"
//                         label="KM Driven"
//                         control={control}
//                         rules={{
//                           validate: (v) => {
//                             if (!v) return true; // optional field
//                             const n = parseFloat(String(v).trim());
//                             if (isNaN(n) || n < 0)
//                               return "Enter a valid KM reading (e.g. 45000)";
//                             return true;
//                           },
//                         }}
//                       />
//                     </Grid>

//                     <Grid item xs={12} sm={4}>
//                       <FormInput name="state" label="State" control={control} />
//                     </Grid>

//                     <Grid item xs={12} sm={4}>
//                       <FormInput
//                         name="location"
//                         label="City / Area"
//                         control={control}
//                       />
//                     </Grid>
//                   </Grid>
//                 </CardContent>
//               </Card>

//               {/* ── Section 3: Pricing & Contact ── */}
//               <Card
//                 sx={{
//                   borderRadius: "20px",
//                   boxShadow: "0 2px 20px rgba(15,23,42,0.07)",
//                 }}
//               >
//                 <CardContent sx={{ p: 3 }}>
//                   <SectionHeader
//                     icon={<span style={{ fontSize: 15 }}>💰</span>}
//                     title="Price & Contact"
//                     description="Asking price and seller contact number"
//                   />
//                   <Divider sx={{ mb: 3, opacity: 0.6 }} />
//                   <Grid container spacing={2.5}>
//                     <Grid item xs={12} sm={6}>
//                       <FormInput
//                         name="expectedPrice"
//                         label="Asking Price"
//                         control={control}
//                         rules={{
//                           required: "Price is required",
//                           validate: (v) => {
//                             const n = parseFloat(String(v ?? "").trim());
//                             if (isNaN(n) || n <= 0)
//                               return "Price must be a valid number greater than 0";
//                             return true;
//                           },
//                         }}
//                       />
//                     </Grid>

//                     <Grid item xs={12} sm={6}>
//                       <FormInput
//                         name="contactNumber"
//                         label="Contact Number"
//                         control={control}
//                         rules={{
//                           required: "Contact is required",
//                           pattern: {
//                             value: /^[6-9]\d{9}$/,
//                             message: "Enter a valid 10-digit mobile number",
//                           },
//                         }}
//                       />
//                     </Grid>
//                   </Grid>
//                 </CardContent>
//               </Card>

//               {/* ── Section 4: Photos ── */}
//               <Card
//                 sx={{
//                   borderRadius: "20px",
//                   boxShadow: "0 2px 20px rgba(15,23,42,0.07)",
//                 }}
//               >
//                 <CardContent sx={{ p: 3 }}>
//                   <SectionHeader
//                     icon={<span style={{ fontSize: 15 }}>📷</span>}
//                     title="Vehicle Photos"
//                     description="Upload exterior and interior photos — drag & drop supported"
//                   />
//                   <Divider sx={{ mb: 3, opacity: 0.6 }} />

//                   {/* Bug Fix 3 — show image validation error */}
//                   {imageError && (
//                     <Alert
//                       severity="warning"
//                       onClose={() => setImageError("")}
//                       sx={{ mb: 2, borderRadius: "12px", fontSize: "0.83rem" }}
//                     >
//                       {imageError}
//                     </Alert>
//                   )}

//                   <ImageUploader
//                     value={files}
//                     onChange={(newFiles) => {
//                       setFiles(newFiles);
//                       if (newFiles.length > 0) setImageError("");
//                     }}
//                     label="Upload Vehicle Photos"
//                   />
//                 </CardContent>
//               </Card>

//               {/* ── Submit row ── */}
//               <Box sx={{ display: "flex", justifyContent: "flex-end", gap: 2 }}>
//                 <Button
//                   onClick={handleCancel}
//                   sx={{
//                     borderRadius: "12px",
//                     fontWeight: 700,
//                     color: "#64748B",
//                     "&:hover": { background: "#F1F5F9" },
//                   }}
//                 >
//                   Cancel
//                 </Button>

//                 <Button
//                   type="submit"
//                   variant="contained"
//                   disabled={!user.role || submitting}
//                   startIcon={
//                     submitting ? (
//                       <CircularProgress size={16} color="inherit" />
//                     ) : (
//                       <SaveRoundedIcon />
//                     )
//                   }
//                   sx={{
//                     borderRadius: "12px",
//                     fontWeight: 800,
//                     px: 4,
//                     background:
//                       "linear-gradient(135deg, #7C3AED 0%, #4361EE 100%)",
//                     boxShadow: "0 4px 16px rgba(124,58,237,0.30)",
//                     "&:hover": {
//                       boxShadow: "0 6px 24px rgba(124,58,237,0.40)",
//                     },
//                     "&.Mui-disabled": { opacity: 0.55, background: "#CBD5E1" },
//                   }}
//                 >
//                   {submitting ? "Posting…" : "Post Vehicle Listing"}
//                 </Button>
//               </Box>
//             </Stack>
//           )}
//         </DialogContent>

//         <DialogActions sx={{ px: 3, pb: 2.8, gap: 1 }}>
//           <Button onClick={closeEdit} sx={btnOutlined}>
//             Cancel
//           </Button>
//           <Button onClick={saveEdit} sx={btnPrimary}>
//             Save changes
//           </Button>
//         </DialogActions>
//       </Dialog>

//       <Dialog
//         open={deleteOpen}
//         onClose={closeDelete}
//         maxWidth="xs"
//         fullWidth
//         PaperProps={{
//           sx: {
//             borderRadius: "24px",
//             boxShadow: "0 24px 64px rgba(15,23,42,0.12)",
//             p: 0.5,
//           },
//         }}
//       >
//         <DialogTitle sx={{ px: 3, pt: 2.8, pb: 0.5 }}>
//           <Stack direction="row" spacing={1.5} alignItems="center">
//             <Box
//               sx={{
//                 width: 44,
//                 height: 44,
//                 borderRadius: "14px",
//                 background: UI.dangerSoft,
//                 color: UI.danger,
//                 display: "grid",
//                 placeItems: "center",
//               }}
//             >
//               <WarningAmberRoundedIcon sx={{ fontSize: 22 }} />
//             </Box>
//             <Box>
//               <Typography
//                 sx={{
//                   fontSize: "1.12rem",
//                   fontWeight: 900,
//                   color: UI.text,
//                   letterSpacing: "-0.02em",
//                 }}
//               >
//                 Delete listing?
//               </Typography>
//               <Typography
//                 sx={{ fontSize: "0.78rem", color: UI.muted, fontWeight: 600 }}
//               >
//                 This action cannot be undone.
//               </Typography>
//             </Box>
//           </Stack>
//         </DialogTitle>

//         <Divider sx={{ mx: 3, mt: 2, borderColor: UI.border }} />

//         <DialogContent sx={{ px: 3, py: 2.2 }}>
//           <Box
//             sx={{
//               borderRadius: "16px",
//               border: `1px solid ${UI.border}`,
//               background: UI.surfaceSoft,
//               p: 2,
//             }}
//           >
//             <Typography
//               sx={{
//                 fontSize: "0.78rem",
//                 color: UI.muted,
//                 fontWeight: 700,
//                 mb: 0.5,
//               }}
//             >
//               Listing to be deleted
//             </Typography>
//             <Typography
//               sx={{ fontSize: "0.95rem", fontWeight: 900, color: UI.text }}
//             >
//               {deleteTarget?.title}
//             </Typography>
//             <Stack
//               direction="row"
//               spacing={0.6}
//               alignItems="center"
//               sx={{ mt: 0.5 }}
//             >
//               <LocationOnRoundedIcon sx={{ fontSize: 13, color: UI.faint }} />
//               <Typography sx={{ fontSize: "0.78rem", color: UI.muted }}>
//                 {deleteTarget?.location}
//               </Typography>
//             </Stack>
//           </Box>
//         </DialogContent>

//         <DialogActions sx={{ px: 3, pb: 2.8, gap: 1 }}>
//           <Button onClick={closeDelete} sx={btnOutlined}>
//             Cancel
//           </Button>
//           <Button onClick={confirmDelete} sx={btnDanger}>
//             Yes, delete
//           </Button>
//         </DialogActions>
//       </Dialog>
//     </Box>
//   );
// }





import { useEffect, useMemo, useState } from "react";
import {
  Box,
  Button,
  Card,
  CardContent,
  Chip,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Divider,
  Grid,
  InputAdornment,
  Stack,
  TextField,
  Typography,
  Alert,
} from "@mui/material";
import HomeWorkRoundedIcon from "@mui/icons-material/HomeWorkRounded";
import DirectionsCarRoundedIcon from "@mui/icons-material/DirectionsCarRounded";
import EditRoundedIcon from "@mui/icons-material/EditRounded";
import DeleteRoundedIcon from "@mui/icons-material/DeleteRounded";
import SearchRoundedIcon from "@mui/icons-material/SearchRounded";
import LocationOnRoundedIcon from "@mui/icons-material/LocationOnRounded";
import CurrencyRupeeRoundedIcon from "@mui/icons-material/CurrencyRupeeRounded";
import WarningAmberRoundedIcon from "@mui/icons-material/WarningAmberRounded";
import FilterListRoundedIcon from "@mui/icons-material/FilterListRounded";
import CloseRoundedIcon from "@mui/icons-material/CloseRounded";
import SaveRoundedIcon from "@mui/icons-material/SaveRounded";
import AddHomeRoundedIcon from "@mui/icons-material/AddHomeRounded";
import { useAppState } from "../../hooks/useAppState";

const PROPERTY_TYPES = [
  "Residential",
  "Commercial",
  "Agricultural",
  "Site",
  "Flat",
  "Apartment",
  "Villa",
  "Land",
];

const UI = {
  bg: "#F5F7FB",
  surface: "#FFFFFF",
  surfaceSoft: "#F8FAFC",
  border: "rgba(15,23,42,0.08)",
  borderStrong: "rgba(15,23,42,0.12)",
  text: "#111827",
  muted: "#667085",
  faint: "#98A2B3",
  primary: "#0F766E",
  primarySoft: "rgba(15,118,110,0.10)",
  blue: "#2563EB",
  blueSoft: "rgba(37,99,235,0.10)",
  success: "#16A34A",
  successSoft: "rgba(22,163,74,0.10)",
  danger: "#DC2626",
  dangerSoft: "rgba(220,38,38,0.10)",
  shadowSm: "0 2px 10px rgba(15,23,42,0.04)",
  shadowMd: "0 10px 32px rgba(15,23,42,0.06)",
};

const cardSx = {
  borderRadius: "22px",
  border: `1px solid ${UI.border}`,
  background: UI.surface,
  boxShadow: UI.shadowSm,
  transition: "box-shadow 0.2s ease, transform 0.2s ease",
  "&:hover": { boxShadow: UI.shadowMd, transform: "translateY(-2px)" },
};

const inputSx = {
  "& .MuiOutlinedInput-root": {
    borderRadius: "14px",
    background: UI.surfaceSoft,
    fontSize: "0.88rem",
    fontWeight: 600,
    "& fieldset": { borderColor: UI.border },
    "&:hover fieldset": { borderColor: UI.borderStrong },
    "&.Mui-focused fieldset": { borderColor: UI.primary },
  },
  "& .MuiInputLabel-root": {
    fontSize: "0.85rem",
    fontWeight: 600,
    color: UI.muted,
    "&.Mui-focused": { color: UI.primary },
  },
};

const btnPrimary = {
  minHeight: 44,
  px: 2.5,
  borderRadius: "14px",
  textTransform: "none",
  fontWeight: 800,
  fontSize: "0.88rem",
  color: "#fff",
  background: UI.primary,
  boxShadow: "none",
  "&:hover": { background: "#0c615b", boxShadow: "none" },
};

const btnOutlined = {
  minHeight: 44,
  px: 2.5,
  borderRadius: "14px",
  textTransform: "none",
  fontWeight: 800,
  fontSize: "0.88rem",
  color: UI.text,
  background: UI.surface,
  border: `1px solid ${UI.border}`,
  boxShadow: "none",
  "&:hover": { background: UI.surfaceSoft, boxShadow: "none" },
};

const btnDanger = {
  minHeight: 44,
  px: 2.5,
  borderRadius: "14px",
  textTransform: "none",
  fontWeight: 800,
  fontSize: "0.88rem",
  color: "#fff",
  background: UI.danger,
  boxShadow: "none",
  "&:hover": { background: "#b91c1c", boxShadow: "none" },
};

function SectionHeader({ icon, title, description }) {
  return (
    <Box sx={{ mb: 2 }}>
      <Stack direction="row" spacing={1.5} alignItems="center" mb={0.5}>
        <Box
          sx={{
            width: 34,
            height: 34,
            borderRadius: "10px",
            background: "#EEF2FF",
            display: "grid",
            placeItems: "center",
            color: "#4361EE",
            flexShrink: 0,
          }}
        >
          {icon}
        </Box>
        <Typography fontWeight={800} sx={{ color: "#1E293B", fontSize: "0.95rem" }}>
          {title}
        </Typography>
      </Stack>
      {description ? (
        <Typography sx={{ fontSize: "0.8rem", color: "#94A3B8", ml: "46px" }}>
          {description}
        </Typography>
      ) : null}
    </Box>
  );
}

function ListingCard({ item, onEdit, onDelete }) {
  const isProperty = item.type === "Property";
  const tone = isProperty ? UI.primary : UI.blue;
  const soft = isProperty ? UI.primarySoft : UI.blueSoft;
  const borderAccent = isProperty ? "rgba(15,118,110,0.18)" : "rgba(37,99,235,0.18)";
  const Icon = isProperty ? HomeWorkRoundedIcon : DirectionsCarRoundedIcon;

  return (
    <Card sx={cardSx}>
      <CardContent sx={{ p: 0, "&:last-child": { pb: 0 } }}>
        <Box
          sx={{
            height: 80,
            background: isProperty
              ? "linear-gradient(135deg, rgba(15,118,110,0.08) 0%, rgba(37,99,235,0.06) 100%)"
              : "linear-gradient(135deg, rgba(37,99,235,0.08) 0%, rgba(124,58,237,0.06) 100%)",
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            px: 2.2,
            borderBottom: `1px solid ${UI.border}`,
          }}
        >
          <Box
            sx={{
              width: 48,
              height: 48,
              borderRadius: "16px",
              background: soft,
              border: `1px solid ${borderAccent}`,
              display: "grid",
              placeItems: "center",
              color: tone,
            }}
          >
            <Icon sx={{ fontSize: 26 }} />
          </Box>

          <Stack direction="row" spacing={1}>
            <Chip
              label={item.type}
              size="small"
              sx={{
                height: 26,
                borderRadius: "999px",
                fontWeight: 800,
                fontSize: "0.7rem",
                color: tone,
                background: soft,
              }}
            />
            <Chip
              label="Active"
              size="small"
              sx={{
                height: 26,
                borderRadius: "999px",
                fontWeight: 800,
                fontSize: "0.7rem",
                color: UI.success,
                background: UI.successSoft,
              }}
            />
          </Stack>
        </Box>

        <Box sx={{ p: 2.2 }}>
          <Typography
            sx={{
              fontSize: "0.97rem",
              fontWeight: 900,
              color: UI.text,
              lineHeight: 1.35,
              mb: 0.6,
              display: "-webkit-box",
              WebkitLineClamp: 2,
              WebkitBoxOrient: "vertical",
              overflow: "hidden",
            }}
          >
            {item.title}
          </Typography>

          <Stack direction="row" spacing={0.6} alignItems="center" sx={{ mb: 0.5 }}>
            <LocationOnRoundedIcon sx={{ fontSize: 14, color: UI.faint }} />
            <Typography sx={{ fontSize: "0.78rem", color: UI.muted, fontWeight: 600 }}>
              {item.location}
            </Typography>
          </Stack>

          <Stack direction="row" spacing={0.5} alignItems="center" sx={{ mb: 2 }}>
            <CurrencyRupeeRoundedIcon sx={{ fontSize: 14, color: tone }} />
            <Typography sx={{ fontSize: "0.97rem", fontWeight: 900, color: UI.text }}>
              {item.price}
            </Typography>
          </Stack>

          <Divider sx={{ mb: 1.8, borderColor: UI.border }} />

          <Stack direction="row" spacing={1}>
            <Button
              fullWidth
              startIcon={<EditRoundedIcon sx={{ fontSize: 17 }} />}
              onClick={() => onEdit(item)}
              sx={{
                minHeight: 40,
                borderRadius: "12px",
                textTransform: "none",
                fontWeight: 800,
                fontSize: "0.82rem",
                color: tone,
                background: soft,
                border: `1px solid ${borderAccent}`,
                boxShadow: "none",
                "&:hover": { opacity: 0.85, boxShadow: "none" },
              }}
            >
              Edit
            </Button>
            <Button
              fullWidth
              startIcon={<DeleteRoundedIcon sx={{ fontSize: 17 }} />}
              onClick={() => onDelete(item)}
              sx={{
                minHeight: 40,
                borderRadius: "12px",
                textTransform: "none",
                fontWeight: 800,
                fontSize: "0.82rem",
                color: UI.danger,
                background: UI.dangerSoft,
                border: "1px solid rgba(220,38,38,0.18)",
                boxShadow: "none",
                "&:hover": { opacity: 0.85, boxShadow: "none" },
              }}
            >
              Delete
            </Button>
          </Stack>
        </Box>
      </CardContent>
    </Card>
  );
}

function mapItemToForm(item) {
  return {
    title: item?.title || "",
    location: item?.location || "",
    price: item?.price || "",
    propertyType: item?.propertyType || item?.property_type || "",
    contactNumber: item?.contactNumber || item?.contact || "",
    apartmentName: item?.apartmentName || item?.apartment_name || "" || item?.apartmentName || item?.apartment_name || "",
    floor: item?.floor || "",
    rooms: item?.rooms || "",
    bedrooms: item?.bedrooms || "",
    area: item?.area || "",
    landArea: item?.landArea || item?.land_area || "",
    cropsGrown: item?.cropsGrown || item?.crops_grown || "",
    rentLease: item?.rentLease || item?.rent_lease || "",
    vehicleNumber: item?.vehicleNumber || item?.vehicle_number || "",
    brand: item?.brand || "",
    model: item?.model || "",
    year: item?.year || "",
    state: item?.state || "",
    rtoCode: item?.rtoCode || item?.rto_code || "",
    kmDriven: item?.kmDriven || item?.km_driven || "",
  };
}

function EditDialogContent({ editItem, editForm, setEditForm, editErrors, setEditErrors }) {
  if (!editItem) return null;
  const isProperty = editItem.type === "Property";

  const setField = (field, value) => {
    setEditForm((prev) => ({ ...prev, [field]: value }));
    if (editErrors[field]) setEditErrors((prev) => ({ ...prev, [field]: "" }));
  };

  return (
    <Stack spacing={2.5}>
      {isProperty ? (
        <>
          <Card sx={{ borderRadius: "20px", boxShadow: "0 2px 20px rgba(15,23,42,0.07)" }}>
            <CardContent sx={{ p: 3 }}>
              <SectionHeader
                icon={<AddHomeRoundedIcon sx={{ fontSize: 18 }} />}
                title="Basic Information"
                description="Property title, type, and location details"
              />
              <Divider sx={{ mb: 3, opacity: 0.6 }} />
              <Grid container spacing={2.5}>
                <Grid item xs={12}>
                  <TextField
                    fullWidth
                    label="Listing Title *"
                    value={editForm.title}
                    onChange={(e) => setField("title", e.target.value)}
                    error={!!editErrors.title}
                    helperText={editErrors.title}
                    sx={inputSx}
                  />
                </Grid>
                <Grid item xs={12} sm={6} md={4}>
                  <TextField
                    select
                    fullWidth
                    label="Property Type"
                    value={editForm.propertyType}
                    onChange={(e) => setField("propertyType", e.target.value)}
                    sx={inputSx}
                    SelectProps={{ native: true }}
                  >
                    <option value="" />
                    {PROPERTY_TYPES.map((opt) => (
                      <option key={opt} value={opt}>
                        {opt}
                      </option>
                    ))}
                  </TextField>
                </Grid>
                <Grid item xs={12} sm={6} md={4}>
                  <TextField
                    fullWidth
                    label="Location / Address"
                    value={editForm.location}
                    onChange={(e) => setField("location", e.target.value)}
                    sx={inputSx}
                  />
                </Grid>
                <Grid item xs={12} sm={6} md={4}>
                  <TextField
                    fullWidth
                    label="Apartment / Society Name"
                    value={editForm.apartmentName}
                    onChange={(e) => setField("apartmentName", e.target.value)}
                    sx={inputSx}
                  />
                </Grid>
                <Grid item xs={12} sm={6} md={4}>
                  <TextField
                    fullWidth
                    label="Contact Number"
                    value={editForm.contactNumber}
                    onChange={(e) => setField("contactNumber", e.target.value)}
                    sx={inputSx}
                  />
                </Grid>
              </Grid>
            </CardContent>
          </Card>

          <Card sx={{ borderRadius: "20px", boxShadow: "0 2px 20px rgba(15,23,42,0.07)" }}>
            <CardContent sx={{ p: 3 }}>
              <SectionHeader
                icon={<span style={{ fontSize: 15 }}>📐</span>}
                title="Property Details"
                description="Dimensions, rooms, and structural information"
              />
              <Divider sx={{ mb: 3, opacity: 0.6 }} />
              <Grid container spacing={2.5}>
                <Grid item xs={6} sm={4}>
                  <TextField fullWidth label="Floor" value={editForm.floor} onChange={(e) => setField("floor", e.target.value)} sx={inputSx} />
                </Grid>
                <Grid item xs={6} sm={4}>
                  <TextField fullWidth label="Rooms" value={editForm.rooms} onChange={(e) => setField("rooms", e.target.value)} sx={inputSx} />
                </Grid>
                <Grid item xs={6} sm={4}>
                  <TextField fullWidth label="Bedrooms" value={editForm.bedrooms} onChange={(e) => setField("bedrooms", e.target.value)} sx={inputSx} />
                </Grid>
                <Grid item xs={12} sm={6} md={4}>
                  <TextField fullWidth label="Built-up Area" value={editForm.area} onChange={(e) => setField("area", e.target.value)} sx={inputSx} />
                </Grid>
                <Grid item xs={12} sm={6} md={4}>
                  <TextField fullWidth label="Land Area" value={editForm.landArea} onChange={(e) => setField("landArea", e.target.value)} sx={inputSx} />
                </Grid>
                <Grid item xs={12}>
                  <TextField fullWidth label="Crops Grown" value={editForm.cropsGrown} onChange={(e) => setField("cropsGrown", e.target.value)} sx={inputSx} />
                </Grid>
              </Grid>
            </CardContent>
          </Card>

          <Card sx={{ borderRadius: "20px", boxShadow: "0 2px 20px rgba(15,23,42,0.07)" }}>
            <CardContent sx={{ p: 3 }}>
              <SectionHeader
                icon={<span style={{ fontSize: 15 }}>💰</span>}
                title="Pricing & Terms"
                description="Expected price and rental / lease information"
              />
              <Divider sx={{ mb: 3, opacity: 0.6 }} />
              <Grid container spacing={2.5}>
                <Grid item xs={12} sm={6} md={4}>
                  <TextField
                    fullWidth
                    label="Expected Price"
                    value={editForm.price}
                    onChange={(e) => setField("price", e.target.value)}
                    error={!!editErrors.price}
                    helperText={editErrors.price}
                    sx={inputSx}
                    InputProps={{
                      startAdornment: (
                        <InputAdornment position="start">
                          <CurrencyRupeeRoundedIcon sx={{ fontSize: 18, color: UI.faint }} />
                        </InputAdornment>
                      ),
                    }}
                  />
                </Grid>
                <Grid item xs={12} sm={6} md={4}>
                  <TextField
                    fullWidth
                    label="Rent / Lease Details"
                    value={editForm.rentLease}
                    onChange={(e) => setField("rentLease", e.target.value)}
                    sx={inputSx}
                  />
                </Grid>
              </Grid>
            </CardContent>
          </Card>
        </>
      ) : (
        <>
          <Card sx={{ borderRadius: "20px", boxShadow: "0 2px 20px rgba(15,23,42,0.07)" }}>
            <CardContent sx={{ p: 3 }}>
              <SectionHeader
                icon={<DirectionsCarRoundedIcon sx={{ fontSize: 18 }} />}
                title="Vehicle Identity"
                description="Registration number, brand, model, and year"
              />
              <Divider sx={{ mb: 3, opacity: 0.6 }} />
              <Grid container spacing={2.5}>
                <Grid item xs={12}>
                  <TextField fullWidth label="Listing Title" value={editForm.title} onChange={(e) => setField("title", e.target.value)} sx={inputSx} />
                </Grid>
                <Grid item xs={12} sm={6}>
                  <TextField fullWidth label="Vehicle Registration Number" value={editForm.vehicleNumber} onChange={(e) => setField("vehicleNumber", e.target.value)} sx={inputSx} />
                </Grid>
                <Grid item xs={12} sm={6}>
                  <TextField fullWidth label="Brand" value={editForm.brand} onChange={(e) => setField("brand", e.target.value)} sx={inputSx} />
                </Grid>
                <Grid item xs={12} sm={4}>
                  <TextField fullWidth label="Model" value={editForm.model} onChange={(e) => setField("model", e.target.value)} sx={inputSx} />
                </Grid>
                <Grid item xs={12} sm={4}>
                  <TextField fullWidth label="Year" value={editForm.year} onChange={(e) => setField("year", e.target.value)} sx={inputSx} />
                </Grid>
                <Grid item xs={12} sm={4}>
                  <TextField fullWidth label="RTO Code" value={editForm.rtoCode} onChange={(e) => setField("rtoCode", e.target.value)} sx={inputSx} />
                </Grid>
              </Grid>
            </CardContent>
          </Card>

          <Card sx={{ borderRadius: "20px", boxShadow: "0 2px 20px rgba(15,23,42,0.07)" }}>
            <CardContent sx={{ p: 3 }}>
              <SectionHeader
                icon={<span style={{ fontSize: 15 }}>🚦</span>}
                title="Usage & Location"
                description="Odometer reading, registered state, and current location"
              />
              <Divider sx={{ mb: 3, opacity: 0.6 }} />
              <Grid container spacing={2.5}>
                <Grid item xs={12} sm={4}>
                  <TextField fullWidth label="KM Driven" value={editForm.kmDriven} onChange={(e) => setField("kmDriven", e.target.value)} sx={inputSx} />
                </Grid>
                <Grid item xs={12} sm={4}>
                  <TextField fullWidth label="State" value={editForm.state} onChange={(e) => setField("state", e.target.value)} sx={inputSx} />
                </Grid>
                <Grid item xs={12} sm={4}>
                  <TextField fullWidth label="City / Area" value={editForm.location} onChange={(e) => setField("location", e.target.value)} sx={inputSx} />
                </Grid>
              </Grid>
            </CardContent>
          </Card>

          <Card sx={{ borderRadius: "20px", boxShadow: "0 2px 20px rgba(15,23,42,0.07)" }}>
            <CardContent sx={{ p: 3 }}>
              <SectionHeader
                icon={<span style={{ fontSize: 15 }}>💰</span>}
                title="Price & Contact"
                description="Asking price and seller contact number"
              />
              <Divider sx={{ mb: 3, opacity: 0.6 }} />
              <Grid container spacing={2.5}>
                <Grid item xs={12} sm={6}>
                  <TextField fullWidth label="Asking Price" value={editForm.price} onChange={(e) => setField("price", e.target.value)} error={!!editErrors.price} helperText={editErrors.price} sx={inputSx} />
                </Grid>
                <Grid item xs={12} sm={6}>
                  <TextField fullWidth label="Contact Number" value={editForm.contactNumber} onChange={(e) => setField("contactNumber", e.target.value)} sx={inputSx} />
                </Grid>
              </Grid>
            </CardContent>
          </Card>
        </>
      )}
    </Stack>
  );
}

export default function AdminListingsPage() {
  const { properties = [], vehicles = [] } = useAppState();
  const [localItems, setLocalItems] = useState([]);
  const [search, setSearch] = useState("");
  const [filter, setFilter] = useState("All");
  const [editOpen, setEditOpen] = useState(false);
  const [editItem, setEditItem] = useState(null);
  const [editForm, setEditForm] = useState({});
  const [editErrors, setEditErrors] = useState({});
  const [editSaving, setEditSaving] = useState(false);
  const [deleteOpen, setDeleteOpen] = useState(false);
  const [deleteTarget, setDeleteTarget] = useState(null);
  const [message, setMessage] = useState("");

  console.log("Data :- ", properties ," ; ", vehicles);

  useEffect(() => {
  const next = [
    ...properties.map((item, i) => ({
      id: item.id || item._id || `p-${i}`,
      type: "Property",
      title: item.title || "Untitled property",
      location: item.location || "Unknown location",
      price: String(item.price ?? ""),
      contact: item.contact || "",
      propertyType: item.property_type || "",
      apartmentName: item.apartment_name || "",
      floor: item.floor || "",
      rooms: item.rooms ?? "",
      bedrooms: item.bedrooms ?? "",
      area: item.area ?? "",
      landArea: item.land_area ?? "",
      cropsGrown: item.crops_grown || "",
      rentLease: item.rent_lease || "",
      images: item.images || [],
      createdAt: item.created_at || null,
      updatedAt: item.updated_at || null,
      owner: item.owner || null,
      raw: item,
    })),
    ...vehicles.map((item, i) => ({
      id: item.id || item._id || `v-${i}`,
      type: "Vehicle",
      title: item.title || "Untitled vehicle",
      location: item.location || "Unknown location",
      price: String(item.price ?? ""),
      contact: item.contact || "",
      vehicleNumber: item.vehicle_number || "",
      brand: item.brand || "",
      model: item.model || "",
      year: item.year || "",
      rtoCode: item.rto_code || "",
      kmDriven: item.km_driven || "",
      state: item.state || "",
      images: item.images || [],
      createdAt: item.created_at || null,
      updatedAt: item.updated_at || null,
      owner: item.owner || null,
      raw: item,
    })),
  ];

  setLocalItems(next);
}, [properties, vehicles]);

  const filtered = useMemo(
    () =>
      localItems.filter((item) => {
        const q = search.toLowerCase();
        const matchSearch =
          item.title.toLowerCase().includes(q) || item.location.toLowerCase().includes(q);
        const matchFilter = filter === "All" || item.type === filter;
        return matchSearch && matchFilter;
      }),

    console.log("data : ",localItems, search, filter),
    [localItems, search, filter]
  );

  const counts = useMemo(
    () => ({
      All: localItems.length,
      Property: localItems.filter((i) => i.type === "Property").length,
      Vehicle: localItems.filter((i) => i.type === "Vehicle").length,
    }),
    [localItems]
  );

  function openEdit(item) {
    setEditItem(item);
    setEditForm(mapItemToForm(item.raw || item));
    setEditErrors({});
    setEditOpen(true);
  }

  function closeEdit() {
    setEditOpen(false);
    setEditItem(null);
    setEditForm({});
    setEditErrors({});
  }

  function validateEdit() {
    const errors = {};
    if (!editForm.title?.trim()) errors.title = "Title is required";
    if (!editForm.location?.trim()) errors.location = "Location is required";
    if (!editForm.price?.trim()) errors.price = "Price is required";
    setEditErrors(errors);
    return Object.keys(errors).length === 0;
  }

  function saveEdit() {
    if (!validateEdit()) return;
    setEditSaving(true);
    setTimeout(() => {
      setLocalItems((prev) =>
        prev.map((item) =>
          item.id === editItem.id
            ? {
                ...item,
                title: editForm.title.trim(),
                location: editForm.location.trim(),
                price: editForm.price.trim(),
                raw: { ...(item.raw || {}), ...editForm },
              }
            : item
        )
      );
      setMessage(`${editItem.type} updated successfully.`);
      setEditSaving(false);
      closeEdit();
    }, 200);
  }

  function openDelete(item) {
    setDeleteTarget(item);
    setDeleteOpen(true);
  }

  function closeDelete() {
    setDeleteOpen(false);
    setDeleteTarget(null);
  }

  function confirmDelete() {
    if (!deleteTarget) return;
    setLocalItems((prev) => prev.filter((item) => item.id !== deleteTarget.id));
    setMessage(`${deleteTarget.type} deleted successfully.`);
    closeDelete();
  }

  return (
    <Box sx={{ minHeight: "100vh", background: UI.bg, p: { xs: 1.5, md: 3 } }}>
      <Card sx={{ ...cardSx, p: { xs: 1.5, md: 2.5 }, mb: 2 }}>
        <Stack
          direction={{ xs: "column", sm: "row" }}
          spacing={2}
          alignItems={{ xs: "stretch", sm: "center" }}
          justifyContent="space-between"
        >
          <Box>
            <Typography sx={{ fontSize: "1.5rem", fontWeight: 900, color: UI.text }}>
              Admin Listings
            </Typography>
            <Typography sx={{ color: UI.muted, fontSize: "0.85rem" }}>
              Edit or delete property and vehicle listings
            </Typography>
          </Box>

          <Stack direction="row" spacing={1} flexWrap="wrap">
            {["All", "Property", "Vehicle"].map((key) => (
              <Button
                key={key}
                onClick={() => setFilter(key)}
                sx={{
                  ...btnOutlined,
                  ...(filter === key
                    ? {
                        background: UI.primarySoft,
                        color: UI.primary,
                        border: `1px solid rgba(15,118,110,0.18)`,
                      }
                    : {}),
                }}
              >
                {key} ({counts[key]})
              </Button>
            ))}
          </Stack>
        </Stack>

        {message ? (
          <Alert sx={{ mt: 2, borderRadius: "14px" }} severity="success" onClose={() => setMessage("")}>
            {message}
          </Alert>
        ) : null}

        <TextField
          fullWidth
          placeholder="Search listings..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          sx={{ mt: 2, ...inputSx }}
          InputProps={{
            startAdornment: (
              <InputAdornment position="start">
                <SearchRoundedIcon sx={{ color: UI.faint }} />
              </InputAdornment>
            ),
          }}
        />
      </Card>

      {filtered.length === 0 ? (
        <Box
          sx={{
            py: 8,
            textAlign: "center",
            border: `1.5px dashed ${UI.border}`,
            borderRadius: "20px",
            background: UI.surface,
          }}
        >
          <FilterListRoundedIcon sx={{ fontSize: 40, color: UI.faint, mb: 1 }} />
          <Typography sx={{ fontWeight: 800, color: UI.muted }}>
            No listings found
          </Typography>
          <Typography sx={{ fontSize: "0.82rem", color: UI.faint, mt: 0.5 }}>
            Try adjusting your search or filter.
          </Typography>
        </Box>
      ) : (
        <Grid container spacing={2.2}>
          {filtered.map((item) => (
            <Grid item xs={12} sm={6} lg={4} key={item.id}>
              <ListingCard item={item} onEdit={openEdit} onDelete={openDelete} />
            </Grid>
          ))}
        </Grid>
      )}

      <Dialog open={editOpen} onClose={closeEdit} maxWidth="md" fullWidth PaperProps={{ sx: { borderRadius: "24px", p: 0.5 } }}>
        <DialogTitle sx={{ px: 3, pt: 2.8, pb: 0.5, display: "flex", justifyContent: "space-between", alignItems: "center" }}>
          <Stack direction="row" spacing={1.5} alignItems="center">
            <Box
              sx={{
                width: 44,
                height: 44,
                borderRadius: "14px",
                background: editItem?.type === "Property" ? UI.primarySoft : UI.blueSoft,
                color: editItem?.type === "Property" ? UI.primary : UI.blue,
                display: "grid",
                placeItems: "center",
              }}
            >
              {editItem?.type === "Property" ? <HomeWorkRoundedIcon sx={{ fontSize: 22 }} /> : <DirectionsCarRoundedIcon sx={{ fontSize: 22 }} />}
            </Box>
            <Box>
              <Typography sx={{ fontSize: "1.12rem", fontWeight: 900, color: UI.text }}>Edit Listing</Typography>
              <Typography sx={{ fontSize: "0.78rem", color: UI.muted, fontWeight: 600 }}>
                {editItem?.type} · ID: {editItem?.id}
              </Typography>
            </Box>
          </Stack>
          <Button onClick={closeEdit} sx={{ minWidth: 0, color: UI.muted }}>
            <CloseRoundedIcon />
          </Button>
        </DialogTitle>

        <Divider sx={{ mx: 3, mt: 2, borderColor: UI.border }} />

        <DialogContent sx={{ px: 3, py: 2.5, background: UI.bg }}>
          <EditDialogContent
            editItem={editItem}
            editForm={editForm}
            setEditForm={setEditForm}
            editErrors={editErrors}
            setEditErrors={setEditErrors}
          />
        </DialogContent>

        <DialogActions sx={{ px: 3, pb: 2.8, gap: 1 }}>
          <Button onClick={closeEdit} sx={btnOutlined}>Cancel</Button>
          <Button onClick={saveEdit} disabled={editSaving} startIcon={editSaving ? null : <SaveRoundedIcon />} sx={btnPrimary}>
            {editSaving ? "Saving..." : "Save changes"}
          </Button>
        </DialogActions>
      </Dialog>

      <Dialog open={deleteOpen} onClose={closeDelete} maxWidth="xs" fullWidth PaperProps={{ sx: { borderRadius: "24px", p: 0.5 } }}>
        <DialogTitle sx={{ px: 3, pt: 2.8, pb: 0.5 }}>
          <Stack direction="row" spacing={1.5} alignItems="center">
            <Box sx={{ width: 44, height: 44, borderRadius: "14px", background: UI.dangerSoft, color: UI.danger, display: "grid", placeItems: "center" }}>
              <WarningAmberRoundedIcon sx={{ fontSize: 22 }} />
            </Box>
            <Box>
              <Typography sx={{ fontSize: "1.12rem", fontWeight: 900, color: UI.text }}>
                Delete listing?
              </Typography>
              <Typography sx={{ fontSize: "0.78rem", color: UI.muted, fontWeight: 600 }}>
                This action cannot be undone.
              </Typography>
            </Box>
          </Stack>
        </DialogTitle>

        <Divider sx={{ mx: 3, mt: 2, borderColor: UI.border }} />

        <DialogContent sx={{ px: 3, py: 2.2 }}>
          <Box sx={{ borderRadius: "16px", border: `1px solid ${UI.border}`, background: UI.surfaceSoft, p: 2 }}>
            <Typography sx={{ fontSize: "0.78rem", color: UI.muted, fontWeight: 700, mb: 0.5 }}>
              Listing to be deleted
            </Typography>
            <Typography sx={{ fontSize: "0.95rem", fontWeight: 900, color: UI.text }}>
              {deleteTarget?.title}
            </Typography>
            <Stack direction="row" spacing={0.6} alignItems="center" sx={{ mt: 0.5 }}>
              <LocationOnRoundedIcon sx={{ fontSize: 13, color: UI.faint }} />
              <Typography sx={{ fontSize: "0.78rem", color: UI.muted }}>
                {deleteTarget?.location}
              </Typography>
            </Stack>
          </Box>
        </DialogContent>

        <DialogActions sx={{ px: 3, pb: 2.8, gap: 1 }}>
          <Button onClick={closeDelete} sx={btnOutlined}>Cancel</Button>
          <Button onClick={confirmDelete} sx={btnDanger}>Yes, delete</Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
}