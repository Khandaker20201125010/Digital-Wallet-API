import express from "express";
import { checkAuth } from "../../middlewares/checkAuth";
import { Role } from "../user/user.interface";
import { TransactionController } from "./transaction.controller";
import { validateRequest } from "../../middlewares/validateRequest";
import { createTransactionZodSchema } from "./transaction.validation";
const router = express.Router();

router.post(
  "/",
  checkAuth(Role.USER, Role.AGENT),
  validateRequest(createTransactionZodSchema),
  TransactionController.createTransaction
);

router.get(
  "/my-transactions",
  checkAuth(Role.USER, Role.AGENT, Role.ADMIN, Role.SUPER_ADMIN),
  TransactionController.getMyTransactions
);

router.get(
  "/all-transactions",
  checkAuth(Role.ADMIN, Role.SUPER_ADMIN),
  TransactionController.getAllTransactions
);

export const TransactionRoutes = router;
