import bcryptjs from "bcryptjs";
import AppError from "../../errroHelpers/appError";
import { IUser } from "../user/user.interface";
import { User } from "../user/user.model";
import httpStatus from "http-status-codes";
import { generateToken } from "../../utils/jwt";
import { envVars } from "../../config/env";
const credentialsLogin = async (payload: Partial<IUser>) => {
  const { email, password } = payload;

  const isUserExist = await User.findOne({ email });

  if (!isUserExist) {
    throw new AppError(httpStatus.BAD_REQUEST, "Email does not  exists");
  }

  const isPasswordMatch = await bcryptjs.compare(
    password as string,
    isUserExist.password as string
  );
  if (!isPasswordMatch) {
    throw new AppError(httpStatus.BAD_REQUEST, "Incorrect password");
  }
  const jwtPayload = {
    userId: isUserExist._id,
    email: isUserExist.email,
    role: isUserExist.role,
  };
  const accessToken = generateToken(jwtPayload, envVars.JWT_ACCESS_SECRET as string, envVars.JWT_ACCESS_EXPIRES as string);
   

  const refreshToken = generateToken(jwtPayload, envVars.JWT_REFRESH_SECRET as string, envVars.JWT_REFRESH_EXPIRES as string);

  return {
   accessToken,
   refreshToken,
   user : isUserExist,
  };
};

export const AuthService = {
  credentialsLogin,
};
