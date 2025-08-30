// frontend/src/App.tsx
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { ThemeProvider, createTheme } from "@mui/material/styles";
import { CssBaseline, Box } from "@mui/material";
import Home from "./pages/Home";
import CoinDetail from "./pages/CoinDetail";
import Markets from "./pages/Markets";
import Portfolio from "./pages/Portfolio";
import Watchlist from "./pages/Watchlist";
import News from "./pages/News";
import Alerts from "./pages/Alerts";
import Sidebar from "./components/Sidebar";

const darkTheme = createTheme({
  palette: {
    mode: "dark",
    primary: {
      main: "#00D4AA", // Green accent
      light: "#33DDBB",
      dark: "#00947A",
    },
    secondary: {
      main: "#3B82F6", // Blue accent
      light: "#60A5FA",
      dark: "#1D4ED8",
    },
    background: {
      default: "#0F172A", // Dark blue background
      paper: "#1E293B", // Slightly lighter dark blue
    },
    text: {
      primary: "#F8FAFC",
      secondary: "#94A3B8",
    },
    success: {
      main: "#10B981",
      light: "#34D399",
      dark: "#059669",
    },
    error: {
      main: "#EF4444",
      light: "#F87171",
      dark: "#DC2626",
    },
    warning: {
      main: "#F59E0B",
      light: "#FBBF24",
      dark: "#D97706",
    },
    info: {
      main: "#3B82F6",
      light: "#60A5FA",
      dark: "#1D4ED8",
    },
  },
  typography: {
    fontFamily: '"Inter", "Roboto", "Helvetica", "Arial", sans-serif',
    h1: {
      fontWeight: 700,
      fontSize: "2.5rem",
    },
    h2: {
      fontWeight: 600,
      fontSize: "2rem",
    },
    h3: {
      fontWeight: 600,
      fontSize: "1.5rem",
    },
    h4: {
      fontWeight: 600,
      fontSize: "1.25rem",
    },
    h5: {
      fontWeight: 500,
      fontSize: "1.125rem",
    },
    h6: {
      fontWeight: 500,
      fontSize: "1rem",
    },
  },
  shape: {
    borderRadius: 12,
  },
  components: {
    MuiCard: {
      styleOverrides: {
        root: {
          background: "linear-gradient(145deg, rgba(30, 41, 59, 0.8) 0%, rgba(15, 23, 42, 0.9) 100%)",
          backdropFilter: "blur(10px)",
          border: "1px solid rgba(148, 163, 184, 0.1)",
          boxShadow: "0 4px 20px rgba(0, 0, 0, 0.3)",
        },
      },
    },
    MuiPaper: {
      styleOverrides: {
        root: {
          background: "linear-gradient(145deg, rgba(30, 41, 59, 0.8) 0%, rgba(15, 23, 42, 0.9) 100%)",
          backdropFilter: "blur(10px)",
          border: "1px solid rgba(148, 163, 184, 0.1)",
        },
      },
    },
    MuiButton: {
      styleOverrides: {
        root: {
          textTransform: "none",
          fontWeight: 500,
          borderRadius: 8,
        },
        contained: {
          background: "linear-gradient(135deg, #00D4AA 0%, #3B82F6 100%)",
          "&:hover": {
            background: "linear-gradient(135deg, #33DDBB 0%, #60A5FA 100%)",
          },
        },
      },
    },
  },
});

function App() {
  return (
    <ThemeProvider theme={darkTheme}>
      <CssBaseline />
      <Router>
        <Box sx={{ display: "flex", minHeight: "100vh", bgcolor: "background.default" }}>
          <Sidebar />
          <Box sx={{ flexGrow: 1, overflow: "auto" }}>
            <Routes>
              <Route path="/" element={<Home />} />
              <Route path="/markets" element={<Markets />} />
              <Route path="/portfolio" element={<Portfolio />} />
              <Route path="/watchlist" element={<Watchlist />} />
              <Route path="/news" element={<News />} />
              <Route path="/alerts" element={<Alerts />} />
              <Route path="/coin/:id" element={<CoinDetail />} />
            </Routes>
          </Box>
        </Box>
      </Router>
    </ThemeProvider>
  );
}

export default App;
