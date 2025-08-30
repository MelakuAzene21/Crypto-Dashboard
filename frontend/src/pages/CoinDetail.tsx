// frontend/src/pages/CoinDetail.tsx
import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";
import { Box, Typography, Paper, Grid, Chip } from "@mui/material";
import CoinChart from "../components/CoinChart";
import Navbar from "../components/Navbar";

export default function CoinDetail() {
  const { id } = useParams<{ id: string }>();
  const [coin, setCoin] = useState<any>(null);
  const [history, setHistory] = useState<{ prices: [number, number][] }>({
    prices: [],
  });

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

  if (!coin) return <Typography>Loading...</Typography>;

  return (
    <Box sx={{ bgcolor: "background.default", minHeight: "100vh", p: 2 }}>
      <Navbar />
      <Paper elevation={3} sx={{ p: 3, mt: 2, borderRadius: "8px" }}>
        <Grid container spacing={3}>
          <Grid item xs={12} md={6}>
            <Box display="flex" alignItems="center" mb={2}>
              <img
                src={coin.image.large}
                alt={coin.name}
                width={50}
                style={{ marginRight: 16 }}
              />
              <Typography variant="h4">
                {coin.name} ({coin.symbol.toUpperCase()})
              </Typography>
            </Box>
            <Chip
              label={`Rank: #${coin.market_cap_rank}`}
              color="primary"
              sx={{ mb: 2 }}
            />
            <Typography variant="h6">
              Current Price: $
              {coin.market_data.current_price.usd.toLocaleString()}
            </Typography>
            <Typography>
              Market Cap: ${coin.market_data.market_cap.usd.toLocaleString()}
            </Typography>
            <Typography>
              24h High: ${coin.market_data.high_24h.usd.toLocaleString()}
            </Typography>
            <Typography>
              24h Low: ${coin.market_data.low_24h.usd.toLocaleString()}
            </Typography>
            <Typography>
              24h Change:{" "}
              {coin.market_data.price_change_percentage_24h.toFixed(2)}%
            </Typography>
            <Typography>
              All-Time High: ${coin.market_data.ath.usd.toLocaleString()}
            </Typography>
          </Grid>
          <Grid item xs={12} md={6}>
            <CoinChart
              prices={history.prices.map((p) => p[1])}
              title={`${coin.name} 30-Day Price Chart`}
            />
          </Grid>
        </Grid>
      </Paper>
    </Box>
  );
}
