import mongoose from "mongoose";
import { Wallet } from "../wallet/wallet.model";
import { ITransaction } from "./transaction.interface";
import { Transaction } from "./transaction.model";
import { calculateFee } from "../../utils/feeCalculator";
import { notify } from "../../utils/notifier";

// transaction.service.ts
const createTransaction = async (payload: ITransaction) => {
  const session = await mongoose.startSession();
  session.startTransaction();

  try {
    const { from, to, amount, type, initiatedBy, initiatedRole, reference } =
      payload;

    if (!initiatedBy || !initiatedRole || !reference) {
      throw new Error(
        "Missing required transaction metadata (initiatedBy, role, or reference)"
      );
    }

    const senderWallet = await Wallet.findOne({ user: from }).session(session);
    if (!senderWallet) throw new Error("Sender wallet not found");
    if (senderWallet.status === "blocked") throw new Error("Sender wallet is blocked");

    const userWallet = to ? await Wallet.findOne({ user: to }).session(session) : null;

    // Fee depends on role
    const fee = calculateFee(type, amount, initiatedRole as "user" | "agent");

    // Handle different cases
    if (type === "cash_out") {
      if (!userWallet) throw new Error("Target user is required for cash_out");
      if (userWallet.status === "blocked") throw new Error("Target user's wallet is blocked");
      if (userWallet.balance < amount) throw new Error("User has insufficient balance");

      // Deduct only from user
      userWallet.balance -= amount;
      await userWallet.save({ session });

      // Deduct fee from agent if agent is performing withdrawal
      if (initiatedRole === "agent" && senderWallet.user.toString() !== to?.toString()) {
        if (senderWallet.balance < fee) throw new Error("Agent has insufficient balance for fee");
        senderWallet.balance -= fee;
        await senderWallet.save({ session });
      }
    }

    // Other transaction types (add_money, send, etc.)
    if (["send", "add_money", "cash_in", "withdraw"].includes(type)) {
      let totalDebit = amount;
      if (initiatedRole === "user") totalDebit += fee; // fee for user
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


const getMyTransactions = async (userId: string) => {
  return await Transaction.find({
    $or: [{ from: userId }, { to: userId }],
  }).sort({ createdAt: -1 });
};

const getAllTransactions = async () => {
  return await Transaction.find()
    .populate("from to", "name email")
    .sort({ createdAt: -1 });
};

export const TransactionService = {
  createTransaction,
  getMyTransactions,
  getAllTransactions,
};
