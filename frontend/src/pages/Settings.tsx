import { useState, useEffect } from "react";
import { useNotification } from "../contexts/NotificationContext";
import {
  Box,
  Typography,
  Grid,
  Card,
  CardContent,
  Switch,
  FormControlLabel,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
  Button,
  Alert,
} from "@mui/material";
import {
  Palette,
  Notifications,
  CurrencyExchange,
  Security,
  Save,
} from "@mui/icons-material";

interface Settings {
  theme: "dark" | "light" | "auto";
  currency: string;
  notifications: {
    priceAlerts: boolean;
    newsUpdates: boolean;
    soundEnabled: boolean;
  };
  privacy: {
    analytics: boolean;
    personalizedAds: boolean;
  };
}

export default function Settings() {
  const [settings, setSettings] = useState<Settings>({
    theme: "dark",
    currency: "USD",
    notifications: {
      priceAlerts: true,
      newsUpdates: true,
      soundEnabled: true,
    },
    privacy: {
      analytics: true,
      personalizedAds: false,
    },
  });
  const [saved, setSaved] = useState(false);
  const { showNotification } = useNotification();

  useEffect(() => {
    loadSettings();
  }, []);

  const loadSettings = () => {
    const saved = localStorage.getItem("dashboardSettings");
    if (saved) {
      setSettings(JSON.parse(saved));
    }
  };

  const saveSettings = () => {
    localStorage.setItem("dashboardSettings", JSON.stringify(settings));
    setSaved(true);
    showNotification('Settings saved successfully!', 'success');
    setTimeout(() => setSaved(false), 3000);
  };

  const updateSettings = (section: keyof Settings, key: string, value: any) => {
    setSettings(prev => ({
      ...prev,
      [section]: {
        ...prev[section],
        [key]: value,
      },
    }));
  };

  return (
    <Box sx={{ p: { xs: 2, md: 4 }, minHeight: "100vh" }}>
      <Box sx={{ mb: 4 }}>
        <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center", mb: 1 }}>
          <Box>
            <Typography variant="h3" fontWeight="700" color="white" gutterBottom>
              Settings
            </Typography>
            <Typography variant="body1" color="text.secondary">
              Customize your dashboard experience
            </Typography>
          </Box>
          <Button
            variant="contained"
            startIcon={<Save />}
            onClick={saveSettings}
            sx={{
              background: "linear-gradient(135deg, #00D4AA 0%, #3B82F6 100%)",
              "&:hover": {
                background: "linear-gradient(135deg, #33DDBB 0%, #60A5FA 100%)",
              },
            }}
          >
            Save Changes
          </Button>
        </Box>
      </Box>

      {saved && (
        <Alert severity="success" sx={{ mb: 3 }}>
          Settings saved successfully!
        </Alert>
      )}

      <Grid container spacing={3}>
        <Grid item xs={12} md={6}>
          <Card sx={{ background: "linear-gradient(145deg, rgba(30, 41, 59, 0.8) 0%, rgba(15, 23, 42, 0.9) 100%)", border: "1px solid rgba(148, 163, 184, 0.1)", borderRadius: 3 }}>
            <CardContent>
              <Box sx={{ display: "flex", alignItems: "center", mb: 3 }}>
                <Box sx={{ width: 48, height: 48, borderRadius: 2, background: "linear-gradient(135deg, #8B5CF6 0%, #A855F7 100%)", display: "flex", alignItems: "center", justifyContent: "center", mr: 2 }}>
                  <Palette sx={{ color: "white", fontSize: 24 }} />
                </Box>
                <Typography variant="h5" fontWeight="600" color="white">Appearance</Typography>
              </Box>

              <FormControl fullWidth sx={{ mb: 3 }}>
                <InputLabel sx={{ color: "text.secondary" }}>Theme</InputLabel>
                <Select value={settings.theme} onChange={(e) => setSettings(prev => ({ ...prev, theme: e.target.value as any }))} sx={{ color: "white" }}>
                  <MenuItem value="dark">Dark Theme</MenuItem>
                  <MenuItem value="light">Light Theme</MenuItem>
                  <MenuItem value="auto">Auto (System)</MenuItem>
                </Select>
              </FormControl>
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12} md={6}>
          <Card sx={{ background: "linear-gradient(145deg, rgba(30, 41, 59, 0.8) 0%, rgba(15, 23, 42, 0.9) 100%)", border: "1px solid rgba(148, 163, 184, 0.1)", borderRadius: 3 }}>
            <CardContent>
              <Box sx={{ display: "flex", alignItems: "center", mb: 3 }}>
                <Box sx={{ width: 48, height: 48, borderRadius: 2, background: "linear-gradient(135deg, #10B981 0%, #34D399 100%)", display: "flex", alignItems: "center", justifyContent: "center", mr: 2 }}>
                  <CurrencyExchange sx={{ color: "white", fontSize: 24 }} />
                </Box>
                <Typography variant="h5" fontWeight="600" color="white">Currency</Typography>
              </Box>

              <FormControl fullWidth>
                <InputLabel sx={{ color: "text.secondary" }}>Display Currency</InputLabel>
                <Select value={settings.currency} onChange={(e) => setSettings(prev => ({ ...prev, currency: e.target.value }))} sx={{ color: "white" }}>
                  <MenuItem value="USD">$ US Dollar (USD)</MenuItem>
                  <MenuItem value="EUR">€ Euro (EUR)</MenuItem>
                  <MenuItem value="GBP">£ British Pound (GBP)</MenuItem>
                  <MenuItem value="JPY">¥ Japanese Yen (JPY)</MenuItem>
                </Select>
              </FormControl>
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12} md={6}>
          <Card sx={{ background: "linear-gradient(145deg, rgba(30, 41, 59, 0.8) 0%, rgba(15, 23, 42, 0.9) 100%)", border: "1px solid rgba(148, 163, 184, 0.1)", borderRadius: 3 }}>
            <CardContent>
              <Box sx={{ display: "flex", alignItems: "center", mb: 3 }}>
                <Box sx={{ width: 48, height: 48, borderRadius: 2, background: "linear-gradient(135deg, #F59E0B 0%, #FBBF24 100%)", display: "flex", alignItems: "center", justifyContent: "center", mr: 2 }}>
                  <Notifications sx={{ color: "white", fontSize: 24 }} />
                </Box>
                <Typography variant="h5" fontWeight="600" color="white">Notifications</Typography>
              </Box>

              <FormControlLabel
                control={<Switch checked={settings.notifications.priceAlerts} onChange={(e) => updateSettings("notifications", "priceAlerts", e.target.checked)} />}
                label="Price Alerts"
                sx={{ color: "text.secondary", mb: 1 }}
              />
              <FormControlLabel
                control={<Switch checked={settings.notifications.newsUpdates} onChange={(e) => updateSettings("notifications", "newsUpdates", e.target.checked)} />}
                label="News Updates"
                sx={{ color: "text.secondary", mb: 1 }}
              />
              <FormControlLabel
                control={<Switch checked={settings.notifications.soundEnabled} onChange={(e) => updateSettings("notifications", "soundEnabled", e.target.checked)} />}
                label="Sound Notifications"
                sx={{ color: "text.secondary" }}
              />
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12} md={6}>
          <Card sx={{ background: "linear-gradient(145deg, rgba(30, 41, 59, 0.8) 0%, rgba(15, 23, 42, 0.9) 100%)", border: "1px solid rgba(148, 163, 184, 0.1)", borderRadius: 3 }}>
            <CardContent>
              <Box sx={{ display: "flex", alignItems: "center", mb: 3 }}>
                <Box sx={{ width: 48, height: 48, borderRadius: 2, background: "linear-gradient(135deg, #EF4444 0%, #F87171 100%)", display: "flex", alignItems: "center", justifyContent: "center", mr: 2 }}>
                  <Security sx={{ color: "white", fontSize: 24 }} />
                </Box>
                <Typography variant="h5" fontWeight="600" color="white">Privacy & Data</Typography>
              </Box>

              <FormControlLabel
                control={<Switch checked={settings.privacy.analytics} onChange={(e) => updateSettings("privacy", "analytics", e.target.checked)} />}
                label="Analytics"
                sx={{ color: "text.secondary", mb: 1 }}
              />
              <FormControlLabel
                control={<Switch checked={settings.privacy.personalizedAds} onChange={(e) => updateSettings("privacy", "personalizedAds", e.target.checked)} />}
                label="Personalized Ads"
                sx={{ color: "text.secondary" }}
              />
            </CardContent>
          </Card>
        </Grid>
      </Grid>
    </Box>
  );
}
