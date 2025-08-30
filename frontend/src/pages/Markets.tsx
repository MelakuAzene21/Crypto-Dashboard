import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import {
  Box,
  Typography,
  Grid,
  Card,
  CardContent,
  TextField,
  InputAdornment,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
  Chip,
  Avatar,
  useTheme,
  useMediaQuery,
  IconButton,
  Tooltip,
} from "@mui/material";
import {
  Search,
  TrendingUp,
  TrendingDown,
  Refresh,
  BarChart,
  ShowChart,
  Analytics,
  Star,
  StarBorder,
} from "@mui/icons-material";

export default function Markets() {
  const [coins, setCoins] = useState<any[]>([]);
  const [filteredCoins, setFilteredCoins] = useState<any[]>([]);
  const [search, setSearch] = useState("");
  const [sortBy, setSortBy] = useState("market_cap");
  const [loading, setLoading] = useState(true);
  const [watchlist, setWatchlist] = useState<string[]>([]);
  const navigate = useNavigate();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("md"));

  useEffect(() => {
    fetchCoins();
    loadWatchlist();
    const interval = setInterval(fetchCoins, 30000);
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    filterAndSortCoins();
  }, [coins, search, sortBy]);

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

  const filterAndSortCoins = () => {
    let filtered = coins.filter(
      (coin) =>
        coin.name.toLowerCase().includes(search.toLowerCase()) ||
        coin.symbol.toLowerCase().includes(search.toLowerCase())
    );

    // Sort coins
    filtered.sort((a, b) => {
      switch (sortBy) {
        case "market_cap":
          return b.market_cap - a.market_cap;
        case "price":
          return b.current_price - a.current_price;
        case "volume":
          return b.total_volume - a.total_volume;
        case "change":
          return b.price_change_percentage_24h - a.price_change_percentage_24h;
        default:
          return b.market_cap - a.market_cap;
      }
    });

    setFilteredCoins(filtered);
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

  const getMarketStats = () => {
    const gainers = coins.filter(coin => coin.price_change_percentage_24h > 0).length;
    const losers = coins.filter(coin => coin.price_change_percentage_24h < 0).length;
    return { gainers, losers };
  };

  const loadWatchlist = () => {
    const saved = localStorage.getItem("watchlist");
    if (saved) {
      setWatchlist(JSON.parse(saved));
    }
  };

  const toggleWatchlist = (coinId: string) => {
    const newWatchlist = watchlist.includes(coinId)
      ? watchlist.filter(id => id !== coinId)
      : [...watchlist, coinId];
    localStorage.setItem("watchlist", JSON.stringify(newWatchlist));
    setWatchlist(newWatchlist);
  };

  const stats = getMarketStats();

  return (
    <Box sx={{ p: { xs: 2, md: 4 }, minHeight: "100vh" }}>
      {/* Header Section */}
      <Box sx={{ mb: 4 }}>
        <Typography variant="h3" fontWeight="700" color="white" gutterBottom>
          Markets
        </Typography>
        <Typography variant="body1" color="text.secondary">
          Explore all cryptocurrency markets
        </Typography>
      </Box>

      {/* Market Overview Cards */}
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
                  <BarChart sx={{ color: "white", fontSize: 24 }} />
                </Box>
                <Box>
                  <Typography variant="body2" color="text.secondary" fontWeight="500">
                    Total Markets
                  </Typography>
                  <Typography variant="h4" fontWeight="700" color="white">
                    {coins.length}
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

      {/* Search and Filter Section */}
      <Box sx={{ mb: 4 }}>
        <Grid container spacing={2} alignItems="center">
          <Grid item xs={12} md={6}>
            <TextField
              fullWidth
              placeholder="Search cryptocurrencies..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <Search sx={{ color: "text.secondary" }} />
                  </InputAdornment>
                ),
              }}
              sx={{
                "& .MuiOutlinedInput-root": {
                  borderRadius: 3,
                  bgcolor: "rgba(30, 41, 59, 0.5)",
                  border: "1px solid rgba(148, 163, 184, 0.1)",
                  "&:hover": {
                    border: "1px solid rgba(59, 130, 246, 0.3)",
                  },
                  "&.Mui-focused": {
                    border: "1px solid rgba(59, 130, 246, 0.5)",
                  },
                },
                "& .MuiInputBase-input": {
                  color: "white",
                },
                "& .MuiInputLabel-root": {
                  color: "text.secondary",
                },
              }}
            />
          </Grid>
          <Grid item xs={12} md={3}>
            <FormControl fullWidth>
              <InputLabel sx={{ color: "text.secondary" }}>All Coins</InputLabel>
              <Select
                value="all"
                label="All Coins"
                sx={{
                  borderRadius: 3,
                  bgcolor: "rgba(30, 41, 59, 0.5)",
                  border: "1px solid rgba(148, 163, 184, 0.1)",
                  color: "white",
                  "& .MuiOutlinedInput-notchedOutline": {
                    border: "none",
                  },
                }}
              >
                <MenuItem value="all">All Coins</MenuItem>
                <MenuItem value="top100">Top 100</MenuItem>
                <MenuItem value="top50">Top 50</MenuItem>
              </Select>
            </FormControl>
          </Grid>
          <Grid item xs={12} md={3}>
            <FormControl fullWidth>
              <InputLabel sx={{ color: "text.secondary" }}>Sort By</InputLabel>
              <Select
                value={sortBy}
                label="Sort By"
                onChange={(e) => setSortBy(e.target.value)}
                sx={{
                  borderRadius: 3,
                  bgcolor: "rgba(30, 41, 59, 0.5)",
                  border: "1px solid rgba(148, 163, 184, 0.1)",
                  color: "white",
                  "& .MuiOutlinedInput-notchedOutline": {
                    border: "none",
                  },
                }}
              >
                <MenuItem value="market_cap">Market Cap</MenuItem>
                <MenuItem value="price">Price</MenuItem>
                <MenuItem value="volume">Volume</MenuItem>
                <MenuItem value="change">24h Change</MenuItem>
              </Select>
            </FormControl>
          </Grid>
        </Grid>
      </Box>

      {/* Markets Grid */}
      <Grid container spacing={2}>
        {filteredCoins.map((coin) => (
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
                    label={`#${coin.market_cap_rank}`}
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
                  <Tooltip title={watchlist.includes(coin.id) ? "Remove from watchlist" : "Add to watchlist"}>
                    <IconButton
                      size="small"
                      onClick={(e) => {
                        e.stopPropagation();
                        toggleWatchlist(coin.id);
                      }}
                      sx={{
                        color: watchlist.includes(coin.id) ? "warning.main" : "text.secondary",
                        "&:hover": {
                          bgcolor: watchlist.includes(coin.id) ? "rgba(245, 158, 11, 0.1)" : "rgba(148, 163, 184, 0.1)",
                        },
                      }}
                    >
                      {watchlist.includes(coin.id) ? (
                        <Star sx={{ fontSize: 16 }} />
                      ) : (
                        <StarBorder sx={{ fontSize: 16 }} />
                      )}
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
    </Box>
  );
}
