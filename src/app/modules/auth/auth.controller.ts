import { Request, Response } from "express";
import { catchAsync } from "../../utils/catchAsync"
import { sendResponse } from "../../utils/sendResponse";
import httpStatus from "http-status-codes";
import { AuthService } from "./auth.service";
const credentialsLogin = catchAsync(async (req: Request, res: Response) => {
  
const loginInfo = await AuthService.credentialsLogin(req.body);

  sendResponse(res, {
    success: true,
    message: "Login successfully",
    statusCode: httpStatus.OK,
    data: loginInfo,
  });
})

export const AuthControllers = {
    credentialsLogin,
}