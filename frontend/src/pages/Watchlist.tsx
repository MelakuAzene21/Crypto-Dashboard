import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
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
  Alert,
} from "@mui/material";
import {
  Star,
  StarBorder,
  TrendingUp,
  TrendingDown,
  Add,
  Remove,
  Refresh,
} from "@mui/icons-material";

export default function Watchlist() {
  const [watchlist, setWatchlist] = useState<string[]>([]);
  const [watchlistCoins, setWatchlistCoins] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("md"));
  const { showNotification } = useNotification();

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
    } else {
      // Add some default coins to the watchlist for demonstration
      const defaultWatchlist = ["bitcoin", "ethereum", "cardano"];
      setWatchlist(defaultWatchlist);
      localStorage.setItem("watchlist", JSON.stringify(defaultWatchlist));
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
      // First try to get all coins from the backend
      const { data: allCoins } = await axios.get("http://localhost:5000/api/coins");
      
      // Filter to only include watchlist coins
      const watchlistData = allCoins.filter((coin: any) => 
        watchlist.includes(coin.id)
      );
      
      setWatchlistCoins(watchlistData);
      setLoading(false);
    } catch (error) {
      console.error("Error fetching watchlist coins from backend:", error);
      
      // Fallback to CoinGecko API
      try {
        const coinsData = await Promise.all(
          watchlist.map(async (coinId) => {
            try {
              const { data } = await axios.get(
                `https://api.coingecko.com/api/v3/coins/${coinId}?localization=false&tickers=false&market_data=true&community_data=false&developer_data=false&sparkline=false`
              );
              return {
                id: data.id,
                name: data.name,
                symbol: data.symbol,
                image: data.image.large,
                current_price: data.market_data.current_price.usd,
                market_cap: data.market_data.market_cap.usd,
                total_volume: data.market_data.total_volume.usd,
                price_change_percentage_24h: data.market_data.price_change_percentage_24h,
                market_cap_rank: data.market_cap_rank
              };
            } catch (error) {
              console.error(`Error fetching coin ${coinId} from CoinGecko:`, error);
              return null;
            }
          })
        );

        const validCoins = coinsData.filter(coin => coin !== null);
        setWatchlistCoins(validCoins);
        setLoading(false);
        
        if (validCoins.length > 0) {
          showNotification(`Loaded ${validCoins.length} coins from CoinGecko API`, 'info');
        }
      } catch (fallbackError) {
        console.error("Error fetching from CoinGecko fallback:", fallbackError);
        setLoading(false);
        showNotification('Failed to load watchlist data', 'error');
      }
    }
  };

  const toggleWatchlist = (coinId: string) => {
    const coin = watchlistCoins.find(c => c.id === coinId);
    const newWatchlist = watchlist.includes(coinId)
      ? watchlist.filter(id => id !== coinId)
      : [...watchlist, coinId];
    saveWatchlist(newWatchlist);
    
    if (coin) {
      if (watchlist.includes(coinId)) {
        showNotification(`${coin.name} removed from watchlist`, 'info');
      } else {
        showNotification(`${coin.name} added to watchlist`, 'success');
      }
    }
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
    const gainers = watchlistCoins.filter(coin => coin.price_change_percentage_24h > 0).length;
    const losers = watchlistCoins.filter(coin => coin.price_change_percentage_24h < 0).length;
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
          <Box sx={{ display: "flex", gap: 2 }}>
            <Button
              variant="outlined"
              startIcon={<Refresh />}
              onClick={() => {
                setLoading(true);
                fetchWatchlistCoins();
                showNotification('Watchlist refreshed', 'info');
              }}
              sx={{
                borderColor: "rgba(148, 163, 184, 0.3)",
                color: "text.secondary",
                "&:hover": {
                  borderColor: "primary.main",
                  color: "primary.main",
                },
              }}
            >
              Refresh
            </Button>
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
      {loading ? (
        <Card
          sx={{
            background: "linear-gradient(145deg, rgba(30, 41, 59, 0.8) 0%, rgba(15, 23, 42, 0.9) 100%)",
            border: "1px solid rgba(148, 163, 184, 0.1)",
            borderRadius: 3,
          }}
        >
          <CardContent sx={{ textAlign: "center", py: 8 }}>
            <Typography variant="h5" fontWeight="600" color="white" gutterBottom>
              Loading watchlist...
            </Typography>
            <Typography variant="body1" color="text.secondary">
              Fetching latest cryptocurrency data
            </Typography>
          </CardContent>
        </Card>
      ) : watchlistCoins.length === 0 ? (
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
                      label={`#${coin.market_cap_rank || 'N/A'}`}
                      size="small"
                      sx={{
                        bgcolor: "primary.main",
                        color: "white",
                        fontWeight: 600,
                        mr: 1,
                      }}
                    />
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
                      {formatPrice(coin.current_price)}
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

                  <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                    <Typography variant="caption" color="text.secondary">
                      Market Cap: {formatCurrency(coin.market_cap)}
                    </Typography>
                    <Typography variant="caption" color="text.secondary">
                      Vol: {formatCurrency(coin.total_volume)}
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
