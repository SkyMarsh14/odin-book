import { Router } from "express";
import userController from "../controllers/userController.js";
const userRouter = Router();
userRouter.post("/follow/:userId", userController.follow);
userRouter.get("/:userId", userController.getUserInfo);
export default userRouter;
