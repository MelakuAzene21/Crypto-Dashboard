import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
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
} from "@mui/material";
import {
  Refresh,
  TrendingUp,
  TrendingDown,
  AttachMoney,
  BarChart,
  ShowChart,
  Analytics,
  Lightbulb,
  OpenInNew,
} from "@mui/icons-material";
import CoinTable from "../components/CoinTable";

interface MarketData {
  total_market_cap: number;
  total_volume: number;
  market_cap_percentage: number;
  active_cryptocurrencies: number;
}

export default function Home() {
  const [coins, setCoins] = useState<any[]>([]);
  const [marketData, setMarketData] = useState<MarketData>({
    total_market_cap: 2850000000000,
    total_volume: 89470000000,
    market_cap_percentage: 54.2,
    active_cryptocurrencies: 13847,
  });
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("md"));

  useEffect(() => {
    fetchCoins();
    const interval = setInterval(fetchCoins, 30000);
    return () => clearInterval(interval);
  }, []);

  const fetchCoins = async () => {
    try {
      const { data } = await axios.get("http://localhost:5000/api/coins");
      setCoins(data);
      setLoading(false);
    } catch (error) {
      console.error("Error fetching coins:", error);
      setLoading(false);
    }
  };

  const formatCurrency = (value: number) => {
    if (value >= 1e12) return `$${(value / 1e12).toFixed(2)}T`;
    if (value >= 1e9) return `$${(value / 1e9).toFixed(2)}B`;
    if (value >= 1e6) return `$${(value / 1e6).toFixed(2)}M`;
    return `$${value.toLocaleString()}`;
  };

  const formatPercentage = (value: number) => {
    return `${value.toFixed(2)}%`;
  };

  const getTrendingCoins = () => {
    return coins.slice(0, 8);
  };

  return (
    <Box sx={{ p: { xs: 2, md: 4 }, minHeight: "100vh" }}>
      {/* Header Section */}
      <Box sx={{ mb: 4 }}>
        <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center", mb: 1 }}>
          <Box>
            <Typography variant="h3" fontWeight="700" color="white" gutterBottom>
              Dashboard
            </Typography>
            <Typography variant="body1" color="text.secondary">
              Real-time cryptocurrency market overview
            </Typography>
          </Box>
          <Tooltip title="Refresh Data">
            <IconButton
              onClick={fetchCoins}
              sx={{
                bgcolor: "rgba(59, 130, 246, 0.1)",
                color: "primary.main",
                "&:hover": {
                  bgcolor: "rgba(59, 130, 246, 0.2)",
                },
              }}
            >
              <Refresh />
            </IconButton>
          </Tooltip>
        </Box>
      </Box>

      {/* Key Metrics Section */}
      <Grid container spacing={3} sx={{ mb: 4 }}>
        <Grid item xs={12} sm={6} md={3}>
          <Card
            sx={{
              background: "linear-gradient(135deg, rgba(16, 185, 129, 0.1) 0%, rgba(0, 212, 170, 0.1) 100%)",
              border: "1px solid rgba(16, 185, 129, 0.2)",
            }}
          >
            <CardContent>
              <Box sx={{ display: "flex", alignItems: "center", mb: 2 }}>
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
                  <AttachMoney sx={{ color: "white", fontSize: 24 }} />
                </Box>
                <Box>
                  <Typography variant="body2" color="text.secondary" fontWeight="500">
                    Total Market Cap
                  </Typography>
                  <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                    <Typography variant="h4" fontWeight="700" color="white">
                      {formatCurrency(marketData.total_market_cap)}
                    </Typography>
                    <Box sx={{ display: "flex", alignItems: "center", color: "success.main" }}>
                      <TrendingUp sx={{ fontSize: 16, mr: 0.5 }} />
                      <Typography variant="caption" fontWeight="600">
                        +2.34%
                      </Typography>
                    </Box>
                  </Box>
                </Box>
              </Box>
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12} sm={6} md={3}>
          <Card
            sx={{
              background: "linear-gradient(135deg, rgba(59, 130, 246, 0.1) 0%, rgba(96, 165, 250, 0.1) 100%)",
              border: "1px solid rgba(59, 130, 246, 0.2)",
            }}
          >
            <CardContent>
              <Box sx={{ display: "flex", alignItems: "center", mb: 2 }}>
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
                  <BarChart sx={{ color: "white", fontSize: 24 }} />
                </Box>
                <Box>
                  <Typography variant="body2" color="text.secondary" fontWeight="500">
                    24h Trading Volume
                  </Typography>
                  <Typography variant="h4" fontWeight="700" color="white">
                    {formatCurrency(marketData.total_volume)}
                  </Typography>
                </Box>
              </Box>
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12} sm={6} md={3}>
          <Card
            sx={{
              background: "linear-gradient(135deg, rgba(245, 158, 11, 0.1) 0%, rgba(251, 191, 36, 0.1) 100%)",
              border: "1px solid rgba(245, 158, 11, 0.2)",
            }}
          >
            <CardContent>
              <Box sx={{ display: "flex", alignItems: "center", mb: 2 }}>
                <Box
                  sx={{
                    width: 48,
                    height: 48,
                    borderRadius: 2,
                    background: "linear-gradient(135deg, #F59E0B 0%, #FBBF24 100%)",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    mr: 2,
                  }}
                >
                  <ShowChart sx={{ color: "white", fontSize: 24 }} />
                </Box>
                <Box>
                  <Typography variant="body2" color="text.secondary" fontWeight="500">
                    Bitcoin Dominance
                  </Typography>
                  <Typography variant="h4" fontWeight="700" color="white">
                    {formatPercentage(marketData.market_cap_percentage)}
                  </Typography>
                </Box>
              </Box>
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12} sm={6} md={3}>
          <Card
            sx={{
              background: "linear-gradient(135deg, rgba(139, 92, 246, 0.1) 0%, rgba(168, 85, 247, 0.1) 100%)",
              border: "1px solid rgba(139, 92, 246, 0.2)",
            }}
          >
            <CardContent>
              <Box sx={{ display: "flex", alignItems: "center", mb: 2 }}>
                <Box
                  sx={{
                    width: 48,
                    height: 48,
                    borderRadius: 2,
                    background: "linear-gradient(135deg, #8B5CF6 0%, #A855F7 100%)",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    mr: 2,
                  }}
                >
                  <Analytics sx={{ color: "white", fontSize: 24 }} />
                </Box>
                <Box>
                  <Typography variant="body2" color="text.secondary" fontWeight="500">
                    Active Cryptocurrencies
                  </Typography>
                  <Typography variant="h4" fontWeight="700" color="white">
                    {marketData.active_cryptocurrencies.toLocaleString()}
                  </Typography>
                </Box>
              </Box>
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      {/* Trending Now Section */}
      <Box sx={{ mb: 4 }}>
        <Box sx={{ display: "flex", alignItems: "center", mb: 3 }}>
          <Box
            sx={{
              width: 40,
              height: 40,
              borderRadius: 2,
              background: "linear-gradient(135deg, #F59E0B 0%, #FBBF24 100%)",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              mr: 2,
            }}
          >
            <Lightbulb sx={{ color: "white", fontSize: 20 }} />
          </Box>
          <Typography variant="h5" fontWeight="600" color="white">
            Trending Now
          </Typography>
        </Box>

        <Grid container spacing={2}>
          {getTrendingCoins().map((coin, index) => (
            <Grid item xs={12} sm={6} md={3} key={coin.id}>
              <Card
                sx={{
                  cursor: "pointer",
                  transition: "all 0.3s ease",
                  "&:hover": {
                    transform: "translateY(-4px)",
                    boxShadow: "0 8px 25px rgba(0, 0, 0, 0.4)",
                  },
                }}
                onClick={() => navigate(`/coin/${coin.id}`)}
              >
                <CardContent>
                  <Box sx={{ display: "flex", alignItems: "center", mb: 2 }}>
                    <Chip
                      label={`#${index + 1}`}
                      size="small"
                      sx={{
                        bgcolor: "warning.main",
                        color: "white",
                        fontWeight: 600,
                        mr: 1,
                      }}
                    />
                    <Box
                      sx={{
                        width: 32,
                        height: 32,
                        borderRadius: 1,
                        background: "linear-gradient(135deg, #F59E0B 0%, #FBBF24 100%)",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        mr: 1,
                      }}
                    >
                      <ShowChart sx={{ color: "white", fontSize: 16 }} />
                    </Box>
                    <Avatar
                      src={coin.image}
                      sx={{ width: 32, height: 32, mr: 1 }}
                    />
                    <Box sx={{ flexGrow: 1 }}>
                      <Typography variant="subtitle2" fontWeight="600" color="white">
                        {coin.name}
                      </Typography>
                      <Typography variant="caption" color="text.secondary">
                        {coin.symbol.toUpperCase()}
                      </Typography>
                    </Box>
                    <IconButton size="small" sx={{ color: "text.secondary" }}>
                      <OpenInNew sx={{ fontSize: 16 }} />
                    </IconButton>
                  </Box>

                  <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                    <Box>
                      <Typography variant="h6" fontWeight="700" color="white">
                        ${coin.current_price.toLocaleString()}
                      </Typography>
                      <Box sx={{ display: "flex", alignItems: "center", gap: 0.5 }}>
                        {coin.price_change_percentage_24h >= 0 ? (
                          <TrendingUp sx={{ color: "success.main", fontSize: 16 }} />
                        ) : (
                          <TrendingDown sx={{ color: "error.main", fontSize: 16 }} />
                        )}
                        <Typography
                          variant="caption"
                          fontWeight="600"
                          color={coin.price_change_percentage_24h >= 0 ? "success.main" : "error.main"}
                        >
                          {coin.price_change_percentage_24h.toFixed(2)}%
                        </Typography>
                      </Box>
                    </Box>
                    <Typography variant="caption" color="text.secondary">
                      Market Cap Rank #{coin.market_cap_rank}
                    </Typography>
                  </Box>
                </CardContent>
              </Card>
            </Grid>
          ))}
        </Grid>
      </Box>

      {/* All Markets Table */}
      <Box>
        <Typography variant="h5" fontWeight="600" color="white" sx={{ mb: 3 }}>
          All Markets
        </Typography>
        <CoinTable coins={coins} loading={loading} />
      </Box>
    </Box>
  );
}
