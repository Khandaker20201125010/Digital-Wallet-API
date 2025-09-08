import { Router } from "express";
import { userRoutes } from "../modules/user/user.router";
import { AuthRoutes } from "../modules/auth/auth.route";
import { WalletRoutes } from "../modules/wallet/wallet.route";
import { TransactionRoutes } from "../modules/transaction/transaction.route";
import { OtpRoutes } from "../modules/otp/otp.route";
import { DepositRequestRoutes } from "../modules/depositRequest/depositRequest.routes";
import { ContactRoutes } from "../modules/Contacts/contact.route";

export const router = Router();

const moduleRoutes = [
  {
    path: "/user",
    route: userRoutes,
  },
  {
    path: "/auth",
    route: AuthRoutes,
  },
  {
    path: "/wallets",
    route: WalletRoutes,
  },
  {
    path: "/transactions",
    route: TransactionRoutes,
  },
  {
    path: "/otp",
    route: OtpRoutes,
  },
  {
    path: "/deposit-requests",
    route: DepositRequestRoutes,
  },
  { path: "/contact", route: ContactRoutes },
];

moduleRoutes.forEach((route) => {
  router.use(route.path, route.route);
});
