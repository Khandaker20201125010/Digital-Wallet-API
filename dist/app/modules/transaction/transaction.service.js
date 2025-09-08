"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.TransactionService = void 0;
/* eslint-disable @typescript-eslint/no-explicit-any */
const mongoose_1 = __importDefault(require("mongoose"));
const wallet_model_1 = require("../wallet/wallet.model");
const transaction_model_1 = require("./transaction.model");
const feeCalculator_1 = require("../../utils/feeCalculator");
const notifier_1 = require("../../utils/notifier");
const createTransaction = (payload) => __awaiter(void 0, void 0, void 0, function* () {
    const session = yield mongoose_1.default.startSession();
    session.startTransaction();
    try {
        const { from, to, amount, type, initiatedBy, initiatedRole, reference } = payload;
        if (!initiatedBy || !initiatedRole || !reference) {
            throw new Error("Missing required transaction metadata");
        }
        const senderWallet = yield wallet_model_1.Wallet.findOne({ user: from }).session(session);
        if (!senderWallet)
            throw new Error("Sender wallet not found");
        if (senderWallet.status === "blocked")
            throw new Error("Sender wallet is blocked");
        const userWallet = to
            ? yield wallet_model_1.Wallet.findOne({ user: to }).session(session)
            : null;
        if (userWallet && userWallet.status === "blocked") {
            throw new Error("Target wallet is blocked");
        }
        // Calculate fee
        const fee = (0, feeCalculator_1.calculateFee)(type, amount, initiatedRole);
        // ---------------- USER WITHDRAW ----------------
        if (type === "withdraw") {
            if (senderWallet.balance < amount + fee)
                throw new Error("Insufficient balance");
            senderWallet.balance -= amount + fee;
            yield senderWallet.save({ session });
        }
        // ---------------- AGENT CASH-OUT ----------------
        else if (type === "cash_out") {
            if (!userWallet)
                throw new Error("Target user required for cash_out");
            if (userWallet.balance < amount)
                throw new Error("User has insufficient balance");
            // Deduct from user wallet
            userWallet.balance -= amount;
            yield userWallet.save({ session });
            // Agent pays fee (optional rule)
            if (initiatedRole === "agent") {
                if (senderWallet.balance < fee)
                    throw new Error("Agent has insufficient balance for fee");
                senderWallet.balance -= fee;
                yield senderWallet.save({ session });
            }
        }
        // ---------------- CASH-IN / SEND / ADD-MONEY ----------------
        else if (["cash_in", "add_money", "send"].includes(type)) {
            let totalDebit = amount;
            if (initiatedRole === "user")
                totalDebit += fee;
            if (senderWallet.balance < totalDebit)
                throw new Error("Insufficient balance including fee");
            senderWallet.balance -= totalDebit;
            yield senderWallet.save({ session });
            if (to) {
                const receiverWallet = yield wallet_model_1.Wallet.findOne({ user: to }).session(session);
                if (!receiverWallet)
                    throw new Error("Receiver wallet not found");
                receiverWallet.balance += amount;
                yield receiverWallet.save({ session });
            }
        }
        // ---------------- RECORD TRANSACTION ----------------
        const transaction = yield transaction_model_1.Transaction.create([Object.assign(Object.assign({}, payload), { fee })], {
            session,
        });
        (0, notifier_1.notify)(from.toString(), `Transaction of ${amount} (${type}) successful. Fee: ${fee}`);
        if (to && ["send", "cash_in", "add_money"].includes(type)) {
            (0, notifier_1.notify)(to.toString(), `You received ₹${amount} via ${type}`);
        }
        yield session.commitTransaction();
        session.endSession();
        return transaction[0];
    }
    catch (error) {
        yield session.abortTransaction();
        session.endSession();
        throw error;
    }
});
const getMyTransactions = (userId_1, filters_1, ...args_1) => __awaiter(void 0, [userId_1, filters_1, ...args_1], void 0, function* (userId, filters, page = 1, limit = 10) {
    const query = {
        $or: [{ from: userId }, { to: userId }],
    };
    if (filters.type)
        query.type = filters.type;
    if (filters.startDate && filters.endDate) {
        query.createdAt = {
            $gte: new Date(filters.startDate),
            $lte: new Date(filters.endDate),
        };
    }
    const transactions = yield transaction_model_1.Transaction.find(query)
        .sort({ createdAt: -1 })
        .skip((page - 1) * limit)
        .limit(limit);
    const total = yield transaction_model_1.Transaction.countDocuments(query);
    return { transactions, total, page, limit };
});
// transaction.service.ts
const getAllTransactions = (filters_1, ...args_1) => __awaiter(void 0, [filters_1, ...args_1], void 0, function* (filters, page = 1, limit = 10) {
    const query = {};
    if (filters.type)
        query.type = filters.type;
    if (filters.status)
        query.status = filters.status;
    if (filters.startDate && filters.endDate) {
        query.createdAt = {
            $gte: new Date(filters.startDate),
            $lte: new Date(filters.endDate),
        };
    }
    if (filters.minAmount !== undefined || filters.maxAmount !== undefined) {
        query.amount = {};
        if (filters.minAmount !== undefined)
            query.amount.$gte = filters.minAmount;
        if (filters.maxAmount !== undefined)
            query.amount.$lte = filters.maxAmount;
    }
    const transactions = yield transaction_model_1.Transaction.find(query)
        .populate("from to", "name email")
        .sort({ createdAt: -1 })
        .skip((page - 1) * limit)
        .limit(limit);
    const total = yield transaction_model_1.Transaction.countDocuments(query);
    return { transactions, total, page, limit };
});
exports.TransactionService = {
    createTransaction,
    getMyTransactions,
    getAllTransactions,
};
