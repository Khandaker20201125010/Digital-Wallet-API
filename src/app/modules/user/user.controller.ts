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

// Update the updateUser function to handle file uploads
const updateUser = catchAsync(async (req: Request, res: Response) => {
    let userId;
    
    // Handle both /:id and /me routes
    if (req.params.id) {
        userId = req.params.id;
    } else {
        // For /me route, use the authenticated user's ID
        const verifiedToken = req.user as JwtPayload;
        userId = verifiedToken.userId;
    }

    const payload = req.body;
    
    // If a file was uploaded, add the file path to the payload
    if (req.file) {
        payload.picture = (req.file as any).path; // Cloudinary returns the file path
    }

    const user = await UserService.updateUser(userId, payload, req.user as JwtPayload);

    sendResponse(res, {
        success: true,
        statusCode: httpStatus.OK, // Use OK (200) instead of CREATED (201) for updates
        message: "User Updated Successfully",
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
