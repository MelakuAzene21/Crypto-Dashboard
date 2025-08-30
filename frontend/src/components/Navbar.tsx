// frontend/src/components/Navbar.tsx
import { AppBar, Toolbar, Typography, Switch } from "@mui/material";
import { useContext } from "react";
import { DarkModeContext } from "../App";

export default function Navbar() {
  const { darkMode, toggleDarkMode } = useContext(DarkModeContext);
  return (
    <AppBar
      position="static"
      sx={{
        borderRadius: "0 0 8px 8px",
        boxShadow: "0 2px 8px rgba(0,0,0,0.1)",
      }}
    >
      <Toolbar>
        <Typography variant="h6" sx={{ flexGrow: 1 }}>
          Crypto Dashboard
        </Typography>
        <Switch checked={darkMode} onChange={toggleDarkMode} color="default" />
      </Toolbar>
    </AppBar>
  );
}
