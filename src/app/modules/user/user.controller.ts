/* eslint-disable @typescript-eslint/no-explicit-any */
import {  Request, Response } from "express";
import httpStatus from "http-status-codes";
import { UserService } from "./user.service";
import { catchAsync } from "../../utils/catchAsync";



const createUser = catchAsync(
  async (req: Request, res: Response) => {
    const user = await UserService.createUser(req.body);
   
    res.status(httpStatus.CREATED).json({
      message: "User created successfully",
      user
    })
    ;
  }
);
const getAllUsers = catchAsync(
  async (req: Request, res: Response) => {
    const users = await UserService.getAllUsers();
    
    res.status(httpStatus.OK).json({
      success: true,
      message: "Users retrieved successfully",
      data : users
      
    });
  }
);

export const userController = {
  createUser,
  getAllUsers,
};
