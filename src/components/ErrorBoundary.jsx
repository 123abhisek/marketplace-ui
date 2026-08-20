// src/components/ErrorBoundary.jsx

import React from "react";
import { Box, Button, Typography } from "@mui/material";

export default class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      hasError: false,
      error: null,
    };
  }

  static getDerivedStateFromError(error) {
    return {
      hasError: true,
      error,
    };
  }

  componentDidCatch(error, errorInfo) {
    console.error("========== REACT CRASH ==========");
    console.error("ERROR:", error);
    console.error("STACK:", error?.stack);
    console.error("COMPONENT STACK:", errorInfo?.componentStack);
    console.error("=================================");
  }

  render() {
    if (this.state.hasError) {
      return (
        <Box
          sx={{
            minHeight: "100vh",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            p: 3,
            bgcolor: "#f8fafc",
          }}
        >
          <Box
            sx={{
              width: "100%",
              maxWidth: 680,
              p: 4,
              bgcolor: "#fff",
              borderRadius: 4,
              boxShadow: "0 20px 60px rgba(0,0,0,.1)",
            }}
          >
            <Typography
              variant="h5"
              fontWeight={900}
              color="error"
              gutterBottom
            >
              Something went wrong
            </Typography>

            <Typography sx={{ mb: 2 }}>
              {this.state.error?.message || "Unknown React error"}
            </Typography>

            <Button
              variant="contained"
              onClick={() => window.location.reload()}
            >
              Reload
            </Button>
          </Box>
        </Box>
      );
    }

    return this.props.children;
  }
}