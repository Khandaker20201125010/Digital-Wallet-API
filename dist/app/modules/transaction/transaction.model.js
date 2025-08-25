"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Transaction = void 0;
const mongoose_1 = require("mongoose");
const transactionSchema = new mongoose_1.Schema({
    from: { type: mongoose_1.Schema.Types.ObjectId, ref: "User" },
    to: { type: mongoose_1.Schema.Types.ObjectId, ref: "User" },
    type: {
        type: String,
        enum: ["add_money", "withdraw", "send", "cash_in", "cash_out"],
        required: true,
    },
    amount: { type: Number, required: true, min: 10 },
    fee: { type: Number, default: 0 },
    status: {
        type: String,
        enum: ["pending", "completed", "failed", "reversed"],
        default: "completed",
    },
    initiatedBy: { type: mongoose_1.Schema.Types.ObjectId, ref: "User", required: true },
    initiatedRole: {
        type: String,
        enum: ["user", "agent", "admin"],
        required: true,
    },
    reference: { type: String, required: true, unique: true },
    reversedBy: { type: mongoose_1.Schema.Types.ObjectId, ref: "User" },
    reversalReason: { type: String },
}, { timestamps: true });
exports.Transaction = (0, mongoose_1.model)("Transaction", transactionSchema);
