import { useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import {
  Box,
  Drawer,
  List,
  ListItem,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  Avatar,
  Typography,
  Divider,
  useTheme,
  useMediaQuery,
} from "@mui/material";
import {
  Dashboard,
  BarChart,
  AccountBalanceWallet,
  Star,
  Newspaper,
  Notifications,
  Settings,
  TrendingUp,
} from "@mui/icons-material";

const drawerWidth = 280;

const menuItems = [
  { text: "Dashboard", icon: <Dashboard />, path: "/" },
  { text: "Markets", icon: <BarChart />, path: "/markets" },
  { text: "Portfolio", icon: <AccountBalanceWallet />, path: "/portfolio" },
  { text: "Watchlist", icon: <Star />, path: "/watchlist" },
  { text: "News", icon: <Newspaper />, path: "/news" },
  { text: "Alerts", icon: <Notifications />, path: "/alerts" },
];

export default function Sidebar() {
  const navigate = useNavigate();
  const location = useLocation();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("md"));
  const [mobileOpen, setMobileOpen] = useState(false);

  const handleDrawerToggle = () => {
    setMobileOpen(!mobileOpen);
  };

  const handleNavigation = (path: string) => {
    navigate(path);
    if (isMobile) {
      setMobileOpen(false);
    }
  };

  const drawer = (
    <Box sx={{ height: "100%", display: "flex", flexDirection: "column" }}>
      {/* Logo Section */}
      <Box
        sx={{
          p: 3,
          display: "flex",
          alignItems: "center",
          gap: 2,
          borderBottom: "1px solid rgba(148, 163, 184, 0.1)",
        }}
      >
        <Box
          sx={{
            width: 40,
            height: 40,
            borderRadius: 2,
            background: "linear-gradient(135deg, #3B82F6 0%, #00D4AA 100%)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            boxShadow: "0 4px 12px rgba(59, 130, 246, 0.3)",
          }}
        >
          <TrendingUp sx={{ color: "white", fontSize: 20 }} />
        </Box>
        <Box>
          <Typography variant="h6" fontWeight="700" color="white">
            CryptoVault
          </Typography>
          <Typography variant="caption" color="text.secondary">
            Pro Dashboard
          </Typography>
        </Box>
      </Box>

      {/* Navigation Menu */}
      <List sx={{ flexGrow: 1, pt: 2 }}>
        {menuItems.map((item) => {
          const isActive = location.pathname === item.path;
          return (
            <ListItem key={item.text} disablePadding sx={{ mb: 1 }}>
              <ListItemButton
                onClick={() => handleNavigation(item.path)}
                sx={{
                  mx: 2,
                  borderRadius: 2,
                  background: isActive
                    ? "linear-gradient(135deg, rgba(0, 212, 170, 0.1) 0%, rgba(59, 130, 246, 0.1) 100%)"
                    : "transparent",
                  border: isActive ? "1px solid rgba(0, 212, 170, 0.2)" : "none",
                  "&:hover": {
                    background: "rgba(148, 163, 184, 0.05)",
                  },
                }}
              >
                <ListItemIcon
                  sx={{
                    color: isActive ? "primary.main" : "text.secondary",
                    minWidth: 40,
                  }}
                >
                  {item.icon}
                </ListItemIcon>
                <ListItemText
                  primary={item.text}
                  sx={{
                    "& .MuiListItemText-primary": {
                      fontWeight: isActive ? 600 : 500,
                      color: isActive ? "white" : "text.secondary",
                    },
                  }}
                />
              </ListItemButton>
            </ListItem>
          );
        })}
      </List>

      {/* User Profile Section */}
      <Box sx={{ p: 2, borderTop: "1px solid rgba(148, 163, 184, 0.1)" }}>
        <Box sx={{ display: "flex", alignItems: "center", gap: 2, mb: 2 }}>
          <Avatar
            sx={{
              bgcolor: "primary.main",
              width: 40,
              height: 40,
              fontSize: "0.875rem",
              fontWeight: 600,
            }}
          >
            JD
          </Avatar>
          <Box sx={{ flexGrow: 1 }}>
            <Typography variant="body2" fontWeight="500" color="white">
              John Doe
            </Typography>
            <Typography variant="caption" color="text.secondary">
              Premium User
            </Typography>
          </Box>
        </Box>
        <ListItemButton
          sx={{
            borderRadius: 2,
            "&:hover": {
              background: "rgba(148, 163, 184, 0.05)",
            },
          }}
        >
          <ListItemIcon sx={{ color: "text.secondary", minWidth: 40 }}>
            <Settings />
          </ListItemIcon>
          <ListItemText
            primary="Settings"
            sx={{
              "& .MuiListItemText-primary": {
                fontWeight: 500,
                color: "text.secondary",
              },
            }}
          />
        </ListItemButton>
      </Box>
    </Box>
  );

  return (
    <>
      {/* Desktop Drawer */}
      <Drawer
        variant="permanent"
        sx={{
          width: drawerWidth,
          flexShrink: 0,
          "& .MuiDrawer-paper": {
            width: drawerWidth,
            boxSizing: "border-box",
            background: "linear-gradient(180deg, #1E293B 0%, #0F172A 100%)",
            borderRight: "1px solid rgba(148, 163, 184, 0.1)",
            boxShadow: "4px 0 20px rgba(0, 0, 0, 0.3)",
          },
          display: { xs: "none", md: "block" },
        }}
      >
        {drawer}
      </Drawer>

      {/* Mobile Drawer */}
      <Drawer
        variant="temporary"
        open={mobileOpen}
        onClose={handleDrawerToggle}
        ModalProps={{
          keepMounted: true,
        }}
        sx={{
          display: { xs: "block", md: "none" },
          "& .MuiDrawer-paper": {
            width: drawerWidth,
            boxSizing: "border-box",
            background: "linear-gradient(180deg, #1E293B 0%, #0F172A 100%)",
            borderRight: "1px solid rgba(148, 163, 184, 0.1)",
          },
        }}
      >
        {drawer}
      </Drawer>
    </>
  );
}
