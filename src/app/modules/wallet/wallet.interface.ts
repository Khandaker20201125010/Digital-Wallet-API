import { Types } from "mongoose";

export interface IWallet {
  user: Types.ObjectId;
  balance: number;
  currency?: string; 
}