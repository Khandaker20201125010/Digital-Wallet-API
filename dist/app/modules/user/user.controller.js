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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.userController = void 0;
const http_status_codes_1 = __importDefault(require("http-status-codes"));
const user_service_1 = require("./user.service");
const catchAsync_1 = require("../../utils/catchAsync");
const sendResponse_1 = require("../../utils/sendResponse");
const appError_1 = __importDefault(require("../../errroHelpers/appError"));
// Create user
const createUser = (0, catchAsync_1.catchAsync)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const user = yield user_service_1.UserService.createUser(req.body);
    (0, sendResponse_1.sendResponse)(res, {
        success: true,
        message: "User created successfully",
        statusCode: http_status_codes_1.default.CREATED,
        data: user,
    });
}));
// Update user
const updateUser = (0, catchAsync_1.catchAsync)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    const userId = (_a = req.user) === null || _a === void 0 ? void 0 : _a.userId;
    if (!userId) {
        throw new appError_1.default(http_status_codes_1.default.UNAUTHORIZED, "User not authenticated");
    }
    const payload = req.body;
    const user = yield user_service_1.UserService.updateUser(userId, payload, req.user);
    (0, sendResponse_1.sendResponse)(res, {
        success: true,
        message: "User Updated Successfully",
        statusCode: http_status_codes_1.default.OK, // Changed from CREATED to OK for updates
        data: user,
    });
}));
// Get all users
const getAllUsers = (0, catchAsync_1.catchAsync)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const result = yield user_service_1.UserService.getAllUsers();
    (0, sendResponse_1.sendResponse)(res, {
        success: true,
        message: "All Users Retrieved Successfully",
        statusCode: http_status_codes_1.default.CREATED,
        data: result.data,
        meta: result.meta,
    });
}));
const getMe = (0, catchAsync_1.catchAsync)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const decodedToken = req.user;
    const result = yield user_service_1.UserService.getMe(decodedToken.userId);
    (0, sendResponse_1.sendResponse)(res, {
        success: true,
        statusCode: http_status_codes_1.default.CREATED,
        message: "Your profile Retrieved Successfully",
        data: result.data,
    });
}));
exports.userController = {
    createUser,
    getAllUsers,
    updateUser,
    getMe,
};
