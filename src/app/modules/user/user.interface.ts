import { Types } from "mongoose";

export enum Role {
    SUPER_ADMIN = "SUPER_ADMIN",
    ADMIN = "ADMIN",
    USER = "USER",
    AGENT = "AGENT",
}

export interface IAuthProvider {
  provider: string;
  providerId: string;
}

export enum UserStatus {
  ACTIVE = "ACTIVE",
  INACTIVE = "INACTIVE",
  BLOCKED = "BLOCKED",
}

export interface IUser {
  _id?: string;
  name: string;
  email: string;
  password: string;
  role: Role;
  picture?: string;
  isActive?: UserStatus;
  isApproved?: boolean;
  isDeleted?: boolean;
  isVerified?: boolean;
  auths?: IAuthProvider[];
  agent?:Types.ObjectId[]
  createdAt?: Date;
  updatedAt?: Date;
}
