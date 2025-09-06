import { Router } from "express";
import { userController } from "./user.controller";
import { checkAuth } from "../../middlewares/checkAuth";
import { Role } from "./user.interface";
import { validateRequest } from "../../middlewares/validateRequest";
import { updateUserZodSchema } from "./user.validation";
import { multerUpload } from "../../config/multer.config";

const router = Router();

router.post("/register", userController.createUser);

router.get("/me", checkAuth(...Object.values(Role)), userController.getMe);

router.patch(
  "/me",
  checkAuth(...Object.values(Role)),
  multerUpload.single("picture"),
  userController.updateUser
);

router.get(
  "/all-users",
  checkAuth(Role.ADMIN, Role.SUPER_ADMIN),
  userController.getAllUsers
);

router.patch(
  "/:id",
  checkAuth(...Object.values(Role)),
  multerUpload.single("picture"),
  validateRequest(updateUserZodSchema),
  userController.updateUser
);
router.get("/search", checkAuth(Role.USER, Role.AGENT, Role.ADMIN, Role.SUPER_ADMIN), userController.searchUsersByEmail);

export const userRoutes = router;
