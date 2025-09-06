import { Request, Response } from "express";
import { catchAsync } from "../../utils/catchAsync";
import { TransactionService } from "./transaction.service";
import { sendResponse } from "../../utils/sendResponse";
import httpStatus from "http-status-codes";

//  CREATE TRANSACTION 
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

// MY TRANSACTIONS 
const getMyTransactions = catchAsync(async (req: Request, res: Response) => {
  const userId = (req.user as { userId: string }).userId;

  const page = Number(req.query.page ?? 1);
  const limit = Number(req.query.limit ?? 10);
  const type = req.query.type as string | undefined;
  const startDate = req.query.startDate as string | undefined;
  const endDate = req.query.endDate as string | undefined;

  const filters = { type, startDate, endDate };

  const result = await TransactionService.getMyTransactions(userId, filters, page, limit);

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "Your transaction history retrieved",
    data: result,
  });
});

// ADMIN/AGENT ALL TRANSACTIONS 
const getAllTransactions = catchAsync(async (req: Request, res: Response) => {
  const page = Number(req.query.page ?? 1);
  const limit = Number(req.query.limit ?? 20);
  const type = req.query.type as string | undefined;
  const startDate = req.query.startDate as string | undefined;
  const endDate = req.query.endDate as string | undefined;

  const filters = { type, startDate, endDate };

  const result = await TransactionService.getAllTransactions(filters, page, limit);

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
