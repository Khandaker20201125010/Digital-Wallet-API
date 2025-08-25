"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.TransactionRoutes = void 0;
const express_1 = __importDefault(require("express"));
const checkAuth_1 = require("../../middlewares/checkAuth");
const user_interface_1 = require("../user/user.interface");
const transaction_controller_1 = require("./transaction.controller");
const validateRequest_1 = require("../../middlewares/validateRequest");
const transaction_validation_1 = require("./transaction.validation");
const router = express_1.default.Router();
router.post("/", (0, checkAuth_1.checkAuth)(user_interface_1.Role.USER, user_interface_1.Role.AGENT), (0, validateRequest_1.validateRequest)(transaction_validation_1.createTransactionZodSchema), transaction_controller_1.TransactionController.createTransaction);
router.get("/my-transactions", (0, checkAuth_1.checkAuth)(user_interface_1.Role.USER, user_interface_1.Role.AGENT, user_interface_1.Role.ADMIN, user_interface_1.Role.SUPER_ADMIN), transaction_controller_1.TransactionController.getMyTransactions);
router.get("/all-transactions", (0, checkAuth_1.checkAuth)(user_interface_1.Role.ADMIN, user_interface_1.Role.SUPER_ADMIN), transaction_controller_1.TransactionController.getAllTransactions);
exports.TransactionRoutes = router;
