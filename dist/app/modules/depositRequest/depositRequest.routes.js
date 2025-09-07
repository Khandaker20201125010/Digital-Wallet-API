"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.DepositRequestRoutes = void 0;
const express_1 = __importDefault(require("express"));
const checkAuth_1 = require("../../middlewares/checkAuth");
const user_interface_1 = require("../user/user.interface");
const depositRequest_controller_1 = require("./depositRequest.controller");
const router = express_1.default.Router();
// create by user
router.post("/", (0, checkAuth_1.checkAuth)(user_interface_1.Role.USER, user_interface_1.Role.AGENT), depositRequest_controller_1.DepositRequestController.createRequest);
// user's own requests
router.get("/my", (0, checkAuth_1.checkAuth)(user_interface_1.Role.USER, user_interface_1.Role.AGENT), depositRequest_controller_1.DepositRequestController.getMyRequests);
// pending list for agents
router.get("/pending", (0, checkAuth_1.checkAuth)(user_interface_1.Role.AGENT, user_interface_1.Role.ADMIN, user_interface_1.Role.SUPER_ADMIN), depositRequest_controller_1.DepositRequestController.getPending);
// agent actions
router.patch("/:id/approve", (0, checkAuth_1.checkAuth)(user_interface_1.Role.AGENT, user_interface_1.Role.ADMIN, user_interface_1.Role.SUPER_ADMIN), depositRequest_controller_1.DepositRequestController.approve);
router.patch("/:id/reject", (0, checkAuth_1.checkAuth)(user_interface_1.Role.AGENT, user_interface_1.Role.ADMIN, user_interface_1.Role.SUPER_ADMIN), depositRequest_controller_1.DepositRequestController.reject);
exports.DepositRequestRoutes = router;
