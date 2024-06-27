import "./index.css";

import { ThemeProvider, createTheme } from "@mui/material/styles";

import App from "./App";
import CssBaseline from "@mui/material/CssBaseline";
import React from "react";
import ReactDOM from "react-dom";
import { SnackbarProvider } from "notistack";

const theme = createTheme({
  typography: {
    fontFamily: "Inter, Arial, sans-serif",
    h2: {
      fontSize: "0.8rem",
      fontWeight: "600",
    },
  },
});

ReactDOM.render(
  <SnackbarProvider
    maxSnack={3}
    anchorOrigin={{
      vertical: "top",
      horizontal: "center",
    }}
    style={{
      fontSize: "0.75rem",
    }}
  >
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <App />
    </ThemeProvider>
  </SnackbarProvider>,
  document.getElementById("root")
);
