import { Request, Response } from "express";
import httpStatus from "http-status-codes";
import { UserService } from "./user.service";
import { catchAsync } from "../../utils/catchAsync";
import { sendResponse } from "../../utils/sendResponse";
import { JwtPayload } from "jsonwebtoken";
import AppError from "../../errroHelpers/appError";

// Create user

const createUser = catchAsync(async (req: Request, res: Response) => {
  const user = await UserService.createUser(req.body);
  sendResponse(res, {
    success: true,
    message: "User created successfully",
    statusCode: httpStatus.CREATED,
    data: user,
  });
});

// Update user

const updateUser = catchAsync(async (req: Request, res: Response) => {
  const userId = (req.user as JwtPayload)?.userId;

  if (!userId) {
    throw new AppError(httpStatus.UNAUTHORIZED, "User not authenticated");
  }

  const payload = req.body;

  const user = await UserService.updateUser(
    userId,
    payload,
    req.user as JwtPayload
  );

  sendResponse(res, {
    success: true,
    message: "User Updated Successfully",
    statusCode: httpStatus.OK, // Changed from CREATED to OK for updates
    data: user,
  });
});

// Get all users

const getAllUsers = catchAsync(async (req: Request, res: Response) => {
  const result = await UserService.getAllUsers();

  sendResponse(res, {
    success: true,
    message: "All Users Retrieved Successfully",
    statusCode: httpStatus.CREATED,
    data: result.data,
    meta: result.meta,
  });
});

const getMe = catchAsync(async (req: Request, res: Response) => {
  const decodedToken = req.user as JwtPayload;
  const result = await UserService.getMe(decodedToken.userId);

  sendResponse(res, {
    success: true,
    statusCode: httpStatus.CREATED,
    message: "Your profile Retrieved Successfully",
    data: result.data,
  });
});

export const userController = {
  createUser,
  getAllUsers,
  updateUser,
  getMe,
};
