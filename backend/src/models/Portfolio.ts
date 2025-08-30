import mongoose from "mongoose";

const portfolioSchema = new mongoose.Schema({
  userId: String,
  coinId: String,
  quantity: Number,
  buyPrice: Number,
});

export default mongoose.model("Portfolio", portfolioSchema);
