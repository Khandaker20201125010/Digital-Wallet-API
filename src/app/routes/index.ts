import { Router } from "express";
import { userRoutes } from "../modules/user/user.router";
import { AuthRoutes } from "../modules/auth/auth.route";
import { WalletRoutes } from "../modules/wallet/wallet.route";

export const router = Router();

const moduleRoutes = [
    {
        path:"/user",
        route: userRoutes
    },
    {
        path:"/auth",
        route: AuthRoutes
    },
    {
         path:"/wallets",
          route: WalletRoutes,
        
    }
]

moduleRoutes.forEach((route)=>{
    router.use(route.path, route.route);
})

