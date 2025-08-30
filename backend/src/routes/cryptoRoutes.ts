// backend/src/routes/cryptoRoutes.ts
import express from "express";
import {
  getTopCoins,
  getCoinDetails,
  getCoinHistory,
  getPortfolio,
  addToPortfolio,
  getCoinNews,
} from "../controllers/cryptoController.js";

const router = express.Router();

router.get("/coins", getTopCoins);
router.get("/coin/:id", getCoinDetails);
router.get("/coin/:id/history", getCoinHistory);
router.get("/coin/:id/news", getCoinNews);
router.get("/portfolio", getPortfolio);
router.post("/portfolio", addToPortfolio);

export default router;
