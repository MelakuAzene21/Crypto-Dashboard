// backend/src/controllers/cryptoController.ts
import axios from "axios";
import { Request, Response } from "express";
import Portfolio from "../models/Portfolio";

// Fetch top coins
export const getTopCoins = async (req: Request, res: Response) => {
  const { page = 1 } = req.query;
  try {
    const { data } = await axios.get(
      "https://api.coingecko.com/api/v3/coins/markets",
      {
        params: {
          vs_currency: "usd",
          order: "market_cap_desc",
          per_page: 50,
          page: Number(page),
          sparkline: true,
        },
      }
    );
    res.json(data);
  } catch (err) {
    res.status(500).json({ message: "Error fetching coins" });
  }
};

// Get coin details
export const getCoinDetails = async (req: Request, res: Response) => {
  const { id } = req.params;
  try {
    const { data } = await axios.get(
      `https://api.coingecko.com/api/v3/coins/${id}`
    );
    res.json(data);
  } catch (err) {
    res.status(500).json({ message: "Error fetching coin details" });
  }
};

// Get coin history
export const getCoinHistory = async (req: Request, res: Response) => {
  const { id } = req.params;
  const { days } = req.query;
  try {
    const { data } = await axios.get(
      `https://api.coingecko.com/api/v3/coins/${id}/market_chart`,
      {
        params: {
          vs_currency: "usd",
          days: days || 7,
        },
      }
    );
    res.json(data);
  } catch (err) {
    res.status(500).json({ message: "Error fetching coin history" });
  }
};

// Get portfolio
export const getPortfolio = async (req: Request, res: Response) => {
  const userId = "user1"; // Fixed userId for simplicity (add auth in production)
  try {
    const portfolio = await Portfolio.find({ userId });
    res.json(portfolio);
  } catch (err) {
    res.status(500).json({ message: "Error fetching portfolio" });
  }
};

// Add to portfolio
export const addToPortfolio = async (req: Request, res: Response) => {
  const userId = "user1";
  const { coinId, quantity, buyPrice } = req.body;
  try {
    const newItem = new Portfolio({ userId, coinId, quantity, buyPrice });
    await newItem.save();
    res.json(newItem);
  } catch (err) {
    res.status(500).json({ message: "Error adding to portfolio" });
  }
};

// Get coin news
export const getCoinNews = async (req: Request, res: Response) => {
  const { id } = req.params;
  try {
    // Using CryptoCompare API for news (free tier)
    const { data } = await axios.get(
      `https://min-api.cryptocompare.com/data/v2/news/?categories=${id}&excludeCategories=Sponsored`
    );
    res.json(data.Data || []);
  } catch (err) {
    // Fallback to general crypto news if specific coin news fails
    try {
      const { data } = await axios.get(
        "https://min-api.cryptocompare.com/data/v2/news/?categories=Crypto&excludeCategories=Sponsored"
      );
      res.json(data.Data || []);
    } catch (fallbackErr) {
      res.status(500).json({ message: "Error fetching news" });
    }
  }
};

// Get general news
export const getNews = async (req: Request, res: Response) => {
  const { category = "Crypto" } = req.query;
  try {
    const { data } = await axios.get(
      `https://min-api.cryptocompare.com/data/v2/news/?categories=${category}&excludeCategories=Sponsored`
    );
    res.json(data.Data || []);
  } catch (err) {
    res.status(500).json({ message: "Error fetching news" });
  }
};
