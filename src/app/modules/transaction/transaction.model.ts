import { model, Schema } from "mongoose";
import { ITransaction } from "./transaction.interface";

const transactionSchema = new Schema(
  {
    from: { type: Schema.Types.ObjectId, ref: "User" },
    to: { type: Schema.Types.ObjectId, ref: "User" },
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
    initiatedBy: { type: Schema.Types.ObjectId, ref: "User", required: true },
    initiatedRole: {
      type: String,
      enum: ["user", "agent", "admin"],
      required: true,
    },
    reference: { type: String, required: true, unique: true },
    reversedBy: { type: Schema.Types.ObjectId, ref: "User" },
    reversalReason: { type: String },
  },
  { timestamps: true }
);

export const Transaction = model<ITransaction>(
  "Transaction",
  transactionSchema
);
