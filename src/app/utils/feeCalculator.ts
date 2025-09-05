import { TransactionType } from "../modules/transaction/transaction.interface";

const feeRates: Record<TransactionType, number> = {
  add_money: 0,
  withdraw: 0.1,   // 10% for normal users
  send: 0.01,
  cash_in: 0.02,
  cash_out: 0.1,   // 10% for normal users
};

// Agent discounts
const agentDiscounts: Record<TransactionType, number> = {
  withdraw: 0.07, // 7% for agents
  cash_out: 0.05,
  add_money: 0,
  send: 0.005,
  cash_in: 0.01,
};

export const calculateFee = (
  type: TransactionType,
  amount: number,
  role: "user" | "agent" | "admin" = "user"
): number => {
  let rate = feeRates[type] || 0;

  if (role === "agent") {
    rate = agentDiscounts[type] ?? rate;
  }

  return Math.floor(amount * rate);
};
