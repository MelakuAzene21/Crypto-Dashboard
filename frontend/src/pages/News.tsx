import { useEffect, useState } from "react";
import axios from "axios";
import {
  Box,
  Typography,
  Grid,
  Card,
  CardContent,
  CardMedia,
  Button,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
  Chip,
  useTheme,
  useMediaQuery,
  IconButton,
  Tooltip,
} from "@mui/material";
import {
  OpenInNew,
  AccessTime,
  Newspaper,
  KeyboardArrowDown,
} from "@mui/icons-material";

interface NewsItem {
  id: string;
  title: string;
  body: string;
  url: string;
  source: string;
  published_on: number;
  imageurl?: string;
}

export default function News() {
  const [news, setNews] = useState<NewsItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [category, setCategory] = useState("all");
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("md"));

  useEffect(() => {
    fetchNews();
    const interval = setInterval(fetchNews, 60000); // Refresh every minute
    return () => clearInterval(interval);
  }, [category]);

  const fetchNews = async () => {
    try {
      const { data } = await axios.get(`http://localhost:5000/api/news?category=${category}`);
      setNews(data);
      setLoading(false);
    } catch (error) {
      console.error("Error fetching news:", error);
      setLoading(false);
    }
  };

  const formatTimeAgo = (timestamp: number) => {
    const now = Math.floor(Date.now() / 1000);
    const diff = now - timestamp;
    
    if (diff < 3600) {
      const minutes = Math.floor(diff / 60);
      return `${minutes}m ago`;
    } else if (diff < 86400) {
      const hours = Math.floor(diff / 3600);
      return `${hours}h ago`;
    } else {
      const days = Math.floor(diff / 86400);
      return `${days}d ago`;
    }
  };

  const getFeaturedNews = () => {
    return news[0] || null;
  };

  const getRecentNews = () => {
    return news.slice(1, 4);
  };

  const getNewsImage = (newsItem: NewsItem) => {
    if (newsItem.imageurl) return newsItem.imageurl;
    
    // Fallback images based on source
    const fallbackImages = {
      "CryptoNews": "https://images.unsplash.com/photo-1639762681485-074b7f938ba0?w=400&h=200&fit=crop",
      "BlockchainDaily": "https://images.unsplash.com/photo-1639762681057-408e52192e55?w=400&h=200&fit=crop",
      "DeFi Times": "https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=400&h=200&fit=crop",
      "Financial Tribune": "https://images.unsplash.com/photo-1554224155-6726b3ff858f?w=400&h=200&fit=crop",
    };
    
    return fallbackImages[newsItem.source as keyof typeof fallbackImages] || 
           "https://images.unsplash.com/photo-1639762681485-074b7f938ba0?w=400&h=200&fit=crop";
  };

  const featuredNews = getFeaturedNews();
  const recentNews = getRecentNews();

  return (
    <Box sx={{ p: { xs: 2, md: 4 }, minHeight: "100vh" }}>
      {/* Header Section */}
      <Box sx={{ mb: 4 }}>
        <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center", mb: 1 }}>
          <Box>
            <Typography variant="h3" fontWeight="700" color="white" gutterBottom>
              Crypto News
            </Typography>
            <Typography variant="body1" color="text.secondary">
              Stay updated with the latest cryptocurrency news
            </Typography>
          </Box>
          <FormControl sx={{ minWidth: 150 }}>
            <InputLabel sx={{ color: "text.secondary" }}>All Categories</InputLabel>
            <Select
              value={category}
              label="All Categories"
              onChange={(e) => setCategory(e.target.value)}
              IconComponent={KeyboardArrowDown}
              sx={{
                borderRadius: 3,
                bgcolor: "rgba(30, 41, 59, 0.5)",
                border: "1px solid rgba(148, 163, 184, 0.1)",
                color: "white",
                "& .MuiOutlinedInput-notchedOutline": {
                  border: "none",
                },
                "& .MuiSelect-icon": {
                  color: "text.secondary",
                },
              }}
            >
              <MenuItem value="all">All Categories</MenuItem>
              <MenuItem value="bitcoin">Bitcoin</MenuItem>
              <MenuItem value="ethereum">Ethereum</MenuItem>
              <MenuItem value="defi">DeFi</MenuItem>
              <MenuItem value="regulation">Regulation</MenuItem>
            </Select>
          </FormControl>
        </Box>
      </Box>

      {/* Featured News */}
      {featuredNews && (
        <Card
          sx={{
            mb: 4,
            background: "linear-gradient(145deg, rgba(30, 41, 59, 0.8) 0%, rgba(15, 23, 42, 0.9) 100%)",
            border: "1px solid rgba(148, 163, 184, 0.1)",
            borderRadius: 3,
            overflow: "hidden",
          }}
        >
          <Grid container>
            <Grid item xs={12} md={8}>
              <CardContent sx={{ p: 4 }}>
                <Box sx={{ display: "flex", alignItems: "center", mb: 2 }}>
                  <Chip
                    label="FEATURED"
                    size="small"
                    sx={{
                      bgcolor: "primary.main",
                      color: "white",
                      fontWeight: 600,
                      mr: 2,
                    }}
                  />
                  <Box sx={{ display: "flex", alignItems: "center", color: "text.secondary" }}>
                    <Newspaper sx={{ fontSize: 16, mr: 0.5 }} />
                    <Typography variant="caption" fontWeight="500">
                      {featuredNews.source}
                    </Typography>
                  </Box>
                </Box>
                
                <Typography variant="h4" fontWeight="700" color="white" sx={{ mb: 2, lineHeight: 1.3 }}>
                  {featuredNews.title}
                </Typography>
                
                <Typography variant="body1" color="text.secondary" sx={{ mb: 3, lineHeight: 1.6 }}>
                  {featuredNews.body.length > 200 
                    ? `${featuredNews.body.substring(0, 200)}...` 
                    : featuredNews.body}
                </Typography>
                
                <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                  <Box sx={{ display: "flex", alignItems: "center", color: "text.secondary" }}>
                    <AccessTime sx={{ fontSize: 16, mr: 0.5 }} />
                    <Typography variant="caption">
                      {formatTimeAgo(featuredNews.published_on)}
                    </Typography>
                  </Box>
                  
                  <Button
                    variant="outlined"
                    endIcon={<OpenInNew />}
                    href={featuredNews.url}
                    target="_blank"
                    rel="noopener"
                    sx={{
                      borderColor: "primary.main",
                      color: "primary.main",
                      "&:hover": {
                        borderColor: "primary.light",
                        bgcolor: "rgba(0, 212, 170, 0.1)",
                      },
                    }}
                  >
                    Read More
                  </Button>
                </Box>
              </CardContent>
            </Grid>
            
            <Grid item xs={12} md={4}>
              <CardMedia
                component="img"
                image={getNewsImage(featuredNews)}
                alt={featuredNews.title}
                sx={{
                  height: "100%",
                  minHeight: 300,
                  objectFit: "cover",
                }}
              />
            </Grid>
          </Grid>
        </Card>
      )}

      {/* Recent News Grid */}
      <Grid container spacing={3}>
        {recentNews.map((newsItem) => (
          <Grid item xs={12} md={4} key={newsItem.id}>
            <Card
              sx={{
                height: "100%",
                background: "linear-gradient(145deg, rgba(30, 41, 59, 0.8) 0%, rgba(15, 23, 42, 0.9) 100%)",
                border: "1px solid rgba(148, 163, 184, 0.1)",
                borderRadius: 3,
                overflow: "hidden",
                transition: "all 0.3s ease",
                "&:hover": {
                  transform: "translateY(-4px)",
                  boxShadow: "0 8px 25px rgba(0, 0, 0, 0.4)",
                },
              }}
            >
              <CardMedia
                component="img"
                image={getNewsImage(newsItem)}
                alt={newsItem.title}
                sx={{
                  height: 200,
                  objectFit: "cover",
                }}
              />
              
              <CardContent sx={{ p: 3 }}>
                <Box sx={{ display: "flex", alignItems: "center", mb: 2 }}>
                  <Chip
                    label={newsItem.source}
                    size="small"
                    sx={{
                      bgcolor: "primary.main",
                      color: "white",
                      fontWeight: 600,
                    }}
                  />
                </Box>
                
                <Typography variant="h6" fontWeight="600" color="white" sx={{ mb: 2, lineHeight: 1.4 }}>
                  {newsItem.title.length > 80 
                    ? `${newsItem.title.substring(0, 80)}...` 
                    : newsItem.title}
                </Typography>
                
                <Typography variant="body2" color="text.secondary" sx={{ mb: 3, lineHeight: 1.5 }}>
                  {newsItem.body.length > 120 
                    ? `${newsItem.body.substring(0, 120)}...` 
                    : newsItem.body}
                </Typography>
                
                <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                  <Box sx={{ display: "flex", alignItems: "center", color: "text.secondary" }}>
                    <AccessTime sx={{ fontSize: 14, mr: 0.5 }} />
                    <Typography variant="caption">
                      {formatTimeAgo(newsItem.published_on)}
                    </Typography>
                  </Box>
                  
                  <IconButton
                    size="small"
                    href={newsItem.url}
                    target="_blank"
                    rel="noopener"
                    sx={{
                      color: "primary.main",
                      "&:hover": {
                        bgcolor: "rgba(0, 212, 170, 0.1)",
                      },
                    }}
                  >
                    <OpenInNew sx={{ fontSize: 18 }} />
                  </IconButton>
                </Box>
              </CardContent>
            </Card>
          </Grid>
        ))}
      </Grid>

      {/* Load More Button */}
      <Box sx={{ display: "flex", justifyContent: "center", mt: 4 }}>
        <Button
          variant="outlined"
          sx={{
            borderColor: "primary.main",
            color: "primary.main",
            px: 4,
            py: 1.5,
            borderRadius: 3,
            "&:hover": {
              borderColor: "primary.light",
              bgcolor: "rgba(0, 212, 170, 0.1)",
            },
          }}
        >
          Load More Articles
        </Button>
      </Box>
    </Box>
  );
}
