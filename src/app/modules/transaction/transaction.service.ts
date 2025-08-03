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
    const { from, to, amount, type, initiatedBy, initiatedRole, reference } =
      payload;

    if (!initiatedBy || !initiatedRole || !reference) {
      throw new Error(
        "Missing required transaction metadata (initiatedBy, role, or reference)"
      );
    }

    const senderWallet = await Wallet.findOne({ user: from }).session(session);
    if (!senderWallet) throw new Error("Sender wallet not found");

    if (senderWallet.status === "blocked") {
      throw new Error("Sender wallet is blocked. Transaction not allowed.");
    }
    // calculate fee
    const fee = calculateFee(type, amount);

    // total deduction from sender if applicable
    const totalDebit = amount + fee;

    // Deduct from sender
    if (["send", "withdraw", "cash_out"].includes(type)) {
      if (senderWallet.balance < totalDebit) {
        throw new Error("Insufficient balance (including fee)");
      }
      senderWallet.balance -= totalDebit;
      await senderWallet.save({ session });
    }

    // Special case for cash_out from target wallet
    if (type === "cash_out") {
      if (!to) throw new Error("Target user is required for cash_out");

      const userWallet = await Wallet.findOne({ user: to }).session(session);
      if (!userWallet) throw new Error("User wallet not found for cash_out");

      if (userWallet.status === "blocked") {
        throw new Error("Target user's wallet is blocked. Cannot cash out.");
      }

      if (userWallet.balance < amount) {
        throw new Error("User has insufficient balance for cash_out");
      }

      userWallet.balance -= amount;
      await userWallet.save({ session });
    }

    // Deposit to receiver (if any)
    if (["send", "add_money", "cash_in"].includes(type)) {
      if (to) {
        const receiverWallet = await Wallet.findOne({ user: to }).session(
          session
        );
        if (!receiverWallet) throw new Error("Receiver wallet not found");

        if (receiverWallet.status === "blocked") {
          throw new Error(
            "Receiver wallet is blocked. Transaction not allowed."
          );
        }

        receiverWallet.balance += amount;
        await receiverWallet.save({ session });
      } else if (type === "add_money") {
        senderWallet.balance += amount;
        await senderWallet.save({ session });
      }
    }

    const transaction = await Transaction.create(
      [
        {
          ...payload,
          fee,
        },
      ],
      { session }
    );

    // Notify sender and receiver
    notify(
      from ? from.toString() : "unknown",
      `Transaction of ${amount} (${type}) successful. Fee: ${fee}`
    );
    if (to && ["send", "cash_in", "add_money"].includes(type)) {
      notify(to.toString(), `You received ৳${amount} via ${type}`);
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
