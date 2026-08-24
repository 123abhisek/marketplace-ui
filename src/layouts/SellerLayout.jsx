

// // src/layouts/SellerLayout.jsx

// import {
//   Outlet,
//   Link as RouterLink,
//   useLocation,
// } from "react-router-dom";

// import {
//   Box,
//   Button,
//   Stack,
//   Typography,
//   Divider,
// } from "@mui/material";

// import Navbar from "../components/Navbar";

// const navItems = [
//   {
//     label: "Overview",
//     path: "/seller/overview",
//   },
// //   {
// //     label: "Users",
// //     path: "/admin/users",
// //   },
//   {
//     label: "Add Property",
//     path: "/seller/properties/add",
//   },
//   {
//     label: "Add Vehicle",
//     path: "/seller/vehicles/add",
//   },
//   {
//     label: "Listings",
//     path: "/seller/listings",
//   },
//   {
//     label: "Orders",
//     path: "/seller/orders",
//   },
//   {
//     label: "Reports",
//     path: "/seller/reports",
//   },
// //   {
// //     label: "Settings",
// //     path: "/admin/settings",
// //   },
// ];

// export default function SellerLayout() {
//   const location = useLocation();

//   return (
//     <>
//       <Navbar />

//       <Box
//         sx={{
//           minHeight: "100vh",
//           display: "flex",
//           background: "#f8fafc",
//         }}
//       >
//         <Box
//           component="aside"
//           sx={{
//             width: 260,
//             flexShrink: 0,
//             borderRight: "1px solid rgba(15,23,42,0.08)",
//             background: "#fff",
//             p: 2,
//           }}
//         >
//           <Typography
//             sx={{
//               fontWeight: 900,
//               fontSize: "1.2rem",
//               color: "#0f172a",
//               mb: 2,
//             }}
//           >
//             Seller Panel
//           </Typography>

//           <Divider sx={{ mb: 2 }} />

//           <Stack spacing={1}>
//             {navItems.map((item) => {
//               const active =
//                 location.pathname === item.path ||
//                 location.pathname.startsWith(`${item.path}/`);

//               return (
//                 <Button
//                   key={item.path}
//                   component={RouterLink}
//                   to={item.path}
//                   fullWidth
//                   sx={{
//                     justifyContent: "flex-start",
//                     textTransform: "none",
//                     borderRadius: "12px",
//                     px: 1.5,
//                     py: 1.1,
//                     fontWeight: active ? 800 : 700,
//                     color: active ? "#0f172a" : "#64748b",
//                     background: active
//                       ? "rgba(15,118,110,0.08)"
//                       : "transparent",
//                     "&:hover": {
//                       background: "rgba(15,118,110,0.08)",
//                     },
//                   }}
//                 >
//                   {item.label}
//                 </Button>
//               );
//             })}
//           </Stack>
//         </Box>

//         <Box
//           component="main"
//           sx={{
//             flex: 1,
//             minWidth: 0,
//             p: 3,
//           }}
//         >
//           <Outlet />
//         </Box>
//       </Box>
//     </>
//   );
// }


// src/layouts/SellerLayout.jsx
import { useState } from "react";
import { Outlet, Link as RouterLink, useLocation } from "react-router-dom";
import {
  Box,
  Button,
  Stack,
  Typography,
  Divider,
  Drawer,
  IconButton,
  useMediaQuery,
  useTheme,
} from "@mui/material";
import MenuRoundedIcon from "@mui/icons-material/MenuRounded";
import CloseRoundedIcon from "@mui/icons-material/CloseRounded";
import Navbar from "../components/Navbar";

const SIDEBAR_WIDTH = 260;

const navItems = [
  { label: "Overview", path: "/seller/overview" },
  { label: "Add Property", path: "/seller/properties/add" },
  { label: "Add Vehicle", path: "/seller/vehicles/add" },
  { label: "Listings", path: "/seller/listings" },
  { label: "Orders", path: "/seller/orders" },
  { label: "Reports", path: "/seller/reports" },
];

