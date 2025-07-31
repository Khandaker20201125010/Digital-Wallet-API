import { Types } from "mongoose";

export enum Role {
  SUPER_ADMIN = "SUPER_ADMIN",
  ADMIN = "ADMIN",
  USER = "USER",
  AGENT = "AGENT",
}

export interface IAuthProvider {
  provider: "google" | "credentials";
  providerId: string;
}

export enum UserStatus {
  ACTIVE = "ACTIVE",
  INACTIVE = "INACTIVE",
  BLOCKED = "BLOCKED",
}

export enum IsActive {
    ACTIVE = "ACTIVE",
    INACTIVE = "INACTIVE",
    BLOCKED = "BLOCKED"
}

export interface IUser {
  _id?: string;
  name: string;
  email: string;
  password: string;
  phone?: string;
  role: Role;
  picture?: string;
  isActive?: IsActive;
  isApproved?: boolean;
  isDeleted?: boolean;
  isVerified?: boolean;
  auths?: IAuthProvider[];
  agent?: Types.ObjectId[];
  createdAt?: Date;
  updatedAt?: Date;
}
