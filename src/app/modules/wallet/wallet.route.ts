import express from "express";
import { checkAuth } from "../../middlewares/checkAuth";
import { WalletController } from "./wallet.controller";
import { Role } from "../user/user.interface";


const router = express.Router();

router.get("/my-wallet", checkAuth(Role.USER, Role.AGENT), WalletController.getMyWallet);

router.get("/", checkAuth(Role.ADMIN, Role.SUPER_ADMIN), WalletController.getAllWallets);
router.get("/:id", checkAuth(Role.ADMIN, Role.SUPER_ADMIN), WalletController.getWalletById);
router.patch("/status/:id", checkAuth(Role.ADMIN, Role.SUPER_ADMIN), WalletController.updateWalletStatus);

export const WalletRoutes = router;