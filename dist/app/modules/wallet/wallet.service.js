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
exports.WalletService = void 0;
const mongoose_1 = __importDefault(require("mongoose"));
const wallet_model_1 = require("./wallet.model");
const getWalletByUserId = (userId) => __awaiter(void 0, void 0, void 0, function* () {
    return yield wallet_model_1.Wallet.findOne({ user: new mongoose_1.default.Types.ObjectId(userId) });
});
const getFormattedWalletByUserId = (userId) => __awaiter(void 0, void 0, void 0, function* () {
    const wallet = yield wallet_model_1.Wallet.findOne({ user: userId }).populate("user", "name email");
    if (!wallet)
        return null;
    return {
        walletId: wallet._id,
        userId: wallet.user._id,
        balance: wallet.balance,
        currency: wallet.currency,
        status: wallet.status,
    };
});
const getWalletById = (walletId) => __awaiter(void 0, void 0, void 0, function* () {
    return yield wallet_model_1.Wallet.findById(walletId).populate("user");
});
const getAllWallets = () => __awaiter(void 0, void 0, void 0, function* () {
    return yield wallet_model_1.Wallet.find().populate("user");
});
const updateWalletStatus = (walletId, status) => __awaiter(void 0, void 0, void 0, function* () {
    return yield wallet_model_1.Wallet.findByIdAndUpdate(walletId, { status }, { new: true });
});
exports.WalletService = {
    getWalletByUserId,
    getWalletById,
    getAllWallets,
    updateWalletStatus,
    getFormattedWalletByUserId,
};
