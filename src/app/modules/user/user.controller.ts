import { NextFunction, Request, Response } from "express";
import httpStatus from "http-status-codes";
import { UserService } from "./user.service";
const createUser = async (req: Request, res: Response , next:NextFunction) => {
  try {
    const user = await UserService.createUser(req.body);

    res.status(httpStatus.CREATED).json({
      message: "User created successfully",
      user,
    });

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
  } catch (err: any) {
    console.log("Error creating user:", err);
    next(err)
  }
};

export const userController = {
  createUser,
};
