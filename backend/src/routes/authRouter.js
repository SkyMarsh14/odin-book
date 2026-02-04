import { Router } from "express";
import authController from "../controllers/authController.js";
import imgUpload from "../middleware/imgUpload.js";
const authRouter = Router();

authRouter.post(
  "/create-user",
  imgUpload.single("image"),
  authController.createUser,
);
authRouter.post("/login", authController.login);
authRouter.get("/guest-login", authController.guestLogin);
authRouter.get("/github/access-token", authController.githubLogin);

export default authRouter;
