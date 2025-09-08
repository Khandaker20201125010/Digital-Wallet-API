"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.router = void 0;
const express_1 = require("express");
const user_router_1 = require("../modules/user/user.router");
const auth_route_1 = require("../modules/auth/auth.route");
const wallet_route_1 = require("../modules/wallet/wallet.route");
const transaction_route_1 = require("../modules/transaction/transaction.route");
const otp_route_1 = require("../modules/otp/otp.route");
const depositRequest_routes_1 = require("../modules/depositRequest/depositRequest.routes");
const contact_route_1 = require("../modules/Contacts/contact.route");
exports.router = (0, express_1.Router)();
const moduleRoutes = [
    {
        path: "/user",
        route: user_router_1.userRoutes,
    },
    {
        path: "/auth",
        route: auth_route_1.AuthRoutes,
    },
    {
        path: "/wallets",
        route: wallet_route_1.WalletRoutes,
    },
    {
        path: "/transactions",
        route: transaction_route_1.TransactionRoutes,
    },
    {
        path: "/otp",
        route: otp_route_1.OtpRoutes,
    },
    {
        path: "/deposit-requests",
        route: depositRequest_routes_1.DepositRequestRoutes,
    },
    { path: "/contact", route: contact_route_1.ContactRoutes },
];
moduleRoutes.forEach((route) => {
    exports.router.use(route.path, route.route);
});
