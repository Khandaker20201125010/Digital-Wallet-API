import { DepositRequest } from "./depositRequest.model";
import mongoose from "mongoose";
import { TransactionService } from "../transaction/transaction.service";

// create request
const createRequest = async (userId: string, amount: number, note?: string) => {
  const reqDoc = await DepositRequest.create({ user: userId, amount, note });
  return reqDoc;
};

// get user requests (history)
const getRequestsByUser = async (userId: string, page = 1, limit = 20) => {
  const query = { user: new mongoose.Types.ObjectId(userId) };
  const requests = await DepositRequest.find(query)
    .sort({ createdAt: -1 })
    .skip((page - 1) * limit)
    .limit(limit);
  const total = await DepositRequest.countDocuments(query);
  return { requests, total, page, limit };
};

// agent: list pending
const getPendingRequests = async (page = 1, limit = 50) => {
  const query = { status: "pending" };
  const requests = await DepositRequest.find(query)
    .populate("user", "name email")
    .sort({ createdAt: 1 }) // oldest first for agents
    .skip((page - 1) * limit)
    .limit(limit);
  const total = await DepositRequest.countDocuments(query);
  return { requests, total, page, limit };
};

// agent approves request => create cash_in transaction
const approveRequest = async (requestId: string, agentId: string) => {
  const session = await mongoose.startSession();
  session.startTransaction();

  try {
    const reqDoc = await DepositRequest.findById(requestId).session(session);
    if (!reqDoc) throw new Error("Deposit request not found");
    if (reqDoc.status !== "pending") throw new Error("Request is not pending");

    const payload = {
      from: new mongoose.Types.ObjectId(agentId),  // wrap agentId
      to: new mongoose.Types.ObjectId(reqDoc.user), // wrap userId
      type: "cash_in" as const,
      amount: reqDoc.amount,
      initiatedBy: new mongoose.Types.ObjectId(agentId), // also wrap
      initiatedRole: "agent" as const,
      reference: `REQ-CASHIN-${Date.now()}-${Math.floor(Math.random() * 100000)}`,
    };

    const txn = await TransactionService.createTransaction(payload);

    reqDoc.status = "approved";
    reqDoc.agent = new mongoose.Types.ObjectId(agentId);
    reqDoc.transaction = txn._id;
    await reqDoc.save({ session });

    await session.commitTransaction();
    session.endSession();

    return { request: reqDoc, transaction: txn };
  } catch (err) {
    await session.abortTransaction();
    session.endSession();
    throw err;
  }
};

const rejectRequest = async (
  requestId: string,
  agentId: string,
  reason?: string
) => {
  const reqDoc = await DepositRequest.findById(requestId);
  if (!reqDoc) throw new Error("Deposit request not found");
  if (reqDoc.status !== "pending") throw new Error("Request is not pending");

  reqDoc.status = "rejected";
  reqDoc.agent = new mongoose.Types.ObjectId(agentId); // wrap as ObjectId
  if (reason) reqDoc.note = `${reqDoc.note}\nRejected: ${reason}`;

  await reqDoc.save();
  return reqDoc;
};


export const DepositRequestService = {
  createRequest,
  getRequestsByUser,
  getPendingRequests,
  approveRequest,
  rejectRequest,
};
