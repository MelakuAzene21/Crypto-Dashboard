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
  Alert,
} from "@mui/material";
import {
  Star,
  StarBorder,
  TrendingUp,
  TrendingDown,
  Add,
  Remove,
} from "@mui/icons-material";

export default function Watchlist() {
  const [watchlist, setWatchlist] = useState<string[]>([]);
  const [watchlistCoins, setWatchlistCoins] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("md"));

  useEffect(() => {
    loadWatchlist();
    fetchWatchlistCoins();
    const interval = setInterval(fetchWatchlistCoins, 30000);
    return () => clearInterval(interval);
  }, [watchlist]);

  const loadWatchlist = () => {
    const saved = localStorage.getItem("watchlist");
    if (saved) {
      setWatchlist(JSON.parse(saved));
    }
  };

  const saveWatchlist = (newWatchlist: string[]) => {
    localStorage.setItem("watchlist", JSON.stringify(newWatchlist));
    setWatchlist(newWatchlist);
  };

  const fetchWatchlistCoins = async () => {
    if (watchlist.length === 0) {
      setWatchlistCoins([]);
      setLoading(false);
      return;
    }

    try {
      const coinsData = await Promise.all(
        watchlist.map(async (coinId) => {
          try {
            const { data } = await axios.get(`http://localhost:5000/api/coin/${coinId}`);
            return data;
          } catch (error) {
            console.error(`Error fetching coin ${coinId}:`, error);
            return null;
          }
        })
      );

      setWatchlistCoins(coinsData.filter(coin => coin !== null));
      setLoading(false);
    } catch (error) {
      console.error("Error fetching watchlist coins:", error);
      setLoading(false);
    }
  };

  const toggleWatchlist = (coinId: string) => {
    const newWatchlist = watchlist.includes(coinId)
      ? watchlist.filter(id => id !== coinId)
      : [...watchlist, coinId];
    saveWatchlist(newWatchlist);
  };

  const formatCurrency = (value: number) => {
    if (value >= 1e12) return `$${(value / 1e12).toFixed(2)}T`;
    if (value >= 1e9) return `$${(value / 1e9).toFixed(2)}B`;
    if (value >= 1e6) return `$${(value / 1e6).toFixed(2)}M`;
    return `$${value.toLocaleString()}`;
  };

  const formatPrice = (price: number) => {
    if (price >= 1000) return `$${price.toLocaleString()}`;
    if (price >= 1) return `$${price.toFixed(2)}`;
    return `$${price.toFixed(4)}`;
  };

  const getWatchlistStats = () => {
    const gainers = watchlistCoins.filter(coin => coin.market_data.price_change_percentage_24h > 0).length;
    const losers = watchlistCoins.filter(coin => coin.market_data.price_change_percentage_24h < 0).length;
    return { gainers, losers };
  };

  const stats = getWatchlistStats();

  return (
    <Box sx={{ p: { xs: 2, md: 4 }, minHeight: "100vh" }}>
      {/* Header Section */}
      <Box sx={{ mb: 4 }}>
        <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center", mb: 1 }}>
          <Box>
            <Typography variant="h3" fontWeight="700" color="white" gutterBottom>
              Watchlist
            </Typography>
            <Typography variant="body1" color="text.secondary">
              Track your favorite cryptocurrencies
            </Typography>
          </Box>
          <Button
            variant="contained"
            startIcon={<Add />}
            onClick={() => navigate("/markets")}
            sx={{
              background: "linear-gradient(135deg, #00D4AA 0%, #3B82F6 100%)",
              "&:hover": {
                background: "linear-gradient(135deg, #33DDBB 0%, #60A5FA 100%)",
              },
            }}
          >
            Add Coins
          </Button>
        </Box>
      </Box>

      {/* Watchlist Stats */}
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
                  <Star sx={{ color: "white", fontSize: 24 }} />
                </Box>
                <Box>
                  <Typography variant="body2" color="text.secondary" fontWeight="500">
                    Total Watchlist
                  </Typography>
                  <Typography variant="h4" fontWeight="700" color="white">
                    {watchlistCoins.length}
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
                    24h Gainers
                  </Typography>
                  <Typography variant="h4" fontWeight="700" color="white">
                    {stats.gainers}
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
                    24h Losers
                  </Typography>
                  <Typography variant="h4" fontWeight="700" color="white">
                    {stats.losers}
                  </Typography>
                </Box>
              </Box>
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      {/* Watchlist Content */}
      {watchlistCoins.length === 0 ? (
        <Card
          sx={{
            background: "linear-gradient(145deg, rgba(30, 41, 59, 0.8) 0%, rgba(15, 23, 42, 0.9) 100%)",
            border: "1px solid rgba(148, 163, 184, 0.1)",
            borderRadius: 3,
          }}
        >
          <CardContent sx={{ textAlign: "center", py: 8 }}>
            <Star sx={{ fontSize: 64, color: "text.secondary", mb: 2 }} />
            <Typography variant="h5" fontWeight="600" color="white" gutterBottom>
              Your watchlist is empty
            </Typography>
            <Typography variant="body1" color="text.secondary" sx={{ mb: 3 }}>
              Start adding cryptocurrencies to your watchlist to track their performance
            </Typography>
            <Button
              variant="contained"
              startIcon={<Add />}
              onClick={() => navigate("/markets")}
              sx={{
                background: "linear-gradient(135deg, #00D4AA 0%, #3B82F6 100%)",
                "&:hover": {
                  background: "linear-gradient(135deg, #33DDBB 0%, #60A5FA 100%)",
                },
              }}
            >
              Browse Markets
            </Button>
          </CardContent>
        </Card>
      ) : (
        <Grid container spacing={2}>
          {watchlistCoins.map((coin) => (
            <Grid item xs={12} sm={6} md={4} lg={3} key={coin.id}>
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
                      label={`#${coin.market_data.market_cap_rank}`}
                      size="small"
                      sx={{
                        bgcolor: "primary.main",
                        color: "white",
                        fontWeight: 600,
                        mr: 1,
                      }}
                    />
                    <Avatar
                      src={coin.image.large}
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
                    <Tooltip title="Remove from watchlist">
                      <IconButton
                        size="small"
                        onClick={(e) => {
                          e.stopPropagation();
                          toggleWatchlist(coin.id);
                        }}
                        sx={{
                          color: "warning.main",
                          "&:hover": {
                            bgcolor: "rgba(245, 158, 11, 0.1)",
                          },
                        }}
                      >
                        <Star sx={{ fontSize: 20 }} />
                      </IconButton>
                    </Tooltip>
                  </Box>

                  <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center", mb: 1 }}>
                    <Typography variant="h6" fontWeight="700" color="white">
                      {formatPrice(coin.market_data.current_price.usd)}
                    </Typography>
                    <Box sx={{ display: "flex", alignItems: "center", gap: 0.5 }}>
                      {coin.market_data.price_change_percentage_24h >= 0 ? (
                        <TrendingUp sx={{ color: "success.main", fontSize: 16 }} />
                      ) : (
                        <TrendingDown sx={{ color: "error.main", fontSize: 16 }} />
                      )}
                      <Typography
                        variant="caption"
                        fontWeight="600"
                        color={coin.market_data.price_change_percentage_24h >= 0 ? "success.main" : "error.main"}
                      >
                        {coin.market_data.price_change_percentage_24h.toFixed(2)}%
                      </Typography>
                    </Box>
                  </Box>

                  <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                    <Typography variant="caption" color="text.secondary">
                      Market Cap: {formatCurrency(coin.market_data.market_cap.usd)}
                    </Typography>
                    <Typography variant="caption" color="text.secondary">
                      Vol: {formatCurrency(coin.market_data.total_volume.usd)}
                    </Typography>
                  </Box>
                </CardContent>
              </Card>
            </Grid>
          ))}
        </Grid>
      )}
    </Box>
  );
}
