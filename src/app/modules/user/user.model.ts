import { model, Schema } from "mongoose";
import { IAuthProvider, IUser, Role, UserStatus } from "./user.interface";

const authProviderSchema = new Schema<IAuthProvider>(
  {
    provider: { type: String, required: true },
    providerId: { type: String, required: true },
  },
  {
    _id: false,
    versionKey: false,
  }
);
const userSchema = new Schema<IUser>(
  {
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    password: { type: String },
    role: { type: String, enum: Object.values(Role), default: Role.USER },
    picture: { type: String },
    isActive: {
      type: String,
      enum: Object.values(UserStatus),
      default: UserStatus.ACTIVE,
    },
    isApproved: { type: Boolean, default: false },
    isDeleted: { type: Boolean, default: false },
    isVerified: { type: Boolean, default: false },
    auths: [authProviderSchema],
  },

  {
    timestamps: true,
    versionKey: false,
  }
);

export const User = model<IUser>("User", userSchema);
