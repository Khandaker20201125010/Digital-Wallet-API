import { Router } from "express";
import { userController } from "./user.controller";
import { checkAuth } from "../../middlewares/checkAuth";
import { Role } from "./user.interface";
import { validateRequest } from "../../middlewares/validateRequest";
import { updateUserZodSchema } from "./user.validation";

const router = Router();

router.post("/register" , userController.createUser);
router.get("/me", checkAuth(...Object.values(Role)), userController.getMe)
router.get("/all-users", checkAuth(Role.ADMIN, Role.SUPER_ADMIN), userController.getAllUsers);
router.patch("/:id", checkAuth(...Object.values(Role)), userController.updateUser);
router.patch("/:id", validateRequest(updateUserZodSchema), checkAuth(...Object.values(Role)), userController.updateUser)

export const userRoutes = router