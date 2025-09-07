"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __rest = (this && this.__rest) || function (s, e) {
    var t = {};
    for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p) && e.indexOf(p) < 0)
        t[p] = s[p];
    if (s != null && typeof Object.getOwnPropertySymbols === "function")
        for (var i = 0, p = Object.getOwnPropertySymbols(s); i < p.length; i++) {
            if (e.indexOf(p[i]) < 0 && Object.prototype.propertyIsEnumerable.call(s, p[i]))
                t[p[i]] = s[p[i]];
        }
    return t;
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.UserService = void 0;
/* eslint-disable @typescript-eslint/no-explicit-any */
const bcryptjs_1 = __importDefault(require("bcryptjs"));
const http_status_codes_1 = __importDefault(require("http-status-codes"));
const appError_1 = __importDefault(require("../../errroHelpers/appError"));
const user_interface_1 = require("./user.interface");
const user_model_1 = require("./user.model");
const env_1 = require("../../config/env");
const wallet_model_1 = require("../wallet/wallet.model");
const createUser = (payload) => __awaiter(void 0, void 0, void 0, function* () {
    const { email, password } = payload, rest = __rest(payload, ["email", "password"]);
    const isUserExist = yield user_model_1.User.findOne({ email });
    if (isUserExist) {
        throw new appError_1.default(http_status_codes_1.default.BAD_REQUEST, "User Already Exist");
    }
    const hashedPassword = yield bcryptjs_1.default.hash(password, 10);
    const authProvider = {
        provider: "credentials",
        providerId: email,
    };
    const user = yield user_model_1.User.create(Object.assign({ email, password: hashedPassword, auths: [authProvider], role: payload.role }, rest));
    let wallet = null;
    if (user.role === user_interface_1.Role.USER || user.role === user_interface_1.Role.AGENT) {
        wallet = yield wallet_model_1.Wallet.create({
            user: user._id,
            balance: 50,
        });
    }
    return {
        user,
        wallet,
    };
});
const updateUser = (userId, payload, decodedToken) => __awaiter(void 0, void 0, void 0, function* () {
    // ...existing authorization checks...
    // Allow updating isApproved
    if (payload.isApproved !== undefined) {
        // only admin can approve/suspend
        if (decodedToken.role !== user_interface_1.Role.ADMIN &&
            decodedToken.role !== user_interface_1.Role.SUPER_ADMIN) {
            throw new appError_1.default(http_status_codes_1.default.FORBIDDEN, "Not authorized to change approval");
        }
        if (typeof payload.isApproved === "string") {
            payload.isApproved = payload.isApproved === "true";
        }
    }
    // If password is updated
    if (payload.password) {
        payload.password = yield bcryptjs_1.default.hash(payload.password, env_1.envVars.BCRYPT_SALT_ROUND);
    }
    const newUpdatedUser = yield user_model_1.User.findByIdAndUpdate(userId, payload, {
        new: true,
        runValidators: true,
    });
    return newUpdatedUser;
});
const getAllUsers = (filters) => __awaiter(void 0, void 0, void 0, function* () {
    const query = {};
    if (filters.role)
        query.role = filters.role;
    // Convert string "true"/"false" to boolean for DB query
    if (filters.isApproved) {
        if (filters.isApproved === "true")
            query.isApproved = true;
        if (filters.isApproved === "false")
            query.isApproved = false;
    }
    if (filters.isActive)
        query.isActive = filters.isActive;
    if (filters.search) {
        const regex = new RegExp(filters.search.replace(/[.*+?^${}()|[\]\\]/g, "\\$&"), "i");
        query.email = regex;
    }
    // NOTE: remove any further assignment that may overwrite query.isApproved
    const users = yield user_model_1.User.find(query).select("-password");
    const totalUsers = yield user_model_1.User.countDocuments(query);
    return { data: users, meta: { total: totalUsers } };
});
const getMe = (userId) => __awaiter(void 0, void 0, void 0, function* () {
    const user = yield user_model_1.User.findById(userId).select("-password");
    return {
        data: user,
    };
});
const searchByEmail = (email) => __awaiter(void 0, void 0, void 0, function* () {
    // simple starts-with / contains search (case-insensitive)
    const regex = new RegExp(email.replace(/[.*+?^${}()|[\]\\]/g, "\\$&"), "i");
    return user_model_1.User.find({ email: regex }).select("_id name email").limit(10).lean();
});
exports.UserService = {
    createUser,
    getAllUsers,
    updateUser,
    getMe,
    searchByEmail,
};
