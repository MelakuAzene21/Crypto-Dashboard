import { AppBar, Toolbar, Typography, Switch } from "@mui/material";

export default function Navbar() {
  return (
    <AppBar position="static">
      <Toolbar>
        <Typography variant="h6">Crypto Dashboard</Typography>
        <Switch color="default" /> {/* Dark mode toggle */}
      </Toolbar>
    </AppBar>
  );
}
