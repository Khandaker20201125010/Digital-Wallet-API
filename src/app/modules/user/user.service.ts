/* eslint-disable @typescript-eslint/no-explicit-any */
import bcryptjs from "bcryptjs";
import httpStatus from "http-status-codes";
import AppError from "../../errroHelpers/appError";
import { IAuthProvider, IUser, Role } from "./user.interface";
import { User } from "./user.model";
import { JwtPayload } from "jsonwebtoken";
import { envVars } from "../../config/env";
import { Wallet } from "../wallet/wallet.model";

const createUser = async (payload: Partial<IUser>) => {
  const { email, password, ...rest } = payload;

  const isUserExist = await User.findOne({ email });
  if (isUserExist) {
    throw new AppError(httpStatus.BAD_REQUEST, "User Already Exist");
  }

  const hashedPassword = await bcryptjs.hash(password as string, 10);
  const authProvider: IAuthProvider = {
    provider: "credentials",
    providerId: email as string,
  };

  const user = await User.create({
    email,
    password: hashedPassword,
    auths: [authProvider],
    role: payload.role,
    ...rest,
  });

  let wallet = null;

  if (user.role === Role.USER || user.role === Role.AGENT) {
    wallet = await Wallet.create({
      user: user._id,
      balance: 50,
    });
  }

  return {
    user,
    wallet,
  };
};

const updateUser = async (
  userId: string,
  payload: Partial<IUser>,
  decodedToken: JwtPayload
) => {
  // ...existing authorization checks...

  // Allow updating isApproved
  if (payload.isApproved !== undefined) {
    // only admin can approve/suspend
    if (
      decodedToken.role !== Role.ADMIN &&
      decodedToken.role !== Role.SUPER_ADMIN
    ) {
      throw new AppError(
        httpStatus.FORBIDDEN,
        "Not authorized to change approval"
      );
    }
       if (typeof payload.isApproved === "string") {
      payload.isApproved = payload.isApproved === "true";
    }
  }

  // If password is updated
  if (payload.password) {
    payload.password = await bcryptjs.hash(
      payload.password,
      envVars.BCRYPT_SALT_ROUND
    );



  }

  const newUpdatedUser = await User.findByIdAndUpdate(userId, payload, {
    new: true,
    runValidators: true,
  });

  return newUpdatedUser;
};

const getAllUsers = async (filters: {
  role?: string;
  isActive?: string;
  search?: string;
  isApproved?: string;
}) => {
  const query: any = {};

  if (filters.role) query.role = filters.role;

  // Convert string "true"/"false" to boolean for DB query
  if (filters.isApproved) {
    if (filters.isApproved === "true") query.isApproved = true;
    if (filters.isApproved === "false") query.isApproved = false;
  }

  if (filters.isActive) query.isActive = filters.isActive;

  if (filters.search) {
    const regex = new RegExp(
      filters.search.replace(/[.*+?^${}()|[\]\\]/g, "\\$&"),
      "i"
    );
    query.email = regex;
  }

  // NOTE: remove any further assignment that may overwrite query.isApproved
  const users = await User.find(query).select("-password");
  const totalUsers = await User.countDocuments(query);

  return { data: users, meta: { total: totalUsers } };
};


const getMe = async (userId: string) => {
  const user = await User.findById(userId).select("-password");
  return {
    data: user,
  };
};
const searchByEmail = async (email: string) => {
  // simple starts-with / contains search (case-insensitive)
  const regex = new RegExp(email.replace(/[.*+?^${}()|[\]\\]/g, "\\$&"), "i");
  return User.find({ email: regex }).select("_id name email").limit(10).lean();
};

export const UserService = {
  createUser,
  getAllUsers,
  updateUser,
  getMe,
  searchByEmail,
};
