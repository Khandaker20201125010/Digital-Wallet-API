"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.createTransactionZodSchema = void 0;
const zod_1 = __importDefault(require("zod"));
exports.createTransactionZodSchema = zod_1.default.object({
    to: zod_1.default.string().optional(),
    type: zod_1.default.enum(["add_money", "withdraw", "send", "cash_in", "cash_out"]),
    amount: zod_1.default.number().positive(),
    fee: zod_1.default.number().optional(),
});
