import { useEffect, useState } from "react";
import { useNotification } from "../contexts/NotificationContext";
import {
  Box,
  Typography,
  Grid,
  Card,
  CardContent,
  Button,
  Chip,
  Avatar,
  useTheme,
  useMediaQuery,
  IconButton,
  Tooltip,
  Switch,
  FormControlLabel,
  Divider,
} from "@mui/material";
import {
  Notifications,
  NotificationsOff,
  Add,
  Delete,
  TrendingUp,
  TrendingDown,
  Settings,
} from "@mui/icons-material";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
} from "@mui/material";

interface Alert {
  id: string;
  coinId: string;
  coinName: string;
  coinSymbol: string;
  coinImage: string;
  type: "above" | "below";
  price: number;
  isActive: boolean;
  createdAt: Date;
}

export default function Alerts() {
  const [alerts, setAlerts] = useState<Alert[]>([]);
  const [loading, setLoading] = useState(true);
  const [openAddDialog, setOpenAddDialog] = useState(false);
  const [newAlert, setNewAlert] = useState({
    coinId: "",
    coinName: "",
    coinSymbol: "",
    coinImage: "",
    type: "above" as "above" | "below",
    price: "",
  });
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("md"));
  const { showNotification } = useNotification();

  useEffect(() => {
    loadAlerts();
  }, []);

  const loadAlerts = () => {
    const saved = localStorage.getItem("priceAlerts");
    if (saved) {
      setAlerts(JSON.parse(saved));
    }
    setLoading(false);
  };

  const saveAlerts = (newAlerts: Alert[]) => {
    localStorage.setItem("priceAlerts", JSON.stringify(newAlerts));
    setAlerts(newAlerts);
  };

  const toggleAlert = (alertId: string) => {
    const alertToToggle = alerts.find(alert => alert.id === alertId);
    const newAlerts = alerts.map(alert =>
      alert.id === alertId ? { ...alert, isActive: !alert.isActive } : alert
    );
    saveAlerts(newAlerts);
    if (alertToToggle) {
      const status = !alertToToggle.isActive ? 'activated' : 'deactivated';
      showNotification(`Alert for ${alertToToggle.coinName} ${status}`, 'info');
    }
  };

  const deleteAlert = (alertId: string) => {
    const alertToDelete = alerts.find(alert => alert.id === alertId);
    const newAlerts = alerts.filter(alert => alert.id !== alertId);
    saveAlerts(newAlerts);
    if (alertToDelete) {
      showNotification(`Alert for ${alertToDelete.coinName} deleted`, 'info');
    }
  };

  const getAlertStats = () => {
    const active = alerts.filter(alert => alert.isActive).length;
    const above = alerts.filter(alert => alert.type === "above").length;
    const below = alerts.filter(alert => alert.type === "below").length;
    return { active, above, below };
  };

  const stats = getAlertStats();

  const handleAddAlert = () => {
    if (newAlert.coinName && newAlert.coinSymbol && newAlert.price) {
      const alert: Alert = {
        id: Date.now().toString(),
        coinId: newAlert.coinId || newAlert.coinSymbol.toLowerCase(),
        coinName: newAlert.coinName,
        coinSymbol: newAlert.coinSymbol,
        coinImage: newAlert.coinImage || `https://api.coingecko.com/api/v3/coins/${newAlert.coinId}/image`,
        type: newAlert.type,
        price: parseFloat(newAlert.price),
        isActive: true,
        createdAt: new Date(),
      };
      
      const newAlerts = [...alerts, alert];
      saveAlerts(newAlerts);
      setOpenAddDialog(false);
      setNewAlert({
        coinId: "",
        coinName: "",
        coinSymbol: "",
        coinImage: "",
        type: "above",
        price: "",
      });
      showNotification(`Alert created for ${alert.coinName} at $${alert.price}`, 'success');
    } else {
      showNotification('Please fill in all required fields', 'error');
    }
  };

  const handleCloseDialog = () => {
    setOpenAddDialog(false);
    setNewAlert({
      coinId: "",
      coinName: "",
      coinSymbol: "",
      coinImage: "",
      type: "above",
      price: "",
    });
  };

  return (
    <Box sx={{ p: { xs: 2, md: 4 }, minHeight: "100vh" }}>
      {/* Header Section */}
      <Box sx={{ mb: 4 }}>
        <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center", mb: 1 }}>
          <Box>
            <Typography variant="h3" fontWeight="700" color="white" gutterBottom>
              Alerts
            </Typography>
            <Typography variant="body1" color="text.secondary">
              Set price alerts for your favorite cryptocurrencies
            </Typography>
          </Box>
          <Button
            variant="contained"
            startIcon={<Add />}
            onClick={() => setOpenAddDialog(true)}
            sx={{
              background: "linear-gradient(135deg, #00D4AA 0%, #3B82F6 100%)",
              "&:hover": {
                background: "linear-gradient(135deg, #33DDBB 0%, #60A5FA 100%)",
              },
            }}
          >
            Add Alert
          </Button>
        </Box>
      </Box>

      {/* Alert Stats */}
      <Grid container spacing={3} sx={{ mb: 4 }}>
        <Grid item xs={12} sm={4}>
          <Card
            sx={{
              background: "linear-gradient(135deg, rgba(59, 130, 246, 0.1) 0%, rgba(96, 165, 250, 0.1) 100%)",
              border: "1px solid rgba(59, 130, 246, 0.2)",
            }}
          >
            <CardContent>
              <Box sx={{ display: "flex", alignItems: "center" }}>
                <Box
                  sx={{
                    width: 48,
                    height: 48,
                    borderRadius: 2,
                    background: "linear-gradient(135deg, #3B82F6 0%, #60A5FA 100%)",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    mr: 2,
                  }}
                >
                  <Notifications sx={{ color: "white", fontSize: 24 }} />
                </Box>
                <Box>
                  <Typography variant="body2" color="text.secondary" fontWeight="500">
                    Active Alerts
                  </Typography>
                  <Typography variant="h4" fontWeight="700" color="white">
                    {stats.active}
                  </Typography>
                </Box>
              </Box>
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12} sm={4}>
          <Card
            sx={{
              background: "linear-gradient(135deg, rgba(16, 185, 129, 0.1) 0%, rgba(0, 212, 170, 0.1) 100%)",
              border: "1px solid rgba(16, 185, 129, 0.2)",
            }}
          >
            <CardContent>
              <Box sx={{ display: "flex", alignItems: "center" }}>
                <Box
                  sx={{
                    width: 48,
                    height: 48,
                    borderRadius: 2,
                    background: "linear-gradient(135deg, #10B981 0%, #00D4AA 100%)",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    mr: 2,
                  }}
                >
                  <TrendingUp sx={{ color: "white", fontSize: 24 }} />
                </Box>
                <Box>
                  <Typography variant="body2" color="text.secondary" fontWeight="500">
                    Above Price
                  </Typography>
                  <Typography variant="h4" fontWeight="700" color="white">
                    {stats.above}
                  </Typography>
                </Box>
              </Box>
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12} sm={4}>
          <Card
            sx={{
              background: "linear-gradient(135deg, rgba(239, 68, 68, 0.1) 0%, rgba(248, 113, 113, 0.1) 100%)",
              border: "1px solid rgba(239, 68, 68, 0.2)",
            }}
          >
            <CardContent>
              <Box sx={{ display: "flex", alignItems: "center" }}>
                <Box
                  sx={{
                    width: 48,
                    height: 48,
                    borderRadius: 2,
                    background: "linear-gradient(135deg, #EF4444 0%, #F87171 100%)",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    mr: 2,
                  }}
                >
                  <TrendingDown sx={{ color: "white", fontSize: 24 }} />
                </Box>
                <Box>
                  <Typography variant="body2" color="text.secondary" fontWeight="500">
                    Below Price
                  </Typography>
                  <Typography variant="h4" fontWeight="700" color="white">
                    {stats.below}
                  </Typography>
                </Box>
              </Box>
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      {/* Alerts List */}
      {alerts.length === 0 ? (
        <Card
          sx={{
            background: "linear-gradient(145deg, rgba(30, 41, 59, 0.8) 0%, rgba(15, 23, 42, 0.9) 100%)",
            border: "1px solid rgba(148, 163, 184, 0.1)",
            borderRadius: 3,
          }}
        >
          <CardContent sx={{ textAlign: "center", py: 8 }}>
            <Notifications sx={{ fontSize: 64, color: "text.secondary", mb: 2 }} />
            <Typography variant="h5" fontWeight="600" color="white" gutterBottom>
              No price alerts set
            </Typography>
            <Typography variant="body1" color="text.secondary" sx={{ mb: 3 }}>
              Create price alerts to get notified when cryptocurrencies reach your target prices
            </Typography>
            <Button
              variant="contained"
              startIcon={<Add />}
              onClick={() => setOpenAddDialog(true)}
              sx={{
                background: "linear-gradient(135deg, #00D4AA 0%, #3B82F6 100%)",
                "&:hover": {
                  background: "linear-gradient(135deg, #33DDBB 0%, #60A5FA 100%)",
                },
              }}
            >
              Create First Alert
            </Button>
          </CardContent>
        </Card>
      ) : (
        <Grid container spacing={2}>
          {alerts.map((alert) => (
            <Grid item xs={12} key={alert.id}>
              <Card
                sx={{
                  background: "linear-gradient(145deg, rgba(30, 41, 59, 0.8) 0%, rgba(15, 23, 42, 0.9) 100%)",
                  border: "1px solid rgba(148, 163, 184, 0.1)",
                  borderRadius: 3,
                }}
              >
                <CardContent>
                  <Box sx={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
                    <Box sx={{ display: "flex", alignItems: "center", flex: 1 }}>
                      <Avatar
                        src={alert.coinImage}
                        sx={{ width: 48, height: 48, mr: 2 }}
                      />
                      <Box sx={{ flex: 1 }}>
                        <Typography variant="h6" fontWeight="600" color="white">
                          {alert.coinName}
                        </Typography>
                        <Typography variant="body2" color="text.secondary">
                          {alert.coinSymbol.toUpperCase()}
                        </Typography>
                      </Box>
                    </Box>

                    <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
                      <Box sx={{ textAlign: "right", mr: 2 }}>
                        <Chip
                          label={alert.type === "above" ? "Above" : "Below"}
                          size="small"
                          color={alert.type === "above" ? "success" : "error"}
                          sx={{ mb: 1 }}
                        />
                        <Typography variant="h6" fontWeight="600" color="white">
                          ${alert.price.toLocaleString()}
                        </Typography>
                      </Box>

                      <FormControlLabel
                        control={
                          <Switch
                            checked={alert.isActive}
                            onChange={() => toggleAlert(alert.id)}
                            sx={{
                              "& .MuiSwitch-switchBase.Mui-checked": {
                                color: "primary.main",
                              },
                              "& .MuiSwitch-switchBase.Mui-checked + .MuiSwitch-track": {
                                backgroundColor: "primary.main",
                              },
                            }}
                          />
                        }
                        label=""
                      />

                      <Tooltip title="Delete Alert">
                        <IconButton
                          size="small"
                          onClick={() => deleteAlert(alert.id)}
                          sx={{
                            color: "error.main",
                            "&:hover": {
                              bgcolor: "rgba(239, 68, 68, 0.1)",
                            },
                          }}
                        >
                          <Delete sx={{ fontSize: 20 }} />
                        </IconButton>
                      </Tooltip>
                    </Box>
                  </Box>

                  <Divider sx={{ my: 2, borderColor: "rgba(148, 163, 184, 0.1)" }} />

                  <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                    <Typography variant="caption" color="text.secondary">
                      Created: {alert.createdAt.toLocaleDateString()}
                    </Typography>
                    <Chip
                      label={alert.isActive ? "Active" : "Inactive"}
                      size="small"
                      color={alert.isActive ? "success" : "default"}
                    />
                  </Box>
                </CardContent>
              </Card>
            </Grid>
          ))}
        </Grid>
      )}

      {/* Add Alert Dialog */}
      <Dialog
        open={openAddDialog}
        onClose={handleCloseDialog}
        maxWidth="sm"
        fullWidth
        PaperProps={{
          sx: {
            background: "linear-gradient(145deg, rgba(30, 41, 59, 0.95) 0%, rgba(15, 23, 42, 0.95) 100%)",
            border: "1px solid rgba(148, 163, 184, 0.1)",
            borderRadius: 3,
          },
        }}
      >
        <DialogTitle sx={{ color: "white", fontWeight: 600 }}>
          Add Price Alert
        </DialogTitle>
        <DialogContent>
          <Box sx={{ pt: 1 }}>
            <TextField
              fullWidth
              label="Coin Name"
              value={newAlert.coinName}
              onChange={(e) => setNewAlert(prev => ({ ...prev, coinName: e.target.value }))}
              sx={{ mb: 2 }}
              InputProps={{
                sx: { color: "white" },
              }}
              InputLabelProps={{
                sx: { color: "text.secondary" },
              }}
            />
            <TextField
              fullWidth
              label="Coin Symbol"
              value={newAlert.coinSymbol}
              onChange={(e) => setNewAlert(prev => ({ ...prev, coinSymbol: e.target.value }))}
              sx={{ mb: 2 }}
              InputProps={{
                sx: { color: "white" },
              }}
              InputLabelProps={{
                sx: { color: "text.secondary" },
              }}
            />
            <TextField
              fullWidth
              label="Coin Image URL (optional)"
              value={newAlert.coinImage}
              onChange={(e) => setNewAlert(prev => ({ ...prev, coinImage: e.target.value }))}
              sx={{ mb: 2 }}
              InputProps={{
                sx: { color: "white" },
              }}
              InputLabelProps={{
                sx: { color: "text.secondary" },
              }}
            />
            <FormControl fullWidth sx={{ mb: 2 }}>
              <InputLabel sx={{ color: "text.secondary" }}>Alert Type</InputLabel>
              <Select
                value={newAlert.type}
                onChange={(e) => setNewAlert(prev => ({ ...prev, type: e.target.value as "above" | "below" }))}
                sx={{ color: "white" }}
              >
                <MenuItem value="above">Above Price</MenuItem>
                <MenuItem value="below">Below Price</MenuItem>
              </Select>
            </FormControl>
            <TextField
              fullWidth
              label="Target Price"
              type="number"
              value={newAlert.price}
              onChange={(e) => setNewAlert(prev => ({ ...prev, price: e.target.value }))}
              InputProps={{
                sx: { color: "white" },
              }}
              InputLabelProps={{
                sx: { color: "text.secondary" },
              }}
            />
          </Box>
        </DialogContent>
        <DialogActions sx={{ p: 3 }}>
          <Button onClick={handleCloseDialog} sx={{ color: "text.secondary" }}>
            Cancel
          </Button>
          <Button
            onClick={handleAddAlert}
            variant="contained"
            sx={{
              background: "linear-gradient(135deg, #00D4AA 0%, #3B82F6 100%)",
              "&:hover": {
                background: "linear-gradient(135deg, #33DDBB 0%, #60A5FA 100%)",
              },
            }}
          >
            Add Alert
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
}
