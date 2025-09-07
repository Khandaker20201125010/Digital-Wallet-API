import { Request, Response } from "express";
import { catchAsync } from "../../utils/catchAsync";
import { DepositRequestService } from "./depositRequest.service";
import { sendResponse } from "../../utils/sendResponse";
import httpStatus from "http-status-codes";

// POST /deposit-requests  (USER)
const createRequest = catchAsync(async (req: Request, res: Response) => {
  const userId = (req.user as { userId: string }).userId;
  const { amount, note } = req.body;
  const result = await DepositRequestService.createRequest(userId, amount, note);
  sendResponse(res, {
    statusCode: httpStatus.CREATED,
    success: true,
    message: "Deposit request created",
    data: result,
  });
});

// GET /deposit-requests/my
const getMyRequests = catchAsync(async (req: Request, res: Response) => {
  const userId = (req.user as { userId: string }).userId;
  const page = Number(req.query.page ?? 1);
  const limit = Number(req.query.limit ?? 20);
  const result = await DepositRequestService.getRequestsByUser(userId, page, limit);
  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "Your deposit requests",
    data: result,
  });
});

// AGENT: GET /deposit-requests/pending
const getPending = catchAsync(async (_req: Request, res: Response) => {
  const page = Number(_req.query.page ?? 1);
  const limit = Number(_req.query.limit ?? 50);
  const result = await DepositRequestService.getPendingRequests(page, limit);
  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "Pending deposit requests",
    data: result,
  });
});

// AGENT: PATCH /deposit-requests/:id/approve
const approve = catchAsync(async (req: Request, res: Response) => {
  const agentId = (req.user as { userId: string }).userId;
  const { id } = req.params;
  const result = await DepositRequestService.approveRequest(id, agentId);
  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "Deposit request approved and cash-in created",
    data: result,
  });
});

// AGENT: PATCH /deposit-requests/:id/reject
const reject = catchAsync(async (req: Request, res: Response) => {
  const agentId = (req.user as { userId: string }).userId;
  const { id } = req.params;
  const { reason } = req.body;
  const result = await DepositRequestService.rejectRequest(id, agentId, reason);
  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "Deposit request rejected",
    data: result,
  });
});

export const DepositRequestController = {
  createRequest,
  getMyRequests,
  getPending,
  approve,
  reject,
};
