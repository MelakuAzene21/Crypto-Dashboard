// frontend/src/components/CoinTable.tsx
import { useEffect, useState } from "react";
import axios from "axios";
import {
  Table,
  TableHead,
  TableRow,
  TableCell,
  TableBody,
  TextField,
  IconButton,
  Paper,
  Pagination,
  Box,
  Skeleton,
  CircularProgress,
} from "@mui/material";
import { Link } from "react-router-dom";
import StarIcon from "@mui/icons-material/Star";
import AddIcon from "@mui/icons-material/Add";

export default function CoinTable({
  onAddToPortfolio,
}: {
  onAddToPortfolio: (coin: any) => void;
}) {
  const [coins, setCoins] = useState<any[]>([]);
  const [search, setSearch] = useState("");
  const [watchlist, setWatchlist] = useState<string[]>(
    JSON.parse(localStorage.getItem("watchlist") || "[]")
  );
  const [page, setPage] = useState(1);
  const [totalPages] = useState(10);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchCoins();
    const interval = setInterval(fetchCoins, 30000);
    return () => clearInterval(interval);
  }, [page]);

  useEffect(() => {
    localStorage.setItem("watchlist", JSON.stringify(watchlist));
  }, [watchlist]);

  const fetchCoins = async () => {
    try {
      setLoading(true);
      const { data } = await axios.get(
        `http://localhost:5000/api/coins?page=${page}`
      );
      setCoins(data);
    } catch (error) {
      console.error("Error fetching coins:", error);
    } finally {
      setLoading(false);
    }
  };

  const toggleWatchlist = (id: string) => {
    setWatchlist((prev) =>
      prev.includes(id) ? prev.filter((item) => item !== id) : [...prev, id]
    );
  };

  const filteredCoins = coins.filter(
    (coin) =>
      coin.name.toLowerCase().includes(search.toLowerCase()) ||
      coin.symbol.toLowerCase().includes(search.toLowerCase())
  );

  const handlePageChange = (
    event: React.ChangeEvent<unknown>,
    value: number
  ) => {
    setPage(value);
  };

  // Skeleton rows for loading state
  const skeletonRows = Array.from({ length: 10 }).map((_, index) => (
    <TableRow key={index} hover>
      <TableCell>
        <Skeleton variant="circular" width={40} height={40} />
      </TableCell>
      <TableCell>
        <Skeleton variant="circular" width={30} height={30} />
      </TableCell>
      <TableCell>
        <Skeleton variant="text" width={150} />
      </TableCell>
      <TableCell>
        <Skeleton variant="text" width={80} />
      </TableCell>
      <TableCell>
        <Skeleton variant="text" width={70} />
      </TableCell>
      <TableCell>
        <Skeleton variant="text" width={120} />
      </TableCell>
      <TableCell>
        <Skeleton variant="circular" width={40} height={40} />
      </TableCell>
    </TableRow>
  ));

  return (
    <Paper elevation={3} sx={{ p: 2, mt: 2, borderRadius: "8px" }}>
      <TextField
        label="Search by name or symbol"
        variant="outlined"
        fullWidth
        sx={{ mb: 2 }}
        onChange={(e) => setSearch(e.target.value)}
      />

      {loading && (
        <Box
          sx={{
            position: "absolute",
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            backgroundColor: "rgba(255, 255, 255, 0.7)",
            zIndex: 10,
            borderRadius: "8px",
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
                animationDuration: "1.5s",
              }}
            />
            <Box
              sx={{
                fontSize: "1rem",
                fontWeight: "500",
                color: "text.primary",
                background: "linear-gradient(90deg, #1976d2, #42a5f5, #1976d2)",
                backgroundSize: "200% auto",
                backgroundClip: "text",
                textFillColor: "transparent",
                WebkitBackgroundClip: "text",
                WebkitTextFillColor: "transparent",
                animation: "gradientShift 2s linear infinite",
                "@keyframes gradientShift": {
                  "0%": { backgroundPosition: "0% 50%" },
                  "50%": { backgroundPosition: "100% 50%" },
                  "100%": { backgroundPosition: "0% 50%" },
                },
              }}
            >
              Loading cryptocurrency data...
            </Box>
          </Box>
        </Box>
      )}

      <Table>
        <TableHead>
          <TableRow>
            <TableCell>Watch</TableCell>
            <TableCell>Logo</TableCell>
            <TableCell>Name</TableCell>
            <TableCell>Price</TableCell>
            <TableCell>24h Change</TableCell>
            <TableCell>Market Cap</TableCell>
            <TableCell>Actions</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {loading
            ? skeletonRows
            : filteredCoins.map((coin) => (
                <TableRow key={coin.id} hover>
                  <TableCell>
                    <IconButton onClick={() => toggleWatchlist(coin.id)}>
                      <StarIcon
                        color={
                          watchlist.includes(coin.id) ? "primary" : "disabled"
                        }
                      />
                    </IconButton>
                  </TableCell>
                  <TableCell>
                    <img src={coin.image} alt={coin.name} width={25} />
                  </TableCell>
                  <TableCell>
                    <Link
                      to={`/coin/${coin.id}`}
                      style={{ textDecoration: "none", color: "inherit" }}
                    >
                      {coin.name} ({coin.symbol.toUpperCase()})
                    </Link>
                  </TableCell>
                  <TableCell>${coin.current_price.toLocaleString()}</TableCell>
                  <TableCell
                    style={{
                      color:
                        coin.price_change_percentage_24h > 0 ? "green" : "red",
                    }}
                  >
                    {coin.price_change_percentage_24h.toFixed(2)}%
                  </TableCell>
                  <TableCell>${coin.market_cap.toLocaleString()}</TableCell>
                  <TableCell>
                    <IconButton onClick={() => onAddToPortfolio(coin)}>
                      <AddIcon />
                    </IconButton>
                  </TableCell>
                </TableRow>
              ))}
        </TableBody>
      </Table>
      <Box sx={{ display: "flex", justifyContent: "center", mt: 2 }}>
        <Pagination
          count={totalPages}
          page={page}
          onChange={handlePageChange}
          color="primary"
          showFirstButton
          showLastButton
        />
      </Box>
    </Paper>
  );
}
