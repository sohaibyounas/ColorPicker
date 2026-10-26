import { createTheme } from "@mui/material/styles";

// Dark, glassy theme shared by the popup and the full-tab view
const theme = createTheme({
  palette: {
    mode: "dark",
    primary: { main: "#7C3AED", light: "#a78bfa", contrastText: "#ffffff" },
    secondary: { main: "#c084fc", contrastText: "#000000" },
    background: {
      default: "#05050a",
      paper: "rgba(20, 20, 25, 0.6)",
    },
    text: {
      primary: "#ffffff",
      secondary: "rgba(255, 255, 255, 0.7)",
    },
    divider: "rgba(255, 255, 255, 0.08)",
  },
  shape: { borderRadius: 12 },
  typography: {
    fontFamily: 'system-ui, -apple-system, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif',
    body1: { fontSize: "0.95rem", lineHeight: 1.6 },
    body2: { fontSize: "0.85rem", lineHeight: 1.55 },
    button: {
      textTransform: "none",
      fontWeight: 600,
      letterSpacing: "0.01em",
    },
    caption: {
      letterSpacing: "0.08em",
      textTransform: "uppercase",
      fontWeight: 600,
      fontSize: "0.68rem",
    },
  },
  components: {
    MuiCssBaseline: {
      styleOverrides: {
        body: {
          backgroundImage:
            "radial-gradient(circle at top right, rgba(124, 58, 237, 0.15) 0%, transparent 60%), radial-gradient(circle at bottom left, rgba(192, 132, 252, 0.1) 0%, transparent 60%)",
          backgroundAttachment: "fixed",
        },
      },
    },
    MuiButton: {
      defaultProps: { disableElevation: true },
      styleOverrides: {
        root: {
          borderRadius: 10,
          transition: "background-color 0.2s, border-color 0.2s, box-shadow 0.2s",
        },
        contained: {
          backgroundImage: "linear-gradient(135deg, #7C3AED 0%, #c084fc 100%)",
          boxShadow: "0 8px 20px -8px rgba(124, 58, 237, 0.6)",
          "&:hover": {
            boxShadow: "0 12px 24px -8px rgba(124, 58, 237, 0.8)",
          },
          "&.Mui-disabled": {
            backgroundImage: "none",
          },
        },
        outlined: {
          borderColor: "rgba(255,255,255,0.15)",
          backgroundColor: "rgba(255,255,255,0.02)",
          "&:hover": {
            backgroundColor: "rgba(255,255,255,0.06)",
            borderColor: "rgba(255,255,255,0.3)",
          },
        },
      },
    },
    MuiPaper: {
      defaultProps: { elevation: 0 },
      styleOverrides: {
        root: {
          backgroundImage: "none",
          border: "1px solid rgba(255,255,255,0.08)",
          backdropFilter: "blur(12px)",
          boxShadow: "0 24px 48px -12px rgba(0,0,0,0.5)",
        },
      },
    },
  },
});

export default theme;
