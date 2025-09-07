import { model, Schema } from "mongoose";


export type DepositRequestStatus = "pending" | "approved" | "rejected";

const DepositRequestSchema = new Schema(
  {
    user: { type: Schema.Types.ObjectId, ref: "User", required: true }, // requestor
    amount: { type: Number, required: true },
    status: { type: String, enum: ["pending", "approved", "rejected"], default: "pending" },
    agent: { type: Schema.Types.ObjectId, ref: "User", default: null }, // agent who handled
    transaction: { type: Schema.Types.ObjectId, ref: "Transaction", default: null }, // link after approval
    note: { type: String, default: "" },
  },
  { timestamps: true }
);

export const DepositRequest = model("DepositRequest", DepositRequestSchema);
