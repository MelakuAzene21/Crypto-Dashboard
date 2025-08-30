// frontend/src/components/Portfolio.tsx
import { useEffect, useState } from "react";
import axios from "axios";
import {
  Table,
  TableHead,
  TableRow,
  TableCell,
  TableBody,
  Paper,
  Typography,
} from "@mui/material";

export default function Portfolio() {
  const [portfolio, setPortfolio] = useState<any[]>([]);
  const [coins, setCoins] = useState<any[]>([]); // To get current prices

  useEffect(() => {
    fetchPortfolio();
    fetchCoins();
    const interval = setInterval(() => {
      fetchPortfolio();
      fetchCoins();
    }, 30000);
    return () => clearInterval(interval);
  }, []);

  const fetchPortfolio = async () => {
    try {
      const { data } = await axios.get("http://localhost:5000/api/portfolio");
      setPortfolio(data);
    } catch (error) {
      console.error("Error fetching portfolio:", error);
    }
  };

  const fetchCoins = async () => {
    try {
      const { data } = await axios.get("http://localhost:5000/api/coins");
      setCoins(data);
    } catch (error) {
      console.error("Error fetching coins:", error);
    }
  };

  const getCurrentPrice = (coinId: string) => {
    const coin = coins.find((c) => c.id === coinId);
    return coin ? coin.current_price : 0;
  };

  const calculateProfit = (item: any) => {
    const currentPrice = getCurrentPrice(item.coinId);
    return (currentPrice - item.buyPrice) * item.quantity;
  };

  return (
    <Paper elevation={3} sx={{ p: 2, mt: 2, borderRadius: "8px" }}>
      <Typography variant="h6" gutterBottom>
        Your Portfolio
      </Typography>
      {portfolio.length === 0 ? (
        <Typography>No items in portfolio yet.</Typography>
      ) : (
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Coin</TableCell>
              <TableCell>Quantity</TableCell>
              <TableCell>Buy Price</TableCell>
              <TableCell>Current Price</TableCell>
              <TableCell>Profit/Loss</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {portfolio.map((item) => (
              <TableRow key={item._id}>
                <TableCell>{item.coinId}</TableCell>
                <TableCell>{item.quantity}</TableCell>
                <TableCell>${item.buyPrice.toLocaleString()}</TableCell>
                <TableCell>
                  ${getCurrentPrice(item.coinId).toLocaleString()}
                </TableCell>
                <TableCell
                  style={{
                    color: calculateProfit(item) > 0 ? "green" : "red",
                  }}
                >
                  ${calculateProfit(item).toLocaleString()}
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      )}
    </Paper>
  );
}
