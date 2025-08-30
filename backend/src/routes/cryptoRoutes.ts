import express from "express";
import { getTopCoins } from "../controllers/cryptoController.js";

const router = express.Router();
router.get("/coins", getTopCoins);

export default router;