function SidebarContent({ location, onNavigate, mobile = false }) {
  return (
    <Box
      sx={{
        width: SIDEBAR_WIDTH,
        height: "100%",
        boxSizing: "border-box",
        backgroundColor: "#ffffff",
        p: 2,
        overflowY: "auto",
      }}
    >
      {mobile && (
        <Stack direction="row" justifyContent="flex-end" sx={{ mb: 0.5 }}>
          <IconButton onClick={onNavigate} size="small" aria-label="Close seller menu">
            <CloseRoundedIcon fontSize="small" />
          </IconButton>
        </Stack>
      )}

      <Typography
        sx={{
          fontWeight: 900,
          fontSize: "1.2rem",
          color: "#0f172a",
          mb: 2,
        }}
      >
        Seller Panel
      </Typography>

      <Divider sx={{ mb: 2 }} />

      <Stack spacing={1}>
        {navItems.map((item) => {
          const active =
            location.pathname === item.path ||
            location.pathname.startsWith(`${item.path}/`);

          return (
            <Button
              key={item.path}
              component={RouterLink}
              to={item.path}
              onClick={onNavigate}
              fullWidth
              sx={{
                justifyContent: "flex-start",
                textTransform: "none",
                borderRadius: "12px",
                px: 1.5,
                py: 1.1,
                fontWeight: active ? 800 : 700,
                color: active ? "#0f172a" : "#64748b",
                backgroundColor: active
                  ? "rgba(15,118,110,0.08)"
                  : "transparent",
                "&:hover": {
                  backgroundColor: "rgba(15,118,110,0.08)",
                },
              }}
            >
              {item.label}
            </Button>
          );
        })}
      </Stack>
    </Box>
  );
}

export default function SellerLayout() {
  const location = useLocation();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("md"));
  const [drawerOpen, setDrawerOpen] = useState(false);

  const closeDrawer = () => setDrawerOpen(false);
  const openDrawer = () => setDrawerOpen(true);

  return (
    <Box sx={{ minHeight: "100vh", backgroundColor: "#f8fafc" }}>
      <Navbar />

      <Box
        sx={{
          display: "flex",
          width: "100%",
          minHeight: "calc(100vh - 64px)",
          backgroundColor: "#f8fafc",
          overflowX: "hidden",
        }}
      >
        {isMobile ? (
          <>
            <IconButton
              onClick={openDrawer}
              aria-label="Open seller menu"
              sx={{
                position: "fixed",
                top: { xs: 72, sm: 76 },
                left: 12,
                zIndex: 1200,
                width: 44,
                height: 44,
                color: "#0f172a",
                backgroundColor: "#ffffff",
                border: "1px solid rgba(15,23,42,0.1)",
                boxShadow: "0 4px 12px rgba(15,23,42,0.12)",
                "&:hover": { backgroundColor: "#ffffff" },
              }}
            >
              <MenuRoundedIcon />
            </IconButton>

            <Drawer
              anchor="left"
              open={drawerOpen}
              onClose={closeDrawer}
              ModalProps={{ keepMounted: true }}
              PaperProps={{
                sx: {
                  width: SIDEBAR_WIDTH,
                  maxWidth: "82vw",
                  backgroundColor: "#ffffff !important",
                  backgroundImage: "none",
                  opacity: "1 !important",
                  visibility: "visible !important",
                  boxShadow: "8px 0 28px rgba(15,23,42,0.18)",
                  borderRadius: "0 18px 18px 0",
                },
              }}
              sx={{
                zIndex: 1400,
                "& .MuiBackdrop-root": {
                  backgroundColor: "rgba(15,23,42,0.48)",
                },
              }}
            >
              <SidebarContent
                location={location}
                onNavigate={closeDrawer}
                mobile
              />
            </Drawer>
          </>
        ) : (
          <Box
            component="aside"
            sx={{
              width: SIDEBAR_WIDTH,
              flexShrink: 0,
              borderRight: "1px solid rgba(15,23,42,0.08)",
              backgroundColor: "#ffffff",
            }}
          >
            <SidebarContent location={location} />
          </Box>
        )}

        <Box
          component="main"
          sx={{
            flex: 1,
            minWidth: 0,
            width: "100%",
            maxWidth: "100%",
            boxSizing: "border-box",
            p: { xs: 1.25, sm: 2, md: 3 },
            overflowX: "hidden",
          }}
        >
          <Outlet />
        </Box>
      </Box>
    </Box>
  );
}