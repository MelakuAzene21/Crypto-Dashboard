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
  Button,
  ButtonGroup,
  Link,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  Divider,
  Avatar,
  CircularProgress,
} from "@mui/material";
import {
  TrendingUp,
  TrendingDown,
  ShowChart,
  AttachMoney,
  BarChart,
  Language,
  Twitter,
  Reddit,
  GitHub,
  Telegram,
  Facebook,
  LinkedIn,
  YouTube,
  OpenInNew,
  Newspaper,
  Timeline,
  Info,
  Link as LinkIcon,
} from "@mui/icons-material";
import CoinChart from "../components/CoinChart";
import Navbar from "../components/Navbar";

export default function CoinDetail() {
  const { id } = useParams<{ id: string }>();
  const [coin, setCoin] = useState<any>(null);
  const [history, setHistory] = useState<{ prices: [number, number][] }>({
    prices: [],
  });
  const [news, setNews] = useState<any[]>([]);
  const [timePeriod, setTimePeriod] = useState("30d");
  const [loading, setLoading] = useState(true);
  const [newsLoading, setNewsLoading] = useState(true);
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("md"));

  useEffect(() => {
    fetchCoinDetails();
    fetchCoinHistory();
    fetchCoinNews();
    const interval = setInterval(() => {
      fetchCoinDetails();
      fetchCoinHistory();
    }, 30000);
    return () => clearInterval(interval);
  }, [id]);

  useEffect(() => {
    fetchCoinHistory();
  }, [timePeriod]);

  const fetchCoinDetails = async () => {
    try {
      const { data } = await axios.get(`http://localhost:5000/api/coin/${id}`);
      setCoin(data);
      setLoading(false);
    } catch (error) {
      console.error("Error fetching coin details:", error);
      setLoading(false);
    }
  };

  const fetchCoinHistory = async () => {
    try {
      const days = timePeriod === "7d" ? 7 : timePeriod === "30d" ? 30 : timePeriod === "90d" ? 90 : 365;
      const { data } = await axios.get(
        `http://localhost:5000/api/coin/${id}/history?days=${days}`
      );
      setHistory(data);
    } catch (error) {
      console.error("Error fetching coin history:", error);
    }
  };

  const fetchCoinNews = async () => {
    try {
      const { data } = await axios.get(`http://localhost:5000/api/coin/${id}/news`);
      setNews(data.slice(0, 5)); // Limit to 5 news items
      setNewsLoading(false);
    } catch (error) {
      console.error("Error fetching news:", error);
      setNewsLoading(false);
    }
  };

  const getSocialIcon = (platform: string) => {
    switch (platform.toLowerCase()) {
      case "twitter":
        return <Twitter />;
      case "reddit":
        return <Reddit />;
      case "github":
        return <GitHub />;
      case "telegram":
        return <Telegram />;
      case "facebook":
        return <Facebook />;
      case "linkedin":
        return <LinkedIn />;
      case "youtube":
        return <YouTube />;
      default:
        return <LinkIcon />;
    }
  };

  if (loading) {
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
        <CircularProgress />
      </Box>
    );
  }

  if (!coin) {
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
        <Typography>Coin not found</Typography>
      </Box>
    );
  }

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
      
      {/* Coin Header Section */}
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
                <Box display="flex" alignItems="center" mt={0.5} flexWrap="wrap">
                  <Chip
                    label={`Rank: #${coin.market_data.market_cap_rank || coin.market_cap_rank}`}
                    color="primary"
                    size="small"
                    sx={{ mr: 1, mb: 1 }}
                  />
                  <Box
                    display="flex"
                    alignItems="center"
                    color={isPositive ? "success.main" : "error.main"}
                    sx={{ mb: 1 }}
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

          {/* Price and Key Stats Section */}
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
                    <Typography variant="body2" color="textSecondary" gutterBottom>
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
                    <Typography variant="body2" color="textSecondary" gutterBottom>
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
                    <Typography variant="body2" color="textSecondary" gutterBottom>
                      Circulating Supply
                    </Typography>
                    <Typography variant="h6" fontWeight="600">
                      {coin.market_data.circulating_supply?.toLocaleString() || "N/A"}
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
                    <Typography variant="body2" color="textSecondary" gutterBottom>
                      Total Supply
                    </Typography>
                    <Typography variant="h6" fontWeight="600">
                      {coin.market_data.total_supply?.toLocaleString() || "N/A"}
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
                    <Typography variant="body2" color="textSecondary" gutterBottom>
                      All-Time High
                    </Typography>
                    <Typography variant="h6" fontWeight="600" color="success.main">
                      ${coin.market_data.ath.usd.toLocaleString()}
                    </Typography>
                    <Typography variant="caption" color="textSecondary">
                      {new Date(coin.market_data.ath_date.usd).toLocaleDateString()}
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
                    <Typography variant="body2" color="textSecondary" gutterBottom>
                      All-Time Low
                    </Typography>
                    <Typography variant="h6" fontWeight="600" color="error.main">
                      ${coin.market_data.atl.usd.toLocaleString()}
                    </Typography>
                    <Typography variant="caption" color="textSecondary">
                      {new Date(coin.market_data.atl_date.usd).toLocaleDateString()}
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
                <Box display="flex" alignItems="center" justifyContent="space-between" mb={2}>
                  <Box display="flex" alignItems="center">
                    <ShowChart
                      sx={{ color: "primary.main", mr: 1, fontSize: 24 }}
                    />
                    <Typography variant="h6" color="textSecondary">
                      Price Chart
                    </Typography>
                  </Box>
                  <ButtonGroup size="small" variant="outlined">
                    <Button
                      onClick={() => setTimePeriod("7d")}
                      variant={timePeriod === "7d" ? "contained" : "outlined"}
                    >
                      7D
                    </Button>
                    <Button
                      onClick={() => setTimePeriod("30d")}
                      variant={timePeriod === "30d" ? "contained" : "outlined"}
                    >
                      30D
                    </Button>
                    <Button
                      onClick={() => setTimePeriod("90d")}
                      variant={timePeriod === "90d" ? "contained" : "outlined"}
                    >
                      90D
                    </Button>
                    <Button
                      onClick={() => setTimePeriod("1y")}
                      variant={timePeriod === "1y" ? "contained" : "outlined"}
                    >
                      1Y
                    </Button>
                  </ButtonGroup>
                </Box>
                <Box sx={{ height: isMobile ? "300px" : "400px" }}>
                  <CoinChart
                    prices={history.prices.map((p) => p[1])}
                    title=""
                    isPositive={isPositive}
                    timePeriod={timePeriod}
                  />
                </Box>
              </CardContent>
            </Card>
          </Grid>
        </Grid>
      </Paper>

      {/* Links and News Section */}
      <Grid container spacing={3} sx={{ mt: 2 }}>
        {/* Links Section */}
        <Grid item xs={12} md={6}>
          <Paper
            elevation={0}
            sx={{
              p: 3,
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
            <Box display="flex" alignItems="center" mb={2}>
              <LinkIcon sx={{ color: "primary.main", mr: 1, fontSize: 24 }} />
              <Typography variant="h6" color="textSecondary">
                Links & Resources
              </Typography>
            </Box>
            
            <List>
              {coin.links.homepage[0] && (
                <ListItem>
                  <ListItemIcon>
                    <Language color="primary" />
                  </ListItemIcon>
                  <ListItemText
                    primary="Official Website"
                    secondary={coin.links.homepage[0]}
                  />
                  <Link href={coin.links.homepage[0]} target="_blank" rel="noopener">
                    <OpenInNew />
                  </Link>
                </ListItem>
              )}
              
              {coin.links.blockchain_site[0] && (
                <ListItem>
                  <ListItemIcon>
                    <BarChart color="primary" />
                  </ListItemIcon>
                  <ListItemText
                    primary="Blockchain Explorer"
                    secondary={coin.links.blockchain_site[0]}
                  />
                  <Link href={coin.links.blockchain_site[0]} target="_blank" rel="noopener">
                    <OpenInNew />
                  </Link>
                </ListItem>
              )}

              {coin.links.repos_url.github[0] && (
                <ListItem>
                  <ListItemIcon>
                    <GitHub color="primary" />
                  </ListItemIcon>
                  <ListItemText
                    primary="GitHub Repository"
                    secondary={coin.links.repos_url.github[0]}
                  />
                  <Link href={coin.links.repos_url.github[0]} target="_blank" rel="noopener">
                    <OpenInNew />
                  </Link>
                </ListItem>
              )}

              {Object.entries(coin.links.social_media || {}).map(([platform, url]: [string, any]) => {
                if (url && url[0]) {
                  return (
                    <ListItem key={platform}>
                      <ListItemIcon>
                        {getSocialIcon(platform)}
                      </ListItemIcon>
                      <ListItemText
                        primary={platform.charAt(0).toUpperCase() + platform.slice(1)}
                        secondary={url[0]}
                      />
                      <Link href={url[0]} target="_blank" rel="noopener">
                        <OpenInNew />
                      </Link>
                    </ListItem>
                  );
                }
                return null;
              })}
            </List>
          </Paper>
        </Grid>

        {/* News Section */}
        <Grid item xs={12} md={6}>
          <Paper
            elevation={0}
            sx={{
              p: 3,
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
            <Box display="flex" alignItems="center" mb={2}>
              <Newspaper sx={{ color: "primary.main", mr: 1, fontSize: 24 }} />
              <Typography variant="h6" color="textSecondary">
                Latest News
              </Typography>
            </Box>
            
            {newsLoading ? (
              <Box display="flex" justifyContent="center" p={3}>
                <CircularProgress />
              </Box>
            ) : news.length > 0 ? (
              <List>
                {news.map((item, index) => (
                  <Box key={index}>
                    <ListItem alignItems="flex-start">
                      <ListItemIcon>
                        <Avatar sx={{ width: 40, height: 40 }}>
                          <Newspaper />
                        </Avatar>
                      </ListItemIcon>
                      <ListItemText
                        primary={
                          <Link
                            href={item.url}
                            target="_blank"
                            rel="noopener"
                            sx={{ textDecoration: "none", color: "inherit" }}
                          >
                            <Typography variant="subtitle2" fontWeight="600">
                              {item.title}
                            </Typography>
                          </Link>
                        }
                        secondary={
                          <Box>
                            <Typography variant="caption" color="textSecondary">
                              {new Date(item.published_on * 1000).toLocaleDateString()}
                            </Typography>
                            <Typography variant="body2" color="textSecondary" sx={{ mt: 0.5 }}>
                              {item.body.substring(0, 100)}...
                            </Typography>
                          </Box>
                        }
                      />
                    </ListItem>
                    {index < news.length - 1 && <Divider />}
                  </Box>
                ))}
              </List>
            ) : (
              <Typography variant="body2" color="textSecondary" textAlign="center" p={3}>
                No news available at the moment
              </Typography>
            )}
          </Paper>
        </Grid>
      </Grid>
    </Box>
  );
}
