import { TransactionType } from "../modules/transaction/transaction.interface";

const feeRates: Record<TransactionType, number> = {
  add_money: 0,
  withdraw: 0,
  send: 0.01,
  cash_in: 0.02,
  cash_out: 0.015,
};

export const calculateFee = (type: TransactionType, amount: number): number => {
  return Math.floor(amount * (feeRates[type] || 0));
};
