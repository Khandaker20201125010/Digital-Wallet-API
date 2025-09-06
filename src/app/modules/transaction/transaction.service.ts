/* eslint-disable @typescript-eslint/no-explicit-any */
import mongoose from "mongoose";
import { Wallet } from "../wallet/wallet.model";
import { ITransaction } from "./transaction.interface";
import { Transaction } from "./transaction.model";
import { calculateFee } from "../../utils/feeCalculator";
import { notify } from "../../utils/notifier";

const createTransaction = async (payload: ITransaction) => {
  const session = await mongoose.startSession();
  session.startTransaction();

  try {
    const { from, to, amount, type, initiatedBy, initiatedRole, reference } = payload;

    if (!initiatedBy || !initiatedRole || !reference) {
      throw new Error("Missing required transaction metadata");
    }

    const senderWallet = await Wallet.findOne({ user: from }).session(session);
    if (!senderWallet) throw new Error("Sender wallet not found");
    if (senderWallet.status === "blocked") throw new Error("Sender wallet is blocked");

    const userWallet = to ? await Wallet.findOne({ user: to }).session(session) : null;
    if (userWallet && userWallet.status === "blocked") {
      throw new Error("Target wallet is blocked");
    }

    // Calculate fee
    const fee = calculateFee(type, amount, initiatedRole as "user" | "agent");

    // ---------------- USER WITHDRAW ----------------
    if (type === "withdraw") {
      if (senderWallet.balance < amount + fee) throw new Error("Insufficient balance");
      senderWallet.balance -= (amount + fee);
      await senderWallet.save({ session });
    }

    // ---------------- AGENT CASH-OUT ----------------
    else if (type === "cash_out") {
      if (!userWallet) throw new Error("Target user required for cash_out");
      if (userWallet.balance < amount) throw new Error("User has insufficient balance");

      // Deduct from user wallet
      userWallet.balance -= amount;
      await userWallet.save({ session });

      // Agent pays fee (optional rule)
      if (initiatedRole === "agent") {
        if (senderWallet.balance < fee) throw new Error("Agent has insufficient balance for fee");
        senderWallet.balance -= fee;
        await senderWallet.save({ session });
      }
    }

    // ---------------- CASH-IN / SEND / ADD-MONEY ----------------
    else if (["cash_in", "add_money", "send"].includes(type)) {
      let totalDebit = amount;
      if (initiatedRole === "user") totalDebit += fee;

      if (senderWallet.balance < totalDebit) throw new Error("Insufficient balance including fee");
      senderWallet.balance -= totalDebit;
      await senderWallet.save({ session });

      if (to) {
        const receiverWallet = await Wallet.findOne({ user: to }).session(session);
        if (!receiverWallet) throw new Error("Receiver wallet not found");
        receiverWallet.balance += amount;
        await receiverWallet.save({ session });
      }
    }

    // ---------------- RECORD TRANSACTION ----------------
    const transaction = await Transaction.create([{ ...payload, fee }], { session });

    notify(from.toString(), `Transaction of ${amount} (${type}) successful. Fee: ${fee}`);
    if (to && ["send", "cash_in", "add_money"].includes(type)) {
      notify(to.toString(), `You received ₹${amount} via ${type}`);
    }

    await session.commitTransaction();
    session.endSession();

    return transaction[0];
  } catch (error) {
    await session.abortTransaction();
    session.endSession();
    throw error;
  }
};

const getMyTransactions = async (
  userId: string,
  filters: { type?: string; startDate?: string; endDate?: string },
  page = 1,
  limit = 10
) => {
  const query: any = {
    $or: [{ from: userId }, { to: userId }],
  };

  if (filters.type) query.type = filters.type;
  if (filters.startDate && filters.endDate) {
    query.createdAt = {
      $gte: new Date(filters.startDate),
      $lte: new Date(filters.endDate),
    };
  }

  const transactions = await Transaction.find(query)
    .sort({ createdAt: -1 })
    .skip((page - 1) * limit)
    .limit(limit);

  const total = await Transaction.countDocuments(query);

  return { transactions, total, page, limit };
};

const getAllTransactions = async (
  filters: { type?: string; startDate?: string; endDate?: string },
  page = 1,
  limit = 20
) => {
  const query: any = {};

  if (filters.type) query.type = filters.type;
  if (filters.startDate && filters.endDate) {
    query.createdAt = {
      $gte: new Date(filters.startDate),
      $lte: new Date(filters.endDate),
    };
  }

  const transactions = await Transaction.find(query)
    .populate("from to", "name email")
    .sort({ createdAt: -1 })
    .skip((page - 1) * limit)
    .limit(limit);

  const total = await Transaction.countDocuments(query);

  return { transactions, total, page, limit };
};

export const TransactionService = {
  createTransaction,
  getMyTransactions,
  getAllTransactions,
};
