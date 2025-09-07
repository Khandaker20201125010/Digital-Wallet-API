"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.DepositRequest = void 0;
const mongoose_1 = require("mongoose");
const DepositRequestSchema = new mongoose_1.Schema({
    user: { type: mongoose_1.Schema.Types.ObjectId, ref: "User", required: true }, // requestor
    amount: { type: Number, required: true },
    status: { type: String, enum: ["pending", "approved", "rejected"], default: "pending" },
    agent: { type: mongoose_1.Schema.Types.ObjectId, ref: "User", default: null }, // agent who handled
    transaction: { type: mongoose_1.Schema.Types.ObjectId, ref: "Transaction", default: null }, // link after approval
    note: { type: String, default: "" },
}, { timestamps: true });
exports.DepositRequest = (0, mongoose_1.model)("DepositRequest", DepositRequestSchema);
