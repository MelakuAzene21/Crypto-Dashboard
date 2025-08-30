import { useEffect, useState } from "react";
import axios from "axios";
import {
  Table,
  TableHead,
  TableRow,
  TableCell,
  TableBody,
  
} from "@mui/material";

export default function CoinTable() {
  const [coins, setCoins] = useState<any[]>([]);

  useEffect(() => {
    fetchCoins();
  }, []);

  const fetchCoins = async () => {
    const { data } = await axios.get("http://localhost:5000/api/coins");
    setCoins(data);
  };

  return (
    <Table>
      <TableHead>
        <TableRow>
          <TableCell>Logo</TableCell>
          <TableCell>Name</TableCell>
          <TableCell>Price</TableCell>
          <TableCell>24h Change</TableCell>
          <TableCell>Market Cap</TableCell>
        </TableRow>
      </TableHead>
      <TableBody>
        {coins.map((coin) => (
          <TableRow key={coin.id}>
            <TableCell>
              <img src={coin.image} alt={coin.name} width={25} />
            </TableCell>
            <TableCell>
              {coin.name} ({coin.symbol.toUpperCase()})
            </TableCell>
            <TableCell>${coin.current_price}</TableCell>
            <TableCell
              style={{
                color: coin.price_change_percentage_24h > 0 ? "green" : "red",
              }}
            >
              {coin.price_change_percentage_24h.toFixed(2)}%
            </TableCell>
            <TableCell>${coin.market_cap.toLocaleString()}</TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
}
