import { Request, Response } from "express";
import { catchAsync } from "../../utils/catchAsync";
import { TransactionService } from "./transaction.service";
import { sendResponse } from "../../utils/sendResponse";
import httpStatus from "http-status-codes";

const createTransaction = catchAsync(async (req: Request, res: Response) => {
  const user = req.user as { userId: string; role: string };

  const payload = {
    ...req.body,
    from: user.userId,
    initiatedBy: user.userId,
    initiatedRole: user.role.toLowerCase(),
    reference: `TXN-${Date.now()}-${Math.floor(Math.random() * 100000)}`,
  };

  const result = await TransactionService.createTransaction(payload);

  sendResponse(res, {
    statusCode: httpStatus.CREATED,
    success: true,
    message: "Transaction created successfully",
    data: result,
  });
});

const getMyTransactions = catchAsync(async (req: Request, res: Response) => {
  const userId = (req.user as { userId: string }).userId;

  const result = await TransactionService.getMyTransactions(userId);
  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "Your transaction history retrieved",
    data: result,
  });
});

const getAllTransactions = catchAsync(async (req: Request, res: Response) => {
  const result = await TransactionService.getAllTransactions();

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "All transactions retrieved",
    data: result,
  });
});

export const TransactionController = {
  createTransaction,
  getMyTransactions,
  getAllTransactions,
};
