// frontend/src/App.tsx
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { createTheme, ThemeProvider } from "@mui/material/styles";
import { useMemo, useState, createContext } from "react";
import Home from "./pages/Home";
import CoinDetail from "./pages/CoinDetail";

export const DarkModeContext = createContext({
  darkMode: false,
  toggleDarkMode: () => {},
});

export default function App() {
  const [darkMode, setDarkMode] = useState(false);
  const theme = useMemo(
    () =>
      createTheme({
        palette: {
          mode: darkMode ? "dark" : "light",
          primary: {
            main: "#1976d2",
          },
          background: {
            default: darkMode ? "#121212" : "#f5f5f5",
            paper: darkMode ? "#1e1e1e" : "#ffffff",
          },
        },
        typography: {
          fontFamily: "Roboto, sans-serif",
        },
        components: {
          MuiTable: {
            styleOverrides: {
              root: {
                borderRadius: "8px",
                overflow: "hidden",
                boxShadow: "0 4px 12px rgba(0,0,0,0.1)",
              },
            },
          },
        },
      }),
    [darkMode]
  );

  const toggleDarkMode = () => setDarkMode(!darkMode);

  return (
    <DarkModeContext.Provider value={{ darkMode, toggleDarkMode }}>
      <ThemeProvider theme={theme}>
        <Router>
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/coin/:id" element={<CoinDetail />} />
          </Routes>
        </Router>
      </ThemeProvider>
    </DarkModeContext.Provider>
  );
}
