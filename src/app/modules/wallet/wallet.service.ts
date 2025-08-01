import { Types } from "mongoose";
import { Wallet } from "./wallet.model";

const getWalletByUserId = async (userId: Types.ObjectId) => {
  return await Wallet.findOne({ user: userId });
};

export const WalletService = {
  getWalletByUserId,
};