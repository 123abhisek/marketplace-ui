// src/main.jsx
import React from "react";
import ReactDOM from "react-dom/client";
import { BrowserRouter } from "react-router-dom";
import { CssBaseline, ThemeProvider } from "@mui/material";
import { HelmetProvider } from "react-helmet-async";
import App from "./App";
import theme from "./theme";
import { AppProvider } from "./hooks/useAppState";
import "./index.css";
import ErrorBoundary from "./components/ErrorBoundary";

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <HelmetProvider>
      <ThemeProvider theme={theme}>
        <CssBaseline />
        <ErrorBoundary>
          <BrowserRouter>
            <AppProvider>
              <App />
            </AppProvider>
          </BrowserRouter>
        </ErrorBoundary>
      </ThemeProvider>
    </HelmetProvider>
  </React.StrictMode>,
);
