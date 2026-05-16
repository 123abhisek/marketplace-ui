
// src/components/CarouselHero.jsx

import { useEffect, useState } from "react";
import {
  Box,
  Button,
  Chip,
  Container,
  IconButton,
  Stack,
  Typography,
} from "@mui/material";
import ChevronLeftRoundedIcon from "@mui/icons-material/ChevronLeftRounded";
import ChevronRightRoundedIcon from "@mui/icons-material/ChevronRightRounded";
import HomeWorkRoundedIcon from "@mui/icons-material/HomeWorkRounded";
import DirectionsCarRoundedIcon from "@mui/icons-material/DirectionsCarRounded";
import WorkspacePremiumRoundedIcon from "@mui/icons-material/WorkspacePremiumRounded";
import ArrowForwardRoundedIcon from "@mui/icons-material/ArrowForwardRounded";
import { useNavigate } from "react-router-dom";

const easyDealBrand = {
  primary: "#0f766e",
  primaryDark: "#0b5d56",
  accent: "#f59e0b",
};

const slides = [
  {
    id: 1,
    image:
      "https://images.unsplash.com/photo-1560518883-ce09059eeffa?auto=format&fit=crop&w=1600&q=80",
    badge: "EasyDeal Homes",
    eyebrow: "Buy • Rent • Explore",
    title: "Find verified properties faster",
    description:
      "Search flats, houses, plots, and rentals across India with a premium marketplace built for smarter discovery and better decisions.",
    primaryLabel: "Explore Properties",
    secondaryLabel: "How It Works",
    primaryPath: "/properties",
    secondaryId: "how-it-works",
    icon: "property",
  },
  {
    id: 2,
    image:
      "https://images.unsplash.com/photo-1494976688153-cd7f9d7b85c6?auto=format&fit=crop&w=1600&q=80",
    badge: "EasyDeal Vehicles",
    eyebrow: "Cars • Bikes • More",
    title: "Discover trusted vehicles near you",
    description:
      "Browse cars, bikes, and commercial vehicles in one clean marketplace designed for easy comparison and fast discovery.",
    primaryLabel: "Explore Vehicles",
    secondaryLabel: "Featured Listings",
    primaryPath: "/vehicles",
    secondaryId: "featured-listings",
    icon: "vehicle",
  },
  {
    id: 3,
    image:
      "https://images.unsplash.com/photo-1505693416388-ac5ce068fe85?auto=format&fit=crop&w=1600&q=80",
    badge: "EasyDeal Premium",
    eyebrow: "Post • Promote • Sell",
    title: "Sell smarter with EasyDeal Premium",
    description:
      "Unlock premium access to publish listings faster, increase visibility, and connect with more buyers and sellers.",
    primaryLabel: "Get Premium",
    secondaryLabel: "View Pricing",
    primaryPath: "/subscription",
    secondaryId: "pricing",
    icon: "premium",
  },
];

