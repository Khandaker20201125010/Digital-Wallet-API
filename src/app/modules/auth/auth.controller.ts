/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/no-unused-vars */
import { NextFunction, Request, Response } from "express";
import { catchAsync } from "../../utils/catchAsync";
import { sendResponse } from "../../utils/sendResponse";
import httpStatus from "http-status-codes";
import { AuthService } from "./auth.service";
import AppError from "../../errroHelpers/appError";
import { setAuthCookie } from "../../utils/setCookie";
import { JwtPayload } from "jsonwebtoken";
import { envVars } from "../../config/env";
import { createUsersTokens } from "../../utils/usersTokens";
import passport from "passport";
import { User } from "../user/user.model";

// Login with credentials
const credentialsLogin = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    // const loginInfo = await AuthServices.credentialsLogin(req.body)

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    passport.authenticate("local", async (err: any, user: any, info: any) => {
      if (err) {
        return next(new AppError(401, err));
      }

      if (!user) {
        return next(new AppError(401, info.message));
      }

      const userTokens = await createUsersTokens(user);

      // delete user.toObject().password

      const { password: pass, ...rest } = user.toObject();

      setAuthCookie(res, userTokens);

      sendResponse(res, {
        success: true,
        statusCode: httpStatus.OK,
        message: "User Logged In Successfully",
        data: {
          accessToken: userTokens.accessToken,
          refreshToken: userTokens.refreshToken,
          user: rest,
        },
      });
    })(req, res, next);
  }
);

const getNewAccessToken = catchAsync(async (req: Request, res: Response) => {
  const refreshToken = req.cookies.refreshToken;
  if (!refreshToken) {
    throw new AppError(
      httpStatus.BAD_REQUEST,
      "No refresh token recieved from cookies"
    );
  }
  const tokenInfo = await AuthService.getNewAccessToken(refreshToken as string);

  setAuthCookie(res, tokenInfo);

  sendResponse(res, {
    success: true,
    statusCode: httpStatus.OK,
    message: "New Access Token  Successfully",
    data: tokenInfo,
  });
});

const logout = catchAsync(async (req: Request, res: Response) => {
  res.clearCookie("accessToken", {
    httpOnly: true,
    secure: true,
    sameSite: "none",
  });
  res.clearCookie("refreshToken", {
    httpOnly: true,
    secure: true,
    sameSite: "none",
  });

  sendResponse(res, {
    success: true,
    statusCode: httpStatus.OK,
    message: "User Logged Out Successfully",
    data: null,
  });
});
const forgotPassword = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const { email } = req.body;

    await AuthService.forgotPassword(email);

    sendResponse(res, {
      success: true,
      statusCode: httpStatus.OK,
      message: "Email Sent Successfully",
      data: null,
    });
  }
);
const setPassword = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const decodedToken = req.user as JwtPayload;
    const { password } = req.body;

    await AuthService.setPassword(decodedToken.userId, password);

    sendResponse(res, {
      success: true,
      statusCode: httpStatus.OK,
      message: "Password Changed Successfully",
      data: null,
    });
  }
);
const changePassword = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const newPassword = req.body.newPassword;
    const oldPassword = req.body.oldPassword;
    const decodedToken = req.user;

    await AuthService.changePassword(
      oldPassword,
      newPassword,
      decodedToken as JwtPayload
    );

    sendResponse(res, {
      success: true,
      statusCode: httpStatus.OK,
      message: "Password Changed Successfully",
      data: null,
    });
  }
);

const resetPassword = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const decodedToken = req.user;

    await AuthService.resetPassword(req.body, decodedToken as JwtPayload);

    sendResponse(res, {
      success: true,
      statusCode: httpStatus.OK,
      message: "Password Changed Successfully",
      data: null,
    });
  }
);
export const googleCallbackController = async (req: Request, res: Response) => {
  const user: any = req.user;

  if (user) {
    const tokenInfo = createUsersTokens(user);
    setAuthCookie(res, tokenInfo);

    // ⬇️ Pass "newUser" flag + email in redirect
    const isNewUser = user._newUser ? "true" : "false";
    return res.redirect(
      `${envVars.FRONTEND_URL}/?newUser=${isNewUser}&email=${user.email}`
    );
  }

  throw new AppError(httpStatus.BAD_REQUEST, "Google login failed");
};


export const checkUserExists = catchAsync(async (req: Request, res: Response) => {
  const { email } = req.body;

  if (!email) {
    console.log("❌ No email provided");
    res.status(400).json({ exists: false, message: "Email is required" });
    return;
  }

  const user = await User.findOne({ email });
  console.log("🔍 checkUserExists:", email, "→", user ? "FOUND" : "NOT FOUND");

  if (user) {
    res.status(200).json({ exists: true });
    return;
  }

  res.status(200).json({ exists: false });
});

const updateUserByEmail = catchAsync(async (req, res) => {
  console.log("📩 updateUserByEmail called with body:", req.body);

  const { email, role } = req.body;

  if (!email || !role) {
    console.error("❌ Missing email or role:", { email, role });
    throw new AppError(400, 'Email and role are required');
  }

  const user = await User.findOneAndUpdate(
    { email },
    { role },
    { new: true }
  );

  if (!user) {
    console.error("❌ No user found for email:", email);
    throw new AppError(404, 'User not found');
  }

  console.log("✅ User updated:", user);

  sendResponse(res, {
    statusCode: 200,
    success: true,
    message: 'User updated successfully',
    data: user,
  });
});



export const AuthControllers = {
  credentialsLogin,
  getNewAccessToken,
  logout,
  resetPassword,
  googleCallbackController,
  forgotPassword,
  changePassword,
  setPassword,
  checkUserExists,
  updateUserByEmail
};
