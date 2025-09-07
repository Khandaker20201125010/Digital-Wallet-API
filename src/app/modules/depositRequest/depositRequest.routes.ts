import express from "express";
import { checkAuth } from "../../middlewares/checkAuth";
import { Role } from "../user/user.interface";
import { DepositRequestController } from "./depositRequest.controller";

const router = express.Router();

// create by user
router.post("/", checkAuth(Role.USER, Role.AGENT), DepositRequestController.createRequest);

// user's own requests
router.get("/my", checkAuth(Role.USER, Role.AGENT), DepositRequestController.getMyRequests);

// pending list for agents
router.get("/pending", checkAuth(Role.AGENT, Role.ADMIN, Role.SUPER_ADMIN), DepositRequestController.getPending);

// agent actions
router.patch("/:id/approve", checkAuth(Role.AGENT, Role.ADMIN, Role.SUPER_ADMIN), DepositRequestController.approve);
router.patch("/:id/reject", checkAuth(Role.AGENT, Role.ADMIN, Role.SUPER_ADMIN), DepositRequestController.reject);

export const DepositRequestRoutes = router;
