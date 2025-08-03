import mongoose, { Types } from "mongoose";
import { Wallet } from "./wallet.model";

const getWalletByUserId = async (userId: Types.ObjectId | string) => {
  return await Wallet.findOne({ user: new mongoose.Types.ObjectId(userId) });
};

const getFormattedWalletByUserId = async (userId: Types.ObjectId | string) => {
  const wallet = await Wallet.findOne({ user: userId }).populate("user", "name email");
  if (!wallet) return null;

  return {
    walletId: wallet._id,
    userId: wallet.user._id,
    balance: wallet.balance,
    currency: wallet.currency,
    status: wallet.status,
  };
};

const getWalletById = async (walletId: string) => {
  return await Wallet.findById(walletId).populate("user");
};

const getAllWallets = async () => {
  return await Wallet.find().populate("user");
};

const updateWalletStatus = async (
  walletId: string,
  status: "active" | "blocked"
) => {
  return await Wallet.findByIdAndUpdate(walletId, { status }, { new: true });
};

export const WalletService = {
  getWalletByUserId,
  getWalletById,
  getAllWallets,
  updateWalletStatus,
  getFormattedWalletByUserId,
};
