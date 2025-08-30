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
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Avatar,
  useTheme,
  useMediaQuery,
  CircularProgress,
  Skeleton,
} from "@mui/material";
import {
  Add,
  TrendingUp,
  TrendingDown,
  AccountBalanceWallet,
  Schedule,
  EmojiEvents, // Replaced Target with EmojiEvents
} from "@mui/icons-material";

interface PortfolioItem {
  coinId: string;
  quantity: number;
  buyPrice: number;
  coin: any;
}

export default function Portfolio() {
  const [portfolio, setPortfolio] = useState<PortfolioItem[]>([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("md"));

  useEffect(() => {
    fetchPortfolio();
    const interval = setInterval(fetchPortfolio, 30000);
    return () => clearInterval(interval);
  }, []);

  const fetchPortfolio = async () => {
    try {
      setLoading(true);
      const { data } = await axios.get("http://localhost:5000/api/portfolio");
      
      // Fetch current coin data for each portfolio item
      const portfolioWithCoins = await Promise.all(
        data.map(async (item: any) => {
          try {
            const coinResponse = await axios.get(`http://localhost:5000/api/coin/${item.coinId}`);
            return {
              ...item,
              coin: coinResponse.data,
            };
          } catch (error) {
            console.error(`Error fetching coin ${item.coinId}:`, error);
            return item;
          }
        })
      );
      
      setPortfolio(portfolioWithCoins);
      setLoading(false);
    } catch (error) {
      console.error("Error fetching portfolio:", error);
      setLoading(false);
    }
  };

  const calculatePortfolioStats = () => {
    let totalValue = 0;
    let totalCost = 0;
    let bestPerformer = { symbol: "N/A", percentage: 0 };

    portfolio.forEach((item) => {
      if (item.coin) {
        const currentValue = item.quantity * item.coin.market_data.current_price.usd;
        const costBasis = item.quantity * item.buyPrice;
        totalValue += currentValue;
        totalCost += costBasis;

        const percentage = ((currentValue - costBasis) / costBasis) * 100;
        if (percentage > bestPerformer.percentage) {
          bestPerformer = {
            symbol: item.coin.symbol.toUpperCase(),
            percentage: percentage,
          };
        }
      }
    });

    const totalPnL = totalValue - totalCost;
    const totalPnLPercentage = totalCost > 0 ? (totalPnL / totalCost) * 100 : 0;

    return {
      totalValue,
      totalPnL,
      totalPnLPercentage,
      assetCount: portfolio.length,
      bestPerformer,
    };
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

  const stats = calculatePortfolioStats();

  // Skeleton loader for cards
  const CardSkeleton = () => (
    <Card sx={{ height: "100%" }}>
      <CardContent>
        <Box sx={{ display: "flex", alignItems: "center" }}>
          <Skeleton variant="circular" width={48} height={48} sx={{ mr: 2 }} />
          <Box sx={{ width: "100%" }}>
            <Skeleton variant="text" width="60%" height={24} />
            <Skeleton variant="text" width="40%" height={32} />
          </Box>
        </Box>
      </CardContent>
    </Card>
  );

  // Skeleton loader for table rows
  const TableRowSkeleton = () => (
    <TableRow>
      <TableCell><Skeleton variant="text" /></TableCell>
      <TableCell><Skeleton variant="text" /></TableCell>
      <TableCell><Skeleton variant="text" /></TableCell>
      <TableCell><Skeleton variant="text" /></TableCell>
      <TableCell><Skeleton variant="text" /></TableCell>
      <TableCell><Skeleton variant="text" /></TableCell>
    </TableRow>
  );

  return (
    <Box sx={{ p: { xs: 2, md: 4 }, minHeight: "100vh" }}>
      {/* Header Section */}
      <Box sx={{ mb: 4 }}>
        <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center", mb: 1 }}>
          <Box>
            <Typography variant="h3" fontWeight="700" color="white" gutterBottom>
              Portfolio
            </Typography>
            <Typography variant="body1" color="text.secondary">
              Track your cryptocurrency investments
            </Typography>
          </Box>
          <Button
            variant="contained"
            startIcon={<Add />}
            sx={{
              background: "linear-gradient(135deg, #00D4AA 0%, #3B82F6 100%)",
              "&:hover": {
                background: "linear-gradient(135deg, #33DDBB 0%, #60A5FA 100%)",
              },
            }}
          >
            Add Trade
          </Button>
        </Box>
      </Box>

      {/* Loading Overlay */}
      {loading && (
        <Box
          sx={{
            position: "fixed",
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            backgroundColor: "rgba(0, 0, 0, 0.7)",
            zIndex: 9999,
          }}
        >
          <Box
            sx={{
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              gap: 2,
            }}
          >
            <CircularProgress 
              size={60} 
              thickness={4}
              sx={{ 
                color: "primary.main",
              }} 
            />
            <Typography variant="h6" color="white">
              Loading your portfolio...
            </Typography>
          </Box>
        </Box>
      )}

      {/* Portfolio Overview Cards */}
      <Grid container spacing={3} sx={{ mb: 4 }}>
        <Grid item xs={12} sm={6} md={3}>
          {loading ? (
            <CardSkeleton />
          ) : (
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
                    <AccountBalanceWallet sx={{ color: "white", fontSize: 24 }} />
                  </Box>
                  <Box>
                    <Typography variant="body2" color="text.secondary" fontWeight="500">
                      Total Portfolio Value
                    </Typography>
                    <Typography variant="h4" fontWeight="700" color="white">
                      {formatCurrency(stats.totalValue)}
                    </Typography>
                  </Box>
                </Box>
              </CardContent>
            </Card>
          )}
        </Grid>

        <Grid item xs={12} sm={6} md={3}>
          {loading ? (
            <CardSkeleton />
          ) : (
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
                      Total P&L
                    </Typography>
                    <Typography variant="h4" fontWeight="700" color="white">
                      {formatCurrency(stats.totalPnL)}
                    </Typography>
                    <Typography
                      variant="caption"
                      fontWeight="600"
                      color={stats.totalPnLPercentage >= 0 ? "success.main" : "error.main"}
                    >
                      {stats.totalPnLPercentage >= 0 ? "+" : ""}{stats.totalPnLPercentage.toFixed(2)}%
                    </Typography>
                  </Box>
                </Box>
              </CardContent>
            </Card>
          )}
        </Grid>

        <Grid item xs={12} sm={6} md={3}>
          {loading ? (
            <CardSkeleton />
          ) : (
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
                    <Schedule sx={{ color: "white", fontSize: 24 }} />
                  </Box>
                  <Box>
                    <Typography variant="body2" color="text.secondary" fontWeight="500">
                      Assets
                    </Typography>
                    <Typography variant="h4" fontWeight="700" color="white">
                      {stats.assetCount}
                    </Typography>
                  </Box>
                </Box>
              </CardContent>
            </Card>
          )}
        </Grid>

        <Grid item xs={12} sm={6} md={3}>
          {loading ? (
            <CardSkeleton />
          ) : (
            <Card
              sx={{
                background: "linear-gradient(135deg, rgba(139, 92, 246, 0.1) 0%, rgba(168, 85, 247, 0.1) 100%)",
                border: "1px solid rgba(139, 92, 246, 0.2)",
              }}
            >
              <CardContent>
                <Box sx={{ display: "flex", alignItems: "center" }}>
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
                    <EmojiEvents sx={{ color: "white", fontSize: 24 }} />
                  </Box>
                  <Box>
                    <Typography variant="body2" color="text.secondary" fontWeight="500">
                      Best Performer
                    </Typography>
                    <Typography variant="h4" fontWeight="700" color="white">
                      {stats.bestPerformer.symbol}
                    </Typography>
                    <Typography
                      variant="caption"
                      fontWeight="600"
                      color="success.main"
                    >
                      +{stats.bestPerformer.percentage.toFixed(2)}%
                    </Typography>
                  </Box>
                </Box>
              </CardContent>
            </Card>
          )}
        </Grid>
      </Grid>

      {/* Holdings Section */}
      <Box>
        <Typography variant="h5" fontWeight="600" color="white" sx={{ mb: 3 }}>
          Holdings
        </Typography>
        
        <TableContainer component={Paper} sx={{ borderRadius: 3, overflow: "hidden" }}>
          <Table>
            <TableHead>
              <TableRow sx={{ bgcolor: "rgba(30, 41, 59, 0.5)" }}>
                <TableCell sx={{ borderBottom: "1px solid rgba(148, 163, 184, 0.1)" }}>
                  <Typography variant="subtitle2" fontWeight="600" color="text.secondary">
                    Asset
                  </Typography>
                </TableCell>
                <TableCell sx={{ borderBottom: "1px solid rgba(148, 163, 184, 0.1)" }}>
                  <Typography variant="subtitle2" fontWeight="600" color="text.secondary">
                    Amount
                  </Typography>
                </TableCell>
                <TableCell sx={{ borderBottom: "1px solid rgba(148, 163, 184, 0.1)" }}>
                  <Typography variant="subtitle2" fontWeight="600" color="text.secondary">
                    Avg. Buy Price
                  </Typography>
                </TableCell>
                <TableCell sx={{ borderBottom: "1px solid rgba(148, 163, 184, 0.1)" }}>
                  <Typography variant="subtitle2" fontWeight="600" color="text.secondary">
                    Current Price
                  </Typography>
                </TableCell>
                <TableCell sx={{ borderBottom: "1px solid rgba(148, 163, 184, 0.1)" }}>
                  <Typography variant="subtitle2" fontWeight="600" color="text.secondary">
                    Value
                  </Typography>
                </TableCell>
                <TableCell sx={{ borderBottom: "1px solid rgba(148, 163, 184, 0.1)" }}>
                  <Typography variant="subtitle2" fontWeight="600" color="text.secondary">
                    P&L
                  </Typography>
                </TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {loading ? (
                Array.from({ length: 5 }).map((_, index) => (
                  <TableRowSkeleton key={index} />
                ))
              ) : portfolio.length > 0 ? (
                portfolio.map((item) => {
                  if (!item.coin) return null;
                  
                  const currentValue = item.quantity * item.coin.market_data.current_price.usd;
                  const costBasis = item.quantity * item.buyPrice;
                  const pnl = currentValue - costBasis;
                  const pnlPercentage = (pnl / costBasis) * 100;

                  return (
                    <TableRow
                      key={item.coinId}
                      sx={{
                        cursor: "pointer",
                        transition: "all 0.2s ease",
                        "&:hover": {
                          bgcolor: "rgba(59, 130, 246, 0.05)",
                        },
                        "&:last-child td": { border: 0 },
                      }}
                      onClick={() => navigate(`/coin/${item.coinId}`)}
                    >
                      <TableCell>
                        <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
                          <Avatar
                            src={item.coin.image.large}
                            sx={{ width: 32, height: 32 }}
                          />
                          <Box>
                            <Typography variant="subtitle2" fontWeight="600" color="white">
                              {item.coin.name}
                            </Typography>
                            <Typography variant="caption" color="text.secondary">
                              {item.coin.symbol.toUpperCase()}
                            </Typography>
                          </Box>
                        </Box>
                      </TableCell>
                      <TableCell>
                        <Typography variant="subtitle2" fontWeight="600" color="white">
                          {item.quantity}
                        </Typography>
                        <Typography variant="caption" color="text.secondary">
                          {item.coin.symbol.toUpperCase()}
                        </Typography>
                      </TableCell>
                      <TableCell>
                        <Typography variant="subtitle2" fontWeight="600" color="white">
                          {formatPrice(item.buyPrice)}
                        </Typography>
                      </TableCell>
                      <TableCell>
                        <Typography variant="subtitle2" fontWeight="600" color="white">
                          {formatPrice(item.coin.market_data.current_price.usd)}
                        </Typography>
                      </TableCell>
                      <TableCell>
                        <Typography variant="subtitle2" fontWeight="600" color="white">
                          {formatCurrency(currentValue)}
                        </Typography>
                      </TableCell>
                      <TableCell>
                        <Box sx={{ display: "flex", flexDirection: "column" }}>
                          <Typography
                            variant="subtitle2"
                            fontWeight="600"
                            color={pnl >= 0 ? "success.main" : "error.main"}
                          >
                            {formatCurrency(pnl)}
                          </Typography>
                          <Typography
                            variant="caption"
                            fontWeight="600"
                            color={pnlPercentage >= 0 ? "success.main" : "error.main"}
                          >
                            {pnlPercentage >= 0 ? "+" : ""}{pnlPercentage.toFixed(2)}%
                          </Typography>
                        </Box>
                      </TableCell>
                    </TableRow>
                  );
                })
              ) : (
                <TableRow>
                  <TableCell colSpan={6} align="center" sx={{ py: 4 }}>
                    <Typography variant="h6" color="text.secondary">
                      No holdings yet. Add your first trade to get started!
                    </Typography>
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </TableContainer>
      </Box>
    </Box>
  );
}