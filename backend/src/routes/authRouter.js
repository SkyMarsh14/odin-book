import { Router } from "express";
import authController from "../controllers/authController";
const authRouter = Router();

authRouter.post("/create", authController.createUser());

export default authRouter;
