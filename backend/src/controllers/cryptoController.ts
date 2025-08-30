import axios from "axios";
import { Request, Response } from "express";

// Fetch top coins
export const getTopCoins = async (req: Request, res: Response) => {
  try {
    const { data } = await axios.get(
      "https://api.coingecko.com/api/v3/coins/markets",
      {
        params: {
          vs_currency: "usd",
          order: "market_cap_desc",
          per_page: 50,
          page: 1,
          sparkline: true,
        },
      }
    );
    res.json(data);
  } catch (err) {
    res.status(500).json({ message: "Error fetching coins" });
  }
};
