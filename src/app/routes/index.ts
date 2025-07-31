import { Router } from "express";
import { userRoutes } from "../modules/user/user.router";
import { AuthRoutes } from "../modules/auth/auth.route";

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
]

moduleRoutes.forEach((route)=>{
    router.use(route.path, route.route);
})

