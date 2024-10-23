import mongoose from "mongoose";

export type Token = {
  userId: string;
  otp: number;
};

const tokenSchema = new mongoose.Schema({
  userId: { type: String, required: true },
  otp: { type: Number, required: true },
});

const Token = mongoose.model<Token>("Token", tokenSchema);

export default Token;
