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
exports.DepositRequestService = void 0;
const depositRequest_model_1 = require("./depositRequest.model");
const mongoose_1 = __importDefault(require("mongoose"));
const transaction_service_1 = require("../transaction/transaction.service");
// create request
const createRequest = (userId, amount, note) => __awaiter(void 0, void 0, void 0, function* () {
    const reqDoc = yield depositRequest_model_1.DepositRequest.create({ user: userId, amount, note });
    return reqDoc;
});
// get user requests (history)
const getRequestsByUser = (userId_1, ...args_1) => __awaiter(void 0, [userId_1, ...args_1], void 0, function* (userId, page = 1, limit = 20) {
    const query = { user: new mongoose_1.default.Types.ObjectId(userId) };
    const requests = yield depositRequest_model_1.DepositRequest.find(query)
        .sort({ createdAt: -1 })
        .skip((page - 1) * limit)
        .limit(limit);
    const total = yield depositRequest_model_1.DepositRequest.countDocuments(query);
    return { requests, total, page, limit };
});
// agent: list pending
const getPendingRequests = (...args_1) => __awaiter(void 0, [...args_1], void 0, function* (page = 1, limit = 50) {
    const query = { status: "pending" };
    const requests = yield depositRequest_model_1.DepositRequest.find(query)
        .populate("user", "name email")
        .sort({ createdAt: 1 }) // oldest first for agents
        .skip((page - 1) * limit)
        .limit(limit);
    const total = yield depositRequest_model_1.DepositRequest.countDocuments(query);
    return { requests, total, page, limit };
});
// agent approves request => create cash_in transaction
const approveRequest = (requestId, agentId) => __awaiter(void 0, void 0, void 0, function* () {
    const session = yield mongoose_1.default.startSession();
    session.startTransaction();
    try {
        const reqDoc = yield depositRequest_model_1.DepositRequest.findById(requestId).session(session);
        if (!reqDoc)
            throw new Error("Deposit request not found");
        if (reqDoc.status !== "pending")
            throw new Error("Request is not pending");
        const payload = {
            from: new mongoose_1.default.Types.ObjectId(agentId), // wrap agentId
            to: new mongoose_1.default.Types.ObjectId(reqDoc.user), // wrap userId
            type: "cash_in",
            amount: reqDoc.amount,
            initiatedBy: new mongoose_1.default.Types.ObjectId(agentId), // also wrap
            initiatedRole: "agent",
            reference: `REQ-CASHIN-${Date.now()}-${Math.floor(Math.random() * 100000)}`,
        };
        const txn = yield transaction_service_1.TransactionService.createTransaction(payload);
        reqDoc.status = "approved";
        reqDoc.agent = new mongoose_1.default.Types.ObjectId(agentId);
        reqDoc.transaction = txn._id;
        yield reqDoc.save({ session });
        yield session.commitTransaction();
        session.endSession();
        return { request: reqDoc, transaction: txn };
    }
    catch (err) {
        yield session.abortTransaction();
        session.endSession();
        throw err;
    }
});
const rejectRequest = (requestId, agentId, reason) => __awaiter(void 0, void 0, void 0, function* () {
    const reqDoc = yield depositRequest_model_1.DepositRequest.findById(requestId);
    if (!reqDoc)
        throw new Error("Deposit request not found");
    if (reqDoc.status !== "pending")
        throw new Error("Request is not pending");
    reqDoc.status = "rejected";
    reqDoc.agent = new mongoose_1.default.Types.ObjectId(agentId); // wrap as ObjectId
    if (reason)
        reqDoc.note = `${reqDoc.note}\nRejected: ${reason}`;
    yield reqDoc.save();
    return reqDoc;
});
exports.DepositRequestService = {
    createRequest,
    getRequestsByUser,
    getPendingRequests,
    approveRequest,
    rejectRequest,
};
