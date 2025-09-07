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
exports.DepositRequestController = void 0;
const catchAsync_1 = require("../../utils/catchAsync");
const depositRequest_service_1 = require("./depositRequest.service");
const sendResponse_1 = require("../../utils/sendResponse");
const http_status_codes_1 = __importDefault(require("http-status-codes"));
// POST /deposit-requests  (USER)
const createRequest = (0, catchAsync_1.catchAsync)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const userId = req.user.userId;
    const { amount, note } = req.body;
    const result = yield depositRequest_service_1.DepositRequestService.createRequest(userId, amount, note);
    (0, sendResponse_1.sendResponse)(res, {
        statusCode: http_status_codes_1.default.CREATED,
        success: true,
        message: "Deposit request created",
        data: result,
    });
}));
// GET /deposit-requests/my
const getMyRequests = (0, catchAsync_1.catchAsync)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _a, _b;
    const userId = req.user.userId;
    const page = Number((_a = req.query.page) !== null && _a !== void 0 ? _a : 1);
    const limit = Number((_b = req.query.limit) !== null && _b !== void 0 ? _b : 20);
    const result = yield depositRequest_service_1.DepositRequestService.getRequestsByUser(userId, page, limit);
    (0, sendResponse_1.sendResponse)(res, {
        statusCode: http_status_codes_1.default.OK,
        success: true,
        message: "Your deposit requests",
        data: result,
    });
}));
// AGENT: GET /deposit-requests/pending
const getPending = (0, catchAsync_1.catchAsync)((_req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _a, _b;
    const page = Number((_a = _req.query.page) !== null && _a !== void 0 ? _a : 1);
    const limit = Number((_b = _req.query.limit) !== null && _b !== void 0 ? _b : 50);
    const result = yield depositRequest_service_1.DepositRequestService.getPendingRequests(page, limit);
    (0, sendResponse_1.sendResponse)(res, {
        statusCode: http_status_codes_1.default.OK,
        success: true,
        message: "Pending deposit requests",
        data: result,
    });
}));
// AGENT: PATCH /deposit-requests/:id/approve
const approve = (0, catchAsync_1.catchAsync)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const agentId = req.user.userId;
    const { id } = req.params;
    const result = yield depositRequest_service_1.DepositRequestService.approveRequest(id, agentId);
    (0, sendResponse_1.sendResponse)(res, {
        statusCode: http_status_codes_1.default.OK,
        success: true,
        message: "Deposit request approved and cash-in created",
        data: result,
    });
}));
// AGENT: PATCH /deposit-requests/:id/reject
const reject = (0, catchAsync_1.catchAsync)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const agentId = req.user.userId;
    const { id } = req.params;
    const { reason } = req.body;
    const result = yield depositRequest_service_1.DepositRequestService.rejectRequest(id, agentId, reason);
    (0, sendResponse_1.sendResponse)(res, {
        statusCode: http_status_codes_1.default.OK,
        success: true,
        message: "Deposit request rejected",
        data: result,
    });
}));
exports.DepositRequestController = {
    createRequest,
    getMyRequests,
    getPending,
    approve,
    reject,
};
