import z from "zod";

export const createTransactionZodSchema = z.object({
  to: z.string().optional(),
  type: z.enum(["add_money", "withdraw", "send", "cash_in", "cash_out"]),
  amount: z.number().positive(),
  fee: z.number().optional(),
});
