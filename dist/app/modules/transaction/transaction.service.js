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
            throw new Error("Missing required transaction metadata (initiatedBy, role, or reference)");
        }
        const senderWallet = yield wallet_model_1.Wallet.findOne({ user: from }).session(session);
        if (!senderWallet)
            throw new Error("Sender wallet not found");
        if (senderWallet.status === "blocked") {
            throw new Error("Sender wallet is blocked. Transaction not allowed.");
        }
        // calculate fee
        const fee = (0, feeCalculator_1.calculateFee)(type, amount);
        // total deduction from sender if applicable
        const totalDebit = amount + fee;
        // Deduct from sender
        if (["send", "withdraw", "cash_out"].includes(type)) {
            if (senderWallet.balance < totalDebit) {
                throw new Error("Insufficient balance (including fee)");
            }
            senderWallet.balance -= totalDebit;
            yield senderWallet.save({ session });
        }
        // Special case for cash_out from target wallet
        if (type === "cash_out") {
            if (!to)
                throw new Error("Target user is required for cash_out");
            const userWallet = yield wallet_model_1.Wallet.findOne({ user: to }).session(session);
            if (!userWallet)
                throw new Error("User wallet not found for cash_out");
            if (userWallet.status === "blocked") {
                throw new Error("Target user's wallet is blocked. Cannot cash out.");
            }
            if (userWallet.balance < amount) {
                throw new Error("User has insufficient balance for cash_out");
            }
            userWallet.balance -= amount;
            yield userWallet.save({ session });
        }
        // Deposit to receiver (if any)
        if (["send", "add_money", "cash_in"].includes(type)) {
            if (to) {
                const receiverWallet = yield wallet_model_1.Wallet.findOne({ user: to }).session(session);
                if (!receiverWallet)
                    throw new Error("Receiver wallet not found");
                if (receiverWallet.status === "blocked") {
                    throw new Error("Receiver wallet is blocked. Transaction not allowed.");
                }
                receiverWallet.balance += amount;
                yield receiverWallet.save({ session });
            }
            else if (type === "add_money") {
                senderWallet.balance += amount;
                yield senderWallet.save({ session });
            }
        }
        const transaction = yield transaction_model_1.Transaction.create([
            Object.assign(Object.assign({}, payload), { fee }),
        ], { session });
        // Notify sender and receiver
        (0, notifier_1.notify)(from ? from.toString() : "unknown", `Transaction of ${amount} (${type}) successful. Fee: ${fee}`);
        if (to && ["send", "cash_in", "add_money"].includes(type)) {
            (0, notifier_1.notify)(to.toString(), `You received ৳${amount} via ${type}`);
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
const getMyTransactions = (userId) => __awaiter(void 0, void 0, void 0, function* () {
    return yield transaction_model_1.Transaction.find({
        $or: [{ from: userId }, { to: userId }],
    }).sort({ createdAt: -1 });
});
const getAllTransactions = () => __awaiter(void 0, void 0, void 0, function* () {
    return yield transaction_model_1.Transaction.find()
        .populate("from to", "name email")
        .sort({ createdAt: -1 });
});
exports.TransactionService = {
    createTransaction,
    getMyTransactions,
    getAllTransactions,
};
