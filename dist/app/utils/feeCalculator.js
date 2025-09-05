"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.calculateFee = void 0;
const feeRates = {
    add_money: 0,
    withdraw: 0.1, // 10% for normal users
    send: 0.01,
    cash_in: 0.02,
    cash_out: 0.1, // 10% for normal users
};
// Agent discounts
const agentDiscounts = {
    withdraw: 0.07, // 7% for agents
    cash_out: 0.05,
    add_money: 0,
    send: 0.005,
    cash_in: 0.01,
};
const calculateFee = (type, amount, role = "user") => {
    var _a;
    let rate = feeRates[type] || 0;
    if (role === "agent") {
        rate = (_a = agentDiscounts[type]) !== null && _a !== void 0 ? _a : rate;
    }
    return Math.floor(amount * rate);
};
exports.calculateFee = calculateFee;
