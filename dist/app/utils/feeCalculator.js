"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.calculateFee = void 0;
const feeRates = {
    add_money: 0,
    withdraw: 0,
    send: 0.01,
    cash_in: 0.02,
    cash_out: 0.015,
};
const calculateFee = (type, amount) => {
    return Math.floor(amount * (feeRates[type] || 0));
};
exports.calculateFee = calculateFee;
