
/* eslint-disable @typescript-eslint/no-explicit-any */
import { Request, Response } from "express";
import httpStatus from "http-status-codes";
import { UserService } from "./user.service";
import { catchAsync } from "../../utils/catchAsync";
import { sendResponse } from "../../utils/sendResponse";
import { JwtPayload } from "jsonwebtoken";



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

const updateUser = catchAsync(
  async (req: Request, res: Response) => {
    const userId = req.params.id;

    const verifiedToken = req.user;

    const payload = req.body;
    const user = await UserService.updateUser(userId, payload, verifiedToken as JwtPayload);
    sendResponse(res, {
      success: true,
      message: "User Updated Successfully",
      statusCode: httpStatus.CREATED,
      data: user,
    });
  }
);

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

export const userController = {
  createUser,
  getAllUsers,
  updateUser,
};
