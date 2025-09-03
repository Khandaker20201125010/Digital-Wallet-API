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
// Update the updateUser function to handle file uploads
const updateUser = (0, catchAsync_1.catchAsync)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    let userId;
    // Handle both /:id and /me routes
    if (req.params.id) {
        userId = req.params.id;
    }
    else {
        // For /me route, use the authenticated user's ID
        const verifiedToken = req.user;
        userId = verifiedToken.userId;
    }
    const payload = req.body;
    // If a file was uploaded, add the file path to the payload
    if (req.file) {
        payload.picture = req.file.path; // Cloudinary returns the file path
    }
    const user = yield user_service_1.UserService.updateUser(userId, payload, req.user);
    (0, sendResponse_1.sendResponse)(res, {
        success: true,
        statusCode: http_status_codes_1.default.OK, // Use OK (200) instead of CREATED (201) for updates
        message: "User Updated Successfully",
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
