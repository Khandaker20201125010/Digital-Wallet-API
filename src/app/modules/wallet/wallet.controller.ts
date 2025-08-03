import { Request, Response } from "express";
import httpStatus from "http-status-codes";
import { catchAsync } from "../../utils/catchAsync";
import { sendResponse } from "../../utils/sendResponse";
import { WalletService } from "./wallet.service";

const getMyWallet = catchAsync(async (req: Request, res: Response) => {
  const userId = (req.user as { userId: string }).userId;
  const data = await WalletService.getFormattedWalletByUserId(userId);

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "Wallet retrieved successfully",
    data,
  });
});
// Admin: Get all wallets
const getAllWallets = catchAsync(async (_req: Request, res: Response) => {
  const result = await WalletService.getAllWallets();

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "All wallets fetched successfully",
    data: result,
  });
});

// Admin: Get wallet by ID
const getWalletById = catchAsync(async (req: Request, res: Response) => {
  const { id } = req.params;
  const result = await WalletService.getWalletById(id);

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "Wallet fetched successfully",
    data: result,
  });
});

// Admin: Block/unblock wallet
const updateWalletStatus = catchAsync(async (req: Request, res: Response) => {
  const { id } = req.params;
  const { status } = req.body;

  if (!["blocked", "active"].includes(status)) {
    res.status(httpStatus.BAD_REQUEST).json({
      success: false,
      message: "Invalid wallet status. Must be 'blocked' or 'active'.",
    });
    return;
  }

  const result = await WalletService.updateWalletStatus(id, status);

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: `Wallet status updated to ${status}`,
    data: result,
  });
});

export const WalletController = {
  getMyWallet,
  getAllWallets,
  getWalletById,
  updateWalletStatus,
};
