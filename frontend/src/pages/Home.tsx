// frontend/src/pages/Home.tsx
import { useState } from "react";
import Navbar from "../components/Navbar";
import CoinTable from "../components/CoinTable";
import Portfolio from "../components/Portfolio";
import {
  Tabs,
  Tab,
  Box,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Button,
} from "@mui/material";
import axios from "axios";

export default function Home() {
  const [tab, setTab] = useState(0);
  const [open, setOpen] = useState(false);
  const [selectedCoin, setSelectedCoin] = useState<any>(null);
  const [quantity, setQuantity] = useState(1);
  const [buyPrice, setBuyPrice] = useState(0);

  const handleAddToPortfolio = (coin: any) => {
    setSelectedCoin(coin);
    setBuyPrice(coin.current_price);
    setOpen(true);
  };

  const handleSubmit = async () => {
    try {
      await axios.post("http://localhost:5000/api/portfolio", {
        coinId: selectedCoin.id,
        quantity,
        buyPrice,
      });
      setOpen(false);
    } catch (error) {
      console.error("Error adding to portfolio:", error);
    }
  };

  return (
    <Box sx={{ bgcolor: "background.default", minHeight: "100vh", p: 2 }}>
      <Navbar />
      <Tabs value={tab} onChange={(_, v) => setTab(v)} centered sx={{ mt: 2 }}>
        <Tab label="Dashboard" />
        <Tab label="Portfolio" />
      </Tabs>
      {tab === 0 && <CoinTable onAddToPortfolio={handleAddToPortfolio} />}
      {tab === 1 && <Portfolio />}
      <Dialog open={open} onClose={() => setOpen(false)}>
        <DialogTitle>Add to Portfolio</DialogTitle>
        <DialogContent>
          <TextField
            label="Quantity"
            type="number"
            fullWidth
            value={quantity}
            onChange={(e) => setQuantity(Number(e.target.value))}
            sx={{ mb: 2 }}
          />
          <TextField
            label="Buy Price"
            type="number"
            fullWidth
            value={buyPrice}
            onChange={(e) => setBuyPrice(Number(e.target.value))}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpen(false)}>Cancel</Button>
          <Button onClick={handleSubmit} variant="contained">
            Add
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
}