export default function CarouselHero() {
  const navigate = useNavigate();
  const [active, setActive] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setActive((prev) => (prev + 1) % slides.length);
    }, 5000);

    return () => clearInterval(timer);
  }, []);

  const goPrev = () => {
    setActive((prev) =>
      prev === 0 ? slides.length - 1 : prev - 1
    );
  };

  const goNext = () => {
    setActive((prev) => (prev + 1) % slides.length);
  };

  const currentSlide = slides[active];

  const handleSecondary = () => {
    const el = document.getElementById(currentSlide.secondaryId);

    if (el) {
      el.scrollIntoView({
        behavior: "smooth",
        block: "start",
      });
    }
  };

  const getIcon = (type) => {
    if (type === "property") {
      return <HomeWorkRoundedIcon />;
    }

    if (type === "vehicle") {
      return <DirectionsCarRoundedIcon />;
    }

    return <WorkspacePremiumRoundedIcon />;
  };

  return (
    <Box
      sx={{
        position: "relative",
        minHeight: { xs: "88vh", md: "95vh" },
        overflow: "hidden",
        background:
          "linear-gradient(180deg, #061311 0%, #0b1f1d 35%, #0f172a 100%)",

        "@keyframes easydealFade": {
          from: {
            opacity: 0,
            transform: "translateY(30px)",
          },
          to: {
            opacity: 1,
            transform: "translateY(0)",
          },
        },

        "@keyframes easydealZoom": {
          from: {
            transform: "scale(1)",
          },
          to: {
            transform: "scale(1.06)",
          },
        },

        "@keyframes easydealFloat": {
          "0%": {
            transform: "translateY(0px)",
          },
          "50%": {
            transform: "translateY(-6px)",
          },
          "100%": {
            transform: "translateY(0px)",
          },
        },
      }}
    >
      {/* Slides */}
      {slides.map((slide, index) => (
        <Box
          key={slide.id}
          sx={{
            position: "absolute",
            inset: 0,
            opacity: index === active ? 1 : 0,
            transform:
              index === active
                ? "scale(1)"
                : "scale(1.02)",
            transition:
              "opacity .8s ease, transform .8s ease",
            pointerEvents:
              index === active ? "auto" : "none",
          }}
        >
          <Box
            component="img"
            src={slide.image}
            alt={slide.title}
            sx={{
              width: "100%",
              height: "100%",
              objectFit: "cover",
              animation:
                index === active
                  ? "easydealZoom 6s linear both"
                  : "none",
            }}
          />

          {/* Overlay */}
          <Box
            sx={{
              position: "absolute",
              inset: 0,
              background: `
                linear-gradient(
                  90deg,
                  rgba(3,10,12,0.88) 0%,
                  rgba(7,24,28,0.76) 35%,
                  rgba(15,23,42,0.34) 100%
                )
              `,
            }}
          />
        </Box>
      ))}

      {/* Hero Content */}
      <Container
        maxWidth="xl"
        sx={{
          position: "relative",
          zIndex: 2,
          minHeight: { xs: "88vh", md: "95vh" },
          display: "flex",
          alignItems: "center",
          justifyContent: "flex-start",
          py: { xs: 8, md: 10 },
          px: { xs: 3, md: 6, lg: 8 },
        }}
      >
        <Box
          sx={{
            width: "100%",
            maxWidth: {
              xs: "100%",
              md: 780,
              lg: 920,
            },
            animation: "easydealFade .7s ease both",
          }}
        >
          {/* Top Badge */}
          <Stack
            direction="row"
            spacing={1.5}
            alignItems="center"
            sx={{ mb: 3 }}
          >
            <Box
              sx={{
                width: 52,
                height: 52,
                borderRadius: "16px",
                background:
                  "rgba(15,118,110,0.20)",
                border:
                  "1px solid rgba(255,255,255,0.14)",
                backdropFilter: "blur(12px)",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                color: "#ffffff",
                animation:
                  "easydealFloat 4s ease-in-out infinite",

                "& svg": {
                  fontSize: 28,
                },
              }}
            >
              {getIcon(currentSlide.icon)}
            </Box>

            <Chip
              label={currentSlide.badge}
              sx={{
                height: 36,
                borderRadius: "999px",
                px: 1,
                fontWeight: 800,
                fontSize: "0.82rem",
                color: "#ffffff",
                background:
                  "rgba(255,255,255,0.10)",
                border:
                  "1px solid rgba(255,255,255,0.16)",
                backdropFilter: "blur(12px)",
              }}
            />
          </Stack>

          {/* Eyebrow */}
          <Typography
            sx={{
              fontSize: "0.82rem",
              fontWeight: 800,
              textTransform: "uppercase",
              letterSpacing: "0.14em",
              color: "rgba(255,255,255,0.70)",
              mb: 2,
            }}
          >
            {currentSlide.eyebrow}
          </Typography>

          {/* Title */}
          <Typography
            sx={{
              fontSize: {
                xs: "2.8rem",
                sm: "3.8rem",
                md: "5rem",
                lg: "6rem",
              },

              lineHeight: {
                xs: 1.08,
                md: 0.96,
              },

              fontWeight: 900,
              letterSpacing: "-0.06em",
              color: "#ffffff",

              maxWidth: {
                xs: "100%",
                lg: 900,
              },

              textWrap: "balance",
            }}
          >
            {currentSlide.title}
          </Typography>

          {/* Description */}
          <Typography
            sx={{
              mt: 3,
              maxWidth: 720,

              fontSize: {
                xs: "1rem",
                sm: "1.05rem",
                md: "1.12rem",
              },

              lineHeight: 1.9,
              color: "rgba(255,255,255,0.82)",
            }}
          >
            {currentSlide.description}
          </Typography>

          {/* Buttons */}
          <Stack
            direction={{
              xs: "column",
              sm: "row",
            }}
            spacing={2}
            sx={{
              mt: 5,
              width: {
                xs: "100%",
                sm: "auto",
              },
            }}
          >
            <Button
              onClick={() =>
                navigate(currentSlide.primaryPath)
              }
              endIcon={<ArrowForwardRoundedIcon />}
              sx={{
                minHeight: 56,
                px: 4,
                borderRadius: "18px",
                textTransform: "none",
                fontWeight: 800,
                fontSize: "1rem",
                color: "#ffffff",

                background: `
                  linear-gradient(
                    135deg,
                    ${easyDealBrand.primary} 0%,
                    ${easyDealBrand.primaryDark} 100%
                  )
                `,

                boxShadow:
                  "0 12px 30px rgba(15,118,110,0.30)",

                "&:hover": {
                  background: `
                    linear-gradient(
                      135deg,
                      ${easyDealBrand.primaryDark} 0%,
                      #084842 100%
                    )
                  `,
                },
              }}
            >
              {currentSlide.primaryLabel}
            </Button>

            <Button
              onClick={handleSecondary}
              sx={{
                minHeight: 56,
                px: 4,
                borderRadius: "18px",
                textTransform: "none",
                fontWeight: 800,
                fontSize: "1rem",
                color: "#ffffff",

                border:
                  "1px solid rgba(255,255,255,0.18)",

                background:
                  "rgba(255,255,255,0.08)",

                backdropFilter: "blur(8px)",

                "&:hover": {
                  background:
                    "rgba(255,255,255,0.14)",
                },
              }}
            >
              {currentSlide.secondaryLabel}
            </Button>
          </Stack>

          {/* Footer Tags */}
          <Stack
            direction="row"
            spacing={1.2}
            alignItems="center"
            sx={{
              mt: 4,
              flexWrap: "wrap",
            }}
          >
            <Typography
              sx={{
                fontSize: "0.84rem",
                color: "rgba(255,255,255,0.66)",
                fontWeight: 700,
              }}
            >
              Verified marketplace
            </Typography>

            <Box
              sx={{
                width: 5,
                height: 5,
                borderRadius: "50%",
                background:
                  "rgba(255,255,255,0.42)",
              }}
            />

            <Typography
              sx={{
                fontSize: "0.84rem",
                color: "rgba(255,255,255,0.66)",
                fontWeight: 700,
              }}
            >
              Property + vehicle discovery
            </Typography>

            <Box
              sx={{
                width: 5,
                height: 5,
                borderRadius: "50%",
                background: easyDealBrand.accent,
              }}
            />

            <Typography
              sx={{
                fontSize: "0.84rem",
                color: "rgba(255,255,255,0.66)",
                fontWeight: 700,
              }}
            >
              Premium seller tools
            </Typography>
          </Stack>
        </Box>
      </Container>

      {/* Indicators */}
      <Stack
        direction="row"
        spacing={1.2}
        sx={{
          position: "absolute",
          left: {
            xs: 20,
            md: 40,
          },
          bottom: 28,
          zIndex: 3,
        }}
      >
        {slides.map((item, index) => (
          <Box
            key={item.id}
            onClick={() => setActive(index)}
            sx={{
              width: index === active ? 34 : 10,
              height: 10,
              borderRadius: "999px",
              cursor: "pointer",

              background:
                index === active
                  ? easyDealBrand.accent
                  : "rgba(255,255,255,0.36)",

              transition: "all .25s ease",
            }}
          />
        ))}
      </Stack>

      {/* Navigation */}
      <Stack
        direction="row"
        spacing={1.2}
        sx={{
          position: "absolute",
          right: {
            xs: 18,
            md: 30,
          },
          bottom: 20,
          zIndex: 3,
        }}
      >
        <IconButton
          onClick={goPrev}
          aria-label="Previous slide"
          sx={{
            width: 52,
            height: 52,
            color: "#ffffff",

            background:
              "rgba(255,255,255,0.08)",

            border:
              "1px solid rgba(255,255,255,0.14)",

            backdropFilter: "blur(10px)",

            "&:hover": {
              background:
                "rgba(255,255,255,0.14)",
            },
          }}
        >
          <ChevronLeftRoundedIcon />
        </IconButton>

        <IconButton
          onClick={goNext}
          aria-label="Next slide"
          sx={{
            width: 52,
            height: 52,
            color: "#ffffff",

            background:
              "rgba(255,255,255,0.08)",

            border:
              "1px solid rgba(255,255,255,0.14)",

            backdropFilter: "blur(10px)",

            "&:hover": {
              background:
                "rgba(255,255,255,0.14)",
            },
          }}
        >
          <ChevronRightRoundedIcon />
        </IconButton>
      </Stack>
    </Box>
  );
}