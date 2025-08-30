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
  const [totalPages] = useState(10); // Assuming 500 coins total, 50 per page; adjust if needed

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
      const { data } = await axios.get(
        `http://localhost:5000/api/coins?page=${page}`
      );
      setCoins(data);
    } catch (error) {
      console.error("Error fetching coins:", error);
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

  return (
    <Paper elevation={3} sx={{ p: 2, mt: 2, borderRadius: "8px" }}>
      <TextField
        label="Search by name or symbol"
        variant="outlined"
        fullWidth
        sx={{ mb: 2 }}
        onChange={(e) => setSearch(e.target.value)}
      />
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
          {filteredCoins.map((coin) => (
            <TableRow key={coin.id} hover>
              <TableCell>
                <IconButton onClick={() => toggleWatchlist(coin.id)}>
                  <StarIcon
                    color={watchlist.includes(coin.id) ? "primary" : "disabled"}
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
                  color: coin.price_change_percentage_24h > 0 ? "green" : "red",
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
