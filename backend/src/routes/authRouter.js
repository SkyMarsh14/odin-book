import { Router } from "express";
import authController from "../controllers/authController.js";
const authRouter = Router();

authRouter.post("/create-user", authController.createUser);
authRouter.post("/login", authController.login);
authRouter.get("/guest-login", authController.guestLogin);

export default authRouter;
