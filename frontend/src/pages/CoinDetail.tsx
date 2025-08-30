// frontend/src/pages/CoinDetail.tsx
import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";
import {
  Box,
  Typography,
  Paper,
  Grid,
  Chip,
  Card,
  CardContent,
  useTheme,
  useMediaQuery,
  alpha,
} from "@mui/material";
import {
  TrendingUp,
  TrendingDown,
  ShowChart,
  AttachMoney,
  BarChart,
} from "@mui/icons-material";
import CoinChart from "../components/CoinChart";
import Navbar from "../components/Navbar";

export default function CoinDetail() {
  const { id } = useParams<{ id: string }>();
  const [coin, setCoin] = useState<any>(null);
  const [history, setHistory] = useState<{ prices: [number, number][] }>({
    prices: [],
  });
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("md"));

  useEffect(() => {
    fetchCoinDetails();
    fetchCoinHistory();
    const interval = setInterval(() => {
      fetchCoinDetails();
      fetchCoinHistory();
    }, 30000);
    return () => clearInterval(interval);
  }, [id]);

  const fetchCoinDetails = async () => {
    try {
      const { data } = await axios.get(`http://localhost:5000/api/coin/${id}`);
      setCoin(data);
    } catch (error) {
      console.error("Error fetching coin details:", error);
    }
  };

  const fetchCoinHistory = async () => {
    try {
      const { data } = await axios.get(
        `http://localhost:5000/api/coin/${id}/history?days=30`
      );
      setHistory(data);
    } catch (error) {
      console.error("Error fetching coin history:", error);
    }
  };

  if (!coin)
    return (
      <Box
        sx={{
          bgcolor: "background.default",
          minHeight: "100vh",
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
        }}
      >
        <Typography>Loading...</Typography>
      </Box>
    );

  const priceChange = coin.market_data.price_change_percentage_24h;
  const isPositive = priceChange >= 0;

  return (
    <Box
      sx={{
        bgcolor: "background.default",
        minHeight: "100vh",
        p: { xs: 1, md: 3 },
      }}
    >
      <Navbar />
      <Paper
        elevation={0}
        sx={{
          p: 3,
          mt: 2,
          borderRadius: "16px",
          background: `linear-gradient(145deg, ${alpha(
            theme.palette.background.paper,
            0.95
          )} 0%, ${alpha(theme.palette.background.paper, 0.98)} 100%)`,
          backdropFilter: "blur(10px)",
          border: "1px solid",
          borderColor: "divider",
        }}
      >
        <Grid container spacing={3}>
          {/* Coin Header Section */}
          <Grid item xs={12}>
            <Box display="flex" alignItems="center" mb={2} flexWrap="wrap">
              <img
                src={coin.image.large}
                alt={coin.name}
                width={isMobile ? 40 : 60}
                height={isMobile ? 40 : 60}
                style={{ marginRight: 16, borderRadius: "50%" }}
              />
              <Box>
                <Typography variant="h4" fontWeight="700">
                  {coin.name} ({coin.symbol.toUpperCase()})
                </Typography>
                <Box display="flex" alignItems="center" mt={0.5}>
                  <Chip
                    label={`Rank: #${
                      coin.market_data.market_cap_rank || coin.market_cap_rank
                    }`}
                    color="primary"
                    size="small"
                    sx={{ mr: 1 }}
                  />
                  <Box
                    display="flex"
                    alignItems="center"
                    color={isPositive ? "success.main" : "error.main"}
                  >
                    {isPositive ? (
                      <TrendingUp sx={{ fontSize: 20, mr: 0.5 }} />
                    ) : (
                      <TrendingDown sx={{ fontSize: 20, mr: 0.5 }} />
                    )}
                    <Typography variant="body2" fontWeight="500">
                      {priceChange.toFixed(2)}%
                    </Typography>
                  </Box>
                </Box>
              </Box>
            </Box>
          </Grid>

          {/* Price and Stats Section */}
          <Grid item xs={12} md={6}>
            <Grid container spacing={2}>
              <Grid item xs={12}>
                <Card
                  sx={{
                    bgcolor: "background.paper",
                    borderRadius: "12px",
                    boxShadow: "0 4px 20px rgba(0,0,0,0.05)",
                  }}
                >
                  <CardContent>
                    <Box display="flex" alignItems="center" mb={1}>
                      <AttachMoney
                        sx={{ color: "primary.main", mr: 1, fontSize: 24 }}
                      />
                      <Typography variant="h6" color="textSecondary">
                        Current Price
                      </Typography>
                    </Box>
                    <Typography variant="h4" fontWeight="700">
                      ${coin.market_data.current_price.usd.toLocaleString()}
                    </Typography>
                  </CardContent>
                </Card>
              </Grid>

              <Grid item xs={6}>
                <Card
                  sx={{
                    bgcolor: "background.paper",
                    borderRadius: "12px",
                    height: "100%",
                    boxShadow: "0 4px 20px rgba(0,0,0,0.05)",
                  }}
                >
                  <CardContent>
                    <Typography
                      variant="body2"
                      color="textSecondary"
                      gutterBottom
                    >
                      Market Cap
                    </Typography>
                    <Typography variant="h6" fontWeight="600">
                      ${coin.market_data.market_cap.usd.toLocaleString()}
                    </Typography>
                  </CardContent>
                </Card>
              </Grid>

              <Grid item xs={6}>
                <Card
                  sx={{
                    bgcolor: "background.paper",
                    borderRadius: "12px",
                    height: "100%",
                    boxShadow: "0 4px 20px rgba(0,0,0,0.05)",
                  }}
                >
                  <CardContent>
                    <Typography
                      variant="body2"
                      color="textSecondary"
                      gutterBottom
                    >
                      24h Volume
                    </Typography>
                    <Typography variant="h6" fontWeight="600">
                      ${coin.market_data.total_volume.usd.toLocaleString()}
                    </Typography>
                  </CardContent>
                </Card>
              </Grid>

              <Grid item xs={6}>
                <Card
                  sx={{
                    bgcolor: "background.paper",
                    borderRadius: "12px",
                    height: "100%",
                    boxShadow: "0 4px 20px rgba(0,0,0,0.05)",
                  }}
                >
                  <CardContent>
                    <Typography
                      variant="body2"
                      color="textSecondary"
                      gutterBottom
                    >
                      24h High
                    </Typography>
                    <Typography
                      variant="h6"
                      fontWeight="600"
                      color="success.main"
                    >
                      ${coin.market_data.high_24h.usd.toLocaleString()}
                    </Typography>
                  </CardContent>
                </Card>
              </Grid>

              <Grid item xs={6}>
                <Card
                  sx={{
                    bgcolor: "background.paper",
                    borderRadius: "12px",
                    height: "100%",
                    boxShadow: "0 4px 20px rgba(0,0,0,0.05)",
                  }}
                >
                  <CardContent>
                    <Typography
                      variant="body2"
                      color="textSecondary"
                      gutterBottom
                    >
                      24h Low
                    </Typography>
                    <Typography
                      variant="h6"
                      fontWeight="600"
                      color="error.main"
                    >
                      ${coin.market_data.low_24h.usd.toLocaleString()}
                    </Typography>
                  </CardContent>
                </Card>
              </Grid>

              <Grid item xs={12}>
                <Card
                  sx={{
                    bgcolor: "background.paper",
                    borderRadius: "12px",
                    boxShadow: "0 4px 20px rgba(0,0,0,0.05)",
                  }}
                >
                  <CardContent>
                    <Box display="flex" alignItems="center" mb={1}>
                      <BarChart
                        sx={{ color: "primary.main", mr: 1, fontSize: 24 }}
                      />
                      <Typography variant="h6" color="textSecondary">
                        All-Time High
                      </Typography>
                    </Box>
                    <Typography variant="h6" fontWeight="600">
                      ${coin.market_data.ath.usd.toLocaleString()}
                    </Typography>
                    <Typography variant="body2" color="textSecondary">
                      {new Date(
                        coin.market_data.ath_date.usd
                      ).toLocaleDateString()}
                    </Typography>
                  </CardContent>
                </Card>
              </Grid>
            </Grid>
          </Grid>

          {/* Chart Section */}
          <Grid item xs={12} md={6}>
            <Card
              sx={{
                bgcolor: "background.paper",
                borderRadius: "12px",
                height: "100%",
                boxShadow: "0 4px 20px rgba(0,0,0,0.05)",
                display: "flex",
                flexDirection: "column",
              }}
            >
              <CardContent sx={{ flexGrow: 1 }}>
                <Box display="flex" alignItems="center" mb={2}>
                  <ShowChart
                    sx={{ color: "primary.main", mr: 1, fontSize: 24 }}
                  />
                  <Typography variant="h6" color="textSecondary">
                    {coin.name} 30-Day Price Chart
                  </Typography>
                </Box>
                <Box sx={{ height: isMobile ? "300px" : "400px" }}>
                  <CoinChart
                    prices={history.prices.map((p) => p[1])}
                    title=""
                    isPositive={isPositive}
                  />
                </Box>
              </CardContent>
            </Card>
          </Grid>
        </Grid>
      </Paper>
    </Box>
  );
}
